import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  MeshReflectorMaterial,
  SpotLight,
} from "@react-three/drei";
import { cn } from "../utils";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import VintageComputers from "./VintageComputers";

type letterStyles = {
  font: string;
  color: string;
};

interface HeoricSectionProps {
  letterStyles: letterStyles[];
  handleScrollDown: () => void;
}

const HeoricSection: React.FC<HeoricSectionProps> = ({
  letterStyles,
  handleScrollDown,
}) => {
  return (
    <div className="fixed inset-0 z-0 h-screen w-full overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 0, 8], fov: 40 }}
      >
        <color attach="background" args={["#020202"]} />
        <fog attach="fog" args={["#020202", 5, 20]} />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.2} />
          <SpotLight
            position={[-5, 5, 5]}
            angle={0.3}
            penumbra={1}
            intensity={2}
            color="#ffffff"
          />
          <VintageComputers modelPath="/old_computers.glb" />
          {window.innerWidth > 768 && (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
              <planeGeometry args={[50, 50]} />
              <MeshReflectorMaterial
                blur={[300, 100]}
                resolution={512}
                mixBlur={1}
                mixStrength={80}
                roughness={0.8}
                color="#050505"
                metalness={0.5}
                mirror={0.75}
              />
            </mesh>
          )}
        </Suspense>
      </Canvas>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-4">
        {/* WELCOME TO MY SECTION */}
        <motion.div className="flex gap-2 mb-4">
          {"WELCOME TO MY ".split("").map((l, i) => {
            const style = letterStyles[i % letterStyles.length];
            return (
              <span
                key={i}
                className={cn(
                  style.font,
                  style.color,
                  "md:text-[15px] text-[12px] tracking-widest transition-colors duration-500 text-white",
                )}
              >
                {l}
              </span>
            );
          })}
        </motion.div>

        {/* PORTFOLIO SECTION */}
        <h1 className="flex overflow-y-hidden text-6xl md:text-9xl font-black mix-blend-difference tracking-tighter">
          {"PORTFOLIO".split("").map((char, i) => {
            const style = letterStyles[i % letterStyles.length];

            return (
              <motion.span
                key={i}
                initial={{ y: "110%", opacity: 0 }} // Use percentages for cleaner entry
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 3.5 + i * 0.1,
                  type: "spring",
                  stiffness: 70, // Slightly lower stiffness for smoother movement
                  damping: 15,
                }}
                // The Secret Sauce: transform-gpu and will-change
                className={cn(
                  style.font,
                  style.color,
                  i === 4 ? "font-[10]" : "",
                  "hover:text-white transition-colors cursor-default transform-gpu",
                )}
                style={{
                  willChange: "transform, opacity",
                  // Only apply textShadow if the animation is basically finished
                  // Or keep it subtle like this:
                  textShadow:
                    i % 2 === 0 ? "0 4px 12px rgba(34, 197, 94, 0.3)" : "none",
                }}
              >
                {char}
              </motion.span>
            );
          })}
        </h1>

        <motion.button
          onClick={handleScrollDown}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute md:bottom-10 bottom-20 pointer-events-auto flex flex-col items-center gap-2 group cursor-pointer"
        >
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest group-hover:text-green-500 transition-colors">
            Launch_Core
          </span>
          <div className="p-3 border border-white/10 rounded-full group-hover:border-green-500 transition-all">
            <ArrowDown className="text-green-500" size={20} />
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default HeoricSection;
