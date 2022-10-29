import React, { useEffect } from 'react';
import '../../styles/main.scss';

export default function Signup() {
  useEffect(() => {
    document.title = 'Signup | Neohabit';
  });

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
              <input
                className="registration-field"
                type="password"
                id="pwd"
                name="password"
                required
                minLength="8"
                maxLength="30"
                // onChange="onChange()"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label htmlFor="confirm">Confirm Password</label>
              <input
                className="registration-field"
                type="password"
                id="confirm"
                name="confirm"
                required
                minLength="8"
                maxLength="30"
                // onChange="onChange()"
                autoComplete="new-password"
              />
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
