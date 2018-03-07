
var stringReg = /[\s\S]+/;
var emptyReg = /[\s\S]*/;
var portReg = /^\d+$/;
var urlReg = /^([a-zA-Z0-9-]+.){1,}(com|net|edu|miz|biz|cn|cc)/;
var httpUrlReg = /^((http)|(https)|(ftp)){1}(:\/\/){1}/;
var nameReg = /^((dev)|(test)|(staging)|(prod)){1}$/;
var sentryReg = /^((http)|(https):\/\/){1}/;
var booleanReg = /^(1)|(0)$/;
var numberReg = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/;
var emailReg = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
var hostReg = /^([a-zA-Z\d]+\.){1,}([a-zA-Z\d])+$/;
var IPReg = /^(\d+\.){3,}\d+$/;
var redisReg = /^redis:\/\/[\s\S]+:\d+\/\d+$/;


module.exports = {

    string: function (envName, defaultValue) {
        var value = process.env[envName] ? process.env[envName] : defaultValue;

        if (value !== undefined && stringReg.test(value)) {
            return value;
        } else {
            console.log(envName + '匹配不对, 请重新设置正确的值, rule[string]');
            process.exit(1);
        }
    },

    port: function (envName, defaultValue) {
        var value = process.env[envName] ? process.env[envName] : defaultValue;

        if (value !== undefined && portReg.test(value)) {
            return value;
        } else {
            console.log(envName + '匹配不对, 请重新设置正确的值, rule[port]');
            process.exit(1);
        }
    },

    url: function (envName, defaultValue) {
        var value = process.env[envName] ? process.env[envName] : defaultValue;

        if (value !== undefined && urlReg.test(value)) {
            return value;
        } else {
            console.log(envName + '匹配不对, 请重新设置正确的值, rule[url]');
            process.exit(1);
        }
    },

    httpUrl: function (envName, defaultValue) {
        var value = process.env[envName] ? process.env[envName] : defaultValue;

        if (value !== undefined && httpUrlReg.test(value)) {
            return value;
        } else {
            console.log(envName + '匹配不对, 请重新设置正确的值, rule[httpUrl]');
            process.exit(1);
        }
    },

    name: function (envName, defaultValue) {
        var value = process.env[envName] ? process.env[envName] : defaultValue;

        if (value !== undefined && nameReg.test(value)) {
            return value;
        } else {
            console.log(envName + '匹配不对, 请重新设置正确的值, rule[name]');
            process.exit(1);
        }
    },

    sentry: function (envName, defaultValue) {
        var value = process.env[envName] ? process.env[envName] : defaultValue;

        if (value !== undefined && sentryReg.test(value)) {
            return value;
        } else {
            console.log(envName + '匹配不对, 请重新设置正确的值, rule[sentry]');
            process.exit(1);
        }
    },

    empty: function (envName, defaultValue) {
        var value = process.env[envName] ? process.env[envName] : defaultValue;

        if (value !== undefined && emptyReg.test(value)) {
            return value;
        } else {
            console.log(envName + '匹配不对, 请重新设置正确的值, rule[empty]');
            process.exit(1);
        }
    },

    staticUrl: function (envName, defaultValue) {
        var value = process.env[envName] ? process.env[envName] : defaultValue;

        if (value !== undefined && (emptyReg.test(value) || httpUrlReg.test(value))) {
            return value;
        } else {
            console.log(envName + '匹配不对, 请重新设置正确的值, rule[staticUrl]');
            process.exit(1);
        }
    },

    boolean: function (envName, defaultValue) {
        var value = process.env[envName] ? process.env[envName] : defaultValue;

        if (value !== undefined && booleanReg.test(value)) {
            return Number(value);
        } else {
            console.log(envName + '匹配不对, 请重新设置正确的值, rule[boolean]');
            process.exit(1);
        }
    },

    digits: function (envName, defaultValue) {
        var value = process.env[envName] ? process.env[envName] : defaultValue;

        if (value !== undefined && digitsReg.test(value)) {
            return value;
        } else {
            console.log(envName + '匹配不对, 请重新设置正确的值, rule[digits]');
            process.exit(1);
        }
    },

    number: function (envName, defaultValue) {
        var value = process.env[envName] ? process.env[envName] : defaultValue;

        if (value !== undefined && numberReg.test(value)) {
            return Number(value);
        } else {
            console.log(envName + '匹配不对, 请重新设置正确的值, rule[number]');
            process.exit(1);
        }
    },

    email: function (envName, defaultValue) {
        var value = process.env[envName] ? process.env[envName] : defaultValue;

        if (value !== undefined && emailReg.test(value)) {
            return value;
        } else {
            console.log(envName + '匹配不对, 请重新设置正确的值, rule[email]');
            process.exit(1);
        }
    },

    host: function (envName, defaultValue) {
        var value = process.env[envName] ? process.env[envName] : defaultValue;

        if (value !== undefined && hostReg.test(value)) {
            return value;
        } else {
            console.log(envName + '匹配不对, 请重新设置正确的值, rule[host]');
            process.exit(1);
        }
    },

    IP: function (envName, defaultValue) {
        var value = process.env[envName] ? process.env[envName] : defaultValue;

        if (value !== undefined && IPReg.test(value)) {
            return value;
        } else {
            console.log(envName + '匹配不对, 请重新设置正确的值, rule[IP]');
            process.exit(1);
        }
    },

    redis: function (envName, defaultValue) {
        var value = process.env[envName] ? process.env[envName] : defaultValue;

        if (value !== undefined && redisReg.test(value)) {
            return value;
        } else {
            console.log(envName + '匹配不对, 请重新设置正确的值, rule[redis]');
            process.exit(1);
        }
    }
};
