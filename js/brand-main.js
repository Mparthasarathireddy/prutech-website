/* ===== PruTech IT Solutions — interactions (branded page) =====
   Based on main.js, with case studies grouped by government level
   and a filter UI. index.html keeps using main.js (untouched). */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- NAV ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  const burger = document.getElementById('burger');
  const links = document.querySelector('.nav__links');
  burger && burger.addEventListener('click', () => links.classList.toggle('open'));
  links && links.addEventListener('click', e => { if (e.target.tagName === 'A') links.classList.remove('open'); });

  /* ---------- REVEAL ON SCROLL ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- COUNTERS ---------- */
  const counters = document.querySelectorAll('.metric__num');
  const cio = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, to = +el.dataset.to; let cur = 0;
      const step = Math.max(1, to / 60);
      const tick = () => { cur += step; if (cur >= to) { el.textContent = to; } else { el.textContent = Math.floor(cur); requestAnimationFrame(tick); } };
      reduce ? (el.textContent = to) : tick();
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cio.observe(c));

  /* ---------- HERO PARTICLE CANVAS ---------- */
  const cv = document.getElementById('heroCanvas');
  if (cv && !reduce) {
    const ctx = cv.getContext('2d');
    let w, h, pts;
    const resize = () => { w = cv.width = cv.offsetWidth; h = cv.height = cv.offsetHeight;
      pts = Array.from({ length: Math.min(90, (w * h) / 16000) }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4
      }));
    };
    resize(); addEventListener('resize', resize);
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.fillStyle = 'rgba(0,218,131,.9)';
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, 7); ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy);
          if (d < 120) {
            ctx.strokeStyle = `rgba(59,74,161,${(1 - d / 120) * .35})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    };
    draw();
  }

  /* ---------- TYPEWRITER ENGINE ---------- */
  function typer(el, lines, { loop = true, speed = 22, linePause = 500, endPause = 2600 } = {}) {
    if (!el) return;
    if (reduce) { el.innerHTML = lines.join('\n'); return; }
    let li = 0;
    const writeLine = () => {
      if (li >= lines.length) {
        if (!loop) return;
        setTimeout(() => { el.innerHTML = ''; li = 0; writeLine(); }, endPause);
        return;
      }
      const full = lines[li];
      let ci = 0;
      const tick = () => {
        el.innerHTML = lines.slice(0, li).join('\n') + (li ? '\n' : '') + full.slice(0, ci) + '<span class="caret">▋</span>';
        ci++;
        if (ci <= full.length) setTimeout(tick, speed);
        else { li++; setTimeout(writeLine, linePause); }
      };
      tick();
    };
    writeLine();
  }

  /* ---------- HERO ROTATING CODE ---------- */
  function codeRotator(el, fileEl, snippets, { speed = 24, hold = 2400 } = {}) {
    if (!el) return;
    if (reduce) {
      if (fileEl) fileEl.textContent = snippets[0].file;
      el.innerHTML = snippets[0].lines.join('\n');
      return;
    }
    let si = 0;
    const typeSnippet = () => {
      const snip = snippets[si];
      if (fileEl) fileEl.textContent = snip.file;
      const lines = snip.lines;
      let li = 0;
      const writeLine = () => {
        if (li >= lines.length) {
          setTimeout(() => { si = (si + 1) % snippets.length; el.innerHTML = ''; typeSnippet(); }, hold);
          return;
        }
        const full = lines[li];
        let ci = 0;
        const tick = () => {
          el.innerHTML = lines.slice(0, li).join('\n') + (li ? '\n' : '') + full.slice(0, ci) + '<span class="caret">▋</span>';
          ci++;
          if (ci <= full.length) setTimeout(tick, speed);
          else { li++; setTimeout(writeLine, 220); }
        };
        tick();
      };
      writeLine();
    };
    typeSnippet();
  }

  // Careers visual — a realistic waving American flag (canvas, no assets).
  (() => {
    const cvs = document.getElementById('flagCanvas');
    if (!cvs) return;
    const ctx = cvs.getContext('2d');

    // ---- draw a crisp flag onto an offscreen canvas ----
    const FW = 456, FH = 240;                 // 1.9 : 1
    const off = document.createElement('canvas');
    off.width = FW; off.height = FH;
    const g = off.getContext('2d');

    const star = (cx, cy, r) => {
      g.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + i * 2 * Math.PI / 5;
        const b = a + Math.PI / 5;
        g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        g.lineTo(cx + Math.cos(b) * r * 0.5, cy + Math.sin(b) * r * 0.5);
      }
      g.closePath(); g.fill();
    };

    const drawFlag = () => {
      const sh = FH / 13;
      for (let i = 0; i < 13; i++) { g.fillStyle = i % 2 === 0 ? '#B22234' : '#FFFFFF'; g.fillRect(0, i * sh, FW, sh + 1); }
      const cw = FW * 0.4, ch = sh * 7;
      g.fillStyle = '#3C3B6E'; g.fillRect(0, 0, cw, ch);
      g.fillStyle = '#FFFFFF';
      const rows = 9, sr = sh * 0.34;
      for (let r = 0; r < rows; r++) {
        const n = r % 2 === 0 ? 6 : 5;
        const yy = ch * (r + 1) / (rows + 1);
        for (let c = 0; c < n; c++) star(cw * (c + 1) / (n + 1), yy, sr);
      }
    };
    drawFlag();

    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      cvs.width = Math.round(cvs.clientWidth * dpr);
      cvs.height = Math.round(cvs.clientHeight * dpr);
    };
    resize(); addEventListener('resize', resize);

    if (reduceMotion) { ctx.drawImage(off, 0, 0, FW, FH, 0, 0, cvs.width, cvs.height); return; }

    let t = 0;
    const render = () => {
      const W = cvs.width, H = cvs.height;
      ctx.clearRect(0, 0, W, H);
      const sx = W / FW, sy = H / FH;
      const amp = H * 0.05;
      for (let x = 0; x < FW; x++) {
        const grip = x / FW;                                   // 0 at hoist, 1 at fly
        const phase = grip * Math.PI * 3.2 - t;
        const yoff = (Math.sin(phase) + 0.4 * Math.sin(phase * 2 + 1)) * amp * (0.15 + grip);
        const stretch = 1 + 0.05 * Math.cos(phase);
        const dx = x * sx;
        ctx.drawImage(off, x, 0, 1, FH, dx, yoff, Math.ceil(sx) + 1, H * stretch);
        // cloth shading — highlight on crests, shadow in troughs
        const s = Math.sin(phase);
        if (s < 0) { ctx.fillStyle = `rgba(0,0,0,${(-s) * 0.32})`; ctx.fillRect(dx, yoff, Math.ceil(sx) + 1, H * stretch); }
        else       { ctx.fillStyle = `rgba(255,255,255,${s * 0.14})`; ctx.fillRect(dx, yoff, Math.ceil(sx) + 1, H * stretch); }
      }
      t += 0.05;
      requestAnimationFrame(render);
    };
    render();
  })();

  // National Reach — real US map (d3 + topojson), pins by lat/long.
  // Loaded lazily when the section scrolls into view.
  (() => {
    const section = document.getElementById('reach');
    const svgEl = document.getElementById('reachMap');
    if (!section || !svgEl) return;

    const CITIES = [
      { n: 'Washington, DC', lvl: 'federal', c: [-77.037, 38.907] },
      { n: 'Sacramento, CA', lvl: 'state',   c: [-121.494, 38.582] },
      { n: 'Austin, TX',     lvl: 'state',   c: [-97.743, 30.267] },
      { n: 'Albany, NY',     lvl: 'state',   c: [-73.756, 42.653] },
      { n: 'Denver, CO',     lvl: 'state',   c: [-104.991, 39.739] },
      { n: 'Atlanta, GA',    lvl: 'state',   c: [-84.388, 33.749] },
      { n: 'New York, NY',   lvl: 'local',   c: [-74.006, 40.712] },
      { n: 'Los Angeles, CA',lvl: 'local',   c: [-118.243, 34.052] },
      { n: 'Chicago, IL',    lvl: 'local',   c: [-87.630, 41.878] },
      { n: 'Seattle, WA',    lvl: 'local',   c: [-122.332, 47.606] },
      { n: 'Houston, TX',    lvl: 'local',   c: [-95.369, 29.760] },
      { n: 'Miami, FL',      lvl: 'local',   c: [-80.191, 25.761] },
      { n: 'Boston, MA',     lvl: 'local',   c: [-71.058, 42.360] },
      { n: 'Phoenix, AZ',    lvl: 'local',   c: [-112.074, 33.448] }
    ];

    const loadScript = src => new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s);
    });

    let started = false;
    const build = async () => {
      if (started) return; started = true;
      try {
        if (typeof d3 === 'undefined') await loadScript('https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js');
        if (typeof topojson === 'undefined') await loadScript('https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js');
        const us = await d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json');

        const W = 960, H = 600;
        const states = topojson.feature(us, us.objects.states);
        const proj = d3.geoAlbersUsa().fitSize([W, H], states);
        const path = d3.geoPath(proj);
        const svg = d3.select(svgEl).attr('viewBox', `0 0 ${W} ${H}`);

        svg.append('g').selectAll('path').data(states.features).join('path')
          .attr('d', path).attr('class', 'reach-state');

        const g = svg.append('g');
        CITIES.forEach((city, i) => {
          const p = proj(city.c); if (!p) return;
          const delay = (i * 0.22).toFixed(2) + 's';
          const ring = g.append('circle')
            .attr('cx', p[0]).attr('cy', p[1]).attr('r', 6)
            .attr('class', 'reach-ring lvl-' + city.lvl);
          ring.node().style.animationDelay = delay;
          const pin = g.append('circle')
            .attr('cx', p[0]).attr('cy', p[1]).attr('r', 5)
            .attr('class', 'reach-pin lvl-' + city.lvl);
          pin.node().style.animationDelay = delay;
          pin.append('title').text(city.n);
        });
      } catch (e) {
        section.classList.add('reach--failed');
      }
    };

    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { build(); io.disconnect(); } });
    }, { threshold: 0.15 });
    io.observe(section);
  })();

  /* ---------- SHOWCASE EDITOR + TERMINAL ---------- */
  const editorEl = document.getElementById('editorStream');
  const termEl = document.getElementById('terminal');
  const editorLines = [
    '<span class="c">// AccountService.cls</span>',
    '<span class="k">public with sharing class</span> <span class="f">AccountService</span> {',
    '  <span class="k">public static</span> List&lt;Account&gt; <span class="f">getActive</span>() {',
    '    <span class="k">return</span> [<span class="k">SELECT</span> Id, Name <span class="k">FROM</span> Account',
    '            <span class="k">WHERE</span> Active__c = <span class="s">true</span>];',
    '  }',
    '}',
    '',
    '<span class="c">// caseAgent.js — Lightning Web Component</span>',
    '<span class="k">import</span> { LightningElement, wire } <span class="k">from</span> <span class="s">\'lwc\'</span>;',
    '<span class="k">export default class</span> <span class="f">CaseAgent</span> <span class="k">extends</span> LightningElement {',
    '  <span class="k">@wire</span>(getOpenCases) cases;',
    '}'
  ];

  const termLines = [
    '$ pipeline promote --to Production',
    '=== Bundling release artifacts...',
    'Static code analysis ... <span class="okk">✓ passed</span>',
    'Apex tests ............. <span class="okk">100% pass</span>',
    'Validation deploy ...... <span class="okk">✓</span>',
    'Compliance gate ........ <span class="okk">FedRAMP · approved</span>',
    '<span class="okk">Promotion complete.</span> Production is green.'
  ];

  function runTerminal() {
    if (!termEl || reduce) { if (termEl) termEl.innerHTML = termLines.join('<br>'); return; }
    let i = 0;
    termEl.innerHTML = '';
    const next = () => {
      if (i >= termLines.length) { setTimeout(() => { termEl.innerHTML = ''; i = 0; next(); }, 3000); return; }
      termEl.innerHTML += (i ? '<br>' : '') + termLines[i];
      i++;
      setTimeout(next, 520);
    };
    next();
  }

  if (editorEl) {
    const sio = new IntersectionObserver(es => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        typer(editorEl, editorLines, { speed: 14, linePause: 120, endPause: 4000 });
        runTerminal();
        sio.disconnect();
      });
    }, { threshold: 0.3 });
    sio.observe(editorEl);
  }

  const st = document.createElement('style');
  st.textContent = '.caret{color:#00da83;animation:blink 1s steps(1) infinite}@keyframes blink{50%{opacity:0}}.okk{color:#00da83}';
  document.head.appendChild(st);

  /* ---------- CASE STUDIES (grouped by government level) ---------- */
  const CASES = (window.PT_CASES && window.PT_CASES.length) ? window.PT_CASES : [];

  const track = document.getElementById('sliderTrack');
  const dotsWrap = document.getElementById('slideDots');
  const filtersWrap = document.getElementById('slideFilters');
  if (track) {
    let slides = [], dots = [], idx = 0, timer = null;
    const playing = !reduce;
    const DELAY = 7000;

    function render(list) {
      track.innerHTML = '';
      dotsWrap.innerHTML = '';
      list.forEach((c, i) => {
        const s = document.createElement('article');
        s.className = 'slide' + (i === 0 ? ' active' : '');
        s.innerHTML = `<div class="slide__bg" style="background-image:url('${c.img}')"></div>
          <div class="slide__body">
            <span class="slide__cat">${c.cat}</span><span class="slide__level">${c.level}</span>
            <h3 class="slide__title">${c.title}</h3>
            <p class="slide__desc">${c.desc}</p>
            <a class="slide__link" href="${c.url}" target="_blank" rel="noopener">Learn more →</a>
          </div>`;
        track.appendChild(s);

        const d = document.createElement('button');
        d.className = i === 0 ? 'active' : '';
        d.setAttribute('aria-label', 'Go to ' + c.cat);
        d.addEventListener('click', () => go(i, true));
        dotsWrap.appendChild(d);
      });
      slides = [...track.children];
      dots = [...dotsWrap.children];
      idx = 0;
      restart();
    }

    function go(n, user) {
      if (!slides.length) return;
      slides[idx] && slides[idx].classList.remove('active');
      dots[idx] && dots[idx].classList.remove('active');
      idx = (n + slides.length) % slides.length;
      slides[idx].classList.add('active');
      dots[idx].classList.add('active');
      if (user) restart();
    }
    const next = () => go(idx + 1);
    const prev = () => go(idx - 1);
    function start() { if (playing && slides.length > 1) timer = setInterval(next, DELAY); }
    function stop() { clearInterval(timer); }
    function restart() { stop(); start(); }

    document.getElementById('slideNext').addEventListener('click', () => next());
    document.getElementById('slidePrev').addEventListener('click', () => prev());

    const sliderEl = document.getElementById('slider');
    sliderEl.tabIndex = 0;
    sliderEl.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });
    let sx = 0;
    track.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
    }, { passive: true });

    /* ---- filter tabs (only levels that exist) ---- */
    if (filtersWrap) {
      const order = ['Federal', 'State', 'Local', 'Commercial'];
      const present = order.filter(lv => CASES.some(c => c.level === lv));
      const tabs = ['All', ...present];
      tabs.forEach((lv, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = lv === 'All' ? 'All work' : lv;
        b.className = i === 0 ? 'active' : '';
        b.addEventListener('click', () => {
          [...filtersWrap.children].forEach(x => x.classList.remove('active'));
          b.classList.add('active');
          render(lv === 'All' ? CASES : CASES.filter(c => c.level === lv));
        });
        filtersWrap.appendChild(b);
      });
    }

    render(CASES);
  }
})();
