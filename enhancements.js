/* ═══════════════════════════════════════════════════════
   DARKNET COMMAND CENTER — Visual Enhancements v2
   Samuel Frieman Portfolio
   ═══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ─────────────────────────────────────────────────────
       CURSOR — Precision Targeting Reticle
    ───────────────────────────────────────────────────── */
    function initCursor() {
        const cv = document.createElement('canvas');
        cv.id = 'cursor-canvas';
        document.body.appendChild(cv);
        const ctx = cv.getContext('2d');

        const DPR = window.devicePixelRatio || 1;
        function resize() {
            cv.style.width  = window.innerWidth  + 'px';
            cv.style.height = window.innerHeight + 'px';
            cv.width  = window.innerWidth  * DPR;
            cv.height = window.innerHeight * DPR;
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        }
        resize();
        window.addEventListener('resize', resize);

        const CYN = [0, 245, 233];
        const AMB = [245, 166, 35];
        const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

        let mx = -300, my = -300, rx = -300, ry = -300;
        let rot = 0;
        let hovered = false;
        let visible = true;

        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
        document.addEventListener('mouseleave', () => { visible = false; });
        document.addEventListener('mouseenter', () => { visible = true; });

        function refreshHoverTargets() {
            const SEL = [
                'a', 'button',
                '.quick-link-card', '.highlight-card', '.achievement-card',
                '.tool-tag', '.tag', '.project-link', '.project-showcase',
                '.nav-links a', '.story-card',
                '.ttp-category', '.ctf-compact-card', '.profile-card',
            ].join(',');
            document.querySelectorAll(SEL).forEach(el => {
                if (el._cursorBound) return;
                el._cursorBound = true;
                el.addEventListener('mouseenter', () => { hovered = true; });
                el.addEventListener('mouseleave', () => { hovered = false; });
            });
        }
        refreshHoverTargets();

        function drawSegRing(x, y, r, color, alpha, lw, segs, gap, offset) {
            const step = (Math.PI * 2) / segs;
            ctx.strokeStyle = rgba(color, alpha);
            ctx.lineWidth   = lw;
            ctx.lineCap     = 'round';
            ctx.shadowBlur  = 0;
            for (let i = 0; i < segs; i++) {
                const s = offset + i * step + gap / 2;
                const e = offset + (i + 1) * step - gap / 2;
                ctx.beginPath();
                ctx.arc(x, y, r, s, e);
                ctx.stroke();
            }
        }

        function draw() {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            if (!visible) { requestAnimationFrame(draw); return; }

            const col  = hovered ? AMB : CYN;
            const R1   = hovered ? 14 : 11;
            const R2   = hovered ? 26 : 22;
            const spd2 = hovered ? 1.8 : 0.6;

            rx += (mx - rx) * 0.16;
            ry += (my - ry) * 0.16;
            rot += spd2;

            /* outer ring */
            drawSegRing(rx, ry, R2, col, 0.5, 1,   4, 0.38,  rot * Math.PI / 180);
            /* inner ring */
            drawSegRing(rx, ry, R1, col, 0.7, 1.2, 3, 0.55, -rot * 1.4 * Math.PI / 180);

            /* centre dot */
            ctx.beginPath();
            ctx.arc(mx, my, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = hovered ? rgba(AMB, 1) : '#ffffff';
            ctx.fill();

            /* hover pulse ring */
            if (hovered) {
                const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.008);
                ctx.beginPath();
                ctx.arc(rx, ry, R2 + 14 + pulse * 6, 0, Math.PI * 2);
                ctx.strokeStyle = rgba(AMB, 0.1 + pulse * 0.08);
                ctx.lineWidth   = 1;
                ctx.stroke();
            }

            requestAnimationFrame(draw);
        }
        requestAnimationFrame(draw);
    }

    /* ─────────────────────────────────────────────────────
       FIBONACCI GOLDEN SPIRAL — persistent background
    ───────────────────────────────────────────────────── */
    function initFibonacciBackground() {
        const cv = document.createElement('canvas');
        cv.id = 'fib-bg';
        cv.style.cssText = [
            'position:fixed',
            'bottom:-90px',
            'right:-90px',
            'pointer-events:none',
            'z-index:0',
            'opacity:0',
            'transition:opacity 3s ease',
        ].join(';');
        document.body.appendChild(cv);

        const DPR   = Math.min(window.devicePixelRatio || 1, 2);
        const DS    = 560;                    /* display size px */
        cv.style.width  = DS + 'px';
        cv.style.height = DS + 'px';
        cv.width  = DS * DPR;
        cv.height = DS * DPR;

        const ctx  = cv.getContext('2d');
        ctx.scale(DPR, DPR);

        const PHI  = (1 + Math.sqrt(5)) / 2;
        const CX   = DS / 2 + 30;
        const CY   = DS / 2 + 30;
        const FIBS = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233];
        let   ang  = 0;

        setTimeout(() => { cv.style.opacity = '0.06'; }, 1400);

        function frame() {
            ctx.clearRect(0, 0, DS, DS);
            ctx.save();
            ctx.translate(CX, CY);

            /* golden spiral path */
            ctx.beginPath();
            ctx.strokeStyle = '#00f5e9';
            ctx.lineWidth   = 0.9;
            ctx.shadowColor = '#00f5e9';
            ctx.shadowBlur  = 4;
            let first = true;

            for (let t = 0; t <= Math.PI * 14; t += 0.02) {
                const r = 1.15 * Math.pow(PHI, t * 2 / Math.PI);
                if (r > DS * 0.58) break;
                const x = r * Math.cos(t + ang);
                const y = r * Math.sin(t + ang);
                if (first) { ctx.moveTo(x, y); first = false; }
                else        ctx.lineTo(x, y);
            }
            ctx.stroke();

            /* dots at fibonacci positions along curve */
            ctx.shadowBlur = 8;
            FIBS.forEach(n => {
                const t = n * 0.13;
                const r = 1.15 * Math.pow(PHI, t * 2 / Math.PI);
                if (r > DS * 0.54) return;
                const x   = r * Math.cos(t + ang);
                const y   = r * Math.sin(t + ang);
                const fde = Math.min(1, r / 18);
                ctx.beginPath();
                ctx.arc(x, y, 2.2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,245,233,${(fde * 0.95).toFixed(3)})`;
                ctx.fill();
            });

            /* thin radial lines from centre through each dot */
            ctx.shadowBlur  = 0;
            ctx.strokeStyle = 'rgba(0,245,233,0.12)';
            ctx.lineWidth   = 0.4;
            FIBS.slice(0, 8).forEach(n => {
                const t = n * 0.13;
                const r = 1.15 * Math.pow(PHI, t * 2 / Math.PI);
                if (r > DS * 0.54) return;
                const x = r * Math.cos(t + ang);
                const y = r * Math.sin(t + ang);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(x, y);
                ctx.stroke();
            });

            ctx.restore();
            ang += 0.0022;
            requestAnimationFrame(frame);
        }
        frame();
    }

    /* ─────────────────────────────────────────────────────
       TYPEWRITER — bug-fixed version (cursor span preserved)
    ───────────────────────────────────────────────────── */
    function initTypewriter() {
        const el = document.querySelector('.hero-text .title');
        if (!el) return;

        /* two child nodes: textSpan + cursor — textContent changes
           never touch the cursor node */
        const textSpan = document.createElement('span');
        const cursor   = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        el.textContent = '';
        el.appendChild(textSpan);
        el.appendChild(cursor);

        const phrases = [
            'THREAT HUNTER | OSINT EXPERT | RISK MITIGATOR',
            'SOC ENGINEERING | ADVERSARY SIMULATION',
            'DARKNET ANALYST | DEFENSE ARCHITECT',
        ];
        let pi = 0, ci = 0, deleting = false, paused = false;

        function tick() {
            const phrase = phrases[pi];
            if (paused) {
                paused = false;
                setTimeout(tick, deleting ? 50 : 2200);
                return;
            }
            if (!deleting) {
                textSpan.textContent = phrase.slice(0, ci + 1);
                ci++;
                if (ci === phrase.length) { deleting = true; paused = true; }
                setTimeout(tick, 55 + Math.random() * 30);
            } else {
                textSpan.textContent = phrase.slice(0, ci - 1);
                ci--;
                if (ci === 0) { deleting = false; paused = true; pi = (pi + 1) % phrases.length; }
                setTimeout(tick, 28);
            }
        }
        setTimeout(tick, 800);
    }

    /* ─────────────────────────────────────────────────────
       SCROLL REVEAL — fibonacci-sequence delays (ms)
    ───────────────────────────────────────────────────── */
    function initReveal() {
        const fibMs = [0, 55, 89, 144, 233, 377, 610];
        const els   = document.querySelectorAll(
            '.story-card,.project-showcase,.ttp-category,.achievement-card,' +
            '.highlight-card,.quick-link-card,.ctf-compact-card,.profile-card'
        );

        els.forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = fibMs[i % fibMs.length] + 'ms';
        });

        const io = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

        els.forEach(el => io.observe(el));
    }

    /* ─────────────────────────────────────────────────────
       GLITCH BURSTS
    ───────────────────────────────────────────────────── */
    function initGlitchBursts() {
        const el = document.querySelector('.glitch');
        if (!el) return;
        setInterval(() => {
            if (Math.random() < 0.3) {
                el.style.animation = 'none';
                el.style.filter    = 'hue-rotate(15deg) brightness(1.3)';
                setTimeout(() => { el.style.filter = ''; el.style.animation = ''; },
                    80 + Math.random() * 100);
            }
        }, 3500);
    }

    /* ─────────────────────────────────────────────────────
       NAV ACTIVE STATE
    ───────────────────────────────────────────────────── */
    function setActiveNav() {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a').forEach(a => {
            const href = a.getAttribute('href');
            if (href === path || (path === '' && href === 'index.html')) {
                a.classList.add('active');
            }
        });
    }

    /* ─────────────────────────────────────────────────────
       SMOOTH ANCHOR SCROLL
    ───────────────────────────────────────────────────── */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                e.preventDefault();
                const t = document.querySelector(a.getAttribute('href'));
                if (t) t.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    /* ─────────────────────────────────────────────────────
       INIT
    ───────────────────────────────────────────────────── */
    function init() {
        initFibonacciBackground();
        initCursor();
        initTypewriter();
        initReveal();
        initGlitchBursts();
        setActiveNav();
        initSmoothScroll();
    }

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', init)
        : init();

}());
