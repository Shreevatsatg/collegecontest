import { useState, useEffect } from "react";
import HeroSection from "./components/HeroSection";
import EventList from "./components/EventList";
import Footer from "./components/Footer";

export default function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a1628] text-white overflow-x-hidden">
      <HeroSection scrollY={scrollY} />
      <EventList />
      <Footer />
    </div>
  );
}