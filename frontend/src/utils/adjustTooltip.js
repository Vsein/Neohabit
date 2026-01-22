export default function adjustTooltip(tooltip, rect, rectParent) {
  const tipWidth = tooltip.getBoundingClientRect().width;
  tooltip.style.left = `${rect.x + rect.width / 2 - tipWidth / 2}px`;
  const leftBorder = rect.x + window.scrollX + rect.width / 2 - tipWidth / 2;
  const rightBorder = leftBorder + tipWidth;
  if (leftBorder < 0) {
    tooltip.style.left = `${rectParent.x + 10}px`;
  }
  if (rightBorder > rectParent.x + rectParent.width) {
    tooltip.style.left = `${rectParent.x + rectParent.width - tipWidth - 10}px`;
  }
  if (rectParent.width < tipWidth + 10) {
    tooltip.style.left = `${rectParent.x + rectParent.width / 2 - tipWidth / 2}px`;
  }
  if (window.scrollX) {
    tooltip.style.left = `${window.scrollX + rect.x + rect.width / 2 - tipWidth / 2}px`;
  }
}
