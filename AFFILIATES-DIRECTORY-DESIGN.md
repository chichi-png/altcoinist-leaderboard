# Affiliates Directory Feature - Design Document

**Status:** Approved Design - Ready for Implementation
**Date:** 2026-03-12
**Designer:** ChiChi + Claude

---

## Overview

Add a new "Affiliates Directory" feature to the leaderboard site that showcases all affiliates with their X profiles and promotional tweet feeds.

## User Flow

```
1. User clicks "Affiliates" button in navigation
   ↓
2. Modal opens showing grid of all affiliate cards (profile pic, name, handle, tweet count)
   ↓
3. User clicks an affiliate card
   ↓
4. Individual profile modal opens showing:
   - Profile info (avatar, name, handle, stats, leaderboard rank)
   - Tweet feed (all promotional tweets from Notion)
   - Direct links to X profile and individual tweets
```

## Design Specifications

### 1. Navigation Button

**Location:** Top navigation, after "X Profiles" button, before "Mute" button

**Styling:**
- Background: `linear-gradient(135deg, rgba(0,255,255,0.2), rgba(0,200,200,0.2))`
- Border: `2px solid cyan`
- Color: `cyan`
- Padding: `0.8rem 1.5rem`
- Border-radius: `6px`
- Font-weight: `bold`
- Box-shadow: `0 0 15px rgba(0,255,255,0.5)`
- Optional "NEW" badge: `background: #ff00ff`

**Icon:** 🎯 emoji
**Text:** "Affiliates"

### 2. Affiliates Grid Modal

**Layout:**
- Modal overlay (same pattern as Twitter Posts/X Profiles modals)
- Dark background: `#0a0a0a`
- Grid: `repeat(auto-fill, minmax(200px, 1fr))`
- Gap: `1.5rem`
- Max-height: `500px` with scroll

**Header:**
- Title: "🎯 Affiliates Directory" (cyan, glowing text-shadow)
- Close button (X) on right
- Optional search bar: `🔍 Search affiliates...`

**Affiliate Card:**
- Background: `linear-gradient(135deg, rgba(0,255,255,0.1), rgba(0,150,150,0.1))`
- Border: `1px solid rgba(0,255,255,0.3)`
- Border-radius: `8px`
- Padding: `1.5rem`
- Text-align: `center`
- Cursor: `pointer`
- Box-shadow: `0 4px 6px rgba(0,0,0,0.3)`

**Card Contents:**
- Avatar circle (80px, gradient background, initials/image)
- Name (cyan, 1.1rem)
- Handle (white 70% opacity, 0.9rem)
- Tweet count badge (cyan 80% opacity, 0.85rem)

**Hover Effect:**
- Increase box-shadow glow
- Scale: `1.05`
- Border brightens

### 3. Individual Affiliate Profile Modal

**Layout:**
- Replaces grid modal (or slides in from right)
- Same dark background
- Scrollable content

**Header:**
- "← Back to Grid" button (left)
- Close button (X) (right)

**Profile Section:**
- Horizontal layout (flex)
- Avatar (120px circle, gradient, glowing shadow)
- Info section:
  - Name (2rem, cyan, glowing)
  - Handle (1.2rem, white 70%)
  - Stats row:
    - Total Tweets count
    - Leaderboard Rank
  - "Visit X Profile →" button (cyan gradient, external link)

**Tweet Feed Section:**
- Title: "📱 Recent Promotional Tweets"
- Tweet cards (vertical stack):
  - Avatar + name + handle + date
  - Tweet text content
  - Engagement metrics (replies, retweets, likes, bookmarks)
  - Insight tag (if available)
  - "View on X →" link

**Tweet Card Styling:**
- Background: `rgba(0,255,255,0.05)`
- Border: `1px solid rgba(0,255,255,0.2)`
- Border-radius: `8px`
- Padding: `1.5rem`
- Margin-bottom: `1rem`

**Load More:**
- Button at bottom to load more tweets
- Pagination (show 5-10 tweets initially)

---

## Data Architecture

### Data Source

**Notion Database:** "Affiliate Tweet Tracker"
- **Database ID:** `c51f4729-ae90-4dea-95c3-cc683b273cc9`
- **Data Source ID:** `8c7e9fe5-9240-4fcf-bf5b-c4e081848e65`

**Fields Used:**
- `Affiliate` (title) - X handle (e.g., "tibbiracer", "N30_cryptoo")
- `Tweet link` (URL) - Direct link to tweet
- `X profile link` (URL) - Link to their X profile
- `Posted on` (date) - Tweet date
- `Likes`, `Replies`, `Reposts`, `Bookmarks` (numbers) - Engagement metrics
- `Insight` (rich_text) - Content type tag

### API Endpoint

**New Cloudflare Function:** `/functions/api/affiliate-tweets.js`

**Purpose:** Fetch tweets from Notion grouped by affiliate

**Query Logic:**
```javascript
// Pseudo-code
1. Query Notion database (c51f4729-ae90-4dea-95c3-cc683b273cc9)
2. Group results by "Affiliate" field
3. Sort by "Posted on" date (descending)
4. Return structured JSON:
   {
     "affiliates": [
       {
         "handle": "N30_cryptoo",
         "profileUrl": "https://x.com/N30_cryptoo",
         "tweetCount": 106,
         "tweets": [
           {
             "text": "...",
             "url": "...",
             "date": "...",
             "likes": 12,
             "replies": 2,
             "retweets": 0,
             "bookmarks": 0,
             "insight": "Token mention"
           },
           ...
         ]
       },
       ...
     ]
   }
```

**Caching:** 10 minutes (same as X profiles)

**Environment Variable:** Uses existing `NOTION_API_KEY`

### Frontend Data Flow

1. User clicks "Affiliates" button
2. JavaScript fetches `/api/affiliate-tweets`
3. Render grid modal with affiliate cards
4. User clicks affiliate card
5. Open profile modal with that affiliate's data
6. Display tweets from cached response

---

## Technical Implementation

### Files to Create/Modify

**New Files:**
- `functions/api/affiliate-tweets.js` - Notion API endpoint

**Modified Files:**
- `index.html` - Add navigation button, modal HTML, JavaScript logic

### JavaScript Functions Needed

```javascript
// Open affiliates grid modal
function openAffiliatesDirectory() { }

// Close modal
function closeAffiliatesModal() { }

// Render affiliate cards in grid
function renderAffiliateCards(affiliates) { }

// Open individual affiliate profile
function openAffiliateProfile(affiliateHandle) { }

// Render tweet feed
function renderTweetFeed(tweets) { }

// Load more tweets (pagination)
function loadMoreTweets(affiliateHandle, offset) { }

// Fetch data from API
async function fetchAffiliateData() { }
```

### Integration with Existing Data

**Match affiliates between:**
- Leaderboard `affiliatesData` array (has tweet counts from manual update)
- Notion database (has actual tweet links and content)

**Matching Strategy:**
- Use X handle as unique key
- Normalize handles (remove @, lowercase)
- Example: `@N30_cryptoo` → `n30_cryptoo`

**Fallback for Missing Data:**
- If affiliate in leaderboard but not in Notion: Show profile but "No tweets yet"
- If affiliate in Notion but not in leaderboard: Include in directory but no rank shown

---

## Mobile Responsiveness

### Grid Layout Breakpoints

- **Desktop (>1200px):** 4-5 columns
- **Tablet (768-1200px):** 3 columns
- **Mobile (480-768px):** 2 columns
- **Small Mobile (<480px):** 1 column

### Modal Behavior

- Full-screen on mobile
- Padding adjusts for smaller screens
- Search bar full-width on mobile
- Profile header stacks vertically on mobile (avatar on top, info below)

---

## Future Enhancements (Optional)

- **Filtering:** Filter by tweet count, leaderboard rank, activity level
- **Sorting:** Sort by name, rank, tweet count, recent activity
- **Search:** Live search by name or handle
- **Stats Dashboard:** Aggregate stats (total tweets, top performer, etc.)
- **Export:** Download affiliate list as CSV
- **Notifications:** Alert when new affiliates join or reach milestones

---

## Implementation Checklist

- [ ] Create Notion API endpoint (`/functions/api/affiliate-tweets.js`)
- [ ] Add "Affiliates" button to navigation in `index.html`
- [ ] Create grid modal HTML structure
- [ ] Create profile modal HTML structure
- [ ] Implement JavaScript functions for modal logic
- [ ] Style modals to match cyber/neon theme
- [ ] Test on desktop and mobile
- [ ] Deploy to Cloudflare Pages
- [ ] Add `NOTION_API_KEY` to environment variables (if not already set)
- [ ] Test with real Notion data
- [ ] Add to `.gitignore`: `.superpowers/` (mockup files)

---

## Mockup Files

Visual mockups saved in:
- `.superpowers/brainstorm/2046-1773311641/`
  - `affiliates-directory-overview.html`
  - `view-1-nav.html`
  - `view-2-grid.html`
  - `view-3-profile.html`
  - `all-views-combined.html` ⭐ (shows all views together)

**To view mockups again:**
1. Run: `cd .superpowers/brainstorm/2046-1773311641`
2. Open `all-views-combined.html` in browser

---

## Notes

- Feature approved 2026-03-12 by ChiChi
- Design matches existing site aesthetic (cyber/neon, cyan/teal theme)
- Uses same modal pattern as Twitter Posts and X Profiles features
- Ready to implement when needed
- Estimated implementation time: 3-4 hours

---

**Questions or Changes?**
Contact ChiChi (@CHICHI_0785) or refer to this document before starting implementation.
