import React from "react";

export function ContactBtn({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      // Font change
      className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-green-500 hover:text-black hover:border-green-500 transition-all font-mono text-xs uppercase tracking-widest"
    >
      {icon} <span>{label}</span>
    </a>
  );
}
