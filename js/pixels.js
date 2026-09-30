/* ------------------------------------------------------------------
   Pixel art: every icon, the avatar and the cursors are drawn here
   from little character maps, so they stay razor sharp at any size.
   ------------------------------------------------------------------ */
(function () {
  const PAL = {
    K: '#15131f', // outline
    H: '#221e2b', // hair
    h: '#3e3850', // hair shine
    S: '#f6d0b0', // skin
    s: '#e2a98a', // skin shade
    E: '#2a1c1a', // eyes
    b: '#f3a596', // blush
    M: '#c9574f', // mouth
    C: '#7a2a2c', // coat
    c: '#561b1e', // coat shade
    D: '#a8453f', // coat button
    T: '#c22f33', // tie
    P: '#3b2c2f', // trousers
    p: '#291e21', // trousers shade
    G: '#3f7a52', // shoes / green
    g: '#2a543a', // shoes shade
    W: '#ffffff', // white
    w: '#d5dcea', // paper shade
    q: '#9aa6bd', // paper lines
    Y: '#ffd84a', // yellow
    y: '#d9a41f', // yellow shade
    O: '#fff3b0', // highlight
    B: '#2f6be0', // blue
    N: '#172554', // navy
    L: '#9cc8ff', // light blue
    R: '#e2413a', // red
    r: '#a52621', // red shade
    n: '#2e9a3e', // green dark
    e: '#62d46b', // green light
    k: '#f59ac0', // pink
    u: '#8a5328', // brown shade
    U: '#b8753a', // brown
    Z: '#6b7280'  // grey
  };

  const AVATAR = [
    '........KKKKKK........',
    '......KKHHHHHHKK......',
    '.....KHHHHhhHHHHK.....',
    '....KHHHhhHHHHHHHK....',
    '...KHHhhHHHHHHHHHHK...',
    '...KHHHHHHHHHHHHHHK...',
    '...KHHHHHHHHHHSHHHK...',
    '...KHHHHHHHHSSSSHHK...',
    '...KHHHHHHSSSSSSHHK...',
    '...KHHHHSSSSSSSSHHK...',
    '...KHHHSSSSSSSSSHHK...',
    '...KHHSEESSSSEESHHK...',
    '...KHHSEESSSSEESHHK...',
    '...KHHSbSSSSSSbSHHK...',
    '...KHHSSSSMMSSSSHHK...',
    '...KHHsSSSSSSSSsHHK...',
    '...KHHHsSSSSSSsHHHK...',
    '...KHHHHHsSSsHHHHHK...',
    '..KHHHCCWWTTWWCCHHHK..',
    '..KHHHCCCWTTWCCCHHHK..',
    '.KHHHCCCCWTTWCCCCHHHK.',
    '.KHHHCCCCCTTCCCCCHHHK.',
    '.KHHHCCCCCTTCCCCCHHHK.',
    '.KHHHcCCCCTTCCCCcHHHK.',
    '.KHHHcCCCCCCCCCCcHHHK.',
    '.KHHKcCCCCCCCCCCcKHHK.',
    '.KHKCcCCCCCCCCCCcCKHK.',
    '..KCCcCCCCCCCCCCcCCK..',
    '..KCCcCCCCCCCCCCcCCK..',
    '..KCCcCCCCDCCCCCcCCK..',
    '..KCCcCCCCCCCCCCcCCK..',
    '..KSScCCCCCCCCCCcSSK..',
    '..KSScCCCCDCCCCCcSSK..',
    '...KKcCCCCCCCCCCcKK...',
    '....KcCCCCCCCCCCcK....',
    '....KcCCCCccCCCCcK....',
    '....KcCCCKPPKCCCcK....',
    '....KKKKKPPPPKKKKK....',
    '......KPPPPPPPPK......',
    '......KPPK..KPPK......',
    '......KPpK..KpPK......',
    '......KPpK..KpPK......',
    '......KPpK..KpPK......',
    '......KPPK..KPPK......',
    '.....KGGGK..KGGGK.....',
    '.....KGggK..KggGK.....',
    '.....KKKKK..KKKKK.....'
  ];

  const ICONS = {
    folder: [
      '................',
      '..KKKKK.........',
      '.KOOOOOK........',
      '.KYYYYYYKKKKKKK.',
      '.KYYYYYYYYYYYYYK',
      '.KYOOOOOOOOOOOYK',
      '.KYYYYYYYYYYYYYK',
      '.KYYYYYYYYYYYYYK',
      '.KYYYYYYYYYYYYYK',
      '.KYYYYYYYYYYYYYK',
      '.KYYYYYYYYYYYYYK',
      '.KyyyyyyyyyyyyyK',
      '.KKKKKKKKKKKKKKK',
      '................'
    ],
    flask: [
      '................',
      '.....KKKKKK.....',
      '......KWWK......',
      '......KWWK......',
      '......KWLK......',
      '.....KWWWLK.....',
      '....KWWWWWLK....',
      '...KWWWWWWWLK...',
      '...KeeeeeeeeK...',
      '..KeeOeeeeeeeK..',
      '..KeeeeeeOeeeK..',
      '.KeeeeeeeeeeeeK.',
      '.KnnnnnnnnnnnnK.',
      '..KKKKKKKKKKKK..',
      '................'
    ],
    mail: [
      '................',
      '................',
      '.KKKKKKKKKKKKKK.',
      '.KwKWWWWWWWWKwK.',
      '.KWwKWWWWWWKwWK.',
      '.KWWwKWWWWKwWWK.',
      '.KWWWwKWWKwWWWK.',
      '.KWWWWwKKwWWWWK.',
      '.KWWWWWwwWWWWWK.',
      '.KWWWWWWWWWWWWK.',
      '.KWWWWWWWWWWRRK.',
      '.KwwwwwwwwwwRRK.',
      '.KKKKKKKKKKKKKK.',
      '................'
    ],
    cap: [
      '................',
      '.......KK.......',
      '.....KKBBKK.....',
      '...KKBBBBBBKK...',
      '.KKBBBBLBBBBBKK.',
      'KBBBBBBBBBBBBBBK',
      '.KKBBBBBBBBBBKY.',
      '...KNNNNNNNNK.Y.',
      '...KNNNNNNNNK.Y.',
      '...KNNNNNNNNKYYY',
      '....KKKKKKKK.YYY',
      '................'
    ],
    cert: [
      '................',
      'KKKKKKKKKKKKKKK.',
      'KWWWWWWWWWWWWWK.',
      'KWqqqqqqqqqqWWK.',
      'KWWWWWWWWWWWWWK.',
      'KWqqqqqqqqWWWWK.',
      'KWWWWWWWWWKKKWK.',
      'KWqqqqqqWKRRRKK.',
      'KWWWWWWWKRROORK.',
      'KKKKKKKKKRRRRRK.',
      '........KKRRRKK.',
      '.........KrKrK..',
      '.........KrKrK..',
      '........KrK.KrK.',
      '........KK...KK.',
      '................'
    ],
    star: [
      '.......KK.......',
      '......KYYK......',
      '......KYYK......',
      '.....KYOYYK.....',
      'KKKKKKYOYYKKKKKK',
      'KYYYYYYYYYYYYYYK',
      '.KYYYYYYYYYYYyK.',
      '..KYYYYYYYYYyK..',
      '...KYYYYYYYyK...',
      '...KYYYYYYYyK...',
      '..KYYYYKKYYyyK..',
      '..KYYYK..KYyyK..',
      '.KYYKK....KKyyK.',
      '.KKK........KKK.',
      '................'
    ],
    heart: [
      '................',
      '..KKKK....KKKK..',
      '.KRRRRK..KRRRRK.',
      'KRROORRKKRRRRRRK',
      'KROORRRRRRRRRRRK',
      'KRORRRRRRRRRRRRK',
      'KRRRRRRRRRRRRRrK',
      '.KRRRRRRRRRRRrK.',
      '..KRRRRRRRRRrK..',
      '...KRRRRRRRrK...',
      '....KRRRRRrK....',
      '.....KRRRrK.....',
      '......KRrK......',
      '.......KK.......',
      '................'
    ],
    case: [
      '................',
      '................',
      '......KKKK......',
      '.....K....K.....',
      '.KKKKKKKKKKKKKK.',
      '.KUUUUUUUUUUUUK.',
      '.KUUUUUUUUUUUUK.',
      '.KUUUUUKKUUUUUK.',
      '.KuuuuKYYKuuuuK.',
      '.KUUUUUKKUUUUUK.',
      '.KUUUUUUUUUUUUK.',
      '.KUUUUUUUUUUUUK.',
      '.KuuuuuuuuuuuuK.',
      '.KKKKKKKKKKKKKK.',
      '................'
    ],
    sparkle: [
      '................',
      '.......KK.......',
      '......KkkK......',
      '......KkkK......',
      '.....KkWWkK.....',
      '..KKKkkWWkkKKK..',
      'KKkkkkWWWWkkkkKK',
      'KKkkkkWWWWkkkkKK',
      '..KKKkkWWkkKKK..',
      '.....KkWWkK.....',
      '......KkkK......',
      '......KkkK......',
      '.......KK.......',
      '................'
    ],
    note: [
      '................',
      '...KKKKKKKK.....',
      '...KWWWWWWKK....',
      '...KWqqqqWKwK...',
      '...KWWWWWWKKKK..',
      '...KWqqqqqqqWK..',
      '...KWWWWWWWWWK..',
      '...KWqqqqqqqWK..',
      '...KWWWWWWWWWK..',
      '...KWqqqqqWWWK..',
      '...KWWWWWWWWWK..',
      '...KWqqqqqqqWK..',
      '...KWWWWWWWWWK..',
      '...KKKKKKKKKKK..',
      '................'
    ],
    bin: [
      '................',
      '......KKKK......',
      '..KKKKKKKKKKKK..',
      '..KWWWWWWWWWWK..',
      '..KKKKKKKKKKKK..',
      '...KwWwWwWwWK...',
      '...KwWwWwWwWK...',
      '...KwWwenWwWK...',
      '...KwWeeenwWK...',
      '...KwWwenWwWK...',
      '...KwWwWwWwWK...',
      '...KwWwWwWwWK...',
      '....KKKKKKKK....',
      '................'
    ],
    code: [
      '................',
      '.KKKKKKKKKKKKKK.',
      '.KNNNNNNNNNNNNK.',
      '.KNeNNNNNNNNNNK.',
      '.KNNeNNNNNNNNNK.',
      '.KNNNeNNNNNNNNK.',
      '.KNNeNNNNNNNNNK.',
      '.KNeNNNeeeeNNNK.',
      '.KNNNNNNNNNNNNK.',
      '.KKKKKKKKKKKKKK.',
      '......KZZK......',
      '....KKKKKKKK....',
      '................'
    ],
    chart: [
      '................',
      '.K..............',
      '.K..........KKK.',
      '.K..........KeK.',
      '.K......KKK.KeK.',
      '.K......KBK.KeK.',
      '.K..KKK.KBK.KeK.',
      '.K..KRK.KBK.KeK.',
      '.K..KRK.KBK.KeK.',
      '.K..KRK.KBK.KeK.',
      '.KKKKKKKKKKKKKKK',
      '................'
    ],
    grid: [
      '................',
      '.KKKKKKKKKKKKKK.',
      '.KnnnnnnnnnnnnK.',
      '.KKKKKKKKKKKKKK.',
      '.KWWWqWWWWqWWWK.',
      '.KqqqqqqqqqqqqK.',
      '.KWWWqWWWWqWWWK.',
      '.KqqqqqqqqqqqqK.',
      '.KWWWqWWWWqeeWK.',
      '.KqqqqqqqqqqqqK.',
      '.KWWWqWWWWqWWWK.',
      '.KKKKKKKKKKKKKK.',
      '................'
    ],
    python: [
      '................',
      '....KKKKKK......',
      '...KBBBBBBK.....',
      '...KBWBBBBK.....',
      '...KKKKBBBK.....',
      '.KKBBBBBBBKKKK..',
      '.KBBBBBBBBKYYYK.',
      '.KBBBBBBBKYYYYK.',
      '.KBBBBKKKYYYYYK.',
      '..KKKKYYYYYYYKK.',
      '.....KYYYKKKK...',
      '.....KYYYYWYK...',
      '.....KYYYYYYK...',
      '......KKKKKK....',
      '................'
    ],
    palette: [
      '................',
      '....KKKKKKK.....',
      '..KKOOOOOOOKK...',
      '.KOORROOOOOOOK..',
      '.KOORROOOBBOOK..',
      'KOOOOOOOOBBOOOK.',
      'KOeeOOOOOOOOOOK.',
      'KOeeOOOKKKOOOOK.',
      'KOOOOOKK..KOOK..',
      '.KOYYOK...KOK...',
      '.KOYYOOK..KK....',
      '..KOOOOOKK......',
      '...KKKKKK.......',
      '................'
    ],
    people: [
      '................',
      '...KKK....KKK...',
      '..KSSSK..KSSSK..',
      '..KSSSK..KSSSK..',
      '...KKK....KKK...',
      '..KKKKK..KKKKK..',
      '.KRRRRRKKBBBBBK.',
      '.KRRRRRKKBBBBBK.',
      '.KRRRRRKKBBBBBK.',
      '.KKKKKKKKKKKKKK.',
      '................'
    ],
    paw: [
      '................',
      '....KK....KK....',
      '...KkkK..KkkK...',
      '...KkkK..KkkK...',
      '.KK.KK....KK.KK.',
      'KkkK........KkkK',
      'KkkK..KKKK..KkkK',
      '.KK..KkkkkK..KK.',
      '....KkkkkkkK....',
      '...KkkkkkkkkK...',
      '...KkkkkkkkkK...',
      '....KKKKKKKK....',
      '................'
    ],
    trophy: [
      '................',
      '...KKKKKKKKKK...',
      '.KKKYOYYYYYYKKK.',
      'KY.KYOYYYYYYK.YK',
      'KY.KYOYYYYYyK.YK',
      '.KKKYOYYYYYyKKK.',
      '...KYYYYYYyyK...',
      '....KYYYYyyK....',
      '.....KYYyyK.....',
      '......KYyK......',
      '......KYyK......',
      '.....KKYyKK.....',
      '....KyyyyyyK....',
      '....KKKKKKKK....',
      '................'
    ],
    arrow: [
      'K...........',
      'KK..........',
      'KWK.........',
      'KWWK........',
      'KWWWK.......',
      'KWWWWK......',
      'KWWWWWK.....',
      'KWWWWWWK....',
      'KWWWWWWWK...',
      'KWWWWWWWWK..',
      'KWWWWWWWWWK.',
      'KWWWWWWKKKKK',
      'KWWWKWWK....',
      'KWWKKWWK....',
      'KWK..KWWK...',
      'KK...KWWK...',
      'K.....KWWK..',
      '......KWWK..',
      '.......KK...'
    ],
    hand: [
      '.....KK.........',
      '....KWWK........',
      '....KWWK........',
      '....KWWK........',
      '....KWWKKK......',
      '....KWWKWWKKK...',
      '....KWWKWWKWWKK.',
      'KKK.KWWKWWKWWKWK',
      'KWWKKWWWWWWWWKWK',
      'KWWWKWWWWWWWWWWK',
      '.KWWWWWWWWWWWWWK',
      '..KWWWWWWWWWWWWK',
      '..KWWWWWWWWWWWK.',
      '...KWWWWWWWWWWK.',
      '...KWWWWWWWWWK..',
      '....KWWWWWWWWK..',
      '....KKKKKKKKKK..'
    ],
    key: [
      '................',
      '..........KKK...',
      '.........KYYYK..',
      '........KYOYYYK.',
      '........KYYKYYK.',
      '........KYYYYYK.',
      '.......KYKYYYK..',
      '......KYK.KKK...',
      '.....KYK........',
      '....KYYK........',
      '...KYKYK........',
      '..KYYK..........',
      '..KYK...........',
      '...K............'
    ],
    power: [
      '................',
      '.......KK.......',
      '....K..KK..K....',
      '...KK..KK..KK...',
      '..KK...KK...KK..',
      '..KK...KK...KK..',
      '.KK....KK....KK.',
      '.KK..........KK.',
      '.KK..........KK.',
      '..KK........KK..',
      '..KKK......KKK..',
      '....KKKKKKKK....',
      '................'
    ]
  };

  function toSVG(map, opts) {
    const o = Object.assign({ scale: 1, cls: '', title: '' }, opts);
    const h = map.length;
    const w = map.reduce((m, r) => Math.max(m, r.length), 0);
    let rects = '';
    for (let y = 0; y < h; y++) {
      const row = map[y];
      let x = 0;
      while (x < row.length) {
        const ch = row[x];
        if (ch === '.' || ch === ' ') { x++; continue; }
        let x2 = x + 1;
        while (x2 < row.length && row[x2] === ch) x2++;
        rects += '<rect x="' + x + '" y="' + y + '" width="' + (x2 - x) + '" height="1" fill="' + (PAL[ch] || '#f0f') + '"/>';
        x = x2;
      }
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" class="px ' + o.cls + '" viewBox="0 0 ' + w + ' ' + h +
      '" width="' + Math.round(w * o.scale) + '" height="' + Math.round(h * o.scale) +
      '" shape-rendering="crispEdges" aria-hidden="true" focusable="false">' + rects + '</svg>';
  }

  function crop(map, x, y, w, h) {
    return map.slice(y, y + h).map(r => (r + '.'.repeat(w)).slice(x, x + w));
  }

  ICONS.me = crop(AVATAR, 2, 0, 18, 18);
  ICONS.avatar = AVATAR;

  function cursorURL(name, scale, hx, hy, fallback) {
    const svg = toSVG(ICONS[name], { scale: scale });
    return 'url("data:image/svg+xml;utf8,' + encodeURIComponent(svg) + '") ' + hx + ' ' + hy + ', ' + fallback;
  }

  function hydrate(root) {
    (root || document).querySelectorAll('[data-px]').forEach(el => {
      if (el.dataset.pxDone) return;
      const map = ICONS[el.dataset.px];
      if (!map) return;
      el.innerHTML = toSVG(map, { scale: parseFloat(el.dataset.scale || '2') });
      el.dataset.pxDone = '1';
    });
  }

  window.Pixels = { PAL, ICONS, toSVG, hydrate, cursorURL };
})();
