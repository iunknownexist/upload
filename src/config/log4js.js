var log4js = require('log4js');

var logParams = {
    replaceConsole: false
};

if (global.LOG_PRINT === 1) {
    logParams.appenders = [
        {
            type: 'dateFile',
            absolute: true,
            filename: 'log/info.log',
            maxLogSize: 1024 * 1024, // eslint-disable-line no-magic-numbers
            pattern: '-yyyy-MM-dd',
            alwaysIncludePattern: true,
            category: 'info'
        },
        {
            type: 'dateFile',
            absolute: true,
            filename: 'log/error.log',
            maxLogSize: 1024 * 1024, // eslint-disable-line no-magic-numbers
            pattern: '-yyyy-MM-dd',
            alwaysIncludePattern: true,
            category: 'error'
        }
    ];
} else {
    logParams.appenders = [
        { type: 'console' } // 控制台
    ];
}


log4js.configure(logParams);

const logInfo = log4js.getLogger('info');
const logError = log4js.getLogger('error');


module.exports = {
    logInfo,
    logError
};
