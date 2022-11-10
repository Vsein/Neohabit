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
import { setAuthToken } from './api/auth';

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const PrivateRoutes = (params) => {
  const { loggedIn } = params;
  const location = useLocation();

  return loggedIn ? (
    <Outlet />
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
