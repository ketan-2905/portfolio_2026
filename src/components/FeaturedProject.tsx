import { ExternalLink } from "lucide-react";
import { cn } from "../utils";

interface FeaturedProjectProps{
title: string;
  desc: string;
  tech: string[];
  side: string;
  imagesrc?:string;
  demolink?: string;
  githublink?: string;
}

const FeaturedProject = ({
  title,
  desc,
  tech,
  side = "left",
  imagesrc,
  demolink,
  githublink
}: FeaturedProjectProps) => {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row gap-12 items-center mb-32",
        side === "right" && "md:flex-row-reverse",
      )}
    >
      <div className="flex-1 w-full aspect-video bg-[#0f0f0f] border border-white/5 rounded-2xl relative overflow-hidden group">
        <img src={imagesrc} alt="Project web picture" className="w-full h-full"/>
        <div className="absolute inset-0 bg-linear-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="flex-1">
        <h3 className="text-4xl font-bold text-white mb-6 tracking-tight">
          {title}
        </h3>
        <p className="text-gray-400 mb-8 leading-relaxed text-sm md:text-md">{desc}</p>
        <div className="flex flex-wrap gap-3 mb-8">
          {tech.map((t: string) => (
            <span
              key={t}
              className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] md:text-xs text-gray-400 font-mono"
            >
              {t}
            </span>
          ))}
        </div>
        <a
          href={demolink? demolink : githublink}
          target="_blank"
          className="flex items-center gap-2 text-green-500 text-sm font-mono hover:gap-4 transition-all"
        >
          {demolink ? "VIEW DEMO":"VIEW REPOSITORY"} <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}

export default FeaturedProject