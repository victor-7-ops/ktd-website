const cache = new Map<string, string>();
const thumbCache = new Map<string, string>();
const oembedCache = new Map<string, Promise<{ thumbnail_url?: string } | null>>();

function fetchOEmbed(trackUrl: string): Promise<{ thumbnail_url?: string } | null> {
  if (!oembedCache.has(trackUrl)) {
    oembedCache.set(
      trackUrl,
      fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(trackUrl)}`)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null)
    );
  }
  return oembedCache.get(trackUrl)!;
}

export async function getSpotifyThumbnail(trackUrl: string): Promise<string | null> {
  if (thumbCache.has(trackUrl)) return thumbCache.get(trackUrl)!;
  const data = await fetchOEmbed(trackUrl);
  const thumb = data?.thumbnail_url ?? null;
  if (thumb) thumbCache.set(trackUrl, thumb);
  return thumb;
}

async function extractAverageColor(imageUrl: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const size = 24;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);
        let r = 0, g = 0, b = 0, n = 0;
        for (let i = 0; i < data.length; i += 4) {
          const [pr, pg, pb] = [data[i], data[i + 1], data[i + 2]];
          // skip near-white/near-black pixels so the swatch isn't washed out
          const brightness = (pr + pg + pb) / 3;
          if (brightness > 235 || brightness < 15) continue;
          r += pr; g += pg; b += pb; n++;
        }
        if (n === 0) { r = 128; g = 128; b = 128; n = 1; }
        resolve(`rgb(${Math.round(r / n)}, ${Math.round(g / n)}, ${Math.round(b / n)})`);
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = imageUrl;
  });
}

export async function getSpotifyAccentColor(trackUrl: string): Promise<string | null> {
  if (cache.has(trackUrl)) return cache.get(trackUrl)!;
  const thumb = await getSpotifyThumbnail(trackUrl);
  if (!thumb) return null;
  const color = await extractAverageColor(thumb);
  if (color) cache.set(trackUrl, color);
  return color;
}
