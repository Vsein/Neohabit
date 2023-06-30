import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { changeTo } from '../state/features/theme/themeSlice';

export default function useThemeToggler() {
  const dispatch = useDispatch();
  const [theme, setTheme] = useState('dark');

  const changeTheme = (newTheme) => {
    const root = document.documentElement;
    dispatch(changeTo(newTheme));
    const link = document.querySelector("link[rel~='icon']");
    link.href = newTheme === 'dark' ? './logos/favicon-dark2.ico' : './logos/favicon.ico';
    root.className = newTheme;
    setTheme(newTheme);
  };

  return [theme, { changeTheme }];
}
