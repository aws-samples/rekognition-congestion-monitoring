import { FC } from 'react';
import styled from 'styled-components';
import { Auth } from 'aws-amplify';
import { Grid, Button } from 'semantic-ui-react';
import { AppError } from '../common';
import useSubscribeFacility from '../../hooks/SubscribeFacility';
import { RecordingStatus } from '../../API';

const Component: FC = () => {
  const { facility, error } = useSubscribeFacility();
  const numberOfPeople = facility ? facility.numberOfPeople : 0;
  const recordingStatus = facility
    ? facility.recordingStatus
    : RecordingStatus.INACTIVE;
  const facilityName =
    facility && recordingStatus === RecordingStatus.ACTIVE
      ? facility.name
      : '--';
  const description =
    facility && recordingStatus === RecordingStatus.ACTIVE
      ? facility.description
      : '';
  return (
    <>
      <Grid columns="equal">
        <Grid.Row stretched>
          <Grid.Column>
            <Title>現在の施設の人数</Title>
            <AppError {...error} />
            <Circle>
              <Font>
                {numberOfPeople === 0 ||
                recordingStatus === RecordingStatus.INACTIVE
                  ? '-'
                  : numberOfPeople}
              </Font>
            </Circle>
            <Content>{facilityName}</Content>
            <Content>{description}</Content>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched>
          <Grid.Column />
          <Grid.Column>
            <Button onClick={() => Auth.signOut()}>Sign Out</Button>
          </Grid.Column>
          <Grid.Column />
        </Grid.Row>
      </Grid>
    </>
  );
};

const Title = styled.div`
  text-align: center;
  font-size: 24px;
  color: gray;
  margin: 30px;
`;

const Content = styled.div`
  text-align: center;
  font-size: 24px;
  color: gray;
  margin: 30px;
`;

const Font = styled.span`
  font-size: 42px;
`;

const Circle = styled.div`
  width: 200px;
  height: 200px;
  background-color: pink;
  border-radius: 50%;
  margin: 0 auto;
  text-align: center;
  line-height: 200px;
`;

export default Component;
