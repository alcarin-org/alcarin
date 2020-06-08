import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import { PublicDashboard } from './modules/publicDashboard/PublicDashboard';
import { PrivateRoute } from './shared/router';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <PublicDashboard />
        </Route>
        <PrivateRoute path="/dashboard">A secured route!</PrivateRoute>
      </Switch>
    </div>
  );
}

export default App;
