import * as React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { Race } from '../../types/character';
import { BulmaInput } from '../../components/BulmaInput';
import { BulmaSelect } from '../../components/BulmaSelect';

const initialValues = {
  name: '',
  race: Race.Human,
};

const validationSchema = Yup.object({
  name: Yup.string().required(),
  race: Yup.string().oneOf(Object.values(Race)).required(),
});

type RaceKey = keyof typeof Race;
const RaceKeys = Object.keys(Race) as RaceKey[];

export function CreateNewCharacter() {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={() => undefined}
    >
      {({ isSubmitting }) => (
        <Form id="login-form">
          <BulmaInput
            label="Imie"
            name="name"
            placeholder="Imie twojej postaci"
          />
          <BulmaSelect label="Rasa" name="race" as="select" placeholder="Rasa">
            {RaceKeys.map((race) => (
              <option key={race} value={Race[race]}>
                {race}
              </option>
            ))}
          </BulmaSelect>

          <button
            className="button is-link"
            type="submit"
            disabled={isSubmitting}
          >
            Stwórz
          </button>
        </Form>
      )}
    </Formik>
  );
}
