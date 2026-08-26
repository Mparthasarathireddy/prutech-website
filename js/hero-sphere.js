/* ============================================================
   PruTech hero — dotted world globe
   Real coastlines (js/world-mask.js) plotted as points on a
   slowly rotating sphere, with office markers, connecting
   great-circle arcs, two orbiting rings and ambient drift.
   Pure canvas, no dependencies, no video file.
   Needs: <canvas id="heroSphere"> inside .hero + hero-sphere.css
   ============================================================ */
(function () {
  'use strict';

  var cv = document.getElementById('heroSphere');
  if (!cv || !cv.getContext || !window.PT_WORLD) return;
  var ctx = cv.getContext('2d');

  var REDUCE = window.matchMedia &&
               matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- tunables ---- */
  var GREEN = '0,218,131';
  var BLUE  = '59,141,255';
  var PALE  = '190,214,248';
  var CAM   = 3.0;            // camera distance in globe radii
  // A full rotation would park the empty Pacific in frame for a third of
  // every cycle, so the globe sweeps slowly back and forth instead and the
  // Americas stay in view. The rings keep turning, so motion never stops.
  var SWEEP_MID = 1.22;       // centre of the sweep (faces roughly 70W)
  var SWEEP_AMP = 0.62;       // +/- 35 degrees of longitude
  var SWEEP_SEC = 54;         // seconds for one there-and-back
  var TILT      = 0.36;       // axial tilt toward the viewer

  var LIMB = CAM / Math.sqrt(CAM * CAM - 1);   // silhouette scale
  var CULL = 1 / CAM;                          // horizon in z

  /* ---- PruTech locations (see site footer) ---- */
  var SITES = [
    { n: 'Iselin, NJ',      lat: 40.575, lon: -74.323 },
    { n: 'New York, NY',    lat: 40.713, lon: -74.006 },
    { n: 'Charlotte, NC',   lat: 35.227, lon: -80.843 },
    { n: 'Washington, D.C.',lat: 38.907, lon: -77.037 }
  ];
  var LINKS = [[0, 2], [1, 3], [2, 3]];

  var dots = [], sites = [], arcs = [], rings = [], grat = [], dust = [];
  var W = 0, H = 0, DPR = 1, R = 0, RP = 0, CX = 0, CY = 0;
  var t = 0, raf = null, running = false;

  /* ---------- helpers ---------- */
  function vec(lat, lon) {
    var a = lat * Math.PI / 180, b = lon * Math.PI / 180, c = Math.cos(a);
    return { x: c * Math.sin(b), y: Math.sin(a), z: c * Math.cos(b) };
  }

  function slerp(u, v, s) {
    var d = Math.max(-1, Math.min(1, u.x*v.x + u.y*v.y + u.z*v.z));
    var o = Math.acos(d);
    if (o < 1e-6) return { x: u.x, y: u.y, z: u.z };
    var s0 = Math.sin((1 - s) * o) / Math.sin(o);
    var s1 = Math.sin(s * o) / Math.sin(o);
    return { x: u.x*s0 + v.x*s1, y: u.y*s0 + v.y*s1, z: u.z*s0 + v.z*s1 };
  }

  /* ---------- build the land points ---------- */
  function buildDots() {
    var Wd = window.PT_WORLD, bin = atob(Wd.bits);
    function bit(i) { return (bin.charCodeAt(i >> 3) >> (7 - (i & 7))) & 1; }

    dots = [];
    for (var r = 0; r < Wd.rows; r++) {
      var lat = Wd.latTop - r * Wd.step;
      // thin the high latitudes so dot spacing stays even on the sphere
      var thin = Math.max(1, Math.round(1 / Math.max(0.14, Math.cos(lat * Math.PI / 180))));
      for (var c = 0; c < Wd.cols; c += thin) {
        if (!bit(r * Wd.cols + c)) continue;
        dots.push(vec(lat, -180 + c * Wd.step));
      }
    }
  }

  function buildSites() {
    sites = SITES.map(function (s) { return vec(s.lat, s.lon); });
    arcs = LINKS.map(function (L) {
      var a = sites[L[0]], b = sites[L[1]], pl = [];
      for (var i = 0; i <= 22; i++) {
        var u = i / 22, p = slerp(a, b, u);
        var lift = 1 + 0.16 * Math.sin(Math.PI * u);
        pl.push({ x: p.x * lift, y: p.y * lift, z: p.z * lift });
      }
      return pl;
    });
  }

  function buildGraticule() {
    grat = [];
    var i, j, pl;
    for (i = -150; i < 180; i += 30) {           // meridians
      pl = [];
      for (j = -80; j <= 80; j += 5) pl.push(vec(j, i));
      grat.push(pl);
    }
    for (i = -60; i <= 60; i += 30) {            // parallels
      pl = [];
      for (j = -180; j <= 180; j += 5) pl.push(vec(i, j));
      grat.push(pl);
    }
  }

  function buildRings() {
    rings = [];
    [{ rad: 1.34, tilt: 0.40, spin: 0.30, col: GREEN },
     { rad: 1.58, tilt: -0.58, spin: -0.19, col: BLUE }].forEach(function (D) {
      var pl = [];
      for (var i = 0; i <= 150; i++) {
        var a = (i / 150) * Math.PI * 2;
        var x = Math.cos(a) * D.rad, z = Math.sin(a) * D.rad;
        var ct = Math.cos(D.tilt), st = Math.sin(D.tilt);
        pl.push({ x: x, y: -z * st, z: z * ct });
      }
      rings.push({ pts: pl, spin: D.spin, col: D.col });
    });
  }

  function buildDust() {
    dust = [];
    var n = Math.round(Math.min(80, (W * H) / 19000));
    for (var i = 0; i < n; i++) {
      dust.push({ x: Math.random()*W, y: Math.random()*H,
                  v: 0.04 + Math.random()*0.15, r: 0.3 + Math.random()*1.1,
                  a: 0.08 + Math.random()*0.28, g: Math.random() < 0.35 });
    }
  }

  /* ---------- layout ---------- */
  function resize() {
    var box = cv.getBoundingClientRect();
    if (!box.width || !box.height) return;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = box.width; H = box.height;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    var narrow = W < 900;
    R  = Math.min(W, H) * (narrow ? 0.30 : 0.275);
    RP = R / LIMB;
    CX = narrow ? W * 0.5  : W * 0.785;
    CY = narrow ? H * 0.40 : H * 0.50;
    buildDust();
  }

  /* ---------- projection ---------- */
  var ca = 1, sa = 0, cb = 1, sb = 0;
  function setAngles() {
    var ay = SWEEP_MID + SWEEP_AMP * Math.sin(t * 2 * Math.PI / SWEEP_SEC);
    var ax = TILT + Math.sin(t * 0.07) * 0.05;
    ca = Math.cos(ay); sa = Math.sin(ay); cb = Math.cos(ax); sb = Math.sin(ax);
  }
  function proj(p) {
    var x  =  p.x * ca + p.z * sa;
    var z1 = -p.x * sa + p.z * ca;
    var y  =  p.y * cb - z1 * sb;
    var z  =  p.y * sb + z1 * cb;
    var per = CAM / (CAM - z);
    return { x: CX + x * RP * per, y: CY - y * RP * per, z: z };  // canvas y grows downward
  }
  // visible if in front of the horizon, or outside the globe's silhouette
  function seen(p) {
    if (p.z > CULL) return true;
    var dx = p.x - CX, dy = p.y - CY;
    return dx*dx + dy*dy > R*R;
  }

  /* ---------- painting ---------- */
  function paintDust() {
    for (var i = 0; i < dust.length; i++) {
      var d = dust[i];
      d.y -= d.v; if (d.y < -4) { d.y = H + 4; d.x = Math.random() * W; }
      ctx.fillStyle = 'rgba(' + (d.g ? GREEN : PALE) + ',' + (d.a * 0.5) + ')';
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.2832); ctx.fill();
    }
  }

  function paintAtmosphere() {
    var g = ctx.createRadialGradient(CX, CY, R * 0.75, CX, CY, R * 1.85);
    g.addColorStop(0,    'rgba(0,218,131,.16)');
    g.addColorStop(0.28, 'rgba(59,141,255,.10)');
    g.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(CX - R*1.9, CY - R*1.9, R*3.8, R*3.8);
  }

  function paintOcean() {
    var g = ctx.createRadialGradient(
      CX - R*0.34, CY - R*0.38, R*0.05, CX, CY, R*1.02);
    g.addColorStop(0,    'rgba(26,44,84,.96)');
    g.addColorStop(0.55, 'rgba(14,24,50,.97)');
    g.addColorStop(1,    'rgba(7,12,26,.99)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(CX, CY, R, 0, 6.2832); ctx.fill();

    ctx.strokeStyle = 'rgba(' + GREEN + ',.20)';
    ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.arc(CX, CY, R, 0, 6.2832); ctx.stroke();
  }

  function paintPolyline(pl, colour, alphaFront, alphaBack, width) {
    ctx.lineWidth = width;
    var prev = null;
    for (var i = 0; i < pl.length; i++) {
      var p = proj(pl[i]);
      if (prev) {
        var mz = (p.z + prev.z) * 0.5;
        var mid = { x: (p.x+prev.x)*0.5, y: (p.y+prev.y)*0.5, z: mz };
        if (seen(mid)) {
          var depth = (mz + 1) * 0.5;
          var al = mz > CULL ? alphaFront * (0.45 + depth * 0.55) : alphaBack;
          ctx.strokeStyle = 'rgba(' + colour + ',' + al.toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(prev.x, prev.y); ctx.lineTo(p.x, p.y); ctx.stroke();
        }
      }
      prev = p;
    }
  }

  function paintGraticule() {
    for (var i = 0; i < grat.length; i++)
      paintPolyline(grat[i], BLUE, 0.11, 0, 1);
  }

  function paintLand() {
    for (var i = 0; i < dots.length; i++) {
      var p = proj(dots[i]);
      if (p.z <= CULL) continue;
      var depth = (p.z - CULL) / (1 - CULL);          // 0 at horizon, 1 dead centre
      ctx.fillStyle = 'rgba(' + (depth > 0.45 ? GREEN : PALE) + ',' +
                      (0.26 + depth * 0.70).toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 0.85 + depth * 1.25, 0, 6.2832);
      ctx.fill();
    }
  }

  function paintArcs() {
    for (var a = 0; a < arcs.length; a++) {
      paintPolyline(arcs[a], GREEN, 0.55, 0, 1.2);
      var pl = arcs[a];
      var u = (t * 0.28 + a * 0.33) % 1;
      var idx = u * (pl.length - 1);
      var i0 = Math.floor(idx), f = idx - i0;
      var q = pl[i0], r2 = pl[Math.min(i0 + 1, pl.length - 1)];
      var p = proj({ x: q.x + (r2.x-q.x)*f, y: q.y + (r2.y-q.y)*f, z: q.z + (r2.z-q.z)*f });
      if (!seen(p)) continue;
      ctx.fillStyle = 'rgba(' + GREEN + ',.18)';
      ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, 6.2832); ctx.fill();
      ctx.fillStyle = 'rgba(170,255,225,.95)';
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 6.2832); ctx.fill();
    }
  }

  function paintSites() {
    for (var i = 0; i < sites.length; i++) {
      var p = proj(sites[i]);
      if (p.z <= CULL + 0.04) continue;
      var fade = Math.min(1, (p.z - CULL) / 0.25);
      var ping = (t * 0.5 + i * 0.25) % 1;
      ctx.strokeStyle = 'rgba(' + GREEN + ',' + (0.42 * (1 - ping) * fade).toFixed(3) + ')';
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(p.x, p.y, 2 + ping * 12, 0, 6.2832); ctx.stroke();
      ctx.fillStyle = 'rgba(' + GREEN + ',' + (0.22 * fade).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, 6.2832); ctx.fill();
      ctx.fillStyle = 'rgba(190,255,230,' + (0.95 * fade).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(p.x, p.y, 2.1, 0, 6.2832); ctx.fill();
    }
  }

  function paintRings() {
    for (var r = 0; r < rings.length; r++) {
      var ring = rings[r], ph = t * ring.spin;
      var cp = Math.cos(ph), sp = Math.sin(ph), rot = [];
      for (var i = 0; i < ring.pts.length; i++) {
        var q = ring.pts[i];
        rot.push({ x: q.x*cp + q.z*sp, y: q.y, z: -q.x*sp + q.z*cp });
      }
      paintPolyline(rot, ring.col, 0.42, 0.09, 1.2);
    }
  }

  /* ---------- loop ---------- */
  function draw() {
    if (!W || !H) return;
    setAngles();
    ctx.clearRect(0, 0, W, H);
    paintDust();
    paintAtmosphere();
    paintOcean();
    paintGraticule();
    paintLand();
    paintArcs();
    paintSites();
    paintRings();
  }

  function frame() { t += 1 / 60; draw(); raf = requestAnimationFrame(frame); }
  function start() { if (!running) { running = true; raf = requestAnimationFrame(frame); } }
  function stop()  { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

  /* ---------- boot ---------- */
  buildDots(); buildSites(); buildGraticule(); buildRings(); resize();

  if (REDUCE) { draw(); return; }
  start();

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt); rt = setTimeout(function () { resize(); draw(); }, 150);
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) start(); else stop();
    }, { threshold: 0 }).observe(cv);
  }
})();
