import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthSidebar, AuthIntro, EmailField, PasswordField } from '../../components/Auth';
import { useLoginMutation } from '../../state/services/auth';
import useTitle from '../../hooks/useTitle';

export default function Login() {
  useTitle('Login | Neohabit');

  return (
    <div id="content-auth">
      <AuthSidebar />
      <main className="registration-container">
        <AuthIntro />
        <LoginForm />
        <p className="login-ref">
          Don&apos;t have an account? <NavLink to="/signup">Sign up</NavLink>
        </p>
      </main>
    </div>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const [sendLoginRequest] = useLoginMutation();

  const login = async (e) => {
    e.preventDefault();
    const formData = new FormData(document.forms.loginForm);
    const data = Object.fromEntries(formData.entries());
    const isSuccessful = await sendLoginRequest(data);
    if (isSuccessful) navigate('/projects');
  };

  return (
    <form className="registration" id="loginForm" onSubmit={login}>
      <h2>Enter:</h2>
      <div className="registration-fields">
        <EmailField />
        <PasswordField type="define" />
        <button type="submit" className="button-default stretch big">
          Log in
        </button>
      </div>
    </form>
  );
}
