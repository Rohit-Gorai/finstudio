import { describe, it, expect } from "vitest";
import { cn } from "../src/lib/cn";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy values", () => {
    expect(cn("a", false && "b", null, undefined, "c")).toBe("a c");
  });

  it("lets a later Tailwind utility win over an earlier one", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});

describe("design tokens", () => {
  it("keeps text colours above the WCAG AA 4.5:1 threshold on white", () => {
    // The brief's raw green/yellow/red measure 2.28, 2.15 and 3.76 against
    // white, so words use these darker variants instead.
    const lum = (hex: string) => {
      const c = hex.replace("#", "");
      const v = [0, 2, 4]
        .map((i) => parseInt(c.slice(i, i + 2), 16) / 255)
        .map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
      return 0.2126 * v[0]! + 0.7152 * v[1]! + 0.0722 * v[2]!;
    };
    const ratio = (a: string, b: string) => {
      const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x) as [number, number];
      return (hi + 0.05) / (lo + 0.05);
    };

    const textColours = {
      ink: "#0f172a",
      ink2: "#475569",
      brand: "#2563eb",
      successText: "#15803d",
      warningText: "#b45309",
      dangerText: "#dc2626",
    };

    for (const [name, hex] of Object.entries(textColours)) {
      const onWhite = ratio(hex, "#ffffff");
      const onSurface2 = ratio(hex, "#f8fafc");
      expect(onWhite, `${name} on white`).toBeGreaterThanOrEqual(4.5);
      expect(onSurface2, `${name} on surface-2`).toBeGreaterThanOrEqual(4.5);
    }
  });
});
