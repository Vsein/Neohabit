export default function changeTheme(newTheme) {
  const root = document.documentElement;
  const link = document.querySelector("link[rel~='icon']");
  link.href = newTheme === 'dark' ? '/favicon-dark2.ico' : '/favicon.ico';
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute('content', newTheme === 'dark' ? '#1c2128' : '#00c4cd');
  root.className = newTheme;
  localStorage.setItem('theme', newTheme);
};
