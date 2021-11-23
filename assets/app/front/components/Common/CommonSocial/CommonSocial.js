'use strict';

const Base = require('front/components/Base/Base');

require('./CommonSocial.scss');

module.exports = Base.extend({

    initialize: function (options) {
        this.options = options || {};

        app.utils.updateLinksAttributes(this.$el);

        Base.prototype.initialize.call(this, options);
    }
});
