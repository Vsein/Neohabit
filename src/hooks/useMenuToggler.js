import { useState, useEffect } from 'react';
import useKeyPress from './useKeyPress';

export default function useMenuToggler() {
  const [menuOpened, setMenuOpened] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpened(!menuOpened);
  };

  useKeyPress(['i'], toggleMenu);

  const closeMenu = () => {
    setMenuOpened(false);
  };

  useEffect(() => {
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  });

  return [menuOpened, { toggleMenu }];
}
