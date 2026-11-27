// src/components/CategoryNav.tsx
// Presentational stepper: which category is open, and which already have a part.
// Selection state lives in the parent; this component only reports clicks.

import { CATEGORY_META } from "@/constants/categoryMeta";
import type { Category } from "@/types/types";
import { cn } from "@/lib/utils";

interface CategoryNavProps {
  active: Category;
  /** true for every category that already has a part (case: or "I own a case"). */
  filled: Record<Category, boolean>;
  onSelect: (category: Category) => void;
}

export function CategoryNav({ active, filled, onSelect }: CategoryNavProps) {
  return (
    <nav
      aria-label="Build categories"
      className="border-b border-border bg-card"
    >
      <div className="mx-auto max-w-378 overflow-x-auto px-4 sm:px-8 lg:px-11">
        <ol className="mx-auto flex min-w-120 max-w-275 py-3">
          {CATEGORY_META.map(({ id, label, Icon }, index) => {
            const isActive = id === active;
            const isFilled = filled[id];

            return (
              <li
                key={id}
                className="flex flex-1 flex-col items-center pt-5 pb-8"
              >
                {/* Row height = circle height, so the connector lines sit at its centre */}
                <div className="relative flex w-full items-center justify-center">
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute top-1/2 right-1/2 left-0 h-px -translate-y-1/2 bg-border"
                    />
                  )}
                  {index < CATEGORY_META.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute top-1/2 right-0 left-1/2 h-px -translate-y-1/2 bg-border"
                    />
                  )}

                  <div className="relative size-11 sm:size-14">
                    {/* Step number, top-left of the circle */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute -top-5 left-0 text-[10px] font-medium tracking-widest tabular-nums",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <button
                      type="button"
                      onClick={() => onSelect(id)}
                      aria-current={isActive ? "step" : undefined}
                      aria-label={isFilled ? `${label}, part selected` : label}
                      className={cn(
                        "relative flex size-full items-center justify-center rounded-full border outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring motion-reduce:transition-none",
                        isActive
                          ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary",
                      )}
                    >
                      <Icon
                        className="size-5 sm:size-5.5"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />

                      {/* Part-selected dot */}
                      {isFilled && (
                        <span
                          aria-hidden="true"
                          className="absolute top-0.75 right-0.75 size-2.5 rounded-full bg-primary ring-2 ring-card"
                        />
                      )}

                      {/* Label sits under the circle but is part of the button, so it is clickable */}
                      <span
                        className={cn(
                          "absolute top-full left-1/2 mt-2.5 -translate-x-1/2 text-[11px] font-semibold tracking-[0.12em] whitespace-nowrap uppercase",
                          isActive
                            ? "text-primary"
                            : isFilled
                              ? "text-foreground"
                              : "text-muted-foreground",
                        )}
                      >
                        {label}
                      </span>
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
