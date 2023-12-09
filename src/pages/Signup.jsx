import React from 'react';
import { Form } from 'react-final-form';
import { NavLink, useNavigate } from 'react-router-dom';
import { UsernameField, EmailField, PasswordField } from '../components/Auth';
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
    const isSuccessful = await sendSignupRequest(data);
    await sendLoginRequest(data);
    if (isSuccessful) navigate('/projects');
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
        if (!values.email) {
          errors.email = 'Required';
        }
        if (!values.password) {
          errors.password = 'Required';
        }
        if (!values.password_confirm) {
          errors.password_confirm = 'Required';
        } else if (values.password_confirm !== values.password) {
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
          <h2>Register:</h2>
          <div className="registration-fields">
            <UsernameField />
            <EmailField />
            <PasswordField type="define" />
            <PasswordField type="confirm" />
            <button type="submit" className="button-default stretch big" disabled={submitting}>
              Create Account
            </button>
          </div>
        </form>
      )}
    />
  );
}
