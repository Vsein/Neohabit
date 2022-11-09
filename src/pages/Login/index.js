import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/main.scss';
import {
  AuthSidebar,
  AuthIntro,
  EmailField,
  UsernameField,
  PasswordField,
} from '../AuthComponents';
import { setAuthToken } from '../../api/auth';

export default function Login() {
  useEffect(() => {
    document.title = 'Login | Neohabit';
  });

  return (
    <div id="content-signup">
      <AuthSidebar />
      <div className="registration-container">
        <AuthIntro />
        <LoginForm />
        <p className="login-ref">
          Don&apos;t have an account? <NavLink to="/signup">Sign up</NavLink>
        </p>
      </div>
    </div>
  );
}

function LoginForm() {
  const navigate = useNavigate();

  const login = (e) => {
    e.preventDefault();
    const formData = new FormData(document.forms.loginForm);
    const data = new URLSearchParams([...formData.entries()]);

    axios
      .post('http://localhost:9000/login', data)
      .then((response) => {
        const token = response.data.token;
        localStorage.setItem('token', token);
        console.log(token);
        setAuthToken(token);
        navigate('/dashboard');
      })
      .catch((err) => console.log(err));
  };

  return (
    <form className="registration" id="loginForm" onSubmit={login}>
      <h2>Enter:</h2>
      <div className="registration-fields">
        <EmailField />
        <PasswordField type="define" />
        <button type="submit" className="create-acc-btn">
          Log in
        </button>
      </div>
    </form>
  );
}
