import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  AuthSidebar,
  AuthIntro,
  UsernameField,
  EmailField,
  PasswordField,
} from '../../components/Auth';
import { useSignupMutation, useLoginMutation } from '../../state/services/auth';
import useTitle from '../../hooks/useTitle';

export default function Signup() {
  useTitle('Signup | Neohabit');

  return (
    <div id="content-auth">
      <AuthSidebar />
      <main className="registration-container">
        <AuthIntro />
        <SignupForm />
        <p className="login-ref">
          Already have an account? <NavLink to="/login">Log in</NavLink>
        </p>
      </main>
    </div>
  );
}

function SignupForm() {
  const navigate = useNavigate();
  const [sendSignupRequest] = useSignupMutation();
  const [sendLoginRequest] = useLoginMutation();

  const signup = async (e) => {
    e.preventDefault();
    const formData = new FormData(document.forms.signupForm);
    const data = Object.fromEntries(formData.entries());
    const isSuccessful = await sendSignupRequest(data);
    await sendLoginRequest(data);
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
        <button type="submit" className="button-default stretch big">
          Create Account
        </button>
      </div>
    </form>
  );
}
