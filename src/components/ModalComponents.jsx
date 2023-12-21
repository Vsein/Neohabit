import React from 'react';
import { useDispatch } from 'react-redux';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { close } from '../state/features/overlay/overlaySlice';
import Field from './FieldWrapper';
import { boundsValidator } from '../utils/validators';

function NameField({ type }) {
  const maxLength = 150;

  return (
    <Field name="name" validate={boundsValidator(0, maxLength)}>
      {({ input, meta }) => (
        <div className="form-task-name">
          <input {...input} type="text" placeholder={`Change ${type} name`} />
          <p className={`form-field-length ${input?.value?.length > maxLength ? 'error' : ''}`}>{`${
            input?.value?.length ?? 0
          }/${maxLength}`}</p>
        </div>
      )}
    </Field>
  );
}

function DescriptionField({ rows }) {
  const maxLength = 3000;

  return (
    <Field name="description" validate={boundsValidator(0, maxLength)}>
      {({ input, meta }) => (
        <div className="form-task-description">
          <textarea {...input} type="text" placeholder="Change description" rows={rows} />
          <p className={`form-field-length ${input?.value?.length > maxLength ? 'error' : ''}`}>{`${
            input?.value?.length ?? 0
          }/${maxLength}`}</p>
        </div>
      )}
    </Field>
  );
}

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

export { NameField, DescriptionField, ModalButtons, ColorPicker };
