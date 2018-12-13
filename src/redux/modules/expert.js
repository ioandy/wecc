import axios from 'axios';
import {Constant} from '../../container/Constant';
import {ArrayUtil} from "../../utils/Tools";

const expertTypes = {
    GET_ONE: 'EXPERT_GET_ONE',
    LIST_ALL: 'EXPERT_LIST_ALL',
    SAVE: 'EXPERT_SAVE', // save and update
    PAGE_CHANGE: 'EXPERT_PAGE_CHANGE',
    HEADIMG_UPLOAD: 'EXPERT_HEADIMG_UPLOAD',
    HEADIMG_CANCEL: 'EXPERT_HEADIMG_CANCEL',
    HEADIMG_PREVIEW: 'EXPERT_HEADIMG_PREVIEW',

};

//const EditType = { SAVE: 'save', UPDATE: 'update'};

const initalState = {
    items: [],
    loading: true,
    expert: {},
    pagination: {
        total: 0,
        pageNum: parseInt(window.location.hash.slice(1), 0) || 1, //获取当前页面的hash值，转换为number类型,
        pageSize: 8,
    },
};

export const actions = {
    listAll: (dispatch, param, callback) => {
        return axios.get(`${Constant.host}/expert/list?start=${param.pageNum}&limit=${param.pageSize}`)
            .then(res => res.data)
            .then(json => {
                let content = json.content;
                dispatch({type: expertTypes.LIST_ALL, payload: content})
            })
            .then(() => {
                if (callback) callback();
            })
            .catch(ex => {
                console.error(ex);
            });
    },
    getOne: (expertId) => (dispatch, callback) => {
        return axios.get(`${Constant.host}/expert/one/${expertId}`)
            .then(res => res.data)
            .then(json => {
                let {code, content} = json;
                dispatch({type: expertTypes.GET_ONE, payload: {expert: content}});
                if (callback) {
                    callback(code, content);
                }
            })
            .catch(ex => {
                console.error(ex);
                if (callback) callback(ex.code)
            });
    },
    save: (dispatch, param, editType, callback) => {  // 根据editType选择保存类型 save/update
        axios.post(`${Constant.host}/expert/${editType}`, param)
            .then(res => res.data)
            .then(json => json.code)
            //更新后重新加载内容
            .then((code) => {
                dispatch({type: expertTypes.SAVE, payload: param});
                return code;
            })
            .then((code) => {
                if (callback) callback(code)
            })
            .catch(ex => {
                if (callback) callback(ex.code);  // 无论什么情况，都得关闭
            });
    },
    /* 缩略图控制 */
    handleHeadImgUploadChange: ({fileList}) => (dispatch) => {
        dispatch({type: expertTypes.HEADIMG_UPLOAD, payload: {fileList}});
        //this.setState({headimg:{fileList}})
    },
    handleCancel: (dispatch) => {
        dispatch({type: expertTypes.HEADIMG_CANCEL, payload: {previewVisible: false}})
    },
    handleHeadImgPreview: (file) => (dispatch) => {
        dispatch({
            type: expertTypes.HEADIMG_PREVIEW, payload: {
                previewImage: file.url || file.thumbUrl,
                previewVisible: true,
            }
        });
    }
};

export function expertReducer(state = initalState, action) {
    const {type, payload} = action;
    switch (type) {
        case expertTypes.GET_ONE:
            return ArrayUtil.updateObject(state, payload);
        case expertTypes.LIST_ALL:
            const nextState = {
                items: payload.list,
                loading: false,
                pagination: {
                    total: payload.total,
                    pageNum: payload.pageNum,
                    pageSize: payload.pageSize,
                }
            };
            return ArrayUtil.updateObject(state, nextState);
        case expertTypes.SAVE:
            return ArrayUtil.updateObject(state, {expert: payload});
        case expertTypes.HEADIMG_UPLOAD:
        case expertTypes.HEADIMG_CANCEL:
        case expertTypes.HEADIMG_PREVIEW:
            return ArrayUtil.updateObject(state, {headimg: {...state.headimg, ...action.payload}});
        default:
            return state;
    }
}