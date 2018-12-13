import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
import {List, Avatar, Divider, Pagination, Spin, Popconfirm} from 'antd';
import HeadLine from "../../component/HeadLine";

import {actions} from '../../redux/modules/news';

class News extends Component {
    state = {};
    handlePageChange = (pageNum, pageSize) => {
        /*actions.listAll(this.props.dispatch, {pageNum, pageSize},
            // 回调设置保存页码到location，目的是为了编辑页面跳转回来还是在之前的页面上
            ()=> {window.location.hash = `#${pageNum}`}
        );*/
    };
    // 点击跳转
    handleAddClick = () => {
        this.props.history.push({pathname: '/app/news/edit'});
    };

    componentDidMount() {
        const {dispatch, pagination} = this.props;
        actions.listAll(dispatch, pagination);
    }

    render() {
        const {items, loading, pagination: {total, pageNum, pageSize,}} = this.props;
        return (
            <div>
                <HeadLine breadcrumbs={[{path: '/app/news/list', icon: 'file-text', text: '最新资讯'}]}
                          buttons={[{type: 'primary', icon: 'file-add', callback: this.handleAddClick, text: 'Add'}]}/>
                <Divider/>
                <Spin spinning={loading}>
                    <List
                        size="large"
                        itemLayout="horizontal"
                        dataSource={items}
                        renderItem={item => (
                            <List.Item actions={
                                [<Link
                                    to={{pathname: '/app/news/edit', search: `?id=${item.id}`, query: {id: item.id}}}>edit</Link>,
                                    <Popconfirm title="Are you sure?" placement="topLeft" onConfirm={() => {
                                    }} onCancel={() => {
                                    }}>
                                        <a href="http://localhost:3000/news/list">Delete</a>
                                    </Popconfirm>]}>
                                <List.Item.Meta
                                    avatar={<Avatar icon="right-circle-o" size="small"/>}
                                    title={item.title}
                                    description={`${item.createTime}`}
                                />
                            </List.Item>
                        )}
                    />
                </Spin>
                <Divider/>
                <Pagination
                    total={total}
                    current={pageNum}
                    showTotal={total => `Total ${total} items`}
                    pageSize={pageSize}
                    hideOnSinglePage={true}
                    onChange={this.handlePageChange}/>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const {
        items = [],
        loading = true,
        pagination = {
            total: 0,
            pageNum: parseInt(window.location.hash.slice(1), 0) || 1, //获取当前页面的hash值，转换为number类型,
            pageSize: 8,
        }
    } = state.newsReducer;
    return {items, pagination, loading};
};
export default connect(mapStateToProps)(News);