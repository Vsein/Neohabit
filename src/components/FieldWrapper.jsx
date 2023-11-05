import { Field } from 'react-final-form';
import React from 'react';

const identity = (value) => value;

/* This wraps react-final-form's <Field/> component.
 * The identity function ensures form values never get set to null,
 * but rather, empty strings.
 *
 * See https://github.com/final-form/react-final-form/issues/130
 */
export default (props) => <Field parse={identity} {...props} />;
