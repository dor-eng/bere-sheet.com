/* Cookie consent (README rule "trackers need consent first").
   Nothing tracks until the visitor agrees. A tracker is added only as:
     bsConsent.onGrant(function(){ ...load the tag... });
   Choice is kept in localStorage 'bs-consent' ("granted"/"denied") for 180 days.
   Any element with [data-consent-open] reopens the banner. */
(function () {
  var KEY = 'bs-consent', DAYS = 180, queue = [];
  function read() {
    try { var v = JSON.parse(localStorage.getItem(KEY)); if (v && Date.now() - v.t < DAYS * 864e5) return v.c; } catch (e) {}
    return null;
  }
  function run() { while (queue.length) { try { queue.shift()(); } catch (e) {} } }
  window.bsConsent = {
    state: read,
    onGrant: function (fn) { queue.push(fn); if (read() === 'granted') run(); }
  };

  var box, lastFocus;
  var EN = typeof document !== 'undefined' && document.documentElement.lang === 'en';
  var T = EN ? {
    h: 'Cookies and measurement tools',
    p: 'We would like to use measurement and advertising tools to understand how the site is used and to show you relevant ads. They will run only if you agree. ',
    a: 'Details in the privacy policy',
    yes: 'I agree', no: 'No, thanks'
  } : {
    h: 'עוגיות וכלי מדידה',
    p: 'נשמח להשתמש בכלי מדידה ופרסום כדי להבין איך משתמשים באתר ולהציג לכם מודעות רלוונטיות. הם יופעלו רק אם תסכימו. ',
    a: 'פרטים במדיניות הפרטיות',
    yes: 'אני מסכים/ה', no: 'לא, תודה'
  };
  function save(c) {
    try { localStorage.setItem(KEY, JSON.stringify({ c: c, t: Date.now() })); } catch (e) {}
    hide();
    if (c === 'granted') run();
  }
  function hide() {
    if (!box) return;
    box.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function lift() {
    var bar = document.querySelector('.callbar');
    box.style.bottom = bar && bar.offsetHeight ? bar.offsetHeight + 'px' : '0';
  }
  function show(focus) {
    if (!box) {
      box = document.createElement('section');
      box.className = 'consent';
      box.setAttribute('role', 'region');
      box.setAttribute('aria-labelledby', 'consent-h');
      box.innerHTML =
        '<h2 id="consent-h">' + T.h + '</h2>' +
        '<p>' + T.p +
        '<a href="privacy.html#cookies">' + T.a + '</a>.</p>' +
        '<div class="consent-btns"><button type="button" data-c="granted">' + T.yes + '</button>' +
        '<button type="button" data-c="denied">' + T.no + '</button></div>';
      box.addEventListener('click', function (e) { var c = e.target.getAttribute('data-c'); if (c) save(c); });
      box.addEventListener('keydown', function (e) { if (e.key === 'Escape') save('denied'); });
      document.body.appendChild(box);
      window.addEventListener('resize', lift);
    }
    box.hidden = false;
    lift();
    if (focus) { lastFocus = document.activeElement; box.querySelector('button').focus(); }
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-consent-open]');
    if (t) { e.preventDefault(); show(true); }
  });
  function init() { if (read() === null) show(false); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
