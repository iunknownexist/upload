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
        isFunction: function (value) {
            return typeof value === 'function';
        },
        parseToString: function (value) {
            if (typeof value === 'string') {
                return value;
            }

            if (this.isObject(value)) {
                return JSON.stringify(value);
            }

            if (this.isFunction(value)) {
                return value.toString();
            }

            return '' + value;
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
        onError: null,
        //autoUpload: true,
        preview: function (data) {
            console.log('preview', data);
        },
        onResponse: null,
        onChange: null,
        onProgress: null,
        onAbort: null
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
            try {
                throw new TypeError('selector is invalid.');
            } catch (err) {
                if ($_.isFunction(_options.onError)) {
                    _options.onError(err.message);
                }
            }

            return;
        }

        if (typeof XMLHttpRequest === 'undefined') {
            try {
                throw new TypeError('not suppose.');
            } catch (err) {
                if ($_.isFunction(_options.onError)) {
                    _options.onError(err.message);
                }
            }

            return;
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
            var responseText = null;

            if (xhr.readyState === 4) {
                responseText = xhr.responseText;
                if ($_.isFunction(_options.onResponse)) {
                    _options.onResponse($_.isObject(responseText) ? responseText : JSON.parse(responseText));
                }
            }
        };

        if ($_.isFunction(_options.onProgress)) {
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
            if ($_.isFunction(value)) { continue; }

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

