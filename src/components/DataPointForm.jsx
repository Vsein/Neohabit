import React from 'react';
import { Form, Field } from 'react-final-form';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';

export default function DataPointForm({ onSubmit }) {
  return (
    <Form
      initialValues={{
        date: undefined,
        value: undefined,
      }}
      onSubmit={onSubmit}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit} className="habit-form">
          <div className="habit-form-date">
            <label htmlFor="date-name">
              <Field
                name="date"
                component="input"
                type="date"
                placeholder="Change project name"
                max="<?= date('Y-m-d'); ?>"
                rows="1"
                className="habit-form-input"
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
              />
            </label>
          </div>
          <button
            className="habit-button"
            type="submit"
            disabled={submitting || pristine}
          >
            <Icon path={mdiPlus} className="add-task-icon icon" />
          </button>
        </form>
      )}
    />
  );
}
