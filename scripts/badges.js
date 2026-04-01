// ===== ACHIEVEMENT BADGES =====
// Calculate achievement badges for an affiliate based on performance metrics

window.getBadges = function getBadges(affiliate) {
    const badges = [];

    // Rank-based badges
    if (affiliate.rank === 1) badges.push({icon: '👑', text: 'Champion', color: '#FFD700'});
    else if (affiliate.rank === 2) badges.push({icon: '🥈', text: 'Runner-Up', color: '#C0C0C0'});
    else if (affiliate.rank === 3) badges.push({icon: '🥉', text: 'Bronze', color: '#CD7F32'});

    // Performance badges
    const tweetCount = affiliate.tweetScore || 0;
    const referralCount = affiliate.botActivityScore || 0;
    const score = affiliate.total || 0;

    if (tweetCount >= 150) badges.push({icon: '📢', text: 'Tweet Machine', color: '#02F26F'});
    if (referralCount >= 50) badges.push({icon: '🔥', text: 'Top Recruiter', color: '#FF4500'});
    if (score >= 250) badges.push({icon: '⚡', text: 'Power User', color: '#00D9FF'});

    // Balanced performance (similar tweets and referrals)
    const ratio = Math.abs(tweetCount - referralCount) / Math.max(tweetCount, referralCount, 1);
    if (ratio < 0.3 && tweetCount > 20 && referralCount > 20) {
        badges.push({icon: '🎯', text: 'Balanced', color: '#9B59B6'});
    }

    // Rising star (mid-rank but high activity)
    if (affiliate.rank > 3 && affiliate.rank <= 10 && score >= 150) {
        badges.push({icon: '🚀', text: 'Rising Star', color: '#E91E63'});
    }

    return badges;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getBadges };
}
