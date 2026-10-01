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

  /* --- Fragment landing ---------------------------------------------------
     `scroll-behavior: smooth` on the root makes the browser *animate* the
     initial jump to a #fragment, and that animation is routinely dropped if
     the document is still loading — you end up at the top of the page with
     the right URL in the bar. It is inconsistent page to page, so it cannot
     be left to chance on links whose whole job is to land somewhere.

     Once loaded: if the hash names a real element and the reader has not
     scrolled themselves, put the page where the link asked for. Jumped, not
     animated, so a second interrupted animation can't swallow it.
  ------------------------------------------------------------------------ */
  function landOnHash() {
    if (!location.hash || location.hash.length < 2) return;

    var target;
    try { target = document.querySelector(location.hash); } catch (e) { return; }
    if (!target) return;

    if (window.scrollY > 4) return;                             /* reader moved */
    if (Math.abs(target.getBoundingClientRect().top) < 4) return; /* already there */

    var root = document.documentElement;
    var prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    target.scrollIntoView();
    root.style.scrollBehavior = prev;
  }

  addEventListener('load', landOnHash);

  /* --- Year -------------------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
