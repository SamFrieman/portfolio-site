// Client-side security hardening including XSS prevention,
// input sanitization, clickjacking detection, and more

(function() {
    'use strict';

    // SECURITY CONFIGURATION
    const SECURITY_CONFIG = {
        enableClickjackProtection: true,
        enableXSSProtection: true,
        enableConsoleWarning: true,
        enableDevToolsDetection: true,
        enableContextMenuProtection: false, // Set to true to disable right-click
        enableCopyProtection: false, // Set to true to prevent content copying
        logSecurityEvents: true
    };
    
    // XSS PROTECTION & INPUT SANITIZATION 
    /**
     * HTML entity encode function to prevent XSS
     */
    function sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    /**
     * Advanced XSS pattern detection
     */
    function detectXSS(input) {
        const xssPatterns = [
            /<script[^>]*>.*?<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /<iframe[^>]*>/gi,
            /<object[^>]*>/gi,
            /<embed[^>]*>/gi,
            /<img[^>]*onerror/gi,
            /eval\(/gi,
            /expression\(/gi,
            /vbscript:/gi,
            /data:text\/html/gi,
            /<svg[^>]*onload/gi
        ];

        return xssPatterns.some(pattern => pattern.test(input));
    }

    /**
     * Sanitize all user inputs
     */
    function sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        // Remove any potentially dangerous characters
        let sanitized = input.replace(/[<>\"']/g, '');
        
        // Remove script tags and event handlers
        sanitized = sanitized.replace(/javascript:/gi, '');
        sanitized = sanitized.replace(/on\w+=/gi, '');
        
        return sanitized;
    }
    
    // CLICKJACKING PROTECTION
    /**
     * Detect if page is loaded in an iframe (clickjacking attempt)
     */
    function detectClickjacking() {
        if (window.self !== window.top) {
            // Page is in an iframe
            if (SECURITY_CONFIG.enableClickjackProtection) {
                // Bust out of the frame
                window.top.location = window.self.location;
                
                // Log security event
                logSecurityEvent('CLICKJACKING_ATTEMPT', {
                    parentURL: document.referrer,
                    timestamp: new Date().toISOString()
                });
                
                return true;
            }
        }
        return false;
    }
    
    // CONSOLE PROTECTION
    /**
     * Display security warning in console
     */
    function displayConsoleWarning() {
        if (!SECURITY_CONFIG.enableConsoleWarning) return;

        const styles = [
            'color: #FF3E3E',
            'font-size: 20px',
            'font-weight: bold',
            'text-shadow: 2px 2px 0px #000'
        ].join(';');

        const messageStyles = [
            'color: #66FCF1',
            'font-size: 14px'
        ].join(';');

        console.log('%c⚠️ SECURITY WARNING ⚠️', styles);
        console.log('%cThis is a browser feature intended for developers. If someone told you to copy-paste something here, it is likely a scam and could compromise your security.', messageStyles);
        console.log('%cFor more information about security, visit: https://en.wikipedia.org/wiki/Self-XSS', messageStyles);
    }
    
    // DEVTOOLS DETECTION
    let devtoolsOpen = false;
    
    /**
     * Detect if developer tools are open
     */
    function detectDevTools() {
        if (!SECURITY_CONFIG.enableDevToolsDetection) return;

        const threshold = 160;
        
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
            if (!devtoolsOpen) {
                devtoolsOpen = true;
                displayConsoleWarning();
                logSecurityEvent('DEVTOOLS_OPENED', {
                    timestamp: new Date().toISOString()
                });
            }
        } else {
            devtoolsOpen = false;
        }
    }

    // FORM PROTECTION (if forms are added)
    /**
     * Sanitize form inputs before submission
     */
    function protectForms() {
        document.addEventListener('submit', function(e) {
            const form = e.target;
            const inputs = form.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                const value = input.value;
                
                // Check for XSS patterns
                if (detectXSS(value)) {
                    e.preventDefault();
                    alert('Invalid input detected. Please remove special characters and try again.');
                    logSecurityEvent('XSS_ATTEMPT_BLOCKED', {
                        field: input.name || input.id,
                        timestamp: new Date().toISOString()
                    });
                    return;
                }
                
                // Sanitize the input
                input.value = sanitizeInput(value);
            });
        });
    }

    // LINK PROTECTION
    /**
     * Add security attributes to external links
     */
    function secureExternalLinks() {
        const links = document.querySelectorAll('a[href^="http"]');
        
        links.forEach(link => {
            const url = new URL(link.href);
            
            // Check if link is external
            if (url.hostname !== window.location.hostname) {
                // Add security attributes
                link.setAttribute('rel', 'noopener noreferrer');
                link.setAttribute('target', '_blank');
                
                // Optional: Add warning for external links
                link.addEventListener('click', function(e) {
                    const confirmed = confirm('You are leaving this site. Continue?');
                    if (!confirmed) {
                        e.preventDefault();
                    }
                });
            }
        });
    }

    // CONTENT PROTECTION
    /**
     * Disable right-click context menu (optional)
     */
    function disableContextMenu() {
        if (!SECURITY_CONFIG.enableContextMenuProtection) return;
        
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            logSecurityEvent('CONTEXT_MENU_BLOCKED', {
                timestamp: new Date().toISOString()
            });
            return false;
        });
    }

    /**
     * Prevent content copying (optional)
     */
    function disableCopyPaste() {
        if (!SECURITY_CONFIG.enableCopyProtection) return;
        
        document.addEventListener('copy', function(e) {
            e.preventDefault();
            logSecurityEvent('COPY_BLOCKED', {
                timestamp: new Date().toISOString()
            });
            return false;
        });

        document.addEventListener('cut', function(e) {
            e.preventDefault();
            return false;
        });
    }

    /**
     * Disable F12, Ctrl+Shift+I, Ctrl+U (optional - NOT RECOMMENDED for legitimate users)
     */
    function disableDevToolsShortcuts() {
        // Commented out by default - only use if absolutely necessary
        /*
        document.addEventListener('keydown', function(e) {
            // F12
            if (e.keyCode === 123) {
                e.preventDefault();
                return false;
            }
            // Ctrl+Shift+I
            if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
                e.preventDefault();
                return false;
            }
            // Ctrl+U
            if (e.ctrlKey && e.keyCode === 85) {
                e.preventDefault();
                return false;
            }
        });
        */
    }

    // SECURITY EVENT LOGGING
    /**
     * Log security events (to console or external service)
     */
    function logSecurityEvent(eventType, details) {
        if (!SECURITY_CONFIG.logSecurityEvents) return;
        
        const event = {
            type: eventType,
            details: details,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString()
        };
        
        console.warn('[SECURITY EVENT]', event);
        
        // Optional: Send to external logging service
        // sendToLoggingService(event);
    }
    
    // SECURITY HEADERS VALIDATION
    /**
     * Check if security headers are properly set
     */
    function validateSecurityHeaders() {
        fetch(window.location.href, { method: 'HEAD' })
            .then(response => {
                const headers = response.headers;
                
                const securityHeaders = {
                    'X-Frame-Options': headers.get('X-Frame-Options'),
                    'X-XSS-Protection': headers.get('X-XSS-Protection'),
                    'X-Content-Type-Options': headers.get('X-Content-Type-Options'),
                    'Strict-Transport-Security': headers.get('Strict-Transport-Security'),
                    'Content-Security-Policy': headers.get('Content-Security-Policy')
                };
                
                console.log('[SECURITY] Headers:', securityHeaders);
                
                // Warn if critical headers are missing
                if (!securityHeaders['X-Frame-Options']) {
                    console.warn('[SECURITY] X-Frame-Options header is missing!');
                }
            })
            .catch(err => {
                console.error('[SECURITY] Could not validate headers:', err);
            });
    }

    // SESSION SECURITY
    /**
     * Clear sensitive data on page unload
     */
    function clearSessionData() {
        window.addEventListener('beforeunload', function() {
            // Clear any sensitive session storage
            sessionStorage.clear();
            
            // Clear any sensitive local storage (be careful with this)
            // localStorage.clear();
        });
    }

    // HTTPS ENFORCEMENT
    /**
     * Redirect to HTTPS if on HTTP
     */
    function enforceHTTPS() {
        if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
            window.location.href = 'https://' + window.location.hostname + window.location.pathname + window.location.search;
        }
    }

    // INITIALIZATION
    /**
     * Initialize all security measures
     */
    function initSecurity() {
        // Enforce HTTPS
        enforceHTTPS();
        
        // Detect and prevent clickjacking
        detectClickjacking();
        
        // Display console warning
        displayConsoleWarning();
        
        // Monitor for DevTools
        setInterval(detectDevTools, 1000);
        
        // Secure external links
        secureExternalLinks();
        
        // Protect forms
        protectForms();
        
        // Optional content protection
        disableContextMenu();
        disableCopyPaste();
        
        // Clear session data on unload
        clearSessionData();
        
        // Validate security headers
        validateSecurityHeaders();
        
        // Log initialization
        logSecurityEvent('SECURITY_INITIALIZED', {
            timestamp: new Date().toISOString(),
            config: SECURITY_CONFIG
        });
    }

    // DOM CONTENT LOADED
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSecurity);
    } else {
        initSecurity();
    }

    // EXPORT SANITIZATION FUNCTIONS (if needed)
    window.PortfolioSecurity = {
        sanitizeHTML: sanitizeHTML,
        sanitizeInput: sanitizeInput,
        detectXSS: detectXSS,
        logSecurityEvent: logSecurityEvent
    };

})();

// ORIGINAL PORTFOLIO FUNCTIONALITY
// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.story-card, .project-showcase, .ttp-category, .achievement-card, .highlight-card, .quick-link-card').forEach(el => {
    observer.observe(el);
});
