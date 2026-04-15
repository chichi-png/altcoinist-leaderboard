#!/usr/bin/env python3
"""
Generate leaderboard-data.json from affiliate-bios.json and leaderboard-data-output.json
"""

import json
import re

# Load affiliate bios
with open('affiliate-bios.json', 'r', encoding='utf-8') as f:
    bios = json.load(f)

# Parse scores from output file (skip log lines, get JSON arrays)
with open('leaderboard-data-output.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract weekly data
weekly_match = re.search(r'// WEEKLY DATA.*?\n(\[[\s\S]*?\n\])', content)
weekly_raw = json.loads(weekly_match.group(1)) if weekly_match else []

# Extract monthly data
monthly_match = re.search(r'// MONTHLY DATA.*?\n(\[[\s\S]*?\n\])', content)
monthly_raw = json.loads(monthly_match.group(1)) if monthly_match else []

# Helper to find bio by affiliate name/handle
def find_bio(affiliate_name):
    # Try exact match first
    for handle, bio_data in bios.items():
        if bio_data['name'].lower() == affiliate_name.lower():
            return handle, bio_data
        if handle.replace('@', '').lower() == affiliate_name.lower():
            return handle, bio_data
    # Try fuzzy match
    for handle, bio_data in bios.items():
        if affiliate_name.lower() in bio_data['name'].lower():
            return handle, bio_data
        if bio_data.get('tg_handle', '').replace('@', '').lower() == affiliate_name.lower():
            return handle, bio_data
    return None, None

# Build affiliate directory with all-time scores (use monthly as proxy for all-time)
affiliates = []
seen = set()

for entry in monthly_raw:
    handle, bio = find_bio(entry['affiliate'])
    if not bio or handle in seen:
        continue

    seen.add(handle)

    # Get avatar from Twitter
    twitter_username = handle.replace('@', '')
    avatar = f"https://unavatar.io/twitter/{twitter_username}"

    affiliates.append({
        'rank': entry['rank'],
        'name': bio['name'],
        'handle': handle,
        'avatar': avatar,
        'tweetScore': entry.get('tweetScore', 0),
        'botActivityScore': entry.get('botActivityScore', 0),
        'total': entry.get('total', 0),
        'profileUrl': bio.get('x_url', ''),
        'xUrl': bio.get('x_url', ''),
        'tgHandle': bio.get('tg_handle', '')
    })

# Build weekly data
weekly = []
for entry in weekly_raw:
    handle, bio = find_bio(entry['affiliate'])
    if not bio:
        continue

    twitter_username = handle.replace('@', '')
    avatar = f"https://unavatar.io/twitter/{twitter_username}"

    weekly.append({
        'rank': entry['rank'],
        'name': bio['name'],
        'handle': handle,
        'avatar': avatar,
        'tweetScore': entry.get('tweetScore', 0),
        'botActivityScore': entry.get('botActivityScore', 0),
        'total': entry.get('total', 0),
        'profileUrl': bio.get('x_url', ''),
        'xUrl': bio.get('x_url', ''),
        'tgHandle': bio.get('tg_handle', '')
    })

# Build monthly data
monthly = []
for entry in monthly_raw:
    handle, bio = find_bio(entry['affiliate'])
    if not bio:
        continue

    twitter_username = handle.replace('@', '')
    avatar = f"https://unavatar.io/twitter/{twitter_username}"

    monthly.append({
        'rank': entry['rank'],
        'name': bio['name'],
        'handle': handle,
        'avatar': avatar,
        'tweetScore': entry.get('tweetScore', 0),
        'botActivityScore': entry.get('botActivityScore', 0),
        'total': entry.get('total', 0),
        'profileUrl': bio.get('x_url', ''),
        'xUrl': bio.get('x_url', ''),
        'tgHandle': bio.get('tg_handle', '')
    })

# Create final JSON
output = {
    'affiliates': affiliates,
    'weekly': weekly,
    'monthly': monthly
}

# Write to file
with open('leaderboard-data.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"✅ Generated leaderboard-data.json")
print(f"   - {len(affiliates)} affiliates (all-time)")
print(f"   - {len(weekly)} weekly rankings")
print(f"   - {len(monthly)} monthly rankings")
