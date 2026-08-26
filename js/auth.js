/* ===== PruTech — auth + portal interactions (front-end demo only) ===== */
(() => {
  'use strict';

  // ---------------------------------------------------------------
  // DEMO ONLY. These are dummy credentials, published on the sign-in
  // page itself — there is nothing secret here and nothing real behind
  // this screen. Browser JavaScript is downloaded to the visitor, so a
  // real credential must never live in this file. Proper sign-in
  // (Microsoft accounts via the hosting platform) is a later phase.
  // ---------------------------------------------------------------
  const CREDS = { username: 'demo', password: 'demo1234' };
  const KEY = 'prutech_emp';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- shared particle background ---------- */
  const cv = document.getElementById('authCanvas');
  if (cv && !reduce) {
    const ctx = cv.getContext('2d');
    let w, h, pts;
    const resize = () => {
      w = cv.width = cv.offsetWidth; h = cv.height = cv.offsetHeight;
      pts = Array.from({ length: Math.min(80, (w * h) / 18000) }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35
      }));
    };
    resize(); addEventListener('resize', resize);
    (function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.fillStyle = 'rgba(52,230,160,.8)';
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, 7); ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy);
          if (d < 130) {
            ctx.strokeStyle = `rgba(59,141,255,${(1 - d / 130) * .25})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    })();
  }

  /* ---------- chooser: "coming soon" cards ---------- */
  const note = document.getElementById('soonNote');
  document.querySelectorAll('.portal--soon').forEach(b => {
    b.addEventListener('click', () => {
      if (!note) return;
      note.textContent = b.dataset.soon || 'Coming soon.';
      note.classList.remove('show'); void note.offsetWidth; note.classList.add('show');
    });
  });

  /* ---------- employee login ---------- */
  const form = document.getElementById('loginForm');
  if (form) {
    const err = document.getElementById('loginError');
    const userEl = document.getElementById('username');
    const passEl = document.getElementById('password');
    const toggle = document.getElementById('togglePw');

    toggle && toggle.addEventListener('click', () => {
      const show = passEl.type === 'password';
      passEl.type = show ? 'text' : 'password';
      toggle.textContent = show ? '🙈' : '👁';
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const u = userEl.value.trim();
      const p = passEl.value;
      if (u === CREDS.username && p === CREDS.password) {
        try { sessionStorage.setItem(KEY, u); } catch (_) {}
        const btn = form.querySelector('.login-submit');
        btn.textContent = 'Signing in…';
        btn.disabled = true;
        setTimeout(() => { location.href = 'employee-home.html'; }, 500);
      } else {
        err.hidden = false;
        err.textContent = 'Incorrect username or password. Please try again.';
        form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
      }
    });
  }

  /* ---------- dashboard guard + logout ---------- */
  const dash = document.getElementById('dashboard');
  if (dash) {
    let user = null;
    try { user = sessionStorage.getItem(KEY); } catch (_) {}
    if (!user) { location.replace('employee-login.html'); return; }

    const nameEl = document.getElementById('empName');
    if (nameEl) nameEl.textContent = user.split('_')[0];

    const logout = document.getElementById('logoutBtn');
    logout && logout.addEventListener('click', () => {
      try { sessionStorage.removeItem(KEY); } catch (_) {}
      location.href = 'index.html';
    });

    // live clock
    const clock = document.getElementById('clock');
    if (clock) {
      const tick = () => {
        const now = new Date();
        clock.textContent = now.toLocaleString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
      };
      tick(); setInterval(tick, 30000);
    }

    // simple sidebar nav highlight
    document.querySelectorAll('.side__link').forEach(l => {
      l.addEventListener('click', e => {
        const href = l.getAttribute('href');
        if (href && href !== '#') return;            // real page → let it navigate
        e.preventDefault();
        document.querySelectorAll('.side__link').forEach(x => x.classList.remove('active'));
        l.classList.add('active');
      });
    });
  }
})();
