import * as React from 'react';
import {
  Route,
  Redirect,
  RouteProps,
  RouteComponentProps,
} from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '../store';

export function PrivateRoute({ children, ...rest }: RouteProps) {
  const session = useSelector((state: RootState) => state.session);

  return (
    <Route
      {...rest}
      render={(props) =>
        !!session.accessToken ? children : redirectToPublic(props)
      }
    />
  );
}

function redirectToPublic({ location }: RouteComponentProps) {
  return (
    <Redirect
      to={{
        pathname: '/',
        state: { from: location },
      }}
    />
  );
}
