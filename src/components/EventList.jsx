import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";

// ============================================================
// 🎯 EVENT DAY CONTROLS — EDIT THIS SECTION ON EVENT DAY
// ============================================================
// STATUS options: "upcoming" | "ongoing" | "done"
// To add images after event ends, add paths to `images` array
// Example:
//   3: { status: "done", images: ["/photos/buzzbuilders-1.jpg", "/photos/buzzbuilders-2.jpg"] },
// ============================================================
const EVENT_STATUS = {
  1: {  status: "done", images: ["/images/IMG_20240516_222754_288.jpg","/images/IMG_20241105_102653.jpg"] },
  2: { status: "ongoing", images: ["/images/IMG_20240516_222754_288.jpg","/images/IMG_20241105_102653.jpg"] },
  3: { status: "upcoming", images: [] },
  4: { status: "upcoming", images: [] },
  5: { status: "upcoming", images: [] },
  6: { status: "upcoming", images: [] },
  7: { status: "upcoming", images: [] },
  8: { status: "upcoming", images: [] },
};
// ============================================================
// END EVENT DAY CONTROLS
// ============================================================

const events = [
  { number: 1, codename: "THINKFEED", title: "Paper Presentation", venue: "Conference Hall", time: "11.30 AM – 1.30 PM", floor: "Ground Floor", color: "#1abc9c", accent: "#0ef5c8", icon: "/icons/thinkfeed.png", illustration: "/icons/paperpresentation.png", coordinator: { name: "Mr. Yaseen Manna", phone: "7349684211" } },
  { number: 2, codename: "COMMENT WARS", title: "Debate", venue: "Main Hall", time: "10.30 AM – 12.00 PM", floor: "Third Floor", color: "#e74c3c", accent: "#ff7b6b", icon: "/icons/commentwar.png", illustration: "/icons/debate.png", coordinator: { name: "Ms. Kavyashree", phone: "9632561285" } },
  { number: 3, codename: "BUZZ BUILDERS", title: "Social Media Marketing Campaign", venue: "Room No. 1", time: "11.30 AM – 1.30 PM", floor: "Ground Floor", color: "#3498db", accent: "#72c6ff", icon: "/icons/buzzbuilders.png", illustration: "/icons/socialmediamarketing campaighn.png", coordinator: { name: "Mr. Sanath Kotian", phone: "8618051932" } },
  { number: 4, codename: "PIXEL IMPACT", title: "Digital Poster Design", venue: "Computer Lab 1", time: "10.30 AM – 11.30 AM", floor: "First Floor", color: "#e74c3c", accent: "#ff7b6b", icon: "/icons/pixelimpact.png", illustration: "/icons/digitalposterdesign.png", coordinator: { name: "Ms. Anvitha R.B.", phone: "7996806937" } },
  { number: 5, codename: "SAY IT SMART", title: "Caption Writing Contest", venue: "Room No. 2", time: "10.30 AM – 11.30 AM", floor: "Ground Floor", color: "#f39c12", accent: "#ffd166", icon: "/icons/sayitsmart.png", illustration: "/icons/captionwritingcontest.png", coordinator: { name: "Ms. Akshatha Nayak", phone: "9380703282" } },
  { number: 6, codename: "60 SECONDS FAME", title: "Reel Making", venue: "Computer Lab 2", time: "3.00 PM – 4.00 PM", floor: "Second Floor", color: "#e91e8c", accent: "#ff6ec7", icon: "/icons/fame.png", illustration: "/icons/reelmaking.png", coordinator: { name: "Ms. Nayana Naik", phone: "7338621700" } },
  { number: 7, codename: "DIGITAL ECHOES", title: "Short Film Making", venue: "Main Hall", time: "1.30 PM – 2.30 PM", floor: "Third Floor", color: "#2ecc71", accent: "#7fffb2", icon: "/icons/digitalechoes.png", illustration: "/icons/shortfilm making.png", coordinator: { name: "Mr. Stalin D'Souza", phone: "9620835114" } },
  { number: 8, codename: "VIRAL TO REAL", title: "Cultural Showdown", venue: "Main Hall", time: "2.30 PM – 3.30 PM", floor: "Third Floor", color: "#e91e8c", accent: "#ff6ec7", icon: "/icons/viraltoreal.png", illustration: "/icons/culturalshowdown.png", coordinator: { name: "Ms. Varshini Kotian", phone: "8618783355" } },
];

// ── Hooks ──────────────────────────────────────────────────

function useInView(threshold = 0.08) {
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

function useRipple(color) {
  const [ripples, setRipples] = useState([]);
  const add = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples(r => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples(r => r.filter(rr => rr.id !== id)), 700);
  }, []);
  const rippleEls = ripples.map(r => (
    <span key={r.id} style={{
      position: "absolute", left: r.x, top: r.y, width: 10, height: 10,
      borderRadius: "50%", background: color + "50",
      transform: "translate(-50%,-50%) scale(0)",
      animation: "ripple 0.7s ease-out forwards", pointerEvents: "none",
    }} />
  ));
  return { onMouseDown: add, rippleEls };
}

// ── Cinematic Gallery Overlay ──────────────────────────────

function GalleryOverlay({ event, images, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex || 0);
  const [slideState, setSlideState] = useState("idle");
  const [displayIndex, setDisplayIndex] = useState(startIndex || 0);
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
    if (!overlayVisible) return;
    if (scrollerRef.current) scrollerRef.current.scrollTop = 0;
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
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSlideState("idle");
          setCurrent(nextIdx);
          setTimeout(() => setIsAnimating(false), 360);
        });
      });
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
  }, [handleClose, navigate]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(dx) > dy && Math.abs(dx) > 44) navigate(dx < 0 ? "right" : "left");
    touchStartX.current = null;
  };

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

  const overlay = (
    <div ref={scrollerRef} onClick={handleClose} style={{ position: "fixed", inset: 0, zIndex: 9999, background: overlayVisible ? "rgba(3,8,18,0.97)" : "rgba(3,8,18,0)", backdropFilter: overlayVisible ? "blur(28px)" : "blur(0px)", transition: "background 0.38s ease, backdrop-filter 0.38s ease", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "86px 16px 32px", overflowY: "auto" }}>
      <div onClick={e => e.stopPropagation()} style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, transparent 100%)", transform: overlayVisible ? "translateY(0)" : "translateY(-24px)", opacity: overlayVisible ? 1 : 0, transition: "all 0.48s cubic-bezier(0.23,1,0.32,1) 0.08s", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, ${event.accent}, ${event.color})`, boxShadow: `0 0 20px ${event.color}99`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 20, color: "#fff", fontWeight: 900, flexShrink: 0 }}>{event.number}</div>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: event.accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 2 }}>{event.codename}</div>
            <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 22, letterSpacing: "0.05em", color: "#fff", lineHeight: 1 }}>{event.title}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>
            <span style={{ color: event.accent, fontWeight: 700 }}>{current + 1}</span>{" / "}{images.length}
          </div>
          <button onClick={handleClose} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.65)", fontSize: 18, transition: "all 0.22s ease" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.16)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
          >✕</button>
        </div>
      </div>

      <div onClick={e => e.stopPropagation()} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
        style={{ position: "relative", width: "min(94vw, 1040px)", borderRadius: 22, overflow: "hidden", transform: overlayVisible ? "scale(1) translateY(0)" : "scale(0.86) translateY(36px)", opacity: overlayVisible ? 1 : 0, transition: "all 0.52s cubic-bezier(0.23,1,0.32,1) 0.05s", boxShadow: `0 0 0 1px ${event.color}44, 0 50px 120px rgba(0,0,0,0.85), 0 0 80px ${event.color}1a`, userSelect: "none" }}>
        <div style={{ position: "relative", width: "100%", height: "min(72vh, 700px)", background: "#050c18", overflow: "hidden" }}>
          <img key={displayIndex} src={images[displayIndex]} alt={`${event.title} — photo ${displayIndex + 1}`} draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", ...getImageStyle() }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 35%, transparent 75%, rgba(0,0,0,0.25) 100%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "22%", background: "linear-gradient(90deg, rgba(0,0,0,0.28), transparent)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "22%", background: "linear-gradient(270deg, rgba(0,0,0,0.28), transparent)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent 0%, ${event.color} 30%, ${event.accent} 50%, ${event.color} 70%, transparent 100%)`, opacity: 0.9 }} />
          <div style={{ position: "absolute", bottom: 14, left: 20, right: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}>{event.title.toUpperCase()}</div>
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <div onClick={e => e.stopPropagation()} style={{ display: "flex", gap: 8, marginTop: 16, maxWidth: "min(94vw, 1040px)", overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none", transform: overlayVisible ? "translateY(0)" : "translateY(18px)", opacity: overlayVisible ? 1 : 0, transition: "all 0.52s cubic-bezier(0.23,1,0.32,1) 0.16s" }}>
          {images.map((src, idx) => (
            <div key={idx} onClick={() => { if (isAnimating || idx === current) return; navigate(idx > current ? "right" : "left"); }}
              style={{ flexShrink: 0, width: 68, height: 46, borderRadius: 8, overflow: "hidden", cursor: "pointer", border: idx === current ? `2.5px solid ${event.accent}` : "2px solid rgba(255,255,255,0.1)", boxShadow: idx === current ? `0 0 16px ${event.color}99` : "none", transform: idx === current ? "scale(1.1)" : "scale(1)", transition: "all 0.28s cubic-bezier(0.34,1.56,0.64,1)", opacity: idx === current ? 1 : 0.48 }}
              onMouseEnter={e => { if (idx !== current) { e.currentTarget.style.opacity = "0.8"; e.currentTarget.style.transform = "scale(1.05)"; } }}
              onMouseLeave={e => { if (idx !== current) { e.currentTarget.style.opacity = "0.48"; e.currentTarget.style.transform = "scale(1)"; } }}
            >
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none", display: "block" }} />
            </div>
          ))}
        </div>
      )}

      {images.length > 1 && (
        <div onClick={e => e.stopPropagation()} style={{ display: "flex", gap: 7, marginTop: 14, opacity: overlayVisible ? 0.9 : 0, transition: "opacity 0.52s ease 0.2s" }}>
          {images.map((_, idx) => (
            <div key={idx} onClick={() => { if (!isAnimating && idx !== current) navigate(idx > current ? "right" : "left"); }}
              style={{ width: idx === current ? 24 : 7, height: 7, borderRadius: 4, background: idx === current ? event.accent : "rgba(255,255,255,0.2)", boxShadow: idx === current ? `0 0 12px ${event.accent}aa` : "none", cursor: "pointer", transition: "all 0.32s cubic-bezier(0.34,1.56,0.64,1)" }}
            />
          ))}
        </div>
      )}

      <div style={{ marginTop: 20, fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: "0.16em", textTransform: "uppercase", opacity: overlayVisible ? 1 : 0, transition: "opacity 0.5s ease 0.28s" }}>
        {images.length > 1 ? "← → swipe · tap outside to close" : "tap outside to close"}
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(overlay, document.body);
}

// ── Photo Preview Strip ────────────────────────────────────

function PhotoStrip({ images, color, accent, onOpen }) {
  if (!images || images.length === 0) return null;
  const count = images.length;
  const preview = images.slice(0, Math.min(count, 3));
  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${color}66, transparent)` }} />
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: accent, letterSpacing: "0.18em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          {count} Photo{count !== 1 ? "s" : ""}
        </span>
        <div style={{ height: 1, flex: 1, background: `linear-gradient(270deg, ${color}66, transparent)` }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: count === 1 ? "1fr" : "1fr 1fr 1fr", gap: 5, borderRadius: 14, overflow: "hidden", border: `1px solid ${color}33`, cursor: "pointer" }}>
        {preview.map((src, i) => {
          const isOverflowSlot = i === 2 && count > 3;
          return (
            <div key={i} onClick={() => onOpen(i)} style={{ position: "relative", paddingBottom: count === 1 ? "48%" : "70%", overflow: "hidden", background: "#07111f", gridColumn: count === 1 ? "1 / -1" : undefined }}>
              <img src={src} alt={`photo ${i + 1}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.42s cubic-bezier(0.23,1,0.32,1)" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              />
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${color}1a, transparent)`, opacity: 0, transition: "opacity 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "1"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "0"; }}
              />
              {isOverflowSlot && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(4,10,22,0.78)", backdropFilter: "blur(5px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}>
                  <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 30, color: "#fff", lineHeight: 1 }}>+{count - 2}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.45)", letterSpacing: "0.14em", textTransform: "uppercase" }}>more</span>
                </div>
              )}
              {count === 1 && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(0,0,0,0.52)", backdropFilter: "blur(8px)", border: `1.5px solid ${color}77`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 22px ${color}66` }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill={accent}><path d="M5 3l14 9-14 9V3z"/></svg>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {count > 1 && (
        <button onClick={() => onOpen(0)} style={{ marginTop: 8, width: "100%", background: `linear-gradient(135deg, ${color}18, ${color}09)`, border: `1px solid ${color}44`, borderRadius: 10, padding: "9px 0", color: accent, fontFamily: "'DM Mono', monospace", fontSize: 10.5, letterSpacing: "0.16em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.25s ease" }}
          onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${color}2e, ${color}14)`; e.currentTarget.style.boxShadow = `0 0 20px ${color}33`; }}
          onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(135deg, ${color}18, ${color}09)`; e.currentTarget.style.boxShadow = "none"; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
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
    ? { label: "LIVE NOW", bg: "#ff6b0022", border: "#ff6b00aa", dot: "#ff6b00", pulse: true }
    : { label: "COMPLETED", bg: color + "22", border: color + "88", dot: accent, pulse: false };
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 20, padding: "5px 14px", marginBottom: 10 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.dot, boxShadow: `0 0 8px ${cfg.dot}`, display: "block", flexShrink: 0, animation: cfg.pulse ? "livePulse 1.2s ease-in-out infinite" : "none" }} />
      <span style={{ color: cfg.dot, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>{cfg.label}</span>
    </div>
  );
}

// ── Number Bubble ──────────────────────────────────────────

function NumberBubble({ number, color, accent, visible, status }) {
  const [hovered, setHovered] = useState(false);
  const isDone = status === "done";
  const isLive = status === "ongoing";
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: 64, height: 64, borderRadius: "50%", background: isDone ? `radial-gradient(circle at 35% 35%, ${accent}88, ${color}66)` : `radial-gradient(circle at 35% 35%, ${accent}, ${color})`, boxShadow: isLive ? `0 0 0 4px #ff6b0044, 0 0 28px #ff6b0099` : hovered ? `0 0 0 10px ${color}25, 0 0 44px ${color}90` : `0 0 0 4px ${color}38, 0 0 28px ${color}60`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue', Impact, sans-serif", fontWeight: 900, fontSize: 28, color: isDone ? "rgba(255,255,255,0.45)" : "#fff", cursor: "default", zIndex: 10, position: "relative", transform: hovered ? "scale(1.18) rotate(-6deg)" : visible ? "scale(1)" : "scale(0.4)", transition: "all 0.45s cubic-bezier(0.34,1.56,0.64,1)", flexShrink: 0 }}>
      {isDone ? "✓" : number}
      <span style={{ position: "absolute", inset: -7, borderRadius: "50%", border: `1.5px dashed ${isLive ? "#ff6b00" : color}55`, animation: (hovered || isLive) ? "spin 2.5s linear infinite" : "none" }} />
    </div>
  );
}

// ── Coordinator Info ───────────────────────────────────────

function CoordinatorInfo({ coordinator, color, accent, isDone }) {
  if (!coordinator) return null;
  return (
    <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, background: `linear-gradient(135deg, ${color}14, ${color}07)`, border: `1px solid ${color}33`, borderRadius: 10, padding: "8px 14px" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isDone ? "rgba(255,255,255,0.3)" : accent} strokeWidth="2.2" style={{ flexShrink: 0 }}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: isDone ? "rgba(255,255,255,0.25)" : accent, letterSpacing: "0.14em", textTransform: "uppercase" }}>Faculty Coordinator</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12.5, fontWeight: 500, color: isDone ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.88)", whiteSpace: "nowrap" }}>{coordinator.name}</span>
          <a href={`tel:${coordinator.phone}`} onClick={e => e.stopPropagation()}
            style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "'DM Mono', monospace", fontSize: 11.5, color: isDone ? "rgba(255,255,255,0.3)" : color, textDecoration: "none", background: `${color}20`, border: `1px solid ${color}44`, borderRadius: 6, padding: "2px 8px", transition: "all 0.22s ease", pointerEvents: "auto", cursor: "pointer", whiteSpace: "nowrap" }}
            onMouseEnter={e => { if (!isDone) { e.currentTarget.style.background = `${color}38`; e.currentTarget.style.boxShadow = `0 0 12px ${color}44`; } }}
            onMouseLeave={e => { e.currentTarget.style.background = `${color}20`; e.currentTarget.style.boxShadow = "none"; }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
            </svg>
            {coordinator.phone}
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Shared Card Body ───────────────────────────────────────

function CardBody({ event, isLeft, isMobile, onOpenGallery }) {
  const [hovered, setHovered] = useState(false);
  const { onMouseDown, rippleEls } = useRipple(event.color);
  const { status, images } = EVENT_STATUS[event.number] || { status: "upcoming", images: [] };
  const isDone = status === "done";
  const isLive = status === "ongoing";

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onMouseDown={onMouseDown}
      style={{ position: "relative", overflow: "hidden", width: "100%", background: hovered ? "linear-gradient(135deg, rgba(255,255,255,0.11), rgba(255,255,255,0.04))" : "linear-gradient(135deg, rgba(255,255,255,0.065), rgba(255,255,255,0.018))", border: `1px solid ${isLive ? "#ff6b00cc" : hovered ? event.color + "95" : "rgba(255,255,255,0.09)"}`, borderRadius: isMobile ? 16 : 18, padding: isMobile ? "18px 18px" : "22px 24px", cursor: "default", transform: hovered && !isMobile ? "translateY(-4px)" : "translateY(0)", boxShadow: isLive ? `0 0 28px #ff6b0044, 0 4px 24px rgba(0,0,0,0.28)` : hovered ? `0 20px 60px ${event.color}38` : "0 4px 24px rgba(0,0,0,0.28)", transition: "all 0.38s cubic-bezier(0.23,1,0.32,1)", backdropFilter: "blur(18px)", textAlign: isMobile ? "left" : isLeft ? "left" : "right" }}>
      {rippleEls}
      <div style={{ position: "absolute", top: 0, left: (isMobile || isLeft) ? 0 : "auto", right: (isMobile || isLeft) ? "auto" : 0, width: hovered ? "100%" : "42%", height: 3, background: isDone ? `linear-gradient(90deg, ${event.color}55, ${event.accent}55)` : `linear-gradient(90deg, ${event.color}, ${event.accent})`, borderRadius: 2, transition: "width 0.48s cubic-bezier(0.23,1,0.32,1)" }} />
      {isLive && <div style={{ position: "absolute", inset: 0, borderRadius: isMobile ? 16 : 18, border: "1px solid #ff6b0055", animation: "liveGlow 1.8s ease-in-out infinite", pointerEvents: "none" }} />}

      <StatusBadge status={status} color={event.color} accent={event.accent} />

      <div style={{ marginBottom: 12 }}>
        <img src={event.icon} alt={event.codename} style={{ height: isMobile ? 40 : 48, width: "auto", marginLeft: (isMobile || isLeft) ? 0 : "auto", marginRight: (isMobile || isLeft) ? "auto" : 0, display: "block", filter: isDone ? `grayscale(0.4)` : `drop-shadow(0 0 12px ${event.color}75)`, opacity: isDone ? 0.55 : 1, transform: hovered ? "scale(1.06)" : "scale(1)", transition: "transform 0.35s ease" }} />
      </div>

      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: event.color + "22", border: `1px solid ${event.color}55`, borderRadius: 20, padding: "4px 12px", marginBottom: 10 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: event.accent, boxShadow: `0 0 8px ${event.accent}`, display: "block" }} />
        <span style={{ color: event.accent, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>{event.floor}</span>
      </div>

      <h3 style={{ color: isDone ? "rgba(255,255,255,0.45)" : "#fff", fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: isMobile ? "clamp(20px, 5.5vw, 26px)" : "clamp(22px, 3.5vw, 30px)", letterSpacing: "0.05em", margin: "0 0 6px", lineHeight: 1.15, textShadow: hovered && !isDone ? `0 0 24px ${event.color}65` : "none", transition: "text-shadow 0.3s ease" }}>{event.title}</h3>

      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12.5, margin: "0 0 12px", fontFamily: "'DM Mono', monospace" }}>{event.venue}</p>

      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.11)", borderRadius: 10, padding: "6px 14px" }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={isDone ? "rgba(255,255,255,0.3)" : event.color} strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span style={{ color: isDone ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.88)", fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono', monospace", letterSpacing: "0.04em" }}>{event.time}</span>
      </div>

      <CoordinatorInfo coordinator={event.coordinator} color={event.color} accent={event.accent} isDone={isDone} />

      {images.length > 0 && (
        <PhotoStrip images={images} color={event.color} accent={event.accent} onOpen={(idx) => onOpenGallery(event, images, idx)} />
      )}
    </div>
  );
}

// ── Desktop Event Card ─────────────────────────────────────

function EventCard({ event, index, onOpenGallery, bubbleRef }) {
  const [ref, visible] = useInView(0.08);
  const [hovered, setHovered] = useState(false);
  const isLeft = index % 2 === 0;
  const { status } = EVENT_STATUS[event.number] || { status: "upcoming" };
  const isDone = status === "done";

  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center", flexDirection: isLeft ? "row" : "row-reverse", opacity: visible ? (isDone ? 0.65 : 1) : 0, transform: visible ? "translateX(0)" : isLeft ? "translateX(-60px)" : "translateX(60px)", transition: `opacity 0.65s ease ${index * 60}ms, transform 0.72s cubic-bezier(0.23,1,0.32,1) ${index * 60}ms`, filter: isDone ? "grayscale(0.22)" : "none", gap: 0, minHeight: 160 }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: isLeft ? "flex-end" : "flex-start", paddingRight: isLeft ? 36 : 0, paddingLeft: isLeft ? 0 : 36 }}>
        <div style={{ position: "relative", transform: hovered ? "scale(1.14) rotate(5deg)" : "scale(1)", transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)", filter: hovered ? `drop-shadow(0 14px 36px ${event.color}95)` : `drop-shadow(0 4px 14px ${event.color}35)` }}>
          <img src={event.illustration} alt={event.title} style={{ width: 380, height: 380, objectFit: "contain", display: "block", opacity: isDone ? 0.5 : 1 }} />
        </div>
      </div>

      {/* Bubble — bubbleRef attached here for dot measurement */}
      <div ref={bubbleRef} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <NumberBubble number={event.number} color={event.color} accent={event.accent} visible={visible} status={status} />
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", paddingLeft: isLeft ? 36 : 0, paddingRight: isLeft ? 0 : 36, justifyContent: isLeft ? "flex-start" : "flex-end" }}>
        <CardBody event={event} isLeft={isLeft} isMobile={false} onOpenGallery={onOpenGallery} />
      </div>
    </div>
  );
}

// ── Mobile Event Card ──────────────────────────────────────

function MobileEventCard({ event, index, onOpenGallery, bubbleRef }) {
  const [ref, visible] = useInView(0.06);
  const { status } = EVENT_STATUS[event.number] || { status: "upcoming" };
  const isDone = status === "done";

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 14, opacity: visible ? (isDone ? 0.65 : 1) : 0, transform: visible ? "translateX(0)" : "translateX(-40px)", transition: `opacity 0.6s ease ${index * 55}ms, transform 0.65s cubic-bezier(0.23,1,0.32,1) ${index * 55}ms`, filter: isDone ? "grayscale(0.22)" : "none", paddingLeft: 4 }}>
      {/* Bubble — bubbleRef attached here for dot measurement */}
      <div ref={bubbleRef} style={{ flexShrink: 0, paddingTop: 4 }}>
        <NumberBubble number={event.number} color={event.color} accent={event.accent} visible={visible} status={status} />
      </div>
      <CardBody event={event} isLeft={true} isMobile={true} onOpenGallery={onOpenGallery} />
    </div>
  );
}

// ── Responsive wrapper ─────────────────────────────────────

function ResponsiveCard({ event, index, onOpenGallery, bubbleRef }) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth <= 640);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  if (isMobile) return <MobileEventCard event={event} index={index} onOpenGallery={onOpenGallery} bubbleRef={bubbleRef} />;
  return <EventCard event={event} index={index} onOpenGallery={onOpenGallery} bubbleRef={bubbleRef} />;
}

// ── Timeline Line with event-aligned dots ─────────────────

function TimelineLine({ containerRef, bubbleRefs, isMobile }) {
  const [dots, setDots] = useState([]);

  useEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const measured = bubbleRefs
        .map(ref => {
          if (!ref.current) return null;
          const rect = ref.current.getBoundingClientRect();
          // vertical midpoint of the bubble, relative to timeline container top
          return rect.top - containerRect.top + rect.height / 2;
        })
        .filter(v => v !== null);
      setDots(measured);
    }

    // First measure after layout settles
    const raf = requestAnimationFrame(() => setTimeout(measure, 150));

    // Re-measure on resize
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [containerRef, bubbleRefs, isMobile]);

  return (
    <div style={{
      position: "absolute",
      // Left edge: 10% on mobile (aligns with bubble column), 50% on desktop (center)
      left: isMobile ? "10%" : "50%",
      top: 0,
      bottom: 0,
      width: 2,
      transform: "translateX(-50%)",
      background: "linear-gradient(180deg, #f5c84222, #f5c84255 20%, #e91e8c55 80%, #e91e8c22)",
      borderRadius: 2,
      pointerEvents: "none",
    }}>
      {dots.map((top, i) => {
        const status = (EVENT_STATUS[events[i].number] || {}).status || "upcoming";
        const isDone = status === "done";
        return (
          <div key={i} style={{
            position: "absolute",
            top,
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isDone ? 5 : 7,
            height: isDone ? 5 : 7,
            borderRadius: "50%",
            background: isDone ? "rgba(245,200,66,0.18)" : "rgba(245,200,66,0.65)",
            boxShadow: isDone ? "none" : "0 0 10px rgba(245,200,66,0.7), 0 0 3px rgba(245,200,66,0.9)",
            transition: "top 0.4s ease",
            zIndex: 2,
          }} />
        );
      })}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────

export default function EventList() {
  const [mounted, setMounted] = useState(false);
  const [gallery, setGallery] = useState(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth <= 640);

  // One stable ref object per event, for bubble measurement
  // Store the array itself in state so it's never accessed during render via .current
  const [bubbleRefs] = useState(() => events.map(() => ({ current: null })));
  // Ref for the timeline container
  const timelineContainerRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const openGallery = useCallback((event, images, startIndex = 0) => {
    setGallery({ event, images, startIndex });
  }, []);

  const closeGallery = useCallback(() => setGallery(null), []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ripple { to { transform: translate(-50%,-50%) scale(22); opacity: 0; } }
        @keyframes float { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-14px) rotate(2deg); } }
        @keyframes pulse-glow { 0%,100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.08); } }
        @keyframes livePulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.6); } }
        @keyframes liveGlow { 0%,100% { box-shadow: 0 0 0 0 #ff6b0033; } 50% { box-shadow: 0 0 0 6px #ff6b0011; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {gallery && (
        <GalleryOverlay event={gallery.event} images={gallery.images} startIndex={gallery.startIndex} onClose={closeGallery} />
      )}

      <section style={{ position: "relative", padding: "90px 20px 110px", overflow: "hidden", background: "radial-gradient(ellipse at 30% 50%, #0d2a4a 0%, #081525 40%, #050e1a 100%)" }}>
        {[{ top: "8%", left: "2%", w: 440, c: "#1abc9c", d: "4s", delay: "0s" }, { top: "42%", right: "2%", w: 380, c: "#e91e8c", d: "5s", delay: "1.2s" }, { bottom: "10%", left: "6%", w: 300, c: "#3498db", d: "6s", delay: "2s" }, { top: "72%", right: "12%", w: 240, c: "#f39c12", d: "7s", delay: "0.5s" }].map((b, i) => (
          <div key={i} style={{ position: "absolute", top: b.top, left: b.left, right: b.right, bottom: b.bottom, width: b.w, height: b.w, borderRadius: "50%", background: `radial-gradient(circle, ${b.c}14, transparent 70%)`, animation: `pulse-glow ${b.d} ease-in-out infinite ${b.delay}`, pointerEvents: "none" }} />
        ))}

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 90, display: "flex", alignItems: "center", justifyContent: "center", gap: 48, flexWrap: "wrap", opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(-30px)", transition: "all 0.9s cubic-bezier(0.23,1,0.32,1)" }}>
          <div className="hidden md:block" style={{ animation: "float 4s ease-in-out infinite" }}>
            <img src="/icons/bulb.png" alt="Logo" style={{ width: 200, height: 200, objectFit: "contain", filter: "drop-shadow(0 0 32px #f5c84275)" }} />
          </div>
          <div>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.22em", color: "#f5c842", textTransform: "uppercase", margin: "0 0 10px" }}>— presents —</p>
            <h2 style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "clamp(52px, 10vw, 104px)", margin: 0, letterSpacing: "0.06em", lineHeight: 1, background: "linear-gradient(135deg, #fff 35%, #f5c842 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Event List</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <div style={{ height: 1, width: 36, background: "linear-gradient(90deg, transparent, #f5c842)" }} />
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: 0, fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", textAlign: "center", padding: "0 8px" }}>T. Mohandas Pai Platinum Jubilee Block · MGM College Campus, Udupi</p>
              <div style={{ height: 1, width: 36, background: "linear-gradient(90deg, #f5c842, transparent)" }} />
            </div>
          </div>
          <div className="hidden md:block" style={{ animation: "float 4s ease-in-out infinite 1.2s" }}>
            <img src="/icons/title.png" alt="Beyond The Scroll" style={{ width: 180, height: "auto", filter: "drop-shadow(0 0 16px rgba(255,255,255,0.22))" }} />
          </div>
        </div>

        {/* Timeline */}
        <div ref={timelineContainerRef} style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <TimelineLine
            containerRef={timelineContainerRef}
            bubbleRefs={bubbleRefs}
            isMobile={isMobile}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
            {events.map((event, i) => (
              <ResponsiveCard
                key={event.number}
                event={event}
                index={i}
                onOpenGallery={openGallery}
                bubbleRef={bubbleRefs[i]}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}