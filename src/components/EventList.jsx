import { useEffect, useRef, useState, useCallback } from "react";

const events = [
  {
    number: 1,
    codename: "THINKFEED",
    title: "Paper Presentation",
    venue: "Conference Hall",
    time: "11.30 AM – 1.30 PM",
    floor: "Ground Floor",
    color: "#1abc9c",
    accent: "#0ef5c8",
    icon: "/icons/thinkfeed.png",
    illustration: "/icons/paperpresentation.png",
  },
  {
    number: 2,
    codename: "COMMENT WARS",
    title: "Debate",
    venue: "Main Hall",
    time: "10.30 AM – 12.00 PM",
    floor: "Third Floor",
    color: "#e74c3c",
    accent: "#ff7b6b",
    icon: "/icons/commentwar.png",
    illustration: "/icons/debate.png",
  },
  {
    number: 3,
    codename: "BUZZ BUILDERS",
    title: "Social Media Marketing Campaign",
    venue: "Room No. 1",
    time: "11.30 AM – 1.30 PM",
    floor: "Ground Floor",
    color: "#3498db",
    accent: "#72c6ff",
    icon: "/icons/buzzbuilders.png",
    illustration: "/icons/socialmediamarketing campaighn.png",
  },
  {
    number: 4,
    codename: "PIXEL IMPACT",
    title: "Digital Poster Design",
    venue: "Computer Lab 2",
    time: "10.30 AM – 11.30 AM",
    floor: "Second Floor",
    color: "#e74c3c",
    accent: "#ff7b6b",
    icon: "/icons/pixelimpact.png",
    illustration: "/icons/digitalposterdesign.png",
  },
  {
    number: 5,
    codename: "SAY IT SMART",
    title: "Caption Writing Contest",
    venue: "Computer Lab 3",
    time: "10.30 AM – 11.30 AM",
    floor: "Second Floor",
    color: "#f39c12",
    accent: "#ffd166",
    icon: "/icons/sayitsmart.png",
    illustration: "/icons/captionwritingcontest.png",
  },
  {
    number: 6,
    codename: "60 SECONDS FAME",
    title: "Reel Making",
    venue: "Computer Lab 2",
    time: "3.00 PM – 4.00 PM",
    floor: "Second Floor",
    color: "#e91e8c",
    accent: "#ff6ec7",
    icon: "/icons/fame.png",
    illustration: "/icons/reelmaking.png",
  },
  {
    number: 7,
    codename: "DIGITAL ECHOES",
    title: "Short Film Making",
    venue: "Main Hall",
    time: "1.30 PM – 2.30 PM",
    floor: "Third Floor",
    color: "#2ecc71",
    accent: "#7fffb2",
    icon: "/icons/digitalechoes.png",
    illustration: "/icons/shortfilm making.png",
  },
  {
    number: 8,
    codename: "VIRAL TO REAL",
    title: "Cultural Showdown",
    venue: "Main Hall",
    time: "2.30 PM – 3.30 PM",
    floor: "Third Floor",
    color: "#e91e8c",
    accent: "#ff6ec7",
    icon: "/icons/viraltoreal.png",
    illustration: "/icons/culturalshowdown.png",
  },
];

function useInView(threshold = 0.1) {
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
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(r => [...r, { id, x, y }]);
    setTimeout(() => setRipples(r => r.filter(rr => rr.id !== id)), 700);
  }, []);
  const rippleEls = ripples.map(r => (
    <span key={r.id} style={{
      position: "absolute", left: r.x, top: r.y,
      width: 10, height: 10, borderRadius: "50%",
      background: color + "50",
      transform: "translate(-50%,-50%) scale(0)",
      animation: "ripple 0.7s ease-out forwards",
      pointerEvents: "none",
    }} />
  ));
  return { onMouseDown: add, rippleEls };
}

function NumberBubble({ number, color, accent, visible }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 84, height: 84,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, ${accent}, ${color})`,
        boxShadow: hovered
          ? `0 0 0 10px ${color}25, 0 0 44px ${color}90, 0 0 90px ${color}40`
          : `0 0 0 4px ${color}38, 0 0 28px ${color}60`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Bebas Neue', 'Impact', sans-serif",
        fontWeight: 900, fontSize: 34, color: "#fff",
        cursor: "default", zIndex: 10, position: "relative",
        transform: hovered ? "scale(1.2) rotate(-6deg)" : visible ? "scale(1)" : "scale(0.4)",
        transition: "all 0.45s cubic-bezier(0.34,1.56,0.64,1)",
        flexShrink: 0,
      }}
    >
      {number}
      <span style={{
        position: "absolute", inset: -9,
        borderRadius: "50%",
        border: `1.5px dashed ${color}55`,
        animation: hovered ? "spin 2.5s linear infinite" : "none",
      }} />
      <span style={{
        position: "absolute", inset: -18,
        borderRadius: "50%",
        border: `1px dashed ${color}22`,
        animation: hovered ? "spin 5s linear infinite reverse" : "none",
      }} />
    </div>
  );
}

function EventCard({ event, index }) {
  const [ref, visible] = useInView(0.1);
  const [hovered, setHovered] = useState(false);
  const isLeft = index % 2 === 0;
  const { onMouseDown, rippleEls } = useRipple(event.color);

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: isLeft ? "row" : "row-reverse",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : isLeft ? "translateX(-70px)" : "translateX(70px)",
        transition: `opacity 0.65s ease ${index * 70}ms, transform 0.78s cubic-bezier(0.23,1,0.32,1) ${index * 70}ms`,
        minHeight: 180,
        gap: 0,
      }}
    >
      {/* ── Illustration side ── */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: isLeft ? "flex-end" : "flex-start",
        paddingRight: isLeft ? 44 : 0,
        paddingLeft: isLeft ? 0 : 44,
      }}>
        <div style={{
          position: "relative",
          transform: hovered ? "scale(1.16) rotate(6deg)" : "scale(1) rotate(0deg)",
          transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          filter: hovered
            ? `drop-shadow(0 14px 36px ${event.color}95)`
            : `drop-shadow(0 4px 14px ${event.color}35)`,
        }}>
          <img
            src={event.illustration}
            alt={event.title}
            style={{ width: 150, height: 150, objectFit: "contain", display: "block" }}
          />
          <div style={{
            position: "absolute", inset: -24, borderRadius: "50%",
            background: `radial-gradient(circle, ${event.color}28 0%, transparent 65%)`,
            opacity: hovered ? 1 : 0.25,
            transition: "opacity 0.4s ease",
          }} />
        </div>
      </div>

      {/* ── Center bubble ── */}
      <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <NumberBubble number={event.number} color={event.color} accent={event.accent} visible={visible} />
      </div>

      {/* ── Card side ── */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        paddingLeft: isLeft ? 44 : 0,
        paddingRight: isLeft ? 0 : 44,
        justifyContent: isLeft ? "flex-start" : "flex-end",
      }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onMouseDown={onMouseDown}
          style={{
            position: "relative",
            overflow: "hidden",
            width: "100%",
            background: hovered
              ? `linear-gradient(135deg, rgba(255,255,255,0.11), rgba(255,255,255,0.04))`
              : `linear-gradient(135deg, rgba(255,255,255,0.065), rgba(255,255,255,0.018))`,
            border: `1px solid ${hovered ? event.color + "95" : "rgba(255,255,255,0.09)"}`,
            borderRadius: 22,
            padding: "28px 32px",
            cursor: "default",
            transform: hovered ? "translateY(-5px)" : "translateY(0)",
            boxShadow: hovered
              ? `0 24px 70px ${event.color}38, 0 0 0 1px ${event.color}55`
              : "0 4px 24px rgba(0,0,0,0.28)",
            transition: "all 0.38s cubic-bezier(0.23,1,0.32,1)",
            backdropFilter: "blur(18px)",
            textAlign: isLeft ? "left" : "right",
          }}
        >
          {rippleEls}

          {/* Animated top bar */}
          <div style={{
            position: "absolute", top: 0,
            left: isLeft ? 0 : "auto",
            right: isLeft ? "auto" : 0,
            width: hovered ? "100%" : "42%",
            height: 3,
            background: `linear-gradient(90deg, ${event.color}, ${event.accent})`,
            borderRadius: 2,
            transition: "width 0.48s cubic-bezier(0.23,1,0.32,1)",
          }} />

          {/* Corner glow */}
          <div style={{
            position: "absolute",
            top: isLeft ? -50 : "auto",
            bottom: isLeft ? "auto" : -50,
            right: isLeft ? -50 : "auto",
            left: isLeft ? "auto" : -50,
            width: 180, height: 180, borderRadius: "50%",
            background: `radial-gradient(circle, ${event.color}18, transparent 70%)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
            pointerEvents: "none",
          }} />

          {/* Codename icon */}
          <div style={{ marginBottom: 14 }}>
            <img
              src={event.icon}
              alt={event.codename}
              style={{
                height: 56, width: "auto",
                marginLeft: isLeft ? 0 : "auto",
                display: "block",
                filter: `drop-shadow(0 0 12px ${event.color}75)`,
                transform: hovered ? "scale(1.07)" : "scale(1)",
                transition: "transform 0.35s ease, filter 0.35s ease",
              }}
            />
          </div>

          {/* Floor badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: event.color + "22",
            border: `1px solid ${event.color}55`,
            borderRadius: 24,
            padding: "5px 16px",
            marginBottom: 12,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: event.accent,
              boxShadow: `0 0 8px ${event.accent}`,
              display: "block", flexShrink: 0,
            }} />
            <span style={{
              color: event.accent,
              fontSize: 11.5, fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontFamily: "'DM Mono', 'Courier New', monospace",
            }}>{event.floor}</span>
          </div>

          {/* Title */}
          <h3 style={{
            color: "#fff",
            fontFamily: "'Bebas Neue', 'Impact', sans-serif",
            fontSize: 32, letterSpacing: "0.05em",
            margin: "0 0 8px",
            lineHeight: 1.15,
            textShadow: hovered ? `0 0 24px ${event.color}65` : "none",
            transition: "text-shadow 0.3s ease",
          }}>{event.title}</h3>

          {/* Venue */}
          <p style={{
            color: "rgba(255,255,255,0.46)",
            fontSize: 14, margin: "0 0 14px",
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.03em",
          }}>{event.venue}</p>

          {/* Time pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 9,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.11)",
            borderRadius: 12, padding: "7px 16px",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={event.color} strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span style={{
              color: "rgba(255,255,255,0.88)",
              fontSize: 14, fontWeight: 600,
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.04em",
            }}>{event.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineLine() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    const onScroll = () => {
      const rect = parent.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (rect.height + window.innerHeight)));
      setProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={ref} style={{
      position: "absolute", left: "50%", top: 0, bottom: 0,
      width: 2, transform: "translateX(-50%)",
      background: "rgba(245,200,66,0.12)",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: `${progress * 100}%`,
        background: "linear-gradient(180deg, #f5c842, #e91e8c)",
        transition: "height 0.08s linear",
        borderRadius: 2,
      }} />
      <div style={{
        position: "absolute", left: "50%", top: `${progress * 100}%`,
        transform: "translate(-50%, -50%)",
        width: 16, height: 16, borderRadius: "50%",
        background: "#f5c842",
        boxShadow: "0 0 22px #f5c84299, 0 0 6px #f5c842",
        transition: "top 0.08s linear",
      }} />
    </div>
  );
}

export default function EventList() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ripple { to { transform: translate(-50%,-50%) scale(22); opacity: 0; } }
        @keyframes float {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(2deg); }
        }
        @keyframes pulse-glow {
          0%,100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.08); }
        }
      `}</style>

      <section style={{
        position: "relative",
        padding: "110px 32px 130px",
        overflow: "hidden",
        background: "radial-gradient(ellipse at 30% 50%, #0d2a4a 0%, #081525 40%, #050e1a 100%)",
      }}>
        {/* Atmospheric blobs */}
        {[
          { top: "8%", left: "2%", w: 500, c: "#1abc9c", d: "4s", delay: "0s" },
          { top: "42%", right: "2%", w: 420, c: "#e91e8c", d: "5s", delay: "1.2s" },
          { bottom: "10%", left: "6%", w: 350, c: "#3498db", d: "6s", delay: "2s" },
          { top: "72%", right: "12%", w: 280, c: "#f39c12", d: "7s", delay: "0.5s" },
        ].map((b, i) => (
          <div key={i} style={{
            position: "absolute",
            top: b.top, left: b.left, right: b.right, bottom: b.bottom,
            width: b.w, height: b.w, borderRadius: "50%",
            background: `radial-gradient(circle, ${b.c}14, transparent 70%)`,
            animation: `pulse-glow ${b.d} ease-in-out infinite ${b.delay}`,
            pointerEvents: "none",
          }} />
        ))}

        {/* Corner accents */}
        <div style={{ position:"absolute", bottom:0, left:0, width:110, height:110, borderBottom:"2px solid #f5c84278", borderLeft:"2px solid #f5c84278" }} />
        <div style={{ position:"absolute", bottom:0, right:0, width:110, height:110, borderBottom:"2px solid #f5c84278", borderRight:"2px solid #f5c84278" }} />
        

        {/* ── Header ── */}
        <div style={{
          textAlign: "center",
          marginBottom: 110,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 56,
          flexWrap: "wrap",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(-30px)",
          transition: "all 0.9s cubic-bezier(0.23,1,0.32,1)",
        }}>
          <div style={{ animation: "float 4s ease-in-out infinite" }}>
            <img src="/icons/bulb.png" alt="Logo"
              style={{ width: 140, height: 140, objectFit: "contain", filter: "drop-shadow(0 0 32px #f5c84275)" }} />
          </div>

          <div>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 12.5, letterSpacing: "0.22em",
              color: "#f5c842", textTransform: "uppercase", margin: "0 0 12px",
            }}>— presents —</p>
            <h2 style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: "clamp(60px, 10vw, 104px)",
              margin: 0,
              letterSpacing: "0.06em", lineHeight: 1,
              background: "linear-gradient(135deg, #fff 35%, #f5c842 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Event List</h2>
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              marginTop: 16, justifyContent: "center",
            }}>
              <div style={{ height: 1, width: 44, background: "linear-gradient(90deg, transparent, #f5c842)" }} />
              <p style={{
                color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0,
                fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em",
              }}>
                T. Mohandas Pai Platinum Jubilee Block · MGM College Campus, Udupi
              </p>
              <div style={{ height: 1, width: 44, background: "linear-gradient(90deg, #f5c842, transparent)" }} />
            </div>
          </div>

          <div style={{ animation: "float 4s ease-in-out infinite 1.2s" }}>
            <img src="/icons/title.png" alt="Beyond The Scroll"
              style={{ width: 200, height: "auto", filter: "drop-shadow(0 0 16px rgba(255,255,255,0.22))" }} />
          </div>
        </div>

        {/* ── Timeline ── */}
        <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative" }}>
          <TimelineLine />
          <div style={{ display: "flex", flexDirection: "column", gap: 72 }}>
            {events.map((event, i) => (
              <EventCard key={event.number} event={event} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}