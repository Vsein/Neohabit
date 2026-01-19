import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useTitle from '../hooks/useTitle';

export default function FetchError() {
  useTitle('Error | Neohabit');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'RESET' });
    navigate('/login');
  };

  return (
    <div className="contentlist centering">
      <div className="contentlist-header">
        <h3>Error</h3>
      </div>
      {process.env.REACT_APP_STAGE === 'public-prod' ?
        <>
          <p className="back-ref" style={{ width: 'min(100%, 800px)' }}>
            If this is the first time you try to access this website, then our servers might be on
            maintenance currently, in which case we&apos;re sorry for the inconvenience.
          </p>
          <p className="back-ref" style={{ width: 'min(100%, 800px)' }}>
            Otherwise, you might have exceeded the allowed limit of requests, try again in a minute...
          </p>
        </> :
        <>
          <p className="back-ref" style={{ width: 'min(100%, 800px)' }}>
            If you stumbled here, try refreshing the page. If it doesn&apos;t help, and
            you&apos;re hosting Neohabit yourself, check your internet connection/server availability.
          </p>
          <p className="back-ref" style={{ width: 'min(100%, 800px)' }}>
            Otherwise, you can try to login in a new private window and test things there,
            or <a className="inline" onClick={logout} style={{ cursor: 'pointer' }}>log out </a>
            here and try logging back in.
          </p>
          <p className="back-ref" style={{ width: 'min(100%, 800px)' }}>
            Lastly, if the error persists, check what the console in the devtools (F12) tells you,
            and <Link className="inline" to="https://github.com/Vsein/Neohabit/issues">
              submit a bug report</Link>.
          </p>
        </>
      }
    </div>
  );
}
