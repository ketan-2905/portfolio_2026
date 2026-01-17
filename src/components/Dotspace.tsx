import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, FlaskConical, Download } from "lucide-react";
import Section from "./Section";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

// --- UTILS & DATA ---

function getYearProgress() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const isLeap = new Date(now.getFullYear(), 1, 29).getMonth() === 1;
  const totalDays = isLeap ? 366 : 365;

  const minutesToday = now.getHours() * 60 + now.getMinutes();
  const dayPercent = (minutesToday / 1440) * 100;

  return { dayOfYear, totalDays, dayPercent, minutesToday };
}

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Types for the Productivity System
 */
interface Task {
  id: number | string;
  title: string;
  start: number; // minutes from midnight (0 - 1440)
  end: number;
  desc?: string;
}

interface YearProgress {
  dayOfYear: number;
  totalDays: number;
  dayPercent: number; // progress within the current day (0-100)
  yearPercent: number;
}

// --- MATH & COORDINATES ---

const polarToCartesian = (cx: number, cy: number, r: number, deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
};

const describeArc = (
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M",
    x,
    y,
    "L",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    "Z",
  ].join(" ");
};

const format12h = (min: number) => {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 || 12;
  return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
};

// --- COMPONENTS ---

/**
 * DOT MATRIX COMPONENT
 * Replicates the Android 15-column grid with bottom-up filling and tooltips.
 */
const DotMatrix: React.FC<{
  progress: YearProgress;
  note?: string;
  showTooltip: boolean;
}> = ({ progress, note, showTooltip }) => {
  const { dayOfYear, totalDays, dayPercent, yearPercent } = progress;
  const currentIndex = dayOfYear - 1;

  return (
    <div className="relative p-10 bg-[#080808] rounded-[2rem] border border-white/5 flex flex-col items-center shadow-2xl">
      <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-2.5">
        {Array.from({ length: totalDays }).map((_, i) => {
          const isPast = i < currentIndex;
          const isCurrent = i === currentIndex;

          return (
            <div key={i} className="relative w-2.5 h-2.5">
              {/* Base Dot */}
              <div
                className={cn(
                  "absolute inset-0 rounded-full transition-colors duration-700",
                  isPast ? "bg-[#a3b625]/50" : "bg-[#1a1a1a]",
                )}
              />

              {/* Current Day Liquid Fill (Bottom-Up) */}
              {isCurrent && (
                <div className="absolute inset-0 rounded-full bg-[#1a1a1a] overflow-hidden rotate-180">
                  <motion.div
                    className="w-full bg-[#a3b625]"
                    initial={{ height: 0 }}
                    animate={{ height: `${dayPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              )}

              {/* Tooltip with Triangle Pointer (Kotlin: drawTooltip) */}
              <AnimatePresence>
                {isCurrent && showTooltip && note && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.9 }}
                    animate={{ opacity: 1, y: -48, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.9 }}
                    className="absolute z-50 left-1/2 -translate-x-1/2 bg-[#a3b625] text-black px-4 py-2 rounded-xl whitespace-nowrap shadow-[0_10px_40px_rgba(163,182,37,0.3)]"
                  >
                    <span className="text-[11px] font-black uppercase tracking-tight">
                      {note}
                    </span>
                    <div className="absolute top-[98%] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-[#a3b625]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-10 font-mono text-[10px] flex items-center gap-4 uppercase tracking-[0.25em] font-bold">
        <span className="text-red-500/90">{totalDays - dayOfYear}d LEFT</span>
        <span className="text-white/10 text-lg">•</span>
        <span className="text-gray-500">{yearPercent.toFixed(0)}%</span>
      </div>
    </div>
  );
};

const DayCircle: React.FC<{
  minutesToday: number;
  tasks: Task[];
  isShaking: boolean;
}> = ({ minutesToday, tasks, isShaking }) => {
  const radius = 78;
  const cx = 100;
  const cy = 100;

  const activeTask = useMemo(
    () =>
      tasks.find((t) => minutesToday >= t.start && minutesToday < t.end) ||
      tasks[0],
    [minutesToday, tasks],
  );

  const minToDeg = (min: number) => (min / 1440) * 360 - 90;

  return (
    /* 1. Main Container: Removed aspect-square, added h-full or h-screen */
    <div className="relative w-full h-full min-h-[500px] md:h-full bg-[#080808] rounded-[2rem] border border-white/5 flex flex-col items-center justify-between p-6 md:p-12 shadow-2xl overflow-hidden">
      {/* 2. SVG Wrapper: Flex-1 makes it take up available space */}
      <div className="relative w-full flex-1 flex items-center justify-center min-h-0">
        <div className="w-full max-w-[min(80vw,400px)] aspect-square">
          <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
            <circle cx={cx} cy={cy} r={radius} fill="#0d0d0d" />

            {tasks.map((task) => {
              const isCurrent = activeTask.id === task.id;
              const isPast = task.end <= minutesToday;
              const startAngle = minToDeg(task.start);
              const endAngle = minToDeg(task.end);
              const sweep = ((task.end - task.start) / 1440) * 360;
              const midAngle = startAngle + sweep / 2;

              const normalizedAngle = (midAngle + 90) % 360;
              const shouldFlip = normalizedAngle > 90 && normalizedAngle < 270;

              const color = isCurrent
                ? "#a3b625"
                : isPast
                  ? "rgba(163, 182, 37, 0.35)"
                  : "#1a1a1a";

              return (
                <g key={task.id} className="transition-all duration-1000">
                  <path
                    d={describeArc(
                      cx,
                      cy,
                      radius,
                      startAngle,
                      startAngle +
                        (isCurrent
                          ? ((minutesToday - task.start) / 1440) * 360
                          : sweep),
                    )}
                    fill={color}
                    className="transition-colors duration-700"
                  />

                  {(isCurrent || isShaking) && (
                    <g stroke="black" strokeWidth="0.6" strokeOpacity="0.4">
                      <line
                        x1={cx}
                        y1={cy}
                        x2={polarToCartesian(cx, cy, radius, startAngle).x}
                        y2={polarToCartesian(cx, cy, radius, startAngle).y}
                      />
                      <line
                        x1={cx}
                        y1={cy}
                        x2={polarToCartesian(cx, cy, radius, endAngle).x}
                        y2={polarToCartesian(cx, cy, radius, endAngle).y}
                      />
                    </g>
                  )}

                  {(isCurrent || isShaking) && task.end - task.start >= 15 && (
                    <g className="select-none pointer-events-none">
                      <text
                        x={shouldFlip ? -radius + 6 : radius - 6}
                        y={0}
                        fill="white"
                        fontSize="5"
                        fontWeight="900"
                        textAnchor={shouldFlip ? "start" : "end"}
                        dominantBaseline="middle"
                        className="font-sans uppercase tracking-widest"
                        transform={`translate(${cx}, ${cy}) rotate(${shouldFlip ? midAngle + 180 : midAngle})`}
                      >
                        {task.title}
                      </text>

                      {[
                        { angle: startAngle, time: task.start },
                        { angle: endAngle, time: task.end },
                      ].map((pt, idx) => {
                        const tNorm = (pt.angle + 90) % 360;
                        const tFlip = tNorm > 90 && tNorm < 270;
                        return (
                          <text
                            key={idx}
                            x={tFlip ? -radius - 10 : radius + 10}
                            y={0}
                            fill="#666"
                            fontSize="3.8"
                            fontWeight="600"
                            textAnchor={tFlip ? "end" : "start"}
                            dominantBaseline="middle"
                            className="font-mono"
                            transform={`translate(${cx}, ${cy}) rotate(${tFlip ? pt.angle + 180 : pt.angle})`}
                          >
                            {format12h(pt.time)}
                          </text>
                        );
                      })}
                    </g>
                  )}
                </g>
              );
            })}
            <circle cx={cx} cy={cy} r="14" fill="#080808" />
          </svg>
        </div>
      </div>

      {/* 3. Bottom Status: Now pushed to bottom by flex-col */}
      <div className="w-full pt-6 pb-2 text-center ">
        <h2 className="text-[#ffffff] text-2xl md:text-3xl font-black uppercase tracking-tighter leading-tight">
          {activeTask.title}
        </h2>

        <div className="flex items-center justify-center gap-3 mt-3">
          <span className="text-[#ffffff] text-base font-mono font-bold opacity-80">
            {format12h(activeTask.start)}
          </span>
          <div className="w-4 h-[1px] bg-white/20" />
          <span className="text-[#ffffff] text-base font-mono font-bold opacity-80">
            {format12h(activeTask.end)}
          </span>
        </div>
        <p className="text-white/60 text-sm md:text-base tracking-tight mt-2 max-w-xs mx-auto">
          {activeTask.desc}
        </p>
      </div>
    </div>
  );
};

// --- DATA & CONTAINER ---

const TASKS_DATA: Task[] = [
  {
    id: 1,
    title: "Deep Work",
    start: 540,
    end: 720,
    desc: "System Architecture & Core Logic",
  },
  { id: 2, title: "Break", start: 720, end: 780, desc: "System Cool-down" },
  {
    id: 3,
    title: "Development",
    start: 780,
    end: 1080,
    desc: "Implementing UI Components",
  },
  {
    id: 4,
    title: "Planning",
    start: 1080,
    end: 1140,
    desc: "Reviewing daily progress",
  },
  { id: 5, title: "Rest", start: 0, end: 540, desc: "Standby Mode" },
  {
    id: 6,
    title: "Free Time",
    start: 1140,
    end: 1440,
    desc: "Reviewing daily progress",
  },
];
// --- MAIN SECTION ---

export default function DotClockExperiment() {
  // --- STATE FOR TEMPORAL TRACKING ---
  const [now, setNow] = useState(new Date());

  // --- STATE FOR INDIVIDUAL HOVER TRIGGERS (Replaces global shaking) ---
  const [isDotHovered, setIsDotHovered] = useState(false);
  const [isCircleHovered, setIsCircleHovered] = useState(false);

  const triggerOnClick = (isDot: boolean, isDay: boolean) => {
    if (isDot) {
      setIsDotHovered(true);
      setTimeout(() => {
        setIsDotHovered(false);
      }, 3000);
    } else {
    }
    setIsCircleHovered(true);
    setTimeout(() => {
      setIsCircleHovered(false);
    }, 3000);
  };

  // Sync clock every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute progress logic exactly as before
  const progress = useMemo((): YearProgress => {
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const totalDays =
      new Date(now.getFullYear(), 1, 29).getMonth() === 1 ? 366 : 365;
    const minutesToday = now.getHours() * 60 + now.getMinutes();

    return {
      dayOfYear,
      totalDays,
      dayPercent: (minutesToday / 1440) * 100,
      yearPercent: (dayOfYear / totalDays) * 100,
    };
  }, [now]);

  return (
    <Section id="experiments" title="Experiment" icon={<FlaskConical />}>
      <div className="w-full space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-10 gap-6">
          <div className="space-y-2">
            <h3 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase">
              DotClock<span className="text-[#a3b625] italic">.apk</span>
            </h3>
            <p className="text-gray-500 max-w-xl text-sm leading-relaxed">
              An Android live wallpaper that visualizes time through a 365-day
              dot-matrix year view year dot and an interactive radial daily planner,
              dynamically reflecting user activity states and gesture-based
              interactions.
            </p>
          </div>
          <div className="flex gap-4">
            <a
              href="/download/Dotspace.apk"
              download="Dotspace.apk"
              type="application/vnd.android.package-archive" // Add this line
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#a3b625] text-black text-[10px] font-mono font-bold uppercase rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(163,182,37,0.2)]"
            >
              <Download size={14} /> DOWNLOAD APP
            </a>
          </div>
        </div>

        <h3 className="text-5xl md:text-4xl font-black text-white tracking-tighter uppercase text-center">
          <span className="hidden md:inline">Hover</span>{" "}
          <span className="md:hidden">Tap</span> is{" "}
          <span className="text-[#a3b625] italic">shake on</span> Android
        </h3>

        {/* Dashboard Grid */}
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Year Matrix Container with Local Hover */}
          <div
            onMouseEnter={() => setIsDotHovered(true)}
            onMouseLeave={() => setIsDotHovered(false)}
            className="cursor-crosshair"
            onClick={() => {
              triggerOnClick(true, false);
            }}
          >
            <h3 className="text-xl font-black text-white tracking-tighter uppercase text-center pb-2">
              Year Dot
            </h3>

            <DotMatrix
              progress={progress}
              note="BUILD CORE ENGINE"
              showTooltip={isDotHovered} // Triggered only when hovering this block
            />
          </div>

          {/* Day Circle Container with Local Hover */}
          <div
            onMouseEnter={() => setIsCircleHovered(true)}
            onMouseLeave={() => setIsCircleHovered(false)}
            className="cursor-crosshair"
            onClick={() => {
              triggerOnClick(false, true);
            }}
          >
            <h3 className="text-xl font-black text-white tracking-tighter uppercase text-center pb-2">
            Day Planner
              
            </h3>
            <DayCircle
              minutesToday={now.getHours() * 60 + now.getMinutes()}
              tasks={TASKS_DATA}
              isShaking={isCircleHovered} // Triggered only when hovering this block
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
