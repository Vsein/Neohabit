import React, { useState, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import HabitTag from './HabitTag';
import {
  useGetSkilltreesQuery,
  useAddSkillMutation,
  useEditSkillMutation,
} from '../state/services/skilltree';
import { close } from '../state/features/overlay/overlaySlice';

export default function SkillNodeModal({ skilltreeID, skillID, skillparentID, closeOverlay }) {
  const dispatch = useDispatch();
  const skilltrees = useGetSkilltreesQuery();
  const [addSkill] = useAddSkillMutation();
  const [editSkill] = useEditSkillMutation();

  if (skilltrees.isLoading) return <></>;

  const skilltree = skilltrees.data.find((skilltreo) => skilltreo._id === skilltreeID);
  const skill = skillID ? skilltree.skills.find((skillo) => skillo._id === skillID) : {};

  const onSubmit = async (values) => {
    if (!skillID) {
      await addSkill({ skilltreeID, skillparentID, values });
    } else {
      await editSkill({ skilltreeID, skillID, values });
    }
    dispatch(close());
  };

  return (
    <Form
      initialValues={{
        name: skill?.name,
        description: skill?.description,
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
              <HabitTag habit={skilltree} />
            </div>
            <button className="close-modal-button icon" onClick={close}>
              <Icon path={mdiClose} />
            </button>
          </div>
          <div className="modal-details">
            <Field
              name="name"
              component="textarea"
              placeholder="Change skill name"
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
              {skillID ? 'Save' : 'Add skill'}
            </button>
          </div>
        </form>
      )}
    />
  );
}
