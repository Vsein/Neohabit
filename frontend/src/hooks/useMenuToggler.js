import { useState, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

export default function useMenuToggler() {
  const [menuOpened, setMenuOpened] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpened(!menuOpened);
  };

  useHotkeys('i', toggleMenu);

  const closeMenu = () => {
    setMenuOpened(false);
  };

  useEffect(() => {
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  });

  return [menuOpened, { toggleMenu }];
}
