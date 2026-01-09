import { useEffect, useRef, useState } from "react";
import { useGLTF, Float } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import TerminalText from "./TerminalText";

const SCREEN_CONFIGS = [
  {
    id: "Object_213",
    messages: ["SYSTEM_BOOT...", "AUTH: GRANTED", "USER: KETAN", "> READY_"],
    mode: "type",
    repeat: false,
    x: -0.5,
    y: 0.35,
    size: 0.12,
  },
  {
    id: "Object_216",
    messages: ["NEXT_JS\nV15.0.1", "STATUS: OKKKK"],
    mode: "static",
    repeat: true,
    x: -0.5,
    y: 0.38,
    size: 0.11,
  },
  {
    id: "Object_219",
    messages: ["Hello World!"],
    mode: "type",
    repeat: false,
    x: -0.5,
    y: 0.38,
    size: 0.2,
  },
  {
    id: "Object_207",
    messages: ["Scroll\nTo see More"],
    mode: "type",
    repeat: true,
    x: -0.5,
    y: 0.4,
    size: 0.2,
  },
  {
    id: "Object_210",
    messages: ["Hi There!"],
    mode: "static",
    repeat: true,
    x: -0.5,
    y: 0.38,
    size: 0.18,
  },
];

export function VintageComputers({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef<THREE.Group>(null);
  const textGroupsRef = useRef<Map<string, THREE.Group>>(new Map());
  const [loaded, setLoaded] = useState(false);
  const { viewport } = useThree();
  const responsiveScale = viewport.width < 7 ? 0.75 : 1.3;

  useEffect(() => {
    SCREEN_CONFIGS.forEach((config) => {
      const mesh = scene.getObjectByName(config.id) as THREE.Mesh;
      if (!mesh) return;
      mesh.geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      mesh.geometry.boundingBox?.getCenter(center);
      const size = new THREE.Vector3();
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

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      (state.mouse.x * Math.PI) / 10 + Math.sin(t / 4) / 10,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      THREE.MathUtils.clamp((state.mouse.y * Math.PI) / 20, -0.05, 0.5),
      0.05
    );
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]} scale={responsiveScale}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <pointLight
          position={[0, 1, 1]}
          distance={5}
          intensity={4}
          color="#00ff41"
        />
        <primitive object={scene} position={[0, -0.8, 0]} />
        {loaded &&
          SCREEN_CONFIGS.map((config) => {
            const parent = textGroupsRef.current.get(config.id);
            if (!parent) return null;
            return (
              // <TerminalText
              //   key={config.id}
              //   parent={parent}
              //   messages={config.messages}
              //   mode={config.mode}
              //   repeat={config.repeat}
              //   fontSize={config.size}
              //   anchorX="left"
              //   font="/fonts/VT323-Regular.ttf"
              // />
              <TerminalText
  key={config.id}
  parent={parent}
  messages={config.messages}
  mode={config.mode}
  repeat={config.repeat}
  fontSize={config.size}
  anchorX="left"
  font="/fonts/VT323-Regular.ttf"
/>

            );
          })}
      </Float>
    </group>
  );
}