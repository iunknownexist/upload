var env = require('../../../tool');

module.exports = {
    PORT: env.port('PORT', 3000), // eslint-disable-line no-magic-numbers
    NODE_ENV: env.name('NODE_ENV'),
    STATIC_DIR: env.string('STATIC_DIR', 'public'),
    STATIC_URL: env.staticUrl('STATIC_URL', ''),
    STATIC_FILES_OUTPUT: env.string('STATIC_FILES_OUTPUT', 'assets'),
    SITE_TITLE: env.string('SITE_TITLE', 'File Upload'),
    LOG_PRINT: env.boolean('LOG_PRINT', 0)
};
