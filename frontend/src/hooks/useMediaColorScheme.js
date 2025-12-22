import { useEffect } from 'react';
import changeTheme from '../utils/changeTheme';

function getPreferredTheme() {
  // prefer user-set theme over prefers-color-scheme
  const preferDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return localStorage.getItem('theme') || (preferDarkMode ? 'dark' : 'light');
}

function useMediaColorScheme() {
  useEffect(() => {
    changeTheme(getPreferredTheme());

    const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");
    darkModePreference.addEventListener("change", e => changeTheme(getPreferredTheme()));
    return () => {
      darkModePreference.removeEventListener("change", e => changeTheme(getPreferredTheme()));
    };
  }, []);
}

export { useMediaColorScheme, getPreferredTheme };
