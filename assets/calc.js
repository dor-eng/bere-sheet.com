/* Bereshit "how many cells" calculator. Rules ONLY from the live site (see SOURCES.md, FACTS-R2 section B). */
(function (root) {
  var EN = typeof document !== 'undefined' && document.documentElement.lang === 'en';
  var T = EN ? {
    t2: 'Luxury restroom trailer, 2 stalls', t4: 'Luxury restroom trailer, 4 stalls, accessible', t6: 'Luxury restroom trailer, 6 stalls',
    r1: 'Up to 200 guests: 2-3 toilet stalls',
    r2: '1-2 stalls per 100 guests (for an event of about 500 guests: at least 5 stalls)',
    empty: 'Enter the number of guests to get a recommendation.',
    cdt: 'Chemical toilet stalls', cells: ' stalls', rule: 'Rule: ',
    tdt: 'Luxury restroom trailer', none: 'No single trailer model fits this number',
    trule: 'Rule: 2 stalls up to 200 guests, 4 stalls accessible up to 350, 6 stalls up to 400. ',
    big1: 'The trailers on the site fit up to ', acc: '350 guests in the accessible model', all: '400 guests',
    big2: '. For larger numbers we will arrange a solution in a personal consultation.'
  } : {
    t2: 'קרון מפואר 2 תאים', t4: 'קרון מפואר 4 תאים נגיש', t6: 'קרון מפואר 6 תאים',
    r1: 'עד 200 משתתפים: 2-3 תאי שירותים',
    r2: '1-2 תאים לכל 100 משתתפים (באירוע של כ-500 אורחים: 5 תאים לפחות)',
    empty: 'הזינו מספר משתתפים כדי לקבל המלצה.',
    cdt: 'תאי שירותים כימיים', cells: ' תאים', rule: 'כלל: ',
    tdt: 'קרון מפואר', none: 'אין דגם קרון יחיד לכמות הזו',
    trule: 'כלל: 2 תאים עד 200 אורחים, 4 תאים נגיש עד 350, 6 תאים עד 400. ',
    big1: 'הקרונות באתר מתאימים עד ', acc: '350 אורחים בדגם הנגיש', all: '400 אורחים',
    big2: '. לכמות גדולה יותר נתאים פתרון בייעוץ אישי.'
  };
  var TRAILERS = [ // model, max guests, accessible
    { name: T.t2, max: 200, acc: false },
    { name: T.t4, max: 350, acc: true },
    { name: T.t6, max: 400, acc: false }
  ];
  function recommend(guests, needAccessible) {
    var g = Math.floor(Number(guests));
    if (!(g >= 1)) return null;
    var cells = g <= 200
      ? { min: 2, max: 3, rule: T.r1 }
      : { min: Math.ceil(g / 100), max: Math.ceil(g * 2 / 100), rule: T.r2 };
    var t = null;
    for (var i = 0; i < TRAILERS.length; i++) {
      if (g <= TRAILERS[i].max && (!needAccessible || TRAILERS[i].acc)) { t = TRAILERS[i].name; break; }
    }
    return { guests: g, cellsMin: cells.min, cellsMax: cells.max, cellsRule: cells.rule, trailer: t };
  }
  root.BereshitCalc = { recommend: recommend, TRAILERS: TRAILERS };
  if (typeof module !== 'undefined') module.exports = root.BereshitCalc;
  if (typeof document === 'undefined') return;
  var gi = document.getElementById('c-guests'), ai = document.getElementById('c-acc'), out = document.getElementById('c-out');
  if (!gi || !out) return;
  function render() {
    var r = recommend(gi.value, ai && ai.checked);
    if (!r) { out.innerHTML = '<p class="soft">' + T.empty + '</p>'; return; }
    out.innerHTML =
      '<dl class="res">' +
      '<div><dt>' + T.cdt + '</dt><dd><b>' + r.cellsMin + '-' + r.cellsMax + '</b>' + T.cells + '<small class="src">' + T.rule + r.cellsRule + '.</small></dd><!-- src: SOUTH:31,43 NORTH:34 --></div>' +
      '<div><dt>' + T.tdt + '</dt><dd><b>' + (r.trailer || T.none) + '</b><small class="src">' +
      (r.trailer ? T.trule
                 : T.big1 + (ai && ai.checked ? T.acc : T.all) + T.big2) +
      '</small></dd></div></dl>';
  }
  gi.addEventListener('input', render);
  if (ai) ai.addEventListener('change', render);
  render();
})(typeof window !== 'undefined' ? window : globalThis);
