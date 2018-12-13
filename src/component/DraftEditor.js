import React from 'react'
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {EditorState, convertToRaw, ContentState,} from 'draft-js'; //convertFromHTML
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import {Constant} from '../container/Constant'

//import style from '../assets/css/editor.css';


class DraftEditor extends React.Component {

    state = {
        editorState: EditorState.createEmpty(),
    };

    /* componentWillReceiveProps(nextProps) {
         if (this.props.value !== nextProps.value && nextProps.value) {
             // 匹配富文本编辑器格式，回显保存的内容
             const contentBlock = htmlToDraft(nextProps.value);
             if (contentBlock) {
                 const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                 const editorState = EditorState.createWithContent(contentState);
                 this.setState({ editorState })
             }
         }
     }*/
    handleEditorStateChange = (editorState) => {
        this.setState({editorState,}, () => {
            this.props.onEditorChange(this.getHtmlContent());
        });
    };
    getHtmlContent = () => {
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
    };
    handleUploadCallback = (file) => {
        return new Promise(
            (resolve, reject) => {
                const formData = new FormData();
                formData.append('pic-upload', file);
                const xhr = new XMLHttpRequest();
                xhr.open('POST', `${Constant.imageUploadPath('news')}`);
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.setRequestHeader('Access-Control-Allow-Headers', 'X-Requested-With');
                xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
                xhr.send(formData);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status >= 200 || xhr.status < 300 || xhr.status === 304) {
                            let result = JSON.parse(xhr.responseText);
                            resolve({
                                data: {
                                    link: result.data[0]
                                }
                            });
                        } else {
                            reject(xhr.status)
                        }
                    }
                }
            }
        );
    };

    componentDidMount() {
        const {value} = this.props;
        if (value) {
            const blocksFromHTML = htmlToDraft(value);
            const state = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks);
            this.setState({
                editorState: EditorState.createWithContent(state),
            })
        }
    }

    setHtml(html) {
        if (html) {
            // 匹配富文本编辑器格式，回显保存的内容
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.setState({editorState})
            }
        }
    }

    render() {
        //const {editorState} = this.state;
        return (
            <div>
                <Editor
                    editorState={this.state.editorState}
                    wrapperClassName="rdw-wrpeapr"
                    editorClassName="rdw-editor"
                    onEditorStateChange={this.handleEditorStateChange}
                    uploadCallback={this.handleUploadCallback}
                />
                {/*<textarea value={draftToHtml(convertToRaw(editorState.getCurrentContent()))} />*/}
            </div>
        );
    }
}

export default DraftEditor;