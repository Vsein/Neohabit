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
  skillTip.style.top = `${window.pageYOffset + rect.y + 89 + 5 * isInProgress}px`;

  adjustTooltip(skillTip, rect, rectParent);
  const skillTipRect = skillTip.getBoundingClientRect();
  if (rect.y + 96 + skillTipRect.height > window.innerHeight) {
    const height = window.innerHeight - rect.y - 96;
    const linesVisible = Math.floor((height - 22) / 24);
    skillTip.style.height = `${linesVisible * 24 + 15}px`;
    skillTip.style.webkitLineClamp = `${linesVisible}`;
  }
  return 0;
}

function hideSkillTip() {
  const skillTip = document.querySelector('.skill-tip');
  skillTip.classList.add('hidden');
  skillTip.style.top = '0px';
  skillTip.style.height = '';
  skillTip.style.webkitLineClamp = '';
  skillTip.style.lineClamp = '';
  return 0;
}

export default function SkillTip() {
  return <div className="skill-tip hidden" onMouseLeave={hideSkillTip}></div>;
}

export { changeSkillTipOffset, hideSkillTip };
