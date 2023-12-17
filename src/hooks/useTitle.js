import { useEffect } from 'react';

export default function useTitle(title) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    if (document.title === prevTitle) {
      return () => {
        document.title = prevTitle;
      };
    }
  });
}
