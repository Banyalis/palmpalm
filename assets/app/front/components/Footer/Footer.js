'use strict';

const Base = require('front/components/Base/Base');

require('./Footer.scss');

const CommonSocial = require('front/components/Common/CommonSocial/CommonSocial.js');

module.exports = Base.extend({

    VIEWS_TO_REGISTER: {
        'CommonSocial': {selector: '.CommonSocial', viewConstructor: CommonSocial}
    },

    initialize: function (options) {
        this.options = options || {};

        Base.prototype.initialize.call(this, options);

        app.utils.updateLinksAttributes(this.$el);
    }
});
