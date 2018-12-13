import React, {Component} from 'react';
import {message} from 'antd'
import {List, Row, Col, Icon, Switch, Input, Button, Form} from 'antd';  //Divider,

import {RespStatus} from '../Constant';

const IconText = ({props}) => {
    const {type, text, color, onToggleReply} = props;
    return (
        <span style={{color: color}} onClick={onToggleReply}>
            <Icon type={type} style={{marginRight: 8}}/>
            <b>{text}</b>
        </span>
    )
};

class QnaListItem extends Component {
    state = {
        showEditor: false,
        loading: false,
        answerText: '',
    };

    handleToggleReply = () => {
        this.setState({showEditor: !this.state.showEditor});
    };
    handeReplySubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {item, onReplySubmit} = this.props;
                let newItem = {...item, ...values};
                this.setState({loading: true});
                onReplySubmit(newItem, (status) => {
                    this.setState({loading: false});
                    if (status === RespStatus.SUCCESS) {
                        this.handleToggleReply();
                    } else {
                        message.error("网络超时，请稍后重试！");
                    }
                })
            }
        });
    };

    handleVisibleChange = (checked) => {
        const {item, onVisibleChange} = this.props;
        let newItem = {...item, ...{visible: checked}};
        onVisibleChange(newItem, (status) => {
            switch (status) {
                case RespStatus.SUCCESS:
                    message.success("状态更新成功！");
                    break;
                case RespStatus.FAIL:
                    message.warn("状态更新失败！");
                    break;
                default:
                    message.error("网络异常，请稍后重试！");
                    break;
            }
        });
    };

    render() {
        const {item, form: {getFieldDecorator}} = this.props;
        return (
            <List.Item
                key={item.id}
                actions={
                    item.answer
                        ? [<IconText props={{text: '已回复', type: 'check-circle-o', color: 'blue'}}/>,
                            <IconText props={{text: '修改', type: 'edit', onToggleReply: () => this.handleToggleReply()}}/>,
                            <Switch checkedChildren="显示" unCheckedChildren="隐藏" checked={item.visible}
                                    onChange={this.handleVisibleChange}/>,]
                        : [<IconText props={{text: '未回复', type: 'question-circle-o', color: 'red'}}/>,
                            <IconText props={{text: '回复', type: 'edit', onToggleReply: () => this.handleToggleReply()}}/>,
                            <Switch checkedChildren="显示" unCheckedChildren="隐藏" checked={item.visible}
                                    onChange={this.handleVisibleChange}/>,]

                }
            >
                <List.Item.Meta
                    title={<div><h4 style={{color: '#2b3245'}}>{item.question}</h4></div>}
                    description={`${item.createTime} by #${item.userId}`}
                />
                <p>{item.answer}</p>
                {this.state.showEditor
                    ? (
                        <Form layout="horizontal" onSubmit={this.handeReplySubmit}>
                            <Row gutter={16} type="flex" align="bottom" className='gutter-box'>
                                <Col span={14}>
                                    <Form.Item>
                                        {getFieldDecorator('answer', {
                                            rules: [{required: true, message: 'Please input your answer!'}],
                                        })(
                                            <Input.TextArea onChange={(e) => {
                                                this.setState({answerText: e.target.value})
                                            }}/>)}
                                    </Form.Item>
                                </Col>
                                <Col span={6} style={{display: 'block'}}>
                                    <Form.Item>
                                        <Button.Group>
                                            <Button type="primary" icon="check-circle" htmlType="submit"
                                                    loading={this.state.loading}>确定</Button>
                                            <Button type="default" icon="close-circle" onClick={this.handleToggleReply}>取消</Button>
                                        </Button.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    )
                    : null
                }
            </List.Item>
        )
    }
}

QnaListItem = Form.create()(QnaListItem);

export default QnaListItem;