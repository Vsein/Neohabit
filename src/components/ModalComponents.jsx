import React from 'react';
import { useDispatch } from 'react-redux';
import { close } from '../state/features/overlay/overlaySlice';

function ModalButtons({ disabled, isNew, type }) {
  const dispatch = useDispatch();
  const closeOverlay = (e) => {
    e.stopPropagation();
    dispatch(close());
  };

  return (
    <div className="modal-buttons">
      <button
        type="button"
        className="form-button cancel"
        onClick={closeOverlay}
        title="Cancel [c]"
      >
        Cancel
      </button>
      <button
        className="form-button"
        type="submit"
        disabled={disabled}
      >
        {isNew ? `Add ${type}` : 'Save'}
      </button>
    </div>
  );
}

export { ModalButtons };
