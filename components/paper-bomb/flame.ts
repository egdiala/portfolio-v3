import { FLAME_TONGUES } from "./constants";

export type FlameTongue = {
  angle: number;
  phase: number;
  speed: number;
  amp: number;
  widthJitter: number;
};

export function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function createTongues(): FlameTongue[] {
  return Array.from({ length: FLAME_TONGUES }, (_, i) => ({
    angle: (i / FLAME_TONGUES) * Math.PI * 2 + rand(-0.15, 0.15),
    phase: rand(0, Math.PI * 2),
    speed: rand(2.4, 4.2),
    amp: rand(18, 44),
    widthJitter: rand(0.75, 1.3),
  }));
}

/**
 * Flames are only as big as the ring that's actually burning — at a small
 * radius, tongues stay small and close together instead of a fixed-size
 * cluster that dwarfs the real burn extent.
 * Returns false once the flame has finished decaying.
 */
export function drawFlames(
  ctx: CanvasRenderingContext2D,
  frame: {
    elapsed: number;
    growDuration: number;
    decayDuration: number;
    width: number;
    height: number;
    radius: number;
    x: number;
    y: number;
    tongues: FlameTongue[];
  },
) {
  const { elapsed, growDuration, decayDuration, width, height, radius, x, y, tongues } = frame;
  ctx.clearRect(0, 0, width, height);
  if (elapsed > growDuration + decayDuration) return false;

  const fade = elapsed > growDuration ? 1 - (elapsed - growDuration) / decayDuration : 1;
  const scale = Math.min(1, radius / 60);
  ctx.globalCompositeOperation = "lighter";
  for (const tongue of tongues) {
    const rise = Math.abs(Math.sin(elapsed * tongue.speed + tongue.phase)) * tongue.amp * scale;
    const baseX = x + Math.cos(tongue.angle) * radius;
    const baseY = y + Math.sin(tongue.angle) * radius * 0.94 - rise;
    const flameLen = (8 + rise * 0.6) * tongue.widthJitter * scale * fade;
    if (flameLen <= 1) continue;
    const grad = ctx.createRadialGradient(baseX, baseY, 0, baseX, baseY, flameLen);
    grad.addColorStop(0, `rgba(255, 244, 200, ${0.9 * fade})`);
    grad.addColorStop(0.35, `rgba(255, 150, 40, ${0.65 * fade})`);
    grad.addColorStop(0.75, `rgba(255, 70, 20, ${0.3 * fade})`);
    grad.addColorStop(1, "rgba(255, 40, 10, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(baseX, baseY, flameLen, 0, Math.PI * 2);
    ctx.fill();
  }
  return true;
}
