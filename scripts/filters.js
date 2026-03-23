// ===== SEARCH AND SORT FUNCTIONALITY =====

// Sort weekly affiliates
function sortWeeklyAffiliates() {
    const sortBy = document.getElementById('weekly-sort').value;
    const dataToSort = window.filteredWeeklyData.length > 0 ? window.filteredWeeklyData : window.weeklyData;

    let sorted = [...dataToSort];  // Create a copy to avoid mutating original

    switch(sortBy) {
        case 'rank':
            sorted.sort((a, b) => a.rank - b.rank);
            break;
        case 'tweets':
            sorted.sort((a, b) => (b.tweets || 0) - (a.tweets || 0));
            break;
        case 'referrals':
            sorted.sort((a, b) => (b.referrals || 0) - (a.referrals || 0));
            break;
        case 'score':
            sorted.sort((a, b) => (b.weeklyScore || 0) - (a.weeklyScore || 0));
            break;
    }

    // Update the appropriate data array
    if (window.filteredWeeklyData.length > 0) {
        window.filteredWeeklyData = sorted;
    } else {
        window.weeklyData = sorted;
    }

    window.weeklyCurrentPage = 1;  // Reset to first page
    renderWeeklyDashboard();
}

// Sort monthly affiliates
function sortMonthlyAffiliates() {
    const sortBy = document.getElementById('monthly-sort').value;
    const dataToSort = window.filteredMonthlyData.length > 0 ? window.filteredMonthlyData : window.monthlyData;

    let sorted = [...dataToSort];  // Create a copy to avoid mutating original

    switch(sortBy) {
        case 'rank':
            sorted.sort((a, b) => a.rank - b.rank);
            break;
        case 'tweets':
            sorted.sort((a, b) => (b.tweets || 0) - (a.tweets || 0));
            break;
        case 'referrals':
            sorted.sort((a, b) => (b.referrals || 0) - (a.referrals || 0));
            break;
        case 'score':
            sorted.sort((a, b) => (b.monthlyScore || 0) - (a.monthlyScore || 0));
            break;
    }

    // Update the appropriate data array
    if (window.filteredMonthlyData.length > 0) {
        window.filteredMonthlyData = sorted;
    } else {
        window.monthlyData = sorted;
    }

    window.monthlyCurrentPage = 1;  // Reset to first page
    renderMonthlyDashboard();
}

// Filter weekly affiliates based on search input
function filterWeeklyAffiliates() {
    const searchInput = document.getElementById('weekly-search');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === '') {
        window.filteredWeeklyData = window.weeklyData;
    } else {
        window.filteredWeeklyData = window.weeklyData.filter(affiliate => {
            const name = (affiliate.name || '').toLowerCase();
            const handle = (affiliate.handle || '').toLowerCase();
            return name.includes(searchTerm) || handle.includes(searchTerm);
        });
    }

    window.weeklyCurrentPage = 1; // Reset to first page
    renderWeeklyDashboard();
}

// Filter monthly affiliates based on search input
function filterMonthlyAffiliates() {
    const searchInput = document.getElementById('monthly-search');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === '') {
        window.filteredMonthlyData = window.monthlyData;
    } else {
        window.filteredMonthlyData = window.monthlyData.filter(affiliate => {
            const name = (affiliate.name || '').toLowerCase();
            const handle = (affiliate.handle || '').toLowerCase();
            return name.includes(searchTerm) || handle.includes(searchTerm);
        });
    }

    window.monthlyCurrentPage = 1; // Reset to first page
    renderMonthlyDashboard();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sortWeeklyAffiliates,
        sortMonthlyAffiliates,
        filterWeeklyAffiliates,
        filterMonthlyAffiliates
    };
}
