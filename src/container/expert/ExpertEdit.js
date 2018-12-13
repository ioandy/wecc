import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux';
import {Form, Input, Tooltip, Icon, Button, Divider, Row, Col, message, Switch} from 'antd';  //Row, Col, Checkbox,Select, , AutoComplete,Cascader,

import Editor from '../../component/Editor';
import {Constant, RespStatus} from '../Constant';
import {HttpUtil} from "../../utils/Tools";

import {actions} from '../../redux/modules/expert';
import ImageUploader from "../../component/ImageUploader";

const FormItem = Form.Item;
//const Option = Select.Option;
const {TextArea} = Input;

class ExpertEdit extends Component {

    state = {
        editType: "update",
        uploading: false,
        isEditFlages: false,
    };
    /*
     * 提交保存
     */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let _values = {...values};
                if (values.resume) {
                    _values.resume = values.resume.replace('/^[ \\t]*\\n/g', '');
                }
                _values.headImg = values.headImg[0]['name'];
                let {dispatch, expert} = this.props;
                Object.assign(expert, _values);
                console.log('news : ', expert);
                actions.save(dispatch, expert, this.state.editType, (code) => {
                    if (code === RespStatus.SUCCESS) {
                        message.success("保存成功！");
                    } else {
                        message.success("网络异常，请稍后重试！");
                    }
                })
            }
        });
    };
    handleUsableChange = (item) => {
        actions.save(this.props.dispatch, item, 'update', (code) => {
            switch (code) {
                case RespStatus.SUCCESS:
                    message.success("状态更新成功！");
                    break;
                case RespStatus.FAIL:
                    message.warn("状态更新失败！");
                    break;
                default:
                    message.error("网络异常，请稍后重试！");
                    break;
            }
        })
    };
    handleUploadFile = (fileList) => {
        this.props.form.setFieldsValue({headImg: fileList})
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
        //let { search } = this.props.location;
        let expertId = HttpUtil.getUrlParam('id');
        //this.getExpert(expertId);
        if (expertId) {
            this.setState({editType: "update"});
            const {dispatch} = this.props;
            const editor = this.editor.editor;
            actions.getOne(expertId)(dispatch, (code, resp) => {
                if (code === RespStatus.SUCCESS) {
                    editor.txt.html(resp.resume); //手动设置富文本内容
                }
            });
        } else {
            this.props.form.resetFields();
            this.setState({editType: "save"})
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.expert.usable !== this.props.expert.usable) {
            //this.setState({ fileList:nextProps.value });
        }
    }

    render() {
        let {expert} = this.props;
        let {formItemLayout, tailFormItemLayout} = Constant;
        let form = this.props.form;
        let {getFieldDecorator} = form;
        return (
            <div ref={(node) => {
                this._div = node;
            }}>
                <Row gutter={16}>
                    <Col span={1}>
                        <Button type="primary" shape="circle" icon="left" onClick={() => this.props.history.goBack()}/>
                    </Col>
                    <Col span={6}>
                        <h3>Edit Expert</h3>
                    </Col>
                    <Col span={15} style={{textAlign: 'right'}}>
                        <Switch checkedChildren="启用" unCheckedChildren="禁用"
                                checked={expert.usable}
                                onChange={(checked) => {
                                    this.handleUsableChange({...expert, usable: checked})
                                }}/>
                    </Col>

                </Row>
                <Divider/>
                <Form style={{height: '70vh', overflowY: 'auto'}}
                      onSubmit={this.handleSubmit}>
                    <FormItem {...formItemLayout} label="Name">
                        {getFieldDecorator('name', {
                            initialValue: '',
                            rules: [{
                                type: 'string', message: 'The input is not valid Name!',
                            }, {required: true, message: 'Please input your Name',}],
                        })(
                            <Input/>
                        )}
                    </FormItem>

                    {/* 缩略图 */}
                    <FormItem {...formItemLayout} label="Thumbnail"> {/* extra="Thumbnail"*/}
                        {getFieldDecorator('headImg', {
                            rules: [
                                {required: true, message: 'Please upload head photo'},
                                {validator: this.imgValidator}
                            ],
                        })(
                            <ImageUploader
                                module='expert'
                                isEditFlages={true}
                                onUploadedFile={this.handleUploadFile}
                                onUploading={this.handleUploading}
                            />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout}
                              label={(
                                  <span>Position&nbsp;
                                      <Tooltip title="What do you want others to call you?">
                                        <Icon type="question-circle-o"/>
                                    </Tooltip>
                            </span>
                              )}
                    >
                        {getFieldDecorator('position', {
                            /*initialValue:this.props.expert.position || "",*/
                            rules: [{required: true, message: 'Please input your nickname!', whitespace: true}],
                        })(
                            <Input/>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="Hospital">
                        {getFieldDecorator('hospital', {
                            initialValue: '',
                            rules: [{
                                type: 'string', message: 'The input is not valid Hospital!',
                            }, {required: true, message: 'Please input your Hospital',}],
                        })(
                            <Input/>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="Fields">
                        {getFieldDecorator('fields', {
                            /*initialValue:this.props.expert.fields || "",*/
                            rules: [
                                {type: 'string', message: 'The input is not valid Fields!'},
                                {required: true, message: 'Please input your Fields'}
                            ],
                        })(
                            <TextArea rows={4}/>
                        )}
                    </FormItem>

                    <FormItem  {...formItemLayout} label="Resume">
                        {getFieldDecorator('resume', {
                            rules: [
                                {type: 'string', message: 'The input is not valid Resume!'},
                                {required: true, message: 'Please input your Resume'}
                            ],
                        })(<Editor
                            initalValue={this.props.expert.resume || ''}
                            ref={editor => this.editor = editor}
                            domId='editor_expert'
                            module='expert'
                            onEditorChange={(html) => form.setFieldsValue({'resume': html})}
                        />)}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">保存</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

/**/

//创建Form组件并绑定表单元素\
const onFieldsChange = (props, fields) => {
    //console.log(fields);
};

const mapPropsToFields = (props) => {
    let {expert} = props;
    if (!expert) return;
    let formFileds = {};
    for (let key of Object.keys(expert)) {
        if (key === 'headImg') {
            // 对应Upload的fileList 而且必须符合antd的格式规范才能正常显示
            let headImg = [{
                uid: '-1',
                name: expert[key],
                status: 'done',
                url: `${Constant.imagePath}/expert/${expert[key]}`,
            }];
            formFileds[key] = Form.createFormField({value: headImg})
        } else {
            formFileds[key] = Form.createFormField({value: expert[key]});
        }
    }
    return formFileds;
};


ExpertEdit = Form.create({onFieldsChange, mapPropsToFields})(ExpertEdit);
//把State转换成当前的Props
const mapStateToProps = (state) => {
    if (!state.expertReducer.item) {
        return state.expertReducer;
    }
    return {
        expert: state.expertReducer.item.expert,
        headimg: state.expertReducer.item.headimg,
        //editType: state.expertReducer.item.editType
    };
};
ExpertEdit = connect(mapStateToProps)(ExpertEdit);
export default withRouter(ExpertEdit);
