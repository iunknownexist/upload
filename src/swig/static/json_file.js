import _ from 'lodash'; // eslint-disable-line
import jsonfile from 'jsonfile';

const inMemoryCache = {};
const missing = {};

function loadJsonFile(fileName, cache_manifest = true) {

    let json = _.get(inMemoryCache, fileName, missing);

    if (json === missing) {
        try {
            json = jsonfile.readFileSync(fileName); // eslint-disable-line
        } catch (e) {
            json = {};
        }

        if (cache_manifest) {
            _.set(inMemoryCache, fileName, json);
        }
    }

    return json; // eslint-disable-line
}


function getManifestFn(type) {
    return function() {
        const json = loadJsonFile('./hash/' + type + '_hash.json', global.CACHE_MANIFEST);

        return _.transform(json, function (result, value, key) {
            result['/' + key] = '/assets/' + value;
        }, {});
    };
}

const cssHash = getManifestFn('css');
const jsHash = getManifestFn('js');
const imgHash = getManifestFn('img');


module.exports = {
    cssHash,
    jsHash,
    imgHash
};
