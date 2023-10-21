import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { useDeleteSelfMutation } from '../state/services/settings';
import { close } from '../state/features/overlay/overlaySlice';

export default function AccountDeleteModal({ closeOverlay }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deleteSelf] = useDeleteSelfMutation();

  const deleteAccount = async () => {
    await deleteSelf();
    dispatch(close());
    dispatch({ type: 'RESET' });
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div
      className="modal modal-active modal-settings"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="modal-header">
        <h2>Are you sure you want to delete your account?</h2>
        <button className="close-modal-button icon" onClick={closeOverlay}>
          <Icon path={mdiClose} />
        </button>
      </div>
      <h3 className="modal-footnote">This action is irreversible</h3>
      <div className="modal-buttons">
        <button className="form-button" onClick={closeOverlay} id="cancel-form-button">
          Cancel
        </button>
        <button className="form-button delete" onClick={deleteAccount}>
          Delete
        </button>
      </div>
    </div>
  );
}
