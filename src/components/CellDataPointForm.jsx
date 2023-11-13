import React from 'react';
import { formatISO } from 'date-fns';
import { Form } from 'react-final-form';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import Field from './FieldWrapper';

export default function CellDataPointForm({ onSubmit }) {
  return (
    <Form
      initialValues={{
        date: formatISO(new Date(), { representation: 'date' }),
        value: 1,
      }}
      onSubmit={onSubmit}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form
          onSubmit={async (e) => {
            await handleSubmit(e);
            form.reset();
          }}
          className="habit-form"
        >
          <div className="habit-form-date">
            <label htmlFor="date-name">
              <Field
                name="date"
                component="input"
                type="date"
                placeholder="Change habit name"
                max="<?= date('Y-m-d'); ?>"
                rows="1"
                className="habit-form-input"
                required
              />
            </label>
          </div>
          <div className="habit-form-counter">
            <label htmlFor="date-name">
              <Field
                name="value"
                component="input"
                type="number"
                placeholder="1"
                max="999"
                min="0"
                className="habit-form-input"
                required
              />
            </label>
          </div>
          <button className="habit-button" type="submit" disabled={submitting || pristine}>
            <Icon path={mdiPlus} className="icon small" />
          </button>
        </form>
      )}
    />
  );
}
