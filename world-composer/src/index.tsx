import 'font-awesome/css/font-awesome.min.css';

import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import App from './components/App';

if (process.env.REACT_APP_DEBUG === '1') {
    console.warn(
        'App has been run in debug mode. It can mean much lower performance of simulation.'
    );
}

const $root = document.getElementById('root');
ReactDOM.render(<App />, $root);

if ((module as any).hot) {
    (module as any).hot.accept('./components/App', () => {
        const NextApp = require('./components/App').default;
        ReactDOM.render(<NextApp />, $root);
    });
}
