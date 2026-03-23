// ===== MODAL FUNCTIONALITY =====

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    if (typeof playSound === 'function') {
        playSound('modal-close');
    }

    // Clean up modal content after animation to prevent memory leaks
    setTimeout(() => {
        if (!modal.classList.contains('active')) {
            // Optional: clear heavy content if modal is closed
            // This prevents memory buildup from large image sets
            const contentContainers = modal.querySelectorAll('[id$="Container"], [id$="Content"]');
            // Don't clear completely, just clear innerHTML to keep structure
        }
    }, 300); // Wait for modal close animation
}

// Close modal when clicking backdrop
function closeModalOnBackdrop(event, modalId) {
    if (event.target === event.currentTarget) {
        closeModal(modalId);
    }
}

// Open affiliate profile modal with expanded info
function openAffiliateModal(affiliate) {
    const modal = document.getElementById('profileModal');
    const content = document.getElementById('profileModalContent');

    const badges = getBadges(affiliate);
    const isTopThree = affiliate.rank <= 3;

    content.innerHTML = `
        <!-- Header with Avatar and Basic Info -->
        <div style="text-align: center; margin-bottom: var(--space-6);">
            <div style="position: relative; width: 120px; height: 120px; margin: 0 auto var(--space-4);">
                ${affiliate.imgSrc ? `
                    <img src="${affiliate.imgSrc}" alt="${affiliate.name}" loading="lazy" style="width: 100%; height: 100%; border-radius: var(--radius-full); object-fit: cover; border: 3px solid var(--neon-market-green); box-shadow: 0 0 20px var(--glow-green);" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div style="display: none; width: 100%; height: 100%; background: linear-gradient(135deg, var(--trade-green), var(--electric-mint)); border-radius: var(--radius-full); align-items: center; justify-content: center; font-family: 'Orbitron', sans-serif; font-size: 3rem; font-weight: 900; color: white; border: 3px solid var(--neon-market-green);">
                        ${affiliate.avatar}
                    </div>
                ` : `
                    <div style="width: 100%; height: 100%; background: linear-gradient(135deg, var(--trade-green), var(--electric-mint)); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; font-family: 'Orbitron', sans-serif; font-size: 3rem; font-weight: 900; color: white; border: 3px solid var(--neon-market-green);">
                        ${affiliate.avatar}
                    </div>
                `}

                <!-- Rank Badge -->
                <div style="position: absolute; top: -10px; right: -10px; width: 50px; height: 50px; background: ${isTopThree ? 'var(--neon-market-green)' : 'var(--panel-elevated)'}; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; font-family: 'Orbitron', sans-serif; font-size: 1.4rem; font-weight: 900; color: ${isTopThree ? 'var(--obsidian-navy)' : 'var(--neon-market-green)'}; border: 2px solid var(--obsidian-navy); ${isTopThree ? 'box-shadow: 0 0 15px var(--glow-green);' : ''}">
                    #${affiliate.rank}
                </div>
            </div>

            <h2 style="font-family: 'Inter', sans-serif; font-size: 2rem; font-weight: 700; color: white; margin-bottom: var(--space-2);">
                ${affiliate.name}
            </h2>
            <div style="font-family: 'Inter', sans-serif; font-size: 1.1rem; font-weight: 500; color: var(--electric-mint); margin-bottom: var(--space-4);">
                ${affiliate.handle}
            </div>

            ${affiliate.bio ? `
                <p style="font-size: 0.95rem; color: var(--text-light); line-height: 1.6; margin-bottom: var(--space-4);">
                    ${affiliate.bio}
                </p>
            ` : ''}

            ${badges.length > 0 ? `
                <div style="display: flex; flex-wrap: wrap; gap: var(--space-2); justify-content: center; margin-bottom: var(--space-6);">
                    ${badges.map(badge => `
                        <div style="display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.4rem 0.9rem; background: linear-gradient(135deg, rgba(2, 242, 111, 0.1), rgba(2, 242, 111, 0.05)); border: 1px solid ${badge.color}; border-radius: var(--radius-lg); font-size: 0.85rem; font-weight: 600; color: ${badge.color}; box-shadow: 0 0 10px ${badge.color}33;">
                            <span style="font-size: 1.1rem;">${badge.icon}</span>
                            <span style="text-transform: uppercase; letter-spacing: 0.5px;">${badge.text}</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>

        <!-- Performance Stats -->
        <div style="background: var(--panel-elevated); border-radius: var(--radius-lg); padding: var(--space-6); border: 1px solid var(--muted-slate);">
            <h3 style="font-family: 'Orbitron', sans-serif; font-size: 1.2rem; color: var(--neon-market-green); margin-bottom: var(--space-4); text-align: center; text-transform: uppercase; letter-spacing: 1px;">
                Performance Stats
            </h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-4);">
                <div style="text-align: center;">
                    <div style="font-size: 0.85rem; font-weight: 600; color: var(--electric-mint); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: var(--space-2);">
                        Tweets
                    </div>
                    <div style="font-family: 'Orbitron', sans-serif; font-size: 2.2rem; font-weight: 700; color: var(--neon-market-green); ${isTopThree ? 'text-shadow: 0 0 10px var(--glow-green);' : ''}">
                        ${affiliate.tweets || 0}
                    </div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 0.85rem; font-weight: 600; color: var(--electric-mint); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: var(--space-2);">
                        Referrals
                    </div>
                    <div style="font-family: 'Orbitron', sans-serif; font-size: 2.2rem; font-weight: 700; color: var(--neon-market-green); ${isTopThree ? 'text-shadow: 0 0 10px var(--glow-green);' : ''}">
                        ${affiliate.referrals || 0}
                    </div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 0.85rem; font-weight: 600; color: var(--electric-mint); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: var(--space-2);">
                        Score
                    </div>
                    <div style="font-family: 'Orbitron', sans-serif; font-size: 2.2rem; font-weight: 700; color: var(--neon-market-green); ${isTopThree ? 'text-shadow: 0 0 10px var(--glow-green);' : ''}">
                        ${affiliate.weeklyScore || affiliate.monthlyScore || 0}
                    </div>
                </div>
            </div>
        </div>

        <!-- Social Links -->
        ${affiliate.profileUrl ? `
            <div style="margin-top: var(--space-6); text-align: center;">
                <a href="${affiliate.profileUrl}" target="_blank" rel="noopener noreferrer" class="btn" style="display: inline-flex; align-items: center; gap: var(--space-2); padding: var(--space-4) var(--space-6); background: var(--neon-market-green); color: var(--obsidian-navy); border-radius: var(--radius-lg); font-weight: 600; text-decoration: none; transition: all 0.3s; font-size: 1rem;" onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 0 20px var(--glow-green)';" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none';">
                    <span style="font-size: 1.2rem;">𝕏</span>
                    <span>View X Profile</span>
                </a>
            </div>
        ` : ''}
    `;

    modal.style.display = 'flex';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (typeof playSound === 'function') {
        playSound('modal-open', 2);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { closeModal, closeModalOnBackdrop, openAffiliateModal };
}
