// src/lib/utils.ts
export function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }