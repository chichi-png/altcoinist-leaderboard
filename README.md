# Altcoinist Affiliate Leaderboard

Public-facing leaderboard showcasing top-performing Altcoinist affiliates.

## 🚀 Deployment

**Live Site:** [Deployed on Vercel]

### Deploy to Vercel

1. Import this repository to Vercel
2. Framework Preset: **Other** (static HTML)
3. Root Directory: `./`
4. Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/chichi-png/altcoinist-leaderboard)

## 📁 Structure

```
altcoinist-leaderboard/
├── index.html                    # Main leaderboard page
├── assets/
│   └── images/
│       └── affiliates/           # Affiliate profile pictures
├── .gitignore
├── vercel.json                   # Deployment configuration
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
2. Update `affiliatesData` array in `index.html`
3. Commit and push - Vercel auto-deploys

### Update Stats

1. Edit the `affiliatesData` array in `index.html`
2. Update `tweets`, `referrals`, `traders`, and `total` values
3. Commit and push

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
