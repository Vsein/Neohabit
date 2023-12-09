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

  const signup = async (e) => {
    e.preventDefault();
    const formData = new FormData(document.forms.signupForm);
    const data = Object.fromEntries(formData.entries());
    const isSuccessful = await sendSignupRequest(data);
    await sendLoginRequest(data);
    if (isSuccessful) navigate('/projects');
  };

  return (
    <Form
      initialValues={{
        name: habit?.name,
        description: habit?.description,
        color: habit?.color,
        elimination: habit?.elimination,
        numeric: habit?.numeric,
      }}
      onSubmit={signup}
      validate={(values) => {
        const errors = {};
        if (!values.username) {
          errors.name = 'Required';
        }
        if (!values.password) {
          errors.password = 'Required';
        }
        if (!values.confirm) {
          errors.confirm = 'Required';
        } else if (values.confirm !== values.password) {
          errors.confirm = 'Must match';
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
            <button type="submit" className="button-default stretch big">
              Create Account
            </button>
          </div>
        </form>
      )}
    />
  );
}
