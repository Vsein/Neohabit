function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function mixColors(base, goal, alpha) {
  const rgb = {
    r: Math.round(base.r + (goal.r - base.r) * alpha),
    g: Math.round(base.g + (goal.g - base.g) * alpha),
    b: Math.round(base.b + (goal.b - base.b) * alpha),
  };
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

const RED = 0.2126;
const GREEN = 0.7152;
const BLUE = 0.0722;

const GAMMA = 2.4;

function luminance(r, g, b) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** GAMMA;
  });
  return a[0] * RED + a[1] * GREEN + a[2] * BLUE;
}

function contrast(rgb1, rgb2) {
  const lum1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function generatePalette(base, goal) {
  const palette = [];
  for (let i = 0; i <= 10; i++) {
    const rgb = mixColors(base, goal, 0.1 * i);
    palette.push(rgb);
  }
  return palette;
}

function isShadeOfRedRgb(r, g, b, strict = false) {
  if (r < 100) return false;

  const redDominance = r > g * 1.3 && r > b * 1.3;

  if (strict) {
    return redDominance && g < r * 0.6 && b < r * 0.7;
  }

  return redDominance;
}

function getNumericTextColor(color = '#23BCDB') {
  const rgbColor = hexToRgb(color);
  if (
    contrast(rgbColor, hexToRgb('#efefef')) > 1.95 &&
    !isShadeOfRedRgb(rgbColor.r, rgbColor.g, rgbColor.b)
  ) {
    return '#efefef';
  }
  return contrast(rgbColor, hexToRgb('#efefef')) > contrast(rgbColor, hexToRgb('#000000'))
    ? '#efefef'
    : '#000000';
}

function getEliminationColor(color) {
  return mixColors({ r: 0, g: 0, b: 0 }, hexToRgb(color), 0.4);
}

function getColorShade(color) {
  const preferDark = document.documentElement.classList.contains('dark');

  return !preferDark
    ? mixColors({ r: 0, g: 0, b: 0 }, hexToRgb(color), 0.8)
    : mixColors({ r: 255, g: 255, b: 255 }, hexToRgb(color), 0.6);
}

function generateShades(color) {
  const preferDark = document.documentElement.classList.contains('dark');

  const colorShade = !preferDark
    ? mixColors({ r: 0, g: 0, b: 0 }, hexToRgb(color), 0.8)
    : mixColors({ r: 255, g: 255, b: 255 }, hexToRgb(color), 0.6);
  const calmColorShade = !preferDark
    ? mixColors({ r: 255, g: 255, b: 255 }, hexToRgb(colorShade), 0.33)
    : mixColors({ r: 45, g: 51, b: 51 }, hexToRgb(colorShade), 0.33);
  const textColor = getNumericTextColor(colorShade);
  const calmTextColor = getNumericTextColor(calmColorShade);

  return { colorShade, calmColorShade, textColor, calmTextColor };
}

export default function usePaletteGenerator(color) {
  const preferDark = document.documentElement.classList.contains('dark');
  const themeRgb = preferDark ? { r: 36, g: 36, b: 36 } : { r: 239, g: 239, b: 239 };

  const colorRgb = hexToRgb(color);
  const palette = generatePalette(themeRgb, colorRgb);

  return palette;
}

export { getNumericTextColor, getEliminationColor, getColorShade, generateShades };
