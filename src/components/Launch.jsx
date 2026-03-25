/**
 * Launch.jsx — Website Inauguration Ceremony
 * Beyond The Scroll · MGM College Campus, Udupi
 *
 * Complete rewrite:
 *  - Canvas-rendered realistic bow knot (pixel-perfect, two loops + two hanging tails)
 *  - Satin ribbon with woven texture and gold grosgrain trim
 *  - Smooth scissors descent + spring snap cut
 *  - Sparks + confetti burst
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const T = {
  bgSolid:  "#070402",
  gold:     "#c9a84c",
  goldLt:   "#f5d98b",
  goldPale: "#fef9c3",
  goldDk:   "#8b6914",
  goldDeep: "#3d2a00",
  red:      "#b91c1c",
  redDk:    "#7f1d1d",
  redLt:    "#ef4444",
};

// ─── Canvas Bow Draw Function ──────────────────────────────────────────────────
// Draws a full ribbon bow on a canvas context.
// (cx, cy) = the CENTER of the bow where it sits on the ribbon.
// The two loops extend up/sideways; two tails hang DOWN from center.

function drawBow(ctx, cx, cy) {
  ctx.save();
  ctx.translate(cx, cy);

  const g = (x1, y1, x2, y2, stops) => {
    const gr = ctx.createLinearGradient(x1, y1, x2, y2);
    stops.forEach(([t, c]) => gr.addColorStop(t, c));
    return gr;
  };

  // ── LEFT TAIL ─────────────────────────────────────────────────────────────
  ctx.beginPath();
  ctx.moveTo(-6, 8);
  ctx.bezierCurveTo(-12, 24, -26, 46, -38, 72);
  ctx.lineTo(-24, 76);
  ctx.bezierCurveTo(-14, 50, -2, 28, 6, 12);
  ctx.closePath();
  ctx.fillStyle = g(-6, 8, -38, 72, [[0, T.redLt], [0.35, T.red], [1, T.redDk]]);
  ctx.fill();
  // gold edge
  ctx.beginPath();
  ctx.moveTo(-6, 8);
  ctx.bezierCurveTo(-12, 24, -26, 46, -38, 72);
  ctx.strokeStyle = T.gold + "cc";
  ctx.lineWidth = 1.8;
  ctx.stroke();
  // silk sheen
  ctx.beginPath();
  ctx.moveTo(-3, 10);
  ctx.bezierCurveTo(-9, 26, -22, 48, -34, 72);
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // ── RIGHT TAIL ────────────────────────────────────────────────────────────
  ctx.beginPath();
  ctx.moveTo(6, 8);
  ctx.bezierCurveTo(12, 24, 26, 46, 38, 72);
  ctx.lineTo(24, 76);
  ctx.bezierCurveTo(14, 50, 2, 28, -6, 12);
  ctx.closePath();
  ctx.fillStyle = g(6, 8, 38, 72, [[0, T.redLt], [0.35, T.red], [1, T.redDk]]);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(6, 8);
  ctx.bezierCurveTo(12, 24, 26, 46, 38, 72);
  ctx.strokeStyle = T.gold + "cc";
  ctx.lineWidth = 1.8;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(3, 10);
  ctx.bezierCurveTo(9, 26, 22, 48, 34, 72);
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // ── LEFT LOOP ─────────────────────────────────────────────────────────────
  // Teardrop bulging left, pinched at center
  ctx.beginPath();
  ctx.moveTo(-6, -3);                              // top pinch at knot
  ctx.bezierCurveTo(-16, -28, -60, -34, -64, -8); // sweep far left
  ctx.bezierCurveTo(-60, 18, -18, 18, -6, 5);     // bottom arc back
  ctx.closePath();
  ctx.fillStyle = g(-64, -34, -6, 18, [[0, T.redLt], [0.45, T.red], [1, T.redDk]]);
  ctx.fill();
  // gold border
  ctx.strokeStyle = T.gold + "88";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  // inner fold shadow
  ctx.beginPath();
  ctx.moveTo(-10, -2);
  ctx.bezierCurveTo(-22, -18, -50, -22, -54, -6);
  ctx.bezierCurveTo(-50, 10, -22, 12, -10, 4);
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.lineWidth = 5;
  ctx.lineJoin = "round";
  ctx.stroke();
  // sheen highlight arc
  ctx.beginPath();
  ctx.moveTo(-32, -28);
  ctx.bezierCurveTo(-50, -28, -62, -18, -62, -4);
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.stroke();
  // secondary sheen
  ctx.beginPath();
  ctx.moveTo(-22, -26);
  ctx.bezierCurveTo(-40, -25, -54, -14, -55, 0);
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // ── RIGHT LOOP ────────────────────────────────────────────────────────────
  ctx.beginPath();
  ctx.moveTo(6, -3);
  ctx.bezierCurveTo(16, -28, 60, -34, 64, -8);
  ctx.bezierCurveTo(60, 18, 18, 18, 6, 5);
  ctx.closePath();
  ctx.fillStyle = g(64, -34, 6, 18, [[0, T.redLt], [0.45, T.red], [1, T.redDk]]);
  ctx.fill();
  ctx.strokeStyle = T.gold + "88";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(10, -2);
  ctx.bezierCurveTo(22, -18, 50, -22, 54, -6);
  ctx.bezierCurveTo(50, 10, 22, 12, 10, 4);
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(32, -28);
  ctx.bezierCurveTo(50, -28, 62, -18, 62, -4);
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(22, -26);
  ctx.bezierCurveTo(40, -25, 54, -14, 55, 0);
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // ── CENTER KNOT ───────────────────────────────────────────────────────────
  ctx.beginPath();
  ctx.ellipse(0, 1, 10, 14, 0, 0, Math.PI * 2);
  ctx.fillStyle = g(0, -13, 0, 15, [[0, T.redLt], [0.42, T.red], [1, T.redDk]]);
  ctx.fill();
  ctx.strokeStyle = T.gold;
  ctx.lineWidth = 1.8;
  ctx.stroke();
  // outer gold glow ring
  ctx.beginPath();
  ctx.ellipse(0, 1, 12.5, 16.5, 0, 0, Math.PI * 2);
  ctx.strokeStyle = T.goldLt + "55";
  ctx.lineWidth = 1;
  ctx.stroke();
  // glint
  ctx.beginPath();
  ctx.ellipse(-3.5, -5, 3, 4.5, -0.4, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fill();

  ctx.restore();
}

// ─── Bow Canvas Component ──────────────────────────────────────────────────────
// Renders bow onto a canvas. The bow's (cx, cy) is placed at canvas center.
// We size the canvas to fit loops (-64..64 x) and tails (0..76 y) with padding.

const BOW_PAD  = 10;
const BOW_W    = 64 * 2 + BOW_PAD * 2;  // 148
const BOW_H    = 34 + 76 + BOW_PAD * 2; // 120 (loops go up 34, tails go down 76)
const BOW_CX   = BOW_W / 2;             // 74 — horizontal center
const BOW_CY   = 34 + BOW_PAD;          // 44 — vertical origin (where bow sits on ribbon)

function BowCanvas({ visible }) {
  const canvasRef = useRef(null);
  const DPR = typeof window !== "undefined" ? (window.devicePixelRatio || 1) : 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!visible) return;
    ctx.scale(DPR, DPR);
    drawBow(ctx, BOW_CX, BOW_CY);
    // Reset transform so next clear works
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }, [visible, DPR]);

  // Position so BOW_CY (the point where bow meets ribbon) = ribbon vertical center
  // Ribbon is RIBBON_H=46px tall; its center from its own top = 23px.
  // Canvas top should be at: ribbonTop + 23 - BOW_CY
  // We use position absolute relative to Ribbon wrapper, top=0 = ribbon top
  const topOffset = 23 - BOW_CY; // 23 - 44 = -21

  return (
    <canvas
      ref={canvasRef}
      width={BOW_W * DPR}
      height={BOW_H * DPR}
      style={{
        width: BOW_W,
        height: BOW_H,
        position: "absolute",
        left: "50%",
        top: topOffset,
        transform: "translateX(-50%)",
        zIndex: 12,
        pointerEvents: "none",
        imageRendering: "crisp-edges",
      }}
    />
  );
}

// ─── Ribbon ────────────────────────────────────────────────────────────────────

const RIBBON_H = 46;

function RibbonHalf({ side, isCut, reduced }) {
  const L = side === "left";
  const cutAnim = L
    ? { x: -280, y: 64, rotate: -30, opacity: 0 }
    : { x:  280, y: 64, rotate:  30, opacity: 0 };

  return (
    <motion.div
      animate={isCut && !reduced ? cutAnim : {}}
      transition={{
        duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.05,
        opacity: { duration: 1.0, delay: 0.2 },
      }}
      style={{
        position: "absolute", top: 0, bottom: 0,
        left: L ? 0 : "50%",
        right: L ? "50%" : 0,
        transformOrigin: L ? "right center" : "left center",
        overflow: "hidden",
      }}
    >
      {/* Satin base */}
      <div style={{
        position: "absolute", inset: 0,
        background: L
          ? `linear-gradient(90deg, ${T.redDk}, ${T.red} 32%, #d63333 54%, ${T.redLt} 70%, ${T.red} 86%, ${T.redDk})`
          : `linear-gradient(90deg, ${T.redDk}, ${T.red} 14%, ${T.redLt} 30%, #d63333 50%, ${T.red} 72%, ${T.redDk})`,
      }} />
      {/* Top highlight */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.1) 25%, transparent 55%, rgba(0,0,0,0.2) 85%, rgba(0,0,0,0.34) 100%)",
      }} />
      {/* Woven threads */}
      {[0.2, 0.42, 0.62, 0.82].map((t, i) => (
        <div key={i} style={{
          position: "absolute", left: 0, right: 0, top: `${t * 100}%`,
          height: 0.65,
          background: i % 2 ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.11)",
        }} />
      ))}
      {/* Diagonal fold */}
      <div style={{
        position: "absolute", inset: 0,
        background: L
          ? "linear-gradient(155deg, transparent 38%, rgba(0,0,0,0.09) 52%, transparent 66%)"
          : "linear-gradient(205deg, transparent 38%, rgba(0,0,0,0.09) 52%, transparent 66%)",
      }} />
      {/* Gold top trim (double) */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, transparent, ${T.gold} 12%, ${T.goldLt} 50%, ${T.gold} 88%, transparent)`,
        boxShadow: `0 1px 6px ${T.gold}55`,
      }} />
      <div style={{ position: "absolute", top: 3.5, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${T.gold}66 12%, ${T.goldLt}aa 50%, ${T.gold}66 88%, transparent)`,
      }} />
      {/* Gold bottom trim (double) */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, transparent, ${T.gold} 12%, ${T.goldLt} 50%, ${T.gold} 88%, transparent)`,
        boxShadow: `0 -1px 6px ${T.gold}55`,
      }} />
      <div style={{ position: "absolute", bottom: 3.5, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${T.gold}66 12%, ${T.goldLt}aa 50%, ${T.gold}66 88%, transparent)`,
      }} />
    </motion.div>
  );
}

function Ribbon({ isCut, showBow, showSparks, reduced }) {
  return (
    <div
      style={{
        position: "relative", width: "100%", maxWidth: 400,
        height: RIBBON_H, margin: "0 auto", overflow: "visible",
      }}
      role="img" aria-label="ceremonial ribbon"
    >
      <RibbonHalf side="left"  isCut={isCut} reduced={reduced} />
      <RibbonHalf side="right" isCut={isCut} reduced={reduced} />

      {/* Cut guide line */}
      <AnimatePresence>
        {!isCut && (
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }} transition={{ duration: 0.4 }}
            style={{
              position: "absolute", left: "50%", top: -8, bottom: -8, width: 1,
              transform: "translateX(-50%)",
              background: `linear-gradient(180deg, transparent, ${T.goldLt}99 28%, ${T.goldLt}99 72%, transparent)`,
              zIndex: 5,
            }}
          />
        )}
      </AnimatePresence>

      {/* Text on ribbon */}
      <AnimatePresence>
        {!isCut && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8, transition: { delay: 1.1, duration: 0.7 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            style={{
              position: "absolute", left: "50%", top: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 7.5, fontWeight: 700,
              letterSpacing: "0.28em", textTransform: "uppercase",
              color: "#fff", whiteSpace: "nowrap",
              zIndex: 8, mixBlendMode: "overlay",
              userSelect: "none", pointerEvents: "none",
            }}
          >Beyond The Scroll</motion.span>
        )}
      </AnimatePresence>

      {/* Canvas bow — only shown before cut */}
      <AnimatePresence>
        {showBow && !isCut && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.15, opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              position: "absolute", inset: 0,
              overflow: "visible", zIndex: 10,
            }}
          >
            <BowCanvas visible={true} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sparks */}
      {!reduced && <CutSparks active={showSparks} />}

      {/* Shadow under ribbon */}
      <div style={{
        position: "absolute", left: "12%", right: "12%", bottom: -6, height: 14,
        background: `radial-gradient(ellipse, ${T.red}1a, transparent 70%)`,
        filter: "blur(6px)", pointerEvents: "none",
      }} />
    </div>
  );
}

// ─── Cut Sparks ────────────────────────────────────────────────────────────────

const SPARK_DATA = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  angle: (i / 22) * 360,
  dist:  30 + (i % 5) * 15,
  size:  1.4 + (i % 4) * 1.4,
  delay: (i % 5) * 0.016,
  color: [T.goldLt, T.gold, "#fff", T.redLt][i % 4],
}));

function CutSparks({ active }) {
  if (!active) return null;
  return (
    <div style={{
      position: "absolute", left: "50%", top: "50%",
      zIndex: 25, pointerEvents: "none",
    }}>
      {SPARK_DATA.map(s => (
        <motion.div
          key={s.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((s.angle * Math.PI) / 180) * s.dist,
            y: Math.sin((s.angle * Math.PI) / 180) * s.dist,
            opacity: 0, scale: 0,
          }}
          transition={{ duration: 0.7, delay: s.delay, ease: [0.2, 1, 0.4, 1] }}
          style={{
            position: "absolute",
            width: s.size, height: s.size, borderRadius: "50%",
            background: s.color,
            marginLeft: -s.size / 2, marginTop: -s.size / 2,
            boxShadow: `0 0 ${s.size * 4}px ${T.goldLt}`,
          }}
        />
      ))}
      <motion.div
        initial={{ scale: 0.3, opacity: 1 }}
        animate={{ scale: 3.8, opacity: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        style={{
          position: "absolute",
          width: 50, height: 50, borderRadius: "50%",
          marginLeft: -25, marginTop: -25,
          background: `radial-gradient(circle, ${T.goldLt}, ${T.gold}88 42%, transparent 70%)`,
        }}
      />
    </div>
  );
}

// ─── Scissors ──────────────────────────────────────────────────────────────────

function ScissorsSVG({ open }) {
  const spring = { type: "spring", stiffness: 300, damping: 24 };
  return (
    <svg viewBox="0 0 90 90" fill="none"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={T.goldDk} />
          <stop offset="48%" stopColor={T.goldLt} />
          <stop offset="100%" stopColor={T.gold} />
        </linearGradient>
        <filter id="bladeGlow">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feComposite in="SourceGraphic" in2="b" operator="over" />
        </filter>
      </defs>

      {/* Top blade */}
      <motion.g style={{ transformOrigin: "36px 45px" }}
        animate={{ rotate: open ? -30 : 0 }} transition={spring}
      >
        <ellipse cx="11" cy="24" rx="10.5" ry="7.5"
          stroke={T.gold} strokeWidth="2.2" fill={T.goldDeep} />
        <ellipse cx="11" cy="24" rx="5.5" ry="4"
          stroke={T.gold + "44"} strokeWidth="1" fill="none" />
        <path d="M21 24 Q36 33 68 43"
          stroke="url(#bladeGrad)" strokeWidth="4.2" strokeLinecap="round"
          filter="url(#bladeGlow)" />
        <path d="M21 23 Q36 32 68 42"
          stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round" />
      </motion.g>

      {/* Bottom blade */}
      <motion.g style={{ transformOrigin: "36px 45px" }}
        animate={{ rotate: open ? 30 : 0 }} transition={spring}
      >
        <ellipse cx="11" cy="66" rx="10.5" ry="7.5"
          stroke={T.gold} strokeWidth="2.2" fill={T.goldDeep} />
        <ellipse cx="11" cy="66" rx="5.5" ry="4"
          stroke={T.gold + "44"} strokeWidth="1" fill="none" />
        <path d="M21 66 Q36 57 68 47"
          stroke="url(#bladeGrad)" strokeWidth="4.2" strokeLinecap="round"
          filter="url(#bladeGlow)" />
        <path d="M21 67 Q36 58 68 48"
          stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round" />
      </motion.g>

      {/* Pivot screw */}
      <circle cx="36" cy="45" r="7" fill={T.gold} />
      <circle cx="36" cy="45" r="4.5" fill={T.goldDk} />
      <circle cx="36" cy="45" r="2" fill={T.goldDeep} />
      <circle cx="34.2" cy="43.2" r="1.3" fill="rgba(255,255,255,0.48)" />
    </svg>
  );
}

function ScissorsTrack({ phase, reduced }) {
  const yOf = {
    idle: -100, armed: -100,
    descending: -56,
    cutting: 0, cut: 0,
    celebrating: -120, exiting: -120,
  };
  const opOf = {
    idle: 0, armed: 0,
    descending: 1, cutting: 1, cut: 1,
    celebrating: 0, exiting: 0,
  };
  const y = yOf[phase] ?? -100;
  const opacity = opOf[phase] ?? 0;
  const open = ["idle", "armed", "descending"].includes(phase);

  return (
    <motion.div
      animate={reduced ? {} : { y, opacity }}
      transition={{
    y: {
      duration:
        phase === "descending" ? 0.3
        : phase === "cutting"  ? 0.15
        : phase === "celebrating" ? 0.55
        : 0.5,
      ease: phase === "cutting" ? [0.65, 0, 0.85, 0] : [0.22, 1, 0.36, 1],
    },
        opacity: { duration: 0.2 },
      }}
      style={{
        position: "absolute",
        left: "50%", top: "50%",
        marginLeft: -44, marginTop: -44,
        width: 88, height: 88,
        zIndex: 30,
        filter: `drop-shadow(0 2px 20px ${T.gold}aa)`,
        pointerEvents: "none",
      }}
    >
      <ScissorsSVG open={open} />
      <AnimatePresence>
        {phase === "cutting" && (
          <motion.div
            initial={{ scale: 0.4, opacity: 0.9 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: `radial-gradient(circle, ${T.goldLt}ee, transparent 60%)`,
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Ambient Particles ─────────────────────────────────────────────────────────

function Particles({ reduced }) {
  const pts = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    id: i, x: `${5 + (i * 93 / 30) % 90}%`, y: `${4 + (i * 87 / 30) % 90}%`,
    size: 0.7 + (i % 5) * 0.48, dur: 4 + (i % 7) * 0.85, delay: (i * 0.38) % 5,
    gold: i % 3 === 0,
  })), []);
  if (reduced) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }} aria-hidden="true">
      {pts.map(p => (
        <motion.div
          key={p.id}
          animate={{ y: [0, -17, 0], opacity: [0.08, p.gold ? 0.55 : 0.28, 0.08] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", left: p.x, top: p.y,
            width: p.size, height: p.size, borderRadius: "50%",
            background: p.gold ? T.goldLt : "rgba(255,255,255,0.85)",
            boxShadow: p.gold ? `0 0 ${p.size * 6}px ${T.gold}` : "none",
          }}
        />
      ))}
    </div>
  );
}

// ─── Background ────────────────────────────────────────────────────────────────

function Background({ reduced }) {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden="true">
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(${T.gold}07 1px, transparent 1px),
          linear-gradient(90deg, ${T.gold}07 1px, transparent 1px)
        `,
        backgroundSize: "68px 68px",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 20%, rgba(0,0,0,0.74) 100%)",
      }} />
      <motion.div
        animate={reduced ? {} : { scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "-15%", left: "-10%",
          width: 700, height: 700, borderRadius: "50%",
          background: `radial-gradient(circle, ${T.gold}22, transparent 66%)`,
          filter: "blur(54px)",
        }}
      />
      <motion.div
        animate={reduced ? {} : { scale: [1, 1.14, 1], opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        style={{
          position: "absolute", bottom: "-20%", right: "-12%",
          width: 620, height: 620, borderRadius: "50%",
          background: `radial-gradient(circle, ${T.red}22, transparent 66%)`,
          filter: "blur(60px)",
        }}
      />
      {/* Corner brackets */}
      {[
        { top: 18, left: 18, borderTop: 1, borderLeft: 1 },
        { top: 18, right: 18, borderTop: 1, borderRight: 1 },
        { bottom: 18, left: 18, borderBottom: 1, borderLeft: 1 },
        { bottom: 18, right: 18, borderBottom: 1, borderRight: 1 },
      ].map(({ borderTop: bT, borderRight: bR, borderBottom: bB, borderLeft: bL, ...pos }, i) => (
        <div key={i} style={{
          position: "absolute", width: 50, height: 50, ...pos,
          ...(bT ? { borderTop: `1px solid ${T.gold}44` } : {}),
          ...(bR ? { borderRight: `1px solid ${T.gold}44` } : {}),
          ...(bB ? { borderBottom: `1px solid ${T.gold}44` } : {}),
          ...(bL ? { borderLeft: `1px solid ${T.gold}44` } : {}),
        }} />
      ))}
    </div>
  );
}

// ─── Button ─────────────────────────────────────────────────────────────────────

function LaunchBtn({ onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
      style={{
        position: "relative",
        display: "inline-flex", alignItems: "center", gap: 10,
        padding: "0 46px", height: 58, borderRadius: 999,
        border: `1.5px solid ${T.gold}`,
        background: `linear-gradient(135deg, ${T.goldDeep}, ${T.goldDk} 40%, ${T.gold})`,
        color: T.goldPale,
        fontFamily: "'DM Mono', monospace",
        fontSize: 12, fontWeight: 600,
        letterSpacing: "0.22em", textTransform: "uppercase",
        cursor: "pointer", overflow: "hidden", outline: "none",
        boxShadow: hover
          ? `0 0 36px ${T.gold}44, 0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)`
          : `0 6px 26px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)`,
        transition: "box-shadow 0.3s",
      }}
    >
      <motion.div
        animate={hover ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.28 }}
        style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, ${T.goldDk}, ${T.gold} 45%, ${T.goldLt} 70%, ${T.gold})`,
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={hover ? { x: ["-115%", "230%"], opacity: [0, 1, 0] } : { x: "-115%", opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.36) 50%, transparent 80%)",
          transform: "skewX(-16deg)", pointerEvents: "none",
        }}
      />
      <motion.span
        animate={hover ? { rotate: [-18, 5, 0], scale: [1.2, 1] } : {}}
        transition={{ duration: 0.45, ease: "backOut" }}
        style={{ fontSize: 18, zIndex: 1 }} aria-hidden="true"
      >✂️</motion.span>
      <span style={{
        position: "relative", zIndex: 1,
        color: hover ? T.goldDeep : T.goldPale,
        transition: "color 0.28s",
      }}>Cut the Ribbon</span>
    </motion.button>
  );
}

// ─── Status Messages ───────────────────────────────────────────────────────────

function Status({ phase, onLaunch }) {
  const mono = { fontFamily: "'DM Mono', monospace" };
  return (
    <AnimatePresence mode="wait">
      {phase === "idle" && (
        <motion.div key="idle"
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.55 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}
        >
          <LaunchBtn onClick={onLaunch} />
          <p style={{ ...mono, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
            color: `${T.gold}55`, margin: 0 }}>
            Click to begin the ceremony
          </p>
        </motion.div>
      )}

      {(phase === "armed" || phase === "descending") && (
        <motion.div key="prep"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ ...mono, fontSize: 10, letterSpacing: "0.26em", textTransform: "uppercase",
            color: `${T.gold}88` }}
        >
          Preparing scissors…
        </motion.div>
      )}

      {phase === "cutting" && (
        <motion.div key="cutting"
          initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          style={{ ...mono, fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase",
            color: T.goldLt, textShadow: `0 0 22px ${T.gold}` }}
        >
          ✂ Cutting…
        </motion.div>
      )}

      {(phase === "cut" || phase === "celebrating") && (
        <motion.div key="done"
          initial={{ opacity: 0, scale: 0.78, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}
        >
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "13px 30px", borderRadius: 999,
            border: `1px solid ${T.gold}66`,
            background: `linear-gradient(135deg, ${T.gold}18, ${T.gold}0c)`,
            boxShadow: `0 0 32px ${T.gold}28`,
          }}>
            <motion.span animate={{ rotate: [0, 20, -12, 6, 0] }}
              transition={{ duration: 0.75, delay: 0.08 }} style={{ fontSize: 24 }}>🎉</motion.span>
            <span style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 28, letterSpacing: "0.12em",
              color: T.goldLt, textShadow: `0 0 30px ${T.gold}99`,
            }}>Launched!</span>
            <motion.span animate={{ rotate: [0, -20, 12, -6, 0] }}
              transition={{ duration: 0.75, delay: 0.2 }} style={{ fontSize: 24 }}>🎊</motion.span>
          </div>
          <p style={{ ...mono, fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.28)", margin: 0 }}>
            Entering experience…
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function Launch() {
  const [phase, setPhase] = useState("idle");
  const [sparks, setSparks] = useState(false);
  const reduced = useReducedMotion();
  const tids = useRef([]);

  useEffect(() => () => tids.current.forEach(clearTimeout), []);

  const after = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    tids.current.push(id);
  }, []);

  const boom = useCallback(() => {
    const cfg = { colors: [T.gold, T.goldLt, T.goldPale, T.red, "#fff"], ticks: 250 };
    confetti({ ...cfg, particleCount: 110, spread: 120, startVelocity: 44, origin: { x: 0.27, y: 0.56 } });
    after(() => confetti({ ...cfg, particleCount: 110, spread: 120, startVelocity: 44, origin: { x: 0.73, y: 0.56 } }), 160);
    after(() => confetti({ ...cfg, particleCount: 175, spread: 185, startVelocity: 16,
      origin: { x: 0.5, y: 0.2 }, gravity: 0.58, ticks: 360 }), 380);
  }, [after]);

  const handleCut = useCallback(() => {
    if (phase !== "idle") return;
    if (reduced) {
      setPhase("celebrating"); boom();
      after(() => setPhase("exiting"), 2000);
      after(() => { window.location.href = "/"; }, 3000);
      return;
    }
    setPhase("armed");
    after(() => setPhase("descending"), 10);
    after(() => { setPhase("cutting"); setSparks(true); }, 310);
    after(() => setSparks(false), 910);
    after(() => setPhase("cut"), 360);
    after(() => setPhase("celebrating"), 560);
    after(boom, 600);
    after(() => setPhase("exiting"), 1300);
    after(() => { window.location.href = "/"; }, 1800);
  }, [phase, reduced, after, boom]);

  const isCut    = ["cut", "celebrating", "exiting"].includes(phase);
  const isExit   = phase === "exiting";
  const showBow  = !["exiting", "done"].includes(phase);
  const sciPhase = useMemo(() => {
    if (phase === "idle" || phase === "armed") return "idle";
    return phase;
  }, [phase]);

  if (phase === "done") return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isExit
        ? { opacity: 0, scale: 1.06, filter: "blur(10px)" }
        : { opacity: 1, scale: 1, filter: "blur(0px)" }
      }
      transition={{ duration: isExit ? 0.95 : 0.75, ease: isExit ? [0.4, 0, 1, 1] : "easeOut" }}
      onAnimationComplete={() => { if (isExit) setPhase("done"); }}
      style={{
        position: "fixed", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: T.bgSolid, overflow: "hidden",
      }}
      role="main" aria-live="polite" aria-label="Website launch ceremony"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <Background reduced={reduced} />
      <Particles reduced={reduced} />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 52, scale: 0.93 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
        style={{
          position: "relative",
          width: "min(94vw, 520px)",
          padding: "clamp(40px, 6vw, 60px) clamp(32px, 6vw, 56px) clamp(40px, 6vw, 56px)",
          borderRadius: "clamp(22px, 3vw, 30px)",
          background: "linear-gradient(148deg, rgba(255,255,255,0.068) 0%, rgba(255,255,255,0.018) 100%)",
          border: `1px solid ${T.gold}33`,
          backdropFilter: "blur(34px)", WebkitBackdropFilter: "blur(34px)",
          boxShadow: `
            0 0 0 1px ${T.gold}11,
            0 48px 120px rgba(0,0,0,0.82),
            0 0 100px ${T.gold}09,
            inset 0 1px 0 rgba(255,255,255,0.09),
            inset 0 -1px 0 rgba(0,0,0,0.16)
          `,
          textAlign: "center", overflow: "visible",
        }}
      >
        {/* Top shimmer line */}
        <div style={{
          position: "absolute", top: 0, left: "14%", right: "14%", height: 2, borderRadius: 1,
          background: `linear-gradient(90deg, transparent, ${T.gold} 22%, ${T.goldLt} 50%, ${T.gold} 78%, transparent)`,
          boxShadow: `0 0 16px ${T.gold}66`,
        }} />

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.75 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 26 }}
        >
          <div style={{ height: 1, width: 38,
            background: `linear-gradient(90deg, transparent, ${T.gold}99)` }} />
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: 10,
            letterSpacing: "0.33em", textTransform: "uppercase",
            color: T.gold, fontWeight: 500,
          }}>Official Inauguration</span>
          <div style={{ height: 1, width: 38,
            background: `linear-gradient(90deg, ${T.gold}99, transparent)` }} />
        </motion.div>

        {/* WEBSITE */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.66, duration: 0.78 }}
          style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "clamp(58px, 13vw, 86px)",
            color: "#fff", letterSpacing: "0.07em", lineHeight: 0.93,
            margin: "0 0 2px", textShadow: `0 0 100px ${T.gold}1e`,
          }}
        >Website</motion.h1>

        {/* LAUNCH */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.80, duration: 0.58 }}
          style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "clamp(58px, 13vw, 86px)",
            letterSpacing: "0.07em", lineHeight: 1.04,
            margin: "0 0 44px",
            background: `linear-gradient(135deg, ${T.goldPale} 6%, ${T.gold} 46%, ${T.goldDk} 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            filter: `drop-shadow(0 0 28px ${T.gold}44)`,
          }}
        >Launch</motion.h1>

        {/* Ribbon + Scissors */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.05, duration: 0.8 }}
          style={{ position: "relative", paddingTop: 64, paddingBottom: 36, marginBottom: 40 }}
        >
          {/* Scissors hover above ribbon center */}
          <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 0, zIndex: 30 }}>
            <ScissorsTrack phase={sciPhase} reduced={reduced} />
          </div>

          <Ribbon isCut={isCut} showBow={showBow} showSparks={sparks} reduced={reduced} />
        </motion.div>

        {/* CTA / Status */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.18, duration: 0.75 }}
          style={{ minHeight: 84, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Status phase={phase} onLaunch={phase === "idle" ? handleCut : undefined} />
        </motion.div>

        {/* Bottom ornament */}
        <div style={{
          position: "absolute", bottom: 0, left: "30%", right: "30%", height: 1,
          background: `linear-gradient(90deg, transparent, ${T.gold}33, transparent)`,
        }} />
      </motion.div>
    </motion.div>
  );
}