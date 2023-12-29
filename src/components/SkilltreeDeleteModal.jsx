import React from 'react';
import { Icon } from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { useDeleteSkilltreeMutation } from '../state/services/skilltree';

export default function SkilltreeDeleteModal({ skilltreeID, closeOverlay }) {
  const [deleteSkilltree] = useDeleteSkilltreeMutation();

  const deleteThisSkilltree = async (e) => {
    await deleteSkilltree(skilltreeID);
    closeOverlay(e);
  };

  return (
    <div
      className="modal modal-active modal-settings"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <h2>Are you sure you want to delete the skilltree?</h2>
        <button className="icon small" onClick={closeOverlay}>
          <Icon path={mdiClose} />
        </button>
      </div>
      <h3 className="modal-footnote">This action is irreversible</h3>
      <div className="modal-buttons">
        <button className="button-default cancel stretch" onClick={closeOverlay}>
          Cancel
        </button>
        <button
          className="button-default stretch"
          style={{ backgroundColor: 'red' }}
          onClick={deleteThisSkilltree}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
