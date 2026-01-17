import Section from "./Section";
import { ExternalLink, Star } from "lucide-react";

const Extracurricular = () => {
  return (
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
            Directing the digital architecture for the college astronomy club. I
            oversee the technical execution of our web platforms, ensuring
            high-performance delivery of our astronomical outreach tools.
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
  );
};

export default Extracurricular