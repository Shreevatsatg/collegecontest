import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HeroSection from "./components/HeroSection";
import EventsWrapper from "./components/EventsWrapper";
import Footer from "./components/Footer";
import Launch from "./components/Launch";

export default function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a1628] text-white overflow-x-hidden">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection scrollY={scrollY} />
              <EventsWrapper />
              <Footer />
            </>
          }
        />
        <Route path="/launch" element={<Launch />} />
      </Routes>
    </div>
  );
}
