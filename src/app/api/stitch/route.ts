import { execFile } from "child_process";
import { mkdtemp, readFile, rm, writeFile } from "fs/promises";
import os from "os";
import path from "path";
import { promisify } from "util";
import ffmpegStatic from "ffmpeg-static";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 120;

const execFileAsync = promisify(execFile);

function ffmpegBin(): string {
  if (!ffmpegStatic) throw new Error("ffmpeg binary not available");
  return ffmpegStatic;
}

function listLine(filePath: string): string {
  return `file '${filePath.replace(/\\/g, "/").replace(/'/g, "'\\''")}'`;
}

export async function POST(request: Request) {
  let workDir: string | undefined;

  try {
    const { videoUrls } = (await request.json()) as { videoUrls?: string[] };
    const urls = videoUrls?.filter((u) => u?.trim()) ?? [];

    if (!urls.length) {
      return NextResponse.json({ error: "videoUrls required" }, { status: 400 });
    }

    if (urls.length === 1) {
      const res = await fetch(urls[0]);
      if (!res.ok) {
        return NextResponse.json({ error: "Download failed" }, { status: 502 });
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "video/mp4",
          "Content-Disposition": 'inline; filename="vibecine-final.mp4"',
          "X-Clip-Count": "1",
        },
      });
    }

    workDir = await mkdtemp(path.join(os.tmpdir(), "vibecine-stitch-"));
    const clipPaths: string[] = [];

    for (let i = 0; i < urls.length; i++) {
      const clipPath = path.join(workDir, `clip${i}.mp4`);
      const res = await fetch(urls[i]);
      if (!res.ok) {
        throw new Error(`Could not download clip ${i + 1}`);
      }
      await writeFile(clipPath, Buffer.from(await res.arrayBuffer()));
      clipPaths.push(clipPath);
    }

    const listPath = path.join(workDir, "list.txt");
    await writeFile(listPath, clipPaths.map(listLine).join("\n"), "utf8");

    const outputPath = path.join(workDir, "output.mp4");
    await execFileAsync(ffmpegBin(), [
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      listPath,
      "-c",
      "copy",
      outputPath,
    ]);

    const output = await readFile(outputPath);

    return new NextResponse(output, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": 'inline; filename="vibecine-final.mp4"',
        "X-Clip-Count": String(urls.length),
      },
    });
  } catch (err) {
    console.error("[stitch]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Stitch failed" },
      { status: 500 }
    );
  } finally {
    if (workDir) {
      await rm(workDir, { recursive: true, force: true }).catch(() => {});
    }
  }
}
