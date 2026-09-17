import React from "react";
import { cn } from "@/lib/utils";

interface InfoBlockProps {
  icon?: React.ReactNode;
  title?: string;
  children: React.ReactNode;
  variant?: "info" | "success" | "warning" | "tip";
  className?: string;
}

const variantStyles = {
  info: "bg-blue-50 border-l-4 border-blue-400 text-blue-900",
  success: "bg-green-50 border-l-4 border-green-400 text-green-900",
  warning: "bg-amber-50 border-l-4 border-amber-400 text-amber-900",
  tip: "bg-purple-50 border-l-4 border-purple-400 text-purple-900",
};

export function InfoBlock({
  icon,
  title,
  children,
  variant = "info",
  className,
}: InfoBlockProps) {
  return (
    <div className={cn("rounded-lg p-4 md:p-6 flex gap-4", variantStyles[variant], className)}>
      {icon && (
        <div className="shrink-0 text-2xl mt-1" aria-hidden="true">
          {icon}
        </div>
      )}
      <div className="flex-1">
        {title && <h3 className="font-semibold text-lg mb-2">{title}</h3>}
        <div className="text-sm leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  );
}
