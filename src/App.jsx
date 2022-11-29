import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';
import ToDoList from './pages/ToDoList';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Logout from './pages/Logout';
import Logo from './pages/Logo';
import NotFound from './pages/404';
import Landing from './pages/Landing';
import MainMenu from './components/MainMenu';
import Sidebar from './components/Sidebar';
// import SidebarMobile from './components/SidebarMobile';
import { hasJWT } from './utils/auth';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(true);

  const loader = document.querySelector('.loader');
  const showLoader = () => loader.classList.remove('loader--hide');
  const hideLoader = () => loader.classList.add('loader--hide');

  useEffect(() => {
    setLoggedIn(hasJWT());
    hideLoader();
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
          <Route path="/dashboard/" element={<Dashboard />} />
          <Route path="/todo/*" element={<ToDoList />} />
          <Route path="/habits/*" element={<Habits />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/logo" element={<Logo />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const PrivateRoutes = (params) => {
  const { loggedIn, changeAuth } = params;
  const location = useLocation();

  useEffect(() => {
    changeAuth(hasJWT());
  }, [location.pathname]);

  const [sidebarHidden, setSidebarHidden] = useState(true);

  const toggleSidebar = () => {
    setSidebarHidden(!sidebarHidden);
  };

  return loggedIn ? (
    <div id="content">
      <MainMenu toggleSidebar={toggleSidebar} />
      <Sidebar hidden={sidebarHidden} />
      <Outlet />
      {/* <SidebarMobile /> */}
    </div>
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

  return loggedIn ? (
    <Navigate to="/dashboard" replace state={{ from: location }} />
  ) : (
    <Outlet />
  );
};

export default App;
