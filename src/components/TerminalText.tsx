import { createPortal } from "@react-three/fiber";
import { useState, useEffect, type ReactNode } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { TerminalMode } from "../constants/Terminal";

export interface TerminalTextProps {
  messages: string[];
  speed?: number;
  pause?: number;
  mode?: TerminalMode;
  repeat?: boolean;
  parent?: THREE.Object3D | null;
  fontSize?: number;
  font?: string;
  anchorX?: "left" | "center" | "right";
  anchorY?: "top" | "middle" | "bottom";
  children?: ReactNode;
}

/* Replacement TerminalText using createPortal */
const  TerminalText: React.FC<TerminalTextProps> =({
  messages,
  speed = 40,
  pause = 3000,
  mode = TerminalMode.TYPE,
  repeat = true,
  parent = null,           // <-- expect a THREE.Object3D here
  fontSize = 0.12,        // default font size (tweak per-screen)
  font = "/fonts/VT323-Regular.ttf",
  anchorX = "left",
  anchorY = "top",
  ...props
}) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Sync with the 3.5s main loader
  useEffect(() => {
    const startTimer = setTimeout(() => setIsReady(true), 3500);
    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (mode === TerminalMode.STATIC) {
      setDisplayedLines(messages);
      return;
    }
    if (isFinished) return;

    if (currentLineIdx < messages.length) {
      const currentLineText = messages[currentLineIdx];
      if (currentCharIdx < currentLineText.length) {
        const timeout = setTimeout(() => {
          setDisplayedLines((prev) => {
            const newLines = [...prev];
            if (!newLines[currentLineIdx]) newLines[currentLineIdx] = "";
            newLines[currentLineIdx] = currentLineText.slice(
              0,
              currentCharIdx + 1
            );
            return newLines;
          });
          setCurrentCharIdx((c) => c + 1);
        }, speed);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setCurrentLineIdx((i) => i + 1);
          setCurrentCharIdx(0);
        }, speed * 2);
        return () => clearTimeout(timeout);
      }
    } else {
      if (!repeat) {
        setIsFinished(true);
        return;
      }
      const timeout = setTimeout(() => {
        setDisplayedLines([]);
        setCurrentLineIdx(0);
        setCurrentCharIdx(0);
      }, pause);
      return () => clearTimeout(timeout);
    }
  }, [
    currentCharIdx,
    currentLineIdx,
    messages,
    speed,
    pause,
    mode,
    repeat,
    isFinished,
    isReady,
  ]);

  const textElement = (
    <Text
      font={font}
      fontSize={fontSize}
      lineHeight={1.1}
      textAlign="left"
      anchorX={anchorX}
      anchorY={anchorY}
      {...props}
    >
      {displayedLines.join("\n")}
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.95}
        depthTest={false}
        side={THREE.DoubleSide}
      />
    </Text>
  );

  // If a valid parent (THREE.Object3D) is provided, render into it.
  if (parent && parent.isObject3D) {
    return createPortal(textElement, parent);
  }

  // fallback: render normally in the scene root (keeps backward compatibility)
  return textElement;
}

export default TerminalText