import React from 'react';
import adjustTooltip from '../utils/adjustTooltip';

function changeSkillTipOffset(e, skillDescription, isInProgress) {
  const skillTip = document.querySelector('.skill-tip');
  const skill = e.target.closest('.skill-node');
  const parent = document.querySelector('.skilltree-centering');
  const rect = skill.getBoundingClientRect();
  const rectParent = parent.getBoundingClientRect();
  skillTip.textContent = skillDescription;
  skillTip.classList.remove('hidden');
  skillTip.style.top = `${window.pageYOffset + rect.y + 90 + 5 * isInProgress}px`;

  adjustTooltip(skillTip, rect, rectParent);
  const skillTipRect = skillTip.getBoundingClientRect();
  if (rect.y + 100 + skillTipRect.height > window.innerHeight) {
    skillTip.style.height = `${window.innerHeight - rect.y - 100}px`;
  }
  return 0;
}

function hideSkillTip() {
  const skillTip = document.querySelector('.skill-tip');
  skillTip.classList.add('hidden');
  skillTip.style.top = '0px';
  skillTip.style.height = '';
  return 0;
}

export default function SkillTip() {
  return <div className="skill-tip hidden" onMouseLeave={hideSkillTip}></div>;
}

export { changeSkillTipOffset, hideSkillTip };
