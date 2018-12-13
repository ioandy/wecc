import axios from '../../api/server';
//import Qs from 'qs'
import {Constant, RespStatus} from '../../container/Constant';

const initalState = {pagination: {pageSize: 8, current: 1, total: 0}, news: 0, loading: true,};

export const apptTypes = {
    APPT_GET_ONE: 'APPT_GET_ONE',
    APPT_LIST_ALL: 'APPT_LIST_ALL',
    GET_NEWS: 'APPT_GET_NEWS',
    UPDATE_STATUS: 'UPDATE_STATUS',
    SHOW_MODAL: 'APPT_SHOW_MODAL',
    HIDE_MODAL: 'APPT_HIDE_MODAL',
};

const apptResTypes = {1: 'briefs', 2: 'report',};

export const actions = {
    listAll: (dispatch, pagination, params, callback) => {
        axios({
            method: 'post',
            headers: {'Content-type': 'application/json',},
            url: `${Constant.host}/appt/listAll`,
            data: {start: pagination.current, limit: pagination.pageSize, ...params},
        })
            .then(res => res.data)
            .then(json => {
                dispatch({type: apptTypes.APPT_LIST_ALL, payload: {pagination: pagination, content: json.content}});
            })
            .then(() => {
                if (callback) callback();
            })
            .catch(ex => {
                console.error(ex);
            });
    },
    getOne: (apptId) => (dispatch) => {
        axios.get(`${Constant.host}/appt/one/${apptId}`)
            .then(res => res.data)
            .then(json => {
                //let item = {expert: content, headimg:{...state.headimg, ..._headimg }};
                //dispatch({type: expertTypes.APPT_GET_ONE, item})
            })
            .catch(ex => {
                console.error(ex);
            });
    },
    getNews: (dispatch) => {
        axios.get(`${Constant.host}/appt/newAppts`)
            .then(res => res.data)
            .then(json => {
                let {code, content} = json;
                if (code === 1) {
                    dispatch({type: apptTypes.GET_NEWS, payload: {news: content.length}})
                }
            })
            .catch(ex => {
                console.error(ex);
            });
    },
    update: (dispatch, model, pagination, callback) => {
        axios.post(`${Constant.host}/appt/update`, model)
            .then(res => res.data)
            .then(json => {
                const {code} = json;
                if (code === RespStatus.SUCCESS) {
                    dispatch({type: apptTypes.UPDATE_STATUS, payload: {current: model}});
                } else dispatch({});
                if (callback) callback(code);
            })
            //.then(() => actions.hideModal(dispatch))// 关闭modal
            .then(() => actions.listAll(dispatch, pagination))  //重新加载列表
            .then(() => actions.getNews(dispatch)) // 更新新预约提示
            .catch(ex => {
                console.error(ex);
                if (callback) callback(-1)
            });
    },
    showModal: (dispatch, current, callback) => {
        axios.get(`${Constant.host}/appt/res/list/${current.id}`)
            .then(res => res.data)
            .then(data => {
                const {code, content} = data;
                if (code === RespStatus.SUCCESS && content.length > 0) {
                    let _current = {...current};
                    content.map(item => {
                        _current[apptResTypes[item.type]] = item;
                    });
                    dispatch({type: apptTypes.SHOW_MODAL, payload: {modalVisible: true, current: _current}})
                } else {
                    dispatch({type: apptTypes.SHOW_MODAL, payload: {modalVisible: true, current}})
                }
            })
            .catch(ex => console.error(ex))

    },
    hideModal: (dispatch) => {
        dispatch({type: apptTypes.HIDE_MODAL, payload: {modalVisible: false}})
    },
};

export function apptReducer(state = initalState, action) {
    const {type, payload} = action;
    switch (type) {
        case apptTypes.APPT_GET_ONE:
            return updateObject(state, action.item);
        case apptTypes.APPT_LIST_ALL:
            const {content: {total, list}, pagination} = payload;
            const _pagination = {...state.pagination, ...pagination};
            _pagination.total = total;
            return updateObject(state, {loading: false, data: list, pagination: _pagination});
        case apptTypes.UPDATE_STATUS:
        case apptTypes.GET_NEWS:
        case apptTypes.SHOW_MODAL:
        case apptTypes.HIDE_MODAL:
            return updateObject(state, payload);
        default:
            return state;
    }
}

function updateObject(oldObject, newValues) {
    // 用空对象作为第一个参数传递给 Object.assign，以确保是复制数据，而不是去改变原来的数据
    // //{...state,  ...action.payload};
    return Object.assign({}, oldObject, newValues);
}