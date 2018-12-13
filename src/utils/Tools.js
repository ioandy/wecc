import axios from 'axios';
import {message} from 'antd';

/**
 * 公用get请求
 * @param url       接口地址
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */
export const get = ({url, msg = '接口异常', headers}) =>
    axios.get(url, headers)
        .then(res => res.data)
        .catch(err => {
            console.log(err);
            message.warn(msg);
        });

/**
 * 公用post请求
 * @param url       接口地址
 * @param data      接口参数
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */
export const post = ({url, data, msg = '接口异常', headers}) =>
    axios.post(url, data, headers)
        .then(res => res.data)
        .catch(err => {
            console.log(err);
            message.warn(msg);
        });

export const HttpUtil = {
    /**
     * location.href 跳转过来的请求，根据参数名称获取url参数。
     * @param name 参数名
     * @returns {*}
     */
    getUrlParam(qaram) {
        var reg = new RegExp("(^|&)" + qaram + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r !== null) return decodeURIComponent(r[2]);
        return null;
    },
    queryString() {
        let _queryString = {};
        const _query = window.location.search.substr(1);
        const _vars = _query.split('&');
        _vars.forEach((v, i) => {
            const _pair = v.split('=');
            if (!_queryString.hasOwnProperty(_pair[0])) {
                _queryString[_pair[0]] = decodeURIComponent(_pair[1]);
            } else if (typeof _queryString[_pair[0]] === 'string') {
                const _arr = [_queryString[_pair[0]], decodeURIComponent(_pair[1])];
                _queryString[_pair[0]] = _arr;
            } else {
                _queryString[_pair[0]].push(decodeURIComponent(_pair[1]));
            }
        });
        return _queryString;
    }
};

export const DateUtil = {
    /**
     * 将字符串解析成日期
     * @param str 输入的日期字符串，如'2014-09-13'
     * @param fmt 字符串格式，默认'yyyy-MM-dd'，支持如下：y、M、d、H、m、s、S，不支持w和q
     * @returns 解析后的Date类型日期
     */
    parseDate: function (str, fmt) {
        fmt = fmt || 'yyyy-MM-dd';
        var obj = {y: 0, M: 1, d: 0, H: 0, h: 0, m: 0, s: 0, S: 0};
        fmt.replace(/([^yMdHmsS]*?)(([yMdHmsS])\3*)([^yMdHmsS]*?)/g, function (m, $1, $2, $3, $4, idx, old) {
            str = str.replace(new RegExp($1 + '(\\d{' + $2.length + '})' + $4), function (_m, _$1) {
                obj[$3] = parseInt(_$1);
                return '';
            });
            return '';
        });
        obj.M--; // 月份是从0开始的，所以要减去1
        var date = new Date(obj.y, obj.M, obj.d, obj.H, obj.m, obj.s);
        if (obj.S !== 0) date.setMilliseconds(obj.S); // 如果设置了毫秒
        return date;
    },
};

export const StringUtil = {
    isEmpty: function (input) {
        return input === null || input === '';
    },
    isNotEmpty: function (input) {
        return !this.isEmpty(input);
    },
    isBlank: function (input) {
        return input === null || /^\s*$/.test(input);
    },
    isNotBlank: function (input) {
        return !this.isBlank(input);
    },
    isPositiveInteger: function (input) {//正整数
        return /^\+?(?:0|[1-9]\d*)$/.test(input);
    },
    trim: function (input) {
        return input.replace(/^\s+|\s+$/, '');
    }
};

export const ArrayUtil = {
    updateObject: function (oldObject, newValues) {
        // 用空对象作为第一个参数传递给 Object.assign，以确保是复制数据，而不是去改变原来的数据
        // //{...state,  ...action.payload};
        return Object.assign({}, oldObject, newValues);
    },
    replaceObjInList: function (list, replacement) {
        return list = list.map(t => {
            return t.id === replacement.id
                ? replacement
                : t;
        });
    },
    equals: function (a1, a2) {
        // if the other array is a falsy value, return
        if (!a1 || !a2)
            return false;

        // compare lengths - can save a lot of time
        if (a1.length !== a2.length)
            return false;

        for (var i = 0, l = this.length; i < l; i++) {
            // Check if we have nested arrays
            if (a1[i] instanceof Array && a2[i] instanceof Array) {
                // recurse into the nested arrays
                if (!a1[i].equals(a2[i]))
                    return false;
            }
            else if (a1[i] !== a2[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    },
};

export default {
    HttpUtil, StringUtil, ArrayUtil, DateUtil,
}


/*
const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};
*/
