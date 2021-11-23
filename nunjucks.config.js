'use strict';

module.exports = function (env) {
    var staticPath = '/static/';

    if (typeof window !== 'undefined') {
        staticPath = window.app.settings.staticUrl;
    }

    env.addGlobal('static', function (file) {
        return staticPath + file;
    }, true);

    env.addGlobal('url', function (name, params) {
        params = params || {};

        return window.Urls[name].apply(null, params.args);
    }, true);

    env.addFilter('tojson', function (obj) {
        return JSON.stringify(obj);
    });

    env.addGlobal('debug', function (data) {
        console.log('nunjucks debug:', data);
    });

    env.addGlobal('debugjson', function (data) {
        console.log('nunjucks debug:', JSON.stringify(data));
    });
};


