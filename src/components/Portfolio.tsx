import { useRef, useState } from "react";

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
  Layers,
  Boxes,
  Trophy,
  Terminal,
  Cpu,
} from "lucide-react";
import Section from "./Section";
import HackathonItem from "./HackathonItem";
import DotClockExperiment from "./Dotspace";

import FeaturedProject from "./FeaturedProject";
import Extracurricular from "./Extracurricular";
import HeoricSection from "./HeoricSection";
import AboutMe from "./AboutMe";
import ContactBtn from "./ContactBtn";
import LoadingScreen from "./LoadingScreen";
import Navbar from "./Navbar";
import SkillCard from "./SkillCard";

const SkillData = [
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

const FeaturedProjects = [
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
const Hackathons = [
  {
    title: "Hackxios 2K25",
    award: "Winner (Innovation Track)",
    date: "DEC 2025",
    desc: "Built Fincognia, an autonomous agentic finance co-pilot for gig workers that predicts liquidity risks with 85% accuracy, autonomously prevents EMI defaults, optimizes insurance and tax workflows, and improves long-term credit health through real-time simulations.",
  },
];

const ExtracurricularActivites = [
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
];

const ContactData = [
  {
    icon: <Mail />,
    label: "Email",
    href: "mailto:ketangaikwad2905@gmail.com",
  },
  {
    icon: <Linkedin />,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ketan-gaikwad-073171320/",
  },
  { icon: <Github />, label: "GitHub", href: "https://github.com/ketan-2905" },
];

const letterStyles = [
  { font: "font-astroz", color: "text-green-400" },
  { font: "font-fishel", color: "text-cyan-400" },
  { font: "font-monoton", color: "text-white" },
  { font: "font-vt323", color: "text-green-500" },
  { font: "font-the-signature", color: "text-green-300" },
];

const handleScrollDown = () =>
  window.scrollTo({ top: window.innerHeight, behavior: "smooth" });

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

  console.log(window.innerWidth);
  

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

      <HeoricSection
        letterStyles={letterStyles}
        handleScrollDown={handleScrollDown}
      />

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

        <div className="max-w-6xl mx-auto px-6 pb-1 ">
          <Section id="about" title="Whomai" icon={<Terminal />}>
            <AboutMe />
          </Section>

          <Section id="skills" title="Technical Arsenal" icon={<Cpu />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {SkillData.map((skill, index) => (
                <SkillCard key={index} {...skill} />
              ))}
            </div>
          </Section>

          {/* SECTION 3: PROJECTS (Split Layout) */}
          <Section id="projects" title="Featured Projects" icon={<Boxes />}>
            {FeaturedProjects.map((project, index) => (
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
              {Hackathons.map((hackathon, index) => (
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

          <Extracurricular ExtracurricularActivites={ExtracurricularActivites}/>

          <Section id="contact">
            <div className="bg-[#0f0f0f] border border-white/5 rounded-4xl p-10 md:p-24 text-center">
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter">
                Initialize Connection
              </h2>
              <p className="text-gray-500 mb-12 max-w-sm mx-auto text-sm md:text-base">
                Ready to architect high-performance digital solutions. Let's
                build.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {ContactData.map((contact, index) => (
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

