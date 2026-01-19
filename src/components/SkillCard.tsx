import React from "react";

interface SkillCardProps
{
  category: string;
  icon: React.ReactNode;
  skills: string[];
}
const SkillCard:React.FC<SkillCardProps> = ({
  category,
  icon,
  skills,
}) => {
  return (
    <div className="bg-[#121212] border border-white/3 p-8 rounded-3xl relative overflow-hidden group hover:border-green-500/20 transition-all duration-500">
      <div className="flex justify-between items-center mb-8">
        <div className="p-3 bg-white/2 rounded-2xl text-green-500">
          {icon}
        </div>
      </div>
      {/* // Font change */}
      <h3 className="text-gray-500 font-mono text-[11px] mb-4 uppercase tracking-[0.2em]">
        {category}
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <span
            key={s}
            className="text-xs text-white font-medium px-3 py-1 bg-white/3 rounded-full border border-white/5"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export default SkillCard
