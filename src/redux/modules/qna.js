import axios from '../../api/server';
import {Constant, RespStatus} from '../../container/Constant';
import {ArrayUtil} from "../../utils/Tools";

const initalState = {
    items: [],
    loading: true,
    pagination: {
        total: 0,
        pageNum: parseInt(window.location.hash.slice(1), 0) || 1, //获取当前页面的hash值，转换为number类型,
        pageSize: 3,
    }
};

export const qnaTypes = {
    GET_ONE: 'QNA_GET_ONE',
    LIST_ALL: 'QNA_LIST_ALL',
    UPDATE: 'QNA_UPDATE',
};

export const actions = {
    listAll: (dispatch, param, callback) => {
        return axios.get(`${Constant.host}/qna/list?start=${param.pageNum}&limit=${param.pageSize}`)
            .then(res => res.data)
            .then(json => {
                let content = json.content;
                dispatch({type: qnaTypes.LIST_ALL, payload: content})
            })
            .then(() => {
                if (callback) callback();
            })
            .catch(ex => {
                console.error(ex);
                if (callback) callback(ex.code);
            });
    },
    getOne: (expertId) => (dispatch) => {
        return axios.get(`${Constant.host}/qna/one/${expertId}`)
            .then(res => res.data)
            .then(json => {
                let content = json.content;
                dispatch({type: qnaTypes.GET_ONE, payload: {item: content}})
            })
            .catch(ex => {
                console.error(ex);
            });
    },
    update: (dispatch, param, pagination, callback) => {
        axios.post(`${Constant.host}/qna/update`, param)
            .then(res => res.data)
            .then(json => json.code)
            //更新后重新加载内容 1.服务器刷新actions.listAll(dispatch, pagination)}) 2.本地list刷新。为保证更新后页面无跳动，当前使用方法2
            .then((code) => {
                if (code === RespStatus.SUCCESS) { //success
                    dispatch({type: qnaTypes.UPDATE, payload: param})
                } // fail 回调
                return code;
            })
            .then((code) => {
                if (callback) callback(code)
            })
            .catch(ex => {
                if (callback) callback(ex.code);  // 无论什么情况，都得关闭
            });
    }
};

export function qnaReducer(state = initalState, action) {
    const {type, payload} = action;
    switch (type) {
        case qnaTypes.GET_ONE:
            let item = {expert: payload.item};
            return ArrayUtil.updateObject(state, item);
        case qnaTypes.LIST_ALL:
            let data = {};
            if (payload) {
                data = {
                    items: payload.list,
                    loading: false,
                    pagination: {
                        total: payload.total,
                        pageNum: payload.pageNum,
                        pageSize: payload.pageSize,
                    }
                }
            }
            return ArrayUtil.updateObject(state, data);
        case qnaTypes.UPDATE:
            let oldList = [...state.items];
            const newList = ArrayUtil.replaceObjInList(oldList, payload);
            return ArrayUtil.updateObject(state, {items: newList});
        default:
            return state;
    }
}