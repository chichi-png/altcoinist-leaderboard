// ========================================
// AFFILIATE LEADERBOARD - GROUPBOT DESIGN
// ========================================

// Avatar Fallback Helper with multiple attempts
function getAvatarFallback(name, username) {
    const cleanName = (name || 'User').replace(/[@\n]/g, '').trim();
    const cleanUsername = (username || cleanName).replace(/[@\n]/g, '').trim();

    // Return fallback: text-based avatar with Groupbot colors (dark bg, green text)
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanUsername)}&background=0D0D0D&color=38FF93&bold=true&size=400&font-size=0.35&length=2`;
}

let avatarAttempts = new Map();

function handleAvatarError(img, name, username) {
    const imgKey = img.src;
    const attempts = avatarAttempts.get(imgKey) || 0;

    if (attempts === 0) {
        // First attempt: try with different case
        avatarAttempts.set(imgKey, 1);
        const cleanUsername = username.replace('@', '');
        img.src = `https://unavatar.io/x/${cleanUsername}`;
    } else if (attempts === 1) {
        // Second attempt: try avatars.githubusercontent.com
        avatarAttempts.set(imgKey, 2);
        const cleanUsername = username.replace('@', '');
        img.src = `https://avatars.githubusercontent.com/${cleanUsername}`;
    } else {
        // Final fallback: text-based avatar
        img.onerror = null; // Prevent infinite loop
        img.src = getAvatarFallback(name, username);
        avatarAttempts.delete(imgKey);
    }
}

// Data
let affiliatesData = [];
let weeklyData = [];
let monthlyData = [];

let filteredAlltimeData = [];
let filteredWeeklyData = [];
let filteredMonthlyData = [];
let filteredDirectoryData = [];

const itemsPerPage = 10;
const cardsPerPage = 10;

let alltimeCurrentPage = 1;
let weeklyCurrentPage = 1;
let monthlyCurrentPage = 1;
let directoryCurrentPage = 1;

// Date Range Calculations
function getCurrentWeekRange() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday

    // Start of week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);

    // End of week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // Format: "mar 10-16"
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const startMonth = months[startOfWeek.getMonth()];
    const startDay = startOfWeek.getDate();
    const endDay = endOfWeek.getDate();

    return `${startMonth} ${startDay}-${endDay}`;
}

function getCurrentMonth() {
    const months = ['january', 'february', 'march', 'april', 'may', 'june',
                    'july', 'august', 'september', 'october', 'november', 'december'];
    const now = new Date();
    const month = months[now.getMonth()];
    const year = now.getFullYear();

    return `${month} ${year}`;
}

// Load Data
async function loadData() {
    try {
        // Try to fetch from JSON file first
        let data;
        try {
            const response = await fetch('leaderboard-data.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            data = await response.json();
        } catch (fetchError) {
            // Fallback: Use embedded data if fetch fails (for file:// protocol)
            console.log('Using embedded data fallback');
            data = window.LEADERBOARD_DATA;
            if (!data) throw new Error('No data available');
        }

        affiliatesData = data.affiliates || [];
        weeklyData = data.weekly || [];
        monthlyData = data.monthly || [];

        // Load affiliate bios
        let biosData = {};
        try {
            const biosResponse = await fetch('affiliate-bios.json');
            if (biosResponse.ok) {
                biosData = await biosResponse.json();
            }
        } catch (error) {
            console.warn('Could not load affiliate bios, using defaults:', error);
        }

        // Merge bios into affiliate data
        affiliatesData = affiliatesData.map(affiliate => ({
            ...affiliate,
            bio: biosData[affiliate.handle]?.bio || 'Crypto trader | Altcoinist affiliate'
        }));

        weeklyData = weeklyData.map(affiliate => ({
            ...affiliate,
            bio: biosData[affiliate.handle]?.bio || 'Crypto trader | Altcoinist affiliate'
        }));

        monthlyData = monthlyData.map(affiliate => ({
            ...affiliate,
            bio: biosData[affiliate.handle]?.bio || 'Crypto trader | Altcoinist affiliate'
        }));

        filteredAlltimeData = [...affiliatesData];
        filteredWeeklyData = [...weeklyData];
        filteredMonthlyData = [...monthlyData];
        filteredDirectoryData = [...affiliatesData];

        // Set date ranges
        const weekRangeElement = document.getElementById('week-range');
        const monthRangeElement = document.getElementById('month-range');

        if (weekRangeElement) {
            weekRangeElement.textContent = getCurrentWeekRange();
        }
        if (monthRangeElement) {
            monthRangeElement.textContent = getCurrentMonth();
        }

        renderPodium();
        renderAlltimeTable();
        renderWeeklyGrid();
        renderMonthlyGrid();
        renderDirectoryGrid();
    } catch (error) {
        console.error('Failed to load leaderboard data:', error);

        // Show error message to user
        const errorHtml = `
            <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <h2 style="color: var(--text-primary); margin-bottom: 1rem;">Failed to Load Data</h2>
                <p>Could not load leaderboard data. Please refresh the page or try again later.</p>
                <p style="margin-top: 1rem;"><button class="btn btn-primary" onclick="location.reload()">Reload Page</button></p>
            </div>
        `;

        document.getElementById('home-page').innerHTML = errorHtml;
    }
}

// Navigation
function switchPage(pageName) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(`${pageName}-page`).classList.add('active');

    // Update active nav link using data-page attribute
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-link[data-page="${pageName}"]`);
    if (activeLink) activeLink.classList.add('active');

    window.scrollTo(0, 0);
}

// Podium
function renderPodium() {
    if (affiliatesData.length < 3) return;

    const positions = [affiliatesData[0], affiliatesData[1], affiliatesData[2]];
    const ids = ['podium-first', 'podium-second', 'podium-third'];

    positions.forEach((affiliate, index) => {
        document.getElementById(ids[index]).innerHTML = `
            <div class="podium-rank-badge">#${index + 1}</div>
            <img src="${affiliate.avatar}"
                 alt="${affiliate.name}"
                 class="podium-avatar"
                 loading="lazy"
                 onerror="handleAvatarError(this, '${affiliate.name.replace(/'/g, "\\'")}', '${affiliate.name.replace(/'/g, "\\'")}')">
            <div class="podium-name">${affiliate.name}</div>
            <div class="podium-handle">${affiliate.handle || affiliate.x_handle || ''}</div>
        `;
    });
}

// All-Time Table
function renderAlltimeTable() {
    const tbody = document.getElementById('alltime-tbody');
    const start = (alltimeCurrentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredAlltimeData.slice(start, end);

    tbody.innerHTML = pageData.map(affiliate => `
        <tr onclick="openAffiliateModal(${affiliate.rank}, 'alltime')">
            <td><span class="rank">#${affiliate.rank}</span></td>
            <td>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <img src="${affiliate.avatar}"
                         alt="${affiliate.name}"
                         loading="lazy"
                         onerror="handleAvatarError(this, '${affiliate.name.replace(/'/g, "\\'")}', '${affiliate.name.replace(/'/g, "\\'")}'')"
                         style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--card-border);">
                    <div>
                        <div style="font-weight: 600;">${affiliate.name}</div>
                    </div>
                </div>
            </td>
            <td><span class="mono">${affiliate.tweetScore}</span></td>
            <td><span class="mono">${affiliate.botActivityScore}</span></td>
            <td><span class="mono" style="color: var(--accent); font-weight: 700;">${affiliate.total}</span></td>
        </tr>
    `).join('');

    renderPagination('alltime', filteredAlltimeData.length, itemsPerPage);
}

function filterAlltimeAffiliates() {
    const searchTerm = document.getElementById('alltime-search').value.toLowerCase();
    filteredAlltimeData = affiliatesData.filter(affiliate =>
        affiliate.name.toLowerCase().includes(searchTerm) ||
        affiliate.handle.toLowerCase().includes(searchTerm)
    );
    alltimeCurrentPage = 1;
    renderAlltimeTable();
}

function sortAlltimeAffiliates() {
    const sortBy = document.getElementById('alltime-sort').value;

    if (sortBy === 'rank') {
        filteredAlltimeData.sort((a, b) => a.rank - b.rank);
    } else if (sortBy === 'score-desc') {
        filteredAlltimeData.sort((a, b) => b.total - a.total);
    } else if (sortBy === 'score-asc') {
        filteredAlltimeData.sort((a, b) => a.total - b.total);
    }

    alltimeCurrentPage = 1;
    renderAlltimeTable();
}

// Weekly Grid
function renderWeeklyGrid() {
    const grid = document.getElementById('weekly-grid');
    const start = (weeklyCurrentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    const pageData = filteredWeeklyData.slice(start, end);

    grid.innerHTML = pageData.map(affiliate => `
        <div class="affiliate-card" onclick="openAffiliateModal(${affiliate.rank}, 'weekly')">
            <div class="affiliate-header">
                <img src="${affiliate.avatar}"
                     alt="${affiliate.name}"
                     class="affiliate-avatar"
                     loading="lazy"
                     onerror="handleAvatarError(this, '${affiliate.name.replace(/'/g, "\\'")}', '${affiliate.name.replace(/'/g, "\\'")}')">
                <div class="affiliate-info">
                    <h3>${affiliate.name}</h3>
                </div>
            </div>
            <div class="affiliate-stats">
                <div class="stat-item">
                    <label>RANK</label>
                    <span class="value">#${affiliate.rank}</span>
                </div>
                <div class="stat-item">
                    <label>TOTAL SCORE</label>
                    <span class="value">${affiliate.total}</span>
                </div>
            </div>
        </div>
    `).join('');

    renderPagination('weekly', filteredWeeklyData.length, cardsPerPage);
}

function filterWeeklyAffiliates() {
    const searchTerm = document.getElementById('weekly-search').value.toLowerCase();
    filteredWeeklyData = weeklyData.filter(affiliate =>
        affiliate.name.toLowerCase().includes(searchTerm) ||
        affiliate.handle.toLowerCase().includes(searchTerm)
    );
    weeklyCurrentPage = 1;
    renderWeeklyGrid();
}

function sortWeeklyAffiliates() {
    const sortBy = document.getElementById('weekly-sort').value;

    if (sortBy === 'rank') {
        filteredWeeklyData.sort((a, b) => a.rank - b.rank);
    } else if (sortBy === 'score-desc') {
        filteredWeeklyData.sort((a, b) => b.total - a.total);
    } else if (sortBy === 'score-asc') {
        filteredWeeklyData.sort((a, b) => a.total - b.total);
    }

    weeklyCurrentPage = 1;
    renderWeeklyGrid();
}

// Monthly Grid
function renderMonthlyGrid() {
    const grid = document.getElementById('monthly-grid');
    const start = (monthlyCurrentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    const pageData = filteredMonthlyData.slice(start, end);

    grid.innerHTML = pageData.map(affiliate => `
        <div class="affiliate-card" onclick="openAffiliateModal(${affiliate.rank}, 'monthly')">
            <div class="affiliate-header">
                <img src="${affiliate.avatar}"
                     alt="${affiliate.name}"
                     class="affiliate-avatar"
                     loading="lazy"
                     onerror="handleAvatarError(this, '${affiliate.name.replace(/'/g, "\\'")}', '${affiliate.name.replace(/'/g, "\\'")}')">
                <div class="affiliate-info">
                    <h3>${affiliate.name}</h3>
                </div>
            </div>
            <div class="affiliate-stats">
                <div class="stat-item">
                    <label>RANK</label>
                    <span class="value">#${affiliate.rank}</span>
                </div>
                <div class="stat-item">
                    <label>TOTAL SCORE</label>
                    <span class="value">${affiliate.total}</span>
                </div>
            </div>
        </div>
    `).join('');

    renderPagination('monthly', filteredMonthlyData.length, cardsPerPage);
}

function filterMonthlyAffiliates() {
    const searchTerm = document.getElementById('monthly-search').value.toLowerCase();
    filteredMonthlyData = monthlyData.filter(affiliate =>
        affiliate.name.toLowerCase().includes(searchTerm) ||
        affiliate.handle.toLowerCase().includes(searchTerm)
    );
    monthlyCurrentPage = 1;
    renderMonthlyGrid();
}

function sortMonthlyAffiliates() {
    const sortBy = document.getElementById('monthly-sort').value;

    if (sortBy === 'rank') {
        filteredMonthlyData.sort((a, b) => a.rank - b.rank);
    } else if (sortBy === 'score-desc') {
        filteredMonthlyData.sort((a, b) => b.total - a.total);
    } else if (sortBy === 'score-asc') {
        filteredMonthlyData.sort((a, b) => a.total - b.total);
    }

    monthlyCurrentPage = 1;
    renderMonthlyGrid();
}

// Directory Grid
function renderDirectoryGrid() {
    const grid = document.getElementById('directory-grid');
    const start = (directoryCurrentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    const pageData = filteredDirectoryData.slice(start, end);

    grid.innerHTML = pageData.map(affiliate => `
        <div class="directory-card">
            <div class="directory-header">
                <img src="${affiliate.avatar}"
                     alt="${affiliate.name}"
                     class="directory-avatar"
                     loading="lazy"
                     onerror="handleAvatarError(this, '${affiliate.name.replace(/'/g, "\\'")}', '${affiliate.name.replace(/'/g, "\\'")}')">
                <div class="directory-info">
                    <h3>${affiliate.name}</h3>
                </div>
            </div>

            <div class="directory-links">
                ${affiliate.xUrl ? `<a href="${affiliate.xUrl}" target="_blank" class="directory-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Twitter
                </a>` : ''}
                ${affiliate.tgHandle ? `<a href="https://t.me/${affiliate.tgHandle.replace('@', '')}" target="_blank" class="directory-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                    </svg>
                    Telegram
                </a>` : ''}
            </div>
        </div>
    `).join('');

    renderPagination('directory', filteredDirectoryData.length, cardsPerPage);
}

function filterDirectory() {
    const searchTerm = document.getElementById('directory-search').value.toLowerCase();
    filteredDirectoryData = affiliatesData.filter(affiliate =>
        affiliate.name.toLowerCase().includes(searchTerm) ||
        affiliate.handle.toLowerCase().includes(searchTerm)
    );
    directoryCurrentPage = 1;
    renderDirectoryGrid();
}

function sortDirectory() {
    const sortBy = document.getElementById('directory-sort').value;

    if (sortBy === 'name') {
        filteredDirectoryData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
        filteredDirectoryData.sort((a, b) => b.name.localeCompare(a.name));
    }

    directoryCurrentPage = 1;
    renderDirectoryGrid();
}

// Pagination
function renderPagination(type, totalItems, itemsPerPageCount) {
    const paginationContainer = document.getElementById(`${type}-pagination`);
    const totalPages = Math.ceil(totalItems / itemsPerPageCount);

    let currentPage;
    if (type === 'alltime') currentPage = alltimeCurrentPage;
    else if (type === 'weekly') currentPage = weeklyCurrentPage;
    else if (type === 'monthly') currentPage = monthlyCurrentPage;
    else if (type === 'directory') currentPage = directoryCurrentPage;

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let html = '';
    html += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage('${type}', ${currentPage - 1})" aria-label="Previous page">←</button>`;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage('${type}', ${i})" aria-label="Page ${i}">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span style="color: var(--text-tertiary);" aria-hidden="true">...</span>`;
        }
    }

    html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage('${type}', ${currentPage + 1})" aria-label="Next page">→</button>`;
    paginationContainer.innerHTML = html;
}

function goToPage(type, page) {
    if (type === 'alltime') {
        const maxPage = Math.ceil(filteredAlltimeData.length / itemsPerPage);
        if (page < 1 || page > maxPage) return;
        alltimeCurrentPage = page;
        renderAlltimeTable();
    } else if (type === 'weekly') {
        const maxPage = Math.ceil(filteredWeeklyData.length / cardsPerPage);
        if (page < 1 || page > maxPage) return;
        weeklyCurrentPage = page;
        renderWeeklyGrid();
    } else if (type === 'monthly') {
        const maxPage = Math.ceil(filteredMonthlyData.length / cardsPerPage);
        if (page < 1 || page > maxPage) return;
        monthlyCurrentPage = page;
        renderMonthlyGrid();
    } else if (type === 'directory') {
        const maxPage = Math.ceil(filteredDirectoryData.length / cardsPerPage);
        if (page < 1 || page > maxPage) return;
        directoryCurrentPage = page;
        renderDirectoryGrid();
    }
    window.scrollTo(0, 0);
}

// Modal
function openAffiliateModal(rank, source = 'alltime') {
    let affiliate;

    // Look up affiliate from the correct source data
    if (source === 'weekly') {
        affiliate = weeklyData.find(a => a.rank === rank);
    } else if (source === 'monthly') {
        affiliate = monthlyData.find(a => a.rank === rank);
    } else if (source === 'directory') {
        affiliate = affiliatesData.find(a => a.rank === rank);
    } else {
        affiliate = affiliatesData.find(a => a.rank === rank);
    }

    if (!affiliate) {
        console.error(`Affiliate with rank ${rank} not found in ${source} data`);
        return;
    }

    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <img src="${affiliate.avatar}"
                 alt="${affiliate.name}"
                 loading="lazy"
                 onerror="handleAvatarError(this, '${affiliate.name.replace(/'/g, "\\'")}', '${affiliate.name.replace(/'/g, "\\'")}'))"
                 style="width: 120px; height: 120px; border-radius: 50%; border: 3px solid var(--card-border);">
            <h2 style="margin-top: 1rem; font-size: 1.5rem;">${affiliate.name}</h2>
            ${source === 'directory' ? `<p style="margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.875rem; max-width: 400px; margin-left: auto; margin-right: auto; line-height: 1.5;">
                ${affiliate.bio || 'Crypto trader | Altcoinist affiliate'}
            </p>` : ''}
            ${source === 'directory' && affiliate.profileUrl ? `<p style="margin-top: 0.75rem;"><a href="${affiliate.profileUrl}" target="_blank" style="color: var(--accent); text-decoration: none;">View Profile →</a></p>` : ''}
        </div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">#${affiliate.rank}</div>
                <div class="stat-label">Rank</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" style="color: var(--accent);">${affiliate.total}</div>
                <div class="stat-label">Total Score</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${affiliate.tweetScore}</div>
                <div class="stat-label">Tweet Score</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${affiliate.botActivityScore}</div>
                <div class="stat-label">Bot Activity</div>
            </div>
        </div>
    `;

    document.getElementById('affiliate-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('affiliate-modal').classList.remove('active');
}

function closeModalOnBackdrop(event) {
    if (event.target === document.getElementById('affiliate-modal')) {
        closeModal();
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    loadData();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});
