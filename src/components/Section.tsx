import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "../utils";

// export function Section({
//   children,
//   title,
//   id,
// }: {
//   children: React.ReactNode;
//   title?: string;
//   id?: string;
// }) {
//   const ref = useRef(null);
//   const isInView = useInView(ref, { once: true, margin: "-100px" });
//   return (
//     <motion.section
//       id={id}
//       ref={ref}
//       initial={{ opacity: 0, y: 40 }}
//       animate={isInView ? { opacity: 1, y: 0 } : {}}
//       transition={{ duration: 1 }}
//       className="py-24 scroll-mt-20"
//     >
//       {title && (
//         // Font change
//         <h2 className="text-sm font-mono text-green-500 mb-12 flex items-center gap-3 uppercase tracking-[0.4em]">
//           <span className="w-8 h-[1px] bg-green-500/30" />
//           {title}
//         </h2>
//       )}
//       {children}
//     </motion.section>
//   );
// }

export default function Section({ children, title, icon, id, className }: any) {
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
          <div className="flex-1 h-[1px] bg-white/5" />
        </div>
      )}
      {children}
    </motion.section>
  );
}