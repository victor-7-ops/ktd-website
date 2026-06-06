# Hero video

Drop the live-band hero clip here as **`hero.mp4`** (optionally also `hero.webm`).

Specs:
- 1280×720, 6–10s loop, **≤ 4 MB**, H.264, **no audio**, `+faststart`
- Frame the band center-to-right (left third stays clearer for the headline)

Encode from any source:
```bash
ffmpeg -i input.mov -t 8 -an \
  -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=30" \
  -c:v libx264 -crf 26 -preset slow -movflags +faststart -pix_fmt yuv420p \
  public/video/hero.mp4

# poster (first frame):
ffmpeg -i public/video/hero.mp4 -vf "select=eq(n\,0)" -q:v 3 public/images/hero-poster.jpg
```

Until `hero.mp4` exists, the Hero automatically falls back to the 3D scene.
