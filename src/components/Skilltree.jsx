import React from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Icon } from '@mdi/react';
import { mdiPencil, mdiDelete } from '@mdi/js';
import { useDeleteSkilltreeMutation } from '../state/services/skilltree';
import { useGetSettingsQuery } from '../state/services/settings';
import { changeTo } from '../state/features/overlay/overlaySlice';
import { mixColors, hexToRgb } from '../hooks/usePaletteGenerator';
import SkillSegment from './SkillSegment';

function processSkilltree(skilltreeProvided) {
  const skilltree = { ...skilltreeProvided };
  const vertices = new Map();
  const skills = skilltree.skills.map((skill, i) => {
    vertices.set(skilltree.skills[i]._id, i);
    return { ...skilltree.skills[i], children: [], height: 1, width: 1 };
  });
  for (let i = skills.length - 1; i >= 0; i--) {
    skills[i].width =
      (skills[i].children.reduce((cur, skill) => Math.max(cur, skill.width), 0) || 0) + 1;
    skills[i].height = skills[i].children.reduce((cur, skill) => cur + skill.height, 0) || 1;
    skills[i].children.reverse();
    if (skills[i].parent_skill) {
      skills[vertices.get(skills[i].parent_skill)].children.push(skills[i]);
    }
  }
  return skills[0];
}

export default function Skilltree({ skilltree }) {
  const settings = useGetSettingsQuery();
  const vertical = false;
  const datePeriodLength = 46;

  if (settings.isFetching) return <></>;

  const colorShade =
    !settings.data?.prefer_dark
      ? mixColors({ r: 0, g: 0, b: 0 }, hexToRgb(skilltree.color), 0.8)
      : mixColors({ r: 255, g: 255, b: 255 }, hexToRgb(skilltree.color), 0.6);

  const processedSkills = processSkilltree(skilltree);

  return (
    <div
      className="skilltree-centering"
      style={{
        '--habits': 10,
        '--height': processedSkills.height,
        '--width': processedSkills.width,
        '--length': 47,
        '--vertical': vertical * 1,
        // '--multiplier': settings.data.cell_height_multiplier,
        '--multiplier': 1,
        '--cell-height': '15px',
        '--cell-width': '15px',
        '--signature-color': colorShade,
        '--bright-signature-color': colorShade,
      }}
    >
      <div
        className={`overview-header ${vertical ? 'vertical' : ''} ${
          datePeriodLength < 14 ? 'small' : ''
        }`}
      >
        <NavLink to={`../skilltree/${skilltree?._id}`} title={skilltree.name}>
          <h3
            style={{
              color: colorShade,
              textAlign: 'center',
              whiteSpace: 'nowrap',
              marginLeft: '5px',
            }}
          >
            {skilltree?.name}
          </h3>
        </NavLink>
        <SkilltreeControls skilltreeID={skilltree?._id} />
      </div>
      <div className="skilltree-container">
        <div className={`skills ${vertical ? 'vertical' : ''}`}>
          <SkillSegment
            skilltreeID={skilltree?._id}
            skill={processedSkills}
            color={skilltree.color}
          />
        </div>
      </div>
    </div>
  );
}

function SkilltreeControls({ skilltreeID }) {
  const dispatch = useDispatch();
  const openOverlay = () => {
    dispatch(changeTo({ skilltreeID, type: 'skilltree' }));
  };

  const [deleteSkilltree] = useDeleteSkilltreeMutation();
  const deleteChosenSkilltree = () => {
    deleteSkilltree(skilltreeID);
  };

  return (
    <div className="overview-settings right">
      <button
        className="overview-open-settings active"
        onClick={openOverlay}
        title="Edit the skilltree"
      >
        <Icon path={mdiPencil} className="icon small centering" />
      </button>
      <button
        className="overview-open-settings active"
        onClick={deleteChosenSkilltree}
        title="Delete the skilltree"
      >
        <Icon path={mdiDelete} className="icon small centering" />
      </button>
    </div>
  );
}
