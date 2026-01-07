import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function LoadingScreen({ onFinished }: { onFinished: () => void }) {
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () => setPercent((p) => (p < 100 ? p + 1 : 100)),
      25
    );
    const timeout = setTimeout(onFinished, 3500);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onFinished]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      // Font change
      className="fixed inset-0 z-[200] bg-[#020202] flex flex-col items-center justify-center font-mono"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-green-500 mb-4 tracking-tighter text-sm"
      >
        [ INITIALIZING_SYSTEM_CORE ]
      </motion.div>
      <div className="w-48 h-[10px] bg-white/10 relative overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          className="absolute h-full bg-green-500"
        />
      </div>
      <div className="mt-4 text-[10px] text-gray-500 uppercase tracking-[0.2em]">
        Status: {percent === 100 ? "Ready" : "Syncing GLB Assets..."}
      </div>
    </motion.div>
  );
}
