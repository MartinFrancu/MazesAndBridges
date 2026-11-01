// Level generator for Mazes & Bridges.
// A template lists the platforms (terraces) from the bottom up and the bridges (arches) on each;
// a seed fills in everything else, so the same seed always rebuilds the same maze.
window.LEVELGEN = (() => {
  const SIZES = { small: 13, medium: 17, large: 23 }; // cells per side
  const TEMPLATE = {
    platforms: [
      { size: "large", inner: 3, up: 2 }, // inner: bridges between two of its own plazas; up: bridges to the next platform
      { size: "medium", inner: 1 },       // the top platform holds the way out, so it has no "up"
    ],
    rise: 15,    // metres between platforms
    overlap: 10, // metres each platform reaches over the corner of the one below
  };
  const LIMITS = { platforms: [2, 4], inner: [0, 3], up: [1, 3] };

  // one plaza per arch end, plus the goal; animals are dealt out in a shuffled order
  const ANIMALS = [
    ["stag", "Crimson Stag", 0xd2434f], ["hare", "Saffron Hare", 0xf2b630], ["turtle", "Jade Turtle", 0x3cc492],
    ["fox", "Ember Fox", 0xf07a32], ["snail", "Lime Snail", 0xa6d63a], ["owl", "Violet Owl", 0xa363f5],
    ["heron", "Cobalt Heron", 0x4a7ff2], ["cat", "Magenta Cat", 0xe0559f], ["carp", "Teal Carp", 0x2ec9c9],
    ["bear", "Ivory Bear", 0xf0e6da],
  ];
  const WINDOW_STYLES = ["gothic", "roman", "wide", "oculus", "lancets"];
  const CS = 4, PLAZA = 3;

  // small, fast, seedable random numbers (mulberry32)
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function generate(seed, template = TEMPLATE) {
    const rand = rng(seed);
    const pick = (arr) => arr[(rand() * arr.length) | 0];
    const shuffle = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) { const j = (rand() * (i + 1)) | 0; [arr[i], arr[j]] = [arr[j], arr[i]]; }
      return arr;
    };

    // terraces: each one steps up and out along a diagonal, never folding back over the one before last
    const styles = shuffle(WINDOW_STYLES.slice());
    let styleIdx = 0, prevDir = null;
    const levels = [];
    template.platforms.forEach((pf, i) => {
      const n = SIZES[pf.size] || SIZES.medium;
      const half = (n * CS) / 2;
      const L = { n, half, y: i * template.rise, cx: 0, cz: 0 };
      if (i > 0) {
        const below = levels[i - 1];
        const dirs = [[1, 1], [1, -1], [-1, 1], [-1, -1]].filter((d) => !prevDir || d[0] !== -prevDir[0] || d[1] !== -prevDir[1]);
        const d = pick(dirs);
        prevDir = d;
        const step = below.half + half - template.overlap;
        L.cx = below.cx + d[0] * step;
        L.cz = below.cz + d[1] * step;
      }
      // two areas split along a random axis, each with its own window style
      const axis = rand() < 0.5 ? "i" : "j", cut = Math.floor(n / 2);
      L.region = (ci, cj) => ((axis === "i" ? ci : cj) < cut ? 0 : 1);
      L.windows = [styles[styleIdx++ % styles.length], styles[styleIdx++ % styles.length]];
      levels.push(L);
    });

    // how many plazas each terrace needs: one per arch end, plus the goal on top
    const top = levels.length - 1;
    const pf = template.platforms;
    const up = (i) => (i < top ? pf[i].up || 0 : 0);
    const need = levels.map((_, i) => 2 * (pf[i].inner || 0) + up(i) + (i > 0 ? up(i - 1) : 0) + (i === top ? 1 : 0));

    // place plazas spread out: for each one, try 40 random spots and keep the one furthest from the
    // plazas already placed (never overlapping, never under a higher terrace)
    const plazas = [];
    levels.forEach((L, li) => {
      const mine = [];
      const covered = (x, y) => levels.some((o, oi) => {
        if (oi <= li) return false;
        const x0 = L.cx - L.half + x * CS, z0 = L.cz - L.half + y * CS, s = PLAZA * CS;
        return x0 + s > o.cx - o.half - CS && x0 < o.cx + o.half + CS && z0 + s > o.cz - o.half - CS && z0 < o.cz + o.half + CS;
      });
      for (let k = 0; k < need[li]; k++) {
        let best = null;
        for (let tries = 0; tries < 40; tries++) {
          const x = (rand() * (L.n - PLAZA + 1)) | 0, y = (rand() * (L.n - PLAZA + 1)) | 0;
          if (covered(x, y)) continue;
          const d = mine.length ? Math.min(...mine.map((p) => Math.max(Math.abs(p.x - x), Math.abs(p.y - y)))) : L.n;
          if (d < PLAZA) continue;
          if (!best || d > best.d) best = { x, y, d };
        }
        if (!best) break; // no room left on this platform
        mine.push({ L: li, x: best.x, y: best.y });
      }
      plazas.push(...mine);
    });
    const center = (p) => {
      const L = levels[p.L];
      return { x: L.cx - L.half + (p.x + PLAZA / 2) * CS, z: L.cz - L.half + (p.y + PLAZA / 2) * CS };
    };
    const dist = (a, b) => { const p = center(a), q = center(b); return Math.hypot(p.x - q.x, p.z - q.z); };

    // the goal: the top plaza furthest from the terrace below, so reaching it means walking the maze
    const tops = plazas.filter((p) => p.L === top);
    const belowCenter = levels[top - 1] || levels[top];
    const goal = tops.reduce((best, p) => {
      const c = center(p), d = Math.hypot(c.x - belowCenter.cx, c.z - belowCenter.cz);
      return !best || d > best.d ? { p, d } : best;
    }, null).p;
    goal.goal = true;

    // arches: between terraces join one of the three shortest free pairings, so none of them spans the whole map
    const free = (li) => plazas.filter((p) => p.L === li && !p.used && !p.goal);
    const arches = [];
    const join = (a, b) => { a.used = b.used = true; arches.push([a, b]); };
    levels.forEach((_, i) => {
      for (let k = 0; k < up(i); k++) {
        const pairs = [];
        free(i).forEach((a) => free(i + 1).forEach((b) => pairs.push([a, b, dist(a, b)])));
        if (!pairs.length) break;
        pairs.sort((p, q) => p[2] - q[2]);
        const [a, b] = pick(pairs.slice(0, 3));
        join(a, b);
      }
    });
    let start = null;
    levels.forEach((_, i) => {
      for (let k = 0; k < (pf[i].inner || 0); k++) {
        const left = shuffle(free(i));
        if (left.length < 2) break;
        join(left[0], left[1]);
        if (i === 0 && !start) start = [left[0], left[1]];
      }
    });
    if (!start) start = arches.find(([a, b]) => a.L === 0 || b.L === 0);

    // names and animals; plazas left without an arch (if placement fell short) are dropped
    const kept = plazas.filter((p) => p.used || p.goal);
    const deck = shuffle(ANIMALS.slice());
    kept.forEach((p, k) => {
      p.id = "p" + k;
      if (p.goal) Object.assign(p, { name: "Lantern of the Way Out", color: 0xffe2a0, animal: "lantern" });
      else {
        const [animal, name, color] = deck[k % deck.length];
        Object.assign(p, { animal, name, color });
      }
      delete p.used;
    });

    return {
      seed,
      random: rand, // keep drawing from the same sequence for the hedges, so they are part of the seed too
      levels,
      plazas: kept,
      arches: arches.map(([a, b]) => [a.id, b.id]),
      start: [start[0].id, start[1].id],
    };
  }
  return { TEMPLATE, SIZES, LIMITS, generate, randomSeed: () => 1 + Math.floor(Math.random() * 99999) };
})();
