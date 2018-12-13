import React from 'react'; //, {PropTypes} Tooltip,Popconfirm, const FormItem = Form.Item; Form,
import {Icon, Button, Upload, Modal, message} from 'antd';
import Cropper from 'react-cropper';
import axios from 'axios';
import lrz from 'lrz'
import '../../node_modules/cropperjs/dist/cropper.css';
import {Constant} from "../container/Constant";
import {convertBase64ToBlob} from "../utils/ImageUtil";

const UploadStatus = {
    PRE_UPLOAD: 1, UPLOAD: 2, PREVIEW: 3, REMOVE: 4, DONE: 5, AFTER_DONE: 6,
};

class ImageUploader extends React.Component {
    state = {
        srcCropper: '',
        previewImage: '',
        previewVisible: false,
        submitting: false,
        editImageModalVisible: false,
        selectedImageFile: '',
        selectImgName: '',
        selectImgSize: 0,
        selectImgSuffix: '',
        status: UploadStatus.PRE_UPLOAD,
        fileList: [{
            uid: '-1',
            name: 'xxx.png',
            status: 'done',
            url: `${Constant.imagePath}/public/template.jpg`,
        }]
    };
    handlePreview = (file) => {
        this.setState({
            status: UploadStatus.PREVIEW,
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };
    handlePreviewCancel = () => {
        this.setState({previewVisible: false,});
    };
    handleUploadCancel = () => {
        this.setState({
            editImageModalVisible: false,
            selectImgName: "",
        }, () => {
            this.handleImgRemove(this.state.selectedImageFile);
        });
    };
    // 1.上传之前加载 beforeUpload
    beforeUpload = (file) => {
        // 文件大于限制
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error({content: '文件大小不能超过10M'});
            return false;
        }
        // 正在上传
        if (this.state.submitting) {
            return false;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file); //开始读取文件
        // 因为读取文件需要时间,所以要在回调函数中使用读取的结果
        const self = this;
        this.setState({status: UploadStatus.PRE_UPLOAD});
        reader.onload = (e) => {
            console.log('e.target.result', file);
            //3.把handleChange储存在state中的文件转化成能读取的URL.
            const dataURL = e.target.result;
            //4.把之前存的图片传进来, 读取, 读取完毕设置上src, 用于render -> <Cropper/>
            self.setState({
                srcCropper: dataURL,
                selectImgName: file.name,
                selectImgSize: (file.size / 1024 / 1024),
                selectImgSuffix: file.type.split("/")[1],
                editImageModalVisible: true,
            })
        };
        return false;
    };
    //2.将上传的文件暂存在state中
    handleChange = ({file, fileList}) => {
        console.log('fileList', fileList);
        const newState = {
            selectedImageFile: file,
            fileList,
        };
        switch (this.state.status) {
            case UploadStatus.PRE_UPLOAD:
                newState.editImageModalVisible = true;
                break;
            case UploadStatus.PREVIEW:
                newState.editImageModalVisible = true;
                break;
            case UploadStatus.REMOVE:
                newState.editImageModalVisible = false;
                break;
            default:
                newState.editImageModalVisible = false;
                break;
        }
        this.setState(newState);
        console.log(this.state);
    };
    //4.保存 -> 压缩
    handleSave = () => {
        this.setState({status: UploadStatus.UPLOAD});
        console.log('srcCropper', this.state.selectImgSize);
        var qualityVal = 1.0, initVal = Number(this.state.selectImgSize);
        if (initVal > 0.2 && initVal < 1) {
            qualityVal = 0.8
        } else if (initVal >= 1 && initVal < 3) {
            qualityVal = 0.4
        } else if (initVal >= 3 && initVal < 5) {
            qualityVal = 0.2
        } else if (initVal >= 5) {
            qualityVal = 0.1
        }
        console.info("====> 开始压缩");
        // this.refs.cropper.getCroppedCanvas().toBlob(async blob => {  // 这里post上传图片  });
        lrz(this.refs.cropper.getCroppedCanvas().toDataURL(), {quality: qualityVal})
            .then((results) => {
                if (results.base64) {
                    const data = convertBase64ToBlob(results.base64);
                    console.info("====> 压缩完成，开始上传");
                    let url = `${Constant.imageUploadPath(this.props.module)}`;
                    this.handleUpload(url, data);
                }
            })
            .catch((err) => { // 压缩处理失败
                console.error("====> 压缩失败：" + err);
            })
            .always(function () {
                // 不管是成功失败，都会执行
            });
    };
    // 5.上传 data : file/blob
    handleUpload = async (url, data) => {
        if (!this.state.submitting) {
            // 拿到文件名
            let filename = this.state.selectedImageFile.name;
            // 创造提交表单数据对象
            const formData = new FormData();
            // 添加要上传的文件
            formData.append('file', data, filename);
            // 上传图片
            try {
                let msgImageLoading = message.loading("正在上传图片...");
                this.props.onUploading({uploading: true});
                // 提示开始上传
                this.setState({submitting: true});
                // 拿到服务器返回的数据
                const resp = await axios.post(url, formData);
                const {errno, data} = resp.data;
                if (errno === 0) {
                    console.info("====> 上传成功!");
                    msgImageLoading();
                    message.success("图片上传成功!");
                    this.props.onUploadedFile([{
                        uid: -1, name: filename, status: 'done', url: data[0]
                    }]);

                } else {
                    console.info("====> 上传失败");
                    message.success("图片上传失败!");
                }
            } catch (err) {
                console.info("====> 上传失败：" + err);
                message.error('error!');
            } finally {
                //   提示上传完毕 关闭弹窗
                this.setState({status: UploadStatus.DONE, submitting: false,});
                this.props.onUploading({uploading: false});
                this.onModalClose();
            }
        }
    };
    handleImgRemove = (file) => {
        this.setState({status: UploadStatus.REMOVE, submitting: false,});
        this.props.onUploadedFile([]);
    };
    onModalClose = () => {
        this.setState({editImageModalVisible: false});
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.fileList) {
            this.setState({fileList: nextProps.value});
        }
    }

    render() {
        const {previewVisible, previewImage, fileList, editImageModalVisible, srcCropper, submitting} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">上传</div>
            </div>
        );
        return (
            <div>
                <Upload
                    fileList={fileList || []}
                    className="clearfix"
                    listType="picture-card"//上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card
                    accept="image/*"
                    onRemove={this.handleImgRemove}
                    beforeUpload={this.beforeUpload}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    showUploadList={true}
                >
                    {fileList.length > 0 ? null : uploadButton}
                </Upload>
                <span style={{display: submitting ? 'block' : 'none', color: 'red'}}>注意: 图片上传需保存活动信息后才能上传</span>
                <Modal visible={previewVisible} footer={null} onCancel={this.handlePreviewCancel}
                       key="img_yulan_modal_key">
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
                <Modal
                    // title="图片裁剪"
                    onCancel={this.handleUploadCancel}
                    key="cropper_img_modal_key"
                    visible={editImageModalVisible}
                    width={1000}
                    footer={[
                        <Button key='btn1' type="primary" onClick={this.handleSave}>保存</Button>,
                        <Button key='btn2' onClick={this.handleUploadCancel}>取消</Button>
                    ]}
                >
                    <Cropper
                        // ref={cropper => this.cropper = cropper}
                        /* aspectRatio={1 / 1}*/
                        ref="cropper"
                        style={{'height': 480, width: '480'}}
                        src={srcCropper}
                        className="company-logo-cropper"
                        viewMode={1}
                        zoomable={false}
                        guides={true}
                        background={false} //是否显示马赛克
                        rotatable={true} //是否旋转
                        checkOrientation={true}
                        preview='.cropper-preview'
                    />
                </Modal>
            </div>
        )
    }
}

export default ImageUploader;