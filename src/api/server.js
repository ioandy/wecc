import axios from 'axios';

//取消请求
// let CancelToken = axios.CancelToken
let RespStatus = {
    SUCCESS: 1,
    FAIL: 0,
};

var _axiox = axios.create({
    timeout: 15000,// 请求超时时间
    headers: {
        //'Content-Type': 'application/x-www-form-urlencoded'
    }
});

//开始请求设置，发起拦截处理
_axiox.interceptors.request.use(config => {
    /*//得到参数中的requestname字段，用于决定下次发起请求，取消相应的  相同字段的请求
    //post和get请求方式的不同，使用三木运算处理
    let requestName = config.method === 'post' ? config.data.requestName : config.params.requestName
    //判断，如果这里拿到上一次的requestName，就取消上一次的请求
    if(requestName) {
        if(axios[requestName]&&axios[requestName].cancel){
            axios[requestName].cancel()
        }
        config.cancelToken = new CancelToken(c => {
            axios[requestName] = {}
            axios[requestName].cancel = c
        })
    }*/
    return config
}, err => {
    console.error({message: '请求超时!'});
    return Promise.reject(err);
});

// respone拦截器
_axiox.interceptors.response.use(
    res => {
        //这里根据后台返回来设置
        if (res.status && res.status === 200 && res.data.code !== RespStatus.SUCCESS) {
            console.error({message: res.data.msg});
            return Promise.reject(res);
        }
        return res;
    },
    err => {
        if (err && err.response) {
            switch (err.response.status) {
                case 400:
                    err.message = '请求错误';
                    break;
                case 401:
                    err.message = '未授权，请登录';
                    break;
                case 403:
                    err.message = '拒绝访问';
                    break;
                case 404:
                    err.message = `请求地址出错: ${err.response.config.url}`;
                    break;
                case 408:
                    err.message = '请求超时';
                    break;
                case 500:
                    err.message = '服务器内部错误';
                    break;
                case 501:
                    err.message = '服务未实现';
                    break;
                case 502:
                    err.message = '网关错误';
                    break;
                case 503:
                    err.message = '服务不可用';
                    break;
                case 504:
                    err.message = '网关超时';
                    break;
                case 505:
                    err.message = 'HTTP版本不受支持';
                    break;
                default:
            }
        }
        console.error(err.message);
        return Promise.reject(err);
    }
);
export default _axiox;
