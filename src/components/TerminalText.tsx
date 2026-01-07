import { useState, useEffect, useMemo } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";

export function TerminalText({
  messages,
  speed = 40,
  pause = 3000,
  mode = "type",
  repeat = true,
  ...props
}: any) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const lines = useMemo(
    () => (Array.isArray(messages) ? messages : messages.split("\n")),
    [messages]
  );

  // Sync with the 3.5s main loader
  useEffect(() => {
    const startTimer = setTimeout(() => setIsReady(true), 3500);
    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (mode === "static") {
      setDisplayedLines(lines);
      return;
    }
    if (isFinished) return;

    if (currentLineIdx < lines.length) {
      const currentLineText = lines[currentLineIdx];
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
          setCurrentCharIdx(currentCharIdx + 1);
        }, speed);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setCurrentLineIdx(currentLineIdx + 1);
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
    lines,
    speed,
    pause,
    mode,
    repeat,
    isFinished,
    isReady,
  ]);

  return (
    <Text {...props} lineHeight={1.1} textAlign="left" anchorY="top">
      {displayedLines.join("\n")}
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.9}
        depthTest={false}
        side={THREE.DoubleSide}
      />
    </Text>
  );
}
