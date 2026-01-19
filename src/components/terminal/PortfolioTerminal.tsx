import React, { useState, useEffect, useRef, type JSX } from "react";

import { createPortal } from "react-dom";

import { X, Folder, FileText, Terminal, Code2, ExternalLink } from "lucide-react";

import { motion } from "framer-motion";


// --- Types & Rich Data Structures ---

type FileContent = string | JSX.Element;

interface FolderStructure {
  [key: string]: FileContent | FolderStructure;
}

// NOTE: files that represent interactive external links use a special string format:
// "LINK::Title||https://example.com||Short description"
// This keeps FILESYSTEM a static value while allowing the component to render interactive viewers.

const FILESYSTEM: FolderStructure = {
  "about.txt": (
    <div className="border-l-2 border-blue-900 pl-4 py-1 italic">
      "Software Engineer & Creative Technologist. I specialize in building complex systems where performance meets immersive UX."
    </div>
  ),
  "achievements.txt": `- Won "Best Interaction" at HackFest 2024\n- Speaker at React India 2025\n- Patent filed for a realtime UI composition engine`,
  "skills": {
    "core_logic.sys": (
      <div className="max-w-xs">
        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span>TypeScript</span>
            <span>98%</span>
          </div>
          <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: "98%" }} className="h-full bg-blue-900" />
          </div>
        </div>

        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span>Python</span>
            <span>90%</span>
          </div>
          <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: "90%" }} className="h-full bg-blue-900" />
          </div>
        </div>

        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span>System Design</span>
            <span>85%</span>
          </div>
          <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} className="h-full bg-blue-900" />
          </div>
        </div>
      </div>
    ),
    "visual_sys.lib": "React, Next.js, Three.js, Framer Motion (95%)",
  },
  "projects": {
    "3d_retro.md": (
      <div className="bg-black/5 p-3 rounded border border-black/10">
        <h3 className="font-bold flex items-center gap-2"><Code2 size={16}/> 3D Retro Portfolio</h3>
        <p className="text-sm my-2 text-black/70">Highly interactive 3D portfolio using R3F.</p>
        <button className="text-xs flex items-center gap-1 text-blue-900 hover:underline">
          <ExternalLink size={12}/> View Live
        </button>
      </div>
    ),
  },
  // "work" contains items that are interactive links. They are represented as strings starting with LINK::
  "work": {
    "interactive-showcase.link": "LINK::Interactive Showcase||https://example.com/showcase||A high-performance 3D experience that demonstrates advanced rendering techniques.",
    "ecommerce-redesign.link": "LINK::E‑commerce Redesign||https://example.com/shop||A conversion-focused redesign built with Next.js and server components.",
    "experimental-ui.link": "LINK::Experimental UI Lab||https://example.com/lab||Micro-interactions and motion research projects.",
  },
  "experience": {
    "2024_lead_frontend.txt": `Lead Frontend Engineer @ Acme Labs\n- Built realtime collaboration features\n- Mentored 4 engineers`,
    "2022_senior_dev.txt": `Senior Engineer @ PixelWave\n- Shipping high-performance client apps\n- Owned component library`,
  },
  "resume.pdf": "Triggering Download Sequence...",
};


interface TerminalLine {
  id: string;
  type: "command" | "output" | "system" | "error";
  content: FileContent;
  path?: string;
}


const PortfolioTerminal = ({ origin, onCancel }: { origin: { x: number; y: number }; onCancel: () => void }) => {
  const [isBooting, setIsBooting] = useState(true);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  // Viewer state for when a link is "opened" (tap/click navigates here)
  const [viewerContent, setViewerContent] = useState<FileContent | null>(null);
  const viewerCloseRef = useRef<HTMLButtonElement | null>(null);

  // History & Autocomplete State
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getDir = (path: string[]) => {
    let dir: any = FILESYSTEM;
    for (const segment of path) dir = dir[segment];
    return dir;
  };

  useEffect(() => {
    let timeoutIds: ReturnType<typeof setTimeout>[] = [];
    ["INITIALIZING...", "MOUNTING FS...", "READY."].forEach((text, i) => {
      timeoutIds.push(setTimeout(() => {
        setHistory(prev => [...prev, { id: `b-${i}`, type: "system", content: text }] as TerminalLine[]);
        if (i === 2) setIsBooting(false);
      }, i * 300));
    });
    return () => timeoutIds.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [history, input, viewerContent]);

  useEffect(() => {
    // Focus management: when viewer opens, focus its close button for keyboard users.
    if (viewerContent) viewerCloseRef.current?.focus();
  }, [viewerContent]);

  // --- Accessibility helpers ---
  const announce = (text: string) => {
    setHistory(prev => [...prev, { id: `a-${Date.now()}`, type: "system", content: <span aria-hidden>{text}</span> }]);
  };

  // --- Link viewer (opens when user taps a link) ---
  const handleOpenLink = (raw: string) => {
    // raw format: LINK::Title||URL||Desc
    const payload = raw.replace(/^LINK::/, "").split("||");
    const [title = "Untitled", url = "", desc = ""] = payload;

    const content = (
      <div role="document" aria-label={`Viewer: ${title}`} className="p-4 border rounded max-w-2xl bg-white/90 font-cascadia-mono">
        <div className="flex justify-between items-start gap-3">
          <div>
            <h2 className="font-bold text-lg">{title}</h2>
            <p className="text-sm my-2 text-black/70">{desc}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => window.open(url, "_blank")}
                className="px-3 py-1 text-sm rounded shadow-sm hover:underline"
                aria-label={`Open ${title} in new tab`}
              >
                Visit ↗
              </button>
              <button
                ref={viewerCloseRef}
                onClick={() => setViewerContent(null)}
                className="px-3 py-1 text-sm rounded shadow-sm"
                aria-label="Close viewer and return to terminal"
              >
                Back
              </button>
            </div>
          </div>

        </div>
      </div>
    );

    // push viewer as a 'system' output so it appears in the terminal flow
    setHistory(prev => [...prev, { id: `v-${Date.now()}`, type: "output", content: content }]);
    setViewerContent(content);
    announce(`Opened ${title}`);
  };

  // --- Keyboard Handlers ---
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentDirObj = getDir(currentPath);
    const items = Object.keys(currentDirObj || {});

    // 1. Tab Autocomplete
    if (e.key === "Tab") {
      e.preventDefault();
      const parts = input.split(" ");
      const lastPart = parts[parts.length - 1];
      const match = items.find(item => item.startsWith(lastPart));
      if (match) {
        parts[parts.length - 1] = match;
        setInput(parts.join(" "));
      }
    }

    // 2. Up/Down History
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyPointer < cmdHistory.length - 1) {
        const newPointer = historyPointer + 1;
        setHistoryPointer(newPointer);
        setInput(cmdHistory[cmdHistory.length - 1 - newPointer]);
      }
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyPointer > 0) {
        const newPointer = historyPointer - 1;
        setHistoryPointer(newPointer);
        setInput(cmdHistory[cmdHistory.length - 1 - newPointer]);
      } else {
        setHistoryPointer(-1);
        setInput("");
      }
    }
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = input.trim();
    if (!cleanInput) return;

    setCmdHistory(prev => [...prev, cleanInput]);
    setHistoryPointer(-1);

    const [cmd, ...args] = cleanInput.split(" ");
    const lower = cmd.toLowerCase();
    const arg = args.join(" ");
    const currentDirObj = getDir(currentPath) || {};

    let response: FileContent = "";
    let resType: TerminalLine["type"] = "output";

    switch (lower) {
      case "help":
        response = (
          <div>
            <div className="font-bold">Available commands</div>
            <ul>
              <li><strong>ls</strong> — list files</li>
              <li><strong>cd &lt;folder&gt;</strong> — change directory (use .. to go up)</li>
              <li><strong>cat &lt;file&gt;</strong> — show file</li>
              <li><strong>open &lt;file&gt;</strong> — open link files in viewer</li>
              <li><strong>resume</strong> — open resume</li>
              <li><strong>clear</strong> — clear screen</li>
              <li><strong>exit</strong> — close terminal</li>
            </ul>
          </div>
        );
        break;
      case "ls":
        response = (
          <ul role="list" className="grid grid-cols-2 gap-x-8 gap-y-1 max-w-sm list-none p-0 m-0">
            {Object.keys(currentDirObj).map(item => (
              <li key={item} className="flex items-center gap-2" role="listitem">
                {typeof currentDirObj[item] === 'object' ? <Folder size={12} className="text-blue-800"/> : <FileText size={12}/>} 
                <button
                  onClick={() => {
                    // clicking a filename will try to 'cat' it
                    setInput(`cat ${item}`);
                    // auto-run the command for convenience
                    setTimeout(() => {
                      const fakeEvent = { preventDefault: () => {} } as unknown as React.FormEvent;
                      handleCommand(fakeEvent);
                    }, 80);
                  }}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter' || ev.key === ' ') {
                      ev.preventDefault();
                      setInput(`cat ${item}`);
                      setTimeout(() => {
                        const fakeEvent = { preventDefault: () => {} } as unknown as React.FormEvent;
                        handleCommand(fakeEvent);
                      }, 80);
                    }
                  }}
                  className={typeof currentDirObj[item] === 'object' ? "font-bold text-left" : "text-left"}
                  aria-label={`Open ${item}`}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        );
        break;
      case "cd":
        if (!arg || arg === "..") setCurrentPath(prev => prev.slice(0, -1));
        else if (currentDirObj[arg] && typeof currentDirObj[arg] === "object") setCurrentPath(prev => [...prev, arg]);
        else { response = `Err: ${arg} not a folder`; resType = "error"; }
        break;
      case "cat":
        if (currentDirObj[arg]) {
          const file = currentDirObj[arg];
          if (typeof file === 'string' && file.startsWith('LINK::')) {
            // render a clickable summary and also allow opening
            const parts = file.replace(/^LINK::/, "").split('||');
            const [title = '', url = '', desc = ''] = parts;
            response = (
              <div>
                <div className="font-bold">{title}</div>
                <p className="text-sm my-1 text-black/70">{desc}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleOpenLink(file)} className="px-2 py-1 text-sm rounded" aria-label={`Open ${title}`}>
                    Open
                  </button>
                  <button onClick={() => window.open(url, '_blank')} className="px-2 py-1 text-sm rounded" aria-label={`Visit ${title} in new tab`}>
                    Visit ↗
                  </button>
                </div>
              </div>
            );
          } else {
            response = file as FileContent;
          }
        } else { response = `Err: File ${arg} not found`; resType = "error"; }
        break;
      case "open":
        if (currentDirObj[arg] && typeof currentDirObj[arg] === 'string' && (currentDirObj[arg] as string).startsWith('LINK::')) {
          handleOpenLink(currentDirObj[arg] as string);
          // avoid adding extra response below
          setInput("");
          setHistory(prev => [...prev, { id: Date.now().toString(), type: "command", content: cleanInput, path: currentPath.join("\\") }]);
          return;
        } else {
          response = `Err: Link ${arg} not found or not a link file`;
          resType = 'error';
        }
        break;
      case "resume":
        window.open("/resume.pdf", "_blank");
        response = "Downloading...";
        break;
      case "clear":
        setHistory([]); setInput(""); return;
      case "exit":
        onCancel(); return;
      default:
        response = `Command '${cmd}' not found.`; resType = "error";
    }

    setHistory(prev => [
      ...prev,
      { id: Date.now().toString(), type: "command", content: cleanInput, path: currentPath.join("\\") },
      { id: (Date.now() + 1).toString(), type: resType, content: response }
    ]);

    setInput("");
  };

  const fullPath = `C:\\Users\\Ketan${currentPath.length > 0 ? "\\" + currentPath.join("\\") : ""}`;

  return createPortal(
    <motion.div
      initial={{ clipPath: `circle(0% at ${origin.x}px ${origin.y}px)` }}
      animate={{ clipPath: `circle(150% at ${origin.x}px ${origin.y}px)` }}
      exit={{ clipPath: `circle(0% at ${origin.x}px ${origin.y}px)` }}
      transition={{ duration: 0.6 }}
      onClick={() => inputRef.current?.focus()}
      className="fixed inset-0 z-10000 bg-[#73CBB6] text-black font-mono flex flex-col overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio terminal"
    >
      <div className="flex justify-between items-center p-3 border-b border-black/10">
        <div className="flex items-center gap-2 opacity-60 text-xs font-bold">
          <Terminal size={14} /> <span>PORTFOLIO_OS // {fullPath}</span>
        </div>
        <button onClick={onCancel} className="p-1 hover:bg-black/10 rounded-full" aria-label="Close terminal"><X size={18} /></button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4" role="log" aria-live="polite">

        {history.map((line) => (
          <div key={line.id}>
            {line.type === "command" ? (
              <div className="flex gap-2 opacity-50"><span className="font-bold">PS&gt;</span>{line.content}</div>
            ) : (
              <div className={line.type === 'error' ? 'text-red-700' : ''}>{line.content}</div>
            )}
          </div>
        ))}

        {viewerContent && (
          <div className="mt-2" aria-live="polite">
            {viewerContent}
          </div>
        )}

        {!isBooting && (
          <form onSubmit={handleCommand} className="flex gap-2" aria-label="Terminal command form">
            <span className="font-bold whitespace-nowrap opacity-50">{fullPath}&gt;</span>
            <div className="relative flex-1">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                aria-label="Terminal command input"
                className="absolute inset-0 w-full bg-transparent outline-none caret-auto z-10"
              />
              <div className="flex items-center pointer-events-none">
                <span className="whitespace-pre">{input}</span>
                <div className="w-2 h-4 bg-black animate-terminal-blink ml-1" />
              </div>
            </div>
          </form>
        )}

      </div>

    </motion.div>,
    document.body
  );
};


export default PortfolioTerminal;
