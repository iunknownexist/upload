import express from 'express';

import glob from 'glob';
import path from 'path';
import bodyParser from 'body-parser';
import raven from 'raven';
import swig from 'swig';
import morgan from 'morgan';

import installSession from './middlewares/session';

import staticTag from './swig/static';

const app = express();

app.locals.ENV = global.NODE_ENV;
app.locals.ENV_DEV = (global.NODE_ENV === 'dev');


// view engine setup
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('view cache', false);
app.set('views', path.join(__dirname, '../views'));
swig.setDefaults({ cache: false });
swig.setDefaults({ loader: swig.loaders.fs(path.join(__dirname, '../views')) });

staticTag.init(swig);
app.use(morgan('combined'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '10mb'
}));

// middlewares
installSession(app);


if (global.SENTRY_API) {
    app.use(raven.middleware.express.requestHandler(global.SENTRY_API));
}

app.use('/' + global.STATIC_URL, express.static(path.join(__dirname, '../public')));

const controllers = glob.sync(path.join(__dirname, '../lib/controllers/**/*.js'));

controllers.forEach(function (controller) {
    require(controller)(app);
});

app.use(function (err, req, res, next) {
    res.locals.env = global.NODE_ENV;

    // treat as 404
    if (err.message && (err.message.indexOf('not found') >= 0 ||
        (err.message.indexOf('Cast to ObjectId failed') >= 0))) {
        return next();
    }

    if (req.xhr) {
        res.send({ code: 500, error: 'Inter error', err_name: 'codeStatusError' });
    } else {
        // eslint-disable-next-line no-magic-numbers
        res.status(500).render(path.join(__dirname, '../views/500'), { error: err.stack });
    }
});

app.use(function (req, res, next) {
    // eslint-disable-next-line no-magic-numbers
    res.status(404).render(path.join(__dirname, '../views/404'), {
        url: req.originalUrl,
        error: 'Not found'
    });
});

export default app;
