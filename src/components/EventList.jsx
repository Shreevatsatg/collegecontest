import { useEffect, useRef, useState } from "react";

const events = [
  {
    number: 1,
    codename: "THINKFEED",
    title: "Paper Presentation",
    venue: "Conference Hall",
    time: "11.30 AM - 1.30 PM",
    floor: "Ground Floor",
    color: "#1abc9c",
    icon: "/icons/thinkfeed.png",
    illustration: "/icons/paperpresentation.png",
  },
  {
    number: 2,
    codename: "COMMENT WARS",
    title: "Debate",
    venue: "Main Hall",
    time: "10.30 AM - 12.00 PM",
    floor: "Third Floor",
    color: "#e74c3c",
    icon: "/icons/commentwar.png",
    illustration: "/icons/debate.png",
  },
  {
    number: 3,
    codename: "BUZZ BUILDERS",
    title: "Social Media Marketing Campaign",
    venue: "Room No. 1",
    time: "11.30 AM - 1.30 PM",
    floor: "Ground Floor",
    color: "#3498db",
    icon: "/icons/buzzbuilders.png",
    illustration: "/icons/socialmediamarketing campaighn.png",
  },
  {
    number: 4,
    codename: "PIXEL IMPACT",
    title: "Digital Poster Design",
    venue: "Computer Lab 2",
    time: "10.30 AM - 11.30 AM",
    floor: "Second Floor",
    color: "#e74c3c",
    icon: "/icons/pixelimpact.png",
    illustration: "/icons/digitalposterdesign.png",
  },
  {
    number: 5,
    codename: "SAY IT SMART",
    title: "Caption Writing Contest",
    venue: "Computer Lab 3",
    time: "10.30 AM - 11.30 AM",
    floor: "Second Floor",
    color: "#f39c12",
    icon: "/icons/sayitsmart.png",
    illustration: "/icons/captionwritingcontest.png",
  },
  {
    number: 6,
    codename: "60 SECONDS FAME",
    title: "Reel Making",
    venue: "Computer Lab 2",
    time: "3.00 PM - 4.00 PM",
    floor: "Second Floor",
    color: "#e91e8c",
    icon: "/icons/fame.png",
    illustration: "/icons/reelmaking.png",
  },
  {
    number: 7,
    codename: "DIGITAL ECHOES",
    title: "Short Film Making",
    venue: "Main Hall",
    time: "1.30 PM - 2.30 PM",
    floor: "Third Floor",
    color: "#2ecc71",
    icon: "/icons/digitalechoes.png",
    illustration: "/icons/shortfilm making.png",
  },
  {
    number: 8,
    codename: "VIRAL TO REAL",
    title: "Cultural Showdown",
    venue: "Main Hall",
    time: "2.30 PM - 3.30 PM",
    floor: "Third Floor",
    color: "#e91e8c",
    icon: "/icons/viraltoreal.png",
    illustration: "/icons/culturalshowdown.png",
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
      className={`flex items-center gap-6 md:gap-12 ${isLeft ? "flex-row" : "flex-row-reverse"} transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {/* Illustration side */}
      <div className={`flex-1 flex ${isLeft ? "justify-end" : "justify-start"}`}>
        <img src={event.illustration} alt={event.title} className="w-24 h-24 md:w-32 md:h-32 object-contain" />
      </div>

      {/* Center number bubble */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-black text-white text-xl md:text-2xl shadow-lg z-10"
          style={{ backgroundColor: event.color, boxShadow: `0 0 20px ${event.color}80` }}
        >
          {event.number}
        </div>
      </div>

      {/* Event detail card */}
      <div className={`flex-1 ${isLeft ? "text-left" : "text-right"}`}>
        <div className="mb-3">
          <img src={event.icon} alt={event.codename} className={`h-12 md:h-16 w-auto ${isLeft ? "" : "ml-auto"}`} />
        </div>
        <div className="bg-white rounded-lg p-3 md:p-4 inline-block">
          <p className="text-teal-600 text-xs uppercase font-bold mb-1">
            {event.floor}
          </p>
          <h3 className="text-gray-900 font-bold text-sm md:text-base leading-tight">
            {event.title}
          </h3>
          <p className="text-gray-700 text-xs md:text-sm mt-1">
            {event.venue}
          </p>
          <p className="text-gray-900 text-xs md:text-sm font-semibold mt-1">
            {event.time}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function EventList() {
  return (
    <section
      className="relative py-16 px-4">
        <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, #0d2a4a 0%, #081525 40%, #050e1a 100%)",
        }}
      />
       <div className="absolute bottom-0 left-0 w-28 h-28 border-b-2 border-l-2 border-yellow-500/60 rounded-bl-sm" />
      <div className="absolute bottom-0 right-0 w-28 h-28 border-b-2 border-r-2 border-yellow-500/60 rounded-br-sm" />
      {/* Section header */}
      <div className="text-center mb-14 flex items-center justify-center gap-8">
        <div className="w-24 h-24 md:w-32 md:h-32">
          <img src="/icons/bulb.png" alt="Logo" className="w-full h-auto" />
        </div>
        <div>
          <h2 className="font-bold text-4xl md:text-6xl text-white mb-2">
            Event List
          </h2>
          <p className="text-white/60 text-sm">
            Venue: T. Mohandas Pai Platinum Jubilee Block,
          </p>
          <p className="text-white/60 text-sm">
            MGM College Campus, Udupi
          </p>
        </div>
        <div className="w-48 h-auto">
          <img src="/icons/title.png" alt="Beyond The Scroll" className="w-full h-auto" />
        </div>
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