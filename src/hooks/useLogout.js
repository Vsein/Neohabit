import { useEffect, useState } from 'react';

export default function useLogout() {
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    localStorage.clear();
    setLoggedOut(true);
  }, []);

  return [loggedOut];
}
