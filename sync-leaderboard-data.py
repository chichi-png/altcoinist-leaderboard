"""
Sync Leaderboard Data from Notion

Fetches current week/month scores from Tweet Scores and Bot Activity Scores databases
and updates the leaderboard HTML with real data.
"""

import os
import json
import re
from datetime import datetime
from typing import Dict, List
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

NOTION_API_KEY = os.getenv('NOTION_API_KEY')
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

print("[-] Querying Notion databases...")

# Query Tweet Scores - Weekly (most recent week)
weekly_tweet_filter = {
    'and': [
        {'property': 'Period Type', 'select': {'equals': 'Weekly'}},
        {'property': 'Week Date Range', 'rich_text': {'equals': 'Mar 23-29'}}
    ]
}
weekly_tweets = query_data_source(TWEET_SCORES_DB_ID, weekly_tweet_filter)
print(f"[OK] Found {len(weekly_tweets)} weekly tweet scores")

# Query Tweet Scores - Monthly (March 2026)
monthly_tweet_filter = {
    'and': [
        {'property': 'Period Type', 'select': {'equals': 'Monthly'}},
        {'property': 'Start Date', 'date': {'equals': '2026-03-01'}}
    ]
}
monthly_tweets = query_data_source(TWEET_SCORES_DB_ID, monthly_tweet_filter)
print(f"[OK] Found {len(monthly_tweets)} monthly tweet scores")

# Query Bot Activity - Weekly (by Start Date since Week Date Range is often empty)
weekly_bot_filter = {
    'and': [
        {'property': 'Period Type', 'select': {'equals': 'Weekly'}},
        {'property': 'Start Date', 'date': {'equals': '2026-03-23'}}
    ]
}
weekly_bots = query_data_source(BOT_ACTIVITY_DB_ID, weekly_bot_filter)
print(f"[OK] Found {len(weekly_bots)} weekly bot activity scores")

# Query Bot Activity - Monthly (March 2026)
monthly_bot_filter = {
    'and': [
        {'property': 'Period Type', 'select': {'equals': 'Monthly'}},
        {'property': 'Start Date', 'date': {'equals': '2026-03-01'}}
    ]
}
monthly_bots = query_data_source(BOT_ACTIVITY_DB_ID, monthly_bot_filter)
print(f"[OK] Found {len(monthly_bots)} monthly bot activity scores")

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
            scores[affiliate] = {
                'affiliate': affiliate,
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
            if affiliate in scores:
                scores[affiliate]['botActivityScore'] = round(bot_score, 2)
                scores[affiliate]['total'] = round(scores[affiliate]['tweetScore'] + bot_score, 2)
            else:
                scores[affiliate] = {
                    'affiliate': affiliate,
                    'tweetScore': 0,
                    'botActivityScore': round(bot_score, 2),
                    'total': round(bot_score, 2)
                }

    return scores

weekly_scores = aggregate_scores(weekly_tweets, weekly_bots)
monthly_scores = aggregate_scores(monthly_tweets, monthly_bots)

print(f"\n[Stats] Aggregated scores:")
print(f"  Weekly: {len(weekly_scores)} affiliates")
print(f"  Monthly: {len(monthly_scores)} affiliates")

# Sort by total score
weekly_ranked = sorted(weekly_scores.values(), key=lambda x: x['total'], reverse=True)
monthly_ranked = sorted(monthly_scores.values(), key=lambda x: x['total'], reverse=True)

# Assign ranks
for i, affiliate in enumerate(weekly_ranked, 1):
    affiliate['rank'] = i

for i, affiliate in enumerate(monthly_ranked, 1):
    affiliate['rank'] = i

print(f"\n[Top 5] Top 5 Weekly:")
for aff in weekly_ranked[:5]:
    print(f"  {aff['rank']}. {aff['affiliate']}: Tweet={aff['tweetScore']}, Bot={aff['botActivityScore']}, Total={aff['total']}")

print(f"\n[Top 5] Top 5 Monthly:")
for aff in monthly_ranked[:5]:
    print(f"  {aff['rank']}. {aff['affiliate']}: Tweet={aff['tweetScore']}, Bot={aff['botActivityScore']}, Total={aff['total']}")

# Map affiliate names to handles and metadata
# This mapping should match the existing data structure in leaderboard.html
# For now, output the raw data - user can manually update or enhance this script

print("\n" + "="*80)
print("[Output] Data ready! Copy the arrays below and update leaderboard.html manually")
print("="*80)
print("\n// WEEKLY DATA (Mar 23-29, Week 13):")
print(json.dumps(weekly_ranked, indent=2))
print("\n// MONTHLY DATA (March 2026):")
print(json.dumps(monthly_ranked, indent=2))
