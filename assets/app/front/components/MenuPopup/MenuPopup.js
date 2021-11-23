'use strict';

const _ = require('underscore');
const Base = require('front/components/Base/Base');

require('./MenuPopup.scss');

module.exports = Base.extend({

    initialize: function (options) {
        this.options = options || {};

        _.bindAll(this, 'openMenu', 'triggerPopupShown', 'triggerPopupHidded');

        app.vent.on('openBurgerMenu', this.openMenu);

        Base.prototype.initialize.call(this, options);
    },

    openMenu: function () {
        this.$el.toggleClass('isShow');
    },

    triggerPopupShown: function () {
        this.savedScroll = app.els.$window.scrollTop();

        app.vent.trigger('PopupShown');
        app.els.$window.scrollTop(0);
    },

    triggerPopupHidded: function () {
        app.vent.trigger('PopupHidded');
        app.els.$window.scrollTop(this.savedScroll);
    }
});
