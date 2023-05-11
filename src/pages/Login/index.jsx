import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  AuthSidebar,
  AuthIntro,
  EmailField,
  PasswordField,
} from '../../components/Auth';
import { sendLoginRequest } from '../../utils/auth';
import useTitle from '../../hooks/useTitle';

export default function Login() {
  useTitle('Login | Neohabit');

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

  const login = async (e) => {
    e.preventDefault();
    const formData = new FormData(document.forms.loginForm);
    const data = Object.fromEntries(formData.entries());
    const isSuccessful = await sendLoginRequest(data);
    if (isSuccessful) navigate('/dashboard');
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
