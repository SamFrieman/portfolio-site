/* ═══════════════════════════════════════════════════════
   DARKNET COMMAND CENTER — Visual Enhancements
   Samuel Frieman Portfolio
   ═══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── Custom Crosshair Cursor ── */
    function initCursor() {
        const ring = document.createElement('div');
        const dot  = document.createElement('div');
        ring.className = 'cursor-ring';
        dot.className  = 'cursor-dot';
        document.body.appendChild(ring);
        document.body.appendChild(dot);

        let mx = -100, my = -100, rx = -100, ry = -100;

        document.addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
            dot.style.left = mx + 'px';
            dot.style.top  = my + 'px';
        });

        // Smooth ring follow
        function animRing() {
            rx += (mx - rx) * 0.14;
            ry += (my - ry) * 0.14;
            ring.style.left = rx + 'px';
            ring.style.top  = ry + 'px';
            requestAnimationFrame(animRing);
        }
        animRing();

        // Hover effect on interactive elements
        const hoverSel = 'a, button, .quick-link-card, .highlight-card, .achievement-card, .tool-tag, .tag, .project-link';
        document.querySelectorAll(hoverSel).forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
        });

        // Hide on leave
        document.addEventListener('mouseleave', () => { ring.style.opacity = '0'; dot.style.opacity = '0'; });
        document.addEventListener('mouseenter', () => { ring.style.opacity = '1'; dot.style.opacity = '1'; });
    }

    /* ── Typewriter effect for subtitle ── */
    function initTypewriter() {
        const el = document.querySelector('.hero-text .title');
        if (!el) return;

        const phrases = [
            'THREAT HUNTER | OSINT EXPERT | RISK MITIGATOR',
            'ADVERSARY SIMULATION | SOC ENGINEERING',
            'DARKNET ANALYST | DEFENSE ARCHITECT',
        ];
        let pi = 0, ci = 0, deleting = false, paused = false;

        // Add cursor span
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        el.textContent = '';
        el.appendChild(cursor);

        function tick() {
            const phrase = phrases[pi];
            const current = el.textContent.replace('▌', '');

            if (paused) {
                paused = false;
                setTimeout(tick, deleting ? 50 : 2200);
                return;
            }

            if (!deleting) {
                el.textContent = phrase.slice(0, ci + 1);
                el.appendChild(cursor);
                ci++;
                if (ci === phrase.length) { deleting = true; paused = true; }
                setTimeout(tick, 55 + Math.random() * 30);
            } else {
                el.textContent = phrase.slice(0, ci - 1);
                el.appendChild(cursor);
                ci--;
                if (ci === 0) { deleting = false; paused = true; pi = (pi + 1) % phrases.length; }
                setTimeout(tick, 28);
            }
        }

        setTimeout(tick, 800);
    }

    /* ── Scroll-reveal ── */
    function initReveal() {
        const revealEls = document.querySelectorAll(
            '.story-card, .project-showcase, .ttp-category, .achievement-card, .highlight-card, .quick-link-card'
        );

        revealEls.forEach(el => el.classList.add('reveal'));

        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

        revealEls.forEach(el => io.observe(el));
    }

    /* ── Glitch trigger on hero name (random extra bursts) ── */
    function initGlitchBursts() {
        const el = document.querySelector('.glitch');
        if (!el) return;

        setInterval(() => {
            if (Math.random() < 0.3) {
                el.style.animation = 'none';
                el.style.filter = 'hue-rotate(15deg) brightness(1.3)';
                setTimeout(() => {
                    el.style.filter = '';
                    el.style.animation = '';
                }, 80 + Math.random() * 100);
            }
        }, 3500);
    }

    /* ── Nav active link highlight ── */
    function setActiveNav() {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a').forEach(a => {
            const href = a.getAttribute('href');
            if (href === path || (path === '' && href === 'index.html')) {
                a.classList.add('active');
            }
        });
    }

    /* ── Smooth anchor scrolling ── */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    /* ── Hover registration for cursor ── */
    function refreshCursorHover() {
        const hoverSel = 'a, button, .quick-link-card, .highlight-card, .achievement-card, .tool-tag, .tag, .project-link';
        const ring = document.querySelector('.cursor-ring');
        if (!ring) return;
        document.querySelectorAll(hoverSel).forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
        });
    }

    /* ── Init ── */
    function init() {
        initCursor();
        initTypewriter();
        initReveal();
        initGlitchBursts();
        setActiveNav();
        initSmoothScroll();
        setTimeout(refreshCursorHover, 100);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
