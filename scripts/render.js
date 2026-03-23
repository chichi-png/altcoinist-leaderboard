// ===== DASHBOARD RENDERING =====

// Render weekly affiliates dashboard with pagination
function renderWeeklyDashboard() {
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
            <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-12); color: var(--electric-mint);">
                <div style="font-size: 3rem; margin-bottom: var(--space-4);">🔍</div>
                <div style="font-size: 1.5rem; font-weight: 600;">No affiliates found</div>
                <div style="font-size: 1rem; margin-top: var(--space-2); opacity: 0.7;">Try a different search term</div>
            </div>
        `;
        document.getElementById('weekly-pagination').innerHTML = '';
        return;
    }

    grid.innerHTML = pageData.map(affiliate => {
        const isTopThree = affiliate.rank <= 3;
        const borderColor = isTopThree ? 'var(--neon-market-green)' : 'var(--muted-slate)';
        const glowEffect = isTopThree ? 'box-shadow: 0 0 20px var(--glow-green), 0 4px 12px rgba(0, 0, 0, 0.5);' : 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);';

        return `
            <div class="weekly-affiliate-card" style="
                background: var(--panel-dark);
                border: 2px solid ${borderColor};
                border-radius: var(--radius-xl);
                padding: var(--space-6);
                position: relative;
                overflow: hidden;
                transition: all var(--transition-base);
                ${glowEffect}
                cursor: pointer;
            " onmouseover="this.style.borderColor='var(--neon-market-green)'; this.style.boxShadow='0 0 25px var(--glow-green), 0 6px 16px rgba(0, 0, 0, 0.6)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='${borderColor}'; this.style.boxShadow='${glowEffect}'; this.style.transform='translateY(0)';" onclick='openAffiliateModal(${JSON.stringify(affiliate).replace(/'/g, "&apos;")})'>

                <!-- Rank Badge -->
                <div style="
                    position: absolute;
                    top: var(--space-4);
                    left: var(--space-4);
                    width: 40px;
                    height: 40px;
                    background: ${isTopThree ? 'var(--neon-market-green)' : 'var(--panel-elevated)'};
                    border-radius: var(--radius-full);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Orbitron', sans-serif;
                    font-size: 1.2rem;
                    font-weight: 900;
                    color: ${isTopThree ? 'var(--obsidian-navy)' : 'var(--neon-market-green)'};
                    ${isTopThree ? 'box-shadow: 0 0 15px var(--glow-green);' : ''}
                ">
                    ${affiliate.rank}
                </div>

                <!-- Profile Section -->
                <div style="display: flex; align-items: center; gap: var(--space-4); margin-top: var(--space-8); margin-bottom: var(--space-6);">
                    <!-- Avatar -->
                    <div style="position: relative; width: 70px; height: 70px; flex-shrink: 0;">
                        ${affiliate.imgSrc ? `
                            <img src="${affiliate.imgSrc}" alt="${affiliate.name}" loading="lazy" style="width: 100%; height: 100%; border-radius: var(--radius-lg); object-fit: cover; border: 2px solid var(--electric-mint);" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div style="display: none; width: 100%; height: 100%; background: linear-gradient(135deg, var(--trade-green), var(--electric-mint)); border-radius: var(--radius-lg); align-items: center; justify-content: center; font-family: 'Orbitron', sans-serif; font-size: 1.5rem; font-weight: 900; color: white;">
                                ${affiliate.avatar}
                            </div>
                        ` : `
                            <div style="width: 100%; height: 100%; background: linear-gradient(135deg, var(--trade-green), var(--electric-mint)); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; font-family: 'Orbitron', sans-serif; font-size: 1.5rem; font-weight: 900; color: white;">
                                ${affiliate.avatar}
                            </div>
                        `}
                    </div>

                    <!-- Name & Handle -->
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-family: 'Inter', sans-serif; font-size: 1.3rem; font-weight: 700; color: white; margin-bottom: var(--space-1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${affiliate.name}
                        </div>
                        <div style="font-family: 'Inter', sans-serif; font-size: 0.95rem; font-weight: 500; color: var(--electric-mint); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${affiliate.handle}
                        </div>
                    </div>
                </div>

                <!-- Metrics Grid -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); padding-top: var(--space-4); border-top: 1px solid var(--muted-slate);">
                    <!-- Tweets -->
                    <div style="text-align: center;">
                        <div style="font-size: 0.85rem; font-weight: 600; color: var(--electric-mint); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: var(--space-2);">
                            Tweets
                        </div>
                        <div style="font-family: 'Orbitron', sans-serif; font-size: 1.8rem; font-weight: 700; color: var(--neon-market-green);">
                            ${affiliate.tweets}
                        </div>
                    </div>

                    <!-- Referrals -->
                    <div style="text-align: center;">
                        <div style="font-size: 0.85rem; font-weight: 600; color: var(--electric-mint); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: var(--space-2);">
                            Referrals
                        </div>
                        <div style="font-family: 'Orbitron', sans-serif; font-size: 1.8rem; font-weight: 700; color: var(--neon-market-green);">
                            ${affiliate.referrals}
                        </div>
                    </div>

                    <!-- Weekly Score -->
                    <div style="text-align: center;">
                        <div style="font-size: 0.85rem; font-weight: 600; color: var(--electric-mint); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: var(--space-2);">
                            Score
                        </div>
                        <div style="font-family: 'Orbitron', sans-serif; font-size: 1.8rem; font-weight: 700; color: var(--neon-market-green); ${isTopThree ? 'text-shadow: 0 0 10px var(--glow-green);' : ''}">
                            ${affiliate.weeklyScore}
                        </div>
                    </div>
                </div>

                <!-- Achievement Badges -->
                ${getBadges(affiliate).length > 0 ? `
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-2); margin-top: var(--space-4); padding-top: var(--space-4); border-top: 1px solid var(--muted-slate);">
                        ${getBadges(affiliate).map(badge => `
                            <div style="
                                display: inline-flex;
                                align-items: center;
                                gap: 0.3rem;
                                padding: 0.35rem 0.75rem;
                                background: linear-gradient(135deg, rgba(2, 242, 111, 0.1), rgba(2, 242, 111, 0.05));
                                border: 1px solid ${badge.color};
                                border-radius: var(--radius-lg);
                                font-size: 0.75rem;
                                font-weight: 600;
                                color: ${badge.color};
                                box-shadow: 0 0 10px ${badge.color}33;
                                transition: all 0.2s;
                            " onmouseover="this.style.boxShadow='0 0 15px ${badge.color}66'; this.style.transform='scale(1.05)';" onmouseout="this.style.boxShadow='0 0 10px ${badge.color}33'; this.style.transform='scale(1)';">
                                <span style="font-size: 1rem;">${badge.icon}</span>
                                <span style="text-transform: uppercase; letter-spacing: 0.5px;">${badge.text}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

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

function changeWeeklyPage(newPage) {
    const totalPages = Math.ceil(window.weeklyData.length / window.weeklyItemsPerPage);
    if (newPage < 1 || newPage > totalPages) return;

    window.weeklyCurrentPage = newPage;
    renderWeeklyDashboard();
    if (typeof playSound === 'function') {
        playSound('card-click');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Render monthly affiliates dashboard with pagination
function renderMonthlyDashboard() {
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
            <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-12); color: var(--electric-mint);">
                <div style="font-size: 3rem; margin-bottom: var(--space-4);">🔍</div>
                <div style="font-size: 1.5rem; font-weight: 600;">No affiliates found</div>
                <div style="font-size: 1rem; margin-top: var(--space-2); opacity: 0.7;">Try a different search term</div>
            </div>
        `;
        document.getElementById('monthly-pagination').innerHTML = '';
        return;
    }

    grid.innerHTML = pageData.map(affiliate => {
        const isTopThree = affiliate.rank <= 3;
        const borderColor = isTopThree ? 'var(--neon-market-green)' : 'var(--muted-slate)';
        const glowEffect = isTopThree ? 'box-shadow: 0 0 20px var(--glow-green), 0 4px 12px rgba(0, 0, 0, 0.5);' : 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);';

        return `
            <div class="monthly-affiliate-card" style="
                background: var(--panel-dark);
                border: 2px solid ${borderColor};
                border-radius: var(--radius-xl);
                padding: var(--space-6);
                position: relative;
                overflow: hidden;
                transition: all var(--transition-base);
                ${glowEffect}
                cursor: pointer;
            " onmouseover="this.style.borderColor='var(--neon-market-green)'; this.style.boxShadow='0 0 25px var(--glow-green), 0 6px 16px rgba(0, 0, 0, 0.6)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='${borderColor}'; this.style.boxShadow='${glowEffect}'; this.style.transform='translateY(0)';" onclick='openAffiliateModal(${JSON.stringify(affiliate).replace(/'/g, "&apos;")})'>

                <!-- Rank Badge -->
                <div style="
                    position: absolute;
                    top: var(--space-4);
                    left: var(--space-4);
                    width: 40px;
                    height: 40px;
                    background: ${isTopThree ? 'var(--neon-market-green)' : 'var(--panel-elevated)'};
                    border-radius: var(--radius-full);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Orbitron', sans-serif;
                    font-size: 1.2rem;
                    font-weight: 900;
                    color: ${isTopThree ? 'var(--obsidian-navy)' : 'var(--neon-market-green)'};
                    ${isTopThree ? 'box-shadow: 0 0 15px var(--glow-green);' : ''}
                ">
                    ${affiliate.rank}
                </div>

                <!-- Profile Section -->
                <div style="display: flex; align-items: center; gap: var(--space-4); margin-top: var(--space-8); margin-bottom: var(--space-6);">
                    <!-- Avatar -->
                    <div style="position: relative; width: 70px; height: 70px; flex-shrink: 0;">
                        ${affiliate.imgSrc ? `
                            <img src="${affiliate.imgSrc}" alt="${affiliate.name}" loading="lazy" style="width: 100%; height: 100%; border-radius: var(--radius-lg); object-fit: cover; border: 2px solid var(--electric-mint);" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div style="display: none; width: 100%; height: 100%; background: linear-gradient(135deg, var(--trade-green), var(--electric-mint)); border-radius: var(--radius-lg); align-items: center; justify-content: center; font-family: 'Orbitron', sans-serif; font-size: 1.5rem; font-weight: 900; color: white;">
                                ${affiliate.avatar}
                            </div>
                        ` : `
                            <div style="width: 100%; height: 100%; background: linear-gradient(135deg, var(--trade-green), var(--electric-mint)); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; font-family: 'Orbitron', sans-serif; font-size: 1.5rem; font-weight: 900; color: white;">
                                ${affiliate.avatar}
                            </div>
                        `}
                    </div>

                    <!-- Name & Handle -->
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-family: 'Inter', sans-serif; font-size: 1.3rem; font-weight: 700; color: white; margin-bottom: var(--space-1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${affiliate.name}
                        </div>
                        <div style="font-family: 'Inter', sans-serif; font-size: 0.95rem; font-weight: 500; color: var(--electric-mint); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${affiliate.handle}
                        </div>
                    </div>
                </div>

                <!-- Metrics Grid -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4); padding-top: var(--space-4); border-top: 1px solid var(--muted-slate);">
                    <!-- Tweets -->
                    <div style="text-align: center;">
                        <div style="font-size: 0.85rem; font-weight: 600; color: var(--electric-mint); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: var(--space-2);">
                            Tweets
                        </div>
                        <div style="font-family: 'Orbitron', sans-serif; font-size: 1.8rem; font-weight: 700; color: var(--neon-market-green);">
                            ${affiliate.tweets}
                        </div>
                    </div>

                    <!-- Referrals -->
                    <div style="text-align: center;">
                        <div style="font-size: 0.85rem; font-weight: 600; color: var(--electric-mint); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: var(--space-2);">
                            Referrals
                        </div>
                        <div style="font-family: 'Orbitron', sans-serif; font-size: 1.8rem; font-weight: 700; color: var(--neon-market-green);">
                            ${affiliate.referrals}
                        </div>
                    </div>

                    <!-- Monthly Score -->
                    <div style="text-align: center;">
                        <div style="font-size: 0.85rem; font-weight: 600; color: var(--electric-mint); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: var(--space-2);">
                            Score
                        </div>
                        <div style="font-family: 'Orbitron', sans-serif; font-size: 1.8rem; font-weight: 700; color: var(--neon-market-green); ${isTopThree ? 'text-shadow: 0 0 10px var(--glow-green);' : ''}">
                            ${affiliate.monthlyScore}
                        </div>
                    </div>
                </div>

                <!-- Achievement Badges -->
                ${getBadges(affiliate).length > 0 ? `
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-2); margin-top: var(--space-4); padding-top: var(--space-4); border-top: 1px solid var(--muted-slate);">
                        ${getBadges(affiliate).map(badge => `
                            <div style="
                                display: inline-flex;
                                align-items: center;
                                gap: 0.3rem;
                                padding: 0.35rem 0.75rem;
                                background: linear-gradient(135deg, rgba(2, 242, 111, 0.1), rgba(2, 242, 111, 0.05));
                                border: 1px solid ${badge.color};
                                border-radius: var(--radius-lg);
                                font-size: 0.75rem;
                                font-weight: 600;
                                color: ${badge.color};
                                box-shadow: 0 0 10px ${badge.color}33;
                                transition: all 0.2s;
                            " onmouseover="this.style.boxShadow='0 0 15px ${badge.color}66'; this.style.transform='scale(1.05)';" onmouseout="this.style.boxShadow='0 0 10px ${badge.color}33'; this.style.transform='scale(1)';">
                                <span style="font-size: 1rem;">${badge.icon}</span>
                                <span style="text-transform: uppercase; letter-spacing: 0.5px;">${badge.text}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

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

function changeMonthlyPage(newPage) {
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
