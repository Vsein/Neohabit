import React from 'react';
import { useDispatch } from 'react-redux';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { close } from '../state/features/overlay/overlaySlice';
import Field from './FieldWrapper';

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
        className="button-default stretch cancel"
        onClick={closeOverlay}
        title="Cancel [c]"
      >
        Cancel
      </button>
      <button className="button-default stretch border" type="submit" disabled={disabled}>
        {isNew ? `Add ${type}` : 'Save'}
      </button>
    </div>
  );
}

function ColorPicker() {
  return (
    <Field name="color">
      {({ input }) => (
        <div className="form-task-name" style={{ color: input.value }}>
          <HexColorPicker
            color={input.value}
            onChange={(coloro) => {
              input.onChange(coloro);
            }}
          />
          <HexColorInput
            color={input.value}
            onChange={(coloro) => {
              input.onChange(coloro);
            }}
            prefixed
          />
        </div>
      )}
    </Field>
  );
}

export { ModalButtons, ColorPicker };
