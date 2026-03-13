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

    /* ── Fibonacci Sphere Loader ── */
    function initLoader() {
        const cv = document.getElementById('loader-canvas');
        if (!cv) return;
        const ctx2 = cv.getContext('2d');
        const W = 340, H = 340, CX = W / 2, CY = H / 2;
        const N = 220, PHI = Math.PI * (3 - Math.sqrt(5));
        const CYN2 = [0, 245, 233];

        // Pre-compute Fibonacci sphere point positions
        const pts = Array.from({ length: N }, (_, i) => {
            const y   = 1 - (i / (N - 1)) * 2;
            const r   = Math.sqrt(1 - y * y);
            const th  = PHI * i;
            return { ox: Math.cos(th) * r, oy: y, oz: Math.sin(th) * r };
        });

        let t = 0;
        let animId;
        const tasks = [
            'INITIALIZING THREAT MATRIX…',
            'LOADING OSINT MODULES…',
            'SYNCING DARKNET FEEDS…',
            'CALIBRATING RISK ENGINE…',
            'SYSTEM ONLINE',
        ];
        const taskEl = document.getElementById('l-task');
        const fillEl = document.getElementById('l-fill');
        const pctEl  = document.getElementById('l-pct');
        const tsEl   = document.getElementById('l-ts');
        const loader = document.getElementById('loader');

        let taskIdx = 0;
        const taskInterval = setInterval(() => {
            if (taskEl) {
                taskEl.classList.remove('on');
                setTimeout(() => {
                    taskEl.textContent = tasks[taskIdx % tasks.length];
                    taskEl.classList.add('on');
                }, 100);
            }
            taskIdx++;
        }, 800);

        function utcClock() {
            if (tsEl) tsEl.textContent = new Date().toISOString().slice(11, 19) + ' UTC';
        }
        utcClock();
        const clockInterval = setInterval(utcClock, 1000);

        function frame() {
            ctx2.clearRect(0, 0, W, H);
            t += 0.012;

            // Progress 0→1 over ~4s at 60fps
            const progress = Math.min(t / (4 * 0.012 * 60), 1);
            if (fillEl) fillEl.style.width = (progress * 100) + '%';
            if (pctEl)  pctEl.textContent  = Math.round(progress * 100) + '%';

            const rotY = t * 0.4;
            const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

            pts.forEach((p, i) => {
                // Rotate around Y axis
                const x3 = p.ox * cosY + p.oz * sinY;
                const z3 = -p.ox * sinY + p.oz * cosY;
                const y3 = p.oy;

                // Wave propagation
                const wave = Math.sin(t * 2 + i * 0.15) * 0.12;
                const scale = 110 + wave * 40;

                const sx = CX + x3 * scale;
                const sy = CY + y3 * scale;

                // Depth fade
                const depth = (z3 + 1) / 2;
                const alpha = 0.15 + depth * 0.7;
                const r = 1.2 + depth * 1.4;

                // Wave brightness pulse
                const bright = 0.6 + Math.sin(t * 3 + i * 0.2) * 0.4;

                ctx2.beginPath();
                ctx2.arc(sx, sy, r, 0, Math.PI * 2);
                ctx2.fillStyle = `rgba(${CYN2[0]},${CYN2[1]},${CYN2[2]},${alpha * bright})`;
                ctx2.fill();
            });

            if (progress < 1) {
                animId = requestAnimationFrame(frame);
            } else {
                // Done — fade out loader
                clearInterval(taskInterval);
                clearInterval(clockInterval);
                if (loader) {
                    loader.classList.add('loader-done');
                    setTimeout(() => { loader.style.display = 'none'; }, 700);
                }
            }
        }
        animId = requestAnimationFrame(frame);
    }

    /* ── Init ── */
    function init() {
        initLoader();
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
