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

// 현대자동차 브랜드 컬러 팔레트 (Hyundai Blue 계열 + Zombie Gray / Tide 뉴트럴)
const HYUNDAI_PALETTE = [
  "#002c5f", // Hyundai Blue
  "#003082", // Strong Navy Blue
  "#00287a", // Hyundai Blue (Pantone 288 C)
  "#4c6ea7", // Hyundai Blue 밝은 톤
  "#99accd", // Hyundai Blue 연한 톤
  "#60605b", // Zombie Gray
  "#bfbaaf", // Tide
];

function basePaletteColor(seed) {
  const hex = HYUNDAI_PALETTE[hashString(seed) % HYUNDAI_PALETTE.length];
  return hexToHsl(hex);
}

// 업무(Category)마다 현대차 팔레트에서 고유한 색상을 부여한다.
export function categoryColor(categoryId) {
  const { h, s } = basePaletteColor(categoryId);
  return {
    border: `hsl(${h} ${s}% 38%)`,
    bg: `hsl(${h} ${s}% 95%)`,
    text: `hsl(${h} ${s}% 26%)`,
  };
}

// 같은 업무 안의 프로젝트는 업무와 같은 색상(hue/채도)을 유지하되 명도만 다르게 부여해
// "같은 업무이지만 다른 프로젝트"임을 구분할 수 있게 한다.
const LIGHTNESS_STEPS = [30, 42, 54, 66];

export function projectColor(categoryId, projectId) {
  const { h, s } = basePaletteColor(categoryId);
  const lightness = LIGHTNESS_STEPS[hashString(projectId) % LIGHTNESS_STEPS.length];
  return {
    border: `hsl(${h} ${s}% ${lightness}%)`,
    bg: `hsl(${h} ${s}% 96%)`,
  };
}
