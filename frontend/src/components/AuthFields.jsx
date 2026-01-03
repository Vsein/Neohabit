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

function UsernameField({ showAsterisk = false }) {
  return (
    <Field
      name="username"
      id="name"
      required
      minLength="1"
      pattern="[a-zA-Z0-9]{3,20}"
      title="Your name should only contain latin characters and numbers!"
      validate={composeValidators(
        requiredValidator,
        boundsValidator(1, 32),
        onlyLatinAndNumbersValidator,
      )}
    >
      {({ input, meta }) => (
        <div>
          <label htmlFor="name">
            Username
            {showAsterisk ? '*' : ''}
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
        signup ? composeValidators(process.env.REQUIRE_EMAIL && requiredValidator, simpleEmailValidator) : requiredValidator
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

function PasswordField({ type, signup }) {
  const [passwordHidden, setPasswordHidden] = useState(true);
  const togglePasswordVisibility = () => setPasswordHidden(!passwordHidden);
  const strictFields = process.env.STRICT_USER_FIELDS;

  return (
    <Field
      name={type === 'confirm' ? 'password_confirm' : 'password'}
      minLength="0"
      maxLength="100"
      validate={composeValidators(strictFields && requiredValidator, boundsValidator(strictFields ? 8 : 0, 100))}
      // onChange="onChange()"
      autoComplete="new-password"
    >
      {({ input, meta }) => (
        <div>
          <label htmlFor={type === 'confirm' ? 'password_confirm' : 'password'}>
            {type === 'confirm' ? 'Confirm Password' : 'Password'}
            {signup && strictFields ? '*' : ''}
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
