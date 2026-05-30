"use client";

import { Handle, Position } from "reactflow";
import { Button, Spinner, Link } from "@heroui/react";
import { useAppStore } from "@/store/useAppStore";
import { WorkflowNodeShell } from "@/components/WorkflowNodeShell";

export const OutputNode = () => {
  const { scenes, stitchResult, isStitching, stitchFinalVideo } = useAppStore();

  const completedScenes = scenes.filter((s) => s.status === "completed");
  const total = scenes.length;
  const progress = total ? (completedScenes.length / total) * 100 : 0;
  const canCombine = completedScenes.length > 0;
  const isGenerating = scenes.some((s) => s.status === "generating");

  return (
    <>
      <Handle type="target" position={Position.Left} className="!bg-amber-500" />
      <WorkflowNodeShell
        badge="OUT"
        title="Final output"
        badgeTone="emerald"
        footer={
          <Button
            color="primary"
            className="w-full"
            disabled={!canCombine || isGenerating}
            isLoading={isStitching}
            onPress={() => stitchFinalVideo()}
          >
            {isStitching ? "Combining…" : "Combine final video"}
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Scenes ready</span>
              <span className="font-mono text-xs tabular-nums text-zinc-200">
                {completedScenes.length} / {total}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {isGenerating && (
            <p className="flex items-center gap-2 text-xs text-amber-400/90">
              <Spinner size="sm" />
              Clips still generating…
            </p>
          )}

          {stitchResult?.finalVideoUrl && (
            <div className="nodrag nowheel space-y-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
              <p className="text-xs font-medium text-emerald-400">
                Combined video ({stitchResult.clipCount} clips)
              </p>
              <video
                src={stitchResult.finalVideoUrl}
                controls
                className="aspect-video w-full rounded-lg bg-black"
              />
              <Link
                href={stitchResult.finalVideoUrl}
                download="vibecine-final.mp4"
                className="text-xs text-amber-400"
              >
                Download MP4
              </Link>
            </div>
          )}
        </div>
      </WorkflowNodeShell>
    </>
  );
};
