import React, {Component} from 'react'
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';

class QuillEditor extends Component {

    state = {
        value: '',
    };

    modules = {
        toolbar: [
            [{'font': []}],
            [{'header': [1, 2, 3, 4, 5, 6, false]}],
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            [{'color': []}, {'background': []}],          // dropdown with defaults from theme
            [{'align': []}],
            ['blockquote', 'code-block'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
            [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
            [{'direction': 'rtl'}],                         // text direction
            ['link', 'image', 'video'],
            ['clean']                                         // remove formatting button
        ],
    };

    formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

    handleOnBlur = (range, source, quill) => {
        const {onEditorBlur} = this.props;
        if (source === 'user') {
            onEditorBlur(quill.getHTML());
        }
    };


    handleOnChange = (html, delta, source) => {
        const {onEditorChange} = this.props;
        if (source === 'user') {
            onEditorChange(html);
        }
    };

    render() {
        return (
            <div>
                <ReactQuill theme="snow"
                            modules={this.modules}
                            formats={this.formats}
                            onChange={this.handleOnChange}
                            onBlur={this.handleOnBlur}>
                </ReactQuill>
            </div>
        )
    }
}

export default QuillEditor;