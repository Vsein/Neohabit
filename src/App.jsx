import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import ToDoList from './pages/ToDoList';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Overview from './pages/Overview';
import Habits from './pages/Habits';
import Project from './pages/Project';
import Logout from './pages/Logout';
import Logo from './pages/Logo';
import NotFound from './pages/404';
import Landing from './pages/Landing';
import Settings from './pages/Settings';
import MainMenu from './components/MainMenu';
import Stopwatch from './components/Stopwatch';
import Sidebar from './components/Sidebar';
import OverlayProject from './components/OverlayProject';
import OverlayTask from './components/OverlayTask';
import OverlayDelete from './components/OverlayDelete';
import CellTip from './components/CellTip';
import CellAdd from './state/features/cellAdd/CellAdd';
import { useGetProjectsQuery } from './state/services/project';
import { useGetTasksQuery } from './state/services/todolist';
import { useGetStopwatchQuery } from './state/services/stopwatch';
import { useGetSettingsQuery, useGetSelfQuery } from './state/services/settings';
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
          <Route path="/habits/*" element={<Habits />} />
          <Route path="/project/:projectID/*" element={<Project />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/logo" element={<Logo />} />
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
  const userInfo = useGetSelfQuery();
  const stopwatch = useGetStopwatchQuery();

  useEffect(() => {
    changeAuth(hasJWT());
  }, [location.pathname]);

  const [sidebarHidden, setSidebarHidden] = useState(true);

  const toggleSidebar = () => {
    document.querySelector('.sidebar').scrollTop = 0;
    setSidebarHidden(!sidebarHidden);
  };

  useKeyPress(['Tab'], toggleSidebar);

  const projects = useGetProjectsQuery();
  const tasks = useGetTasksQuery();

  if (
    settings.isFetching ||
    settings.isLoading ||
    userInfo.isFetching ||
    userInfo.isLoading ||
    stopwatch.isFetching ||
    stopwatch.isLoading
  ) {
    return null; // or loading indicator/spinner/etc
  }

  return loggedIn ? (
    <>
      <div id="content">
        <MainMenu toggleSidebar={toggleSidebar} />
        <Sidebar hidden={sidebarHidden} />
        <Outlet />
        <CellTip />
        <CellAdd />
        {/* <SidebarMobile /> */}
      </div>
      <Stopwatch />
      <OverlayDelete />
      {projects.isFetching || projects.isLoading || tasks.isFetching || tasks.isLoading ? (
        <> </>
      ) : (
        <>
          <OverlayProject />
          <OverlayTask />
        </>
      )}
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
