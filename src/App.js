import React, {Component} from 'react';
import {Layout} from 'antd';
import {receiveData} from './redux/modules/http';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom'
import {bindActionCreators} from 'redux';
import Routes from './router';
import SideBar from './component/SideBar';
import HeadBar from './component/HeadBar';

const {Content} = Layout;

class App extends Component {
    state = {
        collapsed: false,
        itemName: ''
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    getClientWidth = () => { // 获取当前浏览器宽度并设置responsive管理响应式
        const {receiveData} = this.props;
        const clientWidth = window.innerWidth;
        //console.log(clientWidth);
        receiveData({isMobile: clientWidth <= 992}, 'responsive');
    };

    componentWillMount() {
        const {receiveData} = this.props;
        const user = JSON.parse(sessionStorage.getItem('user'));
        user && receiveData(user, 'auth');
        /*
        * 自适应屏幕宽度
        this.getClientWidth();
        window.onresize = () => {
            //console.log('屏幕变化了');
            this.getClientWidth();
        }
        */
    }

    render() {
        const {auth} = this.props;
        //const isLogin = auth.data != null  && Object.keys(auth.data).length > 0 ? true : false;
        return (
            //isLogin ?
            <Layout className='app'>
                <SideBar collapsed={this.state.collapsed}/>
                <Layout>
                    <HeadBar style={{background: '#fff', padding: 0}} toggle={this.toggle}
                             collapsed={this.state.collapsed} user={auth.data || {}}/>
                    <Content style={{margin: '16px 16px', padding: '0', background: '#fff', minHeight: 360}}>
                        <Routes auth={auth}/>
                    </Content>
                </Layout>
            </Layout>
            //:   <Redirect to={'/login'} />

        );
    }
}

const mapStateToProps = state => {
    const {auth = {data: JSON.parse(sessionStorage.getItem('user'))}} = state.httpData;
    return {auth};
};
const mapDispatchToProps = dispatch => ({
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
