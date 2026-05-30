# 3. Project Information

| Field | Content |
| --- | --- |
| **Project Title** | VibeCine |
| **Project Summary** | VibeCine is a web app (Next.js + React Flow) that turns a story prompt and a character reference image into a short multi-shot video. TRAE generates a storyboard of 3–5 shots; users edit each shot in visual node cards, generate clips with PixVerse (per shot or batch), preview clips inline, then merge completed shots into one final MP4 via server-side ffmpeg. Built as a PixVerse Track hackathon MVP with no database or auth. |
| **Target Audience** | Hackathon judges and teams demoing PixVerse + TRAE; creators and marketers who need quick 30s+ narrative prototypes; anyone doing text-to-video who wants shot-level control instead of one long prompt. |
| **Problem Being Solved** | Single-prompt text-to-video is hard to steer: scenes feel disconnected, character look drifts across shots, and fixing one bad moment means regenerating the whole video. VibeCine uses a shot-based workflow-reference image for identity, editable storyboard nodes, regenerate only the shots that fail, and combine the rest into a final story-so users can iterate faster and ship a judge-friendly end-to-end demo. |
