export function ProjectCard({
  title,
  description,
  tech,
}: {
  title: string;
  description: string;
  tech: string[];
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
            // Font change
            className="text-[10px] font-mono text-gray-400 px-3 py-1 border border-white/10 rounded-full uppercase tracking-tighter"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
