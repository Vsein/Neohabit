export default function isPWA() {
  let displayMode = 'browser';
  const mqStandAlone = '(display-mode: standalone)';
  if (navigator.standalone || window.matchMedia(mqStandAlone).matches) {
    displayMode = 'standalone';
  }
  // displayMode = 'standalone'
  return displayMode === 'standalone';
}
