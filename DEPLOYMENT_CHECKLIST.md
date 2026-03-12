# Deployment Checklist - Altcoinist Affiliate Resource Hub

Use this checklist to ensure a smooth deployment to Cloudflare Pages.

## Pre-Deployment

### 1. Notion Setup
- [ ] Create Notion integration at https://www.notion.so/my-integrations
- [ ] Copy API key (starts with `secret_`)
- [ ] Share Konstantin's Twitter Posts page with integration
  - URL: https://www.notion.so/2e2b35d787488011a7bdf78dd57b283e
- [ ] Share X Profiles page with integration
  - URL: https://www.notion.so/313b35d787488054a6a2cb9df51d72e0
- [ ] Test integration has access (pages should show in integration settings)

### 2. Password Selection
- [ ] Choose affiliate password (simple, memorable)
- [ ] Document it securely for distribution to affiliates
- [ ] Examples: "altcoinist2026", "crypto-affiliates", etc.

### 3. Code Preparation
- [ ] Review all changes in `index.html`
- [ ] Verify all function files exist:
  - `functions/api/check-password.js`
  - `functions/api/twitter-posts.js`
  - `functions/api/x-profiles.js`
- [ ] Check `.env.example` has all variables listed

## Git & GitHub

### 4. Commit Changes
```bash
cd C:\Users\Sarah\Downloads\Altcoinist\altcoinist-leaderboard

# Check what's changed
git status

# Add all new files and changes
git add .

# Commit
git commit -m "Transform leaderboard into affiliate resource hub

- Add password gate for affiliate-only access
- Add Twitter Posts library (syncs from Notion)
- Add X Profiles section (syncs from Notion)
- Add Cloudflare Functions for API endpoints
- Preserve existing leaderboard functionality
- Add deployment documentation

Features:
- Password-protected access (sessionStorage)
- Twitter posts fetched from Konstantin's Notion page
- X profiles fetched from dedicated Notion page
- Video tutorials placeholder (Phase 6)
- All existing features preserved (podium, hall of fame, full leaderboard)

Tech stack:
- Cloudflare Pages + Functions (serverless)
- Notion API integration
- Zero-cost deployment

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Push to GitHub
git push origin main
```

- [ ] Code committed to main branch
- [ ] All files pushed successfully
- [ ] Verify on GitHub.com that files are there

## Cloudflare Pages Deployment

### 5. Create Cloudflare Pages Project
- [ ] Login to https://dash.cloudflare.com/
- [ ] Navigate to "Workers & Pages"
- [ ] Click "Create application" → "Pages"
- [ ] Connect to Git → Select GitHub
- [ ] Authorize Cloudflare (if first time)
- [ ] Select repository: `chichi-png/altcoinist-leaderboard`

### 6. Configure Build Settings
- [ ] Framework preset: None
- [ ] Build command: (leave empty)
- [ ] Build output directory: `/`
- [ ] Root directory: `/`

### 7. Add Environment Variables
Click "Environment variables" and add these:

- [ ] `NOTION_API_KEY`
  - Value: Your Notion integration API key (from step 1)
  - Example: `secret_abc123xyz...`

- [ ] `AFFILIATE_PASSWORD`
  - Value: Your chosen password (from step 2)
  - Example: `altcoinist2026`

- [ ] `KONSTANTIN_POSTS_PAGE_ID`
  - Value: `2e2b35d787488011a7bdf78dd57b283e`
  - (This is the UUID from Konstantin's Notion page URL)

- [ ] `X_PROFILES_PAGE_ID`
  - Value: `313b35d787488054a6a2cb9df51d72e0`
  - (This is the UUID from X Profiles Notion page URL)

### 8. Deploy
- [ ] Click "Save and Deploy"
- [ ] Wait for deployment to complete (~2-3 minutes)
- [ ] Note the staging URL (e.g., `altcoinist-leaderboard.pages.dev`)

## Testing

### 9. Test Password Gate
- [ ] Visit staging URL
- [ ] Password modal should appear
- [ ] Enter wrong password → should show error
- [ ] Enter correct password → should enter site
- [ ] Refresh page → should stay authenticated
- [ ] Close tab and reopen → should require password again
- [ ] Sound effect plays on successful login

### 10. Test Twitter Posts
- [ ] Click "🐦 Twitter Posts" button
- [ ] Modal should open with animation
- [ ] Posts should load within 2 seconds
- [ ] Verify posts match Konstantin's Notion page
- [ ] Click a post card → should open Twitter in new tab
- [ ] Close modal with X or Back button
- [ ] Sound effects should play

### 11. Test X Profiles
- [ ] Click "🔗 X Profiles" button
- [ ] Modal should open with animation
- [ ] Profiles should load within 2 seconds
- [ ] Verify profiles match X Profiles Notion page
- [ ] Click a profile card → should open X profile in new tab
- [ ] Close modal
- [ ] Sound effects should play

### 12. Test Existing Features
- [ ] Click "🏆 Hall of Fame" → should work as before
- [ ] Click "📊 Full Leaderboard" → should work as before
- [ ] Click individual cards → detail popup should work
- [ ] Pagination works in full leaderboard
- [ ] Sound effects play correctly
- [ ] Mute button works

### 13. Test Responsive Design
- [ ] Open browser DevTools (F12)
- [ ] Switch to mobile view
- [ ] Test on different screen sizes:
  - [ ] Mobile (375px width)
  - [ ] Tablet (768px width)
  - [ ] Desktop (1920px width)
- [ ] All modals should be readable
- [ ] Buttons should be clickable
- [ ] Navigation should work

### 14. Test Error Handling
- [ ] With browser console open (F12):
  - [ ] Check for JavaScript errors
  - [ ] Network tab should show successful API calls
  - [ ] No 404 errors

### 15. Test Performance
- [ ] Lighthouse test (DevTools → Lighthouse)
  - Target: 90+ performance score
- [ ] Page loads in <2 seconds
- [ ] API calls complete in <2 seconds
- [ ] Animations are smooth

## Production Setup (Optional)

### 16. Custom Domain
If using custom domain (e.g., `affiliates.altcoinist.com`):
- [ ] In Cloudflare Pages → Custom domains
- [ ] Add custom domain
- [ ] Update DNS settings as instructed
- [ ] Wait for SSL certificate provisioning (~5 minutes)
- [ ] Test custom domain

## Post-Deployment

### 17. Monitor & Validate
- [ ] Check Cloudflare Pages dashboard for function logs
- [ ] Verify no errors in production logs
- [ ] Monitor first 24h for any issues

### 18. Content Verification
- [ ] Add a test post to Konstantin's Notion page
- [ ] Wait 5 minutes (cache expiry)
- [ ] Refresh site → new post should appear
- [ ] Remove test post

### 19. Documentation
- [ ] Share password with affiliates
- [ ] Document URL (staging or custom domain)
- [ ] Share usage instructions:
  - Password to enter site
  - How to use Twitter posts (click to share)
  - How to use X profiles (follow fellow affiliates)

### 20. Analytics (Optional)
- [ ] Set up Cloudflare analytics
- [ ] Monitor:
  - Page views
  - Function invocations
  - Error rates
  - Most viewed sections

## Maintenance Checklist

### Regular Maintenance
- [ ] Weekly: Check Notion pages have latest content
- [ ] Monthly: Review Cloudflare usage (should be within free tier)
- [ ] As needed: Update password if compromised
- [ ] As needed: Update leaderboard data in `index.html`

### When Things Break

**Password won't work:**
1. Check Cloudflare env var `AFFILIATE_PASSWORD`
2. Verify function logs for errors
3. Test API: `curl -X POST https://your-site.pages.dev/api/check-password -d '{"password":"test"}'`

**Twitter posts won't load:**
1. Check Notion integration has access to page
2. Verify page ID is correct
3. Check function logs
4. Test API: `curl https://your-site.pages.dev/api/twitter-posts`

**X profiles won't load:**
1. Check Notion integration has access to page
2. Verify page ID is correct
3. Check function logs
4. Test API: `curl https://your-site.pages.dev/api/x-profiles`

## Rollback Plan

If something goes wrong:
- [ ] Cloudflare Pages → Deployments
- [ ] Find previous working deployment
- [ ] Click "..." → "Rollback to this deployment"
- [ ] Verify site works on previous version
- [ ] Debug issues in development
- [ ] Redeploy when fixed

## Success Criteria

Deployment is successful when:
- ✅ Password gate works perfectly
- ✅ Twitter posts load from Notion
- ✅ X profiles load from Notion
- ✅ All existing features work
- ✅ Mobile responsive
- ✅ No console errors
- ✅ Performance score >90
- ✅ All sound effects work

---

**Deployment Date:** ___________
**Deployed By:** ___________
**Staging URL:** ___________
**Production URL:** ___________
**Password:** ___________ (keep secure!)

## Notes

(Add any deployment-specific notes here)
