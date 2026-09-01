import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageProps {
  children: ReactNode;
  className?: string;
  width?: "default" | "narrow" | "wide";
}

export function Page({ children, className, width = "default" }: PageProps) {
  return (
    <div className={cn("page-wrap", className)}>
      <div
        className={cn(
          "container",
          width === "narrow" && "max-w-md",
          width === "wide" && "max-w-6xl"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  align = "left",
}: {
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "mb-8 md:mb-10",
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"
      )}
    >
      <h1 className="font-display text-3xl md:text-4xl tracking-tight leading-tight">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 text-muted-foreground leading-relaxed">{description}</p>
      ) : null}
    </div>
  );
}

export const productGridClass =
  "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5";
