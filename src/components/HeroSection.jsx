import { useEffect, useRef } from "react";
import { Globe, Phone, Mail, Instagram, Twitter, Youtube, Facebook } from "lucide-react";

const socialIcons = [
  { icon: Instagram, label: "Instagram", pos: "top-[38%] left-[18%]" },
  { icon: Twitter, label: "X", pos: "top-[32%] left-[46%]" },
  { icon: Youtube, label: "YouTube", pos: "top-[38%] right-[18%]" },
  { icon: Facebook, label: "Facebook", pos: "top-[50%] left-[14%]" },
];

export default function HeroSection({ scrollY }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let frame = 0;
    let animId;

    function drawWave() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(212, 175, 55, ${0.05 + i * 0.03})`;
        ctx.lineWidth = 1.5;
        for (let x = 0; x <= canvas.width; x += 2) {
          const y =
            canvas.height * 0.5 +
            Math.sin((x / canvas.width) * Math.PI * 4 + frame * 0.02 + i * 0.8) *
              (30 + i * 15);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      frame++;
      animId = requestAnimationFrame(drawWave);
    }

    drawWave();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, #0d2a4a 0%, #081525 40%, #050e1a 100%)",
        }}
      />

      {/* Gold corner accents */}
      <div className="absolute top-0 left-0 w-28 h-28 border-t-2 border-l-2 border-yellow-500/60 rounded-tl-sm" />
      <div className="absolute top-0 right-0 w-28 h-28 border-t-2 border-r-2 border-yellow-500/60 rounded-tr-sm" />
      <div className="absolute bottom-0 left-0 w-28 h-28 border-b-2 border-l-2 border-yellow-500/60 rounded-bl-sm" />
      <div className="absolute bottom-0 right-0 w-28 h-28 border-b-2 border-r-2 border-yellow-500/60 rounded-br-sm" />

      {/* Wave canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
      />

      {/* Header */}
      <div className="relative z-10 text-center pt-0 px-4">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-22 rounded-b-full border-2 bg-white flex items-center justify-center ">
            <img className="w-26 h-auto" src="/icons/college logo.png"></img>
          </div>
        </div>

        <p className="text-white text-xl tracking-[0.25em] uppercase mb-1">
          MGM College Trust's
        </p>
        <h1 className="text-white font-bold text-xl md:text-3xl tracking-wide uppercase leading-tight">
          Mahatma Gandhi Memorial Evening College
        </h1>
        <p className="text-white text-sm tracking-widest mt-1">
          UDUPI – 576 102
        </p>

        {/* Contact bar */}
        <div className="flex flex-wrap justify-center gap-6 mt-4 text-sm text-white/70">
          <a
            href="http://mgmevening.mgmudupi.ac.in"
            className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors"
          >
            <Globe size={14}  />
            mgmevening.mgmudupi.ac.in
          </a>
          <a
            href="tel:08202001877"
            className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors"
          >
            <Phone size={14} />
            0820 – 2001877
          </a>
          <a
            href="mailto:mgmecudupi@gmail.com"
            className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors"
          >
            <Mail size={14} />
            mgmecudupi@gmail.com
          </a>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        <p
          className="text-white/60 italic text-4xl mb-2"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Presents
        </p>

        {/* BEYOND THE SCROLL title */}
        <div className="text-center mb-4 px-80">
         <img src="/icons/title.png"></img>
        </div>


        {/* Brain + Lightbulb icon area */}
        <div className="relative flex items-center justify-center mb-10">
          {/* Social media icons orbiting */}
          <div className="relative w-84 h-84 md:w-80 md:h-80">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src="/icons/bulb.png"></img>
                </div>
            {/* Heartbeat line */}
            <svg
              className="absolute -bottom-8 left-0 w-full"
              viewBox="0 0 280 40"
              fill="none"
            >
              <polyline
                points="0,20 30,20 40,5 50,35 60,10 70,30 80,20 110,20 120,2 130,38 140,20 280,20"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Prize tags */}
          <div className="absolute left-0 md:-left-2 top-1/3 -translate-y-1/2">
            <div className="bg-red-600 border-2 border-yellow-400 rounded-lg px-4 py-2 text-center shadow-lg">
              <p className="text-yellow-300 text-[10px] font-bold tracking-wider uppercase">Overall Winners</p>
              <p className="text-white font-black text-lg">₹10,000/-</p>
              <p className="text-yellow-300 text-2xl">🥇</p>
            </div>
          </div>
          <div className="absolute right-0 md:-right-2 top-1/2 -translate-y-1/2">
            <img src="/icons/runner.png"></img>
          </div>
        </div>

        {/* Date and Venue */}
        <div className="text-center mt-8">
          <p className="text-white font-bold text-lg md:text-xl">
            Date: 27-03-2026 (Friday)
          </p>
          <p className="text-white/80 text-base md:text-lg mt-1">
            Venue: T. Mohandas Pai Platinum Jubilee Block,
            <br />
            MGM College Campus, Udupi
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          from { transform: translate(-50%, -50%) translateY(0px); }
          to { transform: translate(-50%, -50%) translateY(-8px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </section>
  );
}