/* ═══════════════════════════════════════════════════════
   DARKNET COMMAND CENTER — Visual Enhancements
   Samuel Frieman Portfolio
   ═══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── Canvas Cursor — Precision Targeting Reticle ── */
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
        let px = -300, py = -300;
        let rot = 0;
        let hovered = false;
        let visible = true;

        const TRAIL = 18;
        const hist  = Array(TRAIL).fill(null).map(() => ({ x: -300, y: -300 }));
        let histFrame = 0;

        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
        document.addEventListener('mouseleave', () => { visible = false; });
        document.addEventListener('mouseenter', () => { visible = true; });

        const SEL = 'a,button,.quick-link-card,.highlight-card,.achievement-card,.tool-tag,.tag,.project-link,.nav-links a';
        document.querySelectorAll(SEL).forEach(el => {
            el.addEventListener('mouseenter', () => { hovered = true; });
            el.addEventListener('mouseleave', () => { hovered = false; });
        });

        function glow(color, r) { ctx.shadowColor = rgba(color, 0.9); ctx.shadowBlur = r; }
        function noGlow()        { ctx.shadowBlur = 0; }

        function drawSegRing(x, y, r, color, alpha, lw, segs, gap, offset) {
            const step = (Math.PI * 2) / segs;
            ctx.strokeStyle = rgba(color, alpha);
            ctx.lineWidth   = lw;
            ctx.lineCap     = 'round';
            for (let i = 0; i < segs; i++) {
                const s = offset + i * step + gap / 2;
                const e = offset + (i + 1) * step - gap / 2;
                ctx.beginPath();
                ctx.arc(x, y, r, s, e);
                ctx.stroke();
            }
        }

        function drawSweep(x, y, r, angle, color) {
            const fan = Math.PI / 3;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.arc(x, y, r, angle - fan, angle);
            ctx.closePath();
            const g = ctx.createRadialGradient(x, y, 0, x, y, r);
            g.addColorStop(0,   rgba(color, 0.0));
            g.addColorStop(0.5, rgba(color, 0.02));
            g.addColorStop(1,   rgba(color, 0.1));
            ctx.fillStyle = g;
            ctx.fill();
            // leading edge
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
            glow(color, 8);
            ctx.strokeStyle = rgba(color, 0.45);
            ctx.lineWidth = 1;
            ctx.stroke();
            noGlow();
            ctx.restore();
        }

        function draw() {
            const W = window.innerWidth, H = window.innerHeight;
            ctx.clearRect(0, 0, W, H);

            if (!visible) { requestAnimationFrame(draw); return; }

            const col  = hovered ? AMB : CYN;
            const R1   = hovered ? 14 : 11;
            const R2   = hovered ? 26 : 22;
            const spd2 = hovered ? 1.8 : 0.6;

            rx += (mx - rx) * 0.16;
            ry += (my - ry) * 0.16;

            const vx = mx - px, vy = my - py;
            const spd = Math.sqrt(vx * vx + vy * vy);
            const mAng = Math.atan2(vy, vx);
            px = mx; py = my;

            rot += spd2;

            // Trail
            if (histFrame % 2 === 0) { hist.unshift({ x: mx, y: my }); hist.pop(); }
            histFrame++;
            hist.forEach((h, i) => {
                const t = 1 - i / TRAIL;
                ctx.beginPath();
                ctx.arc(h.x, h.y, Math.max(0.5, 2.5 * t), 0, Math.PI * 2);
                ctx.fillStyle = rgba(col, t * 0.3);
                ctx.fill();
            });

            // Radar sweep
            drawSweep(rx, ry, R2 + 6, rot * Math.PI / 180, col);

            // Outer segmented ring (4 segments, rotates)
            glow(col, 7);
            drawSegRing(rx, ry, R2, col, 0.5, 1, 4, 0.38, rot * Math.PI / 180);
            noGlow();

            // Inner segmented ring (3 segments, counter-rotates)
            glow(col, 4);
            drawSegRing(rx, ry, R1, col, 0.7, 1.2, 3, 0.55, -rot * 1.4 * Math.PI / 180);
            noGlow();

            // Centre dot — velocity stretched
            ctx.save();
            ctx.translate(mx, my);
            ctx.rotate(spd > 1 ? mAng : 0);
            const stretch = Math.min(1 + spd * 0.07, 2.5);
            ctx.scale(stretch, 1 / stretch);
            glow(col, 12);
            ctx.beginPath();
            ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = hovered ? rgba(AMB, 1) : '#ffffff';
            ctx.fill();
            noGlow();
            ctx.restore();

            // Hover pulse ring
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

    /* ── Init ── */
    function init() {
        initCursor();
        initTypewriter();
        initReveal();
        initGlitchBursts();
        setActiveNav();
        initSmoothScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
