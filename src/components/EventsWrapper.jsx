/**
 * EventsWrapper.jsx
 *
 * Drop-in wrapper that adds a tab toggle above the two sections:
 *   Tab 0 → Competitions (EventList)
 *   Tab 1 → Speaker Sessions (SessionList)
 *
 * USAGE — replace wherever you currently render <EventList /> with:
 *   <EventsWrapper />
 *
 * Make sure SessionList.jsx is in the same folder.
 */

import { useState, useEffect, useRef } from "react";
import EventList from "./EventList";       // your existing component
import SessionList from "./SessionList";   // new component
import CeremonyList from "./CeremonyList"; // ceremonies component

// ── Tab config ─────────────────────────────────────────────
const TABS = [
  {
    id: "competitions",
    label: "Competitions",
    shortLabel: "Compete",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
      </svg>
    ),
    sub: "8 events · Parallel competitions",
    activeColor: "#f5c842",
  },
  {
    id: "sessions",
    label: "Speaker Sessions",
    shortLabel: "Sessions",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    sub: "7 sessions · Creator talks & panels",
    activeColor: "#72c6ff",
  },
];

// ── Animated sliding pill tab bar ──────────────────────────
function TabBar({ active, onChange }) {
  const [pillStyle, setPillStyle] = useState({});
  const tabRefs = useRef([]);
  const barRef = useRef(null);

  useEffect(() => {
    const el = tabRefs.current[active];
    const bar = barRef.current;
    if (!el || !bar) return;
    const elRect = el.getBoundingClientRect();
    const barRect = bar.getBoundingClientRect();
    setPillStyle({
      left: elRect.left - barRect.left,
      width: elRect.width,
    });
  }, [active]);

  return (
    <div style={{
      display: "flex", justifyContent: "center",
      marginBottom: 0, padding: "0 16px",
    }}>
      <div ref={barRef} style={{
        position: "relative",
        display: "inline-flex",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16,
        padding: 5,
        gap: 2,
      }}>
        {/* Sliding pill */}
        <div style={{
          position: "absolute",
          top: 5, height: "calc(100% - 10px)",
          borderRadius: 12,
          background: active === 0
            ? "linear-gradient(135deg, rgba(245,200,66,0.22), rgba(245,200,66,0.1))"
            : "linear-gradient(135deg, rgba(114,198,255,0.22), rgba(114,198,255,0.08))",
          border: `1px solid ${active === 0 ? "rgba(245,200,66,0.45)" : "rgba(114,198,255,0.4)"}`,
          boxShadow: active === 0
            ? "0 0 20px rgba(245,200,66,0.18)"
            : "0 0 20px rgba(114,198,255,0.18)",
          transition: "left 0.38s cubic-bezier(0.34,1.3,0.64,1), width 0.38s cubic-bezier(0.34,1.3,0.64,1), background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
          pointerEvents: "none",
          zIndex: 1,
          ...pillStyle,
        }} />

        {TABS.map((tab, i) => {
          const isActive = active === i;
          return (
            <button
              key={tab.id}
              ref={el => tabRefs.current[i] = el}
              onClick={() => onChange(i)}
              style={{
                position: "relative", zIndex: 2,
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 20px",
                background: "none", border: "none", cursor: "pointer",
                borderRadius: 12,
                color: isActive
                  ? (i === 0 ? "#f5c842" : "#72c6ff")
                  : "rgba(255,255,255,0.38)",
                fontFamily: "'DM Mono', monospace",
                fontSize: 12.5, fontWeight: isActive ? 600 : 400,
                letterSpacing: "0.06em",
                transition: "color 0.25s ease",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{
                opacity: isActive ? 1 : 0.5,
                transition: "opacity 0.25s ease",
              }}>{tab.icon}</span>
              {/* Full label on desktop, short on mobile */}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="inline sm:hidden">{tab.shortLabel}</span>
              {/* Count dot */}
              <span style={{
                fontSize: 9, letterSpacing: "0.08em",
                background: isActive
                  ? (i === 0 ? "rgba(245,200,66,0.18)" : "rgba(114,198,255,0.18)")
                  : "rgba(255,255,255,0.07)",
                color: isActive
                  ? (i === 0 ? "#f5c842" : "#72c6ff")
                  : "rgba(255,255,255,0.25)",
                border: `1px solid ${isActive
                  ? (i === 0 ? "rgba(245,200,66,0.35)" : "rgba(114,198,255,0.3)")
                  : "rgba(255,255,255,0.1)"}`,
                borderRadius: 6, padding: "1px 6px",
                transition: "all 0.25s ease",
              }}>
                {i === 0 ? "8" : "7"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Sub-label under the tab bar ────────────────────────────
function TabSubLabel({ active }) {
  const tab = TABS[active];
  return (
    <div style={{
      textAlign: "center", marginTop: 10, marginBottom: 0,
      fontFamily: "'DM Mono', monospace", fontSize: 10.5,
      color: "rgba(255,255,255,0.22)", letterSpacing: "0.12em",
      textTransform: "uppercase",
      transition: "all 0.3s ease",
    }}>
      {tab.sub}
    </div>
  );
}

// ── Content transition wrapper ─────────────────────────────
function SlideTransition({ activeIndex, children }) {
  const [displayIndex, setDisplayIndex] = useState(activeIndex);
  const [animState, setAnimState] = useState("idle"); // "idle" | "exit" | "enter"
  const prevIndex = useRef(activeIndex);
  const direction = useRef(1);

  useEffect(() => {
    if (activeIndex === prevIndex.current) return;
    direction.current = activeIndex > prevIndex.current ? 1 : -1;
    setAnimState("exit");
    const t1 = setTimeout(() => {
      setDisplayIndex(activeIndex);
      setAnimState("enter");
      const t2 = setTimeout(() => {
        setAnimState("idle");
        prevIndex.current = activeIndex;
      }, 420);
      return () => clearTimeout(t2);
    }, 260);
    return () => clearTimeout(t1);
  }, [activeIndex]);

  const getStyle = () => {
    const d = direction.current;
    switch (animState) {
      case "exit":
        return {
          opacity: 0,
          transform: `translateX(${d * -3}%) scale(0.985)`,
          transition: "opacity 0.26s ease, transform 0.26s ease",
        };
      case "enter":
        return {
          opacity: 0,
          transform: `translateX(${d * 3}%)`,
          transition: "none",
        };
      case "idle":
        return {
          opacity: 1,
          transform: "translateX(0) scale(1)",
          transition: "opacity 0.42s cubic-bezier(0.23,1,0.32,1), transform 0.42s cubic-bezier(0.23,1,0.32,1)",
        };
      default:
        return { opacity: 1 };
    }
  };

  return (
    <div style={{ overflow: "hidden" }}>
      <div style={getStyle()}>
        {children[displayIndex]}
      </div>
    </div>
  );
}

// ── Sticky tab bar container (appears when scrolled to section) ──
export default function EventsWrapper() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&display=swap');
        @keyframes tabFadeIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Ceremony Section */}
      <CeremonyList />

      {/* Tab nav — sits between HeroSection and the content sections */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(5, 14, 26, 0.88)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "12px 16px 10px",
        animation: "tabFadeIn 0.5s ease",
      }}>
        <TabBar active={activeTab} onChange={setActiveTab} />
        <TabSubLabel active={activeTab} />
      </div>

      {/* Content */}
      <SlideTransition activeIndex={activeTab}>
        <EventList />
        <SessionList />
      </SlideTransition>
      {/* Valedictory Ceremony */}
      <CeremonyList type="bottom" />
    </>
  );
}
