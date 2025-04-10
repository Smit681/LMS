import { cn } from "@/lib/utils";
import React from "react";

function PageHeader({
  title,
  children,
  className,
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between mb-8", className)}>
      <h1 className="text-2xl font-semibold">{title}</h1>
      {children && <div>{children}</div>}
    </div>
  );
}

export default PageHeader;
