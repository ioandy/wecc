import React from 'react';
import {Upload, message, Button, Icon, Row, Col} from 'antd';
import axios from '../api/server';
import {RespStatus} from "../container/Constant";

class FileUploader extends React.Component {
    state = {
        fileLen: 0,
        name: 'file',
        headers: {},
        fileList: [],
        uploading: false,
        uploaded: true,
    };

    /*componentWillReceiveProps (nextProps) {
        if (nextProps.value !== this.props.fileList){
            this.setState({ fileList:nextProps.value });
        }
    }*/

    handleUpload = () => {
        const {callback, action, value} = this.props;
        const formData = new FormData();
        formData.append('file', value[0]);
        this.setState({uploading: true});
        axios({
            url: action,
            method: 'post',
            processData: false,
            data: formData,
        })
            .then(res => res.data)
            .then(data => {
                const {code, content} = data;
                this.setState({uploading: false}); //fileList: [],
                if (code === RespStatus.SUCCESS) {
                    message.success('upload successfully.', 5);
                    this.setState({uploaded: true});
                    // 上传后的操作
                    if (callback) callback(content);
                } else {
                    message.warn('upload failed.');
                }
            })
            .catch(ex => {
                console.error(ex);
                this.setState({uploading: false, uploaded: false});
                message.error('upload failed.');
            })
    };

    beforeUpload = (file) => {
        this.props.beforeUpload(file);
        this.setState({
            //fileList: [...state.fileList, file],
            uploaded: false
        });
        return false;
    };

    handleRemove = (file) => {
        console.log(file);
        this.setState((state) => {
            //const index = state.fileList.indexOf(file);
            //const newFileList = state.fileList.slice();
            //newFileList.splice(index, 1);
            return {uploaded: true}; //fileList: newFileList,
        });
        this.props.onRemove(file);
    };

    render() {
        const {label, btntext, value} = this.props;
        const {uploading, uploaded, fileList} = this.state;
        const props = {
            onRemove: (file) => this.handleRemove(file),
            beforeUpload: (file) => this.beforeUpload(file),
            fileList: value || [],
        };
        return (
            <Row type="flex" align="middle" gutter={16}>
                <Col span={5}><b>{label}</b></Col>
                <Col span={14}>
                    <Upload {...props}>
                        {props.fileList.length <= 0 ? <Button> <Icon type="upload"/>{btntext}</Button> : null}
                    </Upload>
                </Col>
                <Col span={5}>
                    <Button
                        type="primary"
                        onClick={this.handleUpload}
                        disabled={props.fileList.length === 0 || uploaded}
                        loading={uploading}
                    >
                        {uploading ? '文件上传中...' : '提交'}
                    </Button>
                </Col>
            </Row>
        );
    }
}

export default FileUploader;