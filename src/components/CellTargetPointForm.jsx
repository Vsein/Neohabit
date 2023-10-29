import React from 'react';
import { Form, Field } from 'react-final-form';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';

export default function CellTagetPointForm({ onSubmit }) {
  return (
    <Form
      initialValues={{
        date: undefined,
        value: 1,
        period: 1,
        is_target: true,
      }}
      onSubmit={onSubmit}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form
          onSubmit={async (e) => {
            await handleSubmit(e);
            form.reset();
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
                max="<?= date('Y-m-d'); ?>"
                rows="1"
                className="habit-form-input"
                required
              />
            </label>
          </div>
          <span>, aim to do</span>
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
          <span> action(s) in </span>
          <div className="habit-form-counter">
            <label htmlFor="date-name">
              <Field
                name="period"
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
          <span>day(s)</span>
          <button className="habit-button right" type="submit" disabled={submitting || pristine}>
            <Icon path={mdiPlus} className="icon small" />
          </button>
        </form>
      )}
    />
  );
}
