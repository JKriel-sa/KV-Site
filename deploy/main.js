(function () {
  'use strict';

  /* --- Menu ------------------------------------------------------------- */
  var toggle = document.getElementById('menu-toggle');
  var menu   = document.getElementById('site-menu');
  var label  = toggle.querySelector('.menu-btn__label');
  var lastFocus = null;

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    label.textContent = open ? label.dataset.close : label.dataset.open;

    if (open) {
      lastFocus = document.activeElement;
      var first = menu.querySelector('a');
      if (first) first.focus();
    } else if (lastFocus) {
      lastFocus.focus();
    }
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
    }
  });

  /* --- Reveal -------------------------------------------------------------
     A rAF-throttled scroll pass, deliberately not an IntersectionObserver:
     a throttled observer can leave a headline stuck off-screen, and a hidden
     headline is a worse outcome than a missed animation.
  ------------------------------------------------------------------------ */
  var targets = Array.prototype.slice.call(
    document.querySelectorAll('.opening, .pane, .holding, .kv-hero, .kv-svc-hero')
  );
  var ticking = false;

  function sync() {
    ticking = false;
    var vh = window.innerHeight;

    for (var i = targets.length - 1; i >= 0; i--) {
      if (targets[i].getBoundingClientRect().top < vh * 0.82) {
        targets[i].classList.add('is-in');
        targets.splice(i, 1);
      }
    }
  }

  function schedule() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(sync);
    }
  }

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('load', sync);
  addEventListener('pageshow', sync);
  schedule(); /* next frame, so the opening still animates in */

  /* Backstop: if rAF never runs (background tab, throttling), nothing stays
     invisible. */
  setTimeout(sync, 1200);

  /* --- Year -------------------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
