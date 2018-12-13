const _host = 'http://localhost:9080/weappt';
//process.env.NODE_ENV === 'production'
//? 'http://wxservice.drwatson.ai:9080/weappt'
//: 'http://localhost:9080/weappt';

export const Constant = {
    host: _host,
    request_timeout: {timeout: 1000 * 15},
    imagePath: _host + '/images',
    imageUploadPath: (module) => `${_host}/${module}/image/upload`,
    formItemLayout: {
        labelCol: {
            xs: {span: 24},
            sm: {span: 4},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 18},
        },
    },
    tailFormItemLayout: {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 16,
                offset: 4,
            },
        },
    },
};

export const RespStatus = {SUCCESS: 1, FAIL: 0,};

export default {Constant, RespStatus};
