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

/* =========================
   TYPING LOGIC HOOK
========================= */
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

// --- LOADING SCREEN COMPONENT ---
function LoadingScreen({ onFinished }: { onFinished: () => void }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => (prev < 100 ? prev + 1 : 100));
    }, 20);
    const timeout = setTimeout(onFinished, 3500);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [onFinished]);

  return (
    <motion.div 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#020202] flex flex-col items-center justify-center font-mono"
    >
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="text-green-500 mb-4 tracking-tighter text-sm"
      >
        [ INITIALIZING_SYSTEM_CORE ]
      </motion.div>
      <div className="w-48 h-[2px] bg-white/10 relative overflow-hidden">
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: `${percent}%` }} 
          className="absolute h-full bg-green-500"
        />
      </div>
      <div className="mt-4 text-[10px] text-gray-500 uppercase tracking-[0.2em]">
        Status: {percent === 100 ? "Ready" : "Syncing GLB Assets..."}
      </div>
    </motion.div>
  );
}

// --- NAVIGATION BAR ---
function Navbar() {
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

  return (
    <nav className={cn(
      "fixed top-0 w-full z-[100] transition-all duration-300 border-b",
      scrolled ? "bg-[#050505]/90 backdrop-blur-xl border-white/10 py-3" : "bg-transparent border-transparent py-6"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="text-xl font-black tracking-tighter text-white">
          KETAN<span className="text-green-500 italic">.dev</span>
        </div>

        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-[11px] font-mono text-gray-400 hover:text-green-500 transition-colors uppercase tracking-[0.2em]">
              {link.name}
            </a>
          ))}
        </div>

        <button className="md:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            className="fixed inset-0 top-0 left-0 w-full h-screen bg-[#050505] z-[99] flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-3xl font-bold text-white uppercase tracking-tighter">
                {link.name}
              </a>
            ))}
            <button onClick={() => setIsOpen(false)} className="mt-8 text-green-500 border border-green-500/30 px-6 py-2 rounded-full font-mono text-sm">CLOSE_TERMINAL</button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// --- 3D COMPONENTS ---
function VintageComputers({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef<THREE.Group>(null);
  const textGroupRef = useRef<THREE.Group | null>(null);
  const { viewport } = useThree();
  const responsiveScale = viewport.width < 7 ? 0.75 : 1.3;

  // Typing effect content
  const typedText = useTypingText(
    ["HELLO USER", "SYSTEM ONLINE", "CORE READY"],
    70,
    1500
  );

  /* SCREEN ATTACHMENT LOGIC */
  useEffect(() => {
    const screenMesh = scene.getObjectByName("Object_207") as THREE.Mesh;
    if (!screenMesh) return;

    screenMesh.geometry.computeBoundingBox();
    const bbox = screenMesh.geometry.boundingBox;
    if (!bbox) return;

    const center = new THREE.Vector3();
    bbox.getCenter(center);
    const size = new THREE.Vector3();
    bbox.getSize(size);

    const textGroup = new THREE.Group();
    textGroup.position.copy(center);
    
    // Adjustments to fit "Object_207" specifically
    textGroup.position.x += -0.5; 
    textGroup.position.y += 0.3; 
    textGroup.position.z += size.z / 2 + 0.01;

    screenMesh.add(textGroup);
    textGroupRef.current = textGroup;

    return () => {
      screenMesh.remove(textGroup);
    };
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
        <pointLight position={[0, 1, 1]} distance={5} intensity={3} color="#00ff41" />
        <primitive object={scene} position={[0, -0.8, 0]}/>

        {/* TEXT RENDERED INTO SCREEN GROUP */}
        {textGroupRef.current && (
          <Text
            parent={textGroupRef.current}
            position={[0, 0, 0]}
            fontSize={0.15} 
            anchorX="left"
            anchorY="middle"
            // Ensure you have this font or use a default
            font="/fonts/VT323-Regular.ttf"
          >
            {typedText}
            <meshBasicMaterial 
              color="#ffffff" 
              side={THREE.DoubleSide} 
              depthTest={false} 
              transparent 
              opacity={0.9} 
            />
          </Text>
        )}
      </Float>
    </group>
  );
}

// --- MAIN PAGE ---
export default function SoftwarePortfolioPage() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  
  const clipScale = useTransform(scrollYProgress, [0, 0.15], [0, 150]);
  const smoothClipScale = useSpring(clipScale, { stiffness: 80, damping: 25 });
  const clipPathValue = useTransform(smoothClipScale, (v) => `circle(${v}% at 50% 50%)`);

  const handleScrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <main ref={containerRef} className="relative bg-[#020202] text-gray-200 selection:bg-green-500/40 font-sans min-h-[200vh]">
      <AnimatePresence>
        {isLoading && <LoadingScreen onFinished={() => setIsLoading(false)} />}
      </AnimatePresence>

      <Navbar />

      {/* HERO SECTION */}
      <div className="fixed inset-0 z-0 h-screen w-full overflow-hidden">
        <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: "high-performance" }} camera={{ position: [0, 0, 8], fov: 40 }}>
          <color attach="background" args={["#020202"]} />
          <fog attach="fog" args={["#020202", 5, 20]} />
          <Suspense fallback={null}>
            <Environment preset="city" />
            <ambientLight intensity={0.2} />
            <SpotLight position={[-5, 5, 5]} angle={0.3} penumbra={1} intensity={2} castShadow color="#ffffff" />
            <VintageComputers modelPath="/old_computers.glb" />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
              <planeGeometry args={[50, 50]} />
              <MeshReflectorMaterial blur={[300, 100]} resolution={512} mixBlur={1} mixStrength={80} roughness={0.8} depthScale={1.2} minDepthThreshold={0.4} maxDepthThreshold={1.4} color="#050505" metalness={0.5} mirror={0.75} />
            </mesh>
          </Suspense>
        </Canvas>
        
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex gap-2 mb-4">
            {["S","Y","S","T","E","M"].map((l, i) => (
              <span key={i} className="text-[10px] font-mono text-green-500/50 tracking-[0.5em]">{l}</span>
            ))}
          </motion.div>
          
          <h1 className="flex overflow-hidden text-7xl md:text-9xl font-black text-white mix-blend-difference tracking-tighter">
            {"KETAN".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ y: 200 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.6 + (i * 0.1), type: "spring", stiffness: 100 }}
              >
                {char}
              </motion.span>
            ))}
          </h1>

          <motion.button 
            onClick={handleScrollDown}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute md:bottom-10 bottom-20 pointer-events-auto flex flex-col items-center gap-2 group cursor-pointer"
          >
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest group-hover:text-green-500 transition-colors">Launch_Core</span>
            <div className="p-3 border border-white/10 rounded-full group-hover:border-green-500 transition-all">
              <ArrowDown className="text-green-500" size={20} />
            </div>
          </motion.button>
        </div>
      </div>

      {/* CONTENT REVEAL */}
      <motion.div
        style={{ clipPath: clipPathValue, WebkitClipPath: clipPathValue, willChange: "clip-path" }}
        className="relative z-20 w-full bg-[#080808] transform-gpu"
      >
        <div className="h-screen w-full pointer-events-none" />
        {/* Rest of your content components (Section, SkillCard, ProjectCard, etc) stay the same... */}
        <div className="max-w-6xl mx-auto px-6 pb-40">
           {/* Your existing sections here */}
           <Section id="about">
             <div className="grid md:grid-cols-2 gap-16 items-center">
               <div>
                 <div className="inline-block px-3 py-1 border border-green-500/20 bg-green-500/5 text-green-500 text-[10px] font-mono mb-4">SYSTEM_BIO_READY</div>
                 <h3 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tight">Software Engineer & <br/><span className="text-gray-500 italic">Creative Technologist.</span></h3>
                 <p className="text-gray-400 text-lg leading-relaxed font-light">
                   B.Tech in <span className="text-white border-b border-green-500/30">CSE (Data Science)</span>. I specialize in building complex systems where 
                   robust performance meets immersive user experience.
                 </p>
               </div>
               <div className="flex justify-center relative">
                 <div className="absolute inset-0 bg-green-500/5 blur-[100px] rounded-full" />
                 <div className="w-56 h-56 md:w-80 md:h-80 relative flex items-center justify-center border border-white/5 rounded-3xl backdrop-blur-3xl">
                   <Cpu size={80} className="text-green-500 animate-pulse" />
                   <div className="absolute -top-4 -right-4 bg-green-500 text-black px-2 py-1 text-[10px] font-bold rounded">LIVE_CORE</div>
                 </div>
               </div>
             </div>
           </Section>

           <Section id="skills" title="Technical Arsenal" icon={<Zap />}>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
               <SkillCard category="Core_Logic" icon={<Code2 className="text-blue-400" />} skills={["TypeScript", "JavaScript", "Python", "SQL"]} status="98%" />
               <SkillCard category="Visual_Sys" icon={<Layers className="text-purple-400" />} skills={["React", "Next.js", "Three.js", "Motion"]} status="95%" />
               <SkillCard category="Ops_Infrastructure" icon={<Database className="text-orange-400" />} skills={["Node.js", "FastAPI", "Docker", "Postgres"]} status="90%" />
             </div>
           </Section>
        </div>
      </motion.div>
    </main>
  );
}

// Keep your sub-components as they were
function SkillCard({ category, icon, skills, status }: { category: string, icon: React.ReactNode, skills: string[], status: string }) {
  return (
    <div className="bg-[#121212] border border-white/[0.03] p-8 rounded-[1.5rem] relative overflow-hidden group hover:border-green-500/20 transition-all duration-500">
      <div className="flex justify-between items-center mb-8">
        <div className="p-3 bg-white/[0.02] rounded-2xl text-green-500">{icon}</div>
        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{status}</div>
      </div>
      <h3 className="text-gray-500 font-mono text-[11px] mb-4 uppercase tracking-[0.2em]">{category}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map(s => <span key={s} className="text-xs text-white font-medium px-3 py-1 bg-white/[0.03] rounded-full border border-white/[0.05]">{s}</span>)}
      </div>
    </div>
  );
}

function Section({ children, title, icon, id }: { children: React.ReactNode, title?: string, icon?: React.ReactNode, id?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.section id={id} ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1 }} className="py-24 scroll-mt-20">
      {title && <h2 className="text-sm font-mono text-green-500 mb-12 flex items-center gap-3 uppercase tracking-[0.4em]"><span className="w-8 h-[1px] bg-green-500/30" />{title}</h2>}
      {children}
    </motion.section>
  );
}