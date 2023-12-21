import React from 'react';
import { formatISO } from 'date-fns';
import { Form } from 'react-final-form';
import { Icon } from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import Field from './FieldWrapper';
import { requiredValidator, numberBoundsValidator, composeValidators } from '../utils/validators';

export default function CellAddTargetForm({ onSubmit }) {
  return (
    <Form
      initialValues={{
        date: formatISO(new Date(), { representation: 'date' }),
        value: 1,
        period: 1,
        is_target: true,
      }}
      onSubmit={onSubmit}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form
          onSubmit={async (e) => {
            await handleSubmit(e);
          }}
          className="habit-form target"
        >
          <span>Starting from </span>
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
          <span>, aim to do</span>
          <Field
            name="value"
            validate={composeValidators(requiredValidator, numberBoundsValidator(1, 999))}
          >
            {({ input, meta }) => (
              <div
                className={`habit-form-counter
${input?.value <= 0 || input?.value >= 1000 ? 'error' : ''}
                `}
              >
                <label htmlFor="date-name"> </label>
                <input {...input} className="habit-form-input" type="number" placeholder="1" />
              </div>
            )}
          </Field>
          <span> action(s) in </span>
          <Field
            name="period"
            validate={composeValidators(requiredValidator, numberBoundsValidator(1, 999))}
          >
            {({ input, meta }) => (
              <div
                className={`habit-form-counter
${input?.value <= 0 || input?.value >= 1000 ? 'error' : ''}
                `}
              >
                <label htmlFor="date-name"> </label>
                <input {...input} className="habit-form-input" type="number" placeholder="1" />
              </div>
            )}
          </Field>
          <span>day(s)</span>
          <button className="habit-button right" type="submit" disabled={submitting}>
            <Icon path={mdiPlus} className="icon small" />
          </button>
        </form>
      )}
    />
  );
}
