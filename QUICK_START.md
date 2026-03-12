# Quick Start - Deploy in 15 Minutes

Follow these steps to deploy the Altcoinist Affiliate Resource Hub to Cloudflare Pages.

## Prerequisites

- GitHub account
- Cloudflare account (free)
- Access to Notion pages (Konstantin's posts + X profiles)

---

## Step 1: Notion Integration (5 min)

1. **Create integration:**
   - Go to https://www.notion.so/my-integrations
   - Click "New integration"
   - Name: "Altcoinist Leaderboard"
   - Submit

2. **Copy API key:**
   - Starts with `secret_`
   - Save it securely (needed for Step 3)

3. **Share pages with integration:**

   **Konstantin's Twitter Posts:**
   - Open: https://www.notion.so/2e2b35d787488011a7bdf78dd57b283e
   - Click "Share" (top-right)
   - Add "Altcoinist Leaderboard" integration

   **X Profiles:**
   - Open: https://www.notion.so/313b35d787488054a6a2cb9df51d72e0
   - Click "Share"
   - Add "Altcoinist Leaderboard" integration

---

## Step 2: Commit Code to GitHub (3 min)

```bash
# Navigate to directory
cd C:\Users\Sarah\Downloads\Altcoinist\altcoinist-leaderboard

# Check status
git status

# Add all files
git add .

# Commit
git commit -m "Transform leaderboard into affiliate resource hub

- Password gate for affiliate access
- Twitter posts library from Notion
- X profiles directory from Notion
- Cloudflare Functions backend
- Complete documentation

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Push
git push origin main
```

**Verify on GitHub:**
- Visit: https://github.com/chichi-png/altcoinist-leaderboard
- Check files are there: `functions/`, `index.html`, `README.md`, etc.

---

## Step 3: Deploy to Cloudflare (7 min)

1. **Login to Cloudflare:**
   - Go to https://dash.cloudflare.com/
   - Navigate to "Workers & Pages"

2. **Create new project:**
   - Click "Create application"
   - Select "Pages" tab
   - Click "Connect to Git"

3. **Connect GitHub:**
   - Select "GitHub" provider
   - Authorize Cloudflare (if first time)
   - Select repository: `chichi-png/altcoinist-leaderboard`
   - Click "Begin setup"

4. **Configure build:**
   - Project name: `altcoinist-leaderboard` (or customize)
   - Production branch: `main`
   - Framework preset: `None`
   - Build command: (leave empty)
   - Build output directory: `/`
   - Root directory: (leave empty)

5. **Add environment variables:**

   Click "Environment variables" → "Add variable" (repeat 4 times):

   | Variable Name | Value |
   |--------------|-------|
   | `NOTION_API_KEY` | Your Notion API key from Step 1 |
   | `AFFILIATE_PASSWORD` | Choose a password (e.g., `altcoinist2026`) |
   | `KONSTANTIN_POSTS_PAGE_ID` | `2e2b35d787488011a7bdf78dd57b283e` |
   | `X_PROFILES_PAGE_ID` | `313b35d787488054a6a2cb9df51d72e0` |

6. **Deploy:**
   - Click "Save and Deploy"
   - Wait 2-3 minutes
   - Note your URL (e.g., `altcoinist-leaderboard.pages.dev`)

---

## Step 4: Test Deployment (5 min)

### Test Password Gate
1. Visit your Cloudflare Pages URL
2. Should see password modal
3. Enter wrong password → should show error
4. Enter correct password → should access site
5. ✅ Password gate works

### Test Twitter Posts
1. Click "🐦 Twitter Posts" button
2. Posts should load (may take 2-3 seconds first time)
3. Click a post → should open Twitter
4. ✅ Twitter posts work

### Test X Profiles
1. Click "🔗 X Profiles" button
2. Profiles should load
3. Click a profile → should open X
4. ✅ X profiles work

### Test Leaderboard
1. Click "🏆 Hall of Fame" → should work
2. Click "📊 Full Leaderboard" → should work
3. ✅ Existing features work

### Test Mobile
1. Open on phone OR resize browser to mobile width
2. All sections should work
3. Buttons should be clickable
4. ✅ Mobile responsive

---

## Done! 🎉

Your affiliate resource hub is live at: `https://your-site.pages.dev`

### Next Steps:

**1. Share with affiliates:**
   - URL: `https://your-site.pages.dev`
   - Password: `[your chosen password]`
   - Instructions: See FEATURES.md

**2. Add content to Notion pages:**
   - Twitter posts: Add bookmarks to Konstantin's page
   - X profiles: Add handles + links to X Profiles page
   - Changes sync automatically (5-10 min cache)

**3. Optional - Custom domain:**
   - Cloudflare Pages → Custom domains
   - Add: `affiliates.altcoinist.com` (or similar)
   - Update DNS as instructed

---

## Troubleshooting

**Password doesn't work:**
- Check Cloudflare env var `AFFILIATE_PASSWORD` is set
- Try redeploying (Settings → Deployments → Retry)

**Twitter posts won't load:**
- Check Notion integration has access to page
- Verify page ID in env vars
- Check Cloudflare Functions logs

**X profiles won't load:**
- Same as Twitter posts (check integration + page ID)

**Site won't deploy:**
- Check GitHub repo has all files
- Verify build settings are correct
- Check Cloudflare deployment logs

---

## Support Files

- **Full deployment guide:** `DEPLOYMENT.md`
- **Detailed checklist:** `DEPLOYMENT_CHECKLIST.md`
- **Feature documentation:** `FEATURES.md`
- **Implementation details:** `IMPLEMENTATION_SUMMARY.md`
- **Repository info:** `README.md`

---

## Cost

**Total monthly cost: $0**

Free tiers used:
- Cloudflare Pages: 500 builds/month
- Cloudflare Functions: 100,000 requests/day
- Notion API: Unlimited reads
- GitHub: Free for public repos

---

## Maintenance

**Update Twitter posts:**
1. Edit Konstantin's Notion page
2. Wait 5 minutes
3. Posts auto-sync

**Update X profiles:**
1. Edit X Profiles Notion page
2. Wait 10 minutes
3. Profiles auto-sync

**Change password:**
1. Cloudflare → Environment variables
2. Edit `AFFILIATE_PASSWORD`
3. Change takes effect immediately

**Update leaderboard:**
1. Edit `index.html` → `affiliatesData` array
2. Commit + push to GitHub
3. Cloudflare auto-deploys (~2 min)

---

**Need help?** Check the documentation files or contact ChiChi (@CHICHI_0785)
