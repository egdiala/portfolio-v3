"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { PaperBomb } from "@/components/paper-bomb/paper-bomb";
import "./paper-bomb-burn.css";

type ClickOrigin = {
  x: number;
  y: number;
  xPct: number;
  yPct: number;
  radius: number;
};

function getClickOrigin(el: HTMLElement, clientX: number, clientY: number): ClickOrigin {
  const rect = el.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const corners = [
    Math.hypot(x, y),
    Math.hypot(rect.width - x, y),
    Math.hypot(x, rect.height - y),
    Math.hypot(rect.width - x, rect.height - y),
  ];
  return {
    x,
    y,
    xPct: (x / rect.width) * 100,
    yPct: (y / rect.height) * 100,
    radius: Math.max(...corners),
  };
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const ASH_WAVES = 4;
const ASH_PER_WAVE = 3;
const ASH_COUNT = ASH_WAVES * ASH_PER_WAVE;
const ASH_KEYS = Array.from({ length: ASH_COUNT }, (_, i) => `ash-${i}`);
const FLAME_TONGUES = 16;

export function PaperBombBurn(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  const stageRef = useRef<HTMLButtonElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const hazeRef = useRef<HTMLDivElement>(null);
  const ashRefs = useRef<Array<HTMLDivElement | null>>([]);

  const [origin, setOrigin] = useState<ClickOrigin | null>(null);
  const rValueRef = useRef(0);
  const startedRef = useRef(false);

  function ignite(e: React.MouseEvent<HTMLButtonElement>) {
    if (origin || !stageRef.current || startedRef.current) return;
    startedRef.current = true;
    setOrigin(getClickOrigin(stageRef.current, e.clientX, e.clientY));
  }

  useEffect(() => {
    if (!origin) return;
    const o = origin;
    const paper = paperRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!paper || !stage) return;

    const reduced = prefersReducedMotion();
    const endR = o.radius + 90;

    paper.style.setProperty("--burn-ox", `${o.xPct}%`);
    paper.style.setProperty("--burn-oy", `${o.yPct}%`);
    paper.style.setProperty("--burn-r", "0px");

    if (reduced) {
      paper.style.setProperty("--burn-r", `${endR}px`);
      return;
    }

    // Canvas setup for the procedural flame.
    const dpr = window.devicePixelRatio || 1;
    const rect = stage.getBoundingClientRect();
    let ctx: CanvasRenderingContext2D | null = null;
    if (canvas) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx = canvas.getContext("2d");
      ctx?.scale(dpr, dpr);
    }

    const tongues = Array.from({ length: FLAME_TONGUES }, (_, i) => ({
      angle: (i / FLAME_TONGUES) * Math.PI * 2 + rand(-0.15, 0.15),
      phase: rand(0, Math.PI * 2),
      speed: rand(2.4, 4.2),
      amp: rand(18, 44),
      widthJitter: rand(0.75, 1.3),
    }));

    // Real paper doesn't consume itself quickly — give the burn room to breathe.
    const growDuration = 3.2;
    const decayDuration = 1;
    const startTime = performance.now();
    let ticking = true;

    function tick() {
      if (!ctx || !ticking) return;
      const elapsed = (performance.now() - startTime) / 1000;
      ctx.clearRect(0, 0, rect.width, rect.height);
      if (elapsed > growDuration + decayDuration) {
        ticking = false;
        return;
      }
      const fade = elapsed > growDuration ? 1 - (elapsed - growDuration) / decayDuration : 1;
      const r = rValueRef.current;
      // Flames are only as big as the ring that's actually burning — at a
      // small radius, tongues stay small and close together instead of a
      // fixed-size cluster that dwarfs the real burn extent.
      const scale = Math.min(1, r / 60);
      ctx.globalCompositeOperation = "lighter";
      for (const t of tongues) {
        const rise = Math.abs(Math.sin(elapsed * t.speed + t.phase)) * t.amp * scale;
        const baseX = o.x + Math.cos(t.angle) * r;
        const baseY = o.y + Math.sin(t.angle) * r * 0.94 - rise;
        const flameLen = (8 + rise * 0.6) * t.widthJitter * scale * fade;
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
    }
    gsap.ticker.add(tick);

    // Ash falls from wherever the fire currently is, not from the final
    // radius — so each wave reads as debris off the actively burning edge.
    function spawnWave(wave: number) {
      const currentR = rValueRef.current;
      for (let j = 0; j < ASH_PER_WAVE; j++) {
        const i = wave * ASH_PER_WAVE + j;
        const el = ashRefs.current[i];
        if (!el) continue;
        const angle = rand(0, Math.PI * 2);
        const dist = currentR * rand(0.7, 0.96);
        const x = o.x + Math.cos(angle) * dist;
        const y = o.y + Math.sin(angle) * dist;
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

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.ticker.remove(tick);
      },
    });

    if (flashRef.current) {
      gsap.set(flashRef.current, { left: o.x, top: o.y });
      tl.fromTo(
        flashRef.current,
        { opacity: 1, scale: 0.25 },
        { opacity: 0, scale: 4.4, duration: 0.55, ease: "power2.out" },
        0
      );
    }

    const growObj = { r: 0 };
    tl.to(
      growObj,
      {
        r: endR,
        duration: growDuration,
        // Fire catches slowly, then spreads faster as it goes.
        ease: "power1.in",
        onUpdate: () => {
          rValueRef.current = growObj.r;
          paper.style.setProperty("--burn-r", `${growObj.r}px`);
        },
      },
      0.05
    );

    if (hazeRef.current) {
      tl.to(hazeRef.current, { opacity: 0.35, duration: 0.35 }, 0.1).to(
        hazeRef.current,
        { opacity: 0, duration: 0.9 },
        growDuration - 0.3
      );
    }

    // First wave only once a significant share of the paper has burned;
    // the rest follow as the front keeps advancing.
    const ashStart = 0.48;
    const ashEnd = 0.92;
    for (let wave = 0; wave < ASH_WAVES; wave++) {
      const t = ashStart + ((ashEnd - ashStart) * wave) / (ASH_WAVES - 1);
      tl.call(spawnWave, [wave], growDuration * t);
    }

    if (canvas) {
      tl.to(canvas, { opacity: 0, duration: decayDuration }, growDuration);
    }

    return () => {
      ticking = false;
      gsap.ticker.remove(tick);
      tl.kill();
    };
  }, [origin]);

  return (
    <button
      ref={stageRef}
      type="button"
      className={`burn-stage appearance-none border-0 bg-transparent p-0 text-left ${className ?? ""}`}
      data-burned={origin ? "" : undefined}
      onClick={ignite}
      aria-label={origin ? "Paper bomb, burned" : "Click the paper bomb to ignite it"}
      {...rest}
    >
      <div ref={paperRef} className="burn-paper">
        <PaperBomb className="burn-layer burn-base w-full h-full" />
        {origin && <PaperBomb className="burn-layer burn-char w-full h-full" aria-hidden="true" />}
      </div>

      {origin && (
        <>
          <canvas ref={canvasRef} className="burn-canvas" />
          <div ref={hazeRef} className="burn-haze" />
          <div ref={flashRef} className="burn-flash" style={{ width: 44, height: 44 }} />
          {ASH_KEYS.map((key, i) => (
            <div
              key={key}
              ref={(el) => {
                ashRefs.current[i] = el;
              }}
              className="burn-ash"
              style={{ "--size": `${rand(5, 10)}px` } as React.CSSProperties}
            />
          ))}
        </>
      )}

      <span className="burn-hint" data-hidden={origin ? "" : undefined}>
        Click to ignite
      </span>
    </button>
  );
}
