/* eslint-disable newline-before-return */
import { FC, ChangeEvent } from 'react';
import { useState } from 'react';
import { Form } from 'semantic-ui-react';
import useFacility from '../../hooks/Faclitity';
import { AppError, Loading } from '../common';

type OnInputFacility = {
  facilityName: string;
  description: string;
};

const Component: FC = () => {
  const { loading, createOne, error } = useFacility();
  const [facility, setFacility] = useState<OnInputFacility>({
    facilityName: '',
    description: '',
  });
  const handleChange = (e: ChangeEvent<EventTarget>): void => {
    const value = (e.target as HTMLInputElement).value;
    const name = (e.target as HTMLInputElement).name;
    setFacility({
      ...facility,
      [name]: value,
    });
  };

  const onSubmit = () => {
    createOne({
      name: facility.facilityName,
      numberOfPeople: 0,
      description: facility.description,
    });
    setFacility({
      facilityName: '',
      description: '',
    });
  };

  return (
    <>
      <Form>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Facility Name"
            placeholder="Facility Name"
            name="facilityName"
            value={facility.facilityName}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.TextArea
          label="Description"
          placeholder="Description"
          name="description"
          value={facility.description}
          onChange={handleChange}
        />
        <Form.Button onClick={onSubmit} primary>
          Submit
        </Form.Button>
      </Form>
      <AppError {...error} />
      <Loading active={loading} />
    </>
  );
};

export default Component;
