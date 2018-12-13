import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Form, Input, Button, Divider, Row, Col, message} from 'antd';

import Editor from '../../component/Editor';
import {Constant, RespStatus} from '../Constant'
import {HttpUtil} from "../../utils/Tools";
import {actions} from '../../redux/modules/knowledge';
import ImageUploader from "../../component/ImageUploader";

const FormItem = Form.Item;

class KnowledgeEdit extends Component {

    state = {
        editType: "update",
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
                _values.banner = values.banner[0]['name'];
                let {dispatch, current} = this.props;
                Object.assign(current, _values);
                console.log('knowledge : ', current);
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
            }
        });
    };
    handleUploadFile = (fileList) => {
        this.props.form.setFieldsValue({banner: fileList})
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

    componentDidMount() {
        let itemId = HttpUtil.getUrlParam('id');
        if (itemId) {  // 编辑
            this.setState({editType: "update"});
            const {dispatch} = this.props;
            const editor = this.editor.editor;
            actions.getOne(dispatch, itemId, (code, resp) => {
                if (code === RespStatus.SUCCESS) {
                    editor.txt.html(resp['content']); //手动设置富文本内容
                } else {
                    message.warn('加载内容失败，请重试！')
                }
            });
        } else {      // 保存
            this.props.form.resetFields();
            this.setState({editType: "save"})
        }
    };

// 页面卸载初始化redux-state状态，解决页面切换 state仍然保存上一个状态的问题
    componentWillUnmount() {
        actions.reset(this.props.dispatch);
    };

    render() {
        const {formItemLayout, tailFormItemLayout} = Constant;
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return (
            <div>
                <Row gutter={8}>
                    <Col span={2}>
                        <Button type="primary" shape="circle" icon="left" onClick={() => this.props.history.goBack()}/>
                    </Col>
                    <Col span={6} style={{textAlign: 'left'}}>
                        <h3>Edit Knowledge</h3>
                    </Col>
                </Row>
                <Divider/>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem {...formItemLayout} label="标题">
                        {getFieldDecorator('title', {
                            rules: [{type: 'string'},
                                {required: true, message: '还没有标题呢!',}],
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    {/* 缩略图 */}
                    <FormItem {...formItemLayout} label="Banner"> {/* extra="Thumbnail"*/}
                        {getFieldDecorator('banner', {
                            rules: [
                                {required: true, message: 'Please upload Image'},
                                {validator: this.imgValidator}
                            ],
                        })(
                            <ImageUploader
                                module='knowledge'
                                isEditFlages={true}
                                onUploadedFile={this.handleUploadFile}
                                onUploading={this.handleUploading}
                            />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="内容">
                        {getFieldDecorator('content', {
                            rules: [{
                                required: true, message: '还没有内容呢!',
                            }, {// 使用自定义的校验规则
                                validator: this.validateEditorFrom
                            }],
                            initialValue: ''
                        })(<Editor
                                ref={editor => this.editor = editor}
                                domId='editor_knowledge'
                                module='knowledge'
                                onEditorChange={(html) => form.setFieldsValue({'content': html})}
                            />
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
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
        if (key === 'banner') {
            // 对应Upload的fileList 而且必须符合antd的格式规范才能正常显示
            let banner = [{
                uid: '-1',
                name: current[key],
                status: 'done',
                url: `${Constant.imagePath}/knowledge/${current[key]}`,
            }];
            formFileds[key] = Form.createFormField({value: banner})
        } else {
            formFileds[key] = Form.createFormField({value: current[key]});
        }
    }
    return formFileds;
};
const mapStateToProps = (state) => {
    const {current} = state.knowledgeReducer;
    return {current};
};
KnowledgeEdit = Form.create({onFieldsChange, mapPropsToFields})(KnowledgeEdit);
export default connect(mapStateToProps)(KnowledgeEdit);