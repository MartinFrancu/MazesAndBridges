// Movement tuning for Mazes & Bridges.
// Each boost can be switched off on its own; speeds are in metres per second.
window.MOVEMENT = (() => {
  const config = {
    ramp: true,          // start slow and speed up while you keep moving the same way
    corridorBoost: true, // run faster down long straight corridors, ease off before junctions and bends
    archProfile: true,   // faster on the slopes of an arch, slower at its feet and crown
    showSpeed: false,    // show the current speed in the top bar, for tuning

    walk: 3.4,           // crossroads, bends, plazas, and everywhere when the boosts are off
    corridorMax: 7.5,    // top speed on a long straight run
    corridorRunUp: 10,   // metres of straight corridor ahead needed for top speed

    archFoot: 3.0,       // at each end of an arch, where you choose between arch and ground
    archFootLength: 5,   // metres from each end over which you slow to foot speed
    archSlope: 8.0,      // top speed on the steep parts
    archCrown: 3.4,      // over the flat top

    startSpeed: 1.0,     // speed the moment you start moving
    accel: 3.0,          // m/s² while speeding up
    decel: 9.0,          // m/s² when the target drops, e.g. a junction ahead
  };

  const smoothstep = (a, b, x) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  const lerp = (a, b, t) => a + (b - a) * t;

  // straightAhead: metres of straight corridor before the next junction, bend or dead end (0 = at one now)
  function groundTarget(straightAhead) {
    if (!config.corridorBoost) return config.walk;
    return lerp(config.walk, config.corridorMax, smoothstep(2, 2 + config.corridorRunUp, straightAhead));
  }

  // s: metres along the arch, len: its length, slope: vertical part of the unit tangent (-1..1)
  function archTarget(s, len, slope) {
    if (!config.archProfile) return config.archFoot;
    const onSlope = lerp(config.archCrown, config.archSlope, smoothstep(0.12, 0.55, Math.abs(slope)));
    const fromEnd = Math.min(s, len - s);
    return lerp(config.archFoot, onSlope, smoothstep(0, config.archFootLength, fromEnd));
  }

  // state keeps the current speed between frames. direction is +1/-1 while input is held, 0 when released.
  // Returns the speed to use this frame.
  function step(state, target, direction, dt) {
    if (!direction) { state.v = 0; state.dir = 0; return 0; }
    if (direction !== state.dir) { state.v = 0; state.dir = direction; }
    if (!config.ramp) return (state.v = target);
    if (state.v < config.startSpeed) state.v = Math.min(target, config.startSpeed);
    if (state.v < target) state.v = Math.min(target, state.v + config.accel * dt);
    else state.v = Math.max(target, state.v - config.decel * dt);
    return state.v;
  }

  return { config, groundTarget, archTarget, step };
})();
