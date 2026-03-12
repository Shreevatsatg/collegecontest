import { useEffect, useRef, useState } from "react";

const events = [
  {
    number: 1,
    codename: "THINKFEED",
    title: "Paper Presentation",
    venue: "Conference Hall",
    time: "11.30 AM – 1.30 PM",
    floor: "Ground Floor",
    color: "#1abc9c",
    emoji: "📄",
    style: { fontFamily: "'Impact', sans-serif", color: "#1abc9c" },
  },
  {
    number: 2,
    codename: "COMMENT WARS",
    title: "Debate",
    venue: "Main Hall",
    time: "10.30 AM – 12.00 PM",
    floor: "Third Floor",
    color: "#e74c3c",
    emoji: "🎤",
    style: { fontFamily: "'Impact', sans-serif", color: "#e74c3c" },
  },
  {
    number: 3,
    codename: "BUZZ BUILDERS",
    title: "Social Media Marketing Campaign",
    venue: "Room No. 1",
    time: "11.30 AM – 1.30 PM",
    floor: "Ground Floor",
    color: "#3498db",
    emoji: "📣",
    style: { fontFamily: "'Impact', sans-serif", color: "#3498db" },
  },
  {
    number: 4,
    codename: "PIXEL IMPACT",
    title: "Digital Poster Design",
    venue: "Computer Lab 2",
    time: "10.30 AM – 11.30 AM",
    floor: "Second Floor",
    color: "#9b59b6",
    emoji: "🎨",
    style: { fontFamily: "'Impact', sans-serif", color: "#9b59b6" },
  },
  {
    number: 5,
    codename: "SAY IT SMART",
    title: "Caption Writing Contest",
    venue: "Computer Lab 3",
    time: "10.30 AM – 11.30 AM",
    floor: "Second Floor",
    color: "#f39c12",
    emoji: "✏️",
    style: { fontFamily: "'Impact', sans-serif", color: "#f39c12" },
  },
  {
    number: 6,
    codename: "60 SECONDS FAME",
    title: "Reel Making",
    venue: "Computer Lab 2",
    time: "3.00 PM – 4.00 PM",
    floor: "Second Floor",
    color: "#e67e22",
    emoji: "🎬",
    style: { fontFamily: "'Impact', sans-serif", color: "#e67e22" },
  },
  {
    number: 7,
    codename: "DIGITAL ECHOES",
    title: "Short Film Making",
    venue: "Main Hall",
    time: "1.30 PM – 2.30 PM",
    floor: "Third Floor",
    color: "#2ecc71",
    emoji: "🎥",
    style: { fontFamily: "'Impact', sans-serif", color: "#2ecc71" },
  },
  {
    number: 8,
    codename: "VIRAL TO REAL",
    title: "Cultural Showdown",
    venue: "Main Hall",
    time: "2.30 PM – 3.30 PM",
    floor: "Third Floor",
    color: "#e91e8c",
    emoji: "🎭",
    style: { fontFamily: "'Impact', sans-serif", color: "#e91e8c" },
  },
];

function EventCard({ event, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const isLeft = index % 2 === 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`flex items-center gap-4 md:gap-8 ${isLeft ? "flex-row" : "flex-row-reverse"} transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {/* Event detail card */}
      <div
        className={`flex-1 ${isLeft ? "text-right" : "text-left"}`}
      >
        <div
          className="inline-block bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-4 md:p-5 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] cursor-default"
          style={{ borderColor: `${event.color}40` }}
        >
          <p className="text-white/50 text-xs uppercase tracking-widest mb-1">
            {event.floor}
          </p>
          <h3 className="text-white font-bold text-base md:text-lg leading-tight">
            {event.title}
          </h3>
          <p className="text-white/60 text-sm mt-1">
            📍 {event.venue}
          </p>
          <p className="text-white/80 text-sm font-semibold mt-1">
            🕐 {event.time}
          </p>
        </div>
      </div>

      {/* Center number bubble */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-black text-white text-lg md:text-xl shadow-lg z-10"
          style={{ backgroundColor: event.color, boxShadow: `0 0 20px ${event.color}60` }}
        >
          {event.number}
        </div>
      </div>

      {/* Codename side */}
      <div className={`flex-1 ${isLeft ? "text-left" : "text-right"}`}>
        <p
          className="font-black text-xl md:text-2xl uppercase leading-tight"
          style={event.style}
        >
          {event.codename.split(" ").map((word, i) => (
            <span key={i} className="block">{word}</span>
          ))}
        </p>
        <span className="text-3xl">{event.emoji}</span>
      </div>
    </div>
  );
}

export default function EventList() {
  return (
    <section
      className="relative py-16 px-4"
      style={{
        background: "linear-gradient(180deg, #0a1628 0%, #050e1a 100%)",
      }}
    >
      {/* Section header */}
      <div className="text-center mb-14">
       
        <h2
          className="font-bold text-4xl md:text-6xl uppercase text-white"
          style={{
            fontFamily: " sans-serif",
            textShadow: "0 0 30px rgba(255,255,255,0.1)",
          }}
        >
          Event List
        </h2>
        <p className="text-white/40 text-sm mt-2">
          Venue: T. Mohandas Pai Platinum Jubilee Block,
        </p>
        <p className="text-white/40 text-sm mt-2">
           MGM College Campus, Udupi
        </p>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto relative">
        {/* Vertical line */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
          style={{
            background:
              "linear-gradient(180deg, transparent, #f5c842 10%, #f5c842 90%, transparent)",
            opacity: 0.3,
          }}
        />

        <div className="flex flex-col gap-10">
          {events.map((event, i) => (
            <EventCard key={event.number} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}