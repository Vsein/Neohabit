import React from 'react';
import { Form } from 'react-final-form';
import { Icon } from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { HabitTag } from './UI';
import { NameField, DescriptionField, ModalButtons } from './ModalComponents';
import {
  useGetSkilltreesQuery,
  useAddSkillMutation,
  useEditSkillMutation,
} from '../state/services/skilltree';

export default function SkillNodeModal({ skilltreeID, skillID, skillparentID, closeOverlay }) {
  const skilltrees = useGetSkilltreesQuery();
  const [addSkill] = useAddSkillMutation();
  const [editSkill] = useEditSkillMutation();

  if (skilltrees.isLoading) return <></>;

  const skilltree = skilltrees.data.find((s) => s.id === skilltreeID);
  const skill = skillID ? skilltree.skills.find((s) => s.id === skillID) : {};

  const onSubmit = async (values) => {
    if (!skillID) {
      await addSkill({
        ...values,
        skilltree_id: skilltreeID,
        parent_skill_id: skillparentID,
        status: 'idle',
      });
      closeOverlay();
    } else {
      await editSkill({ skillID, values: { ...values, skilltree_id: skilltreeID } });
    }
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
          <div className="modal-details-block" style={{ height: 'min-content' }}>
            <NameField type="skill" autofocus={!skillID} />
          </div>
          <div className="modal-details-block">
            <DescriptionField rows="9" />
          </div>
          <ModalButtons
            disabled={submitting || pristine}
            unnamed={!values?.name}
            isNew={!skillID}
            type="skill"
          />
        </form>
      )}
    />
  );
}
