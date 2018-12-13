import React, {Component} from 'react';
import QRCode from 'qrcode.react';
import {Row, Col, Button, Divider, Card, Select, Form, message} from 'antd';
import HeadLine from "../../component/HeadLine";
import axios from 'axios';
import {Constant} from "../Constant";
import {ArrayUtil} from "../../utils/Tools";

const Option = Select.Option;

export default class Duty extends Component {
    state = {
        size: 'large',
        pre_values: '',  //提交前的上一个内容，
        values: '',
        defaultValue: [],
        options: [],
    };
    handleChange = (value) => {
        this.setState({values: value})
    };
    handleSetOnDuty = () => {
        let _values = this.state.values;
        if (ArrayUtil.equals(this.state.pre_values, _values)) return;
        if (_values) {
            axios.post(
                `${Constant.host}/duty/setDuty`, _values,
            )
                .then(res => res.data)
                .then(data => {
                    const {code} = data;
                    this.setState({pre_values: _values});
                    if (code === 1) {
                        message.success("设定值班人员成功!");
                    } else {
                        message.warn("未能成功设定值班人员!");
                    }
                });
        }
    };

    componentDidMount() {
        axios.all([this.getAllDuties(), this.getOnDuty()])
            .then(axios.spread(
                (res1, res2) => {
                    const data1 = res1.data;
                    if (data1.code === 1) {
                        const _options = data1.content.map(item => {
                            item.id = item.id + '';
                            return item
                        });
                        this.setState({options: _options});
                        const data2 = res2.data;
                        if (data2.code === 1) {
                            const ids = data2.content.map(item => item.id + '');
                            this.setState({defaultValue: ids});
                        }
                    }

                }
            ));
    }

    getAllDuties() {
        return axios.get(`${Constant.host}/duty/list`);
    }

    getOnDuty() {
        return axios.get(`${Constant.host}/duty/onDuty`);
    }

    render() {

        const {size, options, defaultValue} = this.state;
        let children = [];
        options.map(item => {
            return children.push(<Option key={item.id} value={item.id} className=''>{item.name}</Option>);
        });

        return (
            <div>
                <HeadLine breadcrumbs={[{path: '/duty', icon: 'schedule', text: '值班设置'}]}/>
                <Divider/>
                <Row gutter={16} style={{marginBottom: '24px', height: '40vh'}}>
                    <Col span={12}>
                        <Card title="设置值班人员" style={{height: '100%'}}>
                            <Form>
                                <Form.Item>
                                    <Select
                                        mode="multiple"
                                        key={defaultValue}
                                        defaultValue={defaultValue}
                                        size={size}
                                        placeholder="Please select"
                                        onChange={this.handleChange}
                                    >
                                        {children}
                                    </Select>
                                </Form.Item>
                                <Form.Item>
                                    <Button type='primary' onClick={this.handleSetOnDuty} block>设定</Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="扫码加入值班表" style={{textAlign: 'center'}}>
                            <QRCode value={`http://wxservice.drwatson.ai/lccimw/duty/apply`}/>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}