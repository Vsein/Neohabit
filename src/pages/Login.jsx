import React from 'react';
import { Form } from 'react-final-form';
import { NavLink, useNavigate } from 'react-router-dom';
import { EmailField, PasswordField } from '../components/Auth';
import { useLoginMutation } from '../state/services/auth';
import useTitle from '../hooks/useTitle';

export default function Login() {
  useTitle('Login | Neohabit');

  return <LoginForm />;
}

function LoginForm() {
  const navigate = useNavigate();
  const [sendLoginRequest] = useLoginMutation();

  const login = async () => {
    const formData = new FormData(document.forms.loginForm);
    const data = Object.fromEntries(formData.entries());
    const isSuccessful = await sendLoginRequest(data);
    if (isSuccessful) navigate('/projects');
  };

  return (
    <Form
      initialValues={{
        email: '',
        password: '',
      }}
      onSubmit={login}
      validate={(values) => {
        const errors = {};
        if (!values.email) {
          errors.email = 'Required';
        }
        if (!values.password) {
          errors.password = 'Required';
        }
        return errors;
      }}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form
          className="registration"
          id="loginForm"
          onSubmit={async (e) => {
            await handleSubmit(e);
          }}
        >
          <h2>Enter:</h2>
          <div className="registration-fields">
            <EmailField />
            <PasswordField type="define" />
            <button type="submit" className="button-default stretch big" disabled={submitting}>
              Log in
            </button>
          </div>
        </form>
      )}
    />
  );
}
