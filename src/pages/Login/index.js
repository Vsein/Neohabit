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
import { setAuthToken } from '../../api/axios';

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

  async function login(e) {
    e.preventDefault();
    const formData = new FormData(document.forms.loginForm);
    const data = new URLSearchParams([...formData.entries()]);
    const res = await fetch('http://localhost:9000/api/login', {
      method: 'POST',
      body: data,
    });
    const resText = await res.text();
    if (resText === 'Logged in!') {
      navigate('/dashboard');
    } else {
      console.log('OOps');
    }
  }

  const handleSubmit = (e) => {
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
        window.location.href = '/';
      })
      .catch((err) => console.log(err));
  };

  return (
    <form className="registration" id="loginForm" onSubmit={handleSubmit}>
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
