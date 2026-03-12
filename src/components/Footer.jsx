import { Globe, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="relative py-10 px-4 text-center border-t border-white/10"
      style={{ background: "#040c18" }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full border border-yellow-white bg-white flex items-center justify-center">
            <img src="/icons/college logo.png"></img>
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

        <div className="border-t border-white/10 pt-4">
          <p className="text-white/20 text-xs">
            Beyond The Scroll — An Inter Collegiate CONFEST · 27 March 2026
          </p>
        </div>
      </div>
    </footer>
  );
}