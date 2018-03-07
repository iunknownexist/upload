const Http404 = {};

const Http401 = {};

/**
 * 渲染模板
 * @param template
 * @param context
 * @returns {{template: *, context: *, name: string}}
 */
function render(template, context) {
    return {
        template,
        context,
        name: 'template'
    };
}

/**
 * 返回json
 * @param data
 * @param type
 * @returns {{name: string, type: string, data: *}}
 */
function json(data, type = 'json') {
    return {
        name: 'json',
        type,
        data
    };
}

/**
 * 跳转链接
 * @param location
 * @returns {{name: string, location: *}}
 */
function redirect(location) {
    return {
        name: 'redirect',
        location
    };
}

export { render, json, redirect, Http404, Http401 };
