import { useSelector } from 'react-redux';

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

function mixColors(base, goal, alpha) {
  const rgb = {
    r: Math.round(base.r + (goal.r - base.r) * alpha),
    g: Math.round(base.g + (goal.g - base.g) * alpha),
    b: Math.round(base.b + (goal.b - base.b) * alpha),
  };
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

function generatePalette(base, goal) {
  const palette = [];
  for (let i = 0; i <= 10; i++) {
    const rgb = mixColors(base, goal, 0.1 * i);
    palette.push(rgb);
  }
  return palette;
}

export default function usePaletteGenerator(color) {
  const { themeRgb } = useSelector((state) => ({
    themeRgb: state.theme.colorRgb,
  }));

  const colorRgb = hexToRgb(color);
  const palette = generatePalette(themeRgb, colorRgb);

  return palette;
}

export { mixColors, hexToRgb };
