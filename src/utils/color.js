function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Things 3 스타일의 영역별 파스텔 포인트 컬러. 인접한 업무끼리 색이 겹쳐 보이지 않도록
// 색상환에서 고르게 떨어진 톤을 배치한다.
const ACCENT_PALETTE = [
  "#5B8DEF", // Soft Blue
  "#F2795A", // Coral
  "#F0B429", // Amber
  "#3FB68B", // Mint Green
  "#9B7EDE", // Lavender
  "#4FB6C6", // Teal
];

function paletteIndex(id, list) {
  const idx = list.findIndex((item) => item.id === id);
  return idx === -1 ? hashString(id) % ACCENT_PALETTE.length : idx % ACCENT_PALETTE.length;
}

// 업무(Category)마다 팔레트에서 순서대로 고유한 색상을 배정한다.
// (해시 기반으로 무작위 배정하면 업무 수가 적을 때 같은 색 계열로 몰릴 수 있어, 목록 내 순서를 기준으로 배정한다)
export function categoryColor(categoryId, categories = []) {
  const hex = ACCENT_PALETTE[paletteIndex(categoryId, categories)];
  const { h, s } = hexToHsl(hex);
  const sat = Math.min(s, 68);
  return {
    border: `hsl(${h} ${sat}% 56%)`,
    bg: `hsl(${h} ${sat}% 95%)`,
    text: `hsl(${h} ${sat}% 34%)`,
  };
}

// 같은 업무 안의 프로젝트는 업무와 같은 색상(hue/채도)을 유지하되 명도만 다르게 부여해
// "같은 업무이지만 다른 프로젝트"임을 구분할 수 있게 한다.
const LIGHTNESS_STEPS = [48, 60, 72, 82];

export function projectColor(categoryId, projectId, categories = [], projectsInCategory = []) {
  const hex = ACCENT_PALETTE[paletteIndex(categoryId, categories)];
  const { h, s } = hexToHsl(hex);
  const sat = Math.min(s, 68);
  const idx = projectsInCategory.findIndex((p) => p.id === projectId);
  const step = idx === -1 ? hashString(projectId) : idx;
  const lightness = LIGHTNESS_STEPS[step % LIGHTNESS_STEPS.length];
  return {
    border: `hsl(${h} ${sat}% ${lightness}%)`,
    bg: `hsl(${h} ${sat}% 96%)`,
  };
}
