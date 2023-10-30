import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import ToDoList from './pages/ToDoList';
import Signup from './pages/Signup';
import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
import Overview from './pages/Overview';
import Projects from './pages/Projects';
import Skilltrees from './pages/Skilltrees';
import Habit from './pages/Habit';
import Project from './pages/Project';
import Logout from './pages/Logout';
import NotFound from './pages/404';
import Landing from './pages/Landing';
import Settings from './pages/Settings';
import MainMenu from './components/MainMenu';
import Stopwatch from './components/Stopwatch';
import Sidebar from './components/Sidebar';
import Overlay from './components/Overlay';
import CellTip from './components/CellTip';
import CellAdd from './components/CellAdd';
import { useGetSettingsQuery } from './state/services/settings';
// import SidebarMobile from './components/SidebarMobile';
import { hasJWT } from './state/services/auth';
import useKeyPress from './hooks/useKeyPress';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(undefined);

  useEffect(() => {
    setLoggedIn(hasJWT());
  }, []);

  if (loggedIn === undefined) {
    return null; // or loading indicator/spinner/etc
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
          <Route path="/dashboard/" element={<Overview />} />
          <Route path="/todo/*" element={<ToDoList />} />
          <Route path="/projects/*" element={<Projects />} />
          <Route path="/skills/*" element={<Skilltrees />} />
          <Route path="/habit/:habitID/*" element={<Habit />} />
          <Route path="/project/:projectID/*" element={<Project />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const PrivateRoutes = (params) => {
  const { loggedIn, changeAuth } = params;
  const location = useLocation();
  const settings = useGetSettingsQuery();

  useEffect(() => {
    changeAuth(hasJWT());
  }, [location.pathname]);

  const [sidebarHidden, setSidebarHidden] = useState(true);

  const toggleSidebar = () => {
    document.querySelector('.sidebar').scrollTop = 0;
    setSidebarHidden(!sidebarHidden);
  };

  useKeyPress(['s'], toggleSidebar);

  if (settings.isLoading) return <></>;

  return loggedIn ? (
    <>
      <div id="content">
        <MainMenu toggleSidebar={toggleSidebar} />
        <Sidebar hidden={sidebarHidden} />
        <main>
          <Outlet />
        </main>
        {/* <SidebarMobile /> */}
      </div>
      <div
        className={sidebarHidden ? 'overlay' : 'overlay overlay-active overlay-sidebar'}
        onMouseDown={toggleSidebar}
      />
      <CellTip />
      <CellAdd />
      <Stopwatch />
      <Overlay />
    </>
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

const AuthRoutes = (params) => {
  const { loggedIn, changeAuth } = params;
  const location = useLocation();

  useEffect(() => {
    changeAuth(hasJWT());
  }, [location.pathname]);

  return loggedIn ? <Navigate to="/dashboard" replace state={{ from: location }} /> : <Outlet />;
};

export default App;
