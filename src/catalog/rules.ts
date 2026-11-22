import type {
  Build,
  Category,
  Cpu,
  Mobo,
  Ram,
  Gpu,
  Psu,
  Case,
  Part,
  Storage,
} from "./types";

// PSU must supply at least (total estimated watts) x 1.2
export const PSU_HEADROOM = 1.2;

// Estimated draw of the motherboard 
export const MOBO_BASE_WATTS = 50;

// ---------- Pairing rules ----------

/* CPU socket must match the motherboard socket. */
export function socketMatch(cpu: Cpu, mobo: Mobo): boolean {
  return cpu.socket === mobo.socket;
}

/* RAM type (DDR4/DDR5) must match what the motherboard supports. */
export function ramMatch(mobo: Mobo, ram: Ram): boolean {
  return mobo.ramType === ram.type;
}

/* The case must be able to hold the motherboard's form factor. */
export function caseMatch(mobo: Mobo, pcCase: Case): boolean {
  return pcCase.formFactors.includes(mobo.formFactor);
}

/* A dedicated GPU is required when the CPU has no integrated graphics. */
export function needsGPU(cpu: Cpu): boolean {
  return !cpu.hasIGPU;
}

// ---------- Power ----------

// Sum of estimated TDP for CPU, RAM, storage, GPU, plus the motherboard base draw.
export function totalWatts(build: Build): number {
  const parts: Array<Cpu | Ram | Storage | Gpu | null> = [
    build.cpu,
    build.ram,
    build.storage,
    build.gpu,
  ];

  const partWatts = parts.reduce((sum, p) => sum + (p ? p.tdp : 0), 0);

  const moboWatts = build.mobo ? MOBO_BASE_WATTS : 0;

  return partWatts + moboWatts;
}

// Minimum PSU wattage the current build needs (with headroom).
export function requiredPsuWatts(build: Build): number {
  return Math.ceil(totalWatts(build) * PSU_HEADROOM);
}

// True when a PSU is selected and covers the required wattage.
export function psuSufficient(build: Build): boolean {
  return build.psu !== null && build.psu.watts >= requiredPsuWatts(build);
}

// ---------- Price Helper ----------

export function totalPrice(build: Build): number {
  const parts: Array<Part | null> = [
    build.cpu,
    build.mobo,
    build.ram,
    build.storage,
    build.gpu,
    build.psu,
    build.ownsCase ? null : build.case,
  ];
  return parts.reduce((sum, p) => sum + (p ? p.price : 0), 0);
}

// ---------- Catalog filtering (used by the Moore machine) ----------

/**
 * Is this part compatible with what is IN the build?
 * Missing parts in the build never block a category, which is what allows
 * the user to start from any category.
 *
 * The casts are safe because `category` tells us which type `part` is.
 */
export function isCompatibleWithBuild(
  category: Category,
  part: Part,
  build: Build,
): boolean {
  switch (category) {
    case "cpu": {
      const cpu = part as Cpu;
      return build.mobo === null || socketMatch(cpu, build.mobo);
    }

    case "mobo": {
      const mobo = part as Mobo;
      return (
        (build.cpu === null || socketMatch(build.cpu, mobo)) &&
        (build.ram === null || ramMatch(mobo, build.ram)) &&
        (build.case === null || build.ownsCase || caseMatch(mobo, build.case))
      );
    }

    case "ram": {
      const ram = part as Ram;
      return build.mobo === null || ramMatch(build.mobo, ram);
    }

    case "case": {
      const pcCase = part as Case;
      return build.mobo === null || caseMatch(build.mobo, pcCase);
    }

    case "psu": {
      const psu = part as Psu;
      return psu.watts >= requiredPsuWatts(build);
    }

    case "storage":
    case "gpu":
      return true;

    default: {
      const _exhaustive: never = category; // error if a category is missed
      return _exhaustive;
    }
  }
}

// filter a catalog list down to parts compatible with the build.
export function filterCompatible<T extends Part>(
  category: Category,
  parts: readonly T[],
  build: Build,
): T[] {
  return parts.filter((p) => isCompatibleWithBuild(category, p, build));
}
