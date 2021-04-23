import { FC, useState, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Loading } from './components/common';
import Nav from './components/nav';
import useCurrentUser from './hooks/CurrentUser';
import Camera from './components/camera';
import Register from './components/register';
import Facilities from './components/facilities';
import EndUser from './components/enduser';

// Amplify ライブラリ関連
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react';

// aws-exports.jsの読み込みを行う
Amplify.configure(awsconfig);
// AmplifyライブラリにAmazonAIPredictionProviderの機能を拡張する
Amplify.addPluggable(new AmazonAIPredictionsProvider());

const Admin: FC = () => {
  return (
    <Switch>
      <Route path="/facilities" component={Facilities} />
      <Route path="/register" component={Register} />
      <Route path="/" component={Camera} exact />
      <Redirect to="/" />
    </Switch>
  );
};

type CognitoUser = {
  CognitoUser: {
    username: string;
  };
};

const App: FC = () => {
  const { loading, group } = useCurrentUser();
  const [authState, setAuthState] = useState<AuthState>();
  const [user, setUser] = useState<CognitoUser | undefined>();
  useEffect(() => {
    onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData as CognitoUser);
    });
  }, []);

  const Main = () => {
    return group === 'admin' ? (
      <Nav>
        <Admin />
      </Nav>
    ) : (
      <EndUser />
    );
  };

  return authState === AuthState.SignedIn && user ? (
    <>
      {/* 認証済みの場合はメインのコンポーネントを表示 */}
      <Main />
      <Loading active={loading} />
    </>
  ) : (
    <>
      {/* 未認証の場合はメインのコンポーネントを表示 */}
      <AmplifyAuthenticator>
        <AmplifySignUp
          slot="sign-up"
          // SignUp時の設定要素に username、password、email を指定
          formFields={[
            { type: 'username' },
            { type: 'password' },
            { type: 'email' }
          ]}
        />
      </AmplifyAuthenticator>
    </>
  );
};
export default App;
