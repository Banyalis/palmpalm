'use strict';

// const _ = require('underscore');
const Base = require('front/components/Base/Base');

var template = require('./BlogArticleHero.jinja');
require('./BlogArticleHero.scss');

module.exports = Base.extend({

    template: template,

    //Base creates an instances for each one of found dom nodes (by selector) when parent view is rendered itself
    VIEWS_TO_REGISTER: {},

    events: {},

    initialize: function (options) {
        this.options = options || {};

        Base.prototype.initialize.call(this, options);
    }
});
