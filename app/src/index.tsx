import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Amplify, { Auth } from 'aws-amplify';
import { UserPoolClientId, UserPoolId } from './aws.json';

const REGION = 'us-east-1';

Amplify.configure({
  Auth: {
    region: REGION,
    identityPoolRegion: REGION,
    userPoolId: UserPoolId,
    userPoolWebClientId: UserPoolClientId,
    mandatorySignIn: true
  }
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
