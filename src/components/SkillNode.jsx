import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import { mdiPause, mdiPlus, mdiFlagCheckered, mdiPencil, mdiDelete } from '@mdi/js';

export default function SkillNode({ skill, color }) {
  return (
    <div className="skill-node in-progress" style={{'--shadow-box-color': color}}>
      <h3>{skill.name}</h3>
      <div className="skill-node-controls-bottom">
        <button
          className="overview-open-settings active"
          title="Pause the skill acquirmenet"
        >
          <Icon path={mdiPause} className="icon smaller centering" />
        </button>
        <button
          className="overview-open-settings active"
          title="Finish the skill"
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
        >
          <Icon path={mdiDelete} className="icon smaller centering" />
        </button>
      </div>
      <div className="skill-node-controls-right">
        <button
          className="overview-open-settings active"
          title="Add a child skill"
        >
          <Icon path={mdiPlus} className="icon smaller centering" />
        </button>
      </div>
    </div>
  );
}
