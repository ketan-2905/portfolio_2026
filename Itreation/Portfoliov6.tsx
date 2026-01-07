import React, { Suspense, useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  Float,
  Text,
  MeshReflectorMaterial,
  SpotLight,
} from "@react-three/drei";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  Terminal,
  Cpu,
  Database,
  Code2,
  Boxes,
  Github,
  Linkedin,
  Mail,
  ArrowDown,
  Menu,
  X,
  Layers,
  Zap,
} from "lucide-react";
import * as THREE from "three";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ==========================================================
   1. TERMINAL TEXT COMPONENT (From Code B)
========================================================== */
function TerminalText({
  messages,
  speed = 40,
  pause = 3000,
  mode = "type",
  repeat = true,
  ...props
}: any) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const lines = useMemo(
    () => (Array.isArray(messages) ? messages : messages.split("\n")),
    [messages]
  );

  // Sync with the 3.5s main loader
  useEffect(() => {
    const startTimer = setTimeout(() => setIsReady(true), 3500);
    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (mode === "static") {
      setDisplayedLines(lines);
      return;
    }
    if (isFinished) return;

    if (currentLineIdx < lines.length) {
      const currentLineText = lines[currentLineIdx];
      if (currentCharIdx < currentLineText.length) {
        const timeout = setTimeout(() => {
          setDisplayedLines((prev) => {
            const newLines = [...prev];
            if (!newLines[currentLineIdx]) newLines[currentLineIdx] = "";
            newLines[currentLineIdx] = currentLineText.slice(
              0,
              currentCharIdx + 1
            );
            return newLines;
          });
          setCurrentCharIdx(currentCharIdx + 1);
        }, speed);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setCurrentLineIdx(currentLineIdx + 1);
          setCurrentCharIdx(0);
        }, speed * 2);
        return () => clearTimeout(timeout);
      }
    } else {
      if (!repeat) {
        setIsFinished(true);
        return;
      }
      const timeout = setTimeout(() => {
        setDisplayedLines([]);
        setCurrentLineIdx(0);
        setCurrentCharIdx(0);
      }, pause);
      return () => clearTimeout(timeout);
    }
  }, [
    currentCharIdx,
    currentLineIdx,
    lines,
    speed,
    pause,
    mode,
    repeat,
    isFinished,
    isReady,
  ]);

  return (
    <Text {...props} lineHeight={1.1} textAlign="left" anchorY="top">
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

const SCREEN_CONFIGS = [
  {
    id: "Object_213",
    messages: ["SYSTEM_BOOT...", "AUTH: GRANTED", "USER: KETAN", "> READY_"],
    mode: "type",
    repeat: false,
    x: -0.5,
    y: 0.35,
    size: 0.12,
  },
  {
    id: "Object_216",
    messages: ["NEXT_JS\nV15.0.1", "STATUS: OK"],
    mode: "static",
    repeat: true,
    x: -0.5,
    y: 0.38,
    size: 0.11,
  },
  {
    id: "Object_219",
    messages: ["3D_CORE\nR3F_ACTIVE", "GLSL_ON"],
    mode: "type",
    repeat: false,
    x: -0.5,
    y: 0.38,
    size: 0.1,
  },
  {
    id: "Object_207",
    messages: ["Scroll\nTo see More"],
    mode: "type",
    repeat: true,
    x: -0.5,
    y: 0.4,
    size: 0.2,
  },
  {
    id: "Object_210",
    messages:  ["Hi There!"],
    mode: "static",
    repeat: true,
    x: -0.5,
    y: 0.38,
    size: 0.18,
  },
];

/* ==========================================================
   2. 3D VINTAGE COMPUTERS (Merged Logic)
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
      const center = new THREE.Vector3();
      mesh.geometry.boundingBox?.getCenter(center);
      const size = new THREE.Vector3();
      mesh.geometry.boundingBox?.getSize(size);

      const tGroup = new THREE.Group();
      tGroup.position.copy(center);
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
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      (state.mouse.x * Math.PI) / 10 + Math.sin(t / 4) / 10,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      THREE.MathUtils.clamp((state.mouse.y * Math.PI) / 20, -0.05, 0.5),
      0.05
    );
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]} scale={responsiveScale}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <pointLight
          position={[0, 1, 1]}
          distance={5}
          intensity={4}
          color="#00ff41"
        />
        <primitive object={scene} position={[0, -0.8, 0]} />
        {loaded &&
          SCREEN_CONFIGS.map((config) => {
            const parent = textGroupsRef.current.get(config.id);
            if (!parent) return null;
            return (
              <TerminalText
                key={config.id}
                parent={parent}
                messages={config.messages}
                mode={config.mode}
                repeat={config.repeat}
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
   3. UI COMPONENTS (From Code A - High Fidelity)
========================================================== */
function LoadingScreen({ onFinished }: { onFinished: () => void }) {
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () => setPercent((p) => (p < 100 ? p + 1 : 100)),
      25
    );
    const timeout = setTimeout(onFinished, 3500);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
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
          KETAN<span className="text-green-500 italic">.dev</span>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
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
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-3xl font-bold text-white uppercase tracking-tighter"
              >
                {link.name}
              </a>
            ))}
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

/* ==========================================================
   4. MAIN PAGE INTEGRATION
========================================================== */
export default function PortfolioPage() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const clipScale = useTransform(scrollYProgress, [0, 0.15], [0, 150]);
  const smoothClipScale = useSpring(clipScale, { stiffness: 80, damping: 25 });
  const clipPathValue = useTransform(
    smoothClipScale,
    (v) => `circle(${v}% at 50% 50%)`
  );

  const handleScrollDown = () =>
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });

  return (
    <main
      ref={containerRef}
      className="relative bg-[#020202] text-gray-200 selection:bg-green-500/40 font-sans min-h-[200vh]"
    >
      <AnimatePresence>
        {isLoading && <LoadingScreen onFinished={() => setIsLoading(false)} />}
      </AnimatePresence>
      <Navbar />

      {/* HERO SECTION - Code A Visuals + Code B Terminal 3D */}
      <div className="fixed inset-0 z-0 h-screen w-full overflow-hidden">
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 40 }}>
          <color attach="background" args={["#020202"]} />
          <fog attach="fog" args={["#020202", 5, 20]} />
          <Suspense fallback={null}>
            <Environment preset="city" />
            <ambientLight intensity={0.2} />
            <SpotLight
              position={[-5, 5, 5]}
              angle={0.3}
              penumbra={1}
              intensity={2}
              color="#ffffff"
            />
            <VintageComputers modelPath="/old_computers.glb" />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
              <planeGeometry args={[50, 50]} />
              <MeshReflectorMaterial
                blur={[300, 100]}
                resolution={512}
                mixBlur={1}
                mixStrength={80}
                roughness={0.8}
                color="#050505"
                metalness={0.5}
                mirror={0.75}
              />
            </mesh>
          </Suspense>
        </Canvas>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-2 mb-4"
          >
            {[
              "W",
              "E",
              "L",
              "C",
              "O",
              "M",
              "E",
              " ",
              "T",
              "O",
              " ",
              "M",
              "Y",
              " ",
            ].map((l, i) => (
              <span
                key={i}
                className="md:text-[15px]  text-[12px] font-mono font-bold text-green-500/70 tracking-[0.3em]"
              >
                {l}
              </span>
            ))}
          </motion.div>

          <h1 className="flex overflow-y-hidden text-6xl md:text-9xl font-black text-white mix-blend-difference tracking-tighter">
            {"PORTFOLIO".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ y: 200 }}
                animate={{ y: 0 }}
                transition={{
                  delay: 3.5 + i * 0.1, // ⬅ start after 3.5s
                  type: "spring",
                  stiffness: 100,
                }}
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
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest group-hover:text-green-500 transition-colors">
              Launch_Core
            </span>
            <div className="p-3 border border-white/10 rounded-full group-hover:border-green-500 transition-all">
              <ArrowDown className="text-green-500" size={20} />
            </div>
          </motion.button>
        </div>
      </div>

      {/* CONTENT REVEAL - Code A High Fidelity Layout */}
      {/* CONTENT REVEAL */}
      <motion.div
        style={{
          clipPath: clipPathValue,
          WebkitClipPath: clipPathValue,
          willChange: "clip-path",
        }}
        className="relative z-20 w-full bg-[#080808] transform-gpu"
      >
        <div className="h-screen w-full pointer-events-none" ><p>[System breach detected]</p></div>

        <div className="max-w-6xl mx-auto px-6 pb-40">
          <Section id="about">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-block px-3 py-1 border border-green-500/20 bg-green-500/5 text-green-500 text-[10px] font-mono mb-4">
                  SYSTEM_BIO_READY
                </div>
                <h3 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tight">
                  Software Engineer & <br />
                  <span className="text-gray-500 italic">
                    Creative Technologist.
                  </span>
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed font-light">
                  B.Tech in{" "}
                  <span className="text-white border-b border-green-500/30">
                    CSE (Data Science)
                  </span>
                  . I specialize in building complex systems where robust
                  performance meets immersive user experience.
                </p>
              </div>
              <div className="flex justify-center relative">
                <div className="absolute inset-0 bg-green-500/5 blur-[100px] rounded-full" />
                <div className="w-56 h-56 md:w-80 md:h-80 relative flex items-center justify-center border border-white/5 rounded-3xl backdrop-blur-3xl">
                  <Cpu size={80} className="text-green-500 animate-pulse" />
                  <div className="absolute -top-4 -right-4 bg-green-500 text-black px-2 py-1 text-[10px] font-bold rounded">
                    LIVE_CORE
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section id="skills" title="Technical Arsenal" icon={<Zap />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <SkillCard
                category="Core_Logic"
                icon={<Code2 className="text-blue-400" />}
                skills={["TypeScript", "JavaScript", "Python", "SQL"]}
                status="98%"
              />
              <SkillCard
                category="Visual_Sys"
                icon={<Layers className="text-purple-400" />}
                skills={["React", "Next.js", "Three.js", "Motion"]}
                status="95%"
              />
              <SkillCard
                category="Ops_Infrastructure"
                icon={<Database className="text-orange-400" />}
                skills={["Node.js", "FastAPI", "Docker", "Postgres"]}
                status="90%"
              />
            </div>
          </Section>

          <Section id="projects" title="System Deployments" icon={<Boxes />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <ProjectCard
                title="3D Retro Portfolio"
                description="Highly interactive 3D portfolio using R3F and scroll-linked animations."
                tech={["Next.js", "R3F"]}
                color="green"
              />
              <ProjectCard
                title="Intelligent Pipeline"
                description="Real-time data processing backend with predictive analytics."
                tech={["Python", "FastAPI"]}
                color="blue"
              />
              <ProjectCard
                title="Solar System Viz"
                description="Interactive 3D space simulation with real physics data."
                tech={["Three.js", "GLSL"]}
                color="orange"
              />
              <ProjectCard
                title="Microservices Core"
                description="Scalable architecture handling high-volume transactions."
                tech={["Node", "Docker"]}
                color="purple"
              />
            </div>
          </Section>

          <Section id="contact">
            <div className="bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-10 md:p-24 text-center">
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter">
                Initialize Connection
              </h2>
              <p className="text-gray-500 mb-12 max-w-sm mx-auto text-sm md:text-base">
                Ready to architect high-performance digital solutions. Let's
                build.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <ContactBtn
                  icon={<Mail />}
                  label="Email"
                  href="mailto:ketangaikwad2905@gmail.com"
                />
                <ContactBtn icon={<Linkedin />} label="LinkedIn" href="#" />
                <ContactBtn icon={<Github />} label="GitHub" href="#" />
              </div>
            </div>
          </Section>
        </div>
      </motion.div>
    </main>
  );
}

// --- SUB-COMPONENTS ---
function SkillCard({
  category,
  icon,
  skills,
  status,
}: {
  category: string;
  icon: React.ReactNode;
  skills: string[];
  status: string;
}) {
  return (
    <div className="bg-[#121212] border border-white/[0.03] p-8 rounded-[1.5rem] relative overflow-hidden group hover:border-green-500/20 transition-all duration-500">
      <div className="flex justify-between items-center mb-8">
        <div className="p-3 bg-white/[0.02] rounded-2xl text-green-500">
          {icon}
        </div>
        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          {status}
        </div>
      </div>
      <h3 className="text-gray-500 font-mono text-[11px] mb-4 uppercase tracking-[0.2em]">
        {category}
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <span
            key={s}
            className="text-xs text-white font-medium px-3 py-1 bg-white/[0.03] rounded-full border border-white/[0.05]"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function Section({
  children,
  title,
  icon,
  id,
}: {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  id?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1 }}
      className="py-24 scroll-mt-20"
    >
      {title && (
        <h2 className="text-sm font-mono text-green-500 mb-12 flex items-center gap-3 uppercase tracking-[0.4em]">
          <span className="w-8 h-[1px] bg-green-500/30" />
          {title}
        </h2>
      )}
      {children}
    </motion.section>
  );
}

function ProjectCard({
  title,
  description,
  tech,
  color,
}: {
  title: string;
  description: string;
  tech: string[];
  color: string;
}) {
  return (
    <div className="bg-[#121212] border border-white/[0.03] p-10 rounded-[2rem] group hover:bg-[#161616] transition-all duration-500">
      <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-green-500 transition-colors tracking-tight">
        {title}
      </h3>
      <p className="text-gray-500 mb-8 text-sm leading-relaxed">
        {description}
      </p>
      <div className="flex flex-wrap gap-2">
        {tech.map((t) => (
          <span
            key={t}
            className="text-[10px] font-mono text-gray-400 px-3 py-1 border border-white/10 rounded-full uppercase tracking-tighter"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function ContactBtn({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-green-500 hover:text-black hover:border-green-500 transition-all font-mono text-xs uppercase tracking-widest"
    >
      {icon} <span>{label}</span>
    </a>
  );
}
