import { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  MeshReflectorMaterial,
  SpotLight,
} from "@react-three/drei";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  Database,
  Code2,
  Github,
  Linkedin,
  Mail,
  ArrowDown,
  Layers,
  Boxes,
  Trophy,
} from "lucide-react";
import Section from "./Section";
import HackathonItem from "./HackathonItem";
import DotClockExperiment from "./Dotspace";

import { VintageComputers } from "./VintageComputers";
import { LoadingScreen } from "./LoadingScreen";
import { Navbar } from "./Navbar";
import { SkillCard } from "./SkillCard";
import FeaturedProject from "./ProjectCard";
import { ContactBtn } from "./ContactBtn";
import { cn } from "../utils";
import Render from "./Model";
import Extracurricular from "./Extracurricular";

const SKILLS_DATA = [
  {
    category: "Core_Logic",
    icon: <Code2 className="text-blue-400" />,
    skills: ["TypeScript", "JavaScript", "Python", "SQL"],
  },
  {
    category: "Visual_Sys",
    icon: <Layers className="text-purple-400" />,
    skills: ["React", "Next.js", "Three.js", "Motion"],
  },
  {
    category: "Ops_Infrastructure",
    icon: <Database className="text-orange-400" />,
    skills: ["Node.js", "FastAPI", "Docker", "Postgres"],
  },
];

const featuredProjects = [
  {
    title: "Fincognia — Autonomous Agentic Finance",
    desc: "An AI-driven financial co-pilot for gig workers that predicts liquidity risks with 85% accuracy, autonomously prevents EMI defaults, optimizes insurance and tax workflows, and enables real-time credit simulations to ensure long-term financial solvency.",
    tech: [
      "Machine Learning",
      "Agentic AI",
      "Generative AI",
      "Financial Modeling",
      "Predictive Analytics",
      "Tax & Insurance Automation",
    ],
    side: "left",
    imagesrc: "/project/fincogina.png",
    demolink: "https://fincogina.vercel.app/",
  },
  {
    title: "CyberSecure — AI-Powered Network Intrusion Detection",
    desc: "An end-to-end AI-powered NIDS achieving 98% attack detection accuracy using XGBoost, explainable AI (SHAP + LLM-generated insights), and blockchain-backed threat integrity via Merkle Trees and RSA-2048 signatures, delivering real-time, tamper-proof network security intelligence.",
    tech: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Python",
      "XGBoost",
      "SHAP (Explainable AI)",
      "FastAPI",
      "Blockchain (Merkle Trees)",
      "RSA-2048",
      "Network Security",
    ],
    side: "right",
    imagesrc: "/project/cyberSecure.png",
    demolink: "https://redact-cybersecure-tau.vercel.app/",
  },
];
const hackathons = [
  {
    title: "Hackxios 2K25",
    award: "Winner (Innovation Track)",
    date: "DEC 2025",
    desc: "Built Fincognia, an autonomous agentic finance co-pilot for gig workers that predicts liquidity risks with 85% accuracy, autonomously prevents EMI defaults, optimizes insurance and tax workflows, and improves long-term credit health through real-time simulations.",
  },
];

const CONTACT_DATA = [
  {
    icon: <Mail />,
    label: "Email",
    href: "mailto:ketangaikwad2905@gmail.com",
  },
  { icon: <Linkedin />, label: "LinkedIn", href: "https://www.linkedin.com/in/ketan-gaikwad-073171320/" },
  { icon: <Github />, label: "GitHub", href: "https://github.com/ketan-2905" },
];

const letterStyles = [
  { font: "font-astroz", color: "text-green-400" },
  { font: "font-fishel", color: "text-cyan-400" },
  { font: "font-monoton", color: "text-white" },
  { font: "font-vt323", color: "text-green-500" },
  { font: "font-the-signature", color: "text-green-300" },
];
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
    (v) => `circle(${v}% at 50% 50%)`,
  );

  const handleScrollDown = () =>
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });

  return (
    <main
      ref={containerRef}
      // Font change
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
          {/* <motion.div
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
          </h1> */}

          {/* WELCOME TO MY SECTION */}
          <motion.div className="flex gap-2 mb-4">
            {"WELCOME TO MY ".split("").map((l, i) => {
              const style = letterStyles[i % letterStyles.length];
              return (
                <span
                  key={i}
                  className={cn(
                    style.font,
                    style.color,
                    "md:text-[15px] text-[12px] tracking-[0.1em] transition-colors duration-500 text-white",
                  )}
                >
                  {l}
                </span>
              );
            })}
          </motion.div>

          {/* PORTFOLIO SECTION */}
          <h1 className="flex overflow-y-hidden text-6xl md:text-9xl font-black mix-blend-difference tracking-tighter">
            {"PORTFOLIO".split("").map((char, i) => {
              const style = letterStyles[i % letterStyles.length];

              return (
                <motion.span
                  key={i}
                  initial={{ y: "110%", opacity: 0 }} // Use percentages for cleaner entry
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 3.5 + i * 0.1,
                    type: "spring",
                    stiffness: 70, // Slightly lower stiffness for smoother movement
                    damping: 15,
                  }}
                  // The Secret Sauce: transform-gpu and will-change
                  className={cn(
                    style.font,
                    style.color,
                    i === 4 ? "font-[10]" : "",
                    "hover:text-white transition-colors cursor-default transform-gpu",
                  )}
                  style={{
                    willChange: "transform, opacity",
                    // Only apply textShadow if the animation is basically finished
                    // Or keep it subtle like this:
                    textShadow:
                      i % 2 === 0
                        ? "0 4px 12px rgba(34, 197, 94, 0.3)"
                        : "none",
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
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
        <div className="h-screen w-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 pb-1">
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
                {/* <div className="absolute inset-0 bg-green-500/5 blur-[100px] rounded-full" />
                <div className="w-56 h-56 md:w-80 md:h-80 relative flex items-center justify-center border border-white/5 rounded-3xl backdrop-blur-3xl">
                  <Cpu size={80} className="text-green-500 animate-pulse" />
                  <div className="absolute -top-4 -right-4 bg-green-500 text-black px-2 py-1 text-[10px] font-bold rounded">
                    LIVE_CORE
                  </div>
                </div> */}
                <Render />
              </div>
            </div>
          </Section>

          <Section id="skills" title="Technical Arsenal">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {SKILLS_DATA.map((skill, index) => (
                <SkillCard key={index} {...skill} />
              ))}
            </div>
          </Section>

          {/* SECTION 3: PROJECTS (Split Layout) */}
          <Section id="projects" title="Featured Projects" icon={<Boxes />}>
            {featuredProjects.map((project, index) => (
              <FeaturedProject
                key={index}
                title={project.title}
                desc={project.desc}
                tech={project.tech}
                side={project.side}
                imagesrc={project.imagesrc}
                demolink={project.demolink}
              />
            ))}
          </Section>

          {/* SECTION 4: HACKATHONS (Timeline) */}
          <Section id="hackathons" title="Hackathon Logs" icon={<Trophy />}>
            <div className="max-w-4xl mx-auto">
              {hackathons.map((hackathon, index) => (
                <HackathonItem
                  key={index}
                  title={hackathon.title}
                  award={hackathon.award}
                  date={hackathon.date}
                  desc={hackathon.desc}
                />
              ))}
            </div>
          </Section>

          <DotClockExperiment />

          <Extracurricular />

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
                {CONTACT_DATA.map((contact, index) => (
                  <ContactBtn key={index} {...contact} />
                ))}
              </div>
            </div>
          </Section>
        </div>
      </motion.div>
    </main>
  );
}
