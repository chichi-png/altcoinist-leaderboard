#!/usr/bin/env python3
"""
Generate complete leaderboard-data.json with ALL 43 affiliates
Ensures proper sequential ranking (1-43) even for affiliates with 0 scores
"""

import json
import re

# Load Notion affiliates list (all 43 activated affiliates)
with open('notion-affiliates-list.json', 'r', encoding='utf-8') as f:
    notion_affiliates = json.load(f)

# Load affiliate bios
with open('affiliate-bios.json', 'r', encoding='utf-8') as f:
    bios = json.load(f)

# Parse scores from output file
with open('leaderboard-data-output.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract weekly data
weekly_match = re.search(r'// WEEKLY DATA.*?\n(\[[\s\S]*?\n\])', content)
weekly_raw = json.loads(weekly_match.group(1)) if weekly_match else []

# Extract monthly data
monthly_match = re.search(r'// MONTHLY DATA.*?\n(\[[\s\S]*?\n\])', content)
monthly_raw = json.loads(monthly_match.group(1)) if monthly_match else []

# Helper to normalize handle
def normalize_handle(handle):
    """Remove @ symbol and convert to lowercase"""
    return handle.replace('@', '').strip().lower()

# Helper to find bio by various methods
def find_bio(affiliate_name, x_link='', tg_handle=''):
    # Try exact match by name
    for handle, bio_data in bios.items():
        if bio_data['name'].lower() == affiliate_name.lower():
            return handle, bio_data

    # Try X link match
    if x_link:
        for handle, bio_data in bios.items():
            if bio_data.get('x_url', '').lower() == x_link.lower():
                return handle, bio_data

    # Try TG handle match
    if tg_handle:
        norm_tg = normalize_handle(tg_handle)
        for handle, bio_data in bios.items():
            bio_tg = normalize_handle(bio_data.get('tg_handle', ''))
            if bio_tg and bio_tg == norm_tg:
                return handle, bio_data

    # Try fuzzy name match
    for handle, bio_data in bios.items():
        if affiliate_name.lower() in bio_data['name'].lower() or bio_data['name'].lower() in affiliate_name.lower():
            return handle, bio_data

    return None, None

# Helper to find score data
def find_score(scores_list, affiliate_name):
    """Find score entry for an affiliate"""
    for entry in scores_list:
        if entry['affiliate'].lower() == affiliate_name.lower():
            return entry
    return None

# Build complete affiliate lists
def build_complete_list(scores_raw, period_name):
    """Build complete affiliate list with all 43 affiliates, properly ranked"""
    affiliates = []

    for notion_aff in notion_affiliates:
        name = notion_aff['name']
        x_link = notion_aff['x_link']
        tg_handle_notion = notion_aff['tg_handle']

        # Find bio data
        handle, bio = find_bio(name, x_link, tg_handle_notion)

        # Use bio data if found, otherwise use Notion data
        if bio:
            twitter_username = handle.replace('@', '')
            x_url = bio.get('x_url', x_link or '')
            tg_handle_final = bio.get('tg_handle', tg_handle_notion or '')
        else:
            # Extract twitter username from x_link
            twitter_username = ''
            if x_link and 'x.com/' in x_link:
                twitter_username = x_link.split('x.com/')[-1].strip('/')
            elif x_link and 'twitter.com/' in x_link:
                twitter_username = x_link.split('twitter.com/')[-1].strip('/')

            handle = f"@{twitter_username}" if twitter_username else f"@{name.lower().replace(' ', '')}"
            x_url = x_link or ''
            tg_handle_final = tg_handle_notion or ''

        # Find score data
        score_entry = find_score(scores_raw, name)
        if not score_entry:
            # Try alternate lookups
            score_entry = find_score(scores_raw, twitter_username)
        if not score_entry and tg_handle_notion:
            score_entry = find_score(scores_raw, tg_handle_notion.replace('@', ''))

        # Get scores (default to 0 if not found)
        tweet_score = score_entry.get('tweetScore', 0) if score_entry else 0
        bot_activity_score = score_entry.get('botActivityScore', 0) if score_entry else 0
        total = score_entry.get('total', 0) if score_entry else 0

        # Avatar - use multiple sources for better reliability
        if twitter_username:
            # Try Twitter's CDN first, then unavatar as fallback
            avatar = f"https://unavatar.io/twitter/{twitter_username}?fallback=https://ui-avatars.com/api/?name={twitter_username}&background=0D0D0D&color=38FF93&size=400&bold=true"
        else:
            avatar = f"https://ui-avatars.com/api/?name={name.replace(' ', '+')}&background=0D0D0D&color=38FF93&size=400&bold=true"

        # Use Twitter username as display name (matches avatar), fallback to original name
        display_name = f"@{twitter_username}" if twitter_username else name

        affiliates.append({
            'name': display_name,
            'handle': handle,
            'avatar': avatar,
            'tweetScore': tweet_score,
            'botActivityScore': bot_activity_score,
            'total': total,
            'profileUrl': x_url,
            'xUrl': x_url,
            'tgHandle': tg_handle_final
        })

    # Sort by total score (descending)
    affiliates.sort(key=lambda x: x['total'], reverse=True)

    # Assign proper sequential ranks
    for i, aff in enumerate(affiliates, start=1):
        aff['rank'] = i

    print(f"  {period_name}: {len(affiliates)} affiliates (rank 1-{len(affiliates)})")
    return affiliates

# Build all three lists
print("Building complete leaderboard data...")
affiliates = build_complete_list(monthly_raw, "All-Time")  # Use monthly as proxy for all-time
weekly = build_complete_list(weekly_raw, "Weekly")
monthly = build_complete_list(monthly_raw, "Monthly")

# Create final JSON
output = {
    'affiliates': affiliates,
    'weekly': weekly,
    'monthly': monthly
}

# Write to file
with open('leaderboard-data.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"\n✅ Generated leaderboard-data.json")
print(f"   - {len(affiliates)} affiliates (all-time)")
print(f"   - {len(weekly)} weekly rankings")
print(f"   - {len(monthly)} monthly rankings")
print(f"   - All affiliates ranked 1-{len(affiliates)}")
