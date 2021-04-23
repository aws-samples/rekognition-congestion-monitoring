/* eslint-disable newline-before-return */
import { FC } from 'react';
import { Button, Table } from 'semantic-ui-react';
import useFacility from '../../hooks/Faclitity';
import { AppError, Loading } from '../common';

const Component: FC = () => {
  const { list, loading, deleteOne, error } = useFacility();
  const onClick = (id: string) => {
    deleteOne({
      id,
    });
  };

  return (
    <>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Delete</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {list.map((v) => {
            return (
              <Table.Row key={v.id}>
                <Table.Cell>{v.id}</Table.Cell>
                <Table.Cell>{v.name}</Table.Cell>
                <Table.Cell>{v.recordingStatus}</Table.Cell>
                <Table.Cell>{v.description}</Table.Cell>
                <Table.Cell>
                  <Button onClick={() => onClick(v.id)} color="red">
                    Delete
                  </Button>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      <Loading active={loading} />
      <AppError {...error} />
    </>
  );
};

export default Component;
