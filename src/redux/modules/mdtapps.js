import axios from 'axios';
import {Constant,} from '../../container/Constant';  //RespStatus
import {ArrayUtil} from "../../utils/Tools";

const initalState = {pagination: {pageSize: 8, current: 1, total: 0}, news: 0, loading: true,};

export const mdtappsTypes = {
    GET_ONE: 'MDTAPPS_GET_ONE',
    LIST_ALL: 'MDTAPPS_LIST_ALL',
    GET_NEWS: 'MDTAPPS_GET_NEWS',
    UPDATE_STATUS: 'MDTAPPS_UPDATE_STATUS',
    SHOW_MODAL: 'MDTAPPS_SHOW_MODAL',
    HIDE_MODAL: 'MDTAPPS_HIDE_MODAL',
};

export const actions = {
    listAll: (dispatch, pagination, params, callback) => {
        axios({
            method: 'post',
            headers: {'Content-type': 'application/json',},
            url: `${Constant.host}/mdtapps/listAll`,
            data: {start: pagination.current, limit: pagination.pageSize, ...params},
        })
            .then(res => res.data)
            .then(json => {
                dispatch({type: mdtappsTypes.LIST_ALL, payload: {pagination: pagination, content: json.content}});
            })
            .then(() => {
                if (callback) callback();
            })
            .catch(ex => {
                console.error(ex);
            });
    },
    getOne: (mdtappsId) => (dispatch) => {
        axios.get(`${Constant.host}/mdtapps/one/${mdtappsId}`)
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
        axios.get(`${Constant.host}/mdtapps/newMdtApps`)
            .then(res => res.data)
            .then(json => {
                let {code, content} = json;
                if (code === 1) {
                    dispatch({type: mdtappsTypes.GET_NEWS, payload: {news: content.length}})
                }
            })
            .catch(ex => {
                console.error(ex);
            });
    },
    update: (dispatch, model, pagination, callback) => {
        return axios.post(`${Constant.host}/mdtapps/update`, model)
            .then(res => res.data)
            .then(json => {
                if (callback) callback(json.code);
            })
            .then(() => actions.hideModal(dispatch))// 关闭modal
            .then(() => actions.listAll(dispatch, pagination))  //重新加载列表
            .then(() => actions.getNews(dispatch)) // 更新新预约提示
            .catch(ex => {
                console.error(ex);
            });
    },
    showModal: (dispatch, current) => {
        dispatch({type: mdtappsTypes.SHOW_MODAL, payload: {modalVisible: true, current}})
    },
    hideModal: (dispatch) => {
        dispatch({type: mdtappsTypes.HIDE_MODAL, payload: {modalVisible: false}})
    },
};

export function mdtappsReducer(state = initalState, action) {
    const {type, payload} = action;
    switch (type) {
        case mdtappsTypes.GET_ONE:
            return ArrayUtil.updateObject(state, action.item);
        case mdtappsTypes.LIST_ALL:
            const {content: {total, list}, pagination} = payload;
            const _pagination = {...state.pagination, ...pagination};
            _pagination.total = total;
            return ArrayUtil.updateObject(state, {loading: false, data: list, pagination: _pagination});
        case mdtappsTypes.GET_NEWS:
        case mdtappsTypes.SHOW_MODAL:
        case mdtappsTypes.HIDE_MODAL:
            return ArrayUtil.updateObject(state, payload);
        default:
            return state;
    }
}