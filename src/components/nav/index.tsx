import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { Icon, Grid, Menu, Segment, Sidebar } from 'semantic-ui-react';
import { Auth } from 'aws-amplify';

const Component: FC = ({ children }) => {
  const viewHeight = window.outerHeight;
  const history = useHistory();

  return (
    <Sidebar.Pushable as={Segment} style={{ height: viewHeight }}>
      <Sidebar
        as={Menu}
        animation="push"
        icon="labeled"
        inverted
        vertical
        visible
        width="thin"
      >
        <Menu.Item as="a" onClick={() => history.push('/')}>
          <Icon name="camera" />
          Record
        </Menu.Item>
        <Menu.Item as="a" onClick={() => history.push('/register')}>
          <Icon name="plus square" />
          Register Facility
        </Menu.Item>
        <Menu.Item as="a" onClick={() => history.push('/facilities')}>
          <Icon name="list" />
          Facility List
        </Menu.Item>
        <Menu.Item as="a" onClick={() => Auth.signOut()}>
          <Icon name="sign out" />
          Sign out
        </Menu.Item>
      </Sidebar>

      <Sidebar.Pusher>
        <Grid>
          <Grid.Row>
            <Grid.Column width={12} />
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={1} />
            <Grid.Column width={10}>{children}</Grid.Column>
            <Grid.Column width={1} />
          </Grid.Row>
        </Grid>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

export default Component;
