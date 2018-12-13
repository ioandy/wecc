import React, {Component} from 'react';
import {Form, Modal, Select, Alert, Divider} from 'antd';

const FormItem = Form.Item;
//1-预约，2-完成付款，3-收集资料，4-制作简报，5-安排会诊，6-会诊, 7-完成
const mdtappsOptions = [
    {value: 1, text: '新预约', selected: true},
    {value: 2, text: '完成付款', selected: false},
    {value: 3, text: '收集资料', selected: false},
    {value: 4, text: '制作简报', selected: false},
    {value: 5, text: '安排会诊', selected: false},
    {value: 6, text: '会诊', selected: false},
    {value: 7, text: '完成', selected: false},
];

class MdtAppsModal extends Component {

    onClose = (e) => {
        console.log(e, 'I was closed.');
    };

    handleSubmit = () => {
        const {form, onModalSubmit, current} = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                onModalSubmit({...current, ...values});
            }
        });
    };

    render() {
        const formItemLayout = {
            labelCol: {xs: {span: 5}},
            wrapperCol: {xs: {span: 19}}
        };
        const {modalVisible, form, onModalClose, current} = this.props;
        const {getFieldDecorator} = form;

        const option = mdtappsOptions.find(item => item.value === current.status);
        return (
            <Modal
                title="修改预约状态"
                centered
                visible={modalVisible}
                onOk={this.handleSubmit}
                onCancel={onModalClose}
                onClose={onModalClose}
                destroyOnClose={true}
            >
                {
                    option ?
                        <div>
                            <Alert
                                message={`当前状态为： ${option.text}`}
                                type="info"
                                closable/>
                            <Divider/>
                        </div>
                        : null
                }

                <Form>
                    <FormItem {...formItemLayout} label="变更状态为">
                        {getFieldDecorator('status', {
                            initialValue: 1,
                            rules: [
                                {required: true, message: '请指定预约状态',}
                            ],
                        })(
                            <Select placeholder="请选择状态">
                                {
                                    mdtappsOptions.map((item, i) => {
                                        return <Select.Option key={"mdtapps" + i}
                                                              value={item.value}>{item.text}</Select.Option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

const onFieldsChange = (props, fields) => {
    //console.log(fields);
};
const mapPropsToFields = (props) => {
    let {current} = props;
    if (!current) return;
    let formFileds = {};
    formFileds['status'] = Form.createFormField({value: current.status});
    return formFileds;
};

MdtAppsModal = Form.create({onFieldsChange, mapPropsToFields})(MdtAppsModal);

export default MdtAppsModal;