import React from 'react';
import { Form } from 'react-final-form';
import { useNavigate } from 'react-router-dom';
import { UsernameField, EmailField, PasswordField } from '../components/AuthFields';
import { useSignupMutation, useLoginMutation } from '../state/services/auth';
import useTitle from '../hooks/useTitle';

export default function Signup() {
  useTitle('Signup | Neohabit');

  return <SignupForm />;
}

function SignupForm() {
  const navigate = useNavigate();
  const [sendSignupRequest] = useSignupMutation();
  const [sendLoginRequest] = useLoginMutation();

  const signup = async () => {
    const formData = new FormData(document.forms.signupForm);
    const data = Object.fromEntries(formData.entries());
    const res = await sendSignupRequest(data);
    if (res?.error) {
      if (res?.error?.data?.error === 'Username already exists') {
        return { username: 'Username already exists' };
      }
      if (res?.error?.data?.error === 'Email is already registered') {
        return { email: 'Email is already registered' };
      }
      return { username: 'Signup failed' };
    }
    await sendLoginRequest(data);
    if (res) navigate('/projects');
  };

  return (
    <Form
      initialValues={{
        username: '',
        email: '',
        password: '',
        password_confirm: '',
      }}
      onSubmit={signup}
      validate={(values) => {
        const errors = {};
        if (!values.username) {
          errors.username = 'Required';
        }
        if (process.env.STRICT_USER_FIELDS) {
          if (process.env.REQUIRE_EMAIL && !values.email) {
            errors.email = 'Required';
          }
          if (!values.password) {
            errors.password = 'Required';
          }
          if (!values.password_confirm) {
            errors.password_confirm = 'Required';
          }
        }
        if (values.password_confirm !== values.password) {
          errors.password_confirm = 'Must match';
        }
        return errors;
      }}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form
          className="registration"
          id="signupForm"
          onSubmit={async (e) => {
            await handleSubmit(e);
          }}
        >
          <h2>New account:</h2>
          <div className="registration-fields">
            <UsernameField showAsterisk />
            <EmailField signup />
            <PasswordField signup type="define" />
            <PasswordField signup type="confirm" />
            <button type="submit" className="button-default stretch big" disabled={submitting}>
              Sign up
            </button>
          </div>
        </form>
      )}
    />
  );
}
