import * as React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { BulmaInput } from '../../components/BulmaInput';

const initialValues = {
  email: '',
  password: '',
};

const validationSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
});

type OnSubmitType = (formData: typeof initialValues) => Promise<void>;

export function LoginForm({ onSubmit }: { onSubmit: OnSubmitType }) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form id="login-form">
          <BulmaInput label="Email" name="email" placeholder="Adres email" />
          <BulmaInput
            label="Hasło"
            name="password"
            type="password"
            placeholder="Hasło"
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
