import React, { useState } from 'react';
import { Icon } from '@mdi/react';
import { mdiEye, mdiEyeOff } from '@mdi/js';
import Field from './FieldWrapper';

const required = (value) => (value ? undefined : 'Required');
const bounds = (min, max) => (value) =>
  value.length >= min && value.length <= max ? undefined : `Must have ${min}-${max} symbols`;
const composeValidators =
  (...validators) =>
  (value) =>
    validators.reduce((error, validator) => error || validator(value), undefined);
const onlyLatinAndNumbers = (value) => {
  if (/^[a-z]*$/i.test(value)) return undefined;
  if (/^[0-9]*$/.test(value)) return 'Add at least one letter';
  if (/^[a-zA-Z0-9]*$/i.test(value)) return undefined;
  return 'Only latin and numbers';
};

function UsernameField() {
  return (
    <Field
      name="username"
      id="name"
      required
      minLength="4"
      pattern="[a-zA-Z0-9]{3,20}"
      title="Your name should only contain latin characters and numbers!"
      validate={composeValidators(required, bounds(4, 20), onlyLatinAndNumbers)}
    >
      {({ input, meta }) => (
        <div>
          <label htmlFor="name">
            Username
            {meta.error && meta.touched && <span className="registration-error">{meta.error}</span>}
          </label>
          <input {...input} className="registration-field" type="text" />
        </div>
      )}
    </Field>
  );
}

function EmailField({ signup = false }) {
  const simpleEmailValidation = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : 'Please enter valid email';

  return (
    <Field
      name="email"
      validate={signup ? composeValidators(required, simpleEmailValidation) : required}
    >
      {({ input, meta }) => (
        <div>
          <label htmlFor="email">
            E-mail
            {meta.error && meta.touched && <span className="registration-error">{meta.error}</span>}
          </label>
          <input {...input} className="registration-field" type="email" />
        </div>
      )}
    </Field>
  );
}

function PasswordField({ type }) {
  const [passwordHidden, setPasswordHidden] = useState(true);
  const togglePasswordVisibility = () => setPasswordHidden(!passwordHidden);

  return (
    <Field
      name={type === 'confirm' ? 'password_confirm' : 'password'}
      required
      minLength="8"
      maxLength="30"
      validate={composeValidators(required, bounds(8, 30))}
      // onChange="onChange()"
      autoComplete="new-password"
    >
      {({ input, meta }) => (
        <div>
          <label htmlFor={type === 'confirm' ? 'password_confirm' : 'password'}>
            {type === 'confirm' ? 'Confirm Password' : 'Password'}
            {meta.error && meta.touched && <span className="registration-error">{meta.error}</span>}
          </label>
          <div className="registration-field-container">
            <input
              {...input}
              className="registration-field"
              type={passwordHidden ? 'password' : 'test'}
            />
            <button className="icon-password" type="button" onClick={togglePasswordVisibility}>
              <Icon path={passwordHidden ? mdiEye : mdiEyeOff} />
            </button>
          </div>
        </div>
      )}
    </Field>
  );
}

export { UsernameField, EmailField, PasswordField };
