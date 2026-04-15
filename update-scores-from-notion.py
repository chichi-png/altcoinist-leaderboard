#!/usr/bin/env python3
"""
Update leaderboard scores from Notion databases
Uses the leaderboard-sync tool to query Notion and outputs to JSON
"""

import json
import sys
import os
from pathlib import Path

# Add leaderboard-sync to path
sync_path = Path(__file__).parent.parent / 'leaderboard-sync'
sys.path.insert(0, str(sync_path / 'src'))

from data_sources.notion_client import NotionClient
from config import Config
from constants import TWEET_SCORES_DB_ID, BOT_ACTIVITY_DB_ID

# Initialize
config = Config()
notion_client = NotionClient(config.notion_api_key)

print("Querying Notion databases...")

# Query scores
tweet_entries = notion_client.query_tweet_scores()
bot_entries = notion_client.query_bot_activity_scores()

print(f"Retrieved {len(tweet_entries)} tweet scores")
print(f"Retrieved {len(bot_entries)} bot activity scores")

# Load affiliates list
with open('notion-affiliates-list.json', 'r', encoding='utf-8') as f:
    notion_affiliates = json.load(f)

# Load bios
with open('affiliate-bios.json', 'r', encoding='utf-8') as f:
    bios = json.load(f)

# Helper functions
def normalize_handle(handle):
    return handle.replace('@', '').strip().lower()

def find_affiliate_scores(affiliate_name, tg_handle, scores_dict):
    """Find scores for an affiliate by various lookup methods"""
    # Try direct name match
    norm_name = normalize_handle(affiliate_name)
    if norm_name in scores_dict:
        return scores_dict[norm_name]

    # Try TG handle match
    if tg_handle:
        norm_tg = normalize_handle(tg_handle)
        if norm_tg in scores_dict:
            return scores_dict[norm_tg]

    # Try partial name match
    for key in scores_dict.keys():
        if norm_name in key or key in norm_name:
            return scores_dict[key]

    return {'tweet': 0, 'bot': 0}

# Aggregate scores by period
from collections import defaultdict

weekly_scores = defaultdict(lambda: {'tweet': 0, 'bot': 0})
monthly_scores = defaultdict(lambda: {'tweet': 0, 'bot': 0})

# Process tweet scores
for entry in tweet_entries:
    affiliate = normalize_handle(entry.get('affiliate', ''))
    period_type = entry.get('period_type', '')
    score = float(entry.get('score', 0))

    if period_type == 'Weekly':
        weekly_scores[affiliate]['tweet'] += score
    elif period_type == 'Monthly':
        monthly_scores[affiliate]['tweet'] += score

# Process bot activity scores
for entry in bot_entries:
    affiliate = normalize_handle(entry.get('affiliate', ''))
    period_type = entry.get('period_type', '')
    score = float(entry.get('score', 0))

    if period_type == 'Weekly':
        weekly_scores[affiliate]['bot'] += score
    elif period_type == 'Monthly':
        monthly_scores[affiliate]['bot'] += score

print(f"\nAggregated weekly scores for {len(weekly_scores)} affiliates")
print(f"Aggregated monthly scores for {len(monthly_scores)} affiliates")

# Build complete affiliate lists
def build_affiliate_list(scores_dict, period_name):
    affiliates = []

    for notion_aff in notion_affiliates:
        name = notion_aff['name']
        x_link = notion_aff['x_link']
        tg_handle = notion_aff['tg_handle']

        # Find bio
        handle = None
        bio = None
        for h, b in bios.items():
            if b['name'].lower() == name.lower():
                handle = h
                bio = b
                break

        # Use bio or notion data
        if bio:
            twitter_username = handle.replace('@', '')
            x_url = bio.get('x_url', x_link)
            tg_handle_final = bio.get('tg_handle', tg_handle)
        else:
            twitter_username = x_link.split('/')[-1] if x_link and '/' in x_link else name.lower().replace(' ', '')
            handle = f"@{twitter_username}"
            x_url = x_link
            tg_handle_final = tg_handle

        # Find scores
        scores = find_affiliate_scores(name, tg_handle, scores_dict)
        tweet_score = round(scores['tweet'], 2)
        bot_score = round(scores['bot'], 2)
        total = round(tweet_score + bot_score, 2)

        # Avatar
        avatar = f"https://unavatar.io/twitter/{twitter_username}" if twitter_username else f"https://ui-avatars.com/api/?name={name.replace(' ', '+')}"

        affiliates.append({
            'name': name,
            'handle': handle,
            'avatar': avatar,
            'tweetScore': tweet_score,
            'botActivityScore': bot_score,
            'total': total,
            'profileUrl': x_url,
            'xUrl': x_url,
            'tgHandle': tg_handle_final
        })

    # Sort by total score
    affiliates.sort(key=lambda x: x['total'], reverse=True)

    # Assign ranks
    for i, aff in enumerate(affiliates, 1):
        aff['rank'] = i

    print(f"{period_name}: {len(affiliates)} affiliates (rank 1-{len(affiliates)})")
    return affiliates

# Build lists
print("\nBuilding affiliate lists...")
weekly = build_affiliate_list(weekly_scores, "Weekly")
monthly = build_affiliate_list(monthly_scores, "Monthly")
alltime = monthly  # Use monthly as proxy for all-time

# Create output
output = {
    'affiliates': alltime,
    'weekly': weekly,
    'monthly': monthly
}

# Write JSON
with open('leaderboard-data.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

# Update embedded data
embedded_js = f"window.LEADERBOARD_DATA = {json.dumps(output, ensure_ascii=False, indent=2)};"
with open('embedded-data.js', 'w', encoding='utf-8') as f:
    f.write(embedded_js)

print(f"\nUpdated leaderboard-data.json and embedded-data.js")
print(f"  All-Time: {len(alltime)} affiliates")
print(f"  Weekly: {len(weekly)} affiliates")
print(f"  Monthly: {len(monthly)} affiliates")
