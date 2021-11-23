'use strict';

var _ = require('underscore/underscore');
var BasePopup = require('front/components/BasePopup/BasePopup');

var template = require('./LoginPopup.jinja');
require('./LoginPopup.scss');

var CommonInput = require('front/components/Common/CommonInput/CommonInput.js');

module.exports = BasePopup.extend({

    template: template,

    events: _.extend({
        'click .LoginPopup-close': 'onCloseLogin'
    }, BasePopup.prototype.baseEvents),

    VIEWS_TO_REGISTER: {
        'CommonInput': {
            selector: '.CommonInput', viewConstructor: CommonInput
        }
    },

    apiUrl: function () {
        return window.Urls['front:api:login-popup']('json');
    },

    initialize: function (options) {
        // _.bindAll(this, '');

        this.options = options || {};

        BasePopup.prototype.initialize.call(this, options);
    },

    onCloseLogin: function () {
        app.router.navigateBack();
    }
});
