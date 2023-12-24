const requiredValidator = (value) => (value ? undefined : 'Required');

const boundsValidator = (min, max) => (value) =>
  value?.length >= min && value?.length <= max ? undefined : `Must have ${min}-${max} symbols`;

const numberBoundsValidator = (min, max) => (value) =>
  value >= min && value <= max ? undefined : `Must be between ${min}-${max}`;

const onlyLatinAndNumbersValidator = (value) => {
  if (/^[a-z]*$/i.test(value)) return undefined;
  if (/^[0-9]*$/.test(value)) return 'Add at least one letter';
  if (/^[a-zA-Z0-9]*$/i.test(value)) return undefined;
  return 'Only latin and numbers';
};

const simpleEmailValidator = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : 'Please enter valid email';

const composeValidators =
  (...validators) =>
  (value) =>
    validators.reduce((error, validator) => error || validator(value), undefined);

export {
  requiredValidator,
  boundsValidator,
  numberBoundsValidator,
  onlyLatinAndNumbersValidator,
  simpleEmailValidator,
  composeValidators,
};
