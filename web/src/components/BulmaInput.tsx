import * as React from 'react';
import { Field, FieldAttributes, ErrorMessage } from 'formik';

type BulmaInputProps<T> = {
  label: string;
} & FieldAttributes<T>;

// this should be moved to `useField` hook, especially to hide `help is-danger`
// container. in current formik version it have a typing problem
export function BulmaInput<T>({ label, ...props }: BulmaInputProps<T>) {
  return (
    <div className="field">
      {label && <label className="label">{label}</label>}
      <div className="control">
        <Field
          {...props}
          className={'input' + (props.className ? ` ${props.className}` : '')}
        />
      </div>
      <p className="help is-danger">
        <ErrorMessage name={props.name} />
      </p>
    </div>
  );
}
