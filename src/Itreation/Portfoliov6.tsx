// import React, { Suspense, useRef, useMemo, useState, useEffect } from "react";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import {
//   useGLTF,
//   Environment,
//   Float,
//   Text,
//   MeshReflectorMaterial,
//   SpotLight,
// } from "@react-three/drei";
// import {
//   motion,
//   useScroll,
//   useTransform,
//   useSpring,
//   useInView,
//   AnimatePresence,
// } from "framer-motion";
// import {
//   Terminal,
//   Cpu,
//   Database,
//   Code2,
//   Boxes,
//   Github,
//   Linkedin,
//   Mail,
//   ArrowDown,
//   Menu,
//   X,
//   Layers,
//   Zap,
// } from "lucide-react";
// import * as THREE from "three";
// import { clsx, type ClassValue } from "clsx";
// import { twMerge } from "tailwind-merge";

// // --- UTILS ---
// function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

// /* ==========================================================
//    1. TERMINAL TEXT COMPONENT (From Code B)
// ========================================================== */
// function TerminalText({
//   messages,
//   speed = 40,
//   pause = 3000,
//   mode = "type",
//   repeat = true,
//   ...props
// }: any) {
//   const [displayedLines, setDisplayedLines] = useState<string[]>([]);
//   const [currentLineIdx, setCurrentLineIdx] = useState(0);
//   const [currentCharIdx, setCurrentCharIdx] = useState(0);
//   const [isFinished, setIsFinished] = useState(false);
//   const [isReady, setIsReady] = useState(false);

//   const lines = useMemo(
//     () => (Array.isArray(messages) ? messages : messages.split("\n")),
//     [messages]
//   );

//   // Sync with the 3.5s main loader
//   useEffect(() => {
//     const startTimer = setTimeout(() => setIsReady(true), 3500);
//     return () => clearTimeout(startTimer);
//   }, []);

//   useEffect(() => {
//     if (!isReady) return;
//     if (mode === "static") {
//       setDisplayedLines(lines);
//       return;
//     }
//     if (isFinished) return;

//     if (currentLineIdx < lines.length) {
//       const currentLineText = lines[currentLineIdx];
//       if (currentCharIdx < currentLineText.length) {
//         const timeout = setTimeout(() => {
//           setDisplayedLines((prev) => {
//             const newLines = [...prev];
//             if (!newLines[currentLineIdx]) newLines[currentLineIdx] = "";
//             newLines[currentLineIdx] = currentLineText.slice(
//               0,
//               currentCharIdx + 1
//             );
//             return newLines;
//           });
//           setCurrentCharIdx(currentCharIdx + 1);
//         }, speed);
//         return () => clearTimeout(timeout);
//       } else {
//         const timeout = setTimeout(() => {
//           setCurrentLineIdx(currentLineIdx + 1);
//           setCurrentCharIdx(0);
//         }, speed * 2);
//         return () => clearTimeout(timeout);
//       }
//     } else {
//       if (!repeat) {
//         setIsFinished(true);
//         return;
//       }
//       const timeout = setTimeout(() => {
//         setDisplayedLines([]);
//         setCurrentLineIdx(0);
//         setCurrentCharIdx(0);
//       }, pause);
//       return () => clearTimeout(timeout);
//     }
//   }, [
//     currentCharIdx,
//     currentLineIdx,
//     lines,
//     speed,
//     pause,
//     mode,
//     repeat,
//     isFinished,
//     isReady,
//   ]);

//   return (
//     <Text {...props} lineHeight={1.1} textAlign="left" anchorY="top">
//       {displayedLines.join("\n")}
//       <meshBasicMaterial
//         color="#ffffff"
//         transparent
//         opacity={0.9}
//         depthTest={false}
//         side={THREE.DoubleSide}
//       />
//     </Text>
//   );
// }

// const SCREEN_CONFIGS = [
//   {
//     id: "Object_213",
//     messages: ["SYSTEM_BOOT...", "AUTH: GRANTED", "USER: KETAN", "> READY_"],
//     mode: "type",
//     repeat: false,
//     x: -0.5,
//     y: 0.35,
//     size: 0.12,
//   },
//   {
//     id: "Object_216",
//     messages: ["NEXT_JS\nV15.0.1", "STATUS: OK"],
//     mode: "static",
//     repeat: true,
//     x: -0.5,
//     y: 0.38,
//     size: 0.11,
//   },
//   {
//     id: "Object_219",
//     messages: ["3D_CORE\nR3F_ACTIVE", "GLSL_ON"],
//     mode: "type",
//     repeat: false,
//     x: -0.5,
//     y: 0.38,
//     size: 0.1,
//   },
//   {
//     id: "Object_207",
//     messages: ["Scroll\nTo see More"],
//     mode: "type",
//     repeat: true,
//     x: -0.5,
//     y: 0.4,
//     size: 0.2,
//   },
//   {
//     id: "Object_210",
//     messages:  ["Hi There!"],
//     mode: "static",
//     repeat: true,
//     x: -0.5,
//     y: 0.38,
//     size: 0.18,
//   },
// ];

// /* ==========================================================
//    2. 3D VINTAGE COMPUTERS (Merged Logic)
// ========================================================== */
// function VintageComputers({ modelPath }: { modelPath: string }) {
//   const { scene } = useGLTF(modelPath);
//   const groupRef = useRef<THREE.Group>(null);
//   const textGroupsRef = useRef<Map<string, THREE.Group>>(new Map());
//   const [loaded, setLoaded] = useState(false);
//   const { viewport } = useThree();
//   const responsiveScale = viewport.width < 7 ? 0.75 : 1.3;

//   useEffect(() => {
//     SCREEN_CONFIGS.forEach((config) => {
//       const mesh = scene.getObjectByName(config.id) as THREE.Mesh;
//       if (!mesh) return;
//       mesh.geometry.computeBoundingBox();
//       const center = new THREE.Vector3();
//       mesh.geometry.boundingBox?.getCenter(center);
//       const size = new THREE.Vector3();
//       mesh.geometry.boundingBox?.getSize(size);

//       const tGroup = new THREE.Group();
//       tGroup.position.copy(center);
//       tGroup.position.x += config.x;
//       tGroup.position.y += config.y;
//       tGroup.position.z += size.z / 2 + 0.01;

//       mesh.add(tGroup);
//       textGroupsRef.current.set(config.id, tGroup);
//     });
//     setLoaded(true);
//   }, [scene]);

//   useFrame((state) => {
//     if (!groupRef.current) return;
//     const t = state.clock.getElapsedTime();
//     groupRef.current.rotation.y = THREE.MathUtils.lerp(
//       groupRef.current.rotation.y,
//       (state.mouse.x * Math.PI) / 10 + Math.sin(t / 4) / 10,
//       0.05
//     );
//     groupRef.current.rotation.x = THREE.MathUtils.lerp(
//       groupRef.current.rotation.x,
//       THREE.MathUtils.clamp((state.mouse.y * Math.PI) / 20, -0.05, 0.5),
//       0.05
//     );
//   });

//   return (
//     <group ref={groupRef} position={[0, -0.5, 0]} scale={responsiveScale}>
//       <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
//         <pointLight
//           position={[0, 1, 1]}
//           distance={5}
//           intensity={4}
//           color="#00ff41"
//         />
//         <primitive object={scene} position={[0, -0.8, 0]} />
//         {loaded &&
//           SCREEN_CONFIGS.map((config) => {
//             const parent = textGroupsRef.current.get(config.id);
//             if (!parent) return null;
//             return (
//               <TerminalText
//                 key={config.id}
//                 parent={parent}
//                 messages={config.messages}
//                 mode={config.mode}
//                 repeat={config.repeat}
//                 fontSize={config.size}
//                 anchorX="left"
//                 font="/fonts/VT323-Regular.ttf"
//               />
//             );
//           })}
//       </Float>
//     </group>
//   );
// }

// /* ==========================================================
//    3. UI COMPONENTS (From Code A - High Fidelity)
// ========================================================== */
// function LoadingScreen({ onFinished }: { onFinished: () => void }) {
//   const [percent, setPercent] = useState(0);
//   useEffect(() => {
//     const interval = setInterval(
//       () => setPercent((p) => (p < 100 ? p + 1 : 100)),
//       25
//     );
//     const timeout = setTimeout(onFinished, 3500);
//     return () => {
//       clearInterval(interval);
//       clearTimeout(timeout);
//     };
//   }, [onFinished]);

//   return (
//     <motion.div
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-[200] bg-[#020202] flex flex-col items-center justify-center font-mono"
//     >
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="text-green-500 mb-4 tracking-tighter text-sm"
//       >
//         [ INITIALIZING_SYSTEM_CORE ]
//       </motion.div>
//       <div className="w-48 h-[2px] bg-white/10 relative overflow-hidden">
//         <motion.div
//           initial={{ width: 0 }}
//           animate={{ width: `${percent}%` }}
//           className="absolute h-full bg-green-500"
//         />
//       </div>
//       <div className="mt-4 text-[10px] text-gray-500 uppercase tracking-[0.2em]">
//         Status: {percent === 100 ? "Ready" : "Syncing GLB Assets..."}
//       </div>
//     </motion.div>
//   );
// }

// function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const navLinks = [
//     { name: "About", href: "#about" },
//     { name: "Skills", href: "#skills" },
//     { name: "Projects", href: "#projects" },
//     { name: "Contact", href: "#contact" },
//   ];

//   return (
//     <nav
//       className={cn(
//         "fixed top-0 w-full z-[100] transition-all duration-300 border-b",
//         scrolled
//           ? "bg-[#050505]/90 backdrop-blur-xl border-white/10 py-3"
//           : "bg-transparent border-transparent py-6"
//       )}
//     >
//       <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
//         <div className="text-xl font-black tracking-tighter text-white">
//           KETAN<span className="text-green-500 italic">.dev</span>
//         </div>
//         <div className="hidden md:flex gap-8 items-center">
//           {navLinks.map((link) => (
//             <a
//               key={link.name}
//               href={link.href}
//               className="text-[11px] font-mono text-gray-400 hover:text-green-500 transition-colors uppercase tracking-[0.2em]"
//             >
//               {link.name}
//             </a>
//           ))}
//         </div>
//         <button
//           className="md:hidden text-white p-2"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           {isOpen ? <X size={20} /> : <Menu size={20} />}
//         </button>
//       </div>
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ x: "100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "100%" }}
//             className="fixed inset-0 top-0 left-0 w-full h-screen bg-[#050505] z-[99] flex flex-col items-center justify-center gap-8"
//           >
//             {navLinks.map((link) => (
//               <a
//                 key={link.name}
//                 href={link.href}
//                 onClick={() => setIsOpen(false)}
//                 className="text-3xl font-bold text-white uppercase tracking-tighter"
//               >
//                 {link.name}
//               </a>
//             ))}
//             <button
//               onClick={() => setIsOpen(false)}
//               className="mt-8 text-green-500 border border-green-500/30 px-6 py-2 rounded-full font-mono text-sm"
//             >
//               CLOSE_TERMINAL
//             </button>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// }

// /* ==========================================================
//    4. MAIN PAGE INTEGRATION
// ========================================================== */
// export default function PortfolioPage() {
//   const [isLoading, setIsLoading] = useState(true);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end end"],
//   });

//   const clipScale = useTransform(scrollYProgress, [0, 0.15], [0, 150]);
//   const smoothClipScale = useSpring(clipScale, { stiffness: 80, damping: 25 });
//   const clipPathValue = useTransform(
//     smoothClipScale,
//     (v) => `circle(${v}% at 50% 50%)`
//   );

//   const handleScrollDown = () =>
//     window.scrollTo({ top: window.innerHeight, behavior: "smooth" });

//   return (
//     <main
//       ref={containerRef}
//       className="relative bg-[#020202] text-gray-200 selection:bg-green-500/40 font-sans min-h-[200vh]"
//     >
//       <AnimatePresence>
//         {isLoading && <LoadingScreen onFinished={() => setIsLoading(false)} />}
//       </AnimatePresence>
//       <Navbar />

//       {/* HERO SECTION - Code A Visuals + Code B Terminal 3D */}
//       <div className="fixed inset-0 z-0 h-screen w-full overflow-hidden">
//         <Canvas shadows camera={{ position: [0, 0, 8], fov: 40 }}>
//           <color attach="background" args={["#020202"]} />
//           <fog attach="fog" args={["#020202", 5, 20]} />
//           <Suspense fallback={null}>
//             <Environment preset="city" />
//             <ambientLight intensity={0.2} />
//             <SpotLight
//               position={[-5, 5, 5]}
//               angle={0.3}
//               penumbra={1}
//               intensity={2}
//               color="#ffffff"
//             />
//             <VintageComputers modelPath="/old_computers.glb" />
//             <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
//               <planeGeometry args={[50, 50]} />
//               <MeshReflectorMaterial
//                 blur={[300, 100]}
//                 resolution={512}
//                 mixBlur={1}
//                 mixStrength={80}
//                 roughness={0.8}
//                 color="#050505"
//                 metalness={0.5}
//                 mirror={0.75}
//               />
//             </mesh>
//           </Suspense>
//         </Canvas>

//         <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-4">
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.5 }}
//             className="flex gap-2 mb-4"
//           >
//             {[
//               "W",
//               "E",
//               "L",
//               "C",
//               "O",
//               "M",
//               "E",
//               " ",
//               "T",
//               "O",
//               " ",
//               "M",
//               "Y",
//               " ",
//             ].map((l, i) => (
//               <span
//                 key={i}
//                 className="md:text-[15px]  text-[12px] font-mono font-bold text-green-500/70 tracking-[0.3em]"
//               >
//                 {l}
//               </span>
//             ))}
//           </motion.div>

//           <h1 className="flex overflow-y-hidden text-6xl md:text-9xl font-black text-white mix-blend-difference tracking-tighter">
//             {"PORTFOLIO".split("").map((char, i) => (
//               <motion.span
//                 key={i}
//                 initial={{ y: 200 }}
//                 animate={{ y: 0 }}
//                 transition={{
//                   delay: 3.5 + i * 0.1, // ⬅ start after 3.5s
//                   type: "spring",
//                   stiffness: 100,
//                 }}
//               >
//                 {char}
//               </motion.span>
//             ))}
//           </h1>

//           <motion.button
//             onClick={handleScrollDown}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 1.5 }}
//             className="absolute md:bottom-10 bottom-20 pointer-events-auto flex flex-col items-center gap-2 group cursor-pointer"
//           >
//             <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest group-hover:text-green-500 transition-colors">
//               Launch_Core
//             </span>
//             <div className="p-3 border border-white/10 rounded-full group-hover:border-green-500 transition-all">
//               <ArrowDown className="text-green-500" size={20} />
//             </div>
//           </motion.button>
//         </div>
//       </div>

//       {/* CONTENT REVEAL - Code A High Fidelity Layout */}
//       {/* CONTENT REVEAL */}
//       <motion.div
//         style={{
//           clipPath: clipPathValue,
//           WebkitClipPath: clipPathValue,
//           willChange: "clip-path",
//         }}
//         className="relative z-20 w-full bg-[#080808] transform-gpu"
//       >
//         <div className="h-screen w-full pointer-events-none" ><p>[System breach detected]</p></div>

//         <div className="max-w-6xl mx-auto px-6 pb-40">
//           <Section id="about">
//             <div className="grid md:grid-cols-2 gap-16 items-center">
//               <div>
//                 <div className="inline-block px-3 py-1 border border-green-500/20 bg-green-500/5 text-green-500 text-[10px] font-mono mb-4">
//                   SYSTEM_BIO_READY
//                 </div>
//                 <h3 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tight">
//                   Software Engineer & <br />
//                   <span className="text-gray-500 italic">
//                     Creative Technologist.
//                   </span>
//                 </h3>
//                 <p className="text-gray-400 text-lg leading-relaxed font-light">
//                   B.Tech in{" "}
//                   <span className="text-white border-b border-green-500/30">
//                     CSE (Data Science)
//                   </span>
//                   . I specialize in building complex systems where robust
//                   performance meets immersive user experience.
//                 </p>
//               </div>
//               <div className="flex justify-center relative">
//                 <div className="absolute inset-0 bg-green-500/5 blur-[100px] rounded-full" />
//                 <div className="w-56 h-56 md:w-80 md:h-80 relative flex items-center justify-center border border-white/5 rounded-3xl backdrop-blur-3xl">
//                   <Cpu size={80} className="text-green-500 animate-pulse" />
//                   <div className="absolute -top-4 -right-4 bg-green-500 text-black px-2 py-1 text-[10px] font-bold rounded">
//                     LIVE_CORE
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Section>

//           <Section id="skills" title="Technical Arsenal" icon={<Zap />}>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//               <SkillCard
//                 category="Core_Logic"
//                 icon={<Code2 className="text-blue-400" />}
//                 skills={["TypeScript", "JavaScript", "Python", "SQL"]}
//                 status="98%"
//               />
//               <SkillCard
//                 category="Visual_Sys"
//                 icon={<Layers className="text-purple-400" />}
//                 skills={["React", "Next.js", "Three.js", "Motion"]}
//                 status="95%"
//               />
//               <SkillCard
//                 category="Ops_Infrastructure"
//                 icon={<Database className="text-orange-400" />}
//                 skills={["Node.js", "FastAPI", "Docker", "Postgres"]}
//                 status="90%"
//               />
//             </div>
//           </Section>

//           <Section id="projects" title="System Deployments" icon={<Boxes />}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
//               <ProjectCard
//                 title="3D Retro Portfolio"
//                 description="Highly interactive 3D portfolio using R3F and scroll-linked animations."
//                 tech={["Next.js", "R3F"]}
//                 color="green"
//               />
//               <ProjectCard
//                 title="Intelligent Pipeline"
//                 description="Real-time data processing backend with predictive analytics."
//                 tech={["Python", "FastAPI"]}
//                 color="blue"
//               />
//               <ProjectCard
//                 title="Solar System Viz"
//                 description="Interactive 3D space simulation with real physics data."
//                 tech={["Three.js", "GLSL"]}
//                 color="orange"
//               />
//               <ProjectCard
//                 title="Microservices Core"
//                 description="Scalable architecture handling high-volume transactions."
//                 tech={["Node", "Docker"]}
//                 color="purple"
//               />
//             </div>
//           </Section>

//           <Section id="contact">
//             <div className="bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-10 md:p-24 text-center">
//               <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter">
//                 Initialize Connection
//               </h2>
//               <p className="text-gray-500 mb-12 max-w-sm mx-auto text-sm md:text-base">
//                 Ready to architect high-performance digital solutions. Let's
//                 build.
//               </p>
//               <div className="flex flex-col sm:flex-row justify-center gap-4">
//                 <ContactBtn
//                   icon={<Mail />}
//                   label="Email"
//                   href="mailto:ketangaikwad2905@gmail.com"
//                 />
//                 <ContactBtn icon={<Linkedin />} label="LinkedIn" href="#" />
//                 <ContactBtn icon={<Github />} label="GitHub" href="#" />
//               </div>
//             </div>
//           </Section>
//         </div>
//       </motion.div>
//     </main>
//   );
// }

// // --- SUB-COMPONENTS ---
// function SkillCard({
//   category,
//   icon,
//   skills,
//   status,
// }: {
//   category: string;
//   icon: React.ReactNode;
//   skills: string[];
//   status: string;
// }) {
//   return (
//     <div className="bg-[#121212] border border-white/[0.03] p-8 rounded-[1.5rem] relative overflow-hidden group hover:border-green-500/20 transition-all duration-500">
//       <div className="flex justify-between items-center mb-8">
//         <div className="p-3 bg-white/[0.02] rounded-2xl text-green-500">
//           {icon}
//         </div>
//         <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
//           {status}
//         </div>
//       </div>
//       <h3 className="text-gray-500 font-mono text-[11px] mb-4 uppercase tracking-[0.2em]">
//         {category}
//       </h3>
//       <div className="flex flex-wrap gap-2">
//         {skills.map((s) => (
//           <span
//             key={s}
//             className="text-xs text-white font-medium px-3 py-1 bg-white/[0.03] rounded-full border border-white/[0.05]"
//           >
//             {s}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }

// function Section({
//   children,
//   title,
//   icon,
//   id,
// }: {
//   children: React.ReactNode;
//   title?: string;
//   icon?: React.ReactNode;
//   id?: string;
// }) {
//   const ref = useRef(null);
//   const isInView = useInView(ref, { once: true, margin: "-100px" });
//   return (
//     <motion.section
//       id={id}
//       ref={ref}
//       initial={{ opacity: 0, y: 40 }}
//       animate={isInView ? { opacity: 1, y: 0 } : {}}
//       transition={{ duration: 1 }}
//       className="py-24 scroll-mt-20"
//     >
//       {title && (
//         <h2 className="text-sm font-mono text-green-500 mb-12 flex items-center gap-3 uppercase tracking-[0.4em]">
//           <span className="w-8 h-[1px] bg-green-500/30" />
//           {title}
//         </h2>
//       )}
//       {children}
//     </motion.section>
//   );
// }

// function ProjectCard({
//   title,
//   description,
//   tech,
//   color,
// }: {
//   title: string;
//   description: string;
//   tech: string[];
//   color: string;
// }) {
//   return (
//     <div className="bg-[#121212] border border-white/[0.03] p-10 rounded-[2rem] group hover:bg-[#161616] transition-all duration-500">
//       <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-green-500 transition-colors tracking-tight">
//         {title}
//       </h3>
//       <p className="text-gray-500 mb-8 text-sm leading-relaxed">
//         {description}
//       </p>
//       <div className="flex flex-wrap gap-2">
//         {tech.map((t) => (
//           <span
//             key={t}
//             className="text-[10px] font-mono text-gray-400 px-3 py-1 border border-white/10 rounded-full uppercase tracking-tighter"
//           >
//             {t}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }

// function ContactBtn({
//   icon,
//   label,
//   href,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   href: string;
// }) {
//   return (
//     <a
//       href={href}
//       className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-green-500 hover:text-black hover:border-green-500 transition-all font-mono text-xs uppercase tracking-widest"
//     >
//       {icon} <span>{label}</span>
//     </a>
//   );
// }


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
  Trophy,
  FlaskConical,
  Star,
  ExternalLink,
  Globe,
  Telescope,
} from "lucide-react";
import * as THREE from "three";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ==========================================================
   1. 3D CORE COMPONENTS (Hero Logic preserved)
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
    [messages],
  );

  useEffect(() => {
    const startTimer = setTimeout(() => setIsReady(true), 3500);
    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!isReady || isFinished) return;
    if (mode === "static") {
      setDisplayedLines(lines);
      return;
    }

    if (currentLineIdx < lines.length) {
      const currentLineText = lines[currentLineIdx];
      if (currentCharIdx < currentLineText.length) {
        const timeout = setTimeout(() => {
          setDisplayedLines((prev) => {
            const newLines = [...prev];
            if (!newLines[currentLineIdx]) newLines[currentLineIdx] = "";
            newLines[currentLineIdx] = currentLineText.slice(
              0,
              currentCharIdx + 1,
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
    messages: ["REACT_V18", "STATUS: OK"],
    mode: "static",
    repeat: true,
    x: -0.5,
    y: 0.38,
    size: 0.11,
  },
  {
    id: "Object_219",
    messages: ["3D_CORE\nR3F_ACTIVE"],
    mode: "type",
    repeat: false,
    x: -0.5,
    y: 0.38,
    size: 0.1,
  },
  {
    id: "Object_207",
    messages: ["Scroll\nTo Explore"],
    mode: "type",
    repeat: true,
    x: -0.5,
    y: 0.4,
    size: 0.2,
  },
  {
    id: "Object_210",
    messages: ["HELLO_WORLD"],
    mode: "static",
    repeat: true,
    x: -0.5,
    y: 0.38,
    size: 0.18,
  },
];

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
      0.05,
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      THREE.MathUtils.clamp((state.mouse.y * Math.PI) / 20, -0.05, 0.5),
      0.05,
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
   2. REVISED UI COMPONENTS (Diversified Layouts)
========================================================== */

function LoadingScreen({ onFinished }: { onFinished: () => void }) {
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () => setPercent((p) => (p < 100 ? p + 1 : 100)),
      25,
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

function Section({ children, title, icon, id, className }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1 }}
      className={cn("py-24 scroll-mt-20", className)}
    >
      {title && (
        <div className="flex items-center gap-4 mb-16">
          <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
            {icon}
          </div>
          <h2 className="text-sm font-mono text-green-500 uppercase tracking-[0.4em]">
            {title}
          </h2>
          <div className="flex-1 h-[1px] bg-white/5" />
        </div>
      )}
      {children}
    </motion.section>
  );
}

// --- PROJECT LAYOUT: Split Feature ---
function FeaturedProject({ title, desc, tech, side = "left" }: any) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row gap-12 items-center mb-32",
        side === "right" && "md:flex-row-reverse",
      )}
    >
      <div className="flex-1 w-full aspect-video bg-[#0f0f0f] border border-white/5 rounded-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-6 left-6 font-mono text-[10px] text-white/20 uppercase tracking-[0.5em]">
          System_Deployment_01
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-4xl font-bold text-white mb-6 tracking-tight">
          {title}
        </h3>
        <p className="text-gray-400 mb-8 leading-relaxed text-lg">{desc}</p>
        <div className="flex flex-wrap gap-3 mb-8">
          {tech.map((t: string) => (
            <span
              key={t}
              className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400 font-mono"
            >
              {t}
            </span>
          ))}
        </div>
        <button className="flex items-center gap-2 text-green-500 text-sm font-mono hover:gap-4 transition-all">
          VIEW_REPOSITORY <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
}

// --- HACKATHON LAYOUT: Activity Log ---
function HackathonItem({ title, award, date, desc }: any) {
  return (
    <div className="relative pl-12 pb-16 border-l border-white/10 last:pb-0">
      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
      <div className="text-[10px] font-mono text-gray-500 mb-2">{date}</div>
      <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
      <div className="text-green-500 font-mono text-xs mb-4 flex items-center gap-2">
        <Trophy size={14} /> {award}
      </div>
      <p className="text-gray-400 text-sm max-w-2xl">{desc}</p>
    </div>
  );
}

/* ==========================================================
   3. MAIN PAGE INTEGRATION
========================================================== */
export default function PortfolioPageV6() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const clipScale = useTransform(scrollYProgress, [0, 0.12], [0, 150]);
  const smoothClipScale = useSpring(clipScale, { stiffness: 80, damping: 25 });
  const clipPathValue = useTransform(
    smoothClipScale,
    (v) => `circle(${v}% at 50% 50%)`,
  );

  return (
    <main
      ref={containerRef}
      className="relative bg-[#020202] text-gray-200 selection:bg-green-500/40 font-sans"
    >
      <AnimatePresence>
        {isLoading && <LoadingScreen onFinished={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* FIXED HERO (3D) */}
      <div className="fixed inset-0 z-0 h-screen w-full overflow-hidden">
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 40 }}>
          <color attach="background" args={["#020202"]} />
          <Suspense fallback={null}>
            <Environment preset="city" />
            <ambientLight intensity={0.2} />
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
        {/* Title Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
          <h1 className="text-7xl md:text-[10rem] font-black text-white mix-blend-difference tracking-tighter uppercase">
            Ketan<span className="text-green-500 italic">.dev</span>
          </h1>
        </div>
      </div>

      {/* CONTENT REVEAL */}
      <motion.div
        style={{
          clipPath: clipPathValue,
          WebkitClipPath: clipPathValue,
          willChange: "clip-path",
        }}
        className="relative z-20 w-full bg-[#080808] transform-gpu mt-[100vh]"
      >
        <div className="max-w-6xl mx-auto px-6 py-20">
          {/* SECTION 1: ABOUT */}
          <Section id="about">
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <div>
                <div className="text-green-500 font-mono text-[10px] mb-4 tracking-[0.3em] uppercase">
                  Status: Online
                </div>
                <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter">
                  Data Scientist & <br /> Fullstack Dev.
                </h2>
                <p className="text-xl text-gray-400 leading-relaxed font-light">
                  Pursuing B.Tech in{" "}
                  <span className="text-white border-b border-green-500/30">
                    CSE (Data Science)
                  </span>
                  . Building high-performance systems where data-driven logic
                  meets immersive front-end architecture.
                </p>
              </div>
              <div className="bg-[#0f0f0f] border border-white/5 p-12 rounded-3xl flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                    <Cpu />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-mono uppercase">
                      Current_Machine
                    </div>
                    <div className="text-sm font-bold">RTX 3050 | 16GB RAM</div>
                  </div>
                </div>
                <div className="w-full h-[1px] bg-white/5" />
                <div className="text-xs text-gray-400 font-mono leading-relaxed">
                  [SYSTEM_LOG]: Ketan is currently architecting scalable web
                  solutions and exploring the depths of Machine Learning models.
                </div>
              </div>
            </div>
          </Section>

          {/* SECTION 2: SKILLS (Modular Stack) */}
          {/* SECTION 2: SKILLS (System Architecture) */}
          <Section id="skills" title="Technical Arsenal" icon={<Zap />}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* 1. Frontend Architecture */}
              <div className="md:col-span-6 bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 md:p-10 hover:border-white/10 transition-all group">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-white/5 rounded-2xl text-white group-hover:text-green-500 transition-colors">
                    <Layers size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Frontend Architecture
                  </h3>
                </div>

                <div className="flex flex-wrap gap-3">
                  {[
                    "React.js",
                    "Next.js 15",
                    "TypeScript",
                    "Tailwind CSS",
                    "Framer Motion",
                    "Three.js",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-white/5 rounded-xl text-xs text-gray-400 font-mono"
                    >
                      <div className="w-1 h-1 bg-gray-700 rounded-full" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Back End & Data - This replaces the "Database" block */}
              <div className="md:col-span-6 bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 md:p-10 hover:border-white/10 transition-all group">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-white/5 rounded-2xl text-white group-hover:text-green-500 transition-colors">
                    <Database size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Back End & Infrastructure
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Logic Layer */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                      Logic_Layer
                    </span>
                    <div className="flex flex-col gap-2">
                      {["Node.js", "Express.js", "Prisma ORM"].map((t) => (
                        <span
                          key={t}
                          className="text-sm text-gray-300 font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Persistence Layer */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                      Data_Persistence
                    </span>
                    <div className="flex flex-col gap-2">
                      {["PostgreSQL", "MongoDB", "MySQL"].map((d) => (
                        <span key={d} className="text-sm text-gray-500">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Fullstack Control - The High-Contrast Component */}
              <div className="md:col-span-12 bg-white text-black rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between group overflow-hidden relative">
                <div className="relative z-10 mb-8 md:mb-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-[2px] bg-black" />
                    <span className="text-xs font-mono font-bold uppercase tracking-[0.3em]">
                      System Integrity
                    </span>
                  </div>
                  <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                    Fullstack <br />{" "}
                    <span className="text-gray-400">Control</span>
                  </h3>
                  <p className="mt-6 text-sm font-medium opacity-70 max-w-sm">
                    Seamlessly bridging the gap between high-performance server
                    logic and fluid, interactive user interfaces.
                  </p>
                </div>

                <div className="relative z-10 grid grid-cols-2 gap-4 w-full md:w-auto">
                  <div className="p-6 bg-black/5 rounded-2xl border border-black/5 backdrop-blur-sm">
                    <Terminal size={32} className="mb-4" />
                    <div className="text-[10px] font-mono uppercase font-bold">
                      Git_Version_Control
                    </div>
                  </div>
                  <div className="p-6 bg-black/5 rounded-2xl border border-black/5 backdrop-blur-sm">
                    <Cpu size={32} className="mb-4" />
                    <div className="text-[10px] font-mono uppercase font-bold">
                      RESTful_API_Design
                    </div>
                  </div>
                </div>

                {/* Background Decorative Matrix */}
                <div className="absolute inset-0 opacity-[0.03] font-mono text-[9px] leading-none select-none pointer-events-none p-4 overflow-hidden break-all">
                  {Array(30)
                    .fill("PRISMA_POSTGRES_NODE_REACT_NEXTJS_EXPRESS_")
                    .join(" ")}
                </div>
              </div>
            </div>
          </Section>

          {/* SECTION 3: PROJECTS (Split Layout) */}
          <Section id="projects" title="Featured Projects" icon={<Boxes />}>
            <FeaturedProject
              title="Credit Card Fraud Detection"
              desc="A high-precision detection system utilizing Self-Organizing Maps (SOM) to identify anomalous transaction patterns in real-time."
              tech={["Python", "SOM", "Data Science"]}
              side="left"
            />
            <FeaturedProject
              title="3D Retro Universe"
              desc="The portfolio you are currently viewing. Built with React Three Fiber to showcase a blend of vintage aesthetics and modern tech."
              tech={["React Three Fiber", "Three.js", "Framer Motion"]}
              side="right"
            />
          </Section>

          {/* SECTION 4: HACKATHONS (Timeline) */}
          <Section id="hackathons" title="Hackathon Logs" icon={<Trophy />}>
            <div className="max-w-4xl mx-auto">
              <HackathonItem
                title="Global Vision Hackathon"
                award="Runner Up (FinTech Track)"
                date="OCT 2025"
                desc="Developed a blockchain-based insurance claiming system reducing processing time by 40%."
              />
              <HackathonItem
                title="Code-Break 5.0"
                award="Top 10 Finalist"
                date="JAN 2026"
                desc="Created an AI-powered study companion using Gemini API to automate note-taking for students."
              />
            </div>
          </Section>

          {/* SECTION 5: EXPERIMENTS (Small Dense Grid) */}
          <Section id="experiments" title="The Lab" icon={<FlaskConical />}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-[#0f0f0f] border border-white/5 rounded-xl p-6 hover:bg-white/5 transition-colors group"
                >
                  <Star
                    className="text-gray-700 group-hover:text-green-500 mb-4 transition-colors"
                    size={20}
                  />
                  <h4 className="font-mono text-[10px] text-gray-400 uppercase">
                    Experiment_{i}
                  </h4>
                  <p className="text-xs text-white/50 mt-2">
                    Experimental scripts and mini-tools.
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* SECTION 6: EXTRACURRICULAR (The Club Archive) */}
          <Section id="extra" title="Club Leadership" icon={<Star />}>
            <div className="w-full">
              {/* Club Header - Simple & Professional */}
              <div className="mb-12 border-b border-white/10 pb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                    Active_Role
                  </span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
                  Web Dev Lead{" "}
                  <span className="text-gray-600 font-light">@ DJS Nova</span>
                </h3>
                <p className="mt-4 text-gray-400 max-w-2xl text-sm leading-relaxed">
                  Directing the digital architecture for the college astronomy
                  club. I oversee the technical execution of our web platforms,
                  ensuring high-performance delivery of our astronomical
                  outreach tools.
                </p>
              </div>

              {/* Project Grid - Two clean, technical panes */}
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "DJS Nova Official",
                    description:
                      "Designed and developed the official landing page for the college astronomy club. Focused on strong brand identity, smooth navigation, and immersive 3D elements to deliver a premium first impression.",
                    link: "https://djsnovaspace.vercel.app",
                    tags: ["Landing Page", "Next.js", "3D Experience"],
                    id: "NOVA_01",
                  },
                  {
                    title: "Moon Gazing Showcase",
                    description:
                      "Built a visually engaging landing page for the 'Moon Gazing' event, highlighting key moments, activities, and experiences from the event through a clean UI and compelling visual storytelling.",
                    link: "https://moongazing.vercel.app",
                    tags: ["Event Showcase", "UI/UX", "Responsive Design"],
                    id: "MOON_02",
                  },
                ].map((project) => (
                  <div
                    key={project.id}
                    className="group relative bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl hover:border-green-500/30 transition-all duration-500"
                  >
                    {/* Top Identifier */}
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-[10px] font-mono text-gray-600 tracking-widest uppercase">
                        {project.id}
                      </span>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/5 rounded-lg text-gray-400 group-hover:text-green-500 group-hover:bg-green-500/10 transition-all"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>

                    <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-green-500 transition-colors">
                      {project.title}
                    </h4>

                    <p className="text-sm text-gray-500 leading-relaxed mb-8 h-auto md:h-20">
                      {project.description}
                    </p>

                    {/* Technical Footer */}
                    <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-mono text-gray-400 border border-white/10 px-2 py-1 rounded uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* SECTION 7: CONTACT */}
          <Section id="contact">
            <div className="bg-green-500 rounded-[2rem] p-12 md:p-24 text-center text-black">
              <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter uppercase">
                Let's Connect
              </h2>
              <p className="text-black/60 mb-12 max-w-md mx-auto font-medium">
                Ready to architect the next generation of digital tools. Open
                for collaborations and roles.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="mailto:ketangaikwad2905@gmail.com"
                  className="flex items-center justify-center gap-3 px-10 py-4 bg-black text-white rounded-2xl hover:scale-105 transition-transform font-mono text-xs uppercase tracking-widest"
                >
                  <Mail size={18} /> EMAIL_ME
                </a>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="p-4 bg-black/10 rounded-2xl hover:bg-black/20 transition-colors"
                  >
                    <Linkedin />
                  </a>
                  <a
                    href="#"
                    className="p-4 bg-black/10 rounded-2xl hover:bg-black/20 transition-colors"
                  >
                    <Github />
                  </a>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </motion.div>
    </main>
  );
}
