import { Trophy } from "lucide-react";

interface HackathonItemProps{
    title: string;
    award: string;
    date: string;
    desc: string;
}

const HackathonItem : React.FC<HackathonItemProps> = ({ title, award, date, desc }) => {
  return (
    <div className="relative pl-12 pb-16 border-l border-white/10 last:pb-0">
      <div className="absolute -left-2.25 top-0 w-4 h-4 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
      <div className="text-[10px] font-mono text-gray-500 mb-2">{date}</div>
      <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
      <div className="text-green-500 font-mono text-xs mb-4 flex items-center gap-2">
        <Trophy size={14} /> {award}
      </div>
      <p className="text-gray-400 text-sm max-w-2xl">{desc}</p>
    </div>
  );
}

export default HackathonItem