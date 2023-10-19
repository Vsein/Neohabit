import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import { mdiPause, mdiPlus, mdiFlagCheckered, mdiPencil, mdiDelete } from '@mdi/js';
import { changeTo } from '../state/features/overlay/overlaySlice';

export default function SkillNode({ skilltreeID, skill, color }) {
  const dispatch = useDispatch();
  const isDisabled = skill.is_root;
  // const hasChildren = !!skill.ski.length;

  const openAddSkillMenu = () => {
    dispatch(changeTo({ skilltreeID, skillparentID: skill._id, type: 'skillNode' }));
  };

  return (
    <div className="skill-node in-progress" style={{'--shadow-box-color': color}}>
      <h3>{skill.name}</h3>
      <div className="skill-node-controls-bottom">
        <button
          className="overview-open-settings active"
          title="Pause the skill acquirmenet"
          disabled={isDisabled}
        >
          <Icon path={mdiPause} className="icon smaller centering" />
        </button>
        <button
          className="overview-open-settings active"
          title="Finish the skill"
          disabled={isDisabled}
        >
          <Icon path={mdiFlagCheckered} className="icon smaller centering" />
        </button>
        <button
          className="overview-open-settings active right"
          title="Edit the skill"
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
