// ===== CSV EXPORT FUNCTIONALITY =====

// Export weekly rankings to CSV
function exportWeeklyToCSV() {
    const dataToExport = window.filteredWeeklyData.length > 0 ? window.filteredWeeklyData : window.weeklyData;
    const csvContent = convertToCSV(dataToExport, 'weekly');
    downloadCSV(csvContent, 'altcoinist-weekly-rankings.csv');
}

// Export monthly rankings to CSV
function exportMonthlyToCSV() {
    const dataToExport = window.filteredMonthlyData.length > 0 ? window.filteredMonthlyData : window.monthlyData;
    const csvContent = convertToCSV(dataToExport, 'monthly');
    downloadCSV(csvContent, 'altcoinist-monthly-rankings.csv');
}

// Convert affiliate data to CSV format
function convertToCSV(data, type) {
    const scoreLabel = type === 'weekly' ? 'Weekly Score' : 'Monthly Score';
    const headers = ['Rank', 'Name', 'Handle', 'Tweets', 'Referrals', scoreLabel];
    const rows = data.map(affiliate => [
        affiliate.rank,
        `"${affiliate.name}"`,
        affiliate.handle,
        affiliate.tweets || 0,
        affiliate.referrals || 0,
        affiliate.weeklyScore || affiliate.monthlyScore || 0
    ]);

    const csvRows = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ];

    return csvRows.join('\n');
}

// Download CSV file
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Play success sound if available
    if (typeof playDigitalBeep === 'function') {
        playDigitalBeep();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { exportWeeklyToCSV, exportMonthlyToCSV, convertToCSV, downloadCSV };
}
