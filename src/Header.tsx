
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface HeaderProps {
  /* How many of the 7 slots are filled (case counts when ownsCase is true). */
  selectedCount: number;
  /* Total slots: CPU, mobo, RAM, storage, GPU, PSU, case. */
  totalCount?: number;
  onClearBuild: () => void;
}

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M16 2.5 29.5 16 16 29.5 2.5 16Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M16 9.5 22.5 16 16 22.5 9.5 16Z" fill="currentColor" />
    </svg>
  );
}

export function Header({
  selectedCount,
  totalCount = 7,
  onClearBuild,
}: HeaderProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const hasParts = selectedCount > 0;
  const progress =
    totalCount > 0 ? Math.min(selectedCount / totalCount, 1) * 100 : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur supports-backdrop-filter:bg-card/75">
      <div className="mx-auto flex h-16 max-w-378 items-center gap-4 px-4 sm:px-8 lg:px-11">
        {/* Brand */}
        <a
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
        >
          <LogoMark className="size-7 text-primary" />
          <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
            PCraft
          </span>
        </a>

        <span
          aria-hidden="true"
          className="hidden h-6 w-px bg-border sm:block"
        />
        <span className="hidden text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase sm:block">
          PC Builder
        </span>

        {/* Build status + clear */}
        <div className="ml-auto flex items-center gap-3 sm:gap-6">
          <p
            role="status"
            aria-live="polite"
            className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase"
          >
            <span
              aria-hidden="true"
              className={cn(
                "size-1.5 rounded-full transition-colors motion-reduce:transition-none",
                hasParts ? "bg-primary ring-4 ring-primary/15" : "bg-border",
              )}
            />
            <span className="text-foreground tabular-nums">
              {selectedCount}/{totalCount}
            </span>
            <span className="hidden sm:inline">Parts selected</span>
            <span className="sr-only sm:hidden">parts selected</span>
          </p>

          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogTrigger
              disabled={!hasParts}
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border text-[11px] font-semibold tracking-[0.12em] text-primary uppercase hover:border-primary/40 hover:bg-accent hover:text-primary"
                />
              }
            >
              Clear build
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear your build?</AlertDialogTitle>
                <AlertDialogDescription>
                  This removes all {selectedCount} selected{" "}
                  {selectedCount === 1 ? "part" : "parts"} and starts a fresh
                  build. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep build</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onClearBuild();
                    setConfirmOpen(false);
                  }}
                >
                  Clear build
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Progress line: fills as parts are selected */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-0.5 bg-transparent"
      >
        <div
          className="h-full bg-primary transition-[width] duration-300 ease-out motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}
