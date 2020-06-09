import * as React from 'react';
import { Field, FieldAttributes, ErrorMessage } from 'formik';

type BulmaSelectProps<T> = {
  label: string;
} & FieldAttributes<T>;

// this should be moved to `useField` hook, especially to hide `help is-danger`
// container. in current formik version it have a typing problem
export function BulmaSelect<T>({
  label,
  children,
  ...props
}: React.PropsWithChildren<BulmaSelectProps<T>>) {
  return (
    <div className="field">
      {label && <label className="label">{label}</label>}
      <div className="control">
        <Field
          as="select"
          {...props}
          className={'input' + (props.className ? ` ${props.className}` : '')}
        >
          {children}
        </Field>
      </div>
      <p className="help is-danger">
        <ErrorMessage name={props.name} />
      </p>
    </div>
  );
}
