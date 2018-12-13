import React from 'react';
import {Route} from "react-router-dom";

const SubRoute = route => {
    let _route = route.exact
        ? <Route exact
                 path={route.path}
                 render={props => (
                     <route.component {...props} routes={route.routes}/>
                 )}/>
        : <Route path={route.path}
                 render={props => (
                     <route.component {...props} routes={route.routes}/>
                 )}/>;
    return _route;

};

export default SubRoute;