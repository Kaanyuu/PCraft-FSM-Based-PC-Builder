export type Socket = "LGA1700" | "AM4" | "AM5";

export type RamType = "DDR4" | "DDR5";

export type FormFactor = "ATX" | "mATX" | "ITX";

export type Category =
  | "cpu"
  | "mobo"
  | "ram"
  | "storage"
  | "gpu"
  | "psu"
  | "case";

interface Base {
    id: string;
    name: string;
    price: number;
    img: string;
}

export interface Cpu extends Base {
    brand: "Intel" | "AMD";
    family: string;
    socket: Socket;
    cores: number;
    hasIGPU: boolean;
    tdp: number;
}
export interface Mobo extends Base {
    chipset: string;
    socket: Socket;
    ramType: RamType;
    formFactor: FormFactor;
}

export interface Ram extends Base {
    type: RamType;
    capacityGB: number;
    speedMHz: number;
    tdp: number;
}

export interface Storage extends Base {
    kind: "SSD" | "HDD";
    capacityGB: number;
    tdp: number;
}

export interface Gpu extends Base {
    brand: "NVIDIA" | "AMD";
    vramGB: number;
    tdp: number;
}

export interface Psu extends Base {
    watts: number;
    rating: "80+ Bronze" | "80+ Silver" | "80+ Gold" | "80+ Platinum" | "80+ Titanium";
}

export interface Case extends Base {
    formFactors: FormFactor[];
}

interface PartMap {
    cpu: Cpu;
    mobo: Mobo;
    ram: Ram;
    storage: Storage;
    gpu: Gpu;
    psu: Psu;
    case: Case;
}

export type Part = PartMap[Category];

// Build object with all parts selected, or null if not selected yet. The "ownsCase" property is true if the user already owns a case and does not need to select one.
export interface Build {
    cpu: Cpu | null;
    mobo: Mobo | null;
    ram: Ram | null;
    storage: Storage | null;
    gpu: Gpu | null;
    psu: Psu | null;
    case: Case | null;
    ownsCase: boolean;
}

// CONSTANT Starting build
export const EMPTY_BUILD: Build = {
  cpu: null,
  mobo: null,
  ram: null,
  storage: null,
  gpu: null,
  psu: null,
  case: null,
  ownsCase: false,
};
