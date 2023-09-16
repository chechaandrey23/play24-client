import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider as ReduxProvider} from 'react-redux';
import {SnackbarProvider} from 'notistack';
import {App} from './App';
import './index.css';

import {rootStore} from './redux/rootStore';

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={rootStore}>
      <SnackbarProvider maxSnack={10}>
        <App />
      </SnackbarProvider>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
