import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/main.scss';
import {
  AuthSidebar,
  AuthIntro,
  UsernameField,
  EmailField,
  PasswordField,
} from '../AuthComponents';
import { setAuthToken } from '../../api/auth';

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

  const signup = (e) => {
    e.preventDefault();
    const formData = new FormData(document.forms.signupForm);
    const data = new URLSearchParams([...formData.entries()]);

    axios.post('http://localhost:9000/signup', data);
    axios.post('http://localhost:9000/login', data)
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
