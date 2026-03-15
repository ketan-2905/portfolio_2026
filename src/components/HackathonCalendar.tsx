'use client';

import { useState } from 'react';

// --- TypeScript Interfaces ---
interface HackathonEvent {
  id: string;
  title: string;
  prize: string;
  url: string;
  prizeColor: string;
}

interface CalendarDay {
  date: number;
  bgColor: string;
  events: HackathonEvent[];
}

// --- Mock Data ---
const calendarData: CalendarDay[] = Array.from({ length: 31 }, (_, i) => ({
  date: i + 1,
  bgColor: 'bg-white',
  events: [],
}));

// Injecting Event Data for the 18th
calendarData[17].bgColor = 'bg-[#a7f3d0]';
calendarData[17].events = [
  {
    id: 'e1',
    title: '⚔️ HackNiche 4.0',
    prize: '₹50k / 30k',
    url: 'https://hackniche4-0.devfolio.co/overview',
    prizeColor: 'text-green-600',
  },
  {
    id: 'e2',
    title: '⚔️ Recursion 7.0',
    prize: '₹120k / 100k',
    url: 'https://unstop.com/hackathons/recursion-70-rajiv-gandhi-institute-of-technology-mumbai-1656541',
    prizeColor: 'text-green-600',
  },
];

// Injecting Event Data for the 22nd
calendarData[21].bgColor = 'bg-[#fef08a]';
calendarData[21].events = [
  {
    id: 'e3',
    title: '🏆 IdeaHack 2.0',
    prize: '₹500k/300k',
    url: 'https://www.ideahackathon.com/',
    prizeColor: 'text-orange-500',
  },
];

// --- Sub-component for Event Days ---
const EventDayCell = ({ day }: { day: CalendarDay }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = day.events.length;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const activeEvent = day.events[currentSlide];

  return (
    <div className={`min-h-[140px] md:min-h-[160px] border-2 border-black p-2 flex flex-col retro-shadow transition-all ${day.bgColor}`}>
      {/* Header & Controls */}
      <div className="flex justify-between items-center mb-2 border-b-2 border-black pb-1">
        <span className="font-vt323 text-2xl md:text-3xl font-bold text-black leading-none">{day.date}</span>
        
        {totalSlides > 1 && (
          <div className="flex items-center gap-1">
            <button onClick={prevSlide} className="bg-white border-2 border-black px-1 text-[10px] md:text-xs font-bold hover:bg-black hover:text-white retro-btn leading-none active:translate-y-0.5 active:translate-x-0.5 active:shadow-none">&lt;</button>
            <span className="text-[10px] md:text-xs font-bold px-1 font-space">{currentSlide + 1}/{totalSlides}</span>
            <button onClick={nextSlide} className="bg-white border-2 border-black px-1 text-[10px] md:text-xs font-bold hover:bg-black hover:text-white retro-btn leading-none active:translate-y-0.5 active:translate-x-0.5 active:shadow-none">&gt;</button>
          </div>
        )}
      </div>

      {/* Active Event Card */}
      <div className="flex-1 flex flex-col justify-between bg-white border-2 border-black p-1 md:p-2 h-full">
        <div className="overflow-hidden">
          <div className="font-bold text-xs md:text-sm leading-tight truncate font-space">{activeEvent.title}</div>
          <div className={`${activeEvent.prizeColor} font-bold text-[10px] md:text-xs mt-1 font-space truncate`}>{activeEvent.prize}</div>
        </div>
        <a 
          href={activeEvent.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block text-center mt-2 px-1 py-1 bg-black text-white text-[10px] font-bold hover:bg-green-400 hover:text-black border-2 border-black transition-colors uppercase font-space"
        >
          View
        </a>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function HackathonCalendar() {
  // Cleaner way to get the current month string
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });

  return (
    <main className="min-h-screen py-8 md:py-12 px-2 md:px-4 bg-[#f4f0ea] bg-[radial-gradient(#d1c8b8_1px,transparent_1px)] [background-size:20px_20px] text-[#1a1a2e] overflow-x-hidden">
      <section className="max-w-6xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12 px-2">
          <h1 className="font-vt323 text-5xl sm:text-6xl md:text-8xl font-bold text-black uppercase mb-4 drop-shadow-[3px_3px_0px_#4ade80] md:drop-shadow-[4px_4px_0px_#4ade80] break-words">
            {currentMonthName} 2026
          </h1>
          <p className="text-sm md:text-lg font-bold text-gray-700 uppercase tracking-wider flex items-center justify-center gap-2 font-space flex-wrap">
            <span>👾</span> Upcoming Hackathon Quests <span>👾</span>
          </p>
        </div>

        {/* Calendar Container 
          Added a horizontal scroll wrapper (overflow-x-auto) so the calendar stays intact on mobile.
        */}
        <div className="bg-[#ffdeeb] border-4 border-black p-3 md:p-6 retro-shadow rounded-lg w-full">
          
          <div className="overflow-x-auto pb-4 pr-2 custom-scrollbar">
            {/* Setting a min-width forces horizontal scrolling instead of squishing columns */}
            <div className="min-w-[768px]">
              
              {/* Days of Week Header */}
              <div className="grid grid-cols-7 gap-2 md:gap-4 text-center mb-4 font-space">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, i) => (
                  <div key={day} className={`bg-white border-2 border-black py-2 text-xs md:text-base font-bold retro-shadow ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : ''}`}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 md:gap-4">
                
                {/* Days Loop */}
                {calendarData.map((day) => (
                  day.events.length > 0 ? (
                    <EventDayCell key={day.date} day={day} />
                  ) : (
                    <div key={day.date} className="min-h-[100px] md:min-h-[160px] bg-white border-2 border-black p-2 retro-shadow flex flex-col group transition-all duration-200 hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_#000]">
                      <span className="font-vt323 text-2xl md:text-3xl font-bold text-gray-400 group-hover:text-black transition-colors">{day.date}</span>
                    </div>
                  )
                ))}

                {/* Empty End Days (to pad out the rest of the week) */}
                {[1, 2, 3, 4].map((emptyKey) => (
                  <div key={`empty-${emptyKey}`} className="min-h-[100px] md:min-h-[160px] bg-transparent border-2 border-dashed border-gray-400"></div>
                ))}

              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}