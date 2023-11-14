import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Icon } from '@mdi/react';
import {
  mdiPause,
  mdiPlus,
  mdiPlay,
  mdiRestart,
  mdiFlagCheckered,
  mdiPencil,
  mdiDelete,
  mdiCancel,
} from '@mdi/js';
import { changeTo } from '../state/features/overlay/overlaySlice';
import { useEditSkillMutation, useDeleteSkillsMutation } from '../state/services/skilltree';

export default function SkillNode({ skilltreeID, skill, color }) {
  const dispatch = useDispatch();
  const isDisabled = skill.is_root;
  const isCompleted = skill.status === 'completed';
  const isDisregarded = skill.status === 'disregarded';
  const [editSkill] = useEditSkillMutation();
  const [deleteSkills] = useDeleteSkillsMutation();
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
      values: { status: isCompleted || isDisregarded ? 'idle' : 'completed' },
    });
  };

  const disregardSkill = () => {
    editSkill({ skilltreeID, skillID: skill._id, values: { status: 'disregarded' } });
  };

  const getAllChildrenIDs = (skilly) => {
    const ids = [skilly._id];
    if (skilly.children) {
      skilly.children.forEach((skillo) => {
        const childrenIDs = getAllChildrenIDs(skillo);
        ids.push(...childrenIDs);
      });
    }
    return ids;
  };

  const deleteAllChildrenSkills = () => {
    const ids = getAllChildrenIDs(skill);
    deleteSkills({ skilltreeID, values: { ids } });
  };

  return (
    <div className={`skill-node ${skill.status}`} style={{ '--shadow-box-color': color }}>
      <h4>{skill.name}</h4>
      {skill.parent_skill ? <div className="skill-node-edge-to" /> : <></>}
      {skill.children.length ? (
        <div
          className="skill-node-edge-from"
          style={{
            '--height': skill.height,
            '--offset-top': skill.children[0].height / 2,
            '--offset-bottom': skill.children[skill.children.length - 1].height / 2,
          }}
        />
      ) : (
        <></>
      )}
      {skill?.description ? <div className="skill-node-info">{skill.description}</div> : <></>}
      <div className="skill-node-controls-bottom">
        {skill.status === 'in-progress' ? (
          <button
            className="overview-open-settings active"
            title="Pause the skill acquiremenet"
            disabled={isDisabled}
            onClick={pauseSkillAcquirement}
          >
            <Icon path={mdiPause} className="icon smaller centering" />
          </button>
        ) : (
          <button
            className="overview-open-settings active"
            title="Start the skill acquiremenet"
            disabled={isDisabled}
            onClick={startSkillAcquirement}
          >
            <Icon path={mdiPlay} className="icon smaller centering" />
          </button>
        )}
        <button
          className="overview-open-settings active"
          title={isCompleted || isDisregarded ? 'Restart the skill' : 'Finish the skill'}
          disabled={isDisabled}
          onClick={finishSkillAcquirement}
        >
          <Icon
            path={isCompleted || isDisregarded ? mdiRestart : mdiFlagCheckered}
            className="icon smaller centering"
          />
        </button>
        <button
          className="overview-open-settings active"
          title={'Disregard the skill'}
          disabled={isDisabled || isDisregarded}
          onClick={disregardSkill}
        >
          <Icon path={mdiCancel} style={{ padding: '2px' }} className="icon smaller centering" />
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
          onClick={deleteAllChildrenSkills}
        >
          <Icon path={mdiDelete} className="icon smaller centering" />
        </button>
      </div>
      <div className={`skill-node-controls-right ${skill.children.length ? 'offseted' : ''}`}>
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
