/* ============================================================
   PruTech — project helix
   Scroll drives the project cards up a vertical spine while they
   spiral around it, swinging from the front of the line to
   behind it and back. Respects the existing level filters.
   Needs: css/helix.css and the #briefs markup on salesforce.html
   ============================================================ */
(function () {
  'use strict';

  var scroll = document.querySelector('.helix-scroll');
  var wrap   = document.querySelector('.brief-marquee');
  if (!scroll || !wrap) return;

  // no JS-driven layout for reduced motion — the marquee stays as it was
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var fill  = scroll.querySelector('.helix__spine i');
  var cntEl = scroll.querySelector('.helix__count');
  var all   = [].slice.call(wrap.querySelectorAll('.brief[data-slug]:not([aria-hidden])'));
  if (!all.length) return;

  /* ---- tunables ---- */
  var VH_PER_CARD = 58;      // scroll distance per project
  var VSTEP       = 275;     // px between cards — the length each card travels
  var RADIUS      = 330;     // how far the cards orbit from the line
  var TURN        = 1.62;    // radians per card (~93 deg) — nearly a
                             // quarter turn each, so cards visibly wrap
                             // around the line instead of sliding across
  var PHASE       = 0;       // focus lands dead centre, nearest the camera
  var WINDOW      = 2.2;     // how many steps either side stay visible
  var Y_OFFSET    = 80;      // drop the focal point clear of the header

  scroll.classList.add('is-on');
  wrap.classList.add('is-on');

  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var live = all, lastCount = -1;

  function refresh() {
    live = all.filter(function (el) { return el.style.display !== 'none'; });
    scroll.style.height = (live.length * VH_PER_CARD + 100) + 'vh';
  }

  function update() {
    var N = live.length;
    if (!N) return;

    var box = scroll.getBoundingClientRect();
    var total = scroll.offsetHeight - window.innerHeight;
    if (total <= 0) return;
    var p = clamp(-box.top / total, 0, 1);

    var f = p * (N + 0.5) - 0.25;     // index currently at the focal height
                                      // (short lead-in so the first card lands quickly)

    for (var i = 0; i < N; i++) {
      var el = live[i];
      var u  = i - f;

      if (Math.abs(u) > WINDOW + 0.6) {
        if (el.__on !== false) { el.style.visibility = 'hidden'; el.__on = false; }
        continue;
      }
      if (el.__on === false) { el.style.visibility = ''; el.__on = true; }

      var th = u * TURN + PHASE;
      var x  = -Math.sin(th) * RADIUS;  // negated: the spiral sweeps left to right
      var z  = Math.cos(th) * RADIUS;
      var y  = u * VSTEP + Y_OFFSET;

      // fade at the top and bottom of the window, and dim round the back
      var edge  = clamp((WINDOW + 0.5 - Math.abs(u)) / 0.7, 0, 1);
      var front = (z + RADIUS) / (2 * RADIUS);          // 1 = nearest, 0 = behind
      var op    = edge * (0.26 + front * 0.62);
      var blur  = (1 - front) * 3.4 + (1 - edge) * 2.6;
      var bri   = 0.52 + front * 0.42;

      // exactly one card sits on the focal plane at a time. That one goes
      // fully sharp and bright, straightens up, and is the only card that
      // accepts clicks — so there is always one readable, clickable project.
      var foc = clamp(1 - Math.abs(u) / 0.55, 0, 1);
      foc = foc * foc * (3 - 2 * foc);                  // smoothstep
      op   = op  + (1 - op ) * foc;
      bri  = bri + (1 - bri) * foc;
      blur = blur * (1 - foc);

      el.style.transform =
        'translate3d(calc(-50% + ' + x.toFixed(1) + 'px), calc(-50% + ' +
        y.toFixed(1) + 'px), ' + z.toFixed(1) + 'px) rotateY(' +
        (Math.sin(th) * 22 * (1 - foc)).toFixed(2) + 'deg) scale(' +
        (1 + foc * 0.07).toFixed(3) + ')';
      el.style.opacity = op.toFixed(3);
      el.style.filter  = 'blur(' + blur.toFixed(2) + 'px) brightness(' + bri.toFixed(2) + ')';
      // no z-index here on purpose: the track is preserve-3d, so the browser
      // sorts card and spine by real depth — that is what makes cards pass
      // visibly BEHIND the line and read as a spiral rather than a slide.
      el.style.pointerEvents = foc > 0.3 ? 'auto' : 'none';
      el.classList.toggle('is-focus', foc > 0.55);

      // the rib reaches back to the spine, so it grows with the offset
      var far = Math.abs(x) - 150;
      el.style.setProperty('--rib', Math.max(20, far).toFixed(0) + 'px');
      el.classList.toggle('no-rib', far < 30);        // hide the stub near centre
      el.classList.toggle('is-right', x >= 0);
      el.classList.toggle('is-left',  x < 0);
    }

    if (fill) fill.style.height = (p * 100).toFixed(2) + '%';
    var cur = clamp(Math.round(f) + 1, 1, N);
    if (cntEl && cur !== lastCount) {
      lastCount = cur;
      cntEl.innerHTML = '<b>' + String(cur).padStart(2, '0') + '</b> / ' +
                        String(N).padStart(2, '0');
    }
  }

  /* ---- keep in step with the level filters ---- */
  var filters = document.getElementById('briefFilters');
  if (filters) {
    filters.addEventListener('click', function () {
      setTimeout(function () { refresh(); update(); }, 0);
    });
  }

  var ticking = false, active = true;
  function onScroll() {
    if (ticking || !active) return;
    ticking = true;
    requestAnimationFrame(function () { update(); ticking = false; });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { refresh(); update(); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      active = en[0].isIntersecting;
      if (active) update();
    }, { rootMargin: '250px' }).observe(scroll);
  }

  refresh();
  update();
})();
