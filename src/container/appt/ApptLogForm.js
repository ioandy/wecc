import React, {Component} from 'react';
import axios from '../../api/server';
import moment from 'moment';
import {Form, Select, Input, Button, DatePicker, message} from 'antd';
import {Constant, RespStatus} from "../Constant";

const FormItem = Form.Item;
const Option = Select.Option;

class ApptLogForm extends Component {

    state = {
        apptLog: {},
        pre_values: '',  //提交前的上一个内容，
        values: '',
        defaultValue: [],
        options: [],
    };
    handleSubmit = () => {
        const {form, apptId} = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                let _values = {...values};
                _values.apptId = apptId;
                _values.apptTime = values.apptTime.format('YYYY-MM-DD');
                _values.experts = values.experts.join(',');
                console.log(_values);
                _values = Object.assign({}, this.state.apptLog, _values);
                axios.post(`${Constant.host}/appt/log/save`, _values)
                    .then(res => res.data)
                    .then(data => {
                        const {code} = data;
                        if (code === RespStatus.SUCCESS) {
                            message.success("提交成功！")
                        } else {
                            message.warn("提交失败！")
                        }
                    })
            }
        });
    };

    componentDidMount() {
        axios.get(`${Constant.host}/expert/listAll?start=1&limit=100000`)
            .then(res => res.data)
            .then(data => {
                const {code, content} = data;
                if (code === 1) {
                    const _options = content.list.map(item => {
                        item.id = item.id + '';
                        return item
                    });
                    this.setState({options: _options});
                }
            });
        const {form, apptId} = this.props;
        if (apptId) {
            axios.get(`${Constant.host}/appt/log/${apptId}`)
                .then(res => res.data)
                .then(data => {
                    const {code, content} = data;
                    if (code === RespStatus.SUCCESS && content.length > 0) {
                        let formData = content[0];
                        form.setFieldsValue({
                            apptTime: moment(formData.apptTime),
                            experts: formData.experts.split(','),
                            detail: formData.detail,
                        });
                        this.setState({apptLog: formData});
                    }
                })
        }
    }

    render() {
        const formItemLayout = {
            labelCol: {xs: {span: 5}},
            wrapperCol: {xs: {span: 19}}
        };
        const {getFieldDecorator} = this.props.form;
        const {options, defaultValue} = this.state;

        let children = [];
        options.map(item => {
            return children.push(<Option key={item.id} value={item.id} className=''><b>{item.name}</b>--{item.position}--{item.hospital}
            </Option>);
        });

        return (
            <Form>
                <FormItem {...formItemLayout} label="会诊时间">
                    {getFieldDecorator('apptTime', {
                        rules: [{type: 'object', required: true, message: 'Please select time!'}],
                    })(<DatePicker format={'YYYY-MM-DD'}/>)}
                </FormItem>
                <FormItem {...formItemLayout} label="会诊专家">
                    {getFieldDecorator('experts', {
                        rules: [{type: 'array', required: true, message: 'Please select your habitual ApptExperts!'}],
                    })(
                        <Select
                            mode="multiple"
                            key={defaultValue}
                            size={'large'}
                            placeholder="Please select"
                            onChange={value => this.setState({values: value})}
                        >
                            {children}
                        </Select>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="细节描述">
                    {getFieldDecorator('detail', {
                        rules: [{required: true, message: 'Please input detail!'}],
                    })(<Input.TextArea row={4}/>)}
                </FormItem>
                <FormItem style={{textAlign: 'right'}}>
                    <Button type="primary" onClick={this.handleSubmit}>提交更改</Button>
                </FormItem>
            </Form>);
    }
}

ApptLogForm = Form.create()(ApptLogForm);

export default ApptLogForm;