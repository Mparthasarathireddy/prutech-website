/* ============================================================
   PruTech brand intro
   Plays img/intro-reveal.* full-bleed ONCE per browser session,
   freezes on the final frame, then dissolves to reveal the site.

   - not replayed on refresh
   - not replayed when moving between pages
   - plays again after the browser (or the tab) is closed and reopened
   - append ?intro=1 to any URL to force a replay while testing

   Requires: css/intro.css + the #ptIntro markup after <body>.
   ============================================================ */
(function () {
  'use strict';

  var KEY     = 'pt_intro_v2';  // bump this string to force one replay for everyone
  var HOLD    = 120;            // ms held on the final frame before dissolving
  var FADE    = 1000;           // keep in sync with the CSS transition
  var MAXWAIT = 8000;           // hard stop if the video never plays

  var HTML  = document.documentElement;
  var force = /[?&]intro=1(&|$)/.test(location.search);

  if (!force && window.matchMedia &&
      matchMedia('(prefers-reduced-motion: reduce)').matches) {
    HTML.classList.add('pt-intro-seen');
    return;
  }

  // --- once per session -------------------------------------------------
  var seen = false;
  try { seen = sessionStorage.getItem(KEY) === '1'; } catch (e) {}

  if (seen && !force) {
    HTML.classList.add('pt-intro-seen');   // hidden before first paint
    return;
  }

  // claim it now, not when the intro ends, so navigating away mid-intro
  // (or a fast refresh) still counts as played
  try { sessionStorage.setItem(KEY, '1'); } catch (e) {}

  HTML.classList.add('pt-intro-active');   // lock scroll before first paint

  document.addEventListener('DOMContentLoaded', function () {
    var wrap = document.getElementById('ptIntro');
    if (!wrap) { HTML.classList.remove('pt-intro-active'); return; }

    var vid  = wrap.querySelector('video');
    var skip = wrap.querySelector('.pt-intro__skip');
    var done = false;
    var guard = setTimeout(finish, MAXWAIT);

    function finish() {
      if (done) return;
      done = true;
      clearTimeout(guard);
      try { vid.pause(); } catch (e) {}
      wrap.classList.add('is-out');
      setTimeout(function () {
        if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
        HTML.classList.remove('pt-intro-active');
        try { window.dispatchEvent(new Event('pt:intro-done')); } catch (e) {}
      }, FADE);
    }

    function show() { vid.classList.add('is-on'); }
    vid.addEventListener('loadeddata', show);
    if (vid.readyState >= 2) show();

    vid.addEventListener('ended', function () { setTimeout(finish, HOLD); });
    vid.addEventListener('error', finish);

    // freeze hard on the last frame — some browsers never fire `ended` cleanly
    vid.addEventListener('timeupdate', function () {
      if (vid.duration && vid.currentTime >= vid.duration - 0.06) {
        try { vid.pause(); } catch (e) {}
        setTimeout(finish, HOLD);
      }
    });

    var p = vid.play();
    if (p && p.catch) p.catch(finish);   // autoplay blocked -> straight to the site

    setTimeout(function () { if (skip) skip.classList.add('is-on'); }, 900);
    if (skip) skip.addEventListener('click', finish);
    wrap.addEventListener('click', finish);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish();
    });
  });
})();
