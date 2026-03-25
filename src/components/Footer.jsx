import { Globe, Phone, Mail, ClipboardList } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="relative py-10 px-4 text-center border-t border-white/10"
      style={{ background: "#040c18" }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full border border-yellow-white bg-white flex items-center justify-center">
            <img className="ml-0 mr-0.75" src="/icons/college logo.png"></img>
          </div>
        </div>

        <p className="text-white text-xs tracking-widest uppercase mb-1">
          MGM College Trust's
        </p>
        <h3 className="text-white font-bold text-sm md:text-base mb-1">
          Mahatma Gandhi Memorial Evening College
        </h3>
        <p className="text-white/40 text-xs mb-4">Udupi – 576 102</p>

        <div className="flex flex-wrap justify-center gap-4 text-xs text-white/50 mb-6">
          <a href="http://mgmevening.mgmudupi.ac.in" className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
            <Globe size={12} /> mgmevening.mgmudupi.ac.in
          </a>
          <a href="tel:08202001877" className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
            <Phone size={12} /> 0820 – 2001877
          </a>
          <a href="mailto:mgmecudupi@gmail.com" className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
            <Mail size={12} /> mgmecudupi@gmail.com
          </a>
        </div>

        {/* Feedback Form */}
        <div className="mb-6">
          <a
            href="https://docs.google.com/forms/d/1JzPMP9ByVBQX8hoUEtBUc91nWd31EvYzcj_8aRVFfv8/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgba(245,200,66,0.15), rgba(245,200,66,0.06))",
              border: "1px solid rgba(245,200,66,0.4)",
              color: "#f5c842",
              boxShadow: "0 0 18px rgba(245,200,66,0.08)",
              textDecoration: "none",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(245,200,66,0.25), rgba(245,200,66,0.12))"; e.currentTarget.style.boxShadow = "0 0 28px rgba(245,200,66,0.22)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(245,200,66,0.15), rgba(245,200,66,0.06))"; e.currentTarget.style.boxShadow = "0 0 18px rgba(245,200,66,0.08)"; }}
          >
            <ClipboardList size={14} />
            Share Your Feedback
          </a>
          <p className="text-white/25 text-xs mt-2 tracking-wide">
            We'd love to hear what you think about Beyond The Scroll
          </p>
        </div>

        <div className="border-t border-white/10 pt-4">
          <p className="text-white/20 text-xs">
            Beyond The Scroll — An Inter Collegiate CONFEST · 27 March 2026
          </p>
        </div>
      </div>
    </footer>
  );
}