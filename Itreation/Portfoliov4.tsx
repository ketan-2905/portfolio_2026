import React, { Suspense, useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Float, Text, MeshReflectorMaterial, SpotLight } from "@react-three/drei";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import { Terminal, Cpu, Database, Code2, Boxes, Github, Linkedin, Mail, ArrowDown, Menu, X, Layers, Zap } from "lucide-react";
import * as THREE from "three";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ==========================================================
   1. IMPROVED TERMINAL COMPONENT (Scrolling & Static Support)
========================================================== */
function TerminalText({ messages, speed = 40, pause = 3000, mode = "type", ...props }: any) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);

  // Split lines if provided as a single string with \n, or use as array
  const lines = useMemo(() => {
    return Array.isArray(messages) ? messages : messages.split("\n");
  }, [messages]);

  useEffect(() => {
    if (mode === "static") {
      setDisplayedLines(lines);
      return;
    }

    // Typing Logic
    if (currentLineIdx < lines.length) {
      const currentLineText = lines[currentLineIdx];

      if (currentCharIdx < currentLineText.length) {
        const timeout = setTimeout(() => {
          setDisplayedLines((prev) => {
            const newLines = [...prev];
            if (!newLines[currentLineIdx]) newLines[currentLineIdx] = "";
            newLines[currentLineIdx] = currentLineText.slice(0, currentCharIdx + 1);
            return newLines;
          });
          setCurrentCharIdx(currentCharIdx + 1);
        }, speed);
        return () => clearTimeout(timeout);
      } else {
        // Move to next line
        const timeout = setTimeout(() => {
          setCurrentLineIdx(currentLineIdx + 1);
          setCurrentCharIdx(0);
        }, speed * 2);
        return () => clearTimeout(timeout);
      }
    } else {
      // Reset cycle after pause
      const timeout = setTimeout(() => {
        setDisplayedLines([]);
        setCurrentLineIdx(0);
        setCurrentCharIdx(0);
      }, pause);
      return () => clearTimeout(timeout);
    }
  }, [currentCharIdx, currentLineIdx, lines, speed, pause, mode]);

  return (
    <Text 
      {...props} 
      lineHeight={1.1}
      textAlign="left"
      anchorY="top" // Keeps text "pinned" to top so new lines grow downward
    >
      {displayedLines.join("\n")}
      <meshBasicMaterial 
        color="#ffffff" 
        transparent 
        opacity={0.9} 
        depthTest={false} 
        side={THREE.DoubleSide} 
      />
    </Text>
  );
}

/* ==========================================================
   2. SCREEN CONFIGURATION
========================================================== */
const SCREEN_CONFIGS = [
  { 
    id: "Object_207", 
    messages: ["SYSTEM_V4.02", "BOOT: SUCCESS", "USER: KETAN", "> STATUS: READY"], 
    mode: "type", // Animated
    x: -0.5, y: 0.35, size: 0.09 
  },
  { 
    id: "Object_216", 
    messages: ["NEXT_JS\nPORT: 3000"], 
    mode: "static", // Always visible
    x: -0.5, y: 0.3, size: 0.11 
  },
  { 
    id: "Object_219", 
    messages: ["3D_CORE", "GLSL: ON", "R3F: ACTIVE"], 
    mode: "type",
    x: -0.5, y: 0.3, size: 0.1 
  },
  { 
    id: "Object_213", 
    messages: ["Hi!", "I build", "cool stuff."], 
    mode: "type",
    x: -0.5, y: 0.25, size: 0.22 
  },
  { 
    id: "Object_210", 
    messages: ["SQL_LINK\nACTIVE"], 
    mode: "static",
    x: -0.5, y: 0.3, size: 0.12 
  },
];

/* ==========================================================
   3. 3D COMPONENTS
========================================================== */
function VintageComputers({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef<THREE.Group>(null);
  const textGroupsRef = useRef<Map<string, THREE.Group>>(new Map());
  const [loaded, setLoaded] = useState(false);
  
  const { viewport } = useThree();
  const responsiveScale = viewport.width < 7 ? 0.75 : 1.3;

  useEffect(() => {
    SCREEN_CONFIGS.forEach((config) => {
      const mesh = scene.getObjectByName(config.id) as THREE.Mesh;
      if (!mesh) return;

      mesh.geometry.computeBoundingBox();
      const bbox = mesh.geometry.boundingBox;
      if (!bbox) return;

      const center = new THREE.Vector3();
      bbox.getCenter(center);
      const size = new THREE.Vector3();
      bbox.getSize(size);

      const tGroup = new THREE.Group();
      tGroup.position.copy(center);
      
      // Offset applied to group
      tGroup.position.x += config.x; 
      tGroup.position.y += config.y; 
      tGroup.position.z += size.z / 2 + 0.01; 

      mesh.add(tGroup);
      textGroupsRef.current.set(config.id, tGroup);
    });
    setLoaded(true);
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, (state.mouse.x * Math.PI) / 10 + Math.sin(t / 4) / 10, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, THREE.MathUtils.clamp((state.mouse.y * Math.PI) / 20, -0.05, 0.5), 0.05);
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]} scale={responsiveScale}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <pointLight position={[0, 1, 1]} distance={5} intensity={4} color="#00ff41" />
        <primitive object={scene} position={[0, -0.8, 0]}/>

        {loaded && SCREEN_CONFIGS.map((config) => {
          const parent = textGroupsRef.current.get(config.id);
          if (!parent) return null;

          return (
            <TerminalText
              key={config.id}
              parent={parent}
              messages={config.messages}
              mode={config.mode}
              fontSize={config.size}
              anchorX="left"
              font="/fonts/VT323-Regular.ttf" 
            />
          );
        })}
      </Float>
    </group>
  );
}

/* ==========================================================
   4. UI COMPONENTS (Unchanged Layout)
========================================================== */
function LoadingScreen({ onFinished }: { onFinished: () => void }) {
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setPercent(p => p < 100 ? p + 1 : 100), 20);
    const timeout = setTimeout(onFinished, 3500);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [onFinished]);

  return (
    <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-[#020202] flex flex-col items-center justify-center font-mono">
      <div className="text-green-500 mb-4 text-sm">[ INITIALIZING_SYSTEM_CORE ]</div>
      <div className="w-48 h-[2px] bg-white/10 relative overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} className="absolute h-full bg-green-500" />
      </div>
    </motion.div>
  );
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn("fixed top-0 w-full z-[100] transition-all border-b", scrolled ? "bg-[#050505]/90 backdrop-blur-xl border-white/10 py-3" : "bg-transparent border-transparent py-6")}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="text-xl font-black text-white">KETAN<span className="text-green-500 italic">.dev</span></div>
        <div className="hidden md:flex gap-8 items-center">
          {["About", "Skills", "Projects", "Contact"].map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-[11px] font-mono text-gray-400 hover:text-green-500 uppercase tracking-widest">{link}</a>
          ))}
        </div>
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
    </nav>
  );
}

export default function PortfolioV4() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  
  const clipScale = useTransform(scrollYProgress, [0, 0.15], [0, 150]);
  const smoothClipScale = useSpring(clipScale, { stiffness: 80, damping: 25 });
  const clipPathValue = useTransform(smoothClipScale, (v) => `circle(${v}% at 50% 50%)`);

  return (
    <main ref={containerRef} className="relative bg-[#020202] text-gray-200 font-sans min-h-[200vh]">
      <AnimatePresence>{isLoading && <LoadingScreen onFinished={() => setIsLoading(false)} />}</AnimatePresence>
      <Navbar />

      <div className="fixed inset-0 z-0 h-screen w-full">
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 40 }}>
          <color attach="background" args={["#020202"]} />
          <fog attach="fog" args={["#020202", 5, 20]} />
          <Suspense fallback={null}>
            <Environment preset="city" />
            <ambientLight intensity={0.2} />
            <SpotLight position={[-5, 5, 5]} angle={0.3} penumbra={1} intensity={2} color="#ffffff" />
            <VintageComputers modelPath="/old_computers.glb" />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
              <planeGeometry args={[50, 50]} />
              <MeshReflectorMaterial blur={[300, 100]} resolution={512} mixBlur={1} mixStrength={80} roughness={0.8} color="#050505" metalness={0.5} />
            </mesh>
          </Suspense>
        </Canvas>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
          <h1 className="text-7xl md:text-9xl font-black text-white mix-blend-difference tracking-tighter">KETAN</h1>
          <div className="text-green-500 font-mono text-xs tracking-[0.5em] mt-4">CORE_SYSTEM_ACTIVE</div>
        </div>
      </div>

      <motion.div style={{ clipPath: clipPathValue }} className="relative z-20 w-full bg-[#080808]">
        <div className="h-screen w-full pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 pb-40">
          <Section id="about">
            <h3 className="text-4xl md:text-6xl font-bold mb-8 text-white">Software Engineer & <br/><span className="text-gray-500 italic">Creative Technologist.</span></h3>
            <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">B.Tech in CSE (Data Science). Specialized in building complex systems where robust performance meets immersive UX.</p>
          </Section>
          <Section id="skills" title="Technical Arsenal">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SkillCard category="Core_Logic" skills={["TypeScript", "Python", "SQL"]} />
              <SkillCard category="Visual_Sys" skills={["React", "Next.js", "Three.js"]} />
              <SkillCard category="Infrastructure" skills={["FastAPI", "Docker", "Node.js"]} />
            </div>
          </Section>
        </div>
      </motion.div>
    </main>
  );
}

/* SUB-COMPONENTS */
function SkillCard({ category, skills }: any) {
  return (
    <div className="bg-[#121212] border border-white/5 p-8 rounded-3xl hover:border-green-500/50 transition-all">
      <h3 className="text-gray-500 font-mono text-[10px] mb-4 uppercase tracking-widest">{category}</h3>
      <div className="flex flex-wrap gap-2">{skills.map((s: any) => <span key={s} className="text-xs text-white px-3 py-1 bg-white/5 rounded-full">{s}</span>)}</div>
    </div>
  );
}

function Section({ children, title, id }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.section id={id} ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="py-24">
      {title && <h2 className="text-green-500 font-mono text-xs mb-12 tracking-[0.3em] uppercase">{title}</h2>}
      {children}
    </motion.section>
  );
}