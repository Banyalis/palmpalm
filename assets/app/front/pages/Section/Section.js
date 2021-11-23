'use strict';

var _ = require('underscore/underscore');
var Page = require('front/pages/Page/Page');

var template = require('front/pages/Section/Section.jinja');
require('front/pages/Section/Section.scss');

var ANIMATION_DURATION = 500;

module.exports = Page.extend({

    template: template,

    //simultaneous show and hide of consecutive subviews
    collapseSubviewUpdatePlayInOut: false,

    //for subviews with equal constructor enables/disables appearance animation
    noAnimationOnEqualSubviews: false,


    initialize: function (options) {
        this.isSection = true;

        Page.prototype.initialize.call(this, options);

        var view = this.options.view;
        this.registerView('view', new view(_.defaults(this.options.viewData, {inAnimated: false, server: this.options.server})));
        this.$content = this.$('.Section-content');
    },


    render: function () {
        var result = Page.prototype.render.call(this);
        this.$content = this.$('.Section-content');

        return result;
    },


    viewsRegistration: function () {
        Page.prototype.viewsRegistration.call(this);

        //this.registerView('indexIntro', new IndexIntro());
    },


    activate: function () {
        return Page.prototype.activate.call(this);
            //.then(function () {
            //    if (self.options.inAnimated)
            //        return self.playIn();
            //});
    },

    update: function (view, params) {
        var prevView = this.getView('view');
        this.options.viewData = params.viewData;
        var newView = new view(_.defaults(this.options.viewData, {inAnimated: true, server: false}));
        this.registerView('view', newView);

        var noAnimOnEqualSubviews = prevView.constructor === newView.constructor && newView.noAnimationOnEqualSubviews;

        var duration = params.fastNavigate ? 0 : ANIMATION_DURATION;

        if (noAnimOnEqualSubviews) {
            this.loadData()
                .then(function () {
                    return newView.activate();
                })
                .then(function () {
                    return prevView.playOut({duration: 0, view: newView});
                })
                .then(function () {
                    return prevView.deactivate({destroy: true});
                })
                .then(function () {
                    return newView.playIn({duration: 0, view: newView});
                });
        } else {
            if (this.collapseSubviewUpdatePlayInOut) {
                this.loadData()
                    .then(function () {
                        return newView.activate();
                    })
                    .then(function () {
                        return Promise.all([prevView.playOut({duration: duration, view: newView}),
                            newView.playIn({duration: duration, zoom: params.zoomNavigate, view: newView})]);
                    })
                    .then(function () {
                        return prevView.deactivate({destroy: true});
                    });
            } else {
                Promise.all([prevView.playOut({duration: duration, view: newView}), this.loadData()])
                    .then(function () {
                        return prevView.deactivate({destroy: true});
                    })
                    .then(function () {
                        return newView.activate();
                    })
                    .then(function () {
                        return newView.playIn({duration: duration, view: newView});
                    });
            }
        }
    },


    deactivate: function (options) {
        return Page.prototype.deactivate.call(this, options);
    },


    loadData: function () {
        return Promise.all([Page.prototype.loadData.call(this), this.getView('view').loadData()]);
    }
});
