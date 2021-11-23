'use strict';

// var _ = require('underscore');
const Base = require('front/components/Base/Base');

require('./CheckoutPayment.scss');

module.exports = Base.extend({

    initialize: function (options) {
        this.options = options || {};

        // _.bindAll(this, '');

        app.utils.updateLinksAttributes(this.$el);

        Base.prototype.initialize.call(this, options);
    }
});
