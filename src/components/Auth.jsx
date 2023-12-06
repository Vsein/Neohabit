import React, { useState } from 'react';
import { Icon } from '@mdi/react';
import { mdiEye, mdiEyeOff } from '@mdi/js';

function AuthSidebar() {
  return (
    <div className="sidebar-auth">
      <h1 className="sidebar-auth-header">
        <div className="neohabit" />
      </h1>
    </div>
  );
}

function AuthIntro() {
  return (
    <section className="auth-intro">
      <p className="paragraph">
        Are you struggling to find a good accountability partner? With this app, you&apos;ll learn
        how to be your own accountability partner. As well as develop real skills, and not get
        entrapped by some statistics which only stump your growth.
      </p>
      <p className="paragraph">
        You know what to do, my friend. <span className="neohabit" /> will just help you realize it.
      </p>
    </section>
  );
}

function UsernameField() {
  return (
    <div>
      <label htmlFor="name">Username</label>
      <input
        className="registration-field"
        type="text"
        id="name"
        name="username"
        required
        minLength="3"
        pattern="[a-zA-Z0-9]{3,20}"
        title="Your name should only contain latin characters and numbers!"
      />
    </div>
  );
}

function EmailField() {
  return (
    <div>
      <label htmlFor="email">E-mail</label>
      <input className="registration-field" type="email" name="email" required />
    </div>
  );
}

function PasswordField({ type }) {
  const [passwordHidden, setPasswordHidden] = useState(true);
  const togglePasswordVisibility = () => setPasswordHidden(!passwordHidden);

  return (
    <div>
      <label htmlFor={type === 'confirm' ? 'password_confirm' : 'password'}>
        {type === 'confirm' ? 'Confirm Password' : 'Password'}
      </label>
      <div className="registration-field-container">
        <input
          className="registration-field"
          type={passwordHidden ? 'password' : 'test'}
          name={type === 'confirm' ? 'password_confirm' : 'password'}
          required
          minLength="8"
          maxLength="30"
          // onChange="onChange()"
          autoComplete="new-password"
        />
        <button className="icon-password" type="button" onClick={togglePasswordVisibility}>
          <Icon path={passwordHidden ? mdiEye : mdiEyeOff} />
        </button>
      </div>
    </div>
  );
}

export { AuthSidebar, AuthIntro, UsernameField, EmailField, PasswordField };
