import React, {Component} from 'react';
import {Menu, Icon, Layout, Badge} from 'antd';
import {gitOauthToken, gitOauthInfo} from '../redux/modules/http';
import {HttpUtil} from '../utils/Tools';
import avater from '../assets/images/header.jpg';
import {withRouter} from 'react-router-dom';

const {Header} = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class HeadBar extends Component {
    state = {
        user: '',
        visible: false,
    };
    menuClick = e => {
        console.log(e);
        e.key === 'logout' && this.logout();
    };
    logout = () => {
        sessionStorage.removeItem('user');
        this.props.history.push('/login')
    };
    handleVisibleChange = (visible) => {
        this.setState({visible});
    };

    componentDidMount() {
        const QueryString = HttpUtil.queryString();
        const _user = JSON.parse(sessionStorage.getItem('user')) || '测试';
        if (!_user && QueryString.hasOwnProperty('code')) {
            gitOauthToken(QueryString.code).then(res => {
                gitOauthInfo(res.access_token).then(info => {
                    this.setState({
                        user: info
                    });
                    sessionStorage.setItem('user', JSON.stringify(info));
                });
            });
        } else {
            this.setState({
                user: _user
            });
        }
    };

    render() {
        return (
            <Header className="custom-theme header">
                <Icon
                    className="trigger"
                    type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.props.toggle}
                />
                <Menu
                    mode="horizontal"
                    style={{lineHeight: '64px', float: 'right'}}
                    onClick={this.menuClick}
                >
                    <Menu.Item key="1">
                        <Badge count={25} overflowCount={10} style={{marginLeft: 10}}>
                            <Icon type="notification"/>
                        </Badge>
                    </Menu.Item>
                    <SubMenu title={<span className="avatar"><img src={avater} alt="头像"/><i
                        className="on bottom b-white"/></span>}>
                        <MenuItemGroup title="用户中心">
                            <Menu.Item key="setting:1">你好 - {this.props.user.userName}</Menu.Item>
                            <Menu.Item key="setting:2">个人信息</Menu.Item>
                            <Menu.Item key="logout"><span onClick={this.logout}>退出登录</span></Menu.Item>
                        </MenuItemGroup>
                        <MenuItemGroup title="设置中心">
                            <Menu.Item key="setting:3">个人设置</Menu.Item>
                            <Menu.Item key="setting:4">系统设置</Menu.Item>
                        </MenuItemGroup>
                    </SubMenu>
                </Menu>
            </Header>
        )
    }
}

export default withRouter(HeadBar);
