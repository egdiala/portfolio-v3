"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { spawnAshWave } from "../ash";
import { ASH_WAVES } from "../constants";
import { createTongues, drawFlames } from "../flame";
import type { ClickOrigin } from "../types";

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

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function usePaperBurn() {
  const stageRef = useRef<HTMLButtonElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const hazeRef = useRef<HTMLDivElement>(null);
  const ashRefs = useRef<Array<HTMLDivElement | null>>([]);

  const [origin, setOrigin] = useState<ClickOrigin | null>(null);
  const rValueRef = useRef(0);
  const startedRef = useRef(false);

  function ignite(event: MouseEvent<HTMLButtonElement>) {
    if (origin || !stageRef.current || startedRef.current) return;
    startedRef.current = true;
    setOrigin(getClickOrigin(stageRef.current, event.clientX, event.clientY));
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

    const tongues = createTongues();

    // Real paper doesn't consume itself quickly — give the burn room to breathe.
    const growDuration = 3.2;
    const decayDuration = 1;
    const startTime = performance.now();
    let ticking = true;

    function tick() {
      if (!ctx || !ticking) return;
      const elapsed = (performance.now() - startTime) / 1000;
      ticking = drawFlames(ctx, {
        elapsed,
        growDuration,
        decayDuration,
        width: rect.width,
        height: rect.height,
        radius: rValueRef.current,
        x: o.x,
        y: o.y,
        tongues,
      });
    }
    gsap.ticker.add(tick);

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
        0,
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
      0.05,
    );

    if (hazeRef.current) {
      tl.to(hazeRef.current, { opacity: 0.35, duration: 0.35 }, 0.1).to(
        hazeRef.current,
        { opacity: 0, duration: 0.9 },
        growDuration - 0.3,
      );
    }

    // First wave only once a significant share of the paper has burned;
    // the rest follow as the front keeps advancing.
    const ashStart = 0.48;
    const ashEnd = 0.92;
    for (let wave = 0; wave < ASH_WAVES; wave++) {
      const t = ashStart + ((ashEnd - ashStart) * wave) / (ASH_WAVES - 1);
      tl.call(spawnAshWave, [wave, o, rValueRef, ashRefs], growDuration * t);
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

  return {
    stageRef,
    paperRef,
    canvasRef,
    flashRef,
    hazeRef,
    ashRefs,
    origin,
    ignite,
  };
}
