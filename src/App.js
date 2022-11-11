import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';
import ToDo from './pages/ToDo';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HabitsPage from './pages/Habits';
import NotFound from './pages/404';
import MainMenu from './components/MainMenu';
import Sidebar from './components/Sidebar';
import SidebarMobile from './components/SidebarMobile';
import { setAuthToken } from './api/auth';
import { fetchProjects, fetchFilters } from './api/todolist';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(true);

  function hasJWT() {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      return true;
    }
    return false;
  }

  useEffect(() => {
    setLoggedIn(hasJWT());
  }, []);

  if (loggedIn === undefined) {
    return null; // or loading indicator/spinner/etc
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthRoutes loggedIn={loggedIn} />}>
          <Route path="/signup/" element={<Signup />} />
          <Route path="/login/" element={<Login />} />
        </Route>
        <Route path="/" element={<PrivateRoutes loggedIn={loggedIn} />}>
          <Route path="/dashboard/" element={<Dashboard />} />
          <Route path="/todo/*" element={<ToDo />} />
          <Route path="/habits/*" element={<HabitsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const PrivateRoutes = (params) => {
  const { loggedIn } = params;
  const location = useLocation();

  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    async function init() {
      const [projectsFetched, filtersFetched] = await Promise.all([
        fetchProjects(),
        fetchFilters(),
      ]);

      setProjects(projectsFetched);
      setFilters(filtersFetched);
    }
    init();
  }, []);

  const [sidebarHidden, setSidebarHidden] = useState(false);

  const toggleSidebar = () => {
    setSidebarHidden(!sidebarHidden);
  };

  return loggedIn ? (
    <div id="content">
      <MainMenu toggleSidebar={toggleSidebar} />
      <Sidebar hidden={sidebarHidden} projects={projects} filters={filters} />
      <Outlet />
      <SidebarMobile projects={projects} filters={filters} />
    </div>
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

const AuthRoutes = (params) => {
  const { loggedIn } = params;
  const location = useLocation();

  return loggedIn ? (
    <Navigate to="/dashboard" replace state={{ from: location }} />
  ) : (
    <Outlet />
  );
};

export default App;
