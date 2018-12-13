import axios from 'axios';
import {Constant} from '../../container/Constant';  //RespStatus
import {ArrayUtil} from "../../utils/Tools";

const knowledgeTypes = {
    GET_ONE: 'KNOWLEDGE_GET_ONE',
    LIST_ALL: 'KNOWLEDGE_LIST_ALL',
    SAVE: 'KNOWLEDGE_SAVE',  // save and update
    DELETE: 'KNOWLEDGE_DELETE',
    RESET: 'KNOWLEDGE_RESET',
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
        return axios.get(`${Constant.host}/knowledge/list?start=${param.pageNum}&limit=${param.pageSize}`)
            .then(res => res.data)
            .then(json => {
                let content = json.content;
                dispatch({type: knowledgeTypes.LIST_ALL, payload: content})
            })
            .then(() => {
                if (callback) callback();
            })
            .catch(ex => {
                console.error(ex);
            });
    },
    getOne: (dispatch, knowledgeId, callback) => {
        return axios.get(`${Constant.host}/knowledge/one/${knowledgeId}`)
            .then(res => res.data)
            .then(json => {
                let {code, content} = json;
                dispatch({type: knowledgeTypes.GET_ONE, payload: {current: content}});
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
        axios.post(`${Constant.host}/knowledge/${editType}`, param)
            .then(res => res.data)
            .then(json => json.code)
            .then((code) => {
                if (callback) callback(code)
            })
            .catch(ex => {
                if (callback) callback(ex.code);  // 无论什么情况，都得关闭
            });
    },
    delete: (dispatch, param, callback) => {
        axios.get(`${Constant.host}/knowledge/delete/${param}`)
            .then(res => res.data)
            .then(json => json.code)
            .then(code => {
                if (callback) callback(code)
            })
            .catch(ex => {
                if (callback) callback(ex.code);  // 无论什么情况，都得关闭
            });
    },
    reset: (dispatch) => {
        dispatch({type: knowledgeTypes.RESET});
    },
};

export function knowledgeReducer(state = initalState, action) {
    const {type, payload} = action;
    switch (type) {
        case knowledgeTypes.GET_ONE:
            return ArrayUtil.updateObject(state, payload);
        case knowledgeTypes.LIST_ALL:
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
        case knowledgeTypes.RESET:
            return ArrayUtil.updateObject(state, initalState);
        case knowledgeTypes.SAVE:
        case knowledgeTypes.DELETE:
        default:
            return state;
    }
}