import React, { useState, useEffect } from 'react';
import '../../styles/main.scss';
import Icon from '@mdi/react';
import { mdiEye, mdiEyeOff } from '@mdi/js';

export default function Signup() {
  useEffect(() => {
    document.title = 'Signup | Neohabit';
  });

  const [passwordHidden, setPasswordHidden] = useState(true);
  const togglePasswordVisibility = () => setPasswordHidden(!passwordHidden);

  const [passwordConfirmationHidden, setPasswordConfirmationHidden] =
    useState(true);
  const togglePasswordConfirmationVisibility = () =>
    setPasswordConfirmationHidden(!passwordConfirmationHidden);

  return (
    <div id="content-signup">
      <div className="sidebar-signup">
        <h1 className="sidebar-header">
          <div className="neohabit" />
        </h1>
      </div>
      <div className="registration-container">
        <div className="welcome">
          <p className="paragraph">
            Are you struggling to find a good accountability partner? With this
            app, you&apos;ll learn how to be your own accountability partner. As
            well as develop real skills, and not get entrapped by some
            statistics which only stump your growth.
          </p>
          <p className="paragraph">
            You know what to do, my friend. <span className="neohabit" /> will
            just help you realize it.
          </p>
        </div>
        <form className="registration" id="registration" action="#">
          <h2>Register:</h2>
          <div className="registration-fields">
            <div>
              <label htmlFor="name">First Name</label>
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
            <div>
              <label htmlFor="mail">E-mail</label>
              <input
                type="email"
                id="mail"
                name="usermail"
                required
                className="registration-field"
              />
            </div>
            <div>
              <label htmlFor="pwd">Password</label>
              <div className="registration-field-container">
                <input
                  className="registration-field"
                  type={passwordHidden ? 'password' : 'test'}
                  id="pwd"
                  name="password"
                  required
                  minLength="8"
                  maxLength="30"
                  // onChange="onChange()"
                  autoComplete="new-password"
                />
                <button className="icon-password">
                  <Icon
                    path={passwordHidden ? mdiEye : mdiEyeOff}
                    onClick={togglePasswordVisibility}
                  />
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirm">Confirm Password</label>
              <div className="registration-field-container">
                <input
                  className="registration-field"
                  type={passwordConfirmationHidden ? 'password' : 'test'}
                  id="confirm"
                  name="confirm"
                  required
                  minLength="8"
                  maxLength="30"
                  // onChange="onChange()"
                  autoComplete="new-password"
                />
                <button className="icon-password">
                  <Icon
                    path={passwordConfirmationHidden ? mdiEye : mdiEyeOff}
                    onClick={togglePasswordConfirmationVisibility}
                  />
                </button>
              </div>
            </div>
            <div>
              <button type="submit" className="create-acc-btn">
                Create Account
              </button>
            </div>
          </div>
        </form>
        <p className="login-ref">
          Already have an account? <a href="">Log in</a>
        </p>
      </div>
    </div>
  );
}
