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
  Wrench,
  Server,
  Brain,
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

// const SkillData = [
//   {
//     category: "Core_Logic",
//     icon: <Code2 className="text-blue-400" />,
//     skills: ["TypeScript", "JavaScript", "Python", "SQL"],
//   },
//   {
//     category: "Visual_Sys",
//     icon: <Layers className="text-purple-400" />,
//     skills: ["React", "Next.js", "Three.js", "Motion"],
//   },
//   {
//     category: "Ops_Infrastructure",
//     icon: <Database className="text-orange-400" />,
//     skills: ["Node.js", "FastAPI", "Docker", "Postgres"],
//   },
// ];

const SkillData = [
  {
    category: "Programming_Languages",
    icon: <Code2 className="text-blue-400" />,
    skills: [
      "Python",
      "JavaScript",
      "TypeScript",
      "Java",
      "C",
      "C++",
    ],
  },
  {
    category: "Frontend_Technologies",
    icon: <Layers className="text-purple-400" />,
    skills: [
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "Bootstrap",
      "shadcn/ui",
    ],
  },
  {
    category: "Backend_Technologies",
    icon: <Server className="text-green-400" />,
    skills: [
      "FastAPI",
      "Flask",
      "Node.js",
      "Express.js",
      "REST APIs",
      "WebSocket",
      "Authentication",
    ],
  },
  {
    category: "Databases",
    icon: <Database className="text-orange-400" />,
    skills: [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Firebase",
      "Supabase",
      "Neo4j",
      "Prisma ORM",
      "SQLAlchemy",
    ],
  },
  {
    category: "AI_ML",
    icon: <Brain className="text-pink-400" />,
    skills: [
      "LLMs",
      "RAG Pipelines",
      "Multi-Agent Workflows",
      "NLP",
      "PyTorch",
      "Hugging Face",
      "LangChain",
      "Sentence-Transformers",
    ],
  },
  {
    category: "DevOps_&_Platform",
    icon: <Wrench className="text-yellow-400" />,
    skills: [
      "Git",
      "GitHub",
      "Docker",
      "Docker Compose",
      "Linux",
      "Nginx",
      "CI/CD",
      "Redis",
      "Celery",
      "VPS Deployment",
    ],
  },
];

const FeaturedProjects = [
  {
    title: "Fincognia Autonomous Agentic Finance",
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
    title: "NexusEvent QR-Based Event Management Platform",
    desc: "A full-stack event management platform enabling secure participant registration, QR-based check-in tracking, and real-time event analytics. Implements role-based authentication, email verification, camera-based QR scanning, and checkpoint flow monitoring with live dashboards for participant movement analysis, entry validation, and event-wide insights.",
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "Authentication & Email Verification",
      "Role-Based Access Control",
      "QR Code Generation & Scanning",
      "Web Camera Integration",
      "Real-Time Data Sync",
      "Analytics Dashboard",
      "PostgreSQL",
      "Prisma",
      "Event Tracking System",
    ],
    side: "right",
    imagesrc: "/project/nexusEvent.png",
    demolink: "https://nexusevent-drab.vercel.app/",
  },
  {
    title: "Real-Time Voice AI Interview Simulator",
    desc: "A real-time voice-based AI interview platform that simulates technical interviews using live audio processing, speech-to-text transcription, and LLM-driven responses. Features WebSocket-based audio streaming, silence detection, session management, and intelligent interview generation using AssemblyAI and Llama-3 via Groq, delivering an interactive and realistic interview experience.",
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "FastAPI",
      "WebSocket",
      "Audio Worklets",
      "AssemblyAI (Speech-to-Text)",
      "Llama-3 (Groq API)",
      "Prisma",
      "PostgreSQL",
      "Real-Time Audio Processing",
    ],
    side: "left",
    imagesrc: "/project/interviewAI.png",
    demolink: "https://interview-prep-psi-murex.vercel.app/",
  },
  {
    title: "LitAgent — Autonomous Research Ecosystem",
    desc: "An autonomous research platform that streamlines academic literature reviews through a multi-stage AI pipeline. It retrieves papers from arXiv and Semantic Scholar, parses PDFs, extracts structured insights, builds Neo4j-powered knowledge graphs, detects contradictions across research claims, and synthesizes literature reports with source traceability. Features an LLM Council where specialized AI agents debate findings, validate conclusions, and identify research gaps, along with a web dashboard, Chrome extension, and Android companion app for interacting with research intelligence.",
    tech: [
      "Next.js",
      "TypeScript",
      "FastAPI",
      "Firebase",
      "Neo4j",
      "RAG Pipeline",
      "LLM Agents",
      "Knowledge Graphs",
      "Vector Embeddings",
      "Sentence-Transformers",
      "PyMuPDF",
      "Groq API",
      "arXiv API",
      "Semantic Scholar API",
    ],
    side: "right",
    imagesrc: "/project/litagent.png",
    demolink: "https://litagent.vercel.app/",
  }

];


const Hackathons = [
  {
    title: "Hackxios 2K25",
    award: "Winner (Innovation Track)",
    date: "DEC 2025",
    desc: "Built Fincognia, an autonomous agentic finance co-pilot for gig workers that predicts liquidity risks with 85% accuracy, autonomously prevents EMI defaults, optimizes insurance and tax workflows, and improves long-term credit health through real-time simulations.",
  },
  {
    title: "DATATHON 2026 — Core Machine Learning Track",
    award: "Runner-Up",
    date: "JAN 2026",
    desc: "Developed a network-driven financial system simulation to model systemic risk propagation across interconnected institutions and analyze market stability. Built an end-to-end ML pipeline with mathematical modeling, data simulation, and risk prediction workflows, while designing backend architecture, database systems, and LLM-powered analytical components for real-world financial decision modeling.",
  },
  {
    title: "HACKANOVA 5.0",
    award: "2nd Runner-Up",
    date: "MAR 2026",
    desc: "Built LitAgent, an autonomous research literature agent that automates the academic literature review process. The system runs a 15-step research pipeline that retrieves papers from Semantic Scholar, arXiv, and PubMed, expands citation graphs, parses PDFs for structured insights, detects contradictions across studies, and synthesizes a comprehensive research report. It features a multi-agent 'LLM Council' debate system for peer-review style analysis, along with a Next.js research dashboard, Chrome extension with citation verification, and a mobile companion app.",
  }, {
    title: "Hackniche 4.0",
    award: "Winner",
    date: "APR 2026",
    desc: "Built EcoSort AI, an AI-powered waste management platform that uses computer vision to automate the identification and sorting of plastic materials. The system integrates a Python FastAPI backend for real-time object detection using Roboflow and OpenCV, with a Next.js frontend featuring interactive dashboards, live statistics, classification confidence tracking, and 3D simulations. It also includes EPR report generation for automated environmental compliance audits, bridging advanced AI inference with practical industrial recycling workflows.",
  },
  {
    title: "Hawkathon 2026",
    award: "Winner",
    date: "MAR 2026",
    desc: "Built EasyOffRoad, an autonomous vehicle perception platform for semantic segmentation in desert environments. The system uses a Mask2Former architecture with a Swin-Large backbone to classify terrain into multiple categories such as trees, rocks, sky, and other off-road elements. It includes a Python backend for model training, evaluation, specialized loss handling, and test-time augmentation, along with a Next.js frontend featuring a 3D simulation scene, AI-powered research assistant, and training metrics dashboard for managing the full ML project lifecycle.",
  }
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
    id: "NOVA_02",
  },
  {
    title: "Event Horizon 3.0",
    description:
      "Built a visually engaging event landing page for Event Horizon 3.0, presenting the event timeline, FAQs, prize pool, registration flow, and contact details through a space-themed UI and responsive design.",
    link: "https://eventhorizon.djsnova.space/",
    tags: ["Event Landing Page", "UI/UX", "Responsive Design"],
    id: "NOVA_03",
  }
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
  { icon: <Github />, label: "GitHub", href: "https://github.com/ketan-2905" }
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

          <Extracurricular ExtracurricularActivites={ExtracurricularActivites} />

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
