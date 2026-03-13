import { useEffect, useRef } from "react";

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
     

      {/* Wave canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
      />

      {/* Header */}
      <div className="relative z-10 text-center pt-6 px-1">
        {/* Logo */}
        <div className="flex justify-center mb-3">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
            <img className="w-19 h-auto mr-1" src="/icons/college logo.png" alt="College Logo" />
          </div>
        </div>

        <p className="text-white text-base md:text-lg tracking-[0.2em] uppercase mb-1">
          MGM COLLEGE TRUST'S
        </p>
        <h1 className="text-white font-bold text-2xl md:text-4xl tracking-wide uppercase leading-tight">
          MAHATMA GANDHI MEMORIAL EVENING COLLEGE
        </h1>
        <p className="text-white text-base md:text-lg tracking-wider mt-2">
          UDUPI - 576 102
        </p>

        {/* Contact bar */}
        <div className="flex flex-wrap justify-center md:gap-8 mt-2 md:mt-5 text-sm text-white">
          <a
            href="http://mgmevening.mgmudupi.ac.in"
            className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
          >
            <span className="text-yellow-400 text-xl">🌐</span>
            mgmevening.mgmudupi.ac.in
          </a>
          <a
            href="tel:08202001877"
            className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
          >
            <span className="text-yellow-400 text-xl">📞</span>
            0820 - 2001877
          </a>
          <a
            href="mailto:mgmecudupi@gmail.com"
            className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
          >
            <span className="text-yellow-400 text-xl">✉️</span>
            mgmecudupi@gmail.com
          </a>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        <p
          className="text-white italic text-3xl md:text-5xl mb-4"
          style={{ fontFamily: "'Brush Script MT', cursive" }}
        >
          Presents
        </p>

        {/* BEYOND THE SCROLL title */}
        <div className="text-center mb-6 max-w-4xl w-full px-4">
          <img src="/icons/title.png" alt="Beyond The Scroll" className="w-full h-auto" />
        </div>

        {/* Brain + Lightbulb icon area */}
        <div className="relative flex md:mb-4 items-center justify-center w-full max-w-5xl">
          {/* Center bulb with social icons */}
          <div className="relative w-64 h-64 md:w-xl md:h-90 flex items-center justify-center mt-3">
            <img src="/icons/bulb.png" alt="Brain Bulb" className="w-full h-auto mr-4" />
         
          </div>

          {/* Prize tags */}
          <div className="absolute left-0 md:left-5 top-1/3 -translate-y-1/1">
            <img src="/icons/winner.png" alt="Overall Winners" className="w-28 md:w-70" />
          </div>
          <div className="absolute right-0 md:right-5 top-2/3 -translate-y-0.1/100">
            <img src="/icons/runner.png" alt="Overall Runners" className="w-28 md:w-70" />
          </div>
        </div>

        {/* Date and Venue */}
        <div className="text-center mt-8 md:mt-16">
          <p className="text-white font-bold text-xl md:text-2xl">
            Date: 27-03-2026 (Friday)
          </p>
          <p className="text-white text-base md:text-lg mt-2">
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