import React, { Suspense, useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import TerminalText from "./TerminalText";
import PortfolioTerminal from "./terminal/PortfolioTerminal";

type ScreenConfig = {
  id: string;
  messages: string[];
  mode: "type" | "static";
  repeat: boolean;
  x: number;
  y: number;
  size: number;
};

const SCREEN_CONFIGS: ScreenConfig[] = [
  {
    id: "Object_210",
    messages: ["Hi There!"],
    mode: "type",
    repeat: true,
    x: -0.5,
    y: 0.38,
    size: 0.18,
  },
];

// --- 3D MODEL COMPONENT ---
interface VintageModelProps {
  onScreenClick: (e: ThreeEvent<MouseEvent>) => void;
}

function VintageModel({ onScreenClick }: VintageModelProps) {
  const { scene } = useGLTF("/computer.glb") as { scene: THREE.Group };
  const [loaded, setLoaded] = useState<boolean>(false);
  const textGroupsRef = useRef<Map<string, THREE.Group>>(new Map());

  useEffect(() => {
    SCREEN_CONFIGS.forEach((config) => {
      const mesh = scene.getObjectByName(config.id) as THREE.Mesh | null;
      if (!mesh || !mesh.geometry) return;

      mesh.geometry.computeBoundingBox();

      const center = new THREE.Vector3();
      const size = new THREE.Vector3();

      mesh.geometry.boundingBox?.getCenter(center);
      mesh.geometry.boundingBox?.getSize(size);

      const tGroup = new THREE.Group();
      tGroup.position.copy(center);
      tGroup.position.x += config.x;
      tGroup.position.y += config.y;
      tGroup.position.z += size.z / 2 + 0.01;

      mesh.add(tGroup);
      textGroupsRef.current.set(config.id, tGroup);
    });

    setLoaded(true);
  }, [scene]);

  return (
    <group
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onScreenClick(e);
      }}
    >
      <primitive
        object={scene}
        scale={2}
        dispose={null}
        position={[0, -0.9, 0]}
      />

      {loaded &&
        SCREEN_CONFIGS.map((config) => {
          const parent = textGroupsRef.current.get(config.id);
          return parent ? (
            <TerminalText
              key={config.id}
              parent={parent}
              messages={config.messages}
              mode={config.mode}
              repeat={config.repeat}
              fontSize={config.size}
              font="/fonts/VT323-Regular.ttf"
              speed={80}
              pause={1000}
            />
          ) : null;
        })}
    </group>
  );
}

// --- MAIN RENDERER ---
const Render: React.FC = () => {
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [clickPos, setClickPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handleTransition = (e: ThreeEvent<MouseEvent>) => {
    setClickPos({
      x: e.clientX,
      y: e.clientY,
    });
    setIsTerminalOpen(true);
  };

  const handleCancel = () => {
    setIsTerminalOpen(false);
  };

  return (
    <div className="w-full h-100 md:h-125 relative">
      {!isTerminalOpen ? (
        <Canvas
          shadows
          camera={{ position: [0, 0, 5], fov: 35 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={1.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2}
          />
          <Suspense fallback={null}>
            <VintageModel onScreenClick={handleTransition} />
            <Environment preset="city" />
            <ContactShadows
              position={[0, -1.5, 0]}
              opacity={0.4}
              scale={15}
              blur={2.5}
              far={4.5}
            />
          </Suspense>
        </Canvas>
      ) : (
        <PortfolioTerminal origin={clickPos} onCancel={handleCancel} />
      )}
    </div>
  );
};

export default Render;
