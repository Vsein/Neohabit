import { useState, useEffect } from 'react';

export default function useMenuToggler() {
  const [menuOpened, setMenuOpened] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpened(!menuOpened);
  };

  useEffect(() => {
    document.addEventListener('click', () => setMenuOpened(false));
  });

  return [menuOpened, { toggleMenu }];
}
