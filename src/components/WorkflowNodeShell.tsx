"use client";

import { ReactNode } from "react";

type WorkflowNodeShellProps = {
  badge: string;
  title: string;
  badgeTone?: "amber" | "sky" | "emerald";
  className?: string;
  headerRight?: ReactNode;
  footer?: ReactNode;
  media?: ReactNode;
  children: ReactNode;
};

const badgeTones = {
  amber: "bg-amber-500/15 text-amber-400 ring-amber-500/25",
  sky: "bg-sky-500/15 text-sky-400 ring-sky-500/25",
  emerald: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/25",
};

export function WorkflowNodeShell({
  badge,
  title,
  badgeTone = "amber",
  className = "",
  headerRight,
  footer,
  media,
  children,
}: WorkflowNodeShellProps) {
  return (
    <div className={`workflow-node flex flex-col ${className}`.trim()}>
      <div className="workflow-node-header shrink-0 cursor-grab active:cursor-grabbing">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className={`workflow-badge ring-1 ${badgeTones[badgeTone]}`}>
            {badge}
          </div>
          <h3 className="truncate text-sm font-semibold tracking-tight text-zinc-100">
            {title}
          </h3>
        </div>
        <div className="nodrag">{headerRight}</div>
      </div>

      <div className="workflow-node-body shrink-0">{children}</div>

      {media ? (
        <div className="workflow-node-media nodrag nowheel shrink-0">{media}</div>
      ) : null}

      {footer ? (
        <div className="workflow-node-footer nodrag shrink-0">{footer}</div>
      ) : null}
    </div>
  );
}
