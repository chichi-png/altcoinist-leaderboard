# Altcoinist Affiliate Resource Hub - Deployment Guide

## Overview

The leaderboard has been transformed into a comprehensive affiliate resource hub with:
- 🏆 Leaderboard (existing functionality)
- 🐦 Twitter Posts Library (Konstantin's product posts)
- 🔗 X Profile Links (affiliate cross-support)
- 🎥 Video Tutorials (coming in Phase 6)
- 🔒 Password gate for affiliate-only access

## Architecture

**Platform:** Cloudflare Pages with Functions (serverless)
- Zero cost (free tier)
- Secure API key storage (server-side)
- Auto-deploy from GitHub
- Built-in caching

## Pre-Deployment Setup

### 1. Notion Integration Setup

1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Name: "Altcoinist Leaderboard"
4. Select workspace: Altcoinist
5. Copy the API key (starts with `secret_`)

### 2. Share Notion Pages with Integration

**Konstantin's Twitter Posts Page:**
- Open page: https://www.notion.so/2e2b35d787488011a7bdf78dd57b283e
- Click "Share" → Add integration "Altcoinist Leaderboard"

**X Profile Links Page:**
- Open page: https://www.notion.so/313b35d787488054a6a2cb9df51d72e0
- Click "Share" → Add integration "Altcoinist Leaderboard"

### 3. Choose Affiliate Password

Pick a simple shared password for affiliates (e.g., "altcoinist2026" or something crypto-themed).

## Deployment Steps

### 1. Push Code to GitHub

```bash
cd C:\Users\Sarah\Downloads\Altcoinist\altcoinist-leaderboard
git add .
git commit -m "Transform leaderboard into affiliate resource hub

- Add password gate for affiliate-only access
- Add Twitter Posts library (syncs from Notion)
- Add X Profiles section (syncs from Notion)
- Add Cloudflare Functions for API endpoints
- Preserve existing leaderboard functionality

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
git push origin main
```

### 2. Deploy to Cloudflare Pages

1. **Login to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com/
   - Navigate to "Workers & Pages"

2. **Create New Project**
   - Click "Create application"
   - Select "Pages"
   - Connect to Git → Select GitHub repository `chichi-png/altcoinist-leaderboard`

3. **Configure Build Settings**
   - Build command: `(leave empty)`
   - Build output directory: `/`
   - Root directory: `/`

4. **Add Environment Variables**
   Click "Environment variables" and add:

   ```
   NOTION_API_KEY = secret_xxxxxxxxxxxxxxxxxxxxxx (from step 1)
   AFFILIATE_PASSWORD = yourpassword (from step 3)
   KONSTANTIN_POSTS_PAGE_ID = 2e2b35d787488011a7bdf78dd57b283e
   X_PROFILES_PAGE_ID = 313b35d787488054a6a2cb9df51d72e0
   ```

5. **Deploy**
   - Click "Save and Deploy"
   - Wait for deployment to complete (~2 minutes)

### 3. Test Deployment

1. **Visit the staging URL** (provided by Cloudflare, e.g., `altcoinist-leaderboard.pages.dev`)

2. **Test password gate:**
   - Should see password modal on load
   - Enter correct password → should enter site
   - Refresh → should stay authenticated (sessionStorage)
   - Close tab and reopen → should require password again

3. **Test Twitter Posts:**
   - Click "🐦 Twitter Posts" button
   - Posts should load from Notion within 2 seconds
   - Click any card → should open Twitter in new tab

4. **Test X Profiles:**
   - Click "🔗 X Profiles" button
   - Profiles should load from Notion
   - Click any profile → should open X profile in new tab

5. **Test existing features:**
   - Hall of Fame modal
   - Full Leaderboard modal
   - Sound effects
   - Mobile responsiveness

### 4. Custom Domain (Optional)

If you want to use a custom domain:
1. In Cloudflare Pages → Custom domains
2. Add domain (e.g., `affiliates.altcoinist.com`)
3. Follow DNS configuration steps

## Environment Variable Reference

| Variable | Example | Description |
|----------|---------|-------------|
| `NOTION_API_KEY` | `secret_abc123...` | Notion integration API key |
| `AFFILIATE_PASSWORD` | `altcoinist2026` | Shared password for affiliates |
| `KONSTANTIN_POSTS_PAGE_ID` | `2e2b35d7...` | Notion page ID for Twitter posts |
| `X_PROFILES_PAGE_ID` | `313b35d7...` | Notion page ID for X profiles |

## Notion Page Format

### Twitter Posts Page Structure
The API expects one of these formats:
- **Bookmark blocks** with Twitter URLs
- **Paragraph blocks** with Twitter/X links

Example:
```
- [Post about feature X](https://twitter.com/username/status/123)
- [Launch announcement](https://x.com/username/status/456)
```

### X Profiles Page Structure
The API expects:
- **Paragraph or bulleted list items** with X/Twitter profile links

Example:
```
- @user1 - https://x.com/user1
- @user2 - https://twitter.com/user2
```

## Maintenance

### Updating Twitter Posts
1. Edit Konstantin's Notion page
2. Add new bookmarks or links
3. Changes auto-sync (cache expires in 5 minutes)

### Updating X Profiles
1. Edit X Profiles Notion page
2. Add new profile links
3. Changes auto-sync (cache expires in 10 minutes)

### Changing Password
1. Cloudflare Dashboard → Pages → altcoinist-leaderboard
2. Settings → Environment variables
3. Edit `AFFILIATE_PASSWORD`
4. Redeploy (automatic)

## Troubleshooting

### Password modal won't close
- Check browser console for errors
- Verify `AFFILIATE_PASSWORD` is set in Cloudflare
- Test API: `curl -X POST https://your-site.pages.dev/api/check-password -d '{"password":"test"}'`

### Twitter posts won't load
- Check Notion integration has access to the page
- Verify `KONSTANTIN_POSTS_PAGE_ID` is correct
- Test API: `curl https://your-site.pages.dev/api/twitter-posts`
- Check page contains bookmark or paragraph blocks with Twitter URLs

### X profiles won't load
- Check Notion integration has access to the page
- Verify `X_PROFILES_PAGE_ID` is correct
- Test API: `curl https://your-site.pages.dev/api/x-profiles`

### Function errors
- Check Cloudflare Pages → Functions logs
- Verify all environment variables are set
- Check Notion API version compatibility (should be 2022-06-28)

## Cost Breakdown

All free tiers:
- ✅ Cloudflare Pages: 500 builds/month, unlimited bandwidth
- ✅ Cloudflare Functions: 100,000 requests/day
- ✅ GitHub: Free for public repos
- ✅ Notion API: Free tier (unlimited reads)

**Total monthly cost: $0**

## Phase 6 - Video Tutorials (Future)

When ready to add video tutorials:
1. Upload screen recordings to YouTube (unlisted)
2. Store download links in Cloudflare R2 (10GB free)
3. Create `functions/api/video-tutorials.js`
4. Update `openVideoTutorials()` function to load real data

## Support

**Issues?** Check:
1. Cloudflare Functions logs
2. Browser console (F12)
3. Notion integration permissions
4. Environment variables are set correctly

**Questions?** Contact ChiChi (@CHICHI_0785)
