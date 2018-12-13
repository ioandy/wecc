import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import NotFound from './container/NotFound';
import Login from './container/Login';
import App from './App';

export default () => (
    <Switch>
        <Route exact path="/" render={() => <Redirect to="/app/index" push/>}/>
        <Route path="/app" component={App}/>
        <Route path="/404" component={NotFound}/>
        <Route path="/login" component={Login}/>
        <Route component={NotFound}/>
    </Switch>
)