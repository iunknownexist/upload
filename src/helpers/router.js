import { AsyncRouter as Router } from 'express-async-router';
import { Http404, Http401 } from './response';

const sender = (req, res, response) => {
    const isAjax = req.xhr;

    if (response.name === 'template') {
        return res.render(response.template, response.content);
    } else if (response.name === 'json') {
        return res.type(response.type).json(response.data);
    } else if (response.name === 'redirect') {
        return res.redirect(response.location);
    } else if (response === Http404) {
        if (isAjax) {
            return res.send({ status: false, err_msg: '页面未找到', data: {} });
        } else { // eslint-disable-line no-else-return
            return res.sendStatus(404); // eslint-disable-line no-magic-numbers
        }
    } else if (response === Http401) {
        if (isAjax) {
            return res.send({ status: false, err_msg: '无操作权限', data: {} });
        } else { // eslint-disable-line no-else-return
            return res.sendStatus(401); // eslint-disable-line no-magic-numbers
        }
    } else { // eslint-disable-line no-else-return
        return res.send(response);
    }
};

function AsyncRouter(options = {}) {
    if (!options.sender) {
        options.sender = sender;
    }

    return Router(options);
}

export default AsyncRouter;
