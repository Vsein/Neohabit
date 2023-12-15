import React from 'react';
import { useDispatch } from 'react-redux';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { close } from '../state/features/overlay/overlaySlice';
import Field from './FieldWrapper';

const bounds = (min, max) => (value) =>
  value?.length >= min && value?.length <= max ? undefined : `Must have ${min}-${max} symbols`;

function NameField({ type }) {
  return (
    <Field name="name" validate={bounds(0, 150)}>
      {({ input, meta }) => (
        <div className="form-task-name">
          <input {...input} type="text" placeholder={`Change ${type} name`} />
          <p
            className={`form-field-length ${input?.value?.length > 150 ? 'error' : ''}`}
          >{`${input?.value?.length ?? 0}/150`}</p>
        </div>
      )}
    </Field>
  );
}

function DescriptionField({ rows }) {
  return (
    <Field name="description" validate={bounds(0, 3000)}>
      {({ input, meta }) => (
        <div className="form-task-description">
          <textarea {...input} type="text" placeholder="Change description" rows={rows} />
          <p
            className={`form-field-length ${input?.value?.length > 3000 ? 'error' : ''}`}
          >{`${input?.value?.length ?? 0}/3000`}</p>
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
