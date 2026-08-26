/* ============================================================
   PruTech — projects strip
   Clones the eight project cards into a continuous line that
   travels left to right. Built from the same markup the helix
   uses, so the two never drift apart.
   ============================================================ */
(function () {
  'use strict';

  var track = document.getElementById('stripTrack');
  if (!track) return;

  var source = document.querySelectorAll(
    '.brief-marquee .brief[data-slug]:not([aria-hidden])');
  if (!source.length) return;

  function makeSet(hidden) {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < source.length; i++) {
      var c = source[i].cloneNode(true);
      c.removeAttribute('style');              // drop any helix transforms
      c.className = 'brief';                   // drop helix state classes
      if (hidden) {
        c.setAttribute('aria-hidden', 'true');
        c.setAttribute('tabindex', '-1');
      }
      frag.appendChild(c);
    }
    return frag;
  }

  // two identical sets so the loop is seamless at -50% -> 0
  track.appendChild(makeSet(false));
  track.appendChild(makeSet(true));
})();
