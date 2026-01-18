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
   1. TYPING LOGIC HOOK
========================================================== */
function useTypingText(messages: string[], speed = 70, pause = 1500) {
  const [text, setText] = useState("");
  const [msgIndex, setMsgIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const current = messages[msgIndex];
    if (charIndex < current.length) {
      const t = setTimeout(() => {
        setText(current.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      }, speed);
      return () => clearTimeout(t);
    }
    const pauseTimer = setTimeout(() => {
      setCharIndex(0);
      setText("");
      setMsgIndex((i) => (i + 1) % messages.length);
    }, pause);
    return () => clearTimeout(pauseTimer);
  }, [charIndex, msgIndex, messages, speed, pause]);

  return text;
}

/* ==========================================================
   2. SCREEN CONFIGURATION (Adjust X, Y, Size here)
========================================================== */
const SCREEN_CONFIGS = [
  { id: "Object_207", msg: "MAIN_CORE",    x: -0.5, y: 0.3,  size: 0.12, isMain: true },
  { id: "Object_216", msg: "NEXT_JS",     x: -0.5, y: 0.3,  size: 0.12, isMain: false },
  { id: "Object_219", msg: "REACT_3F",    x: -0.5, y: 0.3,  size: 0.12, isMain: false },
  { id: "Object_213", msg: "Hi!",   x: -0.5, y: 0.22,  size: 0.5, isMain: false },
  { id: "Object_210", msg: "POSTGRES",    x: -0.5, y: 0.3,  size: 0.12, isMain: false },
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

  // Typing effect for the primary large screen
  const mainTypedText = useTypingText(["WELCOME USER", "KETAN.DEV", "SYSTEM ONLINE"], 70, 2000);

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
      
      // POSITIONING VARIABLES (Adjust in SCREEN_CONFIGS above)
      tGroup.position.x += config.x; 
      tGroup.position.y += config.y; 
      tGroup.position.z += size.z / 2 + 0.01; // Tiny offset to prevent flickering

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
            <Text
              key={config.id}
              parent={parent}
              fontSize={config.size}
              anchorX="left"
              anchorY="middle"
              font="/fonts/VT323-Regular.ttf" // Ensure this exists in public/fonts/
            >
              {config.isMain ? mainTypedText : config.msg}
              <meshBasicMaterial 
                color="#ffffff" 
                transparent 
                opacity={0.9} 
                depthTest={false} 
                side={THREE.DoubleSide} 
              />
            </Text>
          );
        })}
      </Float>
    </group>
  );
}

/* ==========================================================
   4. UI SUB-COMPONENTS
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

/* ==========================================================
   5. MAIN PAGE
========================================================== */
export default function PortfolioV3() {
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

      {/* HERO / CANVAS SECTION */}
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

      {/* SCROLL CONTENT */}
      <motion.div style={{ clipPath: clipPathValue }} className="relative z-20 w-full bg-[#080808]">
        <div className="h-screen w-full pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 pb-40">
          
          <Section id="about">
            <h3 className="text-4xl md:text-6xl font-bold mb-8 text-white">Software Engineer & <br/><span className="text-gray-500 italic">Creative Technologist.</span></h3>
            <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">B.Tech in CSE (Data Science). Specialized in building complex systems where robust performance meets immersive UX.</p>
          </Section>

          <Section id="skills" title="Technical Arsenal" icon={<Zap />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SkillCard category="Core_Logic" skills={["TypeScript", "Python", "SQL"]} />
              <SkillCard category="Visual_Sys" skills={["React", "Next.js", "Three.js"]} />
              <SkillCard category="Infrastructure" skills={["FastAPI", "Docker", "Node.js"]} />
            </div>
          </Section>

          <Section id="contact">
            <div className="bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-12 text-center">
              <h2 className="text-5xl font-bold text-white mb-6">Initialize Connection</h2>
              <div className="flex flex-wrap justify-center gap-4">
                <ContactBtn icon={<Mail />} label="Email" href="mailto:ketangaikwad2905@gmail.com" />
                <ContactBtn icon={<Github />} label="GitHub" href="#" />
              </div>
            </div>
          </Section>

        </div>
      </motion.div>
    </main>
  );
}

/* HELPER COMPONENTS */
function SkillCard({ category, skills }: { category: string, skills: string[] }) {
  return (
    <div className="bg-[#121212] border border-white/5 p-8 rounded-3xl hover:border-green-500/50 transition-all">
      <h3 className="text-gray-500 font-mono text-[10px] mb-4 uppercase tracking-widest">{category}</h3>
      <div className="flex flex-wrap gap-2">{skills.map(s => <span key={s} className="text-xs text-white px-3 py-1 bg-white/5 rounded-full">{s}</span>)}</div>
    </div>
  );
}

function Section({ children, title, id, icon }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.section id={id} ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="py-24">
      {title && <h2 className="text-green-500 font-mono text-xs mb-12 tracking-[0.3em] uppercase">{title}</h2>}
      {children}
    </motion.section>
  );
}

function ContactBtn({ icon, label, href }: any) {
  return (
    <a href={href} className="flex items-center gap-3 px-6 py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-green-500 hover:text-black transition-all font-mono text-xs uppercase">
      {icon} {label}
    </a>
  );
}