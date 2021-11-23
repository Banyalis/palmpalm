'use strict';

// var _ = require('underscore');
const Base = require('front/components/Base/Base');

require('./CheckoutCard.scss');

const CommonInput = require('front/components/Common/CommonInput/CommonInput.js');

module.exports = Base.extend({

    VIEWS_TO_REGISTER: {
        'CommonInput': {selector: '.CommonInput', viewConstructor: CommonInput}
    },

    events: {
        'click .CheckoutCard-choiceButton': 'openData',
        'click .CheckoutCard-dataCancel': 'cancelData',
        'click. .c-checkbox-label': 'onShowBillingAddress'
    },

    initialize: function (options) {
        this.options = options || {};

        // _.bindAll(this, '');

        app.utils.updateLinksAttributes(this.$el);

        Base.prototype.initialize.call(this, options);
    },

    openData: function () {
        $('.Checkout-breadcrumbsItem').eq(1)
            .addClass('isActive');
        this.$('.CheckoutCard-choice').addClass('isHide');
        this.$('.CheckoutCard-data').addClass('isShow');
    },

    cancelData: function () {
        $('.Checkout-breadcrumbsItem').eq(1)
            .removeClass('isActive');
        this.$('.CheckoutCard-choice').removeClass('isHide');
        this.$('.CheckoutCard-data').removeClass('isShow');
    },

    onShowBillingAddress: function () {
        const $sectionBillingAddress = this.$('.CheckoutCard-dataFormSection--billing');

        if (this.$('.c-checkbox-input').prop('checked')) {
            $sectionBillingAddress.addClass('isShow');
        } else {
            $sectionBillingAddress.removeClass('isShow');
        }
    }
});
