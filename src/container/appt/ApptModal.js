import React, {Component} from 'react';
import {Form, Modal, Select, Alert, Divider, Card, message} from 'antd';
import axios from '../../api/server';
import {Constant, RespStatus} from "../Constant";
import ApptLogForm from "./ApptLogForm";
import FileUploader from "../../component/FileUploader";
import {DateUtil} from "../../utils/Tools";

const FormItem = Form.Item;
//1-预约，2-付款完成，3-收集资料，4-制作简报，5-安排会诊，6-会诊, 7-完成
const apptOptions = [
    {value: 1, text: '新预约', selected: true},
    {value: 2, text: '完成付款', selected: false},
    {value: 3, text: '收集资料', selected: false},
    {value: 4, text: '制作简报', selected: false},
    {value: 5, text: '安排会诊', selected: false},
    {value: 6, text: '会诊', selected: false},
    {value: 7, text: '完成', selected: false},
];

const ApptResType = {'briefs': 1, 'report': 2};

class ApptModal extends Component {

    state = {
        briefs: [],
        report: [],
    };
    handleStatusChange = (value) => {
        const {onApptStatusChange, current} = this.props;
        if (value) {
            onApptStatusChange({...current, ...{status: value}});
        }
    };
    handleRemove = (file, category) => {
        this.setState((state) => {
            const index = state[category].indexOf(file);
            const newFileList = state[category].slice();
            newFileList.splice(index, 1);
            let _state = {};
            _state[category] = newFileList;
            return _state;
        });
    };
    handlBeforeUpload = (file, category) => {
        let _state = {};
        _state[category] = [file];
        this.setState(_state);
    };
    handleAfterFileUpload = (res, catagory) => {
        const {current} = this.props;
        console.log(res);
        let apptRes = current[catagory] || {
            type: ApptResType[catagory],
            apptId: current.id,
            userId: current.userId,
            patient: current.patient,
            apptTime: DateUtil.parseDate(current.createTime, 'yyyy-MM-dd'),
        };
        apptRes.path = res;
        axios.post(`${Constant.host}/appt/res/save`, apptRes)
            .then(res => res.data)
            .then(data => {
                const {code, content} = data;
                if (code === RespStatus.SUCCESS) {
                    message.success('successfully.', 5);
                } else {
                    message.warn('failed!');
                }
            })
            .catch(ex => console.error(ex));
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.current !== this.props.current) {
            const {current} = nextProps;
            if (Object.keys(current).length > 0) {
                const {briefs, report} = current;
                let _briefs = briefs ? [{uid: -1, name: briefs.path,}] : [];
                let _report = report ? [{uid: -1, name: report.path,}] : [];
                this.setState({
                    briefs: _briefs,
                    report: _report,
                });
                return true;
            }
        }
        return false;
    }

    render() {
        const formItemLayout = {
            labelCol: {xs: {span: 5}},
            wrapperCol: {xs: {span: 19}}
        };
        const {modalVisible, form, onModalClose, current} = this.props;
        const {briefs, report} = this.state;
        const {getFieldDecorator} = form;
        const option = apptOptions.find(item => item.value === current.status);

        return modalVisible ?
            <Modal
                title={`会诊状态、安排及资料--${current.patient}`}
                centered
                visible={modalVisible}
                /*onOk={this.handleSubmit}*/
                onCancel={onModalClose}
                onClose={onModalClose}
                destroyOnClose={true}
                width={640}
                footer={null}
            >
                <Card
                    type={'inner'}
                    title={<b>修改预约状态</b>}
                    style={{width: '100%', marginBottom: 16,}}
                >
                    {
                        option ?
                            <div>
                                <Alert message={`当前状态为： ${option.text}`} type="info" closable/>
                                <Divider/>
                            </div>
                            : null
                    }
                    <Form>
                        <FormItem {...formItemLayout} label="变更状态为">
                            {getFieldDecorator('status', {
                                rules: [{required: true, message: '请指定预约状态',}],
                            })(
                                <Select placeholder="请选择状态" onChange={this.handleStatusChange}>
                                    {
                                        apptOptions.map((item, i) => {
                                            return <Select.Option key={"appt" + i}
                                                                  value={item.value}>{item.text}</Select.Option>
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Form>
                </Card>

                <Card
                    type={'inner'}
                    title={<b>会诊安排说明</b>}
                    style={{width: '100%', marginBottom: 16,}}
                >
                    <ApptLogForm apptId={current.id}/>
                </Card>

                <Card
                    type={'inner'}
                    title={<b>会诊资料上传</b>}
                    style={{width: '100%', marginBottom: 16,}}  //
                >
                    <FileUploader
                        value={briefs}
                        label={'病例简报'}
                        btntext={'上传病例简报'}
                        action={'http://192.168.3.159:9080/weappt/files/1/upload'}
                        callback={(res) => this.handleAfterFileUpload(res, 'briefs')}
                        beforeUpload={(file) => this.handlBeforeUpload(file, 'briefs')}
                        onRemove={(file) => this.handleRemove(file, 'briefs')}
                    />
                    <Divider/>
                    <FileUploader
                        value={report}
                        label={'会诊报告'}
                        btntext={'上传会诊报告'}
                        action={'http://192.168.3.159:9080/weappt/files/2/upload'}
                        callback={(res) => this.handleAfterFileUpload(res, 'report')}
                        beforeUpload={(file) => this.handlBeforeUpload(file, 'report')}
                        onRemove={(file) => this.handleRemove(file, 'report')}
                    />
                </Card>
            </Modal> : null;
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
    //formFileds['detail'] = Form.createFormField({ value: apptStatus.status })
    return formFileds;
};

ApptModal = Form.create({onFieldsChange, mapPropsToFields})(ApptModal);

export default ApptModal;