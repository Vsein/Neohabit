import React from 'react';
import Field from './FieldWrapper';
import { requiredValidator, numberBoundsValidator, composeValidators } from '../utils/validators';

function DateField() {
  return (
    <div className="habit-form-date">
      <label htmlFor="date-name">
        <Field
          name="date"
          component="input"
          type="date"
          placeholder="Change habit name"
          // max="<?= date('Y-m-d'); ?>"
          rows="1"
          className="habit-form-input"
          required
        />
      </label>
    </div>
  );
}

function ActionsField() {
  return (
    <Field
      name="value"
      validate={composeValidators(requiredValidator, numberBoundsValidator(0, 2e9))}
    >
      {({ input, meta }) => (
        <div
          className={`habit-form-counter
${input?.value < 0 || input?.value >= 2e9 ? 'error' : ''}
                `}
        >
          <label htmlFor="date-name"> </label>
          <input {...input} className="habit-form-input" type="number" placeholder="1" />
        </div>
      )}
    </Field>
  );
}

function PeriodField() {
  return (
    <Field
      name="period"
      validate={composeValidators(requiredValidator, numberBoundsValidator(1, 36500))}
    >
      {({ input, meta }) => (
        <div
          className={`habit-form-counter
${input?.value <= 0 || input?.value >= 36500 ? 'error' : ''}
                `}
        >
          <label htmlFor="date-name"> </label>
          <input {...input} className="habit-form-input" type="number" placeholder="1" />
        </div>
      )}
    </Field>
  );
}

export { DateField, ActionsField, PeriodField };
