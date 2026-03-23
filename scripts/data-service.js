// ===== DATA SERVICE LAYER =====
// This layer abstracts data fetching to make it easy to swap between demo data and real API calls

const DataConfig = {
    // Set to 'demo' for hardcoded data, 'api' for real API calls
    mode: 'demo',

    // API endpoints (ready for PostHog integration)
    endpoints: {
        weekly: '/api/affiliates/weekly',
        monthly: '/api/affiliates/monthly',
        allTime: '/api/affiliates/all-time'
    },

    // PostHog configuration (add your credentials here when ready)
    posthog: {
        projectId: null,  // Add PostHog project ID
        apiKey: null      // Add PostHog API key
    }
};

const DataService = {
    // Fetch weekly rankings
    async fetchWeeklyRankings() {
        if (DataConfig.mode === 'api') {
            // TODO: Replace with actual API call when PostHog is ready
            // Example:
            // const response = await fetch(DataConfig.endpoints.weekly);
            // return await response.json();
            console.log('API mode: Would fetch from', DataConfig.endpoints.weekly);
            return window.DEMO_WEEKLY_DATA;
        }
        return window.DEMO_WEEKLY_DATA;
    },

    // Fetch monthly rankings
    async fetchMonthlyRankings() {
        if (DataConfig.mode === 'api') {
            // TODO: Replace with actual API call when PostHog is ready
            console.log('API mode: Would fetch from', DataConfig.endpoints.monthly);
            return window.DEMO_MONTHLY_DATA;
        }
        return window.DEMO_MONTHLY_DATA;
    },

    // Transform PostHog data to leaderboard format (ready for integration)
    transformPostHogData(rawData) {
        // TODO: Implement transformation logic when PostHog structure is known
        // Example transformation:
        // return rawData.map((item, index) => ({
        //     rank: index + 1,
        //     name: item.user_name,
        //     handle: item.twitter_handle,
        //     tweets: item.tweet_count,
        //     referrals: item.referral_count,
        //     weeklyScore: item.score,
        //     imgSrc: item.avatar_url,
        //     profileUrl: item.profile_url
        // }));
        return rawData;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DataConfig, DataService };
}
