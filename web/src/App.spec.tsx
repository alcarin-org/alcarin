import * as React from 'react';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
// import { createStore } from 'redux';

import App from './App';
import { store } from './store';

test('renders learn react link', () => {
  const { getByText } = render(
    <Router history={createMemoryHistory()}>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  );
  const linkElement = getByText(/Do some actions!/i);
  expect(linkElement).toBeInTheDocument();
});
