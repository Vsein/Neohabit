import React, { useEffect } from 'react';
import '../../styles/main.scss';
import {
  AuthSidebar,
  AuthIntro,
  UsernameField,
  EmailField,
  PasswordField,
} from '../AuthComponents';

export default function SignUp() {
  useEffect(() => {
    document.title = 'Signup | Neohabit';
  });

  return (
    <div id="content-signup">
      <AuthSidebar />
      <div className="registration-container">
        <AuthIntro />
        <SignUpForm />
        <p className="login-ref">
          Already have an account? <a href="">Log in</a>
        </p>
      </div>
    </div>
  );
}

function SignUpForm() {
  return (
    <form className="registration" id="registration" action="#">
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
