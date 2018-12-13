import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {connect} from 'react-redux';

import {List, Avatar, Divider, Pagination, Spin, Popconfirm, message} from 'antd';
import HeadLine from "../../component/HeadLine";

//import {Constant} from "../../component/Constant";
import {actions} from '../../redux/modules/knowledge';
import {RespStatus} from "../Constant";

class Knowledge extends Component {

    state = {};
    handlePageChange = (pageNum, pageSize) => {
        actions.listAll(this.props.dispatch, {pageNum, pageSize},
            // 回调设置保存页码到location，目的是为了编辑页面跳转回来还是在之前的页面上
            () => {
                window.location.hash = `#${pageNum}`
            }
        );
    };
    // 点击跳转
    handleAdd = () => {
        this.props.history.push({pathname: '/app/knowledge/edit'});
    };
    handleDelete = (item, pagination) => {
        const {dispatch} = this.props;
        actions.delete(dispatch, item.id,
            (code) => {
                if (code === RespStatus.SUCCESS) {
                    message.success("删除成功！");
                    actions.listAll(dispatch, pagination);
                } else {
                    message.warn("删除失败！");
                }
            });
    };

    componentDidMount() {
        const {dispatch, pagination} = this.props;
        actions.listAll(dispatch, pagination);
    }

    render() {
        const {items, loading, pagination: {total, pageNum, pageSize,}} = this.props;
        return (
            <div>
                <HeadLine breadcrumbs={[{path: '/app/knowledge/list', icon: 'laptop', text: '肿瘤课堂'}]}
                          buttons={[{type: 'primary', icon: 'file-add', callback: this.handleAdd, text: 'Add'}]}/>
                <Divider/>
                <Spin spinning={loading}>
                    <List
                        size="large"
                        itemLayout="horizontal"
                        dataSource={items}
                        renderItem={item => (
                            <List.Item actions={
                                [<Link to={{
                                    pathname: '/app/knowledge/edit',
                                    search: `?id=${item.id}`,
                                    query: {id: item.id}
                                }}>edit</Link>,
                                    <Popconfirm title="Are you sure?" placement="topLeft"
                                                onConfirm={() => this.handleDelete(item, {pageNum, pageSize})}
                                                onCancel={() => {
                                                }}>
                                        <a href="http://localhost:3000/app/kownledge/list">Delete</a>
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
    } = state.knowledgeReducer;
    return {items, pagination, loading};
};

export default connect(mapStateToProps)(Knowledge);