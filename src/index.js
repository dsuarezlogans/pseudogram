import React from 'react';
import ReactDOM from 'react-dom';
import Firebase from 'firebase';
 
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

Firebase.initializeApp({
    apiKey: "AIzaSyC3p8MI1iu8q6hSgj_3DFYfBfnrba7kDUI",
    authDomain: "pseudogram-288eb.firebaseapp.com",
    databaseURL: "https://pseudogram-288eb.firebaseio.com",
    projectId: "pseudogram-288eb",
    storageBucket: "pseudogram-288eb.appspot.com",
    messagingSenderId: "525071289764"
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
