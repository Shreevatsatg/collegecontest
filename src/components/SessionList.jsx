import { useEffect, useRef, useState, useCallback } from "react";

// ============================================================
// 🎯 SESSION DAY CONTROLS — EDIT THIS SECTION ON EVENT DAY
// ============================================================
// STATUS options: "upcoming" | "ongoing" | "done"
// images: add photo paths here after the session ends
// Example:
//   1: { status: "done", images: ["/photos/design-journey-1.jpg"] },
// ============================================================
const SESSION_STATUS = {
  1: { status: "upcoming", images: ["/images/IMG_20240516_222754_288.jpg","/images/IMG_20241105_102653.jpg"] },
  2: { status: "upcoming", images: [] },
  3: { status: "upcoming", images: [] },
  4: { status: "upcoming", images: [] },
  5: { status: "upcoming", images: [] },
  6: { status: "upcoming", images: [] },
  7: { status: "upcoming", images: [] },
};
// ============================================================
// END SESSION DAY CONTROLS
// ============================================================

// ── Session Data ───────────────────────────────────────────
// poster paths: put the actual poster images inside /public/posters/
// Rename your WhatsApp images to these filenames:
//   design-journey.jpeg        → The Design Journey poster
//   speak-influence.jpeg       → Speak. Influence. Repeat. poster
//   research-mindset.jpeg      → The Research Mindset poster
//   digital-growth.jpeg        → Digital Growth poster
//   content-to-cinema.jpeg     → Content to Cinema poster
//   stories-in-seconds.jpeg    → Stories in Seconds poster
//   rhythms-of-expression.jpeg → Rhythms of Expression poster
const sessions = [
  {
    id: 1,
    time: "11:30 AM",
    title: "The Design Journey",
    subtitle: "Pixel to Paycheck",
    type: "Career Talk",
    venue: "Computer Lab 1",
    floor: "First Floor",
    color: "#f39c12",
    accent: "#ffd166",
    poster: "/posters/thedesignjourney.jpeg",
    speakers: [
      { name: "Mr. Akanksh JB", role: "Panelist" },
      { name: "Mr. Kaushik Hebbar", role: "Panelist" },
      { name: "Ms. Anvitha RB", role: "Moderator" },
    ],
  },
  {
    id: 2,
    time: "12:00 PM",
    title: "Speak. Influence. Repeat.",
    subtitle: "The Power of Words",
    type: "TED Style Talk",
    venue: "Auditorium",
    floor: "Third Floor",
    color: "#e74c3c",
    accent: "#ff7b6b",
    poster: "/posters/tedstyletalk.jpeg",
    speakers: [
      { name: "Mr. Avinash Kamath", role: "Emcee · Media Personality" },
    ],
  },
  {
    id: 3,
    time: "12:30 PM",
    title: "The Research Mindset",
    subtitle: "Foundations of Academic Research",
    type: "Expert Insights",
    venue: "Conference Hall",
    floor: "Ground Floor",
    color: "#3498db",
    accent: "#72c6ff",
    poster: "/posters/theresearchmindset.jpeg",
    speakers: [
      { name: "Dr. Prabhakar Sastri", role: "Expert" },
      { name: "Dr. Gananath Yekkar", role: "Expert" },
    ],
  },
  {
    id: 4,
    time: "1:15 PM",
    title: "Digital Growth",
    subtitle: "Content That Converts",
    type: "Creator Talk",
    venue: "Room No. 1",
    floor: "Ground Floor",
    color: "#9b59b6",
    accent: "#d198ff",
    poster: "/posters/degitalgrowth.jpeg",
    speakers: [
      { name: "Mr. Poornaraj Padmashali", role: "Resource Person" },
      { name: "Mr. Sanath Kotian", role: "Moderator" },
    ],
  },
  {
    id: 5,
    time: "2:15 PM",
    title: "Content to Cinema",
    subtitle: "Stories on Screen",
    type: "Panel Discussion",
    venue: "Auditorium",
    floor: "Third Floor",
    color: "#1abc9c",
    accent: "#0ef5c8",
    poster: "/posters/contenttocenema.jpeg",
    speakers: [
      { name: "Mr. Justin Erol Dsilva", role: "Panelist" },
      { name: "Mr. Neeraj", role: "Panelist" },
      { name: "Mr. Farhan", role: "Panelist" },
      { name: "Mr. Stalin Danson D'Souza", role: "Moderator" },
    ],
  },
  {
    id: 6,
    time: "3:30 PM",
    title: "Stories in Seconds",
    subtitle: "Voices of a Generation",
    type: "Short Format Content",
    venue: "Computer Lab 1",
    floor: "First Floor",
    color: "#e91e8c",
    accent: "#ff6ec7",
    poster: "/posters/storiesinseconds.jpeg",
    speakers: [
      { name: "Mr. Samarth Adiga", role: "Panelist" },
      { name: "Mr. Nandeesh", role: "Panelist" },
      { name: "Ms. Nayana Naik", role: "Moderator" },
    ],
  },
  {
    id: 7,
    time: "3:30 PM",
    title: "Rhythms of Expression",
    subtitle: "From Passion to Performance",
    type: "Panel Discussion",
    venue: "Auditorium",
    floor: "Third Floor",
    color: "#f39c12",
    accent: "#ffd166",
    poster: "/posters/rhythmsofexpression.jpeg",
    speakers: [
      { name: "Mr. Sandeep L. Shettigar", role: "Panelist" },
      { name: "Mr. Prashanth", role: "Panelist" },
      { name: "Mr. Hemanth Shettigar", role: "Panelist" },
      { name: "Ms. Varshini Kotian", role: "Moderator" },
    ],
  },
];

const TYPE_COLORS = {
  "Career Talk":          { bg: "#f39c1222", border: "#f39c1288", text: "#ffd166" },
  "TED Style Talk":       { bg: "#e74c3c22", border: "#e74c3c88", text: "#ff7b6b" },
  "Expert Insights":      { bg: "#3498db22", border: "#3498db88", text: "#72c6ff" },
  "Creator Talk":         { bg: "#9b59b622", border: "#9b59b688", text: "#d198ff" },
  "Panel Discussion":     { bg: "#1abc9c22", border: "#1abc9c88", text: "#0ef5c8" },
  "Short Format Content": { bg: "#e91e8c22", border: "#e91e8c88", text: "#ff6ec7" },
};

// ── Hooks ──────────────────────────────────────────────────
function useInView(threshold = 0.05) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ── Gallery Nav Arrow ──────────────────────────────────────
function GalleryNavArrow({ dir, color, accent, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "absolute", top: "50%",
        [dir === "left" ? "left" : "right"]: 14,
        width: 50, height: 50, borderRadius: "50%",
        background: hov ? "rgba(0,0,0,0.78)" : "rgba(0,0,0,0.42)",
        backdropFilter: "blur(12px)",
        border: `1.5px solid ${hov ? color + "cc" : "rgba(255,255,255,0.15)"}`,
        boxShadow: hov ? `0 0 24px ${color}77` : "none",
        color: hov ? accent : "rgba(255,255,255,0.65)",
        fontSize: 26, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transform: `translateY(-50%) ${hov ? (dir === "left" ? "translateX(-4px)" : "translateX(4px)") : ""}`,
        transition: "all 0.26s cubic-bezier(0.34,1.56,0.64,1)", zIndex: 5,
      }}
    >{dir === "left" ? "‹" : "›"}</button>
  );
}

// ── Gallery Overlay ────────────────────────────────────────
function GalleryOverlay({ session, images, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex || 0);
  const [slideState, setSlideState] = useState("idle");
  const [displayIndex, setDisplayIndex] = useState(startIndex || 0);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => setOverlayVisible(true));
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") navigate("right");
      else if (e.key === "ArrowLeft") navigate("left");
      else if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const handleClose = () => { setOverlayVisible(false); setTimeout(onClose, 380); };

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

  const getImageStyle = () => {
    const base = { transition: "none", willChange: "transform, opacity" };
    switch (slideState) {
      case "exit-left":   return { ...base, transform: "translateX(-8%) scale(0.96)", opacity: 0, transition: "transform 0.32s cubic-bezier(0.4,0,0.6,1), opacity 0.28s ease" };
      case "exit-right":  return { ...base, transform: "translateX(8%) scale(0.96)", opacity: 0, transition: "transform 0.32s cubic-bezier(0.4,0,0.6,1), opacity 0.28s ease" };
      case "enter-right": return { ...base, transform: "translateX(7%)", opacity: 0 };
      case "enter-left":  return { ...base, transform: "translateX(-7%)", opacity: 0 };
      case "idle":        return { ...base, transform: "translateX(0) scale(1)", opacity: 1, transition: "transform 0.36s cubic-bezier(0.23,1,0.32,1), opacity 0.3s ease" };
      default:            return { ...base, transform: "translateX(0)", opacity: 1 };
    }
  };

  return (
    <div onClick={handleClose} style={{ position: "fixed", inset: 0, zIndex: 9999, background: overlayVisible ? "rgba(3,8,18,0.97)" : "rgba(3,8,18,0)", backdropFilter: overlayVisible ? "blur(28px)" : "blur(0px)", transition: "background 0.38s ease, backdrop-filter 0.38s ease", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {/* Header bar */}
      <div onClick={e => e.stopPropagation()} style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, transparent 100%)", transform: overlayVisible ? "translateY(0)" : "translateY(-24px)", opacity: overlayVisible ? 1 : 0, transition: "all 0.48s cubic-bezier(0.23,1,0.32,1) 0.08s", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${session.color}44, ${session.color}22)`, border: `1px solid ${session.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📸</div>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: session.accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 1 }}>{session.type}</div>
            <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 20, letterSpacing: "0.04em", color: "#fff", lineHeight: 1 }}>{session.title}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {images.length > 1 && (
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
              <span style={{ color: session.accent, fontWeight: 700 }}>{current + 1}</span>{" / "}{images.length}
            </div>
          )}
          <button onClick={handleClose} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.65)", fontSize: 18, transition: "all 0.22s ease" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.16)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
          >✕</button>
        </div>
      </div>

      {/* Image container */}
      <div onClick={e => e.stopPropagation()}
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 44) navigate(dx < 0 ? "right" : "left");
          touchStartX.current = null;
        }}
        style={{ position: "relative", width: "min(94vw, 1040px)", borderRadius: 22, overflow: "hidden", transform: overlayVisible ? "scale(1) translateY(0)" : "scale(0.86) translateY(36px)", opacity: overlayVisible ? 1 : 0, transition: "all 0.52s cubic-bezier(0.23,1,0.32,1) 0.05s", boxShadow: `0 0 0 1px ${session.color}44, 0 50px 120px rgba(0,0,0,0.85)`, userSelect: "none" }}>
        <div style={{ position: "relative", width: "100%", paddingBottom: "60%", background: "#050c18", overflow: "hidden" }}>
          <img key={displayIndex} src={images[displayIndex]} alt={`${session.title} — photo ${displayIndex + 1}`} draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...getImageStyle() }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 35%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${session.color}, ${session.accent}, ${session.color}, transparent)` }} />
          {images.length > 1 && (<>
            <GalleryNavArrow dir="left" color={session.color} accent={session.accent} onClick={() => navigate("left")} />
            <GalleryNavArrow dir="right" color={session.color} accent={session.accent} onClick={() => navigate("right")} />
          </>)}
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div onClick={e => e.stopPropagation()} style={{ display: "flex", gap: 8, marginTop: 14, maxWidth: "min(94vw, 1040px)", overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none", opacity: overlayVisible ? 1 : 0, transition: "opacity 0.52s ease 0.16s" }}>
          {images.map((src, idx) => (
            <div key={idx} onClick={() => { if (!isAnimating && idx !== current) navigate(idx > current ? "right" : "left"); }}
              style={{ flexShrink: 0, width: 64, height: 44, borderRadius: 8, overflow: "hidden", cursor: "pointer", border: idx === current ? `2.5px solid ${session.accent}` : "2px solid rgba(255,255,255,0.1)", transform: idx === current ? "scale(1.1)" : "scale(1)", opacity: idx === current ? 1 : 0.45, transition: "all 0.28s cubic-bezier(0.34,1.56,0.64,1)" }}>
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
            </div>
          ))}
        </div>
      )}

      {/* Dot indicators */}
      {images.length > 1 && (
        <div onClick={e => e.stopPropagation()} style={{ display: "flex", gap: 7, marginTop: 12, opacity: overlayVisible ? 0.9 : 0, transition: "opacity 0.52s ease 0.2s" }}>
          {images.map((_, idx) => (
            <div key={idx} style={{ width: idx === current ? 22 : 7, height: 7, borderRadius: 4, background: idx === current ? session.accent : "rgba(255,255,255,0.2)", transition: "all 0.32s cubic-bezier(0.34,1.56,0.64,1)" }} />
          ))}
        </div>
      )}

      <div style={{ marginTop: 16, fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.18)", letterSpacing: "0.14em", textTransform: "uppercase", opacity: overlayVisible ? 1 : 0, transition: "opacity 0.5s ease 0.28s" }}>
        {images.length > 1 ? "← → keys · swipe · tap outside to close" : "tap outside to close"}
      </div>
    </div>
  );
}

// ── Poster Lightbox ────────────────────────────────────────
function PosterLightbox({ session, onClose }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setVis(true));
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  const close = () => { setVis(false); setTimeout(onClose, 320); };
  return (
    <div onClick={close} style={{ position: "fixed", inset: 0, zIndex: 9999, background: vis ? "rgba(3,8,18,0.96)" : "rgba(3,8,18,0)", backdropFilter: vis ? "blur(24px)" : "blur(0px)", transition: "all 0.32s ease", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div onClick={e => e.stopPropagation()} style={{ position: "relative", maxWidth: "min(86vw, 440px)", width: "100%", transform: vis ? "scale(1) translateY(0)" : "scale(0.88) translateY(28px)", opacity: vis ? 1 : 0, transition: "all 0.42s cubic-bezier(0.23,1,0.32,1) 0.05s" }}>
        <img src={session.poster} alt={session.title} style={{ width: "100%", height: "auto", borderRadius: 18, display: "block", boxShadow: `0 0 0 1px ${session.color}55, 0 40px 100px rgba(0,0,0,0.8), 0 0 60px ${session.color}22` }} />
        <button onClick={close} style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.72)", fontSize: 17 }}>✕</button>
        {/* Bottom label */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 18px 18px", background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)", borderRadius: "0 0 18px 18px", pointerEvents: "none" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: session.accent, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 3 }}>{session.time} · {session.type}</div>
          <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 22, color: "#fff", letterSpacing: "0.04em", lineHeight: 1.1 }}>{session.title}</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, fontFamily: "'DM Mono', monospace", marginTop: 3 }}>{session.subtitle}</div>
        </div>
      </div>
    </div>
  );
}

// ── Photo Strip ────────────────────────────────────────────
function PhotoStrip({ images, color, accent, onOpen }) {
  if (!images || images.length === 0) return null;
  const count = images.length;
  const preview = images.slice(0, Math.min(count, 3));
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
        <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${color}55, transparent)` }} />
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9.5, color: accent, letterSpacing: "0.16em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          {count} Photo{count !== 1 ? "s" : ""}
        </span>
        <div style={{ height: 1, flex: 1, background: `linear-gradient(270deg, ${color}55, transparent)` }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: count === 1 ? "1fr" : "1fr 1fr 1fr", gap: 4, borderRadius: 12, overflow: "hidden", border: `1px solid ${color}2a` }}>
        {preview.map((src, i) => {
          const isOverflow = i === 2 && count > 3;
          return (
            <div key={i} onClick={() => onOpen(i)} style={{ position: "relative", paddingBottom: count === 1 ? "46%" : "68%", overflow: "hidden", background: "#07111f", gridColumn: count === 1 ? "1 / -1" : undefined, cursor: "pointer" }}>
              <img src={src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              />
              {isOverflow && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(4,10,22,0.75)", backdropFilter: "blur(5px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
                  <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 26, color: "#fff", lineHeight: 1 }}>+{count - 2}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: "0.14em", textTransform: "uppercase" }}>more</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {count > 1 && (
        <button onClick={() => onOpen(0)} style={{ marginTop: 7, width: "100%", background: `linear-gradient(135deg, ${color}16, ${color}08)`, border: `1px solid ${color}3a`, borderRadius: 9, padding: "8px 0", color: accent, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "all 0.25s ease" }}
          onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${color}28, ${color}12)`; e.currentTarget.style.boxShadow = `0 0 18px ${color}2a`; }}
          onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${color}16, ${color}08)`; e.currentTarget.style.boxShadow = "none"; }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          View all {count} photos
        </button>
      )}
    </div>
  );
}

// ── Status Badge ───────────────────────────────────────────
function StatusBadge({ status, color, accent }) {
  if (status === "upcoming") return null;
  const cfg = status === "ongoing"
    ? { label: "LIVE NOW", bg: "#ff6b0020", border: "#ff6b00aa", dot: "#ff6b00", pulse: true }
    : { label: "COMPLETED", bg: color + "20", border: color + "88", dot: accent, pulse: false };
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 20, padding: "4px 12px", marginBottom: 10 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot, boxShadow: `0 0 8px ${cfg.dot}`, display: "block", flexShrink: 0, animation: cfg.pulse ? "livePulse 1.2s ease-in-out infinite" : "none" }} />
      <span style={{ color: cfg.dot, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>{cfg.label}</span>
    </div>
  );
}

// ── Speaker Chip ───────────────────────────────────────────
function SpeakerChip({ speaker, color, accent, isDone }) {
  const isHighlighted = speaker.role === "Moderator" || speaker.role === "Resource Person";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: isHighlighted ? `${color}18` : "rgba(255,255,255,0.04)", border: `1px solid ${isHighlighted ? color + "44" : "rgba(255,255,255,0.08)"}`, borderRadius: 8, padding: "4px 9px", opacity: isDone ? 0.55 : 1 }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, background: isDone ? "rgba(255,255,255,0.1)" : `radial-gradient(circle at 35% 35%, ${accent}, ${color})`, boxShadow: isDone ? "none" : `0 0 7px ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9.5, fontWeight: 900, color: "#fff", fontFamily: "'Bebas Neue', Impact, sans-serif" }}>
        {speaker.name.charAt(speaker.name.indexOf(" ") + 1)}
      </div>
      <div>
        <div style={{ color: isHighlighted && !isDone ? accent : "rgba(255,255,255,0.72)", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>{speaker.name}</div>
        <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 9, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>{speaker.role}</div>
      </div>
    </div>
  );
}

// ── Poster Panel ───────────────────────────────────────────
function PosterPanel({ session, isDone, isLive, onExpand }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onExpand}
      style={{
        position: "relative", borderRadius: 14, overflow: "hidden",
        cursor: "pointer", width: "100%", aspectRatio: "3/4",
        background: `linear-gradient(160deg, ${session.color}28, #060f1d)`,
        border: `1px solid ${isLive ? "#ff6b00bb" : hov ? session.color + "88" : session.color + "30"}`,
        boxShadow: hov
          ? `0 16px 48px ${session.color}40, 0 0 0 1px ${session.color}28`
          : `0 6px 24px ${session.color}18`,
        transition: "all 0.36s cubic-bezier(0.23,1,0.32,1)",
        filter: isDone ? "grayscale(0.35) brightness(0.82)" : "none",
      }}
    >
      <img
        src={session.poster}
        alt={`${session.title} poster`}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transform: hov ? "scale(1.05)" : "scale(1)", transition: "transform 0.48s cubic-bezier(0.23,1,0.32,1)" }}
      />
      {/* scrim */}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${session.color}70 0%, rgba(0,0,0,0.1) 55%, transparent 100%)`, opacity: hov ? 0.75 : 0.55, transition: "opacity 0.36s ease" }} />

      {/* Bottom label */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 11px 10px", transform: hov ? "translateY(0)" : "translateY(3px)", transition: "transform 0.32s ease" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8.5, color: session.accent, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 2, opacity: 0.9 }}>{session.time}</div>
        <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 13, letterSpacing: "0.03em", color: "#fff", lineHeight: 1.2, textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}>{session.title}</div>
      </div>

      {/* Expand icon */}
      <div style={{ position: "absolute", top: 8, right: 8, width: 30, height: 30, borderRadius: "50%", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", border: `1px solid ${session.color}55`, display: "flex", alignItems: "center", justifyContent: "center", opacity: hov ? 1 : 0, transform: hov ? "scale(1)" : "scale(0.65)", transition: "all 0.26s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={session.accent} strokeWidth="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
      </div>

      {/* Live ring */}
      {isLive && <div style={{ position: "absolute", inset: 0, borderRadius: 14, border: "1.5px solid #ff6b00bb", animation: "liveGlow 1.8s ease-in-out infinite", pointerEvents: "none" }} />}
    </div>
  );
}

// ── Session Card ───────────────────────────────────────────
function SessionCard({ session, index, onOpenGallery }) {
  const [ref, visible] = useInView(0.05);
  const [hovered, setHovered] = useState(false);
  const [posterOpen, setPosterOpen] = useState(false);
  const { status, images } = SESSION_STATUS[session.id] || { status: "upcoming", images: [] };
  const isDone = status === "done";
  const isLive = status === "ongoing";
  const typeCfg = TYPE_COLORS[session.type] || TYPE_COLORS["Panel Discussion"];

  return (
    <>
      {posterOpen && <PosterLightbox session={session} onClose={() => setPosterOpen(false)} />}

      <div
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          opacity: visible ? (isDone ? 0.72 : 1) : 0,
          transform: visible
            ? (hovered ? "translateY(-3px)" : "translateY(0)")
            : "translateY(34px)",
          transition: `opacity 0.58s ease ${index * 80}ms, transform 0.62s cubic-bezier(0.23,1,0.32,1) ${index * 80}ms`,
          filter: isDone ? "grayscale(0.18)" : "none",
          position: "relative", borderRadius: 20, overflow: "hidden",
          background: hovered
            ? "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025))"
            : "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
          border: `1px solid ${isLive ? "#ff6b00cc" : hovered ? session.color + "77" : "rgba(255,255,255,0.08)"}`,
          backdropFilter: "blur(20px)",
          boxShadow: isLive
            ? `0 0 24px #ff6b0030, 0 8px 28px rgba(0,0,0,0.28)`
            : hovered
            ? `0 24px 64px ${session.color}26`
            : "0 4px 22px rgba(0,0,0,0.25)",
        }}
      >
        {/* Top accent bar — full width always */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: isDone ? `linear-gradient(90deg, ${session.color}40, ${session.accent}40, transparent)` : `linear-gradient(90deg, ${session.color}, ${session.accent}, transparent)`, opacity: hovered ? 1 : 0.65, transition: "opacity 0.3s ease", zIndex: 2 }} />

        {/* Live ring */}
        {isLive && <div style={{ position: "absolute", inset: 0, borderRadius: 20, border: "1px solid #ff6b0055", animation: "liveGlow 1.8s ease-in-out infinite", pointerEvents: "none", zIndex: 1 }} />}

        {/* ── Two-column layout: poster + info ── */}
        <div style={{ display: "flex", flexDirection: "row", minHeight: 260 }}>

          {/* Poster column */}
          <div style={{ width: 148, flexShrink: 0, padding: "16px 0 16px 15px" }} className="session-poster-col">
            <PosterPanel
              session={session}
              isDone={isDone}
              isLive={isLive}
              onExpand={() => setPosterOpen(true)}
            />
          </div>

          {/* Info column */}
          <div style={{ flex: 1, padding: "18px 18px 18px 16px", display: "flex", flexDirection: "column", minWidth: 0, gap: 0 }}>
            <StatusBadge status={status} color={session.color} accent={session.accent} />

            {/* Type badge + time */}
            <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 9 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: typeCfg.bg, border: `1px solid ${typeCfg.border}`, borderRadius: 12, padding: "3px 9px" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: typeCfg.text, display: "block" }} />
                <span style={{ color: typeCfg.text, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>{session.type}</span>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 9, padding: "3px 9px" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={isDone ? "rgba(255,255,255,0.3)" : session.color} strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span style={{ color: isDone ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.82)", fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>{session.time}</span>
              </div>
            </div>

            {/* Title */}
            <h3 style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "clamp(17px, 3.2vw, 24px)", letterSpacing: "0.04em", margin: "0 0 2px", lineHeight: 1.1, color: isDone ? "rgba(255,255,255,0.42)" : "#fff", textShadow: hovered && !isDone ? `0 0 22px ${session.color}50` : "none", transition: "text-shadow 0.3s ease" }}>{session.title}</h3>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "'DM Mono', monospace", margin: "0 0 10px", letterSpacing: "0.03em" }}>{session.subtitle}</p>

            {/* Venue */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: `${session.color}14`, border: `1px solid ${session.color}2a`, borderRadius: 8, padding: "4px 10px", marginBottom: 11, alignSelf: "flex-start" }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={isDone ? "rgba(255,255,255,0.25)" : session.accent} strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span style={{ color: isDone ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.72)", fontSize: 10.5, fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>{session.venue}</span>
              <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 10, fontFamily: "'DM Mono', monospace" }}>· {session.floor}</span>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: `linear-gradient(90deg, ${session.color}30, transparent)`, marginBottom: 10 }} />

            {/* Speakers */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, flex: 1 }}>
              {session.speakers.map((sp, i) => (
                <SpeakerChip key={i} speaker={sp} color={session.color} accent={session.accent} isDone={isDone} />
              ))}
            </div>

            {/* Photos */}
            {images.length > 0 && (
              <PhotoStrip
                images={images}
                color={session.color}
                accent={session.accent}
                onOpen={(idx) => onOpenGallery(session, images, idx)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Time slot header ───────────────────────────────────────
function TimeHint({ time, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ height: 1, width: 18, background: `linear-gradient(90deg, transparent, ${color}66)` }} />
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }} />
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color, letterSpacing: "0.2em", textTransform: "uppercase" }}>{time}</span>
      </div>
      <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${color}44, transparent)` }} />
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────
export default function SessionList() {
  const [mounted, setMounted] = useState(false);
  const [gallery, setGallery] = useState(null);
  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);
  const openGallery = useCallback((session, images, startIndex = 0) => setGallery({ session, images, startIndex }), []);
  const closeGallery = useCallback(() => setGallery(null), []);
  const timeSlots = [...new Set(sessions.map(s => s.time))];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&display=swap');
        @keyframes pulse-glow { 0%,100%{opacity:0.28;transform:scale(1);}50%{opacity:0.62;transform:scale(1.07);} }
        @keyframes livePulse  { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.35;transform:scale(1.6);} }
        @keyframes liveGlow   { 0%,100%{box-shadow:0 0 0 0 #ff6b0030;}50%{box-shadow:0 0 0 6px #ff6b0010;} }
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{display:none;}
        .session-poster-col { display: block; }
        @media (max-width: 360px) { .session-poster-col { display: none; } }
        @media (max-width: 460px) { .session-poster-col { width: 110px !important; padding: 12px 0 12px 12px !important; } }
      `}</style>

      {gallery && (
        <GalleryOverlay
          session={gallery.session}
          images={gallery.images}
          startIndex={gallery.startIndex}
          onClose={closeGallery}
        />
      )}

      <section style={{ position: "relative", padding: "80px 16px 100px", overflow: "hidden", background: "radial-gradient(ellipse at 70% 20%, #0d2a4a 0%, #081525 40%, #050e1a 100%)" }}>
        {/* Orbs */}
        {[{top:"6%",right:"2%",w:360,c:"#f39c12",d:"4.5s",dl:"0.3s"},{top:"44%",left:"1%",w:300,c:"#9b59b6",d:"5.5s",dl:"1s"},{bottom:"10%",right:"5%",w:250,c:"#1abc9c",d:"6s",dl:"2s"}].map((b,i)=>(
          <div key={i} style={{position:"absolute",top:b.top,left:b.left,right:b.right,bottom:b.bottom,width:b.w,height:b.w,borderRadius:"50%",background:`radial-gradient(circle,${b.c}12,transparent 70%)`,animation:`pulse-glow ${b.d} ease-in-out infinite ${b.dl}`,pointerEvents:"none"}}/>
        ))}
        <div style={{position:"absolute",top:0,right:0,width:72,height:72,borderTop:"2px solid #f5c84260",borderRight:"2px solid #f5c84260"}}/>
        <div style={{position:"absolute",bottom:0,left:0,width:72,height:72,borderBottom:"2px solid #f5c84260",borderLeft:"2px solid #f5c84260"}}/>

        {/* Header */}
        <div style={{textAlign:"center",marginBottom:60,opacity:mounted?1:0,transform:mounted?"translateY(0)":"translateY(-26px)",transition:"all 0.9s cubic-bezier(0.23,1,0.32,1)"}}>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:"0.24em",color:"#f5c842",textTransform:"uppercase",margin:"0 0 10px"}}>— Academic Conversations —</p>
          <h2 style={{fontFamily:"'Bebas Neue',Impact,sans-serif",fontSize:"clamp(42px,8.5vw,88px)",margin:0,letterSpacing:"0.06em",lineHeight:1,background:"linear-gradient(135deg,#fff 30%,#f5c842 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Speaker Sessions</h2>
          <div style={{display:"flex",alignItems:"center",gap:10,marginTop:12,justifyContent:"center",flexWrap:"wrap"}}>
            <div style={{height:1,width:28,background:"linear-gradient(90deg,transparent,#f5c842)"}}/>
            <p style={{color:"rgba(255,255,255,0.32)",fontSize:11,margin:0,fontFamily:"'DM Mono',monospace",letterSpacing:"0.06em",textAlign:"center",padding:"0 8px"}}>Creator Talks · Panel Discussions · TED Talk · Expert Insights</p>
            <div style={{height:1,width:28,background:"linear-gradient(90deg,#f5c842,transparent)"}}/>
          </div>
        </div>

        {/* Cards */}
        <div style={{maxWidth:820,margin:"0 auto",display:"flex",flexDirection:"column",gap:0}}>
          {timeSlots.map((time) => {
            const slot = sessions.filter(s => s.time === time);
            return (
              <div key={time} style={{marginBottom:38}}>
                <TimeHint time={time} color={slot.length > 1 ? "#f5c842" : slot[0].accent} />
                <div style={{display:"grid",gridTemplateColumns:slot.length===1?"1fr":"repeat(auto-fit,minmax(320px,1fr))",gap:14}}>
                  {slot.map((session, i) => (
                    <SessionCard key={session.id} session={session} index={i} onOpenGallery={openGallery} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}