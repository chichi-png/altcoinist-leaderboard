# Altcoinist Affiliate Leaderboard

Public-facing leaderboard showcasing top-performing Altcoinist affiliates.

## 🚀 Deployment

**Live Site:** https://chichi-png.github.io/altcoinist-leaderboard/

**Repository:** https://github.com/chichi-png/altcoinist-leaderboard

Deployed automatically via **GitHub Pages** from the `master` branch.

## 📁 Structure

```
altcoinist-leaderboard/
├── index.html                    # ⚠️ IMPORTANT: Door entrance page (DO NOT DELETE!)
├── leaderboard.html              # Main single-page app (all views)
├── assets/
│   └── images/
│       └── affiliates/           # 35 affiliate profile pictures
├── functions/                    # Utility functions
├── .gitignore
└── README.md
```

**⚠️ CRITICAL FILES - DO NOT DELETE:**
- `index.html` - Landing page with door animation and "ACCESS GRANTED" screen
- `leaderboard.html` - Main leaderboard application

## 🎨 Features

- **🚪 Command Center Entrance** - Immersive door animation with security scanner (index.html)
- **Single-Page App** - All views (All-Time, Weekly, Monthly, Affiliates) in one page
- **Top 3 Podium** - Epic reveal animation for champions
- **Paginated Rankings** - 10 affiliates per page with navigation
- **Real Profile Pictures** - 35 actual Altcoinist affiliates
- **Responsive Design** - Works on desktop and mobile
- **Dark Cyber Theme** - Neon accents and smooth animations

## 📊 Data Structure

### Weekly Rankings
Located in `leaderboard.html` (~line 4505):
```javascript
const weeklyItemsPerPage = 10; // 10 per page
const weeklyData = [
    {rank: 1, name: 'Rb3k', handle: '@rbthreek', ...},
    // ... 35 real affiliates
];
```

### Monthly Rankings
Located in `leaderboard.html` (~line 4690):
```javascript
const monthlyItemsPerPage = 10; // 10 per page
const monthlyData = [
    {rank: 1, name: 'Rb3k', handle: '@rbthreek', ...},
    // ... 35 real affiliates
];
```

## 🔄 Navigation

- **All-Time Rankings:** Default view on load
- **Weekly Rankings:** Click "📊 Weekly Rankings" button
- **Monthly Rankings:** Click "📈 Monthly Rankings" button
- **Affiliates Directory:** Click "🎯 Affiliates" button

All navigation is handled via JavaScript - no page reloads.

## 🖼️ Adding New Affiliates

1. Add profile picture to `assets/images/affiliates/`
2. Update `weeklyData` and `monthlyData` arrays in `leaderboard.html`
3. Commit and push to trigger GitHub Pages deployment

## 📝 Notes

- **41 affiliates total** (as of 2026-03-26)
- **Pagination:** 10 per page = 4 pages (10, 10, 10, 5)
- **Made-up numbers:** Performance data is currently demo data
- **Single source:** All code in `leaderboard.html` for easy maintenance
