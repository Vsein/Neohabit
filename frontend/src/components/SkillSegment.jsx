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
} from '@mdi/js';
import { changeTo } from '../state/features/overlay/overlaySlice';
import { useEditSkillMutation } from '../state/services/skilltree';
import SkillNode from './SkillNode';

export default function SkillSegment({ skilltreeID, skill, color }) {

  return (
    <div className="skill-segment">
      <SkillNode skilltreeID={skilltreeID} skill={skill} color={color} />
      {skill.children ? (
        <div className="skill-segments-wrapper">
          {
        skill.children.map((skillChild, i) => (
          <SkillSegment key={i} skilltreeID={skilltreeID} skill={skillChild} color={color} />
        ))
          }
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
