import React, { useState } from 'react';
import { Icon } from '@mdi/react';
import { mdiEye, mdiEyeOff } from '@mdi/js';

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

export { UsernameField, EmailField, PasswordField };
