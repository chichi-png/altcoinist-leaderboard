// ===== GLOBAL STATE AND INITIALIZATION =====
// Note: Global variables are initialized in the inline script before this file loads

// Initialize on DOM ready
window.addEventListener('DOMContentLoaded', () => {
    // Initialize filtered data arrays
    window.filteredWeeklyData = window.weeklyData;
    window.filteredMonthlyData = window.monthlyData;

    // Hide loading overlay
    const initOverlay = document.getElementById('commandCenterInit');
    if (initOverlay) {
        setTimeout(() => {
            initOverlay.style.opacity = '0';
            setTimeout(() => {
                initOverlay.style.display = 'none';
            }, 500);
        }, 1200); // Show for 1.2 seconds
    }

    // Update timestamp
    const updateTimestamp = () => {
        const now = new Date();
        const options = {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        const formatted = now.toLocaleString('en-US', options);
        const timestampEl = document.getElementById('updateTimestamp');
        if (timestampEl) {
            timestampEl.textContent = formatted;
        }
    };
    updateTimestamp();

    // Highlight active page button based on current URL
    const currentPath = window.location.pathname;
    const navButtons = document.querySelectorAll('.nav-btn');

    navButtons.forEach(btn => {
        const btnPage = btn.getAttribute('data-page');

        // Check if current path matches button (home page is the default leaderboard)
        if ((currentPath.includes('/leaderboard') && (btnPage === 'home' || btnPage === 'leaderboard')) ||
            (currentPath.includes('/weekly') && btnPage === 'weekly') ||
            (currentPath.includes('/monthly') && btnPage === 'monthly') ||
            (currentPath.includes('/affiliates') && btnPage === 'affiliates')) {

            // Add active styling
            btn.style.background = 'var(--neon-market-green)';
            btn.style.color = '#0E111A';
            btn.style.fontWeight = '700';
            btn.style.boxShadow = '0 0 20px rgba(2, 242, 111, 0.6)';
            btn.classList.add('active');
        }
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Module exports if needed
    };
}
