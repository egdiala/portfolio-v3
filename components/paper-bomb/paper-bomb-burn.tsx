"use client";

import { PaperBomb } from "@/components/paper-bomb/paper-bomb";
import { ASH_KEYS } from "./constants";
import { rand } from "./flame";
import { usePaperBurn } from "./hooks/use-paper-burn";
import "./paper-bomb-burn.css";

export function PaperBombBurn(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;
  const { stageRef, paperRef, canvasRef, flashRef, hazeRef, ashRefs, origin, ignite } = usePaperBurn();

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
