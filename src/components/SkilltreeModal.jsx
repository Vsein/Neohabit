import React, { useState, useEffect } from 'react';
import { Form } from 'react-final-form';
import { useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import Field from './FieldWrapper';
import HabitTag from './HabitTag';
import { ModalButtons, ColorPicker } from './ModalComponents';
import {
  useGetSkilltreesQuery,
  useCreateSkilltreeMutation,
  useUpdateSkilltreeMutation,
} from '../state/services/skilltree';
import { close } from '../state/features/overlay/overlaySlice';

export default function SkilltreeModal({ skilltreeID, closeOverlay }) {
  const dispatch = useDispatch();
  const skilltrees = useGetSkilltreesQuery();
  const [createSkilltree] = useCreateSkilltreeMutation();
  const [updateSkilltree] = useUpdateSkilltreeMutation();

  if (skilltrees.isLoading) return <></>;

  const skilltree = skilltrees.data.find((skilltreo) => skilltreo._id === skilltreeID);

  const onSubmit = async (values) => {
    if (!skilltree) {
      await createSkilltree(values);
    } else {
      await updateSkilltree({ skilltreeID, values });
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
            <div className="tag"></div>
            <button className="icon small" onClick={closeOverlay}>
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
            {skilltree ? (
              <></>
            ) : (
              <Field
                name="description"
                component="textarea"
                placeholder="Change description"
                rows="1"
                className="form-task-description"
              />
            )}
            <ColorPicker />
          </div>
          <ModalButtons disabled={submitting || pristine} isNew={!skilltreeID} type="skilltree" />
        </form>
      )}
    />
  );
}
