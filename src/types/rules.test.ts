// src/tests/rules.test.ts
import { describe, it, expect } from "vitest";
import {
  CPUS,
  MOBOS,
  RAMS,
  STORAGES,
  GPUS,
  PSUS,
  CASES,
} from "@/types/dataset.ts";

import { EMPTY_BUILD, type Build } from "@/types/types.ts";

import {
  socketMatch,
  ramMatch,
  caseMatch,
  needsGPU,
  totalWatts,
  requiredPsuWatts,
  psuSufficient,
  totalPrice,
  filterCompatible,
  MOBO_BASE_WATTS,
} from "@/types/rules.ts";

// Look a part up by id; throws if the id is wrong so tests fail
function get<T extends { id: string }>(list: T[], id: string): T {
  const found = list.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown id: ${id}`);
  return found;
}

describe("pairwise rules", () => {
  it("socketMatch", () => {
    expect(socketMatch(get(CPUS, "i3-12100f"), get(MOBOS, "b660m-ds3h"))).toBe(
      true,
    );

    expect(socketMatch(get(CPUS, "i3-12100f"), get(MOBOS, "b450m-ds3h"))).toBe(
      false,
    );
  });

  it("ramMatch", () => {
    expect(ramMatch(get(MOBOS, "b660m-ds3h"), get(RAMS, "fury-8-d4"))).toBe(
      true,
    );

    expect(ramMatch(get(MOBOS, "b660m-ds3h"), get(RAMS, "fury-16-d5"))).toBe(
      false,
    );
  });

  it("caseMatch", () => {
    expect(caseMatch(get(MOBOS, "z790-p"), get(CASES, "case-q300l"))).toBe(
      false,
    ); // ATX in mATX case

    expect(caseMatch(get(MOBOS, "b660m-ds3h"), get(CASES, "case-q300l"))).toBe(
      true,
    );
  });

  it("needsGPU", () => {
    expect(needsGPU(get(CPUS, "i3-12100f"))).toBe(true);

    expect(needsGPU(get(CPUS, "i5-12400"))).toBe(false);
  });
});

describe("power and price", () => {
  const build: Build = {
    ...EMPTY_BUILD,
    cpu: get(CPUS, "i5-12400"), // 65
    mobo: get(MOBOS, "b660m-ds3h"), // 50 base
    ram: get(RAMS, "vengeance-16-d4"), // 5
    storage: get(STORAGES, "nv2-500"), // 5
    gpu: get(GPUS, "rtx4060"), // 115
  };

  it("totalWatts sums TDP plus motherboard base", () => {
    expect(totalWatts(EMPTY_BUILD)).toBe(0);

    expect(totalWatts(build)).toBe(65 + 5 + 5 + 115 + MOBO_BASE_WATTS); // 240
  });

  it("PSU must cover total with headroom", () => {
    expect(requiredPsuWatts(build)).toBe(288); // 240 * 1.2

    expect(psuSufficient({ ...build, psu: get(PSUS, "psu-450") })).toBe(true);

    expect(psuSufficient({ ...build, psu: null })).toBe(false);

    const heavy: Build = {
      ...build,
      cpu: get(CPUS, "i7-12700k"),
      gpu: get(GPUS, "rtx4070"),
      psu: get(PSUS, "psu-450"),
    };

    expect(psuSufficient(heavy)).toBe(false);
  });

  it("totalPrice skips the case when ownsCase is true", () => {
    const withCase: Build = { ...build, case: get(CASES, "case-q300l") };
    const withoutCase = totalPrice({ ...withCase, ownsCase: true });

    expect(totalPrice(withCase) - withoutCase).toBe(2800);
  });
});

describe("free-order filtering", () => {
  it("picking a motherboard first narrows the CPU list", () => {
    const build: Build = { ...EMPTY_BUILD, mobo: get(MOBOS, "b650m-p") }; // AM5
    const ids = filterCompatible("cpu", CPUS, build).map((c) => c.id);

    expect(ids).toEqual(["r5-7600"]);
  });

  it("picking a CPU first narrows the motherboard list", () => {
    const build: Build = { ...EMPTY_BUILD, cpu: get(CPUS, "r5-5600") }; // AM4
    const ids = filterCompatible("mobo", MOBOS, build).map((m) => m.id);

    expect(ids).toEqual(["b450m-ds3h", "b550-tuf"]);
  });

  it("a DDR5 board hides DDR4 RAM", () => {
    const build: Build = { ...EMPTY_BUILD, mobo: get(MOBOS, "z790-p") };
    const types = new Set(
      filterCompatible("ram", RAMS, build).map((r) => r.type),
    );
    
    expect([...types]).toEqual(["DDR5"]);
  });
});
