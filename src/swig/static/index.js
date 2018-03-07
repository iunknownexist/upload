import jsonHash from './json_file';
import staticTag from './tag-static';

// eslint-disable-next-line no-magic-numbers
const staticURL = '/' + global.STATIC_URL;

exports.init = function (swig) {
    swig.setExtension('static', function (input) {
        let hashList = {},
            inputPath = input,
            output = inputPath;

        const isJs = (/(\.js)$/).test(inputPath);
        const isCss = (/(\.(scss|css))$/).test(inputPath);

        if (isJs) {
            hashList = jsonHash.jsHash();
        } else if (isCss) {
            hashList = jsonHash.cssHash();
            inputPath = inputPath.replace(/(\.scss)$/, '.css');
        } else {
            hashList = jsonHash.imgHash();
        }

        if (hashList[inputPath]) {
            output = staticURL + hashList[inputPath];
        } else if (global.NODE_ENV === 'dev' && isCss || isJs) {
            output = staticURL + inputPath;
        } else {
            output = staticURL + inputPath;
        }

        return output;
    });

    swig.setTag('static', staticTag.parse, staticTag.compile, staticTag.ends, staticTag.blockLevel);
};
