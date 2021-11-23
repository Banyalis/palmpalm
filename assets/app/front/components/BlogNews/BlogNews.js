'use strict';

var Base = require('front/components/Base/Base');

var template = require('./BlogNews.jinja');
require('./BlogNews.scss');

module.exports = Base.extend({

    template: template,

    initialize: function (options) {
        this.options = options || {};

        app.utils.updateLinksAttributes(this.$el);

        Base.prototype.initialize.call(this, options);
    }
});
