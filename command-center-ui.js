/**
 * COMMAND CENTER UI ENHANCEMENTS
 * Tactical interface overlay system
 * Version 2.0 - 2026-03-19
 *
 * Dynamically injects command center UI elements:
 * - Atmospheric layers (fog, scan lines)
 * - Tactical HUD (brackets, threat indicators)
 * - Data streams and radar effects
 * - Performance indicators
 */

class CommandCenterUI {
    constructor() {
        this.initialized = false;
        this.elements = {
            fog: null,
            scanOverlay: null,
            scanner: null,
            dataParticles: [],
            threatIndicators: []
        };
    }

    /**
     * Initialize all command center UI elements
     */
    init() {
        if (this.initialized) return;

        console.log('[Command Center UI] Initializing tactical interface...');

        this.injectAtmosphericLayers();
        // this.injectTacticalScanner();  // Disabled - scanner removed
        // this.injectDataStreams();       // Disabled - rain particles removed
        this.enhanceExistingCards();
        this.initPerformanceMonitoring();

        this.initialized = true;
        console.log('[Command Center UI] Tactical interface online ✓');
    }

    /**
     * Inject atmospheric depth layers
     */
    injectAtmosphericLayers() {
        // Command fog
        const fog = document.createElement('div');
        fog.className = 'command-fog';
        document.body.appendChild(fog);
        this.elements.fog = fog;

        // Scan line overlay
        const scanOverlay = document.createElement('div');
        scanOverlay.className = 'scan-overlay';
        document.body.appendChild(scanOverlay);
        this.elements.scanOverlay = scanOverlay;
    }

    /**
     * Inject tactical scanner beam
     */
    injectTacticalScanner() {
        const scanner = document.createElement('div');
        scanner.className = 'tactical-scanner';
        document.body.appendChild(scanner);
        this.elements.scanner = scanner;
    }

    /**
     * Create animated data stream particles
     */
    injectDataStreams() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.inset = '0';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '50';

        // Create 20 data particles at random positions
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'data-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 3 + 's';
            particle.style.animationDuration = (2 + Math.random() * 2) + 's';
            container.appendChild(particle);
            this.elements.dataParticles.push(particle);
        }

        document.body.appendChild(container);
    }

    /**
     * Enhance existing cards with tactical UI
     */
    enhanceExistingCards() {
        // Add tactical brackets to podium cards
        const podiumCards = document.querySelectorAll('.podium-card');
        podiumCards.forEach(card => {
            this.addTacticalBrackets(card);
            this.addThreatIndicator(card);
            this.addTargetingReticle(card);
        });

        // Add tactical brackets to hall cards
        const hallCards = document.querySelectorAll('.tactical-panel');
        hallCards.forEach(card => {
            this.addTacticalBrackets(card);
            this.addThreatIndicator(card);
        });

        // Enhance metric items with progress bars
        const metricItems = document.querySelectorAll('.metric-item');
        metricItems.forEach(item => {
            this.addStatProgress(item);
        });
    }

    /**
     * Add corner brackets to element
     */
    addTacticalBrackets(element) {
        const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        positions.forEach(pos => {
            const bracket = document.createElement('div');
            bracket.className = `tactical-bracket ${pos}`;
            element.style.position = 'relative';
            element.appendChild(bracket);
        });
    }

    /**
     * Add threat level indicator
     */
    addThreatIndicator(element) {
        const indicator = document.createElement('div');
        indicator.className = 'threat-indicator';

        // Generate 5 threat bars
        const threatLevel = Math.floor(Math.random() * 5) + 1;
        for (let i = 0; i < 5; i++) {
            const bar = document.createElement('div');
            bar.className = 'threat-bar';
            if (i < threatLevel) {
                bar.classList.add('active');
            }
            indicator.appendChild(bar);
        }

        element.appendChild(indicator);
        this.elements.threatIndicators.push(indicator);
    }

    /**
     * Add targeting reticle overlay
     */
    addTargetingReticle(element) {
        const reticle = document.createElement('div');
        reticle.className = 'targeting-reticle';

        // Add outer ring
        const ring = document.createElement('div');
        ring.style.position = 'absolute';
        ring.style.inset = '0';
        ring.style.border = '1px solid currentColor';
        ring.style.borderRadius = '50%';
        reticle.appendChild(ring);

        element.appendChild(reticle);
    }

    /**
     * Add progress bar to stat/metric items
     */
    addStatProgress(element) {
        const metricValue = element.querySelector('.metric-value');
        if (!metricValue) return;

        const progressBar = document.createElement('div');
        progressBar.className = 'stat-progress';

        const fill = document.createElement('div');
        fill.className = 'stat-progress-fill';

        // Calculate fill percentage based on value
        const value = parseInt(metricValue.textContent);
        const maxValue = 300; // Adjust based on your data
        const percentage = Math.min((value / maxValue) * 100, 100);
        fill.style.width = percentage + '%';

        progressBar.appendChild(fill);
        element.appendChild(progressBar);
    }

    /**
     * Add mission status indicators
     */
    addMissionStatus(text, container) {
        const status = document.createElement('div');
        status.className = 'mission-status';
        status.textContent = text;
        container.appendChild(status);
        return status;
    }

    /**
     * Add alert badge with count
     */
    addAlertBadge(count, element) {
        const badge = document.createElement('div');
        badge.className = 'alert-badge';
        badge.textContent = count;
        element.appendChild(badge);
        return badge;
    }

    /**
     * Monitor and display performance metrics
     */
    initPerformanceMonitoring() {
        // Add performance observer for debugging
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.duration > 50) {
                            console.warn(`[Performance] Slow operation detected: ${entry.name} (${entry.duration.toFixed(2)}ms)`);
                        }
                    }
                });
                observer.observe({ entryTypes: ['measure', 'navigation'] });
            } catch (e) {
                console.log('[Performance] Observer not available');
            }
        }
    }

    /**
     * Create radar pulse effect at coordinates
     */
    createRadarPulse(x, y) {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = x + 'px';
        container.style.top = y + 'px';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '1000';

        for (let i = 0; i < 3; i++) {
            const pulse = document.createElement('div');
            pulse.className = 'radar-pulse';
            pulse.style.animationDelay = (i * 1.3) + 's';
            container.appendChild(pulse);
        }

        document.body.appendChild(container);

        // Clean up after animation
        setTimeout(() => {
            document.body.removeChild(container);
        }, 6000);
    }

    /**
     * Toggle atmospheric effects (for performance)
     */
    toggleAtmosphere(enabled) {
        const elements = [
            this.elements.fog,
            this.elements.scanOverlay,
            this.elements.scanner
        ];

        elements.forEach(el => {
            if (el) {
                el.style.display = enabled ? 'block' : 'none';
            }
        });
    }

    /**
     * Clean up and remove all elements
     */
    destroy() {
        [
            this.elements.fog,
            this.elements.scanOverlay,
            this.elements.scanner
        ].forEach(el => {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });

        this.initialized = false;
        console.log('[Command Center UI] Tactical interface offline');
    }
}

// ========================================
// AUTO-INITIALIZATION
// ========================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommandCenter);
} else {
    initCommandCenter();
}

function initCommandCenter() {
    // Initialize command center UI
    window.commandCenterUI = new CommandCenterUI();
    window.commandCenterUI.init();

    // Add radar pulse on card clicks
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.podium-card, .tactical-panel');
        if (card) {
            const rect = card.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            window.commandCenterUI.createRadarPulse(x, y);
        }
    });

    // Performance toggle button
    const muteBtn = document.querySelector('.mute-btn');
    if (muteBtn) {
        // Add atmosphere toggle on double-click
        muteBtn.addEventListener('dblclick', () => {
            const currentState = window.commandCenterUI.elements.fog.style.display !== 'none';
            window.commandCenterUI.toggleAtmosphere(!currentState);
            console.log(`[Command Center] Atmosphere ${!currentState ? 'enabled' : 'disabled'}`);
        });
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Add tactical frame to any element
 */
window.addTacticalFrame = function(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        if (window.commandCenterUI) {
            window.commandCenterUI.addTacticalBrackets(el);
        }
    });
};

/**
 * Create mission status indicator
 */
window.createMissionStatus = function(text, parentSelector) {
    const parent = document.querySelector(parentSelector);
    if (parent && window.commandCenterUI) {
        return window.commandCenterUI.addMissionStatus(text, parent);
    }
};

/**
 * Trigger radar pulse at element
 */
window.triggerRadarPulse = function(selector) {
    const element = document.querySelector(selector);
    if (element && window.commandCenterUI) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        window.commandCenterUI.createRadarPulse(x, y);
    }
};

console.log('[Command Center] Tactical UI module loaded ✓');
