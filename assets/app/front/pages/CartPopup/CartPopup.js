'use strict';

var _ = require('underscore/underscore');
var BasePopup = require('front/components/BasePopup/BasePopup');

var template = require('./CartPopup.jinja');
require('./CartPopup.scss');

var CommonInputNumber = require('front/components/Common/CommonInputNumber/CommonInputNumber.js');

module.exports = BasePopup.extend({

    template: template,

    events: _.extend({
        'click .CartPopup-close': 'onCloseCart',
        'click .CartPopup-listItemRemove': 'onListItemRemove',
        'click .CartPopup-listItemUndoButton': 'onListItemUndoRemove'
    }, BasePopup.prototype.baseEvents),

    VIEWS_TO_REGISTER: {
        'CommonInputNumber': {
            selector: '.CommonInputNumber', viewConstructor: CommonInputNumber
        }
    },

    apiUrl: function () {
        return window.Urls['front:api:cart-popup']('json');
    },

    initialize: function (options) {
        // _.bindAll(this, '');

        this.options = options || {};

        BasePopup.prototype.initialize.call(this, options);
    },

    onCloseCart: function () {
        app.router.navigateBack();
    },

    onListItemRemove: function (e) {
        const $currentTarget = $(e.currentTarget).closest('.CartPopup-listItem');

        $currentTarget.addClass('isRemove');
    },

    onListItemUndoRemove: function (e) {
        const $currentTarget = $(e.currentTarget).closest('.CartPopup-listItem');

        $currentTarget.removeClass('isRemove');
    }
});
