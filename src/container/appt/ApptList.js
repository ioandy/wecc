import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux';

import {Row, Col, Table, Divider, message, Alert, Button, Tag,} from 'antd'; //   Select, Badge
import {actions} from '../../redux/modules/appt';
import ApptModal from "./ApptModal";
import HeadLine from "../../component/HeadLine";
import {Constant} from "../Constant";

// 预约状态  //1-预约，2-付款完成，3-收集资料，4-制作简报，5-安排会诊，6-会诊, 7-完成
const APPT_STATUS = {
    1: {text: '新预约', color: '#33eeff'},
    2: {text: '完成付款', color: '#33ccff'},
    3: {text: '收集资料', color: '#33aaff'},
    4: {text: '制作简报', color: '#3388ff'},
    5: {text: '预约会诊', color: '#3366ff'},
    6: {text: '会诊', color: '#3333ff'},
    7: {text: '完成', color: '#3300ff'},
};

const ORDER_STR = {'ascend': "ASC", 'descend': 'DESC'};

class ApptList extends Component {

    state = {
        filteredInfo: [],
        apptStatus: {},
        resModalVisable: false,
    };
    handleTableChange = (pagination, filters, sorter) => {
        /*  判断是否有值，使用本地排序，避免触发服务端请求  */
        if (sorter.columnKey) {
            let sorterParam = '';
            sorterParam = sorter.columnKey + " " + ORDER_STR[sorter.order];
            console.log('sort by: ' + sorterParam);
        }
        if (filters) {
            /* * 服务端筛选  */
            this.setState({filteredInfo: filters});
            let filterParam = {};
            for (let key of Object.keys(filters)) {
                let value = filters[key];
                if (value) {
                    filterParam[key] = value[0];
                }
            }
            console.log('filter by: ' + filterParam);
            actions.listAll(this.props.dispatch, pagination, {filterable: filterParam});
        } else {
            actions.listAll(this.props.dispatch, pagination);
            this.setState({filteredInfo: []});  //清除过滤数据
        }
    };
    // 状态及预约说明修改
    showModal = (current) => {
        actions.showModal(this.props.dispatch, current);
    };
    columns = [
        {title: 'Id', width: 60, dataIndex: 'id', key: 'id', fixed: 'left', sorter: (a, b) => a.id - b.id},
        {title: 'Patient', width: 120, dataIndex: 'patient', key: 'patient', fixed: 'left'},
        {
            title: 'Gender', dataIndex: 'gender', key: 'gender', width: 100,
            filters: [
                {text: '男', value: 1},
                {text: '女', value: 2}
            ],
            //filteredValue: filteredInfo.gender || null,
            filterMultiple: false,
            render: (text) => text === 1 ? '男' : '女'
        },
        {title: 'Age', dataIndex: 'age', key: 'age', width: 100},
        {title: 'Disease', dataIndex: 'disease', key: 'disease', width: 140},
        {
            title: 'Status', dataIndex: 'status', key: 'status', width: 140,
            filters: [
                {text: '预约', value: 1},
                {text: '完成付款', value: 2},
                {text: '收集资料', value: 3},
                {text: '制作简报', value: 4},
                {text: '安排会诊', value: 5},
                {text: '会诊', value: 6},
                {text: '完成', value: 7},
            ],
            //filteredValue: filteredInfo.status || null,
            filterMultiple: false,
            render: (text) => {
                return <div><Tag color={APPT_STATUS[text].color}>{APPT_STATUS[text].text}</Tag></div>
            }
        },
        {title: 'Phone', dataIndex: 'phone', key: 'phone', width: 140},
        {title: 'Remark', dataIndex: 'remark', key: 'remark'},
        {
            title: 'CreateTime',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 160,
            sorter: (a, b) => (new Date(a.createTime.replace(/-/g, "/"))) - (new Date(b.createTime.replace(/-/g, "/")))
        },
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: 120,
            render: (text, record) => {
                return ( <Button type="dashed" icon="edit" onClick={() => {
                    this.showModal(record)
                }}>Action</Button>)
            }, /*<Link to=''>more</Link>*/
        },
    ];
    closeModal = (e) => actions.hideModal(this.props.dispatch);
    handleApptStatusChange = (model) => {
        const {dispatch, pagination} = this.props;
        actions.update(dispatch, model, pagination, (type) => {
            type === 1
                ? message.success('更新状态成功')
                : message.warning('未能成功更新状态');
        });
    };

    componentDidMount() {
        const {dispatch, pagination} = this.props;
        // 获取新预约提示
        actions.getNews(dispatch);
        // 预约列表
        actions.listAll(dispatch, pagination);
    }

    render() {
        const {data, pagination, loading, modalVisible, current, news} = this.props;
        return (
            <div>
                <HeadLine breadcrumbs={[{path: '/appt/list', icon: 'file-add', text: '会诊预约'},]}/>
                <Divider/>
                <Row gutter={24}>
                    <Col span={24} style={{margin: '8px 0'}}>
                        <Alert
                            message={<h3>有 <b style={{color: 'red', fontSize: '1.2em'}}> {news || 0}</b> 个新的预约会诊未处理
                            </h3>}
                            type="info"
                            closable
                            onClose={this.onClose}
                        />
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        <Table key={'appt_table'}
                               columns={this.columns}
                               scroll={{x: 1300, y: 560}}
                               rowKey={record => "appt" + record.id}
                               dataSource={data}
                               pagination={pagination}
                               loading={loading}
                               onChange={this.handleTableChange}
                        />
                        <ApptModal modalVisible={modalVisible}
                                   onModalClose={this.closeModal}
                                   onApptStatusChange={this.handleApptStatusChange}
                                   current={current}
                        />

                    </Col>
                </Row>
            </div>
        )
    }
}


//把State转换成当前的Props
const mapStateToProps = (state, ownProps) => {
    const {
        data = [], current = {}, apptStatus = {}, pagination = {
            current: 1,
            pageSize: 8
        }, loading = false, modalVisible = false, news = 0
    } = state.apptReducer;
    return {data, current, apptStatus, pagination, loading, modalVisible, news};
};
export default withRouter(connect(mapStateToProps)(ApptList));