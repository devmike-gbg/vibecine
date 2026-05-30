# VibeCine (PixVerse Track MVP)

## Project Introduction

VibeCine là một web app MVP giúp người dùng tạo video ngắn theo dạng storyboard bằng PixVerse, được điều phối bằng một workspace dạng flow (React Flow). Thay vì “generate 1 video dài ngay lập tức”, VibeCine chia câu chuyện thành nhiều shot ngắn (3-5 shots cho demo, có thể mở rộng) để:

- Dễ kiểm soát chất lượng từng shot
- Dễ regenerate một shot mà không ảnh hưởng toàn bộ
- Dễ chứng minh quá trình dùng TRAE để tạo storyboard, refine prompt, và đảm bảo continuity

Mục tiêu demo theo track: tạo “final story” có tổng thời lượng >= 30s (ví dụ 4 shots x 10s).

## Creative Concept / Problem Statement

Khi làm video generation từ prompt, vấn đề lớn nhất ở hackathon là:

- Output rời rạc giữa các shot, nhân vật thay đổi (face/outfit/lighting)
- Một prompt dài dễ fail hoặc khó kiểm soát từng đoạn
- Demo khó thuyết phục nếu không có “quy trình” rõ ràng

VibeCine giải bài toán bằng workflow rõ ràng:

1) Upload ảnh nhân vật (character reference) làm “identity anchor”
2) Nhập story prompt tổng quan
3) TRAE tạo storyboard (shot list) và gợi ý prompt
4) Người dùng chỉnh từng shot
5) Generate từng shot bằng PixVerse (CLI hoặc API), có thể regenerate
6) “Final story” phát tuần tự các clip theo thứ tự shots

## Workflow (User Flow)

### 1) Input

- Character reference image: ảnh nhân vật, dùng để PixVerse giữ nhận diện xuyên suốt các shots
- Story prompt: mô tả bối cảnh, nhịp câu chuyện, mood, phong cách hình ảnh

### 2) Storyboard (TRAE)

- TRAE tạo shot list 3-5 shots:
  - title
  - scene description
  - video prompt (editable)

### 3) Shot Review and Edit

Người dùng chỉnh từng shot trực tiếp trên các “shot cards” (Scene nodes).

### 4) Generate (PixVerse)

- Generate từng shot bằng nút “Submit to PixVerse”
- Hoặc generate toàn bộ bằng “Generate all videos”

Để giảm rời rạc, khi generate shot N, app sẽ “nhét context shot N-1” (title/description/prompt) vào prompt shot N dưới dạng text. Điều này giúp model giữ continuity về nhân vật và mood.

### 5) Final Output (>= 30s)

“Final output” không merge mp4 ở server trong MVP. Thay vào đó:

- App phát tuần tự tất cả clip theo thứ tự shot
- Đảm bảo tổng thời lượng >= 30s bằng cách đặt duration tối thiểu 10s/shot (ví dụ 4 shots -> ~40s)

Nếu cần “export 1 file mp4” thật sự, có thể bổ sung ffmpeg server-side sau hackathon.

## TRAE Usage Highlights (What We Show to Judges)

- TRAE tạo shot list từ story prompt (Storyboard generation)
- TRAE hỗ trợ refine prompt cho từng shot (camera, lighting, action)
- TRAE giúp “chaining prompt” giữa các shots:
  - shot sau mang context shot trước để giảm rời rạc
- Demo được vòng lặp: edit shot -> regenerate -> chọn clip tốt nhất

## PixVerse Usage Highlights

### Option A: PixVerse CLI (recommended for hackathon demo)

CLI cho output JSON rõ ràng, thuận tiện cho demo pipeline.

Ví dụ text-to-video:

```bash
pixverse create video --prompt "A sunset over ocean waves" --model v6 --quality 720p --aspect-ratio 16:9 --duration 10 --json
```

Ví dụ image-to-video (dùng ảnh nhân vật làm reference):

```bash
pixverse create video --prompt "Slow dolly-in, cinematic lighting" --image ./character.png --duration 10 --json
```

CLI login:

```bash
pixverse auth login
pixverse auth status --json
```

### Option B: PixVerse Platform API (fallback)

Nếu muốn gọi API trực tiếp, workflow vẫn tương tự:

- upload image -> nhận img_id
- generate -> nhận video_id
- poll result -> lấy url

## Repo Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- TailwindCSS
- HeroUI v2
- React Flow
- Zustand
- No DB, no auth, no external backend

## Local Setup

### Prerequisites

- Node.js 20+
- PixVerse CLI installed and logged in (nếu dùng CLI)

```bash
npm install -g pixverse
pixverse auth login
```

### Install and Run

```bash
npm install
npm run dev
```

Open: http://localhost:3000

## Demo Script (fast)

1) Upload character reference image
2) Paste story prompt
3) Click “Generate storyboard”
4) Edit shot prompts (optional)
5) Click “Generate all videos”
6) Click “Play full story” để xem toàn bộ flow

## Team Build Process (Hackathon-friendly)

Chúng tôi tối ưu cho tốc độ:

- Chốt data model đơn giản: Project -> Scenes (shots) -> Generated clips
- Tập trung vào UX demo: Flow UI + per-shot review + regen
- Dùng TRAE để:
  - generate storyboard nhanh
  - rewrite prompt cho chất lượng ổn định
  - thêm continuity giữa shot trước và shot sau
- Dùng PixVerse để generate clip theo shot, đảm bảo tổng thời lượng >= 30s

## Key Files

- Flow UI: `src/app/page.tsx`
- Store: `src/store/useAppStore.ts`
- Shot node UI: `src/components/SceneNode.tsx`
- Final output player: `src/components/OutputNode.tsx`
- Generate route: `src/app/api/generate-video/route.ts`

