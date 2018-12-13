import React from 'react';
import ReactDOM from 'react-dom';
import Page from './Page';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from "react-router-dom";

import {Provider} from 'react-redux';
import 'babel-polyfill';
import store from './store/store';

import './assets/css/app.css';
import './assets/css/index.css';

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Page store={store}/>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
