import { StitchResult } from "@/types";

export async function stitchVideosViaApi(videoUrls: string[]): Promise<StitchResult> {
  if (!videoUrls.length) {
    throw new Error("No clips to combine");
  }

  const res = await fetch("/api/stitch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoUrls }),
  });

  if (!res.ok) {
    let message = "Failed to combine videos";
    try {
      const json = (await res.json()) as { error?: string };
      if (json.error) message = json.error;
    } catch {
      /* response may be non-json */
    }
    throw new Error(message);
  }

  const blob = await res.blob();
  const finalVideoUrl = URL.createObjectURL(blob);
  const clipCount = Number(res.headers.get("X-Clip-Count")) || videoUrls.length;

  return { finalVideoUrl, clipCount };
}
