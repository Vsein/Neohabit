import React from 'react';
import { Form } from 'react-final-form';
import { useNavigate } from 'react-router-dom';
import { EmailField, UsernameField, PasswordField } from '../components/AuthFields';
import { useLoginMutation } from '../state/services/auth';
import useTitle from '../hooks/useTitle';

export default function Login() {
  useTitle('Login | Neohabit');

  return <LoginForm />;
}

function LoginForm() {
  const navigate = useNavigate();
  const [sendLoginRequest] = useLoginMutation();

  const login = async (values) => {
    const formData = new FormData(document.forms.loginForm);
    const data = Object.fromEntries(formData.entries());
    const res = await sendLoginRequest(data);
    if (res?.error) {
      if (res?.error?.data?.error === 'Wrong password') {
        return { password: 'Wrong password!' };
      }
      if (res?.error?.data?.error === 'User not found') {
        return { username: 'User not found' };
      }
      return { username: 'Login failed' };
    }
    if (res) navigate('/projects');
  };

  return (
    <Form
      initialValues={{
        username: '',
        password: '',
      }}
      onSubmit={login}
      validate={(values) => {
        const errors = {};
        if (!values.username) {
          errors.username = 'Required';
        }
        if (process.env.STRICT_USER_FIELDS && !values.password) {
          errors.password = 'Required';
        }
        return errors;
      }}
      render={({ submitError, handleSubmit, form, submitting, pristine, values }) => (
        <form
          className="registration"
          id="loginForm"
          onSubmit={async (e) => {
            await handleSubmit(e);
          }}
        >
          <h2>Login:</h2>
          <div className="registration-fields">
            <UsernameField />
            <PasswordField />
            <button type="submit" className="button-default stretch big" disabled={submitting}>
              Log in
            </button>
          </div>
        </form>
      )}
    />
  );
}
