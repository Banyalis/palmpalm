'use strict';

// var _ = require('underscore/underscore');
var Section = require('front/pages/Section/Section');

require('./Checkout.scss');

var CheckoutPayment = require('front/components/CheckoutPayment/CheckoutPayment');
var CheckoutCard = require('front/components/CheckoutCard/CheckoutCard');
var CheckoutOrder = require('front/components/CheckoutOrder/CheckoutOrder');

module.exports = Section.extend({

    el: '.Checkout',

    mainContentSelector: '.Checkout-content',

    events: {
    },

    VIEWS_TO_REGISTER: {
        'CheckoutPayment': {selector: '.CheckoutPayment', viewConstructor: CheckoutPayment},
        'CheckoutCard': {selector: '.CheckoutCard', viewConstructor: CheckoutCard},
        'CheckoutOrder': {selector: '.CheckoutOrder', viewConstructor: CheckoutOrder}
    },

    initialize: function (options) {
        this.options = options || {};

        // _.bindAll(this, '');

        Section.prototype.initialize.call(this, options);
    }
});
