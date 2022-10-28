import React, { useEffect } from 'react';
import '../../styles/main.scss';

export default function Signup() {
  useEffect(() => {
    document.title = 'Signup | Neohabit';
  });

  return (
    <div id="content-signup">
      <div className="sidebar-signup">
        <h1 className="neohabit sidebar-header" />
      </div>
      <main>
        <div className="welcome">
          <p>
            Are you struggling to find a good accountability partner? With this
            app, you&apos;ll learn how to be your own accountability partner. As
            well as develop real skills, and not get entrapped by some
            statistics which only stump your growth.
          </p>
          <p>
            You know what to do, my friend. <span className="neohabit"></span>{' '}
            will just help you realize it.
          </p>
        </div>
        <form className="registration" id="registration" action="#">
          <h2>Register:</h2>
          <div className="registration-fields">
            <div>
              <label htmlFor="name">First Name</label>
              <input
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
              <input type="email" id="mail" name="usermail" required />
            </div>
            <div>
              <label htmlFor="pwd">Password</label>
              <input
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
          </div>
        </form>
        <div className="login">
          <button type="submit" form="registration">
            Create Account
          </button>
          <p>
            Already have an account? <a href="">Log in</a>
          </p>
        </div>
      </main>
    </div>
  );
}
