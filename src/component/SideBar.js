import React, {Component} from 'react';
import {Layout, Menu, Icon} from 'antd';
import {Link, withRouter} from "react-router-dom";
import {routesConfig, groupMenuKey} from '../router/config'

const {Sider} = Layout;

const renderSubMenu = item => {
    return (
        <Menu.SubMenu key={item.key} title={<span><Icon type={item.icon}/><span>{item.title}</span></span>}>
            {item.children.map(subItem => renderMenuItem(subItem))}
        </Menu.SubMenu>
    )
};

const renderMenuItem = item => {
    return (
        <Menu.Item key={item.key}>
            <Link to={item.key}><Icon type={item.icon}/> <span>{item.title}</span></Link>{/*<Icon type="upload"*/}
        </Menu.Item>
    );
};


const SiderMenu = ({menus, ...props}) => (
    <Menu {...props}>
        {menus && menus.map(item =>
            item.subs ? renderSubMenu(item) : renderMenuItem(item)
        )}
    </Menu>
);

class SideBar extends Component {
    state = {
        openKeys: [''],
        selectedKeys: [''],
        rootSubmenuKeys: groupMenuKey,
        itemName: ''
    };
    handleMenuItemClick = e => {
        this.setState({selectedKeys: [e.key]});
    };
    setDefaultActiveItem = ({location}) => {
        const {pathname} = location;
        routesConfig.menus.map(item => {
            if (item.pathname) {
                // 做一些事情,这里只有二级菜单
            }
            // 因为菜单只有二级,简单的做个遍历就可以了
            if (item.children && item.children.length > 0) {
                item.children.map(childitem => {
                    // 为什么要用match是因为 url有可能带参数等,全等就不可以了
                    // 若是match不到会返回null
                    if (pathname.match(childitem.key)) {
                        this.setState({
                            openKeys: [item.key],
                            selectedKeys: [childitem.key]
                        });
                        // 设置title
                        document.title = childitem.title;
                    }
                    return childitem.key;
                });
            }
            return item.title
        });
    };

    componentWillMount() {
        //console.log(this.props.history.location.pathname);
        // 设置菜单的默认值
        this.setDefaultActiveItem(this.props);
    }

    render() {
        const {collapsed} = this.props;
        const {openKeys, selectedKeys} = this.state;
        return (
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
            >
                <div className="logo"/>
                <SiderMenu
                    menus={routesConfig.menus}
                    theme="dark" mode="inline"
                    subMenuOpenDelay={0.1}
                    openKeys={openKeys}
                    onClick={this.handleMenuItemClick}
                    selectedKeys={selectedKeys}
                    onOpenChange={this.OpenChange}
                />
            </Sider>
        );
    }
}

export default withRouter(SideBar);