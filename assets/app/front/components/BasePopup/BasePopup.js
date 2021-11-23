'use strict';

var _ = require('underscore/underscore');
var SubSection = require('front/pages/Section/SubSection');

var template = require('./BasePopup.jinja');
require('./BasePopup.scss');

var Utils = require('front/utils/Utils');

module.exports = SubSection.extend({
    template: template,

    el: '.BasePopup',

    mainContentSelector: '.BasePopup-wrapper',

    baseEvents: {
    },

    VIEWS_TO_REGISTER: {
    },

    apiUrl: function () {
        return undefined;
    },

    initialize: function (options) {
        SubSection.prototype.initialize.call(this, options);

        _.bindAll(this, 'apiUrl', 'keyDownOn', 'keyDownOff', 'onKeydown');

        if (options.server) {
            this.$el.hide();
            this.$el.addClass('isShow');
            this.$el.outerHeight();
            this.$el.show();
            this.triggerPopupShown();
            this.fromServer = true;

            this.data = {}; //prevent api call for data when opens from direct url
        }

        this.keyDownOn();
    },

    keyDownOn: function () {
        $(window).on('keydown', this.onKeydown);
    },

    keyDownOff: function () {
        $(window).off('keydown', this.onKeydown);
    },

    onKeydown: function (e) {
        if (e.keyCode === 27) {
            this.close();
        }
    },

    triggerPopupShown: function () {
        this.savedScroll = $(window).scrollTop();

        app.vent.trigger('PopupShown');
        if (window.app.settings.isSafari) {
            requestAnimationFrame(function () {
                $(window).scrollTop(0);
            });
        } else {
            $(window).scrollTop(0);
        }
    },

    triggerPopupHidded: function () {
        if (window.app.settings.isSafari) {
            $(window).scrollTop(this.savedScroll);
            app.vent.trigger('PopupHidded');
        } else {
            app.vent.trigger('PopupHidded');
            $(window).scrollTop(this.savedScroll);
        }
    },

    close: function () {
        app.router.navigateBack();
    },

    activate: function (params) {
        return SubSection.prototype.activate.call(this, params)
            .then(function () {
            }.bind(this));
    },

    playIn: function (params) {
        var self = this;

        clearTimeout(self.popupShowAnimationTimeout);

        if (this.options.inAnimated) {
            return new Promise(function (resolve) {
                if (params.duration) {
                    self.$el.outerHeight();
                    self.triggerPopupShown();

                    //to fix animation gliches while content load
                    self.popupShowAnimationTimeout = setTimeout(function () {
                        self.$el.addClass('isShow');
                    }, 220);
                } else {
                    self.$el.hide();
                    self.$el.addClass('isShow');
                    self.$el.outerHeight();
                    self.$el.show();
                    self.triggerPopupShown();
                    resolve();
                }
            });
        } else {
            self.onPopupShown();

            return Utils.createEmptyPromise();
        }
    },

    playOut: function (params) {
        var self = this;

        clearTimeout(self.popupShowAnimationTimeout);

        return new Promise(function (resolve) {
            self.$el.removeClass('isShow');

            if (params.duration) {
                app.utils.waitForTransitionEnd(self.$('.BasePopup-wrapper'), 'transform', function () {
                    self.triggerPopupHidded();
                    resolve();
                }.bind(this), params.duration);
            } else {
                self.triggerPopupHidded();
                resolve();
            }
        });
    },

    viewsRegistration: function () {
        SubSection.prototype.viewsRegistration.call(this);
    },

    destroy: function () {
        this.keyDownOff();

        return SubSection.prototype.destroy.call(this);
    },

    deactivate: function (params) {
        this.triggerPopupHidded();

        return SubSection.prototype.deactivate.call(this, params);
    }
});
