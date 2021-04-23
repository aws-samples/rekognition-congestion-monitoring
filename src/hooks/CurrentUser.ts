import { useState } from 'react';
import { Auth } from 'aws-amplify';

const useCurrentUser = (): {
  loading: boolean;
  group: string;
} => {
  const [group, setGroup] = useState('');
  const [loading, setLoading] = useState(true);
  Auth.currentAuthenticatedUser()
    .then((data) => {
      const groups =
        data.signInUserSession.accessToken.payload['cognito:groups'];
      setGroup(groups && groups.length === 1 ? groups[0] : '');
    })
    .catch(() => {
      // no login
    })
    .finally(() => {
      setLoading(false);
    });

  return { loading, group };
};
export default useCurrentUser;
