import { useState, useEffect } from 'react';

export default function useMenuToggler() {
  const [menuOpened, setMenuOpened] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpened(!menuOpened);
  };

  const closeMenu = () => {
    setMenuOpened(false);
  };

  useEffect(() => {
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  });

  return [menuOpened, { toggleMenu }];
}
