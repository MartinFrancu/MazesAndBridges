// Visual themes for Mazes & Bridges. Each one re-skins the same maze; switch them in the help screen.
// Colours are 0xRRGGBB. Patterns ("hedge", "pave") are drawn by small shader additions in index.html.
window.THEMES = {
  dusk: {
    label: "Dusk",
    sky: { zen: 0x1b1f3a, mid: 0x6b5a8e, hor: 0xe39f88, low: 0x8a6a86, glow: [1.0, 0.82, 0.58] },
    fog: 0xe39f88,
    hemi: [0xb7a5dc, 0x4a3448, 0.85], // sky colour, ground colour, strength
    sun: [0xffc29a, 0.95],
    floor: 0x5b4a57, slabSide: 0xcfc3c2, columns: 0xb9adb4,
    hedge: [0x3f5c4c, 0x41604f, 0x466553, 0x4a6a57], // one per platform, bottom up
    hedgeStyle: "plain",
    frame: 0xe2d6cc,
    stone: 0xe8dfd4, plinth: 0xe8dfd4,
    archTint: 0.75,                         // how much of each plaza's colour runs up its arch's foot
    archLine: [0x000000, 0.14],             // step lines across the arch: colour, strength
    pave: [0x5b4a57, 0.62], paveStyle: "plain", // plaza paving: mixed from the plaza colour towards this
    statue: "color",
    trail: [0xffc98a, true],                // footstep colour, glowing (true) or painted (false)
  },

  // black-figure pottery: terracotta ground, black walls with a painted key frieze, black silhouettes
  vase: {
    label: "Vase",
    sky: { zen: 0xa9572a, mid: 0xd38a4c, hor: 0xf1cf98, low: 0xc98048, glow: [0.6, 0.45, 0.25] },
    fog: 0xf1cf98,
    hemi: [0xffe6c2, 0x6e3418, 1.0],
    sun: [0xfff0dc, 0.8],
    floor: 0xc4652f, slabSide: 0x1c1410, columns: 0x1c1410,
    hedge: [0x1c1410, 0x1c1410, 0x1c1410, 0x1c1410],
    hedgeStyle: "frieze", line: 0xd27a3e,
    frame: 0xd27a3e,
    stone: 0x1c1410, plinth: 0xe8b67e,
    archTint: 0.15,
    archLine: [0xd27a3e, 0.85],
    pave: [0xd49a62, 0.85], paveStyle: "plain",
    statue: "black",
    trail: [0x1c1410, false],
  },

  // frozen: snow floors, ice walls you can see a few walls through, warm low sun on cold light
  ice: {
    label: "Ice",
    sky: { zen: 0x5b7ea6, mid: 0xa8c3dc, hor: 0xf3dccb, low: 0xb9cee0, glow: [1.0, 0.85, 0.7] },
    fog: 0xdde7f0,
    hemi: [0xe2f0ff, 0x8299b2, 0.85],
    sun: [0xffe2c4, 1.0],
    floor: 0xd9e3ec, slabSide: 0xc6dbea, columns: 0xbfe0f2,
    hedge: [0x86c9ea, 0x8ccfee, 0x93d4f0, 0x9ad8f2],
    hedgeStyle: "ice", opacity: 0.5,       // three walls deep, about an eighth of the light gets through
    frame: 0xf6faff,
    stone: 0xf1f5fa, plinth: 0xf1f5fa,
    archTint: 0.6,
    archLine: [0x8fb7d2, 0.35],
    pave: [0xdbe6f0, 0.7], paveStyle: "plain",
    statue: "color",
    trail: [0x7d98b3, false],
  },

  // engraving: paper and ink only, brick courses on the walls, checkered plazas, one gold accent
  print: {
    label: "Print",
    sky: { zen: 0xbab4a8, mid: 0xd9d3c7, hor: 0xefebe2, low: 0xd3cdc1, glow: [0.25, 0.22, 0.18] },
    fog: 0xefebe2,
    hemi: [0xffffff, 0x8f8a82, 1.05],
    sun: [0xffffff, 0.7],
    floor: 0xeeeae1, slabSide: 0x23211f, columns: 0x23211f,
    hedge: [0x23211f, 0x23211f, 0x23211f, 0x23211f],
    hedgeStyle: "bricks", line: 0xeeeae1,
    frame: 0xeeeae1,
    stone: 0xf4f1ea, plinth: 0xeeeae1,
    archTint: 0,
    archLine: [0x23211f, 0.75],
    pave: [0xd9d4c9, 1], paveStyle: "checker", paveLine: 0x23211f,
    statue: "mono",
    trail: [0x23211f, false],
  },
};
