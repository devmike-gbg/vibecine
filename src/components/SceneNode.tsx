"use client";

import { Handle, Position, NodeProps } from "reactflow";
import { Input, Textarea, Chip, Button } from "@heroui/react";
import { useAppStore } from "@/store/useAppStore";
import { Scene } from "@/types";
import { WorkflowNodeShell } from "@/components/WorkflowNodeShell";

const statusConfig: Record<
  Scene["status"],
  { label: string; color: "default" | "warning" | "success" | "danger" }
> = {
  draft: { label: "Draft", color: "default" },
  generating: { label: "Generating", color: "warning" },
  completed: { label: "Ready", color: "success" },
  failed: { label: "Failed", color: "danger" },
};

const fieldClassNames = {
  base: "relative z-0 w-full",
  inputWrapper:
    "relative z-0 border-white/[0.08] bg-zinc-950/80 group-data-[focus=true]:border-amber-500/50",
  input: "text-zinc-100",
};

export const SceneNode = ({ data }: NodeProps<{ sceneId: string }>) => {
  const scene = useAppStore((s) =>
    s.scenes.find((sc) => sc.id === data.sceneId)
  );
  const updateScene = useAppStore((s) => s.updateScene);
  const generateSceneClip = useAppStore((s) => s.generateSceneClip);

  if (!scene) return null;

  const status = statusConfig[scene.status];
  const shotIndex = scene.id.split("-")[1] ?? "?";

  return (
    <>
      <Handle type="target" position={Position.Left} className="!bg-amber-500" />
      <Handle type="source" position={Position.Right} className="!bg-amber-500" />
      <WorkflowNodeShell
        className="workflow-node--scene"
        badge={shotIndex}
        title={scene.title}
        badgeTone="sky"
        headerRight={
          <Chip size="sm" variant="flat" color={status.color}>
            {status.label}
          </Chip>
        }
        footer={
          <Button
            size="sm"
            color="primary"
            variant="flat"
            className="w-full"
            onPress={() => generateSceneClip(scene.id)}
            isDisabled={scene.status === "generating"}
          >
            Submit to PixVerse
          </Button>
        }
        media={
          scene.videoUrl ? (
            <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-black">
              <video
                src={scene.videoUrl}
                controls
                className="aspect-video w-full"
              />
            </div>
          ) : undefined
        }
      >
        <div className="workflow-node-fields nodrag nowheel flex flex-col gap-4">
          <div className="workflow-field space-y-2">
            <span className="workflow-label">Title</span>
            <Input
              size="sm"
              value={scene.title}
              variant="bordered"
              onChange={(e) => updateScene(scene.id, { title: e.target.value })}
              classNames={fieldClassNames}
            />
          </div>

          <div className="workflow-field space-y-2">
            <span className="workflow-label">Description</span>
            <Textarea
              size="sm"
              minRows={2}
              value={scene.description}
              variant="bordered"
              onChange={(e) =>
                updateScene(scene.id, { description: e.target.value })
              }
              classNames={fieldClassNames}
            />
          </div>

          <div className="workflow-field space-y-2">
            <span className="workflow-label">Video prompt</span>
            <Textarea
              size="sm"
              minRows={2}
              value={scene.videoPrompt}
              variant="bordered"
              onChange={(e) =>
                updateScene(scene.id, { videoPrompt: e.target.value })
              }
              classNames={fieldClassNames}
            />
          </div>

          {scene.errorMessage && (
            <p className="text-xs text-red-400">{scene.errorMessage}</p>
          )}
        </div>
      </WorkflowNodeShell>
    </>
  );
};
