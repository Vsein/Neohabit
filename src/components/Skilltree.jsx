import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiPencil, mdiDelete } from '@mdi/js';
import { useDeleteSkilltreeMutation } from '../state/services/skilltree';
import { changeTo } from '../state/features/overlay/overlaySlice';
import { mixColors, hexToRgb } from '../hooks/usePaletteGenerator';

export default function Skilltree({ skilltree }) {
  const { theme } = useSelector((state) => state.theme);
  const vertical = false;
  const datePeriodLength = 46;

  const colorShade = mixColors(
    theme === 'light' ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 },
    hexToRgb(skilltree.color),
    theme === 'light' ? 0.8 : 0.6,
  );

  return <div
    className="overview-centering"
    style={{
      '--habits': 20,
      '--length': 46,
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
        <h3 style={{ color: colorShade, textAlign: 'center' }}>{skilltree?.name}</h3>
      </NavLink>
      <SkilltreeControls skilltreeID={skilltree?._id} />
    </div>
    <div className={`overview-container ${vertical ? 'vertical' : ''}`}>
      <div className={`overview ${vertical ? 'vertical' : ''}`}>

      </div>
    </div>
  </div>;
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
    <div className="overview-settings">
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
