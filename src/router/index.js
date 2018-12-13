import React, {Component} from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
//import {connect} from 'react-redux';
import {routesConfig} from './config';

class CRouter extends Component {

    requireAuth = (permission, component) => {
        const {auth} = this.props;
        const {permissions} = auth.data;
        // const { auth } = store.getState().httpData;
        if (!permissions || !permissions.includes(permission)) return <Redirect to={'404'}/>;
        return component;
    };
    requireLogin = (component, permission) => {
        const {auth} = this.props;
        if (process.env.NODE_ENV === 'production' && (!auth || !auth.data)) { // 线上环境判断是否登录 production/development
            return (<Redirect to={'/login'}/>);
        }
        return permission ? this.requireAuth(permission, component) : component;
    };

    render() {
        /*
                const { auth } = this.props;
                // 初始渲染时，尚未向服务器发送认证请求，因此不渲染元素
                if(!auth){
                    return (<Redirect to={'/login'} />);
                }*/
        const route = r => {
            const Component = r.component;
            return (
                <Route
                    key={r.route || r.key}
                    exact
                    path={r.route || r.key}
                    render={props => {
                        return r.login
                            ? <Component {...props} />
                            : this.requireLogin(<Component {...props} />, r.auth)
                    }}
                />
            )
        };
        return (
            <Switch>
                {
                    Object.keys(routesConfig).map(key =>
                        routesConfig[key].map(r => {
                            return r.component ? route(r) : r.subs.map(r => route(r));
                        })
                    )
                }
                <Route render={() => <Redirect to="/404"/>}/>
            </Switch>
        )
    }
}

/*const mapStateToProps = (state, ownProps) => {
    return { auth: state.auth }
 }*/

export default CRouter; //connect(mapStateToProps)(CRouter);