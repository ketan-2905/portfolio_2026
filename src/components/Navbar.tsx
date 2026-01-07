import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "./utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  const letterStyles = [
  { font: 'font-astroz', color: 'text-green-400' },
  { font: 'font-fishel', color: 'text-cyan-400' },
  { font: 'font-monoton', color: 'text-white' },
  { font: 'font-vt323', color: 'text-green-500' },
  { font: 'font-poppins', color: 'text-green-300' },
];

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-[100] transition-all duration-300 border-b",
        scrolled
          ? "bg-[#050505]/90 backdrop-blur-xl border-white/10 py-3"
          : "bg-transparent border-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="text-xl font-black tracking-tighter text-white">
          KETAN<span className="text-green-500">.dev</span>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link,index) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[11px] font-mono text-gray-400 hover:text-green-500 transition-colors uppercase tracking-[0.2em]"
            >
              {link.name}
            </a>
          ))}
        </div>
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed inset-0 top-0 left-0 w-full h-screen bg-[#050505] z-[99] flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => {
              const style = letterStyles[i % letterStyles.length];
              return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  style.color,
                  style.font,
                  "text-3xl font-bold  uppercase tracking-tighter")}
              >
                {link.name}
              </a>
            )
            })}
            <button
              onClick={() => setIsOpen(false)}
              className="mt-8 text-green-500 border border-green-500/30 px-6 py-2 rounded-full font-mono text-sm"
            >
              CLOSE_TERMINAL
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
