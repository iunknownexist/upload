try {
    require('dotenv').load({ silent: true });
} catch (error) {
    // eslint-disable-next-line no-console
    console.log('没有.env文件，将会从 process.env 中读取');
}

const extend = require('util')._extend;
let config = {};
const env = process.env.NODE_ENV;

if (!(/^(dev)|(prod)|(test)|(staging)$/).test(env)) {
    // eslint-disable-next-line no-console
    console.log('请先设置当前项目的运行环境 ' +
        '\n dev(开发) 或者 prod(生产) 或者 test(跑单元测试) 或者 staging(测试环境/仿真环境)' +
        '\n 设置方式可为设置环境变量 NODE_ENV=环境名称，或者在项目根目录下新建一个 .env 文件 在里面写上一行代码 NODE_ENV=环境名称' +
        '\n 格式（环境变量名称=值【没有引号】），比如 NODE_ENV=dev ');
    process.exit(1); // eslint-disable-line no-process-exit
}

switch (env) {
    case 'dev':
        config = extend(require('./env/dev'), require('./env/base'));
        break;
    case 'test':
        config = extend(require('./env/test'), require('./env/base'));
        break;
    case 'prod':
        config = extend(require('./env/prod'), require('./env/base'));
        break;
    case 'staging':
        config = extend(require('./env/staging'), require('./env/base'));
        break;
}

const reWrittenEnv = function (conf) {
    var envList = [];

    for (const o in conf) { // eslint-disable-line id-length, guard-for-in
        envList[envList.length] = o + '=' + conf[o] + '\n';
    }
};

if (env !== 'test') {
    reWrittenEnv(config);
}

for (const o in config) { // eslint-disable-line id-length, guard-for-in
    global[o] = config[o];
    process.env[o] = config[o];
}

exports.staus = true;
