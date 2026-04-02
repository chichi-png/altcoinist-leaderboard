// ===== DASHBOARD RENDERING =====

// Render weekly affiliates dashboard with pagination - TABLE FORMAT
window.renderWeeklyDashboard = function() {
    const grid = document.getElementById('weekly-dashboard-grid');
    if (!grid) return;

    // Use filtered data if available, otherwise use full data
    const dataToUse = window.filteredWeeklyData.length > 0 ? window.filteredWeeklyData : window.weeklyData;

    // Calculate pagination
    const totalPages = Math.ceil(dataToUse.length / window.weeklyItemsPerPage);
    const startIndex = (window.weeklyCurrentPage - 1) * window.weeklyItemsPerPage;
    const endIndex = startIndex + window.weeklyItemsPerPage;
    const pageData = dataToUse.slice(startIndex, endIndex);

    // Show "no results" message if search returned nothing
    if (dataToUse.length === 0) {
        grid.innerHTML = `
            <div style="text-align: center; padding: var(--space-12); color: var(--electric-mint);">
                <div style="font-size: 3rem; margin-bottom: var(--space-4);">🔍</div>
                <div style="font-size: 1.5rem; font-weight: 600;">No affiliates found</div>
                <div style="font-size: 1rem; margin-top: var(--space-2); opacity: 0.7;">Try a different search term</div>
            </div>
        `;
        document.getElementById('weekly-pagination').innerHTML = '';
        return;
    }

    // Render as table matching all-time format
    grid.innerHTML = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: rgba(2, 242, 111, 0.1); border-bottom: 2px solid var(--neon-market-green);">
                    <th style="padding: var(--space-4); text-align: left; font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 600; color: var(--electric-mint); text-transform: uppercase;">Rank</th>
                    <th style="padding: var(--space-4); text-align: left; font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 600; color: var(--electric-mint); text-transform: uppercase;">Affiliate</th>
                    <th style="padding: var(--space-4); text-align: center; font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 600; color: var(--electric-mint); text-transform: uppercase;">Tweet Score</th>
                    <th style="padding: var(--space-4); text-align: center; font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 600; color: var(--electric-mint); text-transform: uppercase;">Bot Activity</th>
                    <th style="padding: var(--space-4); text-align: center; font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 600; color: var(--electric-mint); text-transform: uppercase;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${pageData.map((affiliate, index) => `
                    <tr class="leaderboard-row" data-rank="${affiliate.rank}" style="
                        border-bottom: 1px solid rgba(2, 242, 111, 0.15);
                        background: transparent;
                        cursor: pointer;
                        position: relative;
                        animation: slideInUp 0.5s ease-out ${index * 0.05}s both;
                    ">
                        <!-- Rank -->
                        <td style="padding: var(--space-4) var(--space-6);">
                            <div class="rank-badge" style="
                                width: 40px;
                                height: 40px;
                                background: rgba(2, 242, 111, 0.15);
                                border: 2px solid var(--neon-market-green);
                                border-radius: var(--radius-full);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-family: 'Orbitron', sans-serif;
                                font-size: 1.1rem;
                                font-weight: 900;
                                color: var(--neon-market-green);
                                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                            ">
                                ${affiliate.rank}
                            </div>
                        </td>

                        <!-- Affiliate (Avatar + Name/Handle) -->
                        <td style="padding: var(--space-4) var(--space-6);">
                            <div style="display: flex; align-items: center; gap: var(--space-4);">
                                <div class="avatar-wrapper" style="width: 50px; height: 50px; flex-shrink: 0; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
                                    ${affiliate.imgSrc ? `
                                        <img src="${affiliate.imgSrc}" alt="${affiliate.name}" loading="lazy"
                                             style="width: 100%; height: 100%; border-radius: var(--radius-lg); object-fit: cover; border: 2px solid var(--electric-mint); transition: border-color 0.3s;"
                                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                        <div style="display: none; width: 100%; height: 100%; background: linear-gradient(135deg, var(--trade-green), var(--electric-mint)); border-radius: var(--radius-lg); align-items: center; justify-content: center; font-family: 'Orbitron', sans-serif; font-size: 1.2rem; font-weight: 900; color: white;">
                                            ${affiliate.avatar}
                                        </div>
                                    ` : `
                                        <div style="width: 100%; height: 100%; background: linear-gradient(135deg, var(--trade-green), var(--electric-mint)); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; font-family: 'Orbitron', sans-serif; font-size: 1.2rem; font-weight: 900; color: white;">
                                            ${affiliate.avatar}
                                        </div>
                                    `}
                                </div>
                                <div>
                                    <div style="font-family: 'Inter', sans-serif; font-size: 1.1rem; font-weight: 700; color: white; margin-bottom: 0.25rem; transition: color 0.3s;">
                                        ${affiliate.name}
                                    </div>
                                    <div style="font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 500; color: var(--electric-mint); transition: color 0.3s;">
                                        ${affiliate.handle}
                                    </div>
                                </div>
                            </div>
                        </td>

                        <!-- Tweet Score -->
                        <td style="padding: var(--space-4) var(--space-6); text-align: center;">
                            <div class="stat-number" style="font-family: 'Orbitron', sans-serif; font-size: 1.3rem; font-weight: 700; color: var(--neon-market-green); transition: all 0.3s;">
                                ${affiliate.tweetScore || 0}
                            </div>
                        </td>

                        <!-- Bot Activity -->
                        <td style="padding: var(--space-4) var(--space-6); text-align: center;">
                            <div class="stat-number" style="font-family: 'Orbitron', sans-serif; font-size: 1.3rem; font-weight: 700; color: var(--neon-market-green); transition: all 0.3s;">
                                ${affiliate.botActivityScore || 0}
                            </div>
                        </td>

                        <!-- Total -->
                        <td style="padding: var(--space-4) var(--space-6); text-align: center;">
                            <div class="stat-number stat-total" style="font-family: 'Orbitron', sans-serif; font-size: 1.5rem; font-weight: 900; color: var(--neon-market-green); transition: all 0.3s;">
                                ${affiliate.total || 0}
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // Render pagination controls
    const paginationContainer = document.getElementById('weekly-pagination');
    if (paginationContainer) {
        paginationContainer.innerHTML = `
            <button class="btn" onclick="changeWeeklyPage(${window.weeklyCurrentPage - 1})" ${window.weeklyCurrentPage === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                <span>← Previous</span>
            </button>
            <div style="display: flex; gap: var(--space-2);">
                ${Array.from({length: totalPages}, (_, i) => i + 1).map(page => `
                    <button class="btn" onclick="changeWeeklyPage(${page})" style="${page === window.weeklyCurrentPage ? 'background: var(--neon-market-green); color: var(--obsidian-navy); font-weight: 700;' : ''} min-width: 50px;">
                        <span>${page}</span>
                    </button>
                `).join('')}
            </div>
            <button class="btn" onclick="changeWeeklyPage(${window.weeklyCurrentPage + 1})" ${window.weeklyCurrentPage === totalPages ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                <span>Next →</span>
            </button>
        `;
    }
}

window.changeWeeklyPage = function(newPage) {
    const totalPages = Math.ceil(window.weeklyData.length / window.weeklyItemsPerPage);
    if (newPage < 1 || newPage > totalPages) return;

    window.weeklyCurrentPage = newPage;
    renderWeeklyDashboard();
    if (typeof playSound === 'function') {
        playSound('card-click');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Render monthly affiliates dashboard with pagination - TABLE FORMAT
window.renderMonthlyDashboard = function() {
    const grid = document.getElementById('monthly-dashboard-grid');
    if (!grid) return;

    // Use filtered data if available, otherwise use full data
    const dataToUse = window.filteredMonthlyData.length > 0 ? window.filteredMonthlyData : window.monthlyData;

    // Calculate pagination
    const totalPages = Math.ceil(dataToUse.length / window.monthlyItemsPerPage);
    const startIndex = (window.monthlyCurrentPage - 1) * window.monthlyItemsPerPage;
    const endIndex = startIndex + window.monthlyItemsPerPage;
    const pageData = dataToUse.slice(startIndex, endIndex);

    // Show "no results" message if search returned nothing
    if (dataToUse.length === 0) {
        grid.innerHTML = `
            <div style="text-align: center; padding: var(--space-12); color: var(--electric-mint);">
                <div style="font-size: 3rem; margin-bottom: var(--space-4);">🔍</div>
                <div style="font-size: 1.5rem; font-weight: 600;">No affiliates found</div>
                <div style="font-size: 1rem; margin-top: var(--space-2); opacity: 0.7;">Try a different search term</div>
            </div>
        `;
        document.getElementById('monthly-pagination').innerHTML = '';
        return;
    }

    // Render as table matching weekly/all-time format
    grid.innerHTML = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: rgba(2, 242, 111, 0.1); border-bottom: 2px solid var(--neon-market-green);">
                    <th style="padding: var(--space-4); text-align: left; font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 600; color: var(--electric-mint); text-transform: uppercase;">Rank</th>
                    <th style="padding: var(--space-4); text-align: left; font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 600; color: var(--electric-mint); text-transform: uppercase;">Affiliate</th>
                    <th style="padding: var(--space-4); text-align: center; font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 600; color: var(--electric-mint); text-transform: uppercase;">Tweet Score</th>
                    <th style="padding: var(--space-4); text-align: center; font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 600; color: var(--electric-mint); text-transform: uppercase;">Bot Activity</th>
                    <th style="padding: var(--space-4); text-align: center; font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 600; color: var(--electric-mint); text-transform: uppercase;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${pageData.map((affiliate, index) => `
                    <tr class="leaderboard-row" data-rank="${affiliate.rank}" style="
                        border-bottom: 1px solid rgba(2, 242, 111, 0.15);
                        background: transparent;
                        cursor: pointer;
                        position: relative;
                        animation: slideInUp 0.5s ease-out ${index * 0.05}s both;
                    " onclick='openAffiliateModal(${JSON.stringify(affiliate).replace(/'/g, "&apos;")})'>
                        <!-- Rank -->
                        <td style="padding: var(--space-4) var(--space-6);">
                            <div class="rank-badge" style="
                                width: 40px;
                                height: 40px;
                                background: rgba(2, 242, 111, 0.15);
                                border: 2px solid var(--neon-market-green);
                                border-radius: var(--radius-full);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-family: 'Orbitron', sans-serif;
                                font-size: 1.1rem;
                                font-weight: 900;
                                color: var(--neon-market-green);
                                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                            ">
                                ${affiliate.rank}
                            </div>
                        </td>

                        <!-- Affiliate (Avatar + Name/Handle) -->
                        <td style="padding: var(--space-4) var(--space-6);">
                            <div style="display: flex; align-items: center; gap: var(--space-4);">
                                <div class="avatar-wrapper" style="width: 50px; height: 50px; flex-shrink: 0; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
                                    ${affiliate.imgSrc ? `
                                        <img src="${affiliate.imgSrc}" alt="${affiliate.name}" loading="lazy"
                                             style="width: 100%; height: 100%; border-radius: var(--radius-lg); object-fit: cover; border: 2px solid var(--electric-mint); transition: border-color 0.3s;"
                                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                        <div style="display: none; width: 100%; height: 100%; background: linear-gradient(135deg, var(--trade-green), var(--electric-mint)); border-radius: var(--radius-lg); align-items: center; justify-content: center; font-family: 'Orbitron', sans-serif; font-size: 1.2rem; font-weight: 900; color: white;">
                                            ${affiliate.avatar}
                                        </div>
                                    ` : `
                                        <div style="width: 100%; height: 100%; background: linear-gradient(135deg, var(--trade-green), var(--electric-mint)); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; font-family: 'Orbitron', sans-serif; font-size: 1.2rem; font-weight: 900; color: white;">
                                            ${affiliate.avatar}
                                        </div>
                                    `}
                                </div>
                                <div>
                                    <div style="font-family: 'Inter', sans-serif; font-size: 1.1rem; font-weight: 700; color: white; margin-bottom: 0.25rem; transition: color 0.3s;">
                                        ${affiliate.name}
                                    </div>
                                    <div style="font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 500; color: var(--electric-mint); transition: color 0.3s;">
                                        ${affiliate.handle}
                                    </div>
                                </div>
                            </div>
                        </td>

                        <!-- Tweet Score -->
                        <td style="padding: var(--space-4) var(--space-6); text-align: center;">
                            <div class="stat-number" style="font-family: 'Orbitron', sans-serif; font-size: 1.3rem; font-weight: 700; color: var(--neon-market-green); transition: all 0.3s;">
                                ${affiliate.tweetScore || 0}
                            </div>
                        </td>

                        <!-- Bot Activity -->
                        <td style="padding: var(--space-4) var(--space-6); text-align: center;">
                            <div class="stat-number" style="font-family: 'Orbitron', sans-serif; font-size: 1.3rem; font-weight: 700; color: var(--neon-market-green); transition: all 0.3s;">
                                ${affiliate.botActivityScore || 0}
                            </div>
                        </td>

                        <!-- Total -->
                        <td style="padding: var(--space-4) var(--space-6); text-align: center;">
                            <div class="stat-number stat-total" style="font-family: 'Orbitron', sans-serif; font-size: 1.5rem; font-weight: 900; color: var(--neon-market-green); transition: all 0.3s;">
                                ${affiliate.total || 0}
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // Render pagination controls
    const paginationContainer = document.getElementById('monthly-pagination');
    if (paginationContainer) {
        paginationContainer.innerHTML = `
            <button class="btn" onclick="changeMonthlyPage(${window.monthlyCurrentPage - 1})" ${window.monthlyCurrentPage === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                <span>← Previous</span>
            </button>
            <div style="display: flex; gap: var(--space-2);">
                ${Array.from({length: totalPages}, (_, i) => i + 1).map(page => `
                    <button class="btn" onclick="changeMonthlyPage(${page})" style="${page === window.monthlyCurrentPage ? 'background: var(--neon-market-green); color: var(--obsidian-navy); font-weight: 700;' : ''} min-width: 50px;">
                        <span>${page}</span>
                    </button>
                `).join('')}
            </div>
            <button class="btn" onclick="changeMonthlyPage(${window.monthlyCurrentPage + 1})" ${window.monthlyCurrentPage === totalPages ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                <span>Next →</span>
            </button>
        `;
    }
}

window.changeMonthlyPage = function(newPage) {
    const totalPages = Math.ceil(window.monthlyData.length / window.monthlyItemsPerPage);
    if (newPage < 1 || newPage > totalPages) return;

    window.monthlyCurrentPage = newPage;
    renderMonthlyDashboard();
    if (typeof playSound === 'function') {
        playSound('card-click');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderWeeklyDashboard,
        changeWeeklyPage,
        renderMonthlyDashboard,
        changeMonthlyPage
    };
}
