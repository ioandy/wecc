import axios from 'axios';
import {Constant,} from '../../container/Constant';  //RespStatus
import {ArrayUtil} from "../../utils/Tools";

const newsTypes = {
    GET_ONE: 'NEWS_GET_ONE',
    LIST_ALL: 'NEWS_LIST_ALL',
    SAVE: 'NEWS_SAVE',  // save and update
    RESET: 'NEWS_RESET',
};

//const EditType = { SAVE: 'save', UPDATE: 'update'};

const initalState = {
    items: [],
    loading: false,
    pagination: {
        total: 0,
        pageNum: parseInt(window.location.hash.slice(1), 0) || 1, //获取当前页面的hash值，转换为number类型,
        pageSize: 8,
    },
    current: {}
};

export const actions = {
    listAll: (dispatch, param, callback) => {
        return axios.get(`${Constant.host}/news/listAll?start=${param.pageNum}&limit=${param.pageSize}`)
            .then(res => res.data)
            .then(json => {
                let content = json.content;
                dispatch({type: newsTypes.LIST_ALL, payload: content})
            })
            .then(() => {
                if (callback) callback();
            })
            .catch(ex => {
                console.error(ex);
            });
    },
    getOne: (dispatch, newsId, callback) => {
        return axios.get(`${Constant.host}/news/one/${newsId}`)
            .then(res => res.data)
            .then(json => {
                let {code, content} = json;
                dispatch({type: newsTypes.GET_ONE, payload: {current: content}});
                if (callback) {
                    callback(code, content);
                }
            })
            .catch(ex => {
                console.error(ex);
                if (callback) callback(ex.code)
            });
    },
    save: (dispatch, param, editType, callback) => {
        axios.post(`${Constant.host}/news/${editType}`, param)
            .then(res => res.data)
            .then(json => json.code)
            .then((code) => {
                if (callback) callback(code)
            })
            .catch(ex => {
                if (callback) callback(ex.code);  // 无论什么情况，都得关闭
            });
    },
    reset: (dispatch) => {
        dispatch({type: newsTypes.RESET});
    }

};

export function newsReducer(state = initalState, action) {
    const {type, payload} = action;
    switch (type) {
        case newsTypes.GET_ONE:
            return ArrayUtil.updateObject(state, payload);
        case newsTypes.LIST_ALL:
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
        case newsTypes.RESET:
            return ArrayUtil.updateObject(state, initalState);
        case newsTypes.SAVE:
        default:
            return state;
    }
}