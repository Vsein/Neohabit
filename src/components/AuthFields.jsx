import React, { useState } from 'react';
import { Icon } from '@mdi/react';
import { mdiEye, mdiEyeOff } from '@mdi/js';
import Field from './FieldWrapper';
import {
  requiredValidator,
  boundsValidator,
  onlyLatinAndNumbersValidator,
  simpleEmailValidator,
  composeValidators,
} from '../utils/validators';

function UsernameField() {
  return (
    <Field
      name="username"
      id="name"
      required
      minLength="4"
      pattern="[a-zA-Z0-9]{3,20}"
      title="Your name should only contain latin characters and numbers!"
      validate={composeValidators(
        requiredValidator,
        boundsValidator(4, 20),
        onlyLatinAndNumbersValidator,
      )}
    >
      {({ input, meta }) => (
        <div>
          <label htmlFor="name">
            Username
            {(meta.error || (meta.submitError && !meta.dirtySinceLastSubmit)) && meta.touched && (
              <span className="registration-error">{meta.error || meta.submitError}</span>
            )}
          </label>
          <input {...input} className="registration-field" type="text" />
        </div>
      )}
    </Field>
  );
}

function EmailField({ signup = false }) {
  return (
    <Field
      name="email"
      validate={
        signup ? composeValidators(requiredValidator, simpleEmailValidator) : requiredValidator
      }
    >
      {({ input, meta }) => (
        <div>
          <label htmlFor="email">
            E-mail
            {(meta.error || (meta.submitError && !meta.dirtySinceLastSubmit)) && meta.touched && (
              <span className="registration-error">{meta.error || meta.submitError}</span>
            )}
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
      validate={composeValidators(requiredValidator, boundsValidator(8, 100))}
      // onChange="onChange()"
      autoComplete="new-password"
    >
      {({ input, meta }) => (
        <div>
          <label htmlFor={type === 'confirm' ? 'password_confirm' : 'password'}>
            {type === 'confirm' ? 'Confirm Password' : 'Password'}
            {(meta.error || (meta.submitError && !meta.dirtySinceLastSubmit)) && meta.touched && (
              <span className="registration-error">{meta.error || meta.submitError}</span>
            )}
          </label>
          <div className="registration-field-container">
            <input
              {...input}
              className="registration-field password-field"
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
