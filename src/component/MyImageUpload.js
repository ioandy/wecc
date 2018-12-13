import React, {Component} from 'react'
// import lrz from 'lrz';
//import {  Spin} from 'antd'; //message,
// import { Constant} from "./Constant";
// import axios from 'axios';
//import ImageUploader from "./ImageUploader";
//import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import QuillEditor from "./QuillEditor";


export default class MyImageUpload extends Component {

    state = {
        uploading: false,
        isEditFlages: false,
        value: '',
    };

    handleUploadFile = (file) => {
        console.log(file);
    };

    handleUploading = ({uploading}) => {
        this.setState({uploading});
    };

    handleEditorChange = (value) => {
        this.setState({value});
    };

    handleEditorBlur = (value) => {
        this.setState({value});
    };

    render() {
        return (
            <div>
                {/*<Spin spinning={ this.state.uploading }>
                <ImageUploader module={'public'}
                    disabledUploadAction={this.disabledUploadAction}
                                 isEditFlages={true}
                                 onUploadedFile={this.handleUploadFile}
                                 onUploading={this.handleUploading}
                                />
                </Spin>*/}

                <QuillEditor
                    onEditorChange={this.handleEditorChange}
                    onEditorBlur={this.handleEditorBlur}
                />

            </div>
        );
    }
}