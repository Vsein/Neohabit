import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useAnchor() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (hash === '') {
      // if not a hash link, scroll to top
      window.scrollTo(0, 0);
    } else {
      // else scroll to id
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView();
        }
      }, 0);
    }
  }, [pathname, hash, key]); // do this on route change
}
