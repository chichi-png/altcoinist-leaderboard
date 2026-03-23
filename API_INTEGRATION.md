# API Integration Guide

## Current State

The leaderboard currently uses **demo data** (hardcoded arrays). The codebase is structured to easily switch to real API data when the PostHog dashboard is ready.

## Data Service Layer

Located in `leaderboard.html` around line 4615-4676.

### Configuration

```javascript
const DataConfig = {
    mode: 'demo',  // Change to 'api' when ready

    endpoints: {
        weekly: '/api/affiliates/weekly',
        monthly: '/api/affiliates/monthly',
        allTime: '/api/affiliates/all-time'
    },

    posthog: {
        projectId: null,  // Add your PostHog project ID
        apiKey: null      // Add your PostHog API key
    }
};
```

### Data Service Methods

**`DataService.fetchWeeklyRankings()`**
- Returns: `Promise<Array<Affiliate>>`
- Currently returns `DEMO_WEEKLY_DATA`
- TODO: Add API call implementation

**`DataService.fetchMonthlyRankings()`**
- Returns: `Promise<Array<Affiliate>>`
- Currently returns `DEMO_MONTHLY_DATA`
- TODO: Add API call implementation

**`DataService.transformPostHogData(rawData)`**
- Transforms PostHog response to leaderboard format
- TODO: Implement based on actual PostHog data structure

## How to Switch to API Mode

### Step 1: Configure PostHog

```javascript
DataConfig.posthog = {
    projectId: '145727',  // Your PostHog project ID
    apiKey: 'your-api-key-here'
};
```

### Step 2: Implement API Calls

Update `DataService.fetchWeeklyRankings()`:

```javascript
async fetchWeeklyRankings() {
    if (DataConfig.mode === 'api') {
        const response = await fetch(DataConfig.endpoints.weekly, {
            headers: {
                'Authorization': `Bearer ${DataConfig.posthog.apiKey}`
            }
        });
        const rawData = await response.json();
        return this.transformPostHogData(rawData);
    }
    return DEMO_WEEKLY_DATA;
}
```

### Step 3: Implement Data Transformation

Update `DataService.transformPostHogData()` based on your PostHog data structure:

```javascript
transformPostHogData(rawData) {
    return rawData.affiliates.map((item, index) => ({
        rank: index + 1,
        name: item.user_name,
        handle: item.twitter_handle || item.handle,
        avatar: item.user_name[0].toUpperCase(),
        tweets: item.tweet_count || 0,
        referrals: item.referral_count || 0,
        weeklyScore: item.total_score || 0,
        imgSrc: `assets/images/affiliates/${item.image_filename}`,
        profileUrl: item.twitter_url || `https://x.com/${item.handle.replace('@', '')}`
    }));
}
```

### Step 4: Load Data on Page Init

Update the DOMContentLoaded event (around line 6350):

```javascript
window.addEventListener('DOMContentLoaded', async () => {
    // Initialize filtered data arrays
    if (DataConfig.mode === 'api') {
        weeklyData = await DataService.fetchWeeklyRankings();
        monthlyData = await DataService.fetchMonthlyRankings();
    } else {
        weeklyData = DEMO_WEEKLY_DATA;
        monthlyData = DEMO_MONTHLY_DATA;
    }

    filteredWeeklyData = weeklyData;
    filteredMonthlyData = monthlyData;

    // ... rest of initialization
});
```

### Step 5: Set Mode to API

```javascript
DataConfig.mode = 'api';
```

## Expected Data Format

Each affiliate object should have:

```typescript
interface Affiliate {
    rank: number;
    name: string;
    handle: string;  // e.g., '@rbthreek'
    avatar: string;  // Single letter for fallback
    tweets: number;
    referrals: number;
    weeklyScore: number;  // Or monthlyScore
    imgSrc: string;  // Path to profile image
    profileUrl: string;  // Twitter/X profile URL
    bio?: string;  // Optional bio text
}
```

## Testing

1. Keep `mode: 'demo'` while developing
2. Test API calls in browser console:
   ```javascript
   await DataService.fetchWeeklyRankings()
   ```
3. Verify data transformation
4. Switch to `mode: 'api'` when ready
5. Monitor browser console for errors

## Rollback

If API integration fails, simply set:
```javascript
DataConfig.mode = 'demo';
```

The leaderboard will immediately fall back to demo data.

## Notes

- All existing features (search, filter, export, badges, modals) work with both demo and API data
- No UI changes needed - only backend data source changes
- Demo data remains available for development and testing
