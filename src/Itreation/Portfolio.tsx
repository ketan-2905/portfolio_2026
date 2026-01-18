// "use client";

// import React, { Suspense, useRef } from "react";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import {
//   useGLTF,
//   Environment,
//   Float,
//   Text,
//   MeshReflectorMaterial,
//   SpotLight,
// } from "@react-three/drei";
// import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
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
// } from "lucide-react";
// import * as THREE from "three";
// import { clsx, type ClassValue } from "clsx";
// import { twMerge } from "tailwind-merge";

// // --- UTILS ---
// function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

// // --- 3D COMPONENTS ---

// function VintageComputers({ modelPath }: { modelPath: string }) {
//   const { scene } = useGLTF(modelPath);
//   const groupRef = useRef<THREE.Group>(null);
//   const { viewport } = useThree();

//   // Responsive scaling for mobile vs desktop
//   const responsiveScale = viewport.width < 7 ? 0.8 : 1.5;

//   useFrame((state) => {
//     if (!groupRef.current) return;
//     // Subtle mouse parallax interaction
//     const t = state.clock.getElapsedTime();
//     groupRef.current.rotation.y = THREE.MathUtils.lerp(
//       groupRef.current.rotation.y,
//       (state.mouse.x * Math.PI) / 20 + Math.sin(t / 4) / 10,
//       0.05
//     );
//     groupRef.current.rotation.x = THREE.MathUtils.lerp(
//       groupRef.current.rotation.x,
//       (state.mouse.y * Math.PI) / 30,
//       0.05
//     );
//   });

//   return (
//     <group ref={groupRef} position={[0, -0.5, 0]} scale={responsiveScale}>
//       <Float
//         speed={2} // Animation speed
//         rotationIntensity={0.2} // XYZ rotation intensity
//         floatIntensity={0.5} // Up/down float intensity
//       >
//         {/* Add a green glow light emanating from the screens */}
//         <pointLight
//           position={[0, 1, 1]}
//           distance={5}
//           intensity={2}
//           color="#00ff41"
//         />
//         <primitive object={scene} />
//       </Float>
//     </group>
//   );
// }

// function ReflectiveFloor() {
//   return (
//     <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
//       <planeGeometry args={[50, 50]} />
//       <MeshReflectorMaterial
//         blur={[300, 100]}
//         resolution={2048}
//         mixBlur={1}
//         mixStrength={80}
//         roughness={0.8}
//         depthScale={1.2}
//         minDepthThreshold={0.4}
//         maxDepthThreshold={1.4}
//         color="#050505"
//         metalness={0.5}
//         mirror={0.75}
//       />
//     </mesh>
//   );
// }

// // --- MAIN PAGE COMPONENT ---

// export default function SoftwarePortfolioPage() {
//   const containerRef = useRef<HTMLDivElement>(null);

//   // Scroll hooks for the reveal animation
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end end"],
//   });

//   // Animation: The clip-path circle expands from 0% to 150% based on scroll
//   const clipScale = useTransform(scrollYProgress, [0, 0.15], [0, 150]);
//   // Smooth out the scroll physics
//   const smoothClipScale = useSpring(clipScale, { stiffness: 100, damping: 20 });

//   // Use a template string to apply the motion value to CSS
//   const clipPathValue = useTransform(
//     smoothClipScale,
//     (v) => `circle(${v}% at 50% 50%)`
//   );

//   return (
//     <main
//       ref={containerRef}
//       className="relative bg-[#050505] text-gray-200 selection:bg-green-500/40 font-sans min-h-[200vh]"
//     >
//       {/* --- LAYER 1: THE 3D HERO (FIXED BACKGROUND) --- */}
//       <div className="fixed inset-0 z-0 h-screen w-full">
//         <Canvas shadows camera={{ position: [0, 0, 8], fov: 40 }}>
//           <color attach="background" args={["#020202"]} />
//           <fog attach="fog" args={["#020202", 5, 20]} />
//           <Suspense
//             fallback={
//               <Text color="#00ff41" position={[0, 0, 0]}>
//                 INITIALIZING CORE...
//               </Text>
//             }
//           >
//             <Environment preset="city" />
//             <ambientLight intensity={0.2} />
//             {/* Dramatic side lighting */}
//             <SpotLight
//               position={[-5, 5, 5]}
//               angle={0.3}
//               penumbra={1}
//               intensity={2}
//               castShadow
//               color="#ffffff"
//             />
//             <SpotLight
//               position={[5, 5, 5]}
//               angle={0.3}
//               penumbra={1}
//               intensity={1}
//               color="#00ff41" // Green rim light
//             />

//             {/* NOTE: Replace with your actual GLB path inside /public */}
//             <VintageComputers modelPath="/old_computers.glb" />
//             <ReflectiveFloor />
//           </Suspense>
//         </Canvas>
        
//         {/* Hero Overlay Text */}
//         <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none select-none">
//           <motion.h1
//             initial={{ opacity: 0, letterSpacing: "10px" }}
//             animate={{ opacity: 1, letterSpacing: "2px" }}
//             transition={{ duration: 1.5, ease: "easeOut" }}
//             className="text-5xl md:text-8xl font-black text-white mix-blend-overlay"
//           >
//             KETAN
//           </motion.h1>
//            <motion.div
//              initial={{ opacity: 0, y: 20 }}
//              animate={{ opacity: 1, y: 0 }}
//              transition={{ delay: 1 }}
//              className="absolute bottom-10 animate-bounce text-green-500"
//            >
//              <ArrowDown />
//            </motion.div>
//         </div>
//       </div>

//       {/* --- LAYER 2: THE BLACK MASK & REVEAL CONTENT --- */}
//       {/* This layer sits on top. The clip-path cuts a hole in it. */}
//       <motion.div
//         style={{ clipPath: clipPathValue, WebkitClipPath: clipPathValue }}
//         className="relative z-20 w-full bg-[#0a0a0a] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-auto"
//       >
//         {/* Spacer to push content past the initial hero view */}
//         <div className="h-screen w-full flex items-center justify-center">
//            <p className="text-green-500 font-mono animate-pulse">
//              [ SYSTEM BREACH DETECTED - SCROLL TO ACCESS ]
//            </p>
//         </div>

//         {/* MAIN CONTENT CONTAINER */}
//         <div className="max-w-5xl mx-auto px-6 pb-32">
//           {/* Section: Introduction */}
//           <Section>
//             <div className="md:flex items-center gap-12">
//               <div className="flex-1">
//                  <h2 className="text-green-500 font-mono mb-2 text-sm typing-effect overflow-hidden whitespace-nowrap border-r-2 border-green-500 pr-1 w-[fit-content]">
//                    whoami
//                 </h2>
//                 <h3 className="text-4xl font-bold mb-6 text-white">
//                   Software Engineer & <br />
//                   Creative Technologist.
//                 </h3>
//                 <p className="text-gray-400 text-lg leading-relaxed">
//                   I don't just build websites; I architect diverse systems. 
//                   With a background in <span className="text-white font-semibold">Data Science (B.Tech CSE)</span>, 
//                   I blend robust backend logic with high-performance, interactive frontend implementations.
//                   I specialize in transforming complex problems into elegant, usable software solutions.
//                 </p>
//               </div>
//               <div className="mt-12 md:mt-0 relative">
//                 {/* Abstract stylized "setting" icon visual */}
//                 <div className="w-64 h-64 relative animate-spin-slow opacity-50">
//                   <div className="absolute inset-0 border-2 border-dashed border-green-500/30 rounded-full"></div>
//                   <div className="absolute inset-4 border-2 border-dashed border-green-500/60 rounded-full rotate-45"></div>
//                   <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 text-green-500">
//                      <Cpu size={48} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Section>

//           {/* Section: Tech Stack */}
//           <Section title="Technical Arsenal" icon={<Terminal />}>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
//               <TechCard
//                 title="Core & Languages"
//                 icon={<Code2 className="text-blue-400" />}
//                 skills={["TypeScript", "JavaScript", "Python", "SQL", "C++", "HTML/CSS"]}
//               />
//               <TechCard
//                 title="Frontend Engineering"
//                 icon={<Boxes className="text-purple-400" />}
//                 skills={["React.js", "Next.js 14 (App Router)", "React Three Fiber", "Tailwind CSS", "Framer Motion", "Redux Toolkit"]}
//               />
//               <TechCard
//                 title="Backend & Data"
//                 icon={<Database className="text-orange-400" />}
//                 skills={["Node.js", "FastAPI (Python)", "PostgreSQL", "MongoDB", "Docker", "Data Structures"]}
//               />
//             </div>
//           </Section>

//           {/* Section: Projects */}
//           <Section title="System Deployments" icon={<Boxes />}>
//              <p className="text-gray-400 mb-12 font-mono">// Selected recent work demonstrating full-stack capabilities.</p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <ProjectCard
//                 title="Retro-Futurist Portfolio 3D"
//                 description="A highly interactive portfolio built with React Three Fiber and Next.js, featuring scroll-linked shader reveals and complex state management."
//                 tech={["R3F", "WebGL", "Framer Motion", "TypeScript"]}
//                 color="green"
//               />
//               <ProjectCard
//                 title="Intelligent Data Pipeline"
//                 description="Engineered a Python/FastAPI backend that processes real-time data streams and serves analytics to a React dashboard."
//                 tech={["Python", "FastAPI", "Pandas", "React Query"]}
//                 color="blue"
//               />
//                <ProjectCard
//                 title="E-Commerce Microservices"
//                 description="A scalable backend architecture using Node.js microservices and Docker, handling high-volume transactions."
//                 tech={["Node.js", "Docker", "PostgreSQL", "Redis"]}
//                 color="purple"
//               />
//               {/* Add your existing projects like Tic-Tac-Toe here, but rephrase them technically */}
//               <ProjectCard
//                  title="State Management Game Engine"
//                  description="A complex implementation of game logic (Tic-Tac-Toe/To-Do) focusing on immutable state patterns and React performance optimization."
//                  tech={["React Hooks", "Complex State", "Algorithms"]}
//                  color="orange"
//               />
//             </div>
//           </Section>

//           {/* Section: Contact */}
//           <Section>
//             <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center relative overflow-hidden">
//                <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent pointer-events-none"></div>
//               <h2 className="text-3xl font-bold text-white mb-6">Initialize Connection</h2>
//               <p className="text-gray-400 mb-8">Have a complex project in mind? Let's architect the solution.</p>
              
//               <div className="flex flex-wrap justify-center gap-4">
//                 <ContactBtn icon={<Mail />} label="ketangaikwad2905@gmail.com" href="mailto:ketangaikwad2905@gmail.com" />
//                 <ContactBtn icon={<Linkedin />} label="LinkedIn Profile" href="#" />
//                 <ContactBtn icon={<Github />} label="GitHub Architecture" href="#" />
//               </div>

//                <div className="mt-12 pt-8 border-t border-white/10 text-gray-500 font-mono text-sm">
//                   <p>Copyright © 2026 Ketan. All Rights Reserved.</p>
//                   <p>System Status: <span className="text-green-500">ONLINE</span></p>
//                </div>
//             </div>
//           </Section>

//         </div>
//       </motion.div>
//     </main>
//   );
// }

// // --- SUB-COMPONENTS FOR CLEANER JSX ---

// // A reusable section wrapper that animates into view
// function Section({ children, title, icon }: { children: React.ReactNode, title?: string, icon?: React.ReactNode }) {
//    const ref = useRef(null);
//    const isInView = useInView(ref, { once: true, margin: "-100px" });

//    return (
//       <motion.section
//          ref={ref}
//          initial={{ opacity: 0, y: 50 }}
//          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
//          transition={{ duration: 0.8, ease: "easeOut" }}
//          className="py-24"
//       >
//          {title && (
//             <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-white">
//                <span className="text-green-500">{icon}</span> {title}
//             </h2>
//          )}
//          {children}
//       </motion.section>
//    )
// }

// function TechCard({ title, skills, icon }: { title: string; skills: string[], icon: React.ReactNode }) {
//   return (
//     <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-green-500/30 transition-colors group">
//       <div className="mb-4 p-3 bg-white/5 rounded-lg w-fit group-hover:scale-110 transition-transform">{icon}</div>
//       <h3 className="text-xl font-semibold mb-4 text-white">{title}</h3>
//       <ul className="space-y-2">
//         {skills.map((skill) => (
//           <li key={skill} className="text-gray-400 text-sm font-mono flex items-center before:content-['>'] before:text-green-500 before:mr-2">
//             {skill}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// function ProjectCard({ title, description, tech, color }: { title: string, description: string, tech: string[], color: "green" | "blue" | "purple" | "orange" }) {
//    const colorMap = {
//       green: "hover:border-green-500/50 before:bg-green-500",
//       blue: "hover:border-blue-500/50 before:bg-blue-500",
//       purple: "hover:border-purple-500/50 before:bg-purple-500",
//       orange: "hover:border-orange-500/50 before:bg-orange-500",
//    }

//    return (
//       <motion.div 
//          whileHover={{ y: -5, scale: 1.02 }}
//          className={cn(
//             "relative p-8 rounded-2xl border border-white/10 bg-[#0c0c0c] overflow-hidden transition-all group",
//             colorMap[color]
//          )}
//       >
//          {/* Colored glowing accent line on top */}
//          <div className={cn("absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity", colorMap[color].split(' ')[1])}></div>
         
//          <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors">{title}</h3>
//          <p className="text-gray-400 mb-6 leading-relaxed">{description}</p>
//          <div className="flex flex-wrap gap-2 mt-auto">
//             {tech.map(t => (
//                <span key={t} className="px-3 py-1 text-xs font-mono border border-white/20 rounded-full text-gray-300">
//                   {t}
//                </span>
//             ))}
//          </div>
//       </motion.div>
//    )
// }

// function ContactBtn({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
//    return (
//       <a
//         href={href}
//         className="flex items-center gap-3 px-6 py-3 rounded-lg border border-white/20 bg-white/5 hover:bg-green-500 hover:text-black hover:border-green-500 transition-all duration-300 group font-mono text-sm"
//       >
//         {icon}
//         <span>{label}</span>
//       </a>
//    )
// }


// import React, { Suspense, useRef, useMemo } from "react";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import {
//   useGLTF,
//   Environment,
//   Float,
//   Text,
//   MeshReflectorMaterial,
//   SpotLight,
// } from "@react-three/drei";
// import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
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
// } from "lucide-react";
// import * as THREE from "three";
// import { clsx, type ClassValue } from "clsx";
// import { twMerge } from "tailwind-merge";

// function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

// // --- 3D COMPONENTS ---

// function VintageComputers({ modelPath }: { modelPath: string }) {
//   const { scene } = useGLTF(modelPath);
//   const groupRef = useRef<THREE.Group>(null);
//   const { viewport } = useThree();

//   // Optimization: Pre-process the model to disable heavy shadow calculations
//   useMemo(() => {
//     scene.traverse((child) => {
//       if ((child as THREE.Mesh).isMesh) {
//         child.castShadow = true;
//         child.receiveShadow = true;
//         // Optimization: use lower precision materials for complex models
//         if ((child as THREE.Mesh).material) {
//           (child as THREE.Mesh).material.precision = "lowp";
//         }
//       }
//     });
//   }, [scene]);

//   const responsiveScale = viewport.width < 7 ? 0.8 : 1.5;

//   useFrame((state) => {
//     if (!groupRef.current) return;
//     const t = state.clock.getElapsedTime();
//     groupRef.current.rotation.y = THREE.MathUtils.lerp(
//       groupRef.current.rotation.y,
//       (state.mouse.x * Math.PI) / 20 + Math.sin(t / 4) / 10,
//       0.05
//     );
//     groupRef.current.rotation.x = THREE.MathUtils.lerp(
//       groupRef.current.rotation.x,
//       (state.mouse.y * Math.PI) / 30,
//       0.05
//     );
//   });

//   return (
//     <group ref={groupRef} position={[0, -0.5, 0]} scale={responsiveScale}>
//       <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
//         <pointLight position={[0, 1, 1]} distance={5} intensity={2} color="#00ff41" />
//         <primitive object={scene} />
//       </Float>
//     </group>
//   );
// }

// function ReflectiveFloor() {
//   return (
//     <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
//       <planeGeometry args={[50, 50]} />
//       <MeshReflectorMaterial
//         blur={[300, 100]}
//         resolution={512} // OPTIMIZED from 2048 to 512 for smooth performance
//         mixBlur={1}
//         mixStrength={80}
//         roughness={0.8}
//         depthScale={1.2}
//         minDepthThreshold={0.4}
//         maxDepthThreshold={1.4}
//         color="#050505"
//         metalness={0.5}
//         mirror={0.75}
//       />
//     </mesh>
//   );
// }

// export default function SoftwarePortfolioPage() {
//   const containerRef = useRef<HTMLDivElement>(null);

//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end end"],
//   });

//   const clipScale = useTransform(scrollYProgress, [0, 0.15], [0, 150]);
//   const smoothClipScale = useSpring(clipScale, { stiffness: 80, damping: 25 }); // Adjusted for smoother transitions

//   const clipPathValue = useTransform(
//     smoothClipScale,
//     (v) => `circle(${v}% at 50% 50%)`
//   );

//   return (
//     <main
//       ref={containerRef}
//       className="relative bg-[#050505] text-gray-200 selection:bg-green-500/40 font-sans min-h-[200vh]"
//     >
//       <div className="fixed inset-0 z-0 h-screen w-full">
//         {/* Added dpr and optimized gl settings for lag-free rendering */}
//         <Canvas 
//           shadows 
//           dpr={[1, 1.5]} 
//           gl={{ antialias: false, powerPreference: "high-performance" }}
//           camera={{ position: [0, 0, 8], fov: 40 }}
//         >
//           <color attach="background" args={["#020202"]} />
//           <fog attach="fog" args={["#020202", 5, 20]} />
//           <Suspense fallback={<Text color="#00ff41" position={[0, 0, 0]}>INITIALIZING CORE...</Text>}>
//             <Environment preset="city" />
//             <ambientLight intensity={0.2} />
//             <SpotLight position={[-5, 5, 5]} angle={0.3} penumbra={1} intensity={2} castShadow color="#ffffff" />
//             <SpotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={1} color="#00ff41" />
//             <VintageComputers modelPath="/old_computers.glb" />
//             <ReflectiveFloor />
//           </Suspense>
//         </Canvas>
        
//         <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none select-none">
//           <motion.h1
//             initial={{ opacity: 0, letterSpacing: "10px" }}
//             animate={{ opacity: 1, letterSpacing: "2px" }}
//             transition={{ duration: 1.5, ease: "easeOut" }}
//             className="text-5xl md:text-8xl font-black text-white mix-blend-overlay"
//           >
//             KETAN
//           </motion.h1>
//            <motion.div
//              initial={{ opacity: 0, y: 20 }}
//              animate={{ opacity: 1, y: 0 }}
//              transition={{ delay: 1 }}
//              className="absolute bottom-10 animate-bounce text-green-500"
//            >
//              <ArrowDown />
//            </motion.div>
//         </div>
//       </div>

//       <motion.div
//         style={{ 
//           clipPath: clipPathValue, 
//           WebkitClipPath: clipPathValue,
//           willChange: "clip-path" // Force GPU acceleration for the reveal animation
//         }}
//         className="relative z-20 w-full bg-[#0a0a0a] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-auto transform-gpu"
//       >
//         <div className="h-screen w-full flex items-center justify-center">
//            <p className="text-green-500 font-mono animate-pulse">
//              [ SYSTEM BREACH DETECTED - SCROLL TO ACCESS ]
//            </p>
//         </div>

//         <div className="max-w-5xl mx-auto px-6 pb-32">
//           <Section>
//             <div className="md:flex items-center gap-12">
//               <div className="flex-1">
//                  <h2 className="text-green-500 font-mono mb-2 text-sm">
//                   &gt; whoami
//                 </h2>
//                 <h3 className="text-4xl font-bold mb-6 text-white">
//                   Software Engineer & <br />
//                   Creative Technologist.
//                 </h3>
//                 <p className="text-gray-400 text-lg leading-relaxed">
//                   I don't just build websites; I architect diverse systems. 
//                   With a background in <span className="text-white font-semibold">Data Science (B.Tech CSE)</span>, 
//                   I blend robust backend logic with high-performance, interactive frontend implementations.
//                   I specialize in transforming complex problems into elegant, usable software solutions.
//                 </p>
//               </div>
//               <div className="mt-12 md:mt-0 relative">
//                 <div className="w-64 h-64 relative animate-spin-slow opacity-50">
//                   <div className="absolute inset-0 border-2 border-dashed border-green-500/30 rounded-full"></div>
//                   <div className="absolute inset-4 border-2 border-dashed border-green-500/60 rounded-full rotate-45"></div>
//                   <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 text-green-500">
//                      <Cpu size={48} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Section>

//           <Section title="Technical Arsenal" icon={<Terminal />}>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
//               <TechCard title="Core & Languages" icon={<Code2 className="text-blue-400" />} skills={["TypeScript", "JavaScript", "Python", "SQL", "C++", "HTML/CSS"]} />
//               <TechCard title="Frontend Engineering" icon={<Boxes className="text-purple-400" />} skills={["React.js", "Next.js 14", "R3F", "Tailwind CSS", "Framer Motion", "Redux"]} />
//               <TechCard title="Backend & Data" icon={<Database className="text-orange-400" />} skills={["Node.js", "FastAPI", "PostgreSQL", "MongoDB", "Docker", "DSA"]} />
//             </div>
//           </Section>

//           <Section title="System Deployments" icon={<Boxes />}>
//              <p className="text-gray-400 mb-12 font-mono">// Selected recent work demonstrating full-stack capabilities.</p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <ProjectCard title="Retro-Futurist Portfolio 3D" description="Interactive portfolio with scroll-linked reveals." tech={["R3F", "WebGL", "TS"]} color="green" />
//               <ProjectCard title="Intelligent Data Pipeline" description="Python backend for real-time analytics." tech={["Python", "FastAPI", "Pandas"]} color="blue" />
//                <ProjectCard title="E-Commerce Microservices" description="Scalable backend architecture using Node.js." tech={["Node", "Docker", "Postgres"]} color="purple" />
//               <ProjectCard title="State Management Engine" description="Complex implementation of game logic patterns." tech={["React Hooks", "Algorithms"]} color="orange" />
//             </div>
//           </Section>

//           <Section>
//             <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center relative overflow-hidden">
//                <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent pointer-events-none"></div>
//               <h2 className="text-3xl font-bold text-white mb-6">Initialize Connection</h2>
//               <div className="flex flex-wrap justify-center gap-4">
//                 <ContactBtn icon={<Mail />} label="ketangaikwad2905@gmail.com" href="mailto:ketangaikwad2905@gmail.com" />
//                 <ContactBtn icon={<Linkedin />} label="LinkedIn" href="#" />
//                 <ContactBtn icon={<Github />} label="GitHub" href="#" />
//               </div>
//                <div className="mt-12 pt-8 border-t border-white/10 text-gray-500 font-mono text-sm">
//                   <p>Copyright © 2026 Ketan. All Rights Reserved.</p>
//                </div>
//             </div>
//           </Section>
//         </div>
//       </motion.div>
//     </main>
//   );
// }

// // Sub-components remain the same but use React.memo where necessary for stability
// function Section({ children, title, icon }: { children: React.ReactNode, title?: string, icon?: React.ReactNode }) {
//    const ref = useRef(null);
//    const isInView = useInView(ref, { once: true, margin: "-100px" });

//    return (
//       <motion.section
//          ref={ref}
//          initial={{ opacity: 0, y: 50 }}
//          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
//          transition={{ duration: 0.8, ease: "easeOut" }}
//          className="py-24"
//       >
//          {title && (
//             <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-white">
//                <span className="text-green-500">{icon}</span> {title}
//             </h2>
//          )}
//          {children}
//       </motion.section>
//    )
// }

// function TechCard({ title, skills, icon }: { title: string; skills: string[], icon: React.ReactNode }) {
//   return (
//     <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-green-500/30 transition-colors group">
//       <div className="mb-4 p-3 bg-white/5 rounded-lg w-fit group-hover:scale-110 transition-transform">{icon}</div>
//       <h3 className="text-xl font-semibold mb-4 text-white">{title}</h3>
//       <ul className="space-y-2">
//         {skills.map((skill) => (
//           <li key={skill} className="text-gray-400 text-sm font-mono flex items-center before:content-['>'] before:text-green-500 before:mr-2">{skill}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// function ProjectCard({ title, description, tech, color }: { title: string, description: string, tech: string[], color: "green" | "blue" | "purple" | "orange" }) {
//    const colorMap = {
//       green: "hover:border-green-500/50 before:bg-green-500",
//       blue: "hover:border-blue-500/50 before:bg-blue-500",
//       purple: "hover:border-purple-500/50 before:bg-purple-500",
//       orange: "hover:border-orange-500/50 before:bg-orange-500",
//    }
//    return (
//       <motion.div whileHover={{ y: -5, scale: 1.02 }} className={cn("relative p-8 rounded-2xl border border-white/10 bg-[#0c0c0c] overflow-hidden transition-all group", colorMap[color])}>
//          <div className={cn("absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity", colorMap[color].split(' ')[1])}></div>
//          <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors">{title}</h3>
//          <p className="text-gray-400 mb-6 text-sm">{description}</p>
//          <div className="flex flex-wrap gap-2 mt-auto">
//             {tech.map(t => (<span key={t} className="px-3 py-1 text-[10px] font-mono border border-white/20 rounded-full text-gray-300">{t}</span>))}
//          </div>
//       </motion.div>
//    )
// }

// function ContactBtn({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
//    return (
//       <a href={href} className="flex items-center gap-3 px-6 py-3 rounded-lg border border-white/20 bg-white/5 hover:bg-green-500 hover:text-black hover:border-green-500 transition-all duration-300 font-mono text-sm">
//         {icon} <span>{label}</span>
//       </a>
//    )
// }


// import React, { Suspense, useRef, useMemo } from "react";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import {
//   useGLTF,
//   Environment,
//   Float,
//   Text,
//   MeshReflectorMaterial,
//   SpotLight,
// } from "@react-three/drei";
// import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
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
// } from "lucide-react";
// import * as THREE from "three";
// import { clsx, type ClassValue } from "clsx";
// import { twMerge } from "tailwind-merge";

// function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }


// function VintageComputers({ modelPath }: { modelPath: string }) {
//   const { scene } = useGLTF(modelPath);
//   const groupRef = useRef<THREE.Group>(null);
//   const { viewport } = useThree();

//   const responsiveScale = viewport.width < 7 ? 0.8 : 1.5;


// useFrame((state) => {
//     if (!groupRef.current) return;
    
//     const t = state.clock.getElapsedTime();

//     // 1. Horizontal rotation (Y-axis) - Side to side movement
//     const targetY = (state.mouse.x * Math.PI) / 10 + Math.sin(t / 4) / 10;
//     groupRef.current.rotation.y = THREE.MathUtils.lerp(
//       groupRef.current.rotation.y,
//       targetY,
//       0.05
//     );

//     // 2. Vertical rotation (X-axis) - THE CORRECTED FIX
//     // -0.05: This is the limit for tilting BACK (prevents showing the bottom)
//     // 0.5: This is the limit for tilting FORWARD (allows showing the top/screens)
//     const rawX = (state.mouse.y * Math.PI) / 20;
//     const clampedX = THREE.MathUtils.clamp(rawX, -0.05, 0.5); 

//     groupRef.current.rotation.x = THREE.MathUtils.lerp(
//       groupRef.current.rotation.x,
//       clampedX,
//       0.05
//     );
//   });

//   return (
//     <group ref={groupRef} position={[0, -0.5, 0]} scale={responsiveScale}>
//       <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
//         <pointLight position={[0, 1, 1]} distance={5} intensity={2} color="#00ff41" />
//         <primitive object={scene} position={[0, -0.8, 0]}/>
//       </Float>
//     </group>
//   );
// }

// function ReflectiveFloor() {
//   return (
//     <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
//       <planeGeometry args={[50, 50]} />
//       <MeshReflectorMaterial
//         blur={[300, 100]}
//         resolution={512} // OPTIMIZED from 2048 to 512 for smooth performance
//         mixBlur={1}
//         mixStrength={80}
//         roughness={0.8}
//         depthScale={1.2}
//         minDepthThreshold={0.4}
//         maxDepthThreshold={1.4}
//         color="#050505"
//         metalness={0.5}
//         mirror={0.75}
//       />
//     </mesh>
//   );
// }

// export default function SoftwarePortfolioPage() {
//   const containerRef = useRef<HTMLDivElement>(null);

//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end end"],
//   });

//   const clipScale = useTransform(scrollYProgress, [0, 0.15], [0, 150]);
//   const smoothClipScale = useSpring(clipScale, { stiffness: 80, damping: 25 }); // Adjusted for smoother transitions

//   const clipPathValue = useTransform(
//     smoothClipScale,
//     (v) => `circle(${v}% at 50% 50%)`
//   );

//   return (
//     <main
//       ref={containerRef}
//       className="relative bg-[#050505] text-gray-200 selection:bg-green-500/40 font-sans min-h-[200vh]"
//     >
//       <div className="fixed inset-0 z-0 h-screen w-full">
//         {/* Added dpr and optimized gl settings for lag-free rendering */}
//         <Canvas 
//           shadows 
//           dpr={[1, 1.5]} 
//           gl={{ antialias: false, powerPreference: "high-performance" }}
//           camera={{ position: [0, 0, 8], fov: 40 }}
//         >
//           <color attach="background" args={["#020202"]} />
//           <fog attach="fog" args={["#020202", 5, 20]} />
//           <Suspense fallback={<Text color="#00ff41" position={[0, 0, 0]}>INITIALIZING CORE...</Text>}>
//             <Environment preset="city" />
//             <ambientLight intensity={0.2} />
//             <SpotLight position={[-5, 5, 5]} angle={0.3} penumbra={1} intensity={2} castShadow color="#ffffff" />
//             <SpotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={1} color="#00ff41" />
//             <VintageComputers modelPath="/old_computers.glb" />
//             <ReflectiveFloor />
//           </Suspense>
//         </Canvas>
        
//         <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none select-none">
//           <motion.h1
//             initial={{ opacity: 0, letterSpacing: "10px" }}
//             animate={{ opacity: 1, letterSpacing: "2px" }}
//             transition={{ duration: 1.5, ease: "easeOut" }}
//             className="text-5xl md:text-8xl font-black text-white mix-blend-overlay"
//           >
//             KETAN
//           </motion.h1>
//            <motion.div
//              initial={{ opacity: 0, y: 20 }}
//              animate={{ opacity: 1, y: 0 }}
//              transition={{ delay: 1 }}
//              className="absolute bottom-10 animate-bounce text-green-500"
//            >
//              <ArrowDown />
//            </motion.div>
//         </div>
//       </div>

//       <motion.div
//         style={{ 
//           clipPath: clipPathValue, 
//           WebkitClipPath: clipPathValue,
//           willChange: "clip-path" // Force GPU acceleration for the reveal animation
//         }}
//         className="relative z-20 w-full bg-[#0a0a0a] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-auto transform-gpu"
//       >
//         <div className="h-screen w-full flex items-center justify-center">
//            <p className="text-green-500 font-mono animate-pulse">
//              [ SYSTEM BREACH DETECTED - SCROLL TO ACCESS ]
//            </p>
//         </div>

//         <div className="max-w-5xl mx-auto px-6 pb-32">
//           <Section>
//             <div className="md:flex items-center gap-12">
//               <div className="flex-1">
//                  <h2 className="text-green-500 font-mono mb-2 text-sm">
//                   &gt; whoami
//                 </h2>
//                 <h3 className="text-4xl font-bold mb-6 text-white">
//                   Software Engineer & <br />
//                   Creative Technologist.
//                 </h3>
//                 <p className="text-gray-400 text-lg leading-relaxed">
//                   I don't just build websites; I architect diverse systems. 
//                   With a background in <span className="text-white font-semibold">Data Science (B.Tech CSE)</span>, 
//                   I blend robust backend logic with high-performance, interactive frontend implementations.
//                   I specialize in transforming complex problems into elegant, usable software solutions.
//                 </p>
//               </div>
//               <div className="mt-12 md:mt-0 relative">
//                 <div className="w-64 h-64 relative animate-spin-slow opacity-50">
//                   <div className="absolute inset-0 border-2 border-dashed border-green-500/30 rounded-full"></div>
//                   <div className="absolute inset-4 border-2 border-dashed border-green-500/60 rounded-full rotate-45"></div>
//                   <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 text-green-500">
//                      <Cpu size={48} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Section>

//           <Section title="Technical Arsenal" icon={<Terminal />}>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
//               <TechCard title="Core & Languages" icon={<Code2 className="text-blue-400" />} skills={["TypeScript", "JavaScript", "Python", "SQL", "C++", "HTML/CSS"]} />
//               <TechCard title="Frontend Engineering" icon={<Boxes className="text-purple-400" />} skills={["React.js", "Next.js 14", "R3F", "Tailwind CSS", "Framer Motion", "Redux"]} />
//               <TechCard title="Backend & Data" icon={<Database className="text-orange-400" />} skills={["Node.js", "FastAPI", "PostgreSQL", "MongoDB", "Docker", "DSA"]} />
//             </div>
//           </Section>

//           <Section title="System Deployments" icon={<Boxes />}>
//              <p className="text-gray-400 mb-12 font-mono">// Selected recent work demonstrating full-stack capabilities.</p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <ProjectCard title="Retro-Futurist Portfolio 3D" description="Interactive portfolio with scroll-linked reveals." tech={["R3F", "WebGL", "TS"]} color="green" />
//               <ProjectCard title="Intelligent Data Pipeline" description="Python backend for real-time analytics." tech={["Python", "FastAPI", "Pandas"]} color="blue" />
//                <ProjectCard title="E-Commerce Microservices" description="Scalable backend architecture using Node.js." tech={["Node", "Docker", "Postgres"]} color="purple" />
//               <ProjectCard title="State Management Engine" description="Complex implementation of game logic patterns." tech={["React Hooks", "Algorithms"]} color="orange" />
//             </div>
//           </Section>

//           <Section>
//             <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center relative overflow-hidden">
//                <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent pointer-events-none"></div>
//               <h2 className="text-3xl font-bold text-white mb-6">Initialize Connection</h2>
//               <div className="flex flex-wrap justify-center gap-4">
//                 <ContactBtn icon={<Mail />} label="ketangaikwad2905@gmail.com" href="mailto:ketangaikwad2905@gmail.com" />
//                 <ContactBtn icon={<Linkedin />} label="LinkedIn" href="#" />
//                 <ContactBtn icon={<Github />} label="GitHub" href="#" />
//               </div>
//                <div className="mt-12 pt-8 border-t border-white/10 text-gray-500 font-mono text-sm">
//                   <p>Copyright © 2026 Ketan. All Rights Reserved.</p>
//                </div>
//             </div>
//           </Section>
//         </div>
//       </motion.div>
//     </main>
//   );
// }

// // Sub-components remain the same but use React.memo where necessary for stability
// function Section({ children, title, icon }: { children: React.ReactNode, title?: string, icon?: React.ReactNode }) {
//    const ref = useRef(null);
//    const isInView = useInView(ref, { once: true, margin: "-100px" });

//    return (
//       <motion.section
//          ref={ref}
//          initial={{ opacity: 0, y: 50 }}
//          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
//          transition={{ duration: 0.8, ease: "easeOut" }}
//          className="py-24"
//       >
//          {title && (
//             <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-white">
//                <span className="text-green-500">{icon}</span> {title}
//             </h2>
//          )}
//          {children}
//       </motion.section>
//    )
// }

// function TechCard({ title, skills, icon }: { title: string; skills: string[], icon: React.ReactNode }) {
//   return (
//     <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-green-500/30 transition-colors group">
//       <div className="mb-4 p-3 bg-white/5 rounded-lg w-fit group-hover:scale-110 transition-transform">{icon}</div>
//       <h3 className="text-xl font-semibold mb-4 text-white">{title}</h3>
//       <ul className="space-y-2">
//         {skills.map((skill) => (
//           <li key={skill} className="text-gray-400 text-sm font-mono flex items-center before:content-['>'] before:text-green-500 before:mr-2">{skill}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// function ProjectCard({ title, description, tech, color }: { title: string, description: string, tech: string[], color: "green" | "blue" | "purple" | "orange" }) {
//    const colorMap = {
//       green: "hover:border-green-500/50 before:bg-green-500",
//       blue: "hover:border-blue-500/50 before:bg-blue-500",
//       purple: "hover:border-purple-500/50 before:bg-purple-500",
//       orange: "hover:border-orange-500/50 before:bg-orange-500",
//    }
//    return (
//       <motion.div whileHover={{ y: -5, scale: 1.02 }} className={cn("relative p-8 rounded-2xl border border-white/10 bg-[#0c0c0c] overflow-hidden transition-all group", colorMap[color])}>
//          <div className={cn("absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity", colorMap[color].split(' ')[1])}></div>
//          <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors">{title}</h3>
//          <p className="text-gray-400 mb-6 text-sm">{description}</p>
//          <div className="flex flex-wrap gap-2 mt-auto">
//             {tech.map(t => (<span key={t} className="px-3 py-1 text-[10px] font-mono border border-white/20 rounded-full text-gray-300">{t}</span>))}
//          </div>
//       </motion.div>
//    )
// }

// function ContactBtn({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
//    return (
//       <a href={href} className="flex items-center gap-3 px-6 py-3 rounded-lg border border-white/20 bg-white/5 hover:bg-green-500 hover:text-black hover:border-green-500 transition-all duration-300 font-mono text-sm">
//         {icon} <span>{label}</span>
//       </a>
//    )
// }


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
// import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
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
//   Zap
// } from "lucide-react";
// import * as THREE from "three";
// import { clsx, type ClassValue } from "clsx";
// import { twMerge } from "tailwind-merge";

// function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

// // --- NAVIGATION BAR ---
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
//     <nav className={cn(
//       "fixed top-0 w-full z-[100] transition-all duration-300 border-b",
//       scrolled ? "bg-[#050505]/80 backdrop-blur-md border-white/10 py-4" : "bg-transparent border-transparent py-6"
//     )}>
//       <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
//         <motion.div 
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="text-xl font-bold tracking-tighter text-white"
//         >
//           KETAN<span className="text-green-500">.dev</span>
//         </motion.div>

//         {/* Desktop Nav */}
//         <div className="hidden md:flex gap-8 items-center">
//           {navLinks.map((link) => (
//             <a key={link.name} href={link.href} className="text-sm font-mono text-gray-400 hover:text-green-500 transition-colors uppercase tracking-widest">
//               {link.name}
//             </a>
//           ))}
//           <a href="mailto:ketangaikwad2905@gmail.com" className="px-4 py-2 bg-green-500/10 border border-green-500/50 text-green-500 text-xs font-mono rounded-md hover:bg-green-500 hover:text-black transition-all">
//             GET_IN_TOUCH
//           </a>
//         </div>

//         {/* Mobile Toggle */}
//         <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
//           {isOpen ? <X /> : <Menu />}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div 
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             className="md:hidden bg-[#0a0a0a] border-b border-white/10 overflow-hidden"
//           >
//             <div className="flex flex-col p-6 gap-4">
//               {navLinks.map((link) => (
//                 <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-lg font-mono text-gray-300">
//                   &gt; {link.name}
//                 </a>
//               ))}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// }

// // --- 3D COMPONENTS ---
// function VintageComputers({ modelPath }: { modelPath: string }) {
//   const { scene } = useGLTF(modelPath);
//   const groupRef = useRef<THREE.Group>(null);
//   const { viewport } = useThree();
//   const responsiveScale = viewport.width < 7 ? 0.8 : 1.3;

//   useFrame((state) => {
//     if (!groupRef.current) return;
//     const t = state.clock.getElapsedTime();
//     const targetY = (state.mouse.x * Math.PI) / 10 + Math.sin(t / 4) / 10;
//     groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);

//     // Clamped X-axis to prevent seeing the flat bottom
//     const rawX = (state.mouse.y * Math.PI) / 20;
//     const clampedX = THREE.MathUtils.clamp(rawX, -0.05, 0.5); 
//     groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, clampedX, 0.05);
//   });

//   return (
//     <group ref={groupRef} position={[0, -0.5, 0]} scale={responsiveScale}>
//       <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
//         <pointLight position={[0, 1, 1]} distance={5} intensity={2} color="#00ff41" />
//         <primitive object={scene} position={[0, -0.8, 0]}/>
//       </Float>
//     </group>
//   );
// }

// function ReflectiveFloor() {
//   return (
//     <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
//       <planeGeometry args={[50, 50]} />
//       <MeshReflectorMaterial
//         blur={[300, 100]}
//         resolution={512}
//         mixBlur={1}
//         mixStrength={80}
//         roughness={0.8}
//         depthScale={1.2}
//         minDepthThreshold={0.4}
//         maxDepthThreshold={1.4}
//         color="#050505"
//         metalness={0.5}
//         mirror={0.75}
//       />
//     </mesh>
//   );
// }

// // --- MAIN PAGE ---
// export default function SoftwarePortfolioPage() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
//   const clipScale = useTransform(scrollYProgress, [0, 0.15], [0, 150]);
//   const smoothClipScale = useSpring(clipScale, { stiffness: 80, damping: 25 });
//   const clipPathValue = useTransform(smoothClipScale, (v) => `circle(${v}% at 50% 50%)`);

//   return (
//     <main ref={containerRef} className="relative bg-[#050505] text-gray-200 selection:bg-green-500/40 font-sans min-h-[200vh]">
//       <Navbar />

//       {/* HERO / 3D LAYER */}
//       <div className="fixed inset-0 z-0 h-screen w-full">
//         <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: "high-performance" }} camera={{ position: [0, 0, 8], fov: 40 }}>
//           <color attach="background" args={["#020202"]} />
//           <fog attach="fog" args={["#020202", 5, 20]} />
//           <Suspense fallback={<Text color="#00ff41">INITIALIZING...</Text>}>
//             <Environment preset="city" />
//             <ambientLight intensity={0.2} />
//             <SpotLight position={[-5, 5, 5]} angle={0.3} penumbra={1} intensity={2} castShadow color="#ffffff" />
//             <SpotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={1} color="#00ff41" />
//             <VintageComputers modelPath="/old_computers.glb" />
//             <ReflectiveFloor />
//           </Suspense>
//         </Canvas>
        
//         <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none select-none px-4 text-center">
//           <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }} className="text-6xl md:text-9xl font-black text-white mix-blend-overlay">
//             KETAN
//           </motion.h1>
//           <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-10 text-green-500">
//              <ArrowDown />
//           </motion.div>
//         </div>
//       </div>

//       {/* CONTENT REVEAL LAYER */}
//       <motion.div
//         style={{ clipPath: clipPathValue, WebkitClipPath: clipPathValue, willChange: "clip-path" }}
//         className="relative z-20 w-full bg-[#0a0a0a] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-auto transform-gpu"
//       >
//         <div className="h-screen w-full flex items-center justify-center">
//            <p className="text-green-500 font-mono animate-pulse text-sm md:text-base">[ SCROLL_TO_ACCESS_CORE ]</p>
//         </div>

//         <div className="max-w-6xl mx-auto px-6 pb-32">
//           {/* ABOUT */}
//           <Section id="about">
//             <div className="grid md:grid-cols-2 gap-12 items-center">
//               <div>
//                 <h2 className="text-green-500 font-mono mb-2 text-sm">&gt; whoami</h2>
//                 <h3 className="text-4xl font-bold mb-6 text-white leading-tight">Software Engineer & Creative Technologist.</h3>
//                 <p className="text-gray-400 text-lg leading-relaxed">
//                   B.Tech in <span className="text-white">CSE (Data Science)</span>. I specialize in building complex systems where 
//                   robust performance meets immersive user experience.
//                 </p>
//               </div>
//               <div className="flex justify-center">
//                 <div className="w-48 h-48 md:w-64 md:h-64 relative">
//                   <div className="absolute inset-0 border border-green-500/20 rounded-full animate-spin-slow" />
//                   <div className="absolute inset-0 flex items-center justify-center text-green-500">
//                     <Cpu size={60} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Section>

//           {/* TECHNICAL ARSENAL (Rectified Design) */}
//           <Section id="skills" title="Technical Arsenal" icon={<Zap className="w-6 h-6" />}>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               <SkillCard 
//                 category="Engine_Core" 
//                 icon={<Code2 className="text-blue-400" />} 
//                 skills={["TypeScript", "JavaScript", "Python", "C++", "SQL"]} 
//                 status="OPTIMIZED"
//               />
//               <SkillCard 
//                 category="Visual_Interface" 
//                 icon={<Layers className="text-purple-400" />} 
//                 skills={["React / Next.js", "Three.js / R3F", "Tailwind CSS", "Framer Motion"]} 
//                 status="HIGH_PERF"
//               />
//               <SkillCard 
//                 category="Infrastructure" 
//                 icon={<Database className="text-orange-400" />} 
//                 skills={["Node.js", "FastAPI", "PostgreSQL", "MongoDB", "Docker"]} 
//                 status="STABLE"
//               />
//             </div>
//           </Section>

//           {/* PROJECTS */}
//           <Section id="projects" title="System Deployments" icon={<Boxes className="w-6 h-6" />}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <ProjectCard title="3D Retro-Futurist Portfolio" description="Highly interactive 3D portfolio using R3F and scroll-linked animations." tech={["Next.js", "Three.js", "TS"]} color="green" />
//               <ProjectCard title="Intelligent Data Pipeline" description="Real-time data processing backend with predictive analytics." tech={["Python", "FastAPI", "ML"]} color="blue" />
//               <ProjectCard title="E-Commerce Architecture" description="Microservices-based backend handling high-volume transactions." tech={["Node.js", "Docker", "Postgres"]} color="purple" />
//               <ProjectCard title="Solar System Visualizer" description="Interactive 3D space simulation with real physics data." tech={["Three.js", "GLSL", "React"]} color="orange" />
//             </div>
//           </Section>

//           {/* CONTACT */}
//           <Section id="contact">
//             <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl p-8 md:p-16 text-center">
//               <h2 className="text-4xl font-bold text-white mb-4">Initialize Connection</h2>
//               <p className="text-gray-400 mb-10 max-w-md mx-auto">Available for software engineering roles and creative collaborations.</p>
//               <div className="flex flex-wrap justify-center gap-4">
//                 <ContactBtn icon={<Mail />} label="Email" href="mailto:ketangaikwad2905@gmail.com" />
//                 <ContactBtn icon={<Linkedin />} label="LinkedIn" href="#" />
//                 <ContactBtn icon={<Github />} label="GitHub" href="#" />
//               </div>
//               <p className="mt-16 text-gray-600 font-mono text-xs tracking-widest uppercase">© 2026 Ketan All Rights Reserved // System_Online</p>
//             </div>
//           </Section>
//         </div>
//       </motion.div>
//     </main>
//   );
// }

// // --- SUB-COMPONENTS ---

// function SkillCard({ category, icon, skills, status }: { category: string, icon: React.ReactNode, skills: string[], status: string }) {
//   return (
//     <motion.div 
//       whileHover={{ y: -5 }}
//       className="bg-[#111] border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-green-500/30 transition-all"
//     >
//       <div className="flex justify-between items-start mb-6">
//         <div className="p-3 bg-white/5 rounded-lg text-green-500">{icon}</div>
//         <span className="text-[10px] font-mono text-green-500 px-2 py-1 bg-green-500/10 rounded border border-green-500/20">{status}</span>
//       </div>
//       <h3 className="text-white font-mono text-sm mb-4 tracking-tighter uppercase font-bold text-gray-500">[{category}]</h3>
//       <div className="flex flex-wrap gap-2">
//         {skills.map(skill => (
//           <span key={skill} className="text-xs text-gray-400 font-mono px-2 py-1 bg-white/5 rounded">
//             {skill}
//           </span>
//         ))}
//       </div>
//       <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//     </motion.div>
//   );
// }

// function Section({ children, title, icon, id }: { children: React.ReactNode, title?: string, icon?: React.ReactNode, id?: string }) {
//   const ref = useRef(null);
//   const isInView = useInView(ref, { once: true, margin: "-100px" });

//   return (
//     <motion.section id={id} ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="py-24 scroll-mt-20">
//       {title && (
//         <h2 className="text-3xl font-bold mb-12 flex items-center gap-4 text-white">
//           <span className="p-2 bg-green-500/10 rounded-lg text-green-500">{icon}</span>
//           {title}
//         </h2>
//       )}
//       {children}
//     </motion.section>
//   );
// }

// function ProjectCard({ title, description, tech, color }: { title: string, description: string, tech: string[], color: string }) {
//   const colors: Record<string, string> = {
//     green: "hover:border-green-500/50",
//     blue: "hover:border-blue-400/50",
//     purple: "hover:border-purple-500/50",
//     orange: "hover:border-orange-500/50",
//   };
//   return (
//     <motion.div whileHover={{ scale: 1.01 }} className={cn("bg-[#0c0c0c] border border-white/5 p-8 rounded-2xl group transition-all", colors[color])}>
//       <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-500 transition-colors">{title}</h3>
//       <p className="text-gray-400 mb-6 text-sm leading-relaxed">{description}</p>
//       <div className="flex flex-wrap gap-2">
//         {tech.map(t => <span key={t} className="text-[10px] font-mono text-gray-500 px-2 py-1 border border-white/10 rounded uppercase">{t}</span>)}
//       </div>
//     </motion.div>
//   );
// }

// function ContactBtn({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
//   return (
//     <a href={href} className="flex items-center gap-3 px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-green-500 hover:text-black hover:border-green-500 transition-all font-mono text-sm">
//       {icon} <span>{label}</span>
//     </a>
//   );
// }


"use client";

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
  const { viewport } = useThree();
  const responsiveScale = viewport.width < 7 ? 0.75 : 1.3;

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

        <div className="max-w-6xl mx-auto px-6 pb-40">
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

          <Section id="projects" title="System Deployments" icon={<Boxes />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <ProjectCard title="3D Retro Portfolio" description="Highly interactive 3D portfolio using R3F and scroll-linked animations." tech={["Next.js", "R3F"]} color="green" />
              <ProjectCard title="Intelligent Pipeline" description="Real-time data processing backend with predictive analytics." tech={["Python", "FastAPI"]} color="blue" />
              <ProjectCard title="Solar System Viz" description="Interactive 3D space simulation with real physics data." tech={["Three.js", "GLSL"]} color="orange" />
              <ProjectCard title="Microservices Core" description="Scalable architecture handling high-volume transactions." tech={["Node", "Docker"]} color="purple" />
            </div>
          </Section>

          <Section id="contact">
            <div className="bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-10 md:p-24 text-center">
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter">Initialize Connection</h2>
              <p className="text-gray-500 mb-12 max-w-sm mx-auto text-sm md:text-base">Ready to architect high-performance digital solutions. Let's build.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <ContactBtn icon={<Mail />} label="Email" href="mailto:ketangaikwad2905@gmail.com" />
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

function ProjectCard({ title, description, tech, color }: { title: string, description: string, tech: string[], color: string }) {
  return (
    <div className="bg-[#121212] border border-white/[0.03] p-10 rounded-[2rem] group hover:bg-[#161616] transition-all duration-500">
      <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-green-500 transition-colors tracking-tight">{title}</h3>
      <p className="text-gray-500 mb-8 text-sm leading-relaxed">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tech.map(t => <span key={t} className="text-[10px] font-mono text-gray-400 px-3 py-1 border border-white/10 rounded-full uppercase tracking-tighter">{t}</span>)}
      </div>
    </div>
  );
}

function ContactBtn({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
  return (
    <a href={href} className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-green-500 hover:text-black hover:border-green-500 transition-all font-mono text-xs uppercase tracking-widest">
      {icon} <span>{label}</span>
    </a>
  );
}


