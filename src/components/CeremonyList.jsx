import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

// ============================================================
// 🎯 CEREMONY DAY CONTROLS — EDIT THIS SECTION ON EVENT DAY
// ============================================================
// STATUS options: "upcoming" | "ongoing" | "done"
// To add images after ceremony ends, add paths to `images` array
// Example:
//   "trophy-trail": { status: "nedo", images: ["/images/ceremoney/trophy-1.jpg", "/images/ceremoney/trophy-2.jpg"] },
// ============================================================
const CEREMONY_STATUS = {
  "trophy-trail": { status: "done", images: ["/images/ceremoney/inaugral/trophy.JPG"] },
  "inaugural":    { status: "done", images: [] },
  "valedictory":  { status: "upcoming", images: [] },
};
// ============================================================
// END CEREMONY DAY CONTROLS
// ============================================================

const ceremonies = {
  top: [
    {
      id: "trophy-trail",
      time: "09:25 AM – 09:45 AM",
      title: "The Trophy Trail",
      subtitle: "The Grand Kick-off",
      venue: "College Quadrangle",
      floor: "Ground Floor",
      highlights: ["Flashmob", "Trophy Unveiling"],
      color: "#f5c842",
      accent: "#fff700",
      icon: "🏆",
    },
    {
      id: "inaugural",
      time: "09:45 AM – 10:20 AM",
      title: "Inaugural Ceremony",
      subtitle: "Official Commencement",
      venue: "Auditorium",
      floor: "Third Floor",
      highlights: ["Prayer", "Lighting of the Lamp", "Keynote", "Presidential Remarks"],
      color: "#f5c842",
      accent: "#fff700",
      icon: "✨",
    },
  ],
  bottom: [
    {
      id: "valedictory",
      time: "04:15 PM – 05:00 PM",
      title: "Valedictory Ceremony",
      subtitle: "The Grand Finale",
      venue: "T. Mohandas Pai Platinum Jubilee Block",
      floor: "MGM College Campus, Udupi",
      highlights: ["Feedback Session", "Prize Distribution", "Presidential Address", "Vote of Thanks"],
      color: "#f5c842",
      accent: "#fff700",
      icon: "🏅",
    },
  ],
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useInView(threshold = 0.08) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useRipple(color) {
  const [ripples, setRipples] = useState([]);
  const addRipple = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples(prev => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700);
  }, []);
  const rippleEls = ripples.map(r => (
    <span
      key={r.id}
      style={{
        position: "absolute", left: r.x, top: r.y,
        width: 10, height: 10, borderRadius: "50%",
        background: color + "50",
        transform: "translate(-50%,-50%) scale(0)",
        animation: "ripple 0.7s ease-out forwards",
        pointerEvents: "none",
      }}
    />
  ));
  return { onMouseDown: addRipple, rippleEls };
}

// ─── Gallery Overlay ───────────────────────────────────────────────────────────

function GalleryOverlay({ ceremony, images, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex ?? 0);
  const [displayIndex, setDisplayIndex] = useState(startIndex ?? 0);
  const [slideState, setSlideState] = useState("idle");
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const scrollerRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => setOverlayVisible(true));
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    if (overlayVisible && scrollerRef.current) scrollerRef.current.scrollTop = 0;
  }, [overlayVisible]);

  const navigate = useCallback((dir) => {
    if (isAnimating || images.length < 2) return;
    setIsAnimating(true);
    const nextIdx = dir === "right"
      ? (current + 1) % images.length
      : (current - 1 + images.length) % images.length;
    setSlideState(dir === "right" ? "exit-left" : "exit-right");
    setTimeout(() => {
      setDisplayIndex(nextIdx);
      setSlideState(dir === "right" ? "enter-right" : "enter-left");
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setSlideState("idle");
        setCurrent(nextIdx);
        setTimeout(() => setIsAnimating(false), 360);
      }));
    }, 320);
  }, [isAnimating, current, images.length]);

  const handleClose = useCallback(() => {
    setOverlayVisible(false);
    setTimeout(onClose, 380);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") navigate("right");
      else if (e.key === "ArrowLeft") navigate("left");
      else if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, handleClose]);

  const getImageStyle = () => {
    const base = { transition: "none", willChange: "transform, opacity" };
    switch (slideState) {
      case "exit-left":   return { ...base, transform: "translateX(-8%) scale(0.96)", opacity: 0, transition: "transform 0.32s cubic-bezier(0.4,0,0.6,1), opacity 0.28s ease" };
      case "exit-right":  return { ...base, transform: "translateX(8%) scale(0.96)",  opacity: 0, transition: "transform 0.32s cubic-bezier(0.4,0,0.6,1), opacity 0.28s ease" };
      case "enter-right": return { ...base, transform: "translateX(7%)",  opacity: 0 };
      case "enter-left":  return { ...base, transform: "translateX(-7%)", opacity: 0 };
      case "idle":        return { ...base, transform: "translateX(0) scale(1)", opacity: 1, transition: "transform 0.36s cubic-bezier(0.23,1,0.32,1), opacity 0.3s ease" };
      default:            return { ...base, transform: "translateX(0)", opacity: 1 };
    }
  };

  const overlay = (
    <div
      ref={scrollerRef}
      onClick={handleClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: overlayVisible ? "rgba(3,8,18,0.97)" : "rgba(3,8,18,0)",
        backdropFilter: overlayVisible ? "blur(28px)" : "blur(0px)",
        transition: "background 0.38s ease, backdrop-filter 0.38s ease",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "86px 16px 32px", overflowY: "auto",
      }}
    >
      {/* Header */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "absolute", top: 0, left: 0, right: 0,
          padding: "18px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, transparent 100%)",
          transform: overlayVisible ? "translateY(0)" : "translateY(-24px)",
          opacity: overlayVisible ? 1 : 0,
          transition: "all 0.48s cubic-bezier(0.23,1,0.32,1) 0.08s",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, ${ceremony.accent}55, ${ceremony.color}33)`,
            border: `1.5px solid ${ceremony.color}55`,
            boxShadow: `0 0 20px ${ceremony.color}77`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, flexShrink: 0,
          }}>
            {ceremony.icon}
          </div>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: ceremony.accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 2 }}>
              {ceremony.subtitle}
            </div>
            <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 22, letterSpacing: "0.05em", color: "#fff", lineHeight: 1 }}>
              {ceremony.title}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {images.length > 1 && (
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>
              <span style={{ color: ceremony.accent, fontWeight: 700 }}>{current + 1}</span>{" / "}{images.length}
            </div>
          )}
          <button
            onClick={handleClose}
            style={{
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: "50%", width: 38, height: 38,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "rgba(255,255,255,0.65)", fontSize: 18,
              transition: "all 0.22s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.16)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
          >✕</button>
        </div>
      </div>

      {/* Image */}
      <div
        onClick={e => e.stopPropagation()}
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX; touchStartY.current = e.touches[0].clientY; }}
        onTouchEnd={e => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
          if (Math.abs(dx) > dy && Math.abs(dx) > 44) navigate(dx < 0 ? "right" : "left");
          touchStartX.current = null;
        }}
        style={{
          position: "relative", width: "min(94vw, 1040px)",
          borderRadius: 22, overflow: "hidden",
          transform: overlayVisible ? "scale(1) translateY(0)" : "scale(0.86) translateY(36px)",
          opacity: overlayVisible ? 1 : 0,
          transition: "all 0.52s cubic-bezier(0.23,1,0.32,1) 0.05s",
          boxShadow: `0 0 0 1px ${ceremony.color}44, 0 50px 120px rgba(0,0,0,0.85), 0 0 80px ${ceremony.color}1a`,
          userSelect: "none",
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "min(72vh, 700px)", background: "#050c18", overflow: "hidden" }}>
          <img
            key={displayIndex}
            src={images[displayIndex]}
            alt={`${ceremony.title} — photo ${displayIndex + 1}`}
            draggable={false}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", ...getImageStyle() }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 35%, transparent 75%, rgba(0,0,0,0.25) 100%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "22%", background: "linear-gradient(90deg, rgba(0,0,0,0.28), transparent)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "22%", background: "linear-gradient(270deg, rgba(0,0,0,0.28), transparent)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent 0%, ${ceremony.color} 30%, ${ceremony.accent} 50%, ${ceremony.color} 70%, transparent 100%)`, opacity: 0.9 }} />
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            display: "flex", gap: 8, marginTop: 16,
            maxWidth: "min(94vw, 1040px)", overflowX: "auto",
            paddingBottom: 2, scrollbarWidth: "none",
            transform: overlayVisible ? "translateY(0)" : "translateY(18px)",
            opacity: overlayVisible ? 1 : 0,
            transition: "all 0.52s cubic-bezier(0.23,1,0.32,1) 0.16s",
          }}
        >
          {images.map((src, idx) => (
            <div
              key={idx}
              onClick={() => { if (!isAnimating && idx !== current) navigate(idx > current ? "right" : "left"); }}
              style={{
                flexShrink: 0, width: 68, height: 46, borderRadius: 8, overflow: "hidden",
                cursor: "pointer",
                border: idx === current ? `2.5px solid ${ceremony.accent}` : "2px solid rgba(255,255,255,0.1)",
                boxShadow: idx === current ? `0 0 16px ${ceremony.color}99` : "none",
                transform: idx === current ? "scale(1.1)" : "scale(1)",
                opacity: idx === current ? 1 : 0.48,
                transition: "all 0.28s cubic-bezier(0.34,1.56,0.64,1)",
              }}
              onMouseEnter={e => { if (idx !== current) { e.currentTarget.style.opacity = "0.8"; e.currentTarget.style.transform = "scale(1.05)"; } }}
              onMouseLeave={e => { if (idx !== current) { e.currentTarget.style.opacity = "0.48"; e.currentTarget.style.transform = "scale(1)"; } }}
            >
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none", display: "block" }} />
            </div>
          ))}
        </div>
      )}

      {/* Dot indicators */}
      {images.length > 1 && (
        <div
          onClick={e => e.stopPropagation()}
          style={{ display: "flex", gap: 7, marginTop: 14, opacity: overlayVisible ? 0.9 : 0, transition: "opacity 0.52s ease 0.2s" }}
        >
          {images.map((_, idx) => (
            <div
              key={idx}
              onClick={() => { if (!isAnimating && idx !== current) navigate(idx > current ? "right" : "left"); }}
              style={{
                width: idx === current ? 24 : 7, height: 7, borderRadius: 4,
                background: idx === current ? ceremony.accent : "rgba(255,255,255,0.2)",
                boxShadow: idx === current ? `0 0 12px ${ceremony.accent}aa` : "none",
                cursor: "pointer",
                transition: "all 0.32s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            />
          ))}
        </div>
      )}

      <div style={{
        marginTop: 20,
        fontFamily: "'DM Mono', monospace", fontSize: 10,
        color: "rgba(255,255,255,0.2)", letterSpacing: "0.16em", textTransform: "uppercase",
        opacity: overlayVisible ? 1 : 0, transition: "opacity 0.5s ease 0.28s",
      }}>
        {images.length > 1 ? "← → swipe · tap outside to close" : "tap outside to close"}
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(overlay, document.body);
}

// ─── Photo Strip ───────────────────────────────────────────────────────────────

function PhotoStrip({ images, color, accent, onOpen }) {
  if (!images || images.length === 0) return null;
  const count = images.length;
  const preview = images.slice(0, Math.min(count, 3));

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${color}66, transparent)` }} />
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: 10, color: accent,
          letterSpacing: "0.18em", textTransform: "uppercase",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          {count} Photo{count !== 1 ? "s" : ""}
        </span>
        <div style={{ height: 1, flex: 1, background: `linear-gradient(270deg, ${color}66, transparent)` }} />
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: count === 1 ? "1fr" : "1fr 1fr 1fr",
        gap: 5, borderRadius: 14, overflow: "hidden",
        border: `1px solid ${color}33`, cursor: "pointer",
      }}>
        {preview.map((src, i) => {
          const isOverflowSlot = i === 2 && count > 3;
          return (
            <div
              key={i}
              onClick={() => onOpen(i)}
              style={{
                position: "relative",
                paddingBottom: count === 1 ? "48%" : "70%",
                overflow: "hidden", background: "#07111f",
                gridColumn: count === 1 ? "1 / -1" : undefined,
              }}
            >
              <img
                src={src}
                alt={`photo ${i + 1}`}
                style={{
                  position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
                  transition: "transform 0.42s cubic-bezier(0.23,1,0.32,1)",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              />
              <div
                style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${color}1a, transparent)`, opacity: 0, transition: "opacity 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "1"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "0"; }}
              />
              {isOverflowSlot && (
                <div style={{
                  position: "absolute", inset: 0, background: "rgba(4,10,22,0.78)", backdropFilter: "blur(5px)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3,
                }}>
                  <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 30, color: "#fff", lineHeight: 1 }}>+{count - 2}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.45)", letterSpacing: "0.14em", textTransform: "uppercase" }}>more</span>
                </div>
              )}
              {count === 1 && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: "50%",
                    background: "rgba(0,0,0,0.52)", backdropFilter: "blur(8px)",
                    border: `1.5px solid ${color}77`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 0 22px ${color}66`,
                  }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill={accent}><path d="M5 3l14 9-14 9V3z"/></svg>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <button
          onClick={() => onOpen(0)}
          style={{
            marginTop: 8, width: "100%",
            background: `linear-gradient(135deg, ${color}18, ${color}09)`,
            border: `1px solid ${color}44`, borderRadius: 10,
            padding: "9px 0", color: accent,
            fontFamily: "'DM Mono', monospace", fontSize: 10.5,
            letterSpacing: "0.16em", textTransform: "uppercase",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "all 0.25s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${color}2e, ${color}14)`; e.currentTarget.style.boxShadow = `0 0 20px ${color}33`; }}
          onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${color}18, ${color}09)`; e.currentTarget.style.boxShadow = "none"; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          View all {count} photos
        </button>
      )}
    </div>
  );
}

// ─── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status, color, accent }) {
  if (status === "upcoming") return null;
  const cfg = status === "ongoing"
    ? { label: "LIVE NOW",  bg: "#ff6b0022", border: "#ff6b00aa", dot: "#ff6b00", pulse: true  }
    : { label: "COMPLETED", bg: color + "22", border: color + "88", dot: accent,    pulse: false };
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      borderRadius: 20, padding: "5px 14px", marginBottom: 12,
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: "50%",
        background: cfg.dot, boxShadow: `0 0 8px ${cfg.dot}`,
        display: "block", flexShrink: 0,
        animation: cfg.pulse ? "livePulse 1.2s ease-in-out infinite" : "none",
      }} />
      <span style={{
        color: cfg.dot, fontSize: 11, fontWeight: 700,
        letterSpacing: "0.18em", textTransform: "uppercase",
        fontFamily: "'DM Mono', monospace",
      }}>{cfg.label}</span>
    </div>
  );
}

// ─── Ceremony Card ─────────────────────────────────────────────────────────────

function CeremonyCard({ ceremony, index, onOpenGallery }) {
  const [ref, visible] = useInView(0.07);
  const [hovered, setHovered] = useState(false);
  const { onMouseDown, rippleEls } = useRipple(ceremony.color);

  const { status, images } = CEREMONY_STATUS[ceremony.id] ?? { status: "upcoming", images: [] };
  const isDone = status === "done";
  const isLive = status === "ongoing";

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={onMouseDown}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 20,
        padding: "24px 24px 22px",
        background: hovered
          ? "linear-gradient(135deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))"
          : "linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.015))",
        border: `1px solid ${isLive ? "#ff6b00cc" : hovered ? ceremony.color + "80" : "rgba(255,255,255,0.09)"}`,
        backdropFilter: "blur(20px)",
        boxShadow: isLive
          ? `0 0 28px #ff6b0044, 0 4px 24px rgba(0,0,0,0.28)`
          : hovered
          ? `0 24px 64px ${ceremony.color}28, 0 0 0 1px ${ceremony.color}22`
          : "0 4px 28px rgba(0,0,0,0.3)",
        transform: visible
          ? hovered ? "translateY(-5px)" : "translateY(0)"
          : "translateY(36px)",
        opacity: visible ? (isDone ? 0.72 : 1) : 0,
        transition: `opacity 0.62s ease ${index * 100}ms, transform 0.65s cubic-bezier(0.23,1,0.32,1) ${index * 100}ms, box-shadow 0.36s ease, border-color 0.3s ease, background 0.3s ease`,
        display: "flex",
        flexDirection: "column",
        flex: 1,
        filter: isDone ? "grayscale(0.15)" : "none",
        cursor: "default",
      }}
    >
      {rippleEls}

      {/* Top accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: isDone
          ? `linear-gradient(90deg, ${ceremony.color}55, ${ceremony.accent}55, transparent)`
          : `linear-gradient(90deg, ${ceremony.color}, ${ceremony.accent}, transparent)`,
        borderRadius: "2px 2px 0 0",
        opacity: hovered ? 1 : 0.6,
        transition: "opacity 0.35s ease",
      }} />

      {/* Live ring */}
      {isLive && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: 20,
          border: "1px solid #ff6b0055",
          animation: "liveGlow 1.8s ease-in-out infinite",
          pointerEvents: "none",
        }} />
      )}

      {/* Status badge */}
      <StatusBadge status={status} color={ceremony.color} accent={ceremony.accent} />

      {/* Time + icon row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10, padding: "5px 12px",
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={isDone ? "rgba(255,255,255,0.3)" : ceremony.color} strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span style={{
            color: isDone ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.85)",
            fontSize: 11.5, fontFamily: "'DM Mono', monospace",
            fontWeight: 500, letterSpacing: "0.03em",
          }}>{ceremony.time}</span>
        </div>

        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: isDone
            ? `radial-gradient(circle at 35% 35%, ${ceremony.accent}22, ${ceremony.color}18)`
            : `radial-gradient(circle at 35% 35%, ${ceremony.accent}55, ${ceremony.color}33)`,
          border: `1.5px solid ${isDone ? ceremony.color + "22" : ceremony.color + "44"}`,
          boxShadow: hovered && !isDone ? `0 0 22px ${ceremony.color}55` : `0 0 12px ${ceremony.color}28`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: isDone ? 16 : 20,
          opacity: isDone ? 0.5 : 1,
          transition: "all 0.45s cubic-bezier(0.34,1.56,0.64,1)",
          transform: hovered && !isDone ? "scale(1.15) rotate(-8deg)" : "scale(1)",
        }}>
          {isDone ? "✓" : ceremony.icon}
        </div>
      </div>

      {/* Title */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: "clamp(24px, 4.5vw, 34px)",
          color: isDone ? "rgba(255,255,255,0.42)" : "#fff",
          letterSpacing: "0.05em", margin: "0 0 4px", lineHeight: 1.05,
          textShadow: hovered && !isDone ? `0 0 28px ${ceremony.color}55` : "none",
          transition: "text-shadow 0.3s ease",
        }}>{ceremony.title}</h3>
        <p style={{
          color: isDone ? "rgba(255,255,255,0.22)" : ceremony.accent,
          fontSize: 10, fontFamily: "'DM Mono', monospace",
          textTransform: "uppercase", letterSpacing: "0.2em", margin: 0,
        }}>{ceremony.subtitle}</p>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: `linear-gradient(90deg, ${ceremony.color}40, transparent)`, marginBottom: 16 }} />

      {/* Venue */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: `${ceremony.color}14`, border: `1px solid ${ceremony.color}2a`,
          borderRadius: 8, padding: "5px 11px",
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={isDone ? "rgba(255,255,255,0.25)" : ceremony.accent} strokeWidth="2.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span style={{ color: isDone ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.78)", fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>
            {ceremony.venue}
          </span>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 10, fontFamily: "'DM Mono', monospace" }}>
            · {ceremony.floor}
          </span>
        </div>
      </div>

      {/* Highlights */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "auto" }}>
        {ceremony.highlights.map((h, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: `${ceremony.color}18`, border: `1px solid ${ceremony.color}40`,
              borderRadius: 20, padding: "4px 11px",
              color: isDone ? "rgba(255,255,255,0.28)" : ceremony.accent,
              fontSize: 10, fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.1em", textTransform: "uppercase",
            }}
          >
            <span style={{
              width: 4, height: 4, borderRadius: "50%",
              background: isDone ? "rgba(255,255,255,0.2)" : ceremony.accent,
              display: "block",
              boxShadow: isDone ? "none" : `0 0 5px ${ceremony.accent}`,
            }} />
            {h}
          </span>
        ))}
      </div>

      {/* Photo strip */}
      {images.length > 0 && (
        <PhotoStrip
          images={images}
          color={ceremony.color}
          accent={ceremony.accent}
          onOpen={(idx) => onOpenGallery(ceremony, images, idx)}
        />
      )}
    </div>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────

export default function CeremonyList({ type = "top" }) {
  const [mounted, setMounted] = useState(false);
  const [gallery, setGallery] = useState(null); // { ceremony, images, startIndex }

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const openGallery = useCallback((ceremony, images, startIndex = 0) => {
    setGallery({ ceremony, images, startIndex });
  }, []);
  const closeGallery = useCallback(() => setGallery(null), []);

  const selectedCeremonies = ceremonies[type] ?? [];
  if (selectedCeremonies.length === 0) return null;

  const isTop = type === "top";
  const sectionLabel = isTop ? "Opening Ceremonies" : "Closing Ceremony";
  const sectionSub   = isTop
    ? "Kick-off · Inaugural Commencement"
    : "Valedictory · Prize Distribution · Grand Finale";

  const orbs = isTop
    ? [
        { top: "8%",  left: "2%",   w: 340, c: "#f5c842", d: "4.5s", dl: "0s"   },
        { top: "55%", right: "3%",  w: 260, c: "#fff700", d: "5.5s", dl: "1.2s" },
      ]
    : [
        { top: "10%",   right: "2%", w: 300, c: "#f5c842", d: "5s", dl: "0.5s" },
        { bottom: "8%", left: "4%",  w: 220, c: "#ffd700", d: "6s", dl: "1.5s" },
      ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500;600&display=swap');
        @keyframes pulse-glow { 0%,100%{opacity:0.25;transform:scale(1);}50%{opacity:0.55;transform:scale(1.07);} }
        @keyframes ripple     { to { transform:translate(-50%,-50%) scale(22); opacity:0; } }
        @keyframes livePulse  { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(1.6);} }
        @keyframes liveGlow   { 0%,100%{box-shadow:0 0 0 0 #ff6b0033;}50%{box-shadow:0 0 0 6px #ff6b0011;} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {gallery && (
        <GalleryOverlay
          ceremony={gallery.ceremony}
          images={gallery.images}
          startIndex={gallery.startIndex}
          onClose={closeGallery}
        />
      )}

      <section style={{
        position: "relative",
        padding: isTop ? "72px 20px 64px" : "64px 20px 80px",
        overflow: "hidden",
        background: isTop
          ? "radial-gradient(ellipse at 20% 60%, #0d2a4a 0%, #081525 45%, #050e1a 100%)"
          : "radial-gradient(ellipse at 80% 40%, #0d2a4a 0%, #081525 45%, #050e1a 100%)",
      }}>
        {/* Ambient orbs */}
        {orbs.map((b, i) => (
          <div key={i} style={{
            position: "absolute",
            top: b.top, left: b.left, right: b.right, bottom: b.bottom,
            width: b.w, height: b.w, borderRadius: "50%",
            background: `radial-gradient(circle, ${b.c}18, transparent 70%)`,
            animation: `pulse-glow ${b.d} ease-in-out infinite ${b.dl}`,
            pointerEvents: "none",
          }} />
        ))}

        {/* Decorative corner brackets */}
        {isTop ? (
          <>
          </>
        ) : (
          <>
            <div style={{ position: "absolute", bottom: 0, left: 0,  width: 72, height: 72, borderBottom: "2px solid #f5c84260", borderLeft:  "2px solid #f5c84260" }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 72, height: 72, borderBottom: "2px solid #f5c84260", borderRight: "2px solid #f5c84260" }} />
          </>
        )}

        {/* Section header */}
        <div style={{
          textAlign: "center", marginBottom: 52,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(-24px)",
          transition: "all 0.9s cubic-bezier(0.23,1,0.32,1)",
        }}>
          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: 11,
            letterSpacing: "0.24em", color: "#f5c842",
            textTransform: "uppercase", margin: "0 0 10px",
          }}>
            {isTop ? "— Schedule —" : "— Grand Finale —"}
          </p>
          <h2 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "clamp(42px, 8vw, 84px)",
            margin: 0, letterSpacing: "0.06em", lineHeight: 1,
            background: "linear-gradient(135deg, #fff 30%, #f5c842 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>{sectionLabel}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <div style={{ height: 1, width: 28, background: "linear-gradient(90deg, transparent, #f5c842)" }} />
            <p style={{
              color: "rgba(255,255,255,0.32)", fontSize: 11, margin: 0,
              fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em",
              textAlign: "center", padding: "0 8px",
            }}>{sectionSub}</p>
            <div style={{ height: 1, width: 28, background: "linear-gradient(90deg, #f5c842, transparent)" }} />
          </div>
        </div>

        {/* Cards */}
        <div style={{
          maxWidth: selectedCeremonies.length === 1 ? 560 : 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: selectedCeremonies.length === 1
            ? "1fr"
            : "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20,
        }}>
          {selectedCeremonies.map((c, i) => (
            <CeremonyCard
              key={c.id}
              ceremony={c}
              index={i}
              onOpenGallery={openGallery}
            />
          ))}
        </div>
      </section>
    </>
  );
}