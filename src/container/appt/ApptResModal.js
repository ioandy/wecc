import React, {Component} from 'react';
import {Modal, Card, message, Divider} from 'antd';
import FileUploader from "../../component/FileUploader";
import {RespStatus} from "../Constant";

//import {Constant, RespStatus} from "../Constant";

class ApptResModal extends Component {

    handleStatusChange = (value) => {
        const {onModalSubmit, current} = this.props;
        if (value) {
            onModalSubmit({...current, ...{status: value}});
        }
    };
    handleAfterUpload = (res) => {
        const {code, content} = res.data;
        if (code === RespStatus.SUCCESS) {
            console.log(content);
            message.success('upload successfully.');
        } else {
            message.warn('upload failed!');
        }
    };

    componentDidMount() {
        console.log(this.props);
    }

    render() {
        const {modalVisible, onModalClose, current} = this.props;
        return modalVisible ?
            <Modal
                title="会诊病例简报及报告上传"
                centered
                visible={modalVisible}
                onCancel={onModalClose}
                destroyOnClose={true}
                width={640}
                footer={null}
            >
                <Card
                    type={'inner'}
                    style={{width: '100%', marginBottom: 24,}}  //
                >
                    <h3>{current.patient}</h3>
                    <FileUploader
                        label={'病例简报'}
                        btntext={'上传病例简报'}
                        action={'http://192.168.3.159:9080/weappt/files/1/upload'}
                        callback={this.handleAfterUpload}
                    />
                    <Divider/>
                    <FileUploader
                        label={'会诊报告'}
                        btntext={'上传会诊报告'}
                        action={'http://192.168.3.159:9080/weappt/files/2/upload'}
                        callback={this.handleAfterUpload}
                    />
                </Card>
            </Modal> : null;
    }
}

export default ApptResModal;