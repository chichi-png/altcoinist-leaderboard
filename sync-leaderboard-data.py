"""
Sync Leaderboard Data from Notion

Fetches current week/month scores from Tweet Scores and Bot Activity Scores databases
and automatically updates the leaderboard HTML with real data.
"""

import os
import json
import re
from datetime import datetime
from typing import Dict, List, Tuple
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

NOTION_API_KEY = os.getenv('NOTION_API_KEY')
if not NOTION_API_KEY:
    print("[ERROR] NOTION_API_KEY not found in .env file!")
    print("Please add NOTION_API_KEY=your_key_here to .env")
    exit(1)

NOTION_VERSION = '2022-06-28'

# Database IDs from database-ids.md
TWEET_SCORES_DB_ID = 'd79c32af-6c7c-45e4-ab6f-c56ae19b2f5c'
BOT_ACTIVITY_DB_ID = '85a480fd-3098-45fc-aeb2-829980c383d6'

HEADERS = {
    'Authorization': f'Bearer {NOTION_API_KEY}',
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json'
}

def query_data_source(data_source_id: str, filter_obj: dict) -> List[dict]:
    """Query a Notion data source with filter."""
    url = f'https://api.notion.com/v1/databases/{data_source_id}/query'

    all_results = []
    has_more = True
    start_cursor = None

    while has_more:
        payload = {
            'filter': filter_obj,
            'page_size': 100
        }
        if start_cursor:
            payload['start_cursor'] = start_cursor

        response = requests.post(url, headers=HEADERS, json=payload)
        response.raise_for_status()
        data = response.json()

        all_results.extend(data['results'])
        has_more = data['has_more']
        start_cursor = data.get('next_cursor')

    return all_results

def get_text_property(props: dict, prop_name: str) -> str:
    """Extract text from Notion property."""
    prop = props.get(prop_name, {})
    if prop['type'] == 'title':
        if prop['title']:
            return prop['title'][0]['plain_text']
    elif prop['type'] == 'rich_text':
        if prop['rich_text']:
            return prop['rich_text'][0]['plain_text']
    return ''

def get_number_property(props: dict, prop_name: str) -> float:
    """Extract number from Notion property."""
    prop = props.get(prop_name, {})
    if prop['type'] == 'number':
        return prop['number'] or 0
    return 0

print("="*80)
print("  SYNC LEADERBOARD DATA FROM NOTION")
print("="*80)

print("\n[1/6] Querying Notion databases...")

# Query Tweet Scores - Weekly (most recent week)
weekly_tweet_filter = {
    'and': [
        {'property': 'Period Type', 'select': {'equals': 'Weekly'}},
        {'property': 'Week Date Range', 'rich_text': {'contains': 'Mar 23-29'}}
    ]
}
weekly_tweets = query_data_source(TWEET_SCORES_DB_ID, weekly_tweet_filter)
print(f"   [OK] Found {len(weekly_tweets)} weekly tweet scores")

# Query Tweet Scores - Monthly (March 2026)
monthly_tweet_filter = {
    'and': [
        {'property': 'Period Type', 'select': {'equals': 'Monthly'}},
        {'property': 'Start Date', 'date': {'equals': '2026-03-01'}}
    ]
}
monthly_tweets = query_data_source(TWEET_SCORES_DB_ID, monthly_tweet_filter)
print(f"   [OK] Found {len(monthly_tweets)} monthly tweet scores")

# Query Bot Activity - Weekly (by Start Date since Week Date Range is often empty)
weekly_bot_filter = {
    'and': [
        {'property': 'Period Type', 'select': {'equals': 'Weekly'}},
        {'property': 'Start Date', 'date': {'equals': '2026-03-23'}}
    ]
}
weekly_bots = query_data_source(BOT_ACTIVITY_DB_ID, weekly_bot_filter)
print(f"   [OK] Found {len(weekly_bots)} weekly bot activity scores")

# Query Bot Activity - Monthly (March 2026)
monthly_bot_filter = {
    'and': [
        {'property': 'Period Type', 'select': {'equals': 'Monthly'}},
        {'property': 'Start Date', 'date': {'equals': '2026-03-01'}}
    ]
}
monthly_bots = query_data_source(BOT_ACTIVITY_DB_ID, monthly_bot_filter)
print(f"   [OK] Found {len(monthly_bots)} monthly bot activity scores")

# Aggregate scores
def aggregate_scores(tweet_data: List[dict], bot_data: List[dict]) -> Dict[str, dict]:
    """Combine tweet and bot scores by affiliate handle."""
    scores = {}

    # Add tweet scores
    for page in tweet_data:
        props = page['properties']
        affiliate = get_text_property(props, 'Affiliate')
        tweet_score = get_number_property(props, 'Score')

        if affiliate:
            # Normalize handle (remove @ if present, lowercase for matching)
            handle = affiliate.strip()
            if not handle.startswith('@'):
                handle = '@' + handle
            handle_key = handle.lower()

            scores[handle_key] = {
                'handle': handle,
                'tweetScore': round(tweet_score, 2),
                'botActivityScore': 0,
                'total': round(tweet_score, 2)
            }

    # Add bot activity scores
    for page in bot_data:
        props = page['properties']
        affiliate = get_text_property(props, 'Affiliate')
        bot_score = get_number_property(props, 'bot activity score')

        if affiliate:
            # Bot activity uses TG handle without @, try both formats to match
            handle_with_at = '@' + affiliate.strip() if not affiliate.startswith('@') else affiliate.strip()
            handle_without_at = affiliate.strip().lstrip('@')

            # Try to find matching entry
            matched = False
            for key in [handle_with_at.lower(), handle_without_at.lower(), ('@' + handle_without_at).lower()]:
                if key in scores:
                    scores[key]['botActivityScore'] = round(bot_score, 2)
                    scores[key]['total'] = round(scores[key]['tweetScore'] + bot_score, 2)
                    matched = True
                    break

            if not matched:
                # Create new entry
                scores[handle_with_at.lower()] = {
                    'handle': handle_with_at,
                    'tweetScore': 0,
                    'botActivityScore': round(bot_score, 2),
                    'total': round(bot_score, 2)
                }

    return scores

def parse_existing_affiliates(html_content: str, data_var_name: str) -> List[dict]:
    """Parse existing affiliate data from HTML."""
    pattern = rf'{data_var_name}\s*=\s*\[(.*?)\];'
    match = re.search(pattern, html_content, re.DOTALL)

    if not match:
        print(f"[WARN] Could not find {data_var_name} in HTML")
        return []

    data_str = match.group(1)

    # Extract individual affiliate objects
    affiliates = []
    obj_pattern = r'\{[^}]+\}'
    for obj_match in re.finditer(obj_pattern, data_str):
        obj_str = obj_match.group(0)

        # Parse key fields
        affiliate = {}

        # Extract each field
        for field in ['rank', 'name', 'handle', 'avatar', 'tweetScore', 'botActivityScore', 'total', 'imgSrc', 'profileUrl', 'tgHandle']:
            field_pattern = rf"{field}:\s*([^,}}]+)"
            field_match = re.search(field_pattern, obj_str)
            if field_match:
                value = field_match.group(1).strip()
                # Remove quotes for strings
                if value.startswith("'") or value.startswith('"'):
                    value = value[1:-1]
                # Convert numbers
                if field in ['rank', 'tweetScore', 'botActivityScore', 'total']:
                    try:
                        value = int(value) if field == 'rank' else float(value)
                    except:
                        value = 0
                affiliate[field] = value

        if affiliate:
            affiliates.append(affiliate)

    return affiliates

def update_affiliate_scores(affiliates: List[dict], scores: Dict[str, dict]) -> Tuple[List[dict], int]:
    """Update affiliate scores from Notion data."""
    updated_count = 0

    for aff in affiliates:
        handle = aff.get('handle', '').lower()

        # Try to find matching score
        if handle in scores:
            score_data = scores[handle]
            aff['tweetScore'] = score_data['tweetScore']
            aff['botActivityScore'] = score_data['botActivityScore']
            aff['total'] = score_data['total']
            updated_count += 1

    # Sort by total score and reassign ranks
    affiliates.sort(key=lambda x: x.get('total', 0), reverse=True)
    for i, aff in enumerate(affiliates, 1):
        aff['rank'] = i

    return affiliates, updated_count

def format_affiliate_object(aff: dict) -> str:
    """Format affiliate dict as JavaScript object string."""
    return (
        f"{{rank: {aff['rank']}, "
        f"name: '{aff.get('name', '')}', "
        f"handle: '{aff.get('handle', '')}', "
        f"avatar: '{aff.get('avatar', '')}', "
        f"tweetScore: {aff.get('tweetScore', 0)}, "
        f"botActivityScore: {aff.get('botActivityScore', 0)}, "
        f"total: {aff.get('total', 0)}, "
        f"imgSrc: '{aff.get('imgSrc', '')}', "
        f"profileUrl: '{aff.get('profileUrl', '')}', "
        f"tgHandle: '{aff.get('tgHandle', '')}'}}"
    )

print("\n[2/6] Aggregating scores by affiliate...")
weekly_scores = aggregate_scores(weekly_tweets, weekly_bots)
monthly_scores = aggregate_scores(monthly_tweets, monthly_bots)
print(f"   [OK] Weekly: {len(weekly_scores)} affiliates with scores")
print(f"   [OK] Monthly: {len(monthly_scores)} affiliates with scores")

# Read leaderboard.html
print("\n[3/6] Reading leaderboard.html...")
html_path = 'leaderboard.html'
try:
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    print(f"   [OK] Loaded {len(html_content)} characters")
except FileNotFoundError:
    print(f"   [ERROR] Could not find {html_path}")
    print("   Make sure you're running this script from the affiliate-leaderboard/ directory")
    exit(1)

# Parse existing data
print("\n[4/6] Parsing existing affiliate data...")
weekly_affiliates = parse_existing_affiliates(html_content, 'window.DEMO_WEEKLY_DATA')
monthly_affiliates = parse_existing_affiliates(html_content, 'window.DEMO_MONTHLY_DATA')
print(f"   [OK] Found {len(weekly_affiliates)} weekly affiliates")
print(f"   [OK] Found {len(monthly_affiliates)} monthly affiliates")

# Update scores
print("\n[5/6] Updating scores with Notion data...")
weekly_affiliates, weekly_updated = update_affiliate_scores(weekly_affiliates, weekly_scores)
monthly_affiliates, monthly_updated = update_affiliate_scores(monthly_affiliates, monthly_scores)
print(f"   [OK] Updated {weekly_updated}/{len(weekly_affiliates)} weekly affiliates")
print(f"   [OK] Updated {monthly_updated}/{len(monthly_affiliates)} monthly affiliates")

# Format as JavaScript arrays
weekly_data_str = 'window.DEMO_WEEKLY_DATA = [\n    ' + ',\n    '.join(
    format_affiliate_object(aff) for aff in weekly_affiliates
) + '\n];'

monthly_data_str = 'window.DEMO_MONTHLY_DATA = [\n    ' + ',\n    '.join(
    format_affiliate_object(aff) for aff in monthly_affiliates
) + '\n];'

# Replace in HTML
print("\n[6/6] Updating leaderboard.html...")

# Replace weekly data
html_content = re.sub(
    r'window\.DEMO_WEEKLY_DATA\s*=\s*\[.*?\];',
    weekly_data_str,
    html_content,
    flags=re.DOTALL
)

# Replace monthly data
html_content = re.sub(
    r'window\.DEMO_MONTHLY_DATA\s*=\s*\[.*?\];',
    monthly_data_str,
    html_content,
    flags=re.DOTALL
)

# Write back
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"   [OK] Successfully updated {html_path}")

# Show top 5 for verification
print("\n" + "="*80)
print("  TOP 5 WEEKLY (Mar 23-29, Week 13)")
print("="*80)
for aff in weekly_affiliates[:5]:
    print(f"  {aff['rank']}. {aff['name']} ({aff['handle']})")
    print(f"     Tweet: {aff['tweetScore']} | Bot: {aff['botActivityScore']} | Total: {aff['total']}")

print("\n" + "="*80)
print("  TOP 5 MONTHLY (March 2026)")
print("="*80)
for aff in monthly_affiliates[:5]:
    print(f"  {aff['rank']}. {aff['name']} ({aff['handle']})")
    print(f"     Tweet: {aff['tweetScore']} | Bot: {aff['botActivityScore']} | Total: {aff['total']}")

print("\n" + "="*80)
print("  SYNC COMPLETE!")
print("="*80)
print("\nRefresh your browser to see the updated scores.")
