import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Form, Input, Button, Row, Col, Divider, message} from 'antd'; //Tooltip, Icon, Cascader,Row, Col, Checkbox,Select,
import Editor from '../../component/Editor';
import {Constant, RespStatus} from '../Constant'
import {actions} from '../../redux/modules/news';
import {HttpUtil} from "../../utils/Tools";
import ImageUploader from "../../component/ImageUploader";

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {xs: {span: 24}, sm: {span: 3}},
    wrapperCol: {xs: {span: 24}, sm: {span: 20}}
};

class NewsEdit extends Component {

    state = {
        editType: "update",
        clearable: null, // 保存后清空表单内容
        uploading: false,
        isEditFlages: false,
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let _values = {...values};
                if (values.content) {
                    _values.content = values.content.replace('/^[ \\t]*\\n/g', '');
                }
                _values.thumbnail = values.thumbnail[0]['name'];
                let {dispatch, current} = this.props;
                Object.assign(current, _values);
                console.log('news : ', current);
                actions.save(dispatch, current, this.state.editType, (code) => {
                    switch (code) {
                        case RespStatus.SUCCESS:
                            message.success("保存成功！");
                            break;
                        case RespStatus.FAIL:
                            message.warn("未能成功更新！");
                            break;
                        default:
                            message.error("网络异常，请稍后重试！");
                            break;
                    }
                });
                //this.setState({clearable: setTimeout(()=>{this.props.form.resetFields(); this.editor.clear()}, 2000)});
            }
        });
    };
    handleUploadFile = (fileList) => {
        this.props.form.setFieldsValue({thumbnail: fileList})
    };
    handleUploading = ({uploading}) => {
        this.setState({uploading});
    };
    imgValidator = (rule, value, callback) => {
        if (!value || value.length < 1) {
            callback('');
        }
        callback();
    };

    /* 提交后清空原有内容 */
    componentWillUnmount() {
        // 页面卸载初始化redux-state状态，解决页面切换 state仍然保存上一个状态的问题
        actions.reset(this.props.dispatch);
        //this.props.form.resetFields();
        //clearTimeout(this.state.clearable);
    };

    componentDidMount() {
        let itemId = HttpUtil.getUrlParam('id');

        if (itemId) {  // 编辑
            this.setState({editType: "update"});
            const editor = this.editor.editor;
            const {dispatch} = this.props;
            actions.getOne(dispatch, itemId, (code, resp) => {
                if (code === RespStatus.SUCCESS) {
                    //this.editor.setHtml(resp['content']);  //draft-editor
                    editor.txt.html(resp['content']); //wangEditor手动设置富文本内容
                    //form.setFieldsValue({title: resp['title']});
                    //clearTimeout(this.state.clearable);//保存成功后清除表单内容
                } else {
                    message.warn('加载内容失败，请重试！')
                }
            });
        } else {      // 保存
            this.setState({editType: "save"})
        }
    };

    render() {
        const form = this.props.form;
        const {getFieldDecorator} = form;
        return (
            <div>
                <Row gutter={8}>
                    <Col span={1}>
                        <Button type="primary" shape="circle" icon="left" onClick={() => this.props.history.goBack()}/>
                    </Col>
                    <Col span={6}>
                        <h3>Edit News</h3>
                    </Col>
                </Row>
                <Divider/>
                <Form onSubmit={this.handleSubmit}>
                    {/* 标题 */}
                    <FormItem {...formItemLayout} label="Title">
                        {getFieldDecorator('title', {
                            rules: [{type: 'string'},
                                {required: true, message: '还没有标题呢!',}],
                        })(<Input/>)}
                    </FormItem>

                    {/* 标题 */}
                    <FormItem {...formItemLayout} label="Summary">
                        {getFieldDecorator('summary', {
                            rules: [{type: 'string'},
                                {required: true, message: '说好的概要呢？',}],
                        })(<Input/>)}
                    </FormItem>

                    {/* 缩略图 */}
                    <FormItem {...formItemLayout} label="Thumbnail"> {/* extra="Thumbnail"*/}
                        {getFieldDecorator('thumbnail', {
                            rules: [
                                {required: true, message: 'Please upload Image'},
                                {validator: this.imgValidator}
                            ],
                        })(
                            <ImageUploader
                                module='news'
                                isEditFlages={true}
                                onUploadedFile={this.handleUploadFile}
                                onUploading={this.handleUploading}
                            />
                        )}
                    </FormItem>

                    {/* 资讯内容 */}
                    <FormItem {...formItemLayout} label="Content">
                        {getFieldDecorator('content', {
                            rules: [{required: true, message: '还没有内容呢!',},
                                {validator: this.validateEditorFrom}],
                            initialValue: ''
                        })(
                            <Editor
                                ref={editor => this.editor = editor}
                                domId='editor_news'
                                module='news'
                                onEditorChange={(html) => form.setFieldsValue({'content': html})}
                            />
                        )}
                    </FormItem>
                    <FormItem wrapperCol={{span: 12, offset: 3}}>
                        <Button type="primary" htmlType="submit" size='large' style={{width: '10vw'}}>Submit</Button>
                    </FormItem>
                </Form>

            </div>
        )
    }
}

//创建Form组件并绑定表单元素\
const onFieldsChange = (props, fields) => {
    //console.log(fields);
};
const mapPropsToFields = (props) => {
    let {current} = props;
    if (!current) return;
    let formFileds = {};
    for (let key of Object.keys(current)) {
        if (key === 'thumbnail') {
            // 对应Upload的fileList 而且必须符合antd的格式规范才能正常显示
            let thumbnail = [{
                uid: '-1',
                name: current[key],
                status: 'done',
                url: `${Constant.imagePath}/news/${current[key]}`,
            }];
            formFileds[key] = Form.createFormField({value: thumbnail})
        } else {
            formFileds[key] = Form.createFormField({value: current[key]});
        }
    }
    return formFileds;
};
const mapStateToProps = (state) => {
    const {current} = state.newsReducer;
    return {current};
};
NewsEdit = Form.create({onFieldsChange, mapPropsToFields})(NewsEdit);
export default connect(mapStateToProps)(NewsEdit);

/*<Editor
    ref={editor => this.editor = editor}
    domId='editor_news'
    module='news'
    onEditorChange={ (html) => form.setFieldsValue({ 'content': html }) }
/>*/
/*<DraftEditor  ref={editor => this.editor = editor} onEditorChange={(html) => form.setFieldsValue({ 'content': html })}/>*/