import * as React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { BulmaInput } from '../components/BulmaInput';

const initialValues = {
  email: '',
  password: '',
};

const validationSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
});

export function LoginForm() {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => console.log('submitted', values)}
    >
      <Form id="login-form">
        <BulmaInput label="Email" name="email" placeholder="Adres email" />
        <BulmaInput label="Hasło" name="password" placeholder="Hasło" />

        <button className="button is-link" type="submit">
          Zaloguj
        </button>
      </Form>
    </Formik>
  );
}
