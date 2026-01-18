import React from 'react';
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
