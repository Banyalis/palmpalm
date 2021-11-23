'use strict';

const _ = require('underscore');
const Base = require('front/components/Base/Base');

require('./ProductsPopup.scss');

module.exports = Base.extend({

    events: {
        'mouseover .ProductsPopup-menuItem': 'changeImage'
    },

    initialize: function (options) {
        this.options = options || {};

        _.bindAll(this, 'openDropdown');

        app.vent.on('openProductsPopup', this.openDropdown);

        app.utils.updateLinksAttributes(this.$el);

        Base.prototype.initialize.call(this, options);
    },

    openDropdown: function () {
        this.$el.toggleClass('isShow');
    },

    changeImage: function (e) {
        const image = $(e.currentTarget).data('image');
        const image2x = $(e.currentTarget).data('image2x');

        this.$('.ProductsPopup-image img').attr('src', image);
        this.$('.ProductsPopup-image source').attr('srcset', image + ', ' + image2x + ' 2x');
    }
});
