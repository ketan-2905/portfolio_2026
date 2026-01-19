import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "../utils";


interface SectionProps {
  children: ReactNode;
  title?: string;
  icon?: ReactNode;
  id: string;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ children, title, icon, id, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1 }}
      className={cn("py-15 scroll-mt-20", className)}
    >
      {title && (
        <div className="flex items-center gap-4 mb-16">
          <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
            {icon}
          </div>
          <h2 className="text-sm font-mono text-green-500 uppercase tracking-[0.4em]">
            {title}
          </h2>
          <div className="flex-1 h-px bg-white/5" />
        </div>
      )}
      {children}
    </motion.section>
  );
};

export default Section;
