import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
  NavLink,
} from 'react-router-dom';
import NeohabitPreview from './logos/preview.png';
import ToDoList from './pages/ToDoList';
import Signup from './pages/Signup';
import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
import Overview from './pages/Overview';
import Projects from './pages/Projects';
import Skilltrees from './pages/Skilltrees';
import Habit from './pages/Habit';
import Project from './pages/Project';
import Blocks from './pages/Blocks';
import Logout from './pages/Logout';
import NotFound from './pages/404';
import FetchError from './pages/FetchError';
import VerificationError from './pages/VerificationError';
import Landing from './pages/Landing';
import Settings from './pages/Settings';
import MainMenu from './components/MainMenu';
import Stopwatch from './components/Stopwatch';
import Sidebar from './components/Sidebar';
import Overlay from './components/Overlay';
import CellTip from './components/CellTip';
import CellAdd from './components/CellAdd';
import { useGetSettingsQuery, useGetSelfQuery } from './state/services/settings';
import { useGetStopwatchQuery } from './state/services/stopwatch';
import SidebarMobile from './components/SidebarMobile';
import { hasJWT } from './state/services/auth';
import useKeyPress from './hooks/useKeyPress';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(undefined);

  useEffect(() => {
    setLoggedIn(hasJWT());
  }, []);

  if (loggedIn === undefined) {
    return <div className="loader" />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/" element={<AuthRoutes loggedIn={loggedIn} changeAuth={setLoggedIn} />}>
          <Route path="/signup/" element={<Signup />} />
          <Route path="/login/" element={<Login />} />
        </Route>
        <Route path="/" element={<PrivateRoutes loggedIn={loggedIn} changeAuth={setLoggedIn} />}>
          <Route path="*" element={<NotFound />} />
          <Route path="/projects/*" element={<Projects />} />
          <Route path="/skills/*" element={<Skilltrees />} />
          <Route path="/todo/*" element={<ToDoList />} />
          <Route path="/overview/" element={<Overview />} />
          <Route path="/blocks/*" element={<Blocks />} />
          <Route path="/habit/:habitID/*" element={<Habit />} />
          <Route path="/project/:projectID/*" element={<Project />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
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

  useKeyPress(['s'], toggleSidebar);

  useEffect(() => {
    changeAuth(hasJWT());
  }, [location.pathname]);

  if (self.isLoading) {
    return <div className="loader" />;
  }

  if (!loggedIn) return <Navigate to="/login" replace state={{ from: location }} />;

  if (settings?.error || self?.error || stopwatch?.error) {
    if (settings?.error?.originalStatus === 401) {
      localStorage.clear();
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return <FetchError />;
  }

  if (!self.verified) {
    return <VerificationError />;
  }

  if (settings.isLoading || self.isLoading || stopwatch.isLoading) return <></>;

  return (
    <>
      <div id="content">
        <MainMenu toggleSidebar={toggleSidebar} />
        <Sidebar hidden={sidebarHidden} />
        <main>
          <Outlet />
        </main>
      </div>
      <div
        className={sidebarHidden ? 'overlay' : 'overlay overlay-active overlay-sidebar'}
        onMouseDown={toggleSidebar}
      />
      <CellTip />
      <CellAdd />
      <Stopwatch />
      <SidebarMobile />
      <Overlay />
    </>
  );
};

const AuthRoutes = (params) => {
  const { loggedIn, changeAuth } = params;
  const location = useLocation();

  useEffect(() => {
    changeAuth(hasJWT());
  }, [location.pathname]);

  return loggedIn ? (
    <Navigate to="/projects" replace state={{ from: location }} />
  ) : (
    <div id="content-auth">
      <div className="sidebar-auth">
        <h1 className="sidebar-auth-header">
          <div className="neohabit" />
        </h1>
      </div>
      <main className="registration-container">
        <section className="auth-intro">
          <p className="paragraph">
            Are you struggling to find a good accountability partner? With this app, you&apos;ll
            learn how to be your own accountability partner. As well as develop real skills, and not
            get entrapped by some statistics which only stump your growth.
          </p>
          <p className="paragraph">
            You know what to do, my friend. <span className="neohabit" /> will just help you realize
            it.
          </p>
        </section>
        <Outlet />
        {location.pathname === '/login' ? (
          <p className="login-ref">
            Don&apos;t have an account? <NavLink to="/signup">Sign up</NavLink>
          </p>
        ) : (
          <p className="login-ref">
            Already have an account? <NavLink to="/login">Log in</NavLink>
          </p>
        )}
      </main>
    </div>
  );
};

export default App;
