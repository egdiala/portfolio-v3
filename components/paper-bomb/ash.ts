import gsap from "gsap";
import { ASH_PER_WAVE } from "./constants";
import { rand } from "./flame";
import type { ClickOrigin } from "./types";

/**
 * Ash falls from wherever the fire currently is, not from the final radius —
 * so each wave reads as debris off the actively burning edge.
 */
export function spawnAshWave(
  wave: number,
  origin: ClickOrigin,
  radiusRef: { current: number },
  ashRefs: { current: Array<HTMLDivElement | null> },
) {
  const currentR = radiusRef.current;
  for (let j = 0; j < ASH_PER_WAVE; j++) {
    const i = wave * ASH_PER_WAVE + j;
    const el = ashRefs.current[i];
    if (!el) continue;
    const angle = rand(0, Math.PI * 2);
    const dist = currentR * rand(0.7, 0.96);
    const x = origin.x + Math.cos(angle) * dist;
    const y = origin.y + Math.sin(angle) * dist;
    gsap.set(el, { x, y, opacity: 1, rotate: rand(-30, 30) });
    gsap.to(el, {
      x: `+=${rand(-25, 25)}`,
      y: `+=${rand(45, 100)}`,
      rotate: `+=${rand(60, 200)}`,
      opacity: 0,
      duration: rand(0.9, 1.4),
      ease: "power1.in",
      delay: j * 0.06,
    });
  }
}
