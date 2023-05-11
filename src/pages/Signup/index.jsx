import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  AuthSidebar,
  AuthIntro,
  UsernameField,
  EmailField,
  PasswordField,
} from '../../components/Auth';
import { sendSignupRequest } from '../../utils/auth';
import useTitle from '../../hooks/useTitle';

export default function Signup() {
  useTitle('Signup | Neohabit');

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

  const signup = async (e) => {
    e.preventDefault();
    const formData = new FormData(document.forms.signupForm);
    const data = Object.fromEntries(formData.entries());
    const isSuccessful = await sendSignupRequest(data);
    if (isSuccessful) navigate('/dashboard');
  };

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
