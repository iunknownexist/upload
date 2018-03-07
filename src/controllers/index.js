import express from 'express';

const router = express.Router();


module.exports = function (app) {
    app.use('/', router);
};

router.get('/', function (request, response) {
    return response.render('index');
});
