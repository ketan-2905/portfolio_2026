// terminal.types.ts
export const TerminalMode = {
  TYPE: "type",
  STATIC: "static",
} as const;

export type TerminalMode =
  (typeof TerminalMode)[keyof typeof TerminalMode];
