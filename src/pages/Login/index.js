import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/main.scss';
import {
  AuthSidebar,
  AuthIntro,
  EmailField,
  PasswordField,
} from '../AuthComponents';

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
  return (
    <form className="registration" id="registration" action="#">
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
