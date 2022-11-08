import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../styles/main.scss';
import {
  AuthSidebar,
  AuthIntro,
  UsernameField,
  EmailField,
  PasswordField,
} from '../AuthComponents';

export default function Signup() {
  useEffect(() => {
    document.title = 'Signup | Neohabit';
  });

  return (
    <div id="content-signup">
      <AuthSidebar />
      <div className="registration-container">
        <AuthIntro />
        <SignupForm />
        <p className="login-ref">
          Already have an account? <NavLink to="/login">Log in</NavLink>
        </p>
      </div>
    </div>
  );
}

function SignupForm() {
  const navigate = useNavigate();

  async function signup(e) {
    e.preventDefault();
    const formData = new FormData(document.forms.signupForm);
    const data = new URLSearchParams([...formData.entries()]);
    const res = await fetch('http://localhost:9000/api/signup', { method: 'POST', body: data });
    const resText = await res.text();
    if (resText === 'Logged in!') {
      navigate('/dashboard');
    } else {
      console.log('OOps');
    }
  }

  return (
    <form className="registration" id="signupForm" onSubmit={signup}>
      <h2>Register:</h2>
      <div className="registration-fields">
        <UsernameField />
        <EmailField />
        <PasswordField type="define" />
        <PasswordField type="confirm" />
        <button type="submit" className="create-acc-btn">
          Create Account
        </button>
      </div>
    </form>
  );
}
