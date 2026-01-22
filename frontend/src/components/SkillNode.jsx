import React from 'react';
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
import { useEditSkillMutation, useDeleteSkillMutation } from '../state/services/skilltree';
import { changeSkillTipOffset, hideSkillTip } from './SkillTip';

export default function SkillNode({ skilltreeID, skill, color }) {
  const dispatch = useDispatch();
  const isDisabled = skill.is_root_skill;
  const isCompleted = skill.status === 'completed';
  const isDisregarded = skill.status === 'disregarded';
  const [editSkill] = useEditSkillMutation();
  const [deleteSkill] = useDeleteSkillMutation();
  // const hasChildren = !!skill.ski.length;

  const openAddSkillMenu = () => {
    dispatch(changeTo({ skilltreeID, skillparentID: skill.id, type: 'skillNode' }));
  };

  const openEditSkillMenu = () => {
    dispatch(changeTo({ skilltreeID, skillID: skill.id, type: 'skillNode' }));
  };

  const pauseSkillAcquirement = () => {
    editSkill({ skillID: skill.id, values: { skilltree_id: skilltreeID, status: 'idle' } });
  };

  const startSkillAcquirement = () => {
    editSkill({ skillID: skill.id, values: { skilltree_id: skilltreeID, status: 'in-progress' } });
  };

  const finishSkillAcquirement = () => {
    editSkill({
      skillID: skill.id,
      values: {
        skilltree_id: skilltreeID,
        status: isCompleted || isDisregarded ? 'idle' : 'completed',
      },
    });
  };

  const disregardSkill = () => {
    editSkill({ skillID: skill.id, values: { skilltree_id: skilltreeID, status: 'disregarded' } });
  };

  const getAllChildrenIDs = (parentSkill) => {
    const ids = [parentSkill.id];
    if (parentSkill.children) {
      parentSkill.children.forEach((childSkill) => {
        const childrenIDs = getAllChildrenIDs(childSkill);
        ids.push(...childrenIDs);
      });
    }
    return ids;
  };

  const deleteAllChildrenSkills = () => {
    const ids = getAllChildrenIDs(skill);
    deleteSkill({ skillID: skill.id, values: { ids, skilltree_id: skilltreeID } });
  };

  return (
    <div
      className={`skill-node ${skill.status}`}
      style={{ '--shadow-box-color': color }}
      onMouseEnter={(e) =>
        skill?.description &&
        changeSkillTipOffset(e, skill?.description, skill.status === 'in-progress')
      }
      onMouseLeave={(e) => skill?.description && hideSkillTip()}
    >
      <h4>{skill.name}</h4>
      {skill.parent_skill_id ? <div className="skill-node-edge-to" /> : <></>}
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
