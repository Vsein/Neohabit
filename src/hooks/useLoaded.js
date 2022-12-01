import { useState, useEffect } from 'react';

export default function useLoaded() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return [loaded];
}
