import { useEffect, useState } from "react";

export function useInViewport(ref: React.RefObject<HTMLElement> | null) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (ref === null) return;
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return visible;
}
