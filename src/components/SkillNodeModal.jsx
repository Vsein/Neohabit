import React, { useState, useEffect } from 'react';
import { Form } from 'react-final-form';
import { useDispatch } from 'react-redux';
import { Icon } from '@mdi/react';
import { mdiClose } from '@mdi/js';
import HabitTag from './HabitTag';
import { NameField, DescriptionField, ModalButtons } from './ModalComponents';
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
          }}
          className="modal modal-active"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div className="tag-wrapper">
              Skilltree:
              <div className="tag">
                <HabitTag habit={skilltree} />
              </div>
            </div>
            <button className="icon small" onClick={closeOverlay}>
              <Icon path={mdiClose} />
            </button>
          </div>
          <div className="modal-details-block" style={{ height: 'min-content'}}>
            <NameField type="skill" />
          </div>
          <div className="modal-details-block">
            <DescriptionField rows="9" />
          </div>
          <ModalButtons disabled={submitting} isNew={!skillID} type="skill" />
        </form>
      )}
    />
  );
}
