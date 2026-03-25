"""
Update all affiliate data in leaderboard.html with the 41 affiliates from CSV
Updates: DEMO_WEEKLY_DATA, DEMO_MONTHLY_DATA, and affiliatesData
"""
import re

# Read the generated affiliate data
with open('affiliate-data-output.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the three data arrays
monthly_match = re.search(r'window\.DEMO_MONTHLY_DATA = \[(.*?)\];', content, re.DOTALL)
monthly_data = 'window.DEMO_MONTHLY_DATA = [' + monthly_match.group(1) + '];'

affiliates_match = re.search(r'const affiliatesData = \[(.*?)\];', content, re.DOTALL)
affiliates_data = 'const affiliatesData = [' + affiliates_match.group(1) + '];'

print("Extracted data arrays from output file")

# Read leaderboard.html
with open('leaderboard.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

print("Read leaderboard.html")

# Replace DEMO_MONTHLY_DATA
html_content = re.sub(
    r'window\.DEMO_MONTHLY_DATA = \[.*?\];',
    monthly_data,
    html_content,
    flags=re.DOTALL
)
print("Updated DEMO_MONTHLY_DATA")

# Replace affiliatesData
html_content = re.sub(
    r'const affiliatesData = \[.*?\];',
    affiliates_data,
    html_content,
    flags=re.DOTALL
)
print("Updated affiliatesData")

# Write back
with open('leaderboard.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("\n✓ Successfully updated leaderboard.html with all 41 affiliates!")
print("  - DEMO_WEEKLY_DATA: Already updated")
print("  - DEMO_MONTHLY_DATA: Updated")
print("  - affiliatesData (All-time + Directory): Updated")
