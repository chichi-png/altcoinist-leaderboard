"""
Fetch affiliate bios from X (Twitter) profiles
Uses Playwright to scrape bio text from each affiliate's X profile
"""
import csv
import json
import time
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

def read_csv_affiliates(csv_path):
    """Read affiliates from CSV and extract X profile URLs"""
    affiliates = []

    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row_num, row in enumerate(reader, start=2):  # Start at 2 (header is row 1)
            try:
                # Get column names (may have trailing spaces)
                x_link_keys = [k for k in row.keys() if 'X Profile Link' in k]
                if not x_link_keys:
                    print(f"[WARN] Row {row_num}: No 'X Profile Link' column found, skipping")
                    continue

                x_link_key = x_link_keys[0]
                x_url = row[x_link_key].strip()

                # Skip if no X profile
                if x_url == 'N/A' or not x_url:
                    continue

                tg_name_keys = [k for k in row.keys() if 'TG Name' in k and 'Handle' not in k]
                x_username_keys = [k for k in row.keys() if 'Twitter Username' in k]
                tg_handle_keys = [k for k in row.keys() if 'TG Handle' in k]

                if not (tg_name_keys and x_username_keys and tg_handle_keys):
                    print(f"[WARN] Row {row_num}: Missing required columns, skipping")
                    continue

                affiliates.append({
                    'name': row[tg_name_keys[0]].strip(),
                    'x_handle': row[x_username_keys[0]].strip(),
                    'x_url': x_url,
                    'tg_handle': row[tg_handle_keys[0]].strip()
                })
            except Exception as e:
                print(f"[ERROR] Row {row_num}: {e}, skipping")

    return affiliates

def fetch_bio_from_x(page, url, handle):
    """Navigate to X profile and extract bio"""
    try:
        print(f"  Fetching bio for {handle}...")

        # Navigate to profile
        page.goto(url, wait_until='networkidle', timeout=30000)
        time.sleep(2)  # Wait for dynamic content

        # Try multiple bio selectors (X uses different ones)
        bio_selectors = [
            '[data-testid="UserDescription"]',
            'div[data-testid="UserDescription"]',
            '[aria-label*="bio"]',
            'div.css-1dbjc4n.r-1iusvr4.r-16y2uox span'
        ]

        bio = None
        for selector in bio_selectors:
            try:
                bio_element = page.wait_for_selector(selector, timeout=5000)
                if bio_element:
                    bio = bio_element.inner_text().strip()
                    if bio:
                        break
            except:
                continue

        if not bio:
            print(f"    [WARN] No bio found, using fallback")
            bio = f"Crypto enthusiast | Altcoinist affiliate"
        else:
            print(f"    [OK] Bio: {bio[:60]}...")

        return bio

    except PlaywrightTimeout:
        print(f"    [ERROR] Timeout loading {url}")
        return f"Crypto trader | Altcoinist affiliate"
    except Exception as e:
        print(f"    [ERROR] Error: {e}")
        return f"Crypto trader | Altcoinist affiliate"

def main():
    csv_path = r'c:\Users\Sarah\Downloads\Affilaite Names - Sheet1 (1).csv'
    output_path = r'C:\Users\Sarah\Downloads\Altcoinist\altcoinist-affiliates-outbound\tools\affiliate-leaderboard\affiliate-bios.json'

    print("[INFO] Reading affiliates from CSV...")
    affiliates = read_csv_affiliates(csv_path)
    print(f"[INFO] Found {len(affiliates)} affiliates with X accounts\n")

    print("[INFO] Launching browser...")
    with sync_playwright() as p:
        # Launch browser (headless=False to see what's happening)
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(
            viewport={'width': 1280, 'height': 720},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        )
        page = context.new_page()

        print("[INFO] Fetching bios...\n")
        bios_data = {}

        for i, aff in enumerate(affiliates, 1):
            print(f"[{i}/{len(affiliates)}] {aff['name']} ({aff['x_handle']})")

            bio = fetch_bio_from_x(page, aff['x_url'], aff['x_handle'])

            bios_data[aff['x_handle']] = {
                'name': aff['name'],
                'tg_handle': aff['tg_handle'],
                'x_url': aff['x_url'],
                'bio': bio
            }

            # Rate limit: wait between requests
            time.sleep(3)

        browser.close()

    print(f"\n[INFO] Saving bios to {output_path}...")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(bios_data, f, indent=2, ensure_ascii=False)

    print("[SUCCESS] Done! Bios saved successfully.\n")
    print(f"[SUMMARY] Summary:")
    print(f"   - Total affiliates with X accounts: {len(affiliates)}")
    print(f"   - Bios fetched: {len(bios_data)}")

if __name__ == '__main__':
    main()
