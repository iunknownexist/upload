// 资讯

var express = require('express');
var swig = require('swig');
var request = require('../models/request');
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var router = express.Router();

module.exports = function (app) {
    app.use('/', router);
};


/**
 * 新建资讯和编辑资讯
 */
router.post('/upload', multipartMiddleware, function (req, res) { // eslint-disable-line max-len
    var formData = req.body;
    console.log('-------formData-------');
    console.log(formData);

    var file = req.files['file'];
    var path = file.path;
    var originalFilename = file.name;
    var extension = originalFilename.replace(/[\s\S]*\./g, '.');


    if (originalFilename) {
        if (!/png|jpe?g|gif/i.test(extension)) {
            return res.send(JSON.stringify({
                status: false,
                err_msg: '文件格式不正确，请上传文件格式为png、jpeg、jpg、gif的图片'
            }));
        }

        // 判断大小
        if (file.size > 1024 * 1024 * 5) { // eslint-disable-line no-magic-numbers
            return res.send(JSON.stringify({ status: false, err_msg: '上传的文件大小不能超过5M' }));
        }

        fs.readFile(path, 'base64', function read(err, data) {
            if (err) {
                res.send(JSON.stringify({ status: false, err_msg: '上传失败' }));
            } else {
                formData['file'] = data;
                // 存到本地
                return res.send(JSON.stringify({
                    state: true,
                    url: '/url'
                }));
            }
        });
    } else {
        return res.send(JSON.stringify({
            state: true
        }));
    }

});

