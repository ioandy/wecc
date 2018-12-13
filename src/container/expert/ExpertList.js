import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux';
import {actions} from '../../redux/modules/expert';
import {Link} from "react-router-dom";
import {List, Avatar, Pagination, Divider, Spin, Button} from 'antd'; //Button, Form,
import {Constant} from '../Constant';
import HeadLine from "../../component/HeadLine";

class ExpertList extends Component {

    handlePageChange = (pageNum, pageSize) => {
        actions.listAll(this.props.dispatch, {pageNum, pageSize},
            // 回调设置保存页码到location，目的是为了编辑页面跳转回来还是在之前的页面上
            () => {
                window.location.hash = `#${pageNum}`;
            }
        );
    };
    // 点击跳转
    handleAddClick = () => {
        this.props.history.push({pathname: '/app/expert/edit'});
    };

    componentDidMount() {
        const {pageSize} = this.props;
        // 从location获取跳转前的页面
        let pageNum = parseInt(window.location.hash.slice(1), 0) || 1;
        this.handlePageChange(pageNum, pageSize || 8);
    }

    render() {
        const {items, loading, pagination: {total, pageNum, pageSize,}} = this.props;
        return (
            <div>
                <HeadLine breadcrumbs={[{path: '/app/expert/list', icon: 'solution', text: '会诊专家'}]}
                          buttons={[{type: 'primary', icon: 'user-add', callback: this.handleAddClick, text: 'Add'}]}/>
                <Divider/>
                <Spin spinning={loading}>
                    <List
                        size="middle"
                        itemLayout="horizontal"
                        dataSource={items}
                        renderItem={(item, props) => (
                            <List.Item actions={
                                [<Link
                                    to={{pathname: '/app/expert/edit', search: `?id=${item.id}`, query: {id: item.id}}}><Button>edit</Button></Link>,
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={`${Constant.imagePath}/expert/${item.headImg}`}/>}
                                    title={item.name}
                                    description={`${item.hospital}, ${item.position}`}
                                    /*onClick={ ()=> this.handleOnItemClick(item.id) }*/
                                />
                            </List.Item>
                        )}
                    />
                    <Divider/>
                    <Pagination
                        total={total}
                        current={pageNum}
                        showTotal={total => `Total ${total} items`}
                        pageSize={pageSize}
                        hideOnSinglePage={true}
                        onChange={this.handlePageChange}/>

                </Spin>
            </div>
        )
    }
}

//把State转换成当前的Props
const mapStateToProps = (state, ownProps) => {
    const {
        items = [],
        loading = true,
        pagination = {
            total: 0,
            pageNum: parseInt(window.location.hash.slice(1), 0) || 1, //获取当前页面的hash值，转换为number类型,
            pageSize: 8,
        }
    } = state.expertReducer;
    return {items, pagination, loading};
};

export default withRouter(connect(mapStateToProps)(ExpertList));