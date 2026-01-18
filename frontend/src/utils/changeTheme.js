export default function changeTheme(newTheme) {
  const root = document.documentElement;
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute('content', newTheme === 'dark' ? '#1c2128' : '#00c4cd');
  root.className = newTheme;
  localStorage.setItem('theme', newTheme);
};
