import {
  Cpu,
  CircuitBoard,
  MemoryStick,
  HardDrive,
  Gpu,
  Zap,
  PcCase,
  type LucideIcon,
} from "lucide-react";

import type { Category } from "@/types/types";

export const CATEGORY_META: {
  id: Category;
  label: string;
  Icon: LucideIcon;
}[] = [
  { id: "cpu", label: "CPU", Icon: Cpu },
  { id: "mobo", label: "Mobo", Icon: CircuitBoard },
  { id: "ram", label: "RAM", Icon: MemoryStick },
  { id: "storage", label: "Storage", Icon: HardDrive },
  { id: "gpu", label: "GPU", Icon: Gpu },
  { id: "psu", label: "PSU", Icon: Zap },
  { id: "case", label: "Case", Icon: PcCase },
];