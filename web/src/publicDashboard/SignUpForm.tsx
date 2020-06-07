import * as React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { BulmaInput } from '../components/BulmaInput';

const initialValues = {
  email: '',
  password: '',
  repeatedPassword: '',
  birthday: '',
};

const validationSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
  repeatedPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required(),
  birthday: Yup.date().required(),
});

type OnSubmitType = (formData: typeof initialValues) => Promise<void>;

export function SignUpForm({ onSubmit }: { onSubmit: OnSubmitType }) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form id="signup-form">
          <BulmaInput name="email" label="Email" placeholder="Adres email" />

          <BulmaInput
            name="password"
            label="Hasło"
            type="password"
            placeholder="Hasło"
          />

          <BulmaInput
            name="repeatedPassword"
            label="Powtórz hasło"
            type="password"
            placeholder="Hasło"
          />

          <BulmaInput
            name="birthday"
            label="Data urodzenia"
            type="date"
            placeholder="Data"
            min="1920-01-01"
          />

          <button
            className="button is-link"
            type="submit"
            disabled={isSubmitting}
          >
            Gotowe
          </button>
        </Form>
      )}
    </Formik>
  );
}
