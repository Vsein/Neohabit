import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function useLogout() {
  const [loggedOut, setLoggedOut] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.clear();
    dispatch({ type: 'RESET' });
    setLoggedOut(true);
  }, []);

  return [loggedOut];
}
