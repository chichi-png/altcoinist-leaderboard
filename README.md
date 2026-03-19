# Altcoinist Affiliate Leaderboard

Public-facing leaderboard showcasing top-performing Altcoinist affiliates.

## 🚀 Deployment

**Live Site:** https://chichi-png.github.io/altcoinist-leaderboard/

**Repository:** https://github.com/chichi-png/altcoinist-leaderboard

Deployed automatically via **GitHub Pages** from the `master` branch.

## 📁 Structure

```
altcoinist-leaderboard/
├── index.html                    # All-time leaderboard
├── weekly.html                   # Weekly leaderboard
├── monthly.html                  # Monthly leaderboard
├── assets/
│   └── images/
│       └── affiliates/           # Affiliate profile pictures
├── .gitignore
└── README.md
```

## 🎨 Features

- **Top 3 Podium** - Epic reveal animation for champions
- **Hall of Fame** - Ranks 4-10 with interactive cards
- **Full Leaderboard** - Paginated table view (10 per page)
- **Profile Details** - Click any affiliate to view their stats
- **Responsive Design** - Works on desktop and mobile
- **Dark Cyber Theme** - Neon accents and smooth animations

## 📊 Data Structure

Affiliate data is hardcoded in `index.html` (line ~3530):

```javascript
const affiliatesData = [
    {
        rank: 1,
        name: 'rbthreek',
        handle: '@rbthreek',
        avatar: 'R',
        tweets: 10,
        referrals: 195,
        traders: 98,
        total: 303,
        imgSrc: 'assets/images/affiliates/rbthreek.jpg'
    },
    // ...
];
```

## 🔄 Updating Leaderboard

### Add New Affiliate

1. Add profile picture to `assets/images/affiliates/`
2. Update `affiliatesData` array in `index.html`, `weekly.html`, and `monthly.html`
3. Commit and push - GitHub Pages auto-deploys

### Update Stats

1. Edit the `affiliatesData` array in the relevant HTML file(s)
2. Update `tweets`, `referrals`, `traders`, and `total` values
3. Commit and push - GitHub Pages auto-deploys

## 🛠️ Tech Stack

- Pure HTML/CSS/JavaScript (no build step)
- CSS Grid & Flexbox for layouts
- CSS Custom Properties for theming
- Intersection Observer for animations
- Web Audio API for sound effects

## 📝 License

Proprietary - Altcoinist Team

---

**Maintained by:** ChiChi (@CHICHI_0785)
