/* eslint max-len: 0 */

var rp = require('request-promise');
var log = require('../config/log4js');


module.exports = function (opts) {
    opts.formData = opts.formData || {};

    rp.post({
        uri: global.BASE_URL + opts.api,
        formData: opts.formData,
        headers: {
            Authorization: 'Bearer ' + opts.access_token
        }
    })
    .then(JSON.parse)
    .then(function (resp) {
        if (global.LOG_PRINT === 1) {
            if (resp.err_code) {
                log.logInfo.warn(opts.api, ' 参数', JSON.stringify(opts.formData), '\t 返回', JSON.stringify(resp));
                log.logError.warn(opts.api, ' 参数', JSON.stringify(opts.formData), '\t 返回', JSON.stringify(resp));
            } else {
                log.logInfo.info(opts.api, ' 参数', JSON.stringify(opts.formData), '\t 返回', JSON.stringify(resp));
            }
        } else {
            if (resp.err_code) { // eslint-disable-line no-lonely-if
                log.logError.warn(opts.api, ' 参数', JSON.stringify(opts.formData), '\t 返回', JSON.stringify(resp));
            }
        }

        return resp;
    })
    .then(function (resp) {
        if (resp.err_code) {
            resp.err_code = Number(resp.err_code);
        }

        return opts.callback(resp);
    })
    .catch(function (e) {
        log.logError.error(opts.api, ' 参数', JSON.stringify(opts.formData), '\n', e, '\n');

        return opts.callback({
            status: false,
            err_msg: '连接到服务器失败，请稍后再试',
            err_code: 500,
            data: {}
        });
    });
};
