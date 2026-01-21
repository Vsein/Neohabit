import React, { useState, useEffect } from 'react';
import { Form } from 'react-final-form';
import { useDispatch } from 'react-redux';
import { Icon } from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { HabitTag } from './UI';
import { NameField, DescriptionField, ModalButtons, ColorPicker } from './ModalComponents';
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

  const skilltree = skilltrees.data.find((s) => s.id === skilltreeID);

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
        description: skilltree?.description,
        color: skilltree?.color || '#1D60C1',
      }}
      onSubmit={onSubmit}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form
          onSubmit={async (e) => {
            await handleSubmit(e);
          }}
          className="modal modal-active"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            {skilltree ? (
              <div className="tag-wrapper">
                Skilltree:
                <div className="tag">
                  <HabitTag habit={skilltree} />
                </div>
              </div>
            ) : (
              <div className="tag-wrapper">New skilltree</div>
            )}
            <button className="icon small" onClick={closeOverlay}>
              <Icon path={mdiClose} />
            </button>
          </div>
          <div className="modal-details-block" style={{ height: 'min-content' }}>
            <NameField type="skilltree" autofocus={!skilltreeID} />
          </div>
          <div className="modal-details-project-wrapper">
            <div className="modal-details-block description-area">
              <DescriptionField rows="9" />
            </div>
            <div className="modal-details-block color-area">
              <ColorPicker />
            </div>
          </div>
          <ModalButtons disabled={submitting} unnamed={!values?.name} isNew={!skilltreeID} type="skilltree" />
        </form>
      )}
    />
  );
}
