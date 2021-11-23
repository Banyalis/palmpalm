'use strict';

const Base = require('front/components/Base/Base');

require('./Header.scss');

const ProductsPopup = require('front/components/ProductsPopup/ProductsPopup.js');

module.exports = Base.extend({

    VIEWS_TO_REGISTER: {
        'ProductsPopup': {selector: '.ProductsPopup', viewConstructor: ProductsPopup}
    },

    events: {
        'click .Header-menuItemButton': 'toggleProductsPopup',
        'click .Header-burger': 'toggleBurgerMenu'
    },

    initialize: function (options) {
        this.options = options || {};

        Base.prototype.initialize.call(this, options);

        if (window.location.pathname === '/') {
            this.$('.Header-logo').addClass('isDisable');
        }

        const productsPopup = this.$('.ProductsPopup');
        const productButton = this.$('.Header-menuItemButton');

        app.els.$document.on('click', function (e) {
            if (!productButton.is(e.target) && !productsPopup.is(e.target)
                && productsPopup.has(e.target).length === 0) {
                productButton.removeClass('isActive');
                productsPopup.removeClass('isShow');
            };
        });

        app.utils.updateLinksAttributes(this.$el);

        this.viewsRegistration();
    },

    toggleProductsPopup: function (e) {
        $(e.currentTarget).toggleClass('isActive');
        app.vent.trigger('openProductsPopup');
    },

    toggleBurgerMenu: function (e) {
        $(e.currentTarget).toggleClass('isActive');
        this.$('.Header-menuItem:first').toggleClass('isHide');

        app.vent.trigger('openBurgerMenu');
    },

    viewsRegistration: function () {
        Base.prototype.viewsRegistration.call(this);
    }
});
