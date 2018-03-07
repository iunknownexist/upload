// 未完待续


/**
 * tool
 * */
window.$_ = (function () {
    return {
        isObject: function (value) {
            if (value == undefined) {
                return false;
            }

            return Object.prototype.toString.call(value) === '[object Object]'
        },
        // 逻辑有问题
        extend: function (parent, child) {
            var obj = {};
            var key;

            for (key in parent) {
                if (!parent.hasOwnProperty(key)) {
                    continue;
                }

                if (typeof child[key] !== 'undefined') {
                    obj[key] = child[key];
                } else {
                    obj[key] = parent[key];
                }
            }

            return obj;
        }
    }
})();


window.tinyFileUpload = (function () {
    // 开始上传
    var startUpload = function (xhr, formData) {
        console.log('startUpload', formData);
        xhr.send(formData);
    };

    // 取消上传
    var cancelUpload = function (xhr) {
        xhr.abort();
    };


    // 默认配置
    var defaultOptions = {
        upload: '',
        data: {},
        headers: {},
        multiple: false,
        method: 'POST',
        //autoUpload: true,
        preview: function (data) {
            console.log('preview', data);
        },
        onSuccess: function (response) {
            console.log('onSuccess', response);
        },
        onFailure: function (response) {
            console.log('onFailure', response);
        },
        onChange: function () {
            console.log('onChange');
        },
        onProgress: function () {
            console.log('onProgress');
        },
        onAbort: function () {
            console.log('onAbort');
        }
    };


    return function (selector, options) {
        var _options = $_.extend(defaultOptions, options);

        var _ele = document.querySelectorAll(selector)[0];
        var _requestHeaders = _options.headers;
        // 上传时的额外数据
        var _data = _options.data;

        var uploading = false;
        var abort = false;

        var startTime,
            loaded = 0;

        var xhr = null;

        if (!_ele) {
            console.log('selector is invalid.');
            return false;
        }

        if (typeof XMLHttpRequest === 'undefined') {
            console.log('not suppose.');
            return false;
        }

        xhr = new XMLHttpRequest();
        xhr.open(_options.method, _options.upload);

        if ($_.isObject(_requestHeaders)) {
            for (var key in _requestHeaders) {
                if (_requestHeaders.hasOwnProperty(key)) {
                    xhr.setRequestHeader(key, _requestHeaders[key]);
                }
            }
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status.toString().indexOf('20') >= 0) {
                    typeof _options.onSuccess() === 'function' && _options.onSuccess(xhr.responseText);
                } else {
                    typeof _options.onFailure() === 'function' && _options.onFailure(xhr.responseText);
                }
            }
        };

        if (typeof _options.onProgress === 'function') {
            xhr.upload.onprogress =  _options.onProgress
        }

        //上传开始执行方法
        xhr.upload.onloadstart = function () {
            startTime = new Date().getTime();   //设置上传开始时间
            loaded = 0;//设置上传开始时，以上传的文件大小为0
        };

        var formData = new FormData();

        for (var name in _data) {
            if (!_data.hasOwnProperty(name)) { continue; }
            var value = _data[name];
            if (typeof value === 'function') { continue; }

            formData.append(name, value);
        }

        return {
            upload: function () {
                if (!uploading) {
                    uploading = true;
                    formData.append('file', _ele.files[0]);

                    startUpload(xhr, formData);
                }
            },
            abort: function () {
                if (!abort) {
                    abort = true;
                    cancelUpload(xhr);
                }
            }
        }
    }
})();

