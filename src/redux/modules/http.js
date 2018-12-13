import {get, post} from "../../utils/Tools";
import Qs from 'qs'
import {Constant} from "../../container/Constant";

const type = {
    REQUEST_DATA: 'REQUEST_DATA',
    RECEIVE_DATA: 'RECEIVE_DATA',
};

//easy-mock模拟数据接口地址
const MOCK_AUTH = Constant.host + '/auth';

const http = {
    // 管理员权限获取
    admin(params) {
        return post({url: MOCK_AUTH, data: Qs.stringify(params)})
    },
    // 访问权限获取
    guest(params) {
        return post({url: MOCK_AUTH, data: Qs.stringify(params)})
    },
};

const requestData = category => ({
    type: type.REQUEST_DATA,
    category
});
export const receiveData = (data, category) => ({
    type: type.RECEIVE_DATA,
    data,
    category
});
/**
 * 请求数据调用方法
 * @param funcName      请求接口的函数名
 * @param params        请求接口的参数
 */
export const fetchData = ({funcName, params, stateName}) => dispatch => {
    !stateName && (stateName = funcName);
    dispatch(requestData(stateName));
    return http[funcName](params).then(res => dispatch(receiveData(res, stateName)));
};

const handleData = (state = {isFetching: true, data: {}}, action) => {
    switch (action.type) {
        case type.REQUEST_DATA:
            return {...state, isFetching: true};
        case type.RECEIVE_DATA:
            return {...state, isFetching: false, data: action.data};
        default:
            return {...state};
    }
};

export const httpData = (state = {}, action) => {
    switch (action.type) {
        case type.RECEIVE_DATA:
        case type.REQUEST_DATA:
            return {
                ...state,
                [action.category]: handleData(state[action.category], action)
            };
        default:
            return {...state};
    }
};


const GIT_OAUTH = 'https://github.com/login/oauth';
export const gitOauthLogin = () => get(`${GIT_OAUTH}/authorize?client_id=792cdcd244e98dcd2dee&redirect_uri=http://localhost:3006/&scope=user&state=reactAdmin`);
export const gitOauthToken = code => post('https://cors-anywhere.herokuapp.com/' + GIT_OAUTH + '/access_token', {
    ...{
        client_id: '792cdcd244e98dcd2dee',
        client_secret: '81c4ff9df390d482b7c8b214a55cf24bf1f53059',
        redirect_uri: 'http://localhost:3006/',
        state: 'reactAdmin'
    }, code: code
}, {headers: {Accept: 'application/json'}})
    .then(res => res.data).catch(err => console.log(err));
export const gitOauthInfo = access_token => get('https://api.github.com/user?access_token=' + access_token)
    .then(res => res.data).catch(err => console.log(err));


export default {
    receiveData, fetchData, httpData, gitOauthInfo, gitOauthLogin, gitOauthToken,
}