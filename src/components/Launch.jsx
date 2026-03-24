import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import confetti from "canvas-confetti";

// ─── Constants ────────────────────────────────────────────────────────────────
const GOLD       = "#c9a84c";
const GOLD_LIGHT = "#f5d98b";
const GOLD_DARK  = "#8b6914";
const CRIMSON    = "#b91c1c";
const CRIMSON_DK = "#7f1d1d";

// ─── Scissor SVG ──────────────────────────────────────────────────────────────
function Scissors({ cutting }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* Top blade */}
      <motion.g
        animate={cutting ? { rotate: -28 } : { rotate: 0 }}
        transition={{ duration: 0.18, ease: "easeIn" }}
        style={{ originX: "50%", originY: "50%", transformOrigin: "32px 32px" }}
      >
        <ellipse cx="14" cy="22" rx="11" ry="7" stroke={GOLD} strokeWidth="2.5" fill={GOLD_DARK + "60"} />
        <line x1="22" y1="22" x2="56" y2="30" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
        <circle cx="14" cy="22" r="3.5" fill={GOLD} />
      </motion.g>
      {/* Bottom blade */}
      <motion.g
        animate={cutting ? { rotate: 28 } : { rotate: 0 }}
        transition={{ duration: 0.18, ease: "easeIn" }}
        style={{ originX: "50%", originY: "50%", transformOrigin: "32px 32px" }}
      >
        <ellipse cx="14" cy="42" rx="11" ry="7" stroke={GOLD} strokeWidth="2.5" fill={GOLD_DARK + "60"} />
        <line x1="22" y1="42" x2="56" y2="34" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
        <circle cx="14" cy="42" r="3.5" fill={GOLD} />
      </motion.g>
      {/* Pivot screw */}
      <circle cx="32" cy="32" r="4" fill={GOLD} />
      <circle cx="32" cy="32" r="2" fill={GOLD_DARK} />
    </svg>
  );
}

// ─── Cut Spark Particles ──────────────────────────────────────────────────────
function CutSparks({ active }) {
  const sparks = Array.from({ length: 14 }, (_, i) => ({
    angle: (i / 14) * 360,
    dist:  30 + Math.random() * 50,
    size:  2 + Math.random() * 3,
    delay: Math.random() * 0.08,
  }));

  if (!active) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 20 }}>
      {sparks.map((s, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((s.angle * Math.PI) / 180) * s.dist,
            y: Math.sin((s.angle * Math.PI) / 180) * s.dist,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 0.55, delay: s.delay, ease: "easeOut" }}
          style={{
            position: "absolute",
            left: "50%", top: "50%",
            width: s.size, height: s.size,
            borderRadius: "50%",
            background: i % 3 === 0 ? GOLD_LIGHT : i % 3 === 1 ? GOLD : "#fff",
            marginLeft: -s.size / 2, marginTop: -s.size / 2,
            boxShadow: `0 0 ${s.size * 3}px ${GOLD_LIGHT}`,
          }}
        />
      ))}
      {/* Flash */}
      <motion.div
        initial={{ opacity: 0.9, scale: 0.5 }}
        animate={{ opacity: 0, scale: 2.5 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%, -50%)",
          width: 48, height: 48, borderRadius: "50%",
          background: `radial-gradient(circle, ${GOLD_LIGHT}cc, transparent 70%)`,
        }}
      />
    </div>
  );
}

// ─── Ribbon Half ──────────────────────────────────────────────────────────────
function RibbonHalf({ side, cut, ribbonWidth }) {
  const isLeft = side === "left";

  const cutAnim = isLeft
    ? { x: -ribbonWidth * 0.6, y: 38, rotate: -22, opacity: 0, scaleX: 0.85 }
    : { x:  ribbonWidth * 0.6, y: 38, rotate:  22, opacity: 0, scaleX: 0.85 };

  return (
    <motion.div
      animate={cut ? cutAnim : {}}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
      style={{
        position: "absolute",
        top: 0,
        left:  isLeft ? 0    : "50%",
        right: isLeft ? "50%" : 0,
        height: "100%",
        overflow: "hidden",
        transformOrigin: isLeft ? "right center" : "left center",
      }}
    >
      {/* Silk gradient ribbon */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: isLeft
          ? `linear-gradient(90deg, ${CRIMSON_DK} 0%, ${CRIMSON} 45%, #ef4444 70%, #fca5a5 88%, ${CRIMSON} 100%)`
          : `linear-gradient(90deg, ${CRIMSON} 0%, #fca5a5 12%, #ef4444 30%, ${CRIMSON} 55%, ${CRIMSON_DK} 100%)`,
      }} />
      {/* Silk sheen highlight */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: isLeft
          ? "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.12) 100%)"
          : "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.12) 100%)",
      }} />
      {/* Gold trim edges */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${GOLD}, ${GOLD_LIGHT}, ${GOLD}, transparent)`,
        opacity: 0.9,
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${GOLD}, ${GOLD_LIGHT}, ${GOLD}, transparent)`,
        opacity: 0.9,
      }} />
    </motion.div>
  );
}

// ─── Ribbon Knot ──────────────────────────────────────────────────────────────
function RibbonKnot({ cut }) {
  return (
    <AnimatePresence>
      {!cut && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0, y: 8 }}
          transition={{ duration: 0.35, ease: "backOut" }}
          style={{
            position: "absolute",
            left: "50%", top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
            width: 36, height: 36,
          }}
        >
          {/* Knot body */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: `radial-gradient(circle at 38% 35%, ${CRIMSON}, ${CRIMSON_DK})`,
            boxShadow: `0 2px 12px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.15), 0 0 20px ${CRIMSON}66`,
          }} />
          {/* Gold ring */}
          <div style={{
            position: "absolute", inset: -3, borderRadius: "50%",
            border: `2px solid ${GOLD}`,
            boxShadow: `0 0 10px ${GOLD}66`,
          }} />
          {/* Knot shine */}
          <div style={{
            position: "absolute", top: 6, left: 8, width: 10, height: 6,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.22)",
            transform: "rotate(-20deg)",
          }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Ribbon Assembly ──────────────────────────────────────────────────────────
function Ribbon({ cut, sparks }) {
  const ribbonWidth = 360;

  return (
    <div style={{
      position: "relative",
      width: ribbonWidth,
      height: 28,
      margin: "0 auto",
    }}>
      <RibbonHalf side="left"  cut={cut} ribbonWidth={ribbonWidth} />
      <RibbonHalf side="right" cut={cut} ribbonWidth={ribbonWidth} />
      <RibbonKnot cut={cut} />
      {/* Cut point flash / sparks origin */}
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: 20 }}>
        <CutSparks active={sparks} />
      </div>
      {/* Cut line — visible before cut */}
      <AnimatePresence>
        {!cut && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute", left: "50%", top: -4, bottom: -4, width: 1,
              background: `linear-gradient(180deg, transparent, ${GOLD_LIGHT}88, transparent)`,
              transform: "translateX(-50%)",
              zIndex: 5,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Scissors Track ───────────────────────────────────────────────────────────
function ScissorsTrack({ phase }) {
  // phase: "idle" | "moving" | "cutting" | "done"
  const y = phase === "idle"    ? -70
          : phase === "moving"  ? -70
          : phase === "cutting" ? 0
          : 60;

  const opacity = phase === "done" ? 0 : 1;
  const cutting = phase === "cutting";

  return (
    <motion.div
      animate={{ y, opacity }}
      transition={{
        y:       { duration: phase === "moving" ? 0.6 : phase === "cutting" ? 0.18 : 0.45, ease: phase === "cutting" ? [0.55, 0, 1, 0.45] : "easeInOut" },
        opacity: { duration: 0.35 },
      }}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        marginTop: -14,
        transform: "translate(-50%, -50%)",
        width: 56, height: 56,
        zIndex: 30,
        filter: `drop-shadow(0 0 12px ${GOLD}99)`,
      }}
    >
      <Scissors cutting={cutting} />
    </motion.div>
  );
}

// ─── Ambient Particles ────────────────────────────────────────────────────────
function AmbientParticles() {
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: `${5 + Math.random() * 90}%`,
    y: `${5 + Math.random() * 90}%`,
    size: 1 + Math.random() * 2.5,
    duration: 4 + Math.random() * 6,
    delay: Math.random() * 5,
    gold: Math.random() > 0.6,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          animate={{ y: [0, -18, 0], opacity: [0.15, 0.55, 0.15] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            left: p.x, top: p.y,
            width: p.size, height: p.size,
            borderRadius: "50%",
            background: p.gold ? GOLD_LIGHT : "rgba(255,255,255,0.8)",
            boxShadow: p.gold ? `0 0 ${p.size * 4}px ${GOLD}` : "none",
          }}
        />
      ))}
    </div>
  );
}

// ─── Grid / Geometric BG ─────────────────────────────────────────────────────
function GridBG() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {/* Radial vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.65) 100%)",
      }} />
      {/* Subtle grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
      }} />
      {/* Gold orbs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.28, 0.18] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "-10%", left: "-5%",
          width: 640, height: 640, borderRadius: "50%",
          background: `radial-gradient(circle, ${GOLD}22, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        style={{
          position: "absolute", bottom: "-15%", right: "-8%",
          width: 560, height: 560, borderRadius: "50%",
          background: `radial-gradient(circle, ${CRIMSON}22, transparent 70%)`,
          filter: "blur(50px)",
        }}
      />
      {/* Corner ornaments */}
      {[
        { top: 24, left: 24 },
        { top: 24, right: 24 },
        { bottom: 24, left: 24 },
        { bottom: 24, right: 24 },
      ].map((pos, i) => (
        <div key={i} style={{
          position: "absolute", ...pos,
          width: 48, height: 48,
          borderTop:    (pos.top    !== undefined) ? `1px solid ${GOLD}55` : "none",
          borderBottom: (pos.bottom !== undefined) ? `1px solid ${GOLD}55` : "none",
          borderLeft:   (pos.left   !== undefined) ? `1px solid ${GOLD}55` : "none",
          borderRight:  (pos.right  !== undefined) ? `1px solid ${GOLD}55` : "none",
        }} />
      ))}
    </div>
  );
}

// ─── Launch Button ────────────────────────────────────────────────────────────
function LaunchButton({ onClick, disabled }) {
  const [hovered, setHovered] = useState(false);
  const [pressed,  setPressed]  = useState(false);

  return (
    <motion.button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.94 }}
      style={{
        position: "relative",
        padding: "0 40px",
        height: 56,
        borderRadius: 999,
        border: `1.5px solid ${hovered ? GOLD_LIGHT : GOLD}`,
        background: hovered
          ? `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD}, ${GOLD_LIGHT}, ${GOLD})`
          : `linear-gradient(135deg, ${GOLD_DARK}cc, ${GOLD}cc)`,
        color: hovered ? "#1a0f00" : GOLD_LIGHT,
        fontFamily: "'DM Mono', monospace",
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 10,
        overflow: "hidden",
        boxShadow: hovered
          ? `0 0 0 4px ${GOLD}22, 0 8px 32px ${GOLD}44, inset 0 1px 0 rgba(255,255,255,0.3)`
          : `0 0 0 1px ${GOLD}22, 0 4px 20px ${GOLD}22`,
        transition: "all 0.28s cubic-bezier(0.23,1,0.32,1)",
      }}
    >
      {/* Shimmer sweep */}
      <motion.div
        animate={hovered ? { x: ["−120%", "220%"] } : { x: "-120%" }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.35) 50%, transparent 65%)",
          pointerEvents: "none",
          transform: "skewX(-15deg)",
        }}
      />
      {/* Scissors icon */}
      <motion.span
        animate={hovered ? { rotate: [0, -15, 0] } : { rotate: 0 }}
        transition={{ duration: 0.4, ease: "backOut" }}
        style={{ fontSize: 18, display: "flex", alignItems: "center" }}
      >
        ✂️
      </motion.span>
      <span style={{ position: "relative", zIndex: 1 }}>Cut the Ribbon</span>
    </motion.button>
  );
}

// ─── Countdown Ring ──────────────────────────────────────────────────────────
function CountdownRing({ progress }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);

  return (
    <svg width={56} height={56} style={{ position: "absolute", top: -14, left: -14, transform: "rotate(-90deg)" }}>
      <circle cx={28} cy={28} r={r} fill="none" stroke={GOLD + "22"} strokeWidth={2} />
      <motion.circle
        cx={28} cy={28} r={r}
        fill="none" stroke={GOLD} strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transition={{ duration: 0.05 }}
      />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Launch() {
  // phases: "idle" → "scissors-in" → "cutting" → "cut" → "celebrate" → "exit"
  const [phase, setPhase] = useState("idle");
  const [sparks, setSparks] = useState(false);
  const [exitDone, setExitDone] = useState(false);

  const handleLaunch = useCallback(() => {
    if (phase !== "idle") return;

    // 1. Scissors descend
    setPhase("scissors-in");

    // 2. Scissors snap shut + sparks + ribbon splits
    setTimeout(() => {
      setPhase("cutting");
      setSparks(true);
      setTimeout(() => setSparks(false), 700);
    }, 700);

    // 3. Mark ribbon as cut
    setTimeout(() => setPhase("cut"), 820);

    // 4. Scissors fly up and out
    setTimeout(() => setPhase("celebrate"), 1000);

    // 5. Confetti
    setTimeout(() => {
      // First burst
      confetti({
        particleCount: 80,
        spread: 100,
        startVelocity: 38,
        origin: { x: 0.35, y: 0.55 },
        colors: [GOLD, GOLD_LIGHT, CRIMSON, "#fff", "#fef9c3"],
        ticks: 200,
      });
      // Second burst
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 100,
          startVelocity: 38,
          origin: { x: 0.65, y: 0.55 },
          colors: [GOLD, GOLD_LIGHT, CRIMSON, "#fff", "#fef9c3"],
          ticks: 200,
        });
      }, 160);
      // Third shower
      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 160,
          startVelocity: 20,
          origin: { x: 0.5, y: 0.3 },
          colors: [GOLD, GOLD_LIGHT, "#fff"],
          gravity: 0.6,
          ticks: 300,
        });
      }, 400);
    }, 1100);

    // 6. Exit
    setTimeout(() => setPhase("exit"), 2800);

    // 7. Redirect
    setTimeout(() => {
      window.location.href = "/";
    }, 3600);
  }, [phase]);

  const isCut      = ["cut", "celebrate", "exit"].includes(phase);
  const isExiting  = phase === "exit";
  const isIdle     = phase === "idle";

  const scissorsPhase =
    phase === "idle"       ? "idle"
    : phase === "scissors-in" ? "moving"
    : phase === "cutting"     ? "cutting"
    : "done";

  return (
    <AnimatePresence>
      {!exitDone && (
        <motion.div
          key="launch"
          initial={{ opacity: 0 }}
          animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 1.04 : 1 }}
          transition={{ duration: isExiting ? 0.8 : 0.7, ease: "easeInOut" }}
          onAnimationComplete={() => { if (isExiting) setExitDone(true); }}
          style={{
            position: "fixed", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "#080400",
            fontFamily: "'DM Mono', monospace",
            overflow: "hidden",
          }}
        >
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500;600&display=swap');
          `}</style>

          <GridBG />
          <AmbientParticles />

          {/* ── Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
            style={{
              position: "relative",
              width: "min(92vw, 520px)",
              padding: "52px 48px 48px",
              borderRadius: 28,
              background: "linear-gradient(145deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 100%)",
              border: `1px solid ${GOLD}33`,
              backdropFilter: "blur(24px)",
              boxShadow: `
                0 0 0 1px ${GOLD}18,
                0 32px 80px rgba(0,0,0,0.7),
                0 0 60px ${GOLD}0a,
                inset 0 1px 0 rgba(255,255,255,0.07)
              `,
              textAlign: "center",
              overflow: "visible",
            }}
          >
            {/* Top gold line */}
            <div style={{
              position: "absolute", top: 0, left: "15%", right: "15%", height: 2,
              background: `linear-gradient(90deg, transparent, ${GOLD}, ${GOLD_LIGHT}, ${GOLD}, transparent)`,
              borderRadius: 1,
            }} />

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                marginBottom: 20,
              }}
            >
              <div style={{ height: 1, width: 28, background: `linear-gradient(90deg, transparent, ${GOLD}88)` }} />
              <span style={{
                fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase",
                color: GOLD, fontWeight: 500,
              }}>Official Ceremony</span>
              <div style={{ height: 1, width: 28, background: `linear-gradient(90deg, ${GOLD}88, transparent)` }} />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.75, ease: [0.23, 1, 0.32, 1] }}
              style={{
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: "clamp(52px, 10vw, 76px)",
                color: "#fff",
                letterSpacing: "0.06em",
                lineHeight: 1,
                margin: "0 0 6px",
                textShadow: `0 0 60px ${GOLD}33`,
              }}
            >
              Website
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.68, duration: 0.75, ease: [0.23, 1, 0.32, 1] }}
              style={{
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: "clamp(52px, 10vw, 76px)",
                letterSpacing: "0.06em",
                lineHeight: 1,
                margin: "0 0 32px",
                background: `linear-gradient(135deg, ${GOLD_LIGHT} 20%, ${GOLD} 55%, ${GOLD_DARK} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Launch
            </motion.h1>

            {/* ── Ribbon Section ── */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0.7 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.85, duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ position: "relative", marginBottom: 40, paddingTop: 32, paddingBottom: 20 }}
            >
              {/* Scissors above ribbon */}
              <div style={{ position: "relative", height: 0 }}>
                <ScissorsTrack phase={scissorsPhase} />
              </div>

              <Ribbon cut={isCut} sparks={sparks} />

              {/* "Beyond The Scroll" label on ribbon */}
              <AnimatePresence>
                {!isCut && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 1.1, duration: 0.4 }}
                    style={{
                      position: "absolute",
                      top: "50%", left: "50%",
                      transform: "translate(-50%, calc(-50% + 2px))",
                      fontSize: 8.5,
                      fontWeight: 600,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.7)",
                      pointerEvents: "none",
                      zIndex: 5,
                      whiteSpace: "nowrap",
                      mixBlendMode: "overlay",
                    }}
                  >
                    Beyond The Scroll
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ── CTA / Status ── */}
            <AnimatePresence mode="wait">
              {isIdle && (
                <motion.div
                  key="button"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ delay: 1.0, duration: 0.5, ease: "easeOut" }}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <LaunchButton onClick={handleLaunch} />
                </motion.div>
              )}

              {(phase === "scissors-in" || phase === "cutting") && (
                <motion.div
                  key="cutting-msg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
                    color: GOLD + "99",
                  }}
                >
                  Cutting ribbon…
                </motion.div>
              )}

              {isCut && !isExiting && (
                <motion.div
                  key="launched"
                  initial={{ opacity: 0, scale: 0.85, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  }}
                >
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 24px",
                    borderRadius: 999,
                    border: `1px solid ${GOLD}55`,
                    background: `${GOLD}12`,
                  }}>
                    <motion.span
                      animate={{ rotate: [0, 15, -10, 8, 0] }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      style={{ fontSize: 20 }}
                    >🎉</motion.span>
                    <span style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 22, letterSpacing: "0.1em",
                      color: GOLD_LIGHT,
                    }}>Launched!</span>
                    <motion.span
                      animate={{ rotate: [0, -15, 10, -8, 0] }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      style={{ fontSize: 20 }}
                    >🎊</motion.span>
                  </div>
                  <p style={{
                    fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.35)", margin: 0,
                  }}>
                    Entering experience…
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom ornament */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              style={{
                position: "absolute", bottom: -1, left: "30%", right: "30%", height: 1,
                background: `linear-gradient(90deg, transparent, ${GOLD}44, transparent)`,
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}