import React, { useState, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import HabitTag from './HabitTag';
import { useGetSkilltreesQuery, useCreateSkilltreeMutation } from '../state/services/skilltree';
import { close } from '../state/features/overlay/overlaySlice';

export default function SkilltreeModal({ skilltreeID, closeOverlay }) {
  const dispatch = useDispatch();
  const skilltrees = useGetSkilltreesQuery();
  const [createSkilltree] = useCreateSkilltreeMutation();

  if (skilltrees.isLoading) return <></>;

  const skilltree = skilltrees.data.find((skilltreo) => skilltreo._id === skilltreeID);

  const onSubmit = async (values) => {
    if (!skilltree) {
      await createSkilltree(values);
    } else {
      // await updateProject({ projectID, values: { ...values, habits: projectHabitList } });
    }
    dispatch(close());
  };

  return (
    <Form
      initialValues={{
        name: skilltree?.name,
        description: '',
        color: skilltree?.color || '#aabbcc',
      }}
      onSubmit={onSubmit}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form
          onSubmit={async (e) => {
            await handleSubmit(e);
            form.reset();
          }}
          className="modal modal-active"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div className="tag">
            </div>
            <button className="close-modal-button icon" onClick={close}>
              <Icon path={mdiClose} />
            </button>
          </div>
          <div className="modal-details">
            <Field
              name="name"
              component="textarea"
              placeholder="Change skilltree name"
              rows="1"
              className="form-task-name"
              required
            />
            <Field
              name="description"
              component="textarea"
              placeholder="Change description"
              rows="1"
              className="form-task-description"
            />
            <Field name="color">
              {({ input }) => (
                <div className="form-task-name" style={{ color: input.value }}>
                  <HexColorPicker
                    color={input.value}
                    onChange={(coloro) => {
                      input.onChange(coloro);
                    }}
                  />
                  <HexColorInput
                    color={input.value}
                    onChange={(coloro) => {
                      input.onChange(coloro);
                    }}
                    prefixed
                  />
                </div>
              )}
            </Field>
          </div>
          <div className="modal-buttons">
            <button className="form-button" id="cancel-form-button" onClick={closeOverlay}>
              Cancel
            </button>
            <button
              className="form-button"
              id="submit-form-button"
              type="submit"
              disabled={submitting || pristine}
            >
              {skilltree ? 'Save' : 'Add task'}
            </button>
          </div>
        </form>
      )}
    />
  );
}
