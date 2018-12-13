/***
 *统一api接口
 **/
import axios from 'server';

const HOST = 'http://localhost:9080'; //'http://192.168.2.6:9080';  //

export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${HOST}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
};
export const uploadFileRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${HOST}${url}`,
        data: params,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${HOST}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
};

export const deleteRequest = (url) => {
    return axios({
        method: 'delete',
        url: `${HOST}${url}`
    });
};

export const getRequest = (url) => {
    return axios({
        method: 'get',
        url: `${HOST}${url}`
    });
};
