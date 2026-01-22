import React, { useState, useEffect, Suspense } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
  Link,
  NavLink,
} from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';
// import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Blocks from './pages/Blocks';
import Logout from './pages/Logout';
import FetchError from './pages/FetchError';
import VerificationError from './pages/VerificationError';
import Verification from './pages/Verification';

import Projects from './pages/Projects';
import Skilltrees from './pages/Skilltrees';
import ToDoList from './pages/ToDoList';
import Habit from './pages/Habit';
import Project from './pages/Project';
import NotFound from './pages/404';
import Settings from './pages/Settings';
import MainMenu from './components/MainMenu';
import Stopwatch from './components/Stopwatch';
import Sidebar from './components/Sidebar';
import Overlay from './components/Overlay';
import Onboarding from './components/Onboarding';
import CellTip from './components/CellTip';
import CellAdd from './components/CellAdd';
import { useGetSettingsQuery, useGetSelfQuery } from './state/services/settings';
import { useGetStopwatchQuery } from './state/services/stopwatch';
import SidebarMobile from './components/SidebarMobile';
import { ProfilePicture } from './components/UI';
import { hasJWT } from './state/services/auth';
import { useMediaColorScheme } from './hooks/useMediaColorScheme';
import isPWA from './utils/pwa';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(hasJWT());

  useEffect(() => {
    const checkJWT = () => {
      setLoggedIn(hasJWT());
    };
    window.addEventListener('storage', checkJWT);
    return () => window.removeEventListener('storage', checkJWT);
  }, []);

  if (loggedIn === undefined) {
    return <div className="loader" />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/" element={<AuthRoutes loggedIn={loggedIn} changeAuth={setLoggedIn} />}>
          {!window.APP_CONFIG.DISABLE_SIGNUP && <Route path="/signup/" element={<Signup />} />}
          <Route path="/login/" element={<Login />} />
        </Route>
        {loggedIn && (
          <Route
            path="/"
            element={
              <Suspense fallback={<></>}>
                <PrivateRoutes loggedIn={loggedIn} changeAuth={setLoggedIn} />
              </Suspense>
            }
          >
            <Route path="*" element={<NotFound />} />
            <Route path="/verification/:token" element={<Verification />} />
            <Route path="/blocks/*" element={<Blocks />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/projects/*" element={<Projects />} />
            <Route path="/skills/*" element={<Skilltrees />} />
            <Route path="/todo/*" element={<ToDoList />} />
            <Route path="/habit/:habitID/*" element={<Habit />} />
            <Route path="/project/:projectID/*" element={<Project />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

const PrivateRoutes = (params) => {
  const { loggedIn, changeAuth } = params;
  const location = useLocation();
  const settings = useGetSettingsQuery();
  const self = useGetSelfQuery();
  const stopwatch = useGetStopwatchQuery();

  const [sidebarHidden, setSidebarHidden] = useState(true);
  const toggleSidebar = () => {
    document.querySelector('.sidebar').scrollTop = 0;
    setSidebarHidden(!sidebarHidden);
  };

  useHotkeys('0', toggleSidebar);

  useEffect(() => {
    changeAuth(hasJWT());
  }, [location.pathname]);

  if (self.isLoading) {
    return <div className="loader" />;
  }

  if (!loggedIn) return <Navigate to="/login" replace state={{ from: location }} />;

  // if (!isPWA()) {
  if (settings?.error || self?.error || stopwatch?.error) {
    if (settings?.error?.originalStatus === 401) {
      localStorage.removeItem('token');
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return <FetchError />;
  }

  if (!self?.data?.verified && process.env.REACT_APP_STAGE !== 'dev') {
    const path = location.pathname.split('/');
    if (path[1] === 'verification') {
      return <Outlet />;
    }
    return <VerificationError />;
  }
  // }

  if (settings.isLoading || self.isLoading || stopwatch.isLoading) return <></>;

  return (
    <>
      <div id="content">
        <MainMenu toggleSidebar={toggleSidebar} />
        <Sidebar hidden={sidebarHidden} />
        <main>
          <Outlet />
        </main>
        <Stopwatch />
      </div>
      <div
        className={sidebarHidden ? 'overlay' : 'overlay overlay-active overlay-sidebar'}
        onMouseDown={toggleSidebar}
      />
      <CellTip />
      <CellAdd />
      <SidebarMobile />
      <Overlay />
      {(settings?.data?.hide_onboarding ?? false) ? <></> : <Onboarding />}
    </>
  );
};

const AuthRoutes = (params) => {
  const { loggedIn, changeAuth } = params;
  const location = useLocation();

  useMediaColorScheme();

  useEffect(() => {
    changeAuth(hasJWT());
  }, [location.pathname]);

  return loggedIn ? (
    <Navigate to="/projects" replace state={{ from: location }} />
  ) : (
    <div id="content-auth">
      <div className="sidebar-auth">
        <h1 className="sidebar-auth-header">
          <Link tabIndex="0" to="/" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <ProfilePicture type="small" />
            <div className="neohabit" />
          </Link>
        </h1>
      </div>
      <main className="registration-container">
        <section className="auth-intro">
          <p className="paragraph">
            Because <span className="neohabit" /> is currently in beta, some functionality is not
            completely implemented. Feel free to report any bugs on{' '}
            <Link to="https://github.com/Vsein/Neohabit/issues" target="_blank">
              github issues
            </Link>
            , or write directly to{' '}
            <Link to="https://www.reddit.com/user/VseinSama/" target="_blank">
              me on reddit
            </Link>{' '}
            or{' '}
            <Link to="https://discord.gg/uQ4XdE6raR" target="_blank">
              discord
            </Link>{' '}
            if you want to suggest anything.
          </p>
        </section>
        <Outlet />
        {window.APP_CONFIG.DISABLE_SIGNUP ? (
          <p className="login-ref">
            With the DISABLE_SIGNUP option enabled, new account creation is unavailable. You can
            still log into the accounts you created before enabling it. Or you can set it to false
            temporarily, restart docker compose, create an account, set it back to true once you
            did, and restart once again.
            {/* <Link to="https://github.com/Vsein/Neohabit#new-account-creation" target="_blank"> */}
            {/*   See documentation */}
            {/* </Link> */}
          </p>
        ) : (
          <></>
        )}
        {!window.APP_CONFIG.DISABLE_SIGNUP && location.pathname === '/login' ? (
          <p className="login-ref">
            Don&apos;t have an account? <NavLink to="/signup">Sign up</NavLink>
          </p>
        ) : (
          <></>
        )}
        {!window.APP_CONFIG.DISABLE_SIGNUP && location.pathname === '/signup' ? (
          <p className="login-ref">
            Already have an account? <NavLink to="/login">Log in</NavLink>
          </p>
        ) : (
          <></>
        )}
      </main>
    </div>
  );
};

export default App;
