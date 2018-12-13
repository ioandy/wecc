import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux';

import {actions} from '../../redux/modules/qna';

import {List, Pagination, Divider, Radio, Row, Col, message, Spin} from 'antd';

import QnaListItem from "./QnaListItem";
import HeadLine from "../../component/HeadLine";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class QnaList extends Component {

    handlePageChange = (pageNum, pageSize) => {
        const {dispatch} = this.props;
        actions.listAll(dispatch, {pageNum, pageSize},
            (res) => {
                window.location.hash = `#${pageNum}`;
                if (res === 'ECONNABORTED') {
                    message.error('网络超时，请稍后重试！');
                }
            } // 回调设置跳转前的页面
        );
    };
    handleItemReply = (newItem, callback) => {
        const {dispatch, pagination} = this.props;
        actions.update(dispatch, newItem, pagination, (resp) => {
            callback(resp); // 传递到QnaListItem去处理
        });
    };
    handleVisibleChange = (newItem, callback) => {
        const {dispatch, pagination} = this.props;
        actions.update(dispatch, newItem, pagination, (resp) => {
            callback(resp); // 传递到QnaListItem去处理
        });
    };

    componentDidMount() {
        const {pagination: {pageSize}} = this.props;
        let pageNum = parseInt(window.location.hash.slice(1), 0) || 1; // 获取跳转前的页面
        this.handlePageChange(pageNum, pageSize);
    }

    handleReplyStatusFilter(e) {
        console.log(`radio checked:${e.target.value}`);
    }

    render() {
        const {pagination: {total, pageNum, pageSize}, items, loading} = this.props;
        return (
            <div>
                <HeadLine breadcrumbs={[{path: '/app/appt/list', icon: 'question-circle', text: '疑问解答'}]}/>
                <Divider/>
                <Spin spinning={loading}>
                    <List
                        style={{height: '72vh', overflowY: 'auto'}}
                        itemLayout="vertical"
                        size="large"
                        dataSource={items}
                        renderItem={item => <QnaListItem item={item} onReplySubmit={this.handleItemReply}
                                                         onVisibleChange={this.handleVisibleChange}/>}
                    />
                </Spin>
                <Divider/>
                <Row gutter={8}>
                    <Col span={12}>
                        <RadioGroup onChange={this.handleReplyStatusFilter} defaultValue="all"
                                    style={{textAlign: 'left', display: "inline"}}>
                            <RadioButton value="all">全部</RadioButton>
                            <RadioButton value="unReply">未回复</RadioButton>
                            <RadioButton value="hasReply">已回复</RadioButton>
                        </RadioGroup>
                    </Col>
                    <Col span={12}>
                        <Pagination
                            style={{textAlign: 'right'}}
                            total={total}
                            current={pageNum}
                            showTotal={total => `Total ${total} items`}
                            pageSize={pageSize}
                            hideOnSinglePage={true}
                            onChange={this.handlePageChange}/>
                    </Col>
                </Row>
            </div>
        )
    }
}


//把State转换成当前的Props
const mapStateToProps = (state, ownProps) => {
    let {items = [], loading = true, pagination = {}} = state.qnaReducer;  //total: 0, pageNum : parseInt(window.location.hash.slice(1), 0) || 1,  pageSize :8}
    return {items, loading, pagination}
};

export default withRouter(connect(mapStateToProps)(QnaList));