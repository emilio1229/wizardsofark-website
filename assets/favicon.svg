// site-effects.bundle.js (minimal placeholder)
// - marks active nav link
// - adds keyboard support for realm-button
// - small DOM-ready helpers

(function () {
  function onReady(fn) {
    if (document.readyState !== 'loading') return fn();
    document.addEventListener('DOMContentLoaded', fn);
  }

  onReady(function () {
    try {
      var path = window.location.pathname.replace(/\/$/, '');
      var links = document.querySelectorAll('.nav a.nav-link');
      links.forEach(function (a) {
        var href = a.getAttribute('href') || '';
        var normalized = href.replace(/\/$/, '');
        // handle relative links like "index.html"
        if (normalized === path || normalized === window.location.pathname.split('/').pop()) {
          a.classList.add('active');
        } else {
          a.classList.remove('active');
        }
      });
    } catch (e) { /* non-fatal */ }

    var realm = document.querySelector('.realm-button');
    if (realm) {
      realm.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          realm.click();
        }
      });
    }
  });
})();
