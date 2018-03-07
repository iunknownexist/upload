import session from 'express-session';
import connectRedis from 'connect-redis';

function installSession(app) {
    const RedisStore = connectRedis(session);

    app.set('trust proxy', 1);

    app.use(session({
        cookie: {
            maxAge: 2502000 * 1000 // eslint-disable-line no-magic-numbers
        },
        name: 'lbn_sid',
        secret: 'what are you thinking?',
        store: new RedisStore({
            ttl: 2502000,
            url: global.REDIS_URL
        }),
        saveUninitialized: false,
        resave: false
    }));
}

export default installSession;
