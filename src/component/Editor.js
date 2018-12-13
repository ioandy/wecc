import React, {Component} from 'react';
import wangEditor from 'wangeditor';

import {Constant} from "../container/Constant";

/**
 * 富文本组件
 */
class Editor extends Component {

    init = (dom, module, handleChange) => {
        const editor = new wangEditor(dom);  //
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        const customConfig = {
            // 是否开启 debug 模式（debug 模式下错误会 throw error 形式抛出）
            debug: true,
            // 编辑区域的 z-index
            //zIndex: 10000,
            // 服务地址
            uploadImgServer: Constant.imageUploadPath(module), //'http://localhost:9080/'+ module +'/image/upload/',
            // 设置图片请求超时
            uploadImgTimeout: 15000,
            // 隐藏掉插入网络图片功能。该配置，只有在你正确配置了图片上传功能之后才可用。
            showLinkImg: false,
            // 粘贴过滤样式，默认开启
            pasteFilterStyle: true,
            // 粘贴内容时，忽略图片。默认关闭
            pasteIgnoreImg: true,
            // 上传图片，是否显示 base64 格式
            uploadImgShowBase64: false,
            // 上传图片，server 地址（如果有值，则 base64 格式的配置则失效）
            // uploadImgServer: '/upload',
            // 自定义配置 filename
            uploadFileName: '',
            // 配置 XHR withCredentials
            withCredentials: false,
            menus: ['head', 'fontSize', 'fontName', 'bold', 'italic', 'underline', 'strikeThrough', 'foreColor', 'backColor', 'list', 'justify', 'quote', 'image', 'video', 'table', 'undo', 'redo'],
            colors: ['#000000', '#2F4F4F', '#696969', '#BEBEBE', '#1C487F', '#8470FF', '#87CEFA', '#FF0000', '#FFFF00', '#00FF00', '#FFFFFF'],
            familys: ['宋体', '黑体', '楷体', '微软雅黑', 'Arial', 'Verdana', 'Georgia'],
            onchange: handleChange,
            // 设置 headers
            // uploadImgHeaders: { 'contentType': false },
            // 配置自定义参数（举例）
            // uploadParams : {  token: 'abcdefg', user: 'wangfupeng1988' }
            /*customUploadImg: function (files, insert) {
                // files 是 input 中选中的文件列表
                // insert 是获取图片 url 后，插入到编辑器的方法
                // 上传代码返回结果之后，将图片插入到编辑器中
                //insert(imgUrl)
            },
            customAlert: function (info) {
                // info 是需要提示的内容
                alert('自定义提示：' + info)
            }*/
        };
        editor.customConfig = customConfig;
        editor.create();
        return editor;
    };
    clear = () => {
        this.editor.txt.html('');
    };

    componentDidMount() {
        this.editor = this.init(
            document.querySelector(`#${this.props.domId}`), /* ReactDOM.findDOMNode(this._div)*/
            this.props.module,
            (html) => {
                //将html值设为form表单的content属性值
                this.props.onEditorChange(html);
            });
    }

    render() {
        return ( /*ref={(ref) => this._div = ref}*/
            <div id={this.props.domId}
                 style={this.props.style}
            ></div>
        );
    }

}

export default Editor;