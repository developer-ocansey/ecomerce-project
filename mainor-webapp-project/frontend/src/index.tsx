import './index.scss'

import * as serviceWorker from './serviceWorker';

import BcdNg from './BcdNg';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <React.StrictMode>
    <BcdNg />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();