import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import {
  mdiPause,
  mdiPlus,
  mdiPlay,
  mdiRestart,
  mdiFlagCheckered,
  mdiPencil,
  mdiDelete,
} from '@mdi/js';
import { changeTo } from '../state/features/overlay/overlaySlice';
import { useEditSkillMutation } from '../state/services/skilltree';

export default function SkillNode({ skilltreeID, skill, color }) {
  const dispatch = useDispatch();
  const isDisabled = skill.is_root;
  const isCompleted = skill.status === 'completed';
  const [editSkill] = useEditSkillMutation();
  // const hasChildren = !!skill.ski.length;

  const openAddSkillMenu = () => {
    dispatch(changeTo({ skilltreeID, skillparentID: skill._id, type: 'skillNode' }));
  };

  const openEditSkillMenu = () => {
    dispatch(changeTo({ skilltreeID, skillID: skill._id, type: 'skillNode' }));
  };

  const pauseSkillAcquirement = () => {
    editSkill({ skilltreeID, skillID: skill._id, values: { status: 'idle' } });
  };

  const startSkillAcquirement = () => {
    editSkill({ skilltreeID, skillID: skill._id, values: { status: 'in-progress' } });
  };

  const finishSkillAcquirement = () => {
    editSkill({
      skilltreeID,
      skillID: skill._id,
      values: { status: skill.status === 'completed' ? 'in-progress' : 'completed' },
    });
  };

  return (
    <div className={`skill-node ${skill.status}`} style={{ '--shadow-box-color': color }}>
      <h3>{skill.name}</h3>
      <div className="skill-node-controls-bottom">
        {skill.status === 'in-progress' ? (
          <button
            className="overview-open-settings active"
            title="Pause the skill acquiremenet"
            disabled={isDisabled || isCompleted}
            onClick={pauseSkillAcquirement}
          >
            <Icon path={mdiPause} className="icon smaller centering" />
          </button>
        ) : (
          <button
            className="overview-open-settings active"
            title="Start the skill acquiremenet"
            disabled={isDisabled || isCompleted}
            onClick={startSkillAcquirement}
          >
            <Icon path={mdiPlay} className="icon smaller centering" />
          </button>
        )}
        <button
          className="overview-open-settings active"
          title={isCompleted ? 'Restart the skill' : 'Finish the skill'}
          disabled={isDisabled}
          onClick={finishSkillAcquirement}
        >
          <Icon
            path={isCompleted ? mdiRestart : mdiFlagCheckered}
            className="icon smaller centering"
          />
        </button>
        <button
          className="overview-open-settings active right"
          title="Edit the skill"
          onClick={openEditSkillMenu}
        >
          <Icon path={mdiPencil} className="icon smaller centering" />
        </button>
        <button
          className="overview-open-settings active"
          title="Delete the skill"
          disabled={isDisabled}
        >
          <Icon path={mdiDelete} className="icon smaller centering" />
        </button>
      </div>
      <div className={`skill-node-controls-right ${false ? 'offseted' : ''}`}>
        <button
          className="overview-open-settings active"
          title="Add a child skill"
          onClick={openAddSkillMenu}
        >
          <Icon path={mdiPlus} className="icon smaller centering" />
        </button>
      </div>
    </div>
  );
}
