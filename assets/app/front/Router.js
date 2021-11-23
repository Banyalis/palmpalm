'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var Section = require('front/pages/Section/Section');
var SubSectionDummy = require('front/pages/Section/SubSectionDummy');

var Index = require('front/pages/Index/Index');
var LoginPopup = require('front/pages/LoginPopup/LoginPopup');
var CartPopup = require('front/pages/CartPopup/CartPopup');
var Checkout = require('front/pages/Checkout/Checkout');
var Blog = require('front/pages/Blog/Blog');
var BlogArticle = require('front/pages/BlogArticle/BlogArticle');

var ANIMATION_DURATION = 500;

module.exports = Backbone.Router.extend({
    routes: {
        '': 'index',
        'sign-in(/)': 'loginPopup',
        'cart(/)': 'cartPopup',
        'checkout(/)': 'checkout',
        'blog(/)': 'blog',
        'blog(/:slug/)': 'blogArticle'
    },

    // checks if routes to another view (not one currently active) and reloads the page,
    // it's important for search requests, which can be made from any page, including search page by itself
    // route: function (route, name, callback) {
    //     var router = this;
    //     if (!callback) {
    //         callback = this[name];
    //     }

    //     var f = function () {
    //         var currentViewClass = app.state.currentViewClass;
    //         var forceReload = false;

    //         //execute route callback
    //         //try is for some views that can't render itself property in SPA mode (members for example)
    //         //so next code with reload wasn't executed
    //         try {
    //             callback.apply(router, arguments);
    //         } catch (error) {
    //             forceReload = true;
    //         }

    //         if (forceReload || (currentViewClass && currentViewClass !== app.state.currentViewClass)) {
    //             $('body').hide(); //prevent empty page render as SPA (reload doesn't refresh page immidiately)
    //             window.location.reload();
    //         } else {
    //             this.trackSPAPageView();
    //         }
    //     };

    //     return Backbone.Router.prototype.route.call(this, route, name, f);
    // },


    trackSPAPageView: function () {
        var loc = location.pathname + location.search + location.hash;

        this.visitedPages = this.visitedPages || {};

        //do not track first route, ga will track it by itself on initialization
        if (this.notFirstRoute && !this.visitedPages[loc]) {
            //simply set ga('send', 'pageview', [page]) is not recommended
            //because base url doesn't changed and all subsequent events (if any and if they are not pageview)
            //will fire for initial url on wivh page was loaded
            //https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications
            window.ga && window.ga('set', 'page', loc);
            window.ga && window.ga('send', 'pageview');
        }

        this.notFirstRoute = true;
        this.visitedPages[loc] = true;
    },


    index: function () {
        this.activate(Index, {view: SubSectionDummy, viewData: {}});
    },

    loginPopup: function () {
        if (!app.state.viewConstructor) {
            this.history.push(window.Urls['front:index']()); //back url for direct popup open
        }
        //set underlying page as current active page view, otherwise set default parent page for this popup
        this.activate(app.state.viewConstructor || Index, {view: LoginPopup, viewData: {
            state: 'login'
        }});
    },

    cartPopup: function () {
        if (!app.state.viewConstructor) {
            this.history.push(window.Urls['front:index']()); //back url for direct popup open
        }
        //set underlying page as current active page view, otherwise set default parent page for this popup
        this.activate(app.state.viewConstructor || Index, {view: CartPopup, viewData: {
            state: 'cart'
        }});
    },

    checkout: function () {
        this.activate(Checkout, {view: SubSectionDummy, viewData: {}});
    },

    blog: function () {
        this.activate(Blog, {view: SubSectionDummy, viewData: {}});
    },

    blogArticle: function () {
        this.activate(BlogArticle, {view: SubSectionDummy, viewData: {}});
    },

    navigateBack: function () {
        Backbone.history.navigate(this.history[this.history.length - 1], {trigger: 'true'});
        this.history.pop(); //pop, after Backbone.history.navigate onroute listener add return url to history stack, remove it
    },


    activate: function (view, params) {
        params = params || {};

        // view is rendered on server
        if (!app.state.view) {
            params.server = true;
            params.inAnimated = false;
            app.state.viewConstructor = view;
            app.state.view = new view(params);
            app.state.view.activate();
            app.state.currentViewClass = view;

            return;
        }

        app.state.prevView = app.state.view;
        //this.activateStandardLogic(view, params);
        //return;
        if (this.isSectionLogic(app.state.prevView, view, params)) {
            this.activateSectionLogic(params);
        } else {
            this.activateStandardLogic(view, params);
        }

        app.state.currentViewClass = view;
    },

    // navigation activation with full page reload with loader
    activateStandardLogic: function (view, params) {
        var newParams = _.defaults({server: false, inAnimated: true}, params);
        app.state.viewConstructor = view;

        var newView = new view(newParams);
        var duration = params.fastNavigate ? 0 : ANIMATION_DURATION;

        return Promise.all([app.state.view.playOut({duration: duration, zoom: params.zoomNavigate, view: newView}),
            newView.loadData()])
            .then(function () {
                app.els.$content.css({minHeight: app.els.$content.height()});

                return app.state.view.deactivate({destroy: true});
            })
            .then(function () {
                app.state.isServer = false;
                app.state.view = newView;
                app.state.view.activate(newParams)
                    .then(function () {
                        app.els.$content.css({minHeight: ''});
                        $(window).scrollTop(0);

                        return app.state.view.playIn({duration: duration, zoom: params.zoomNavigate, view: newView});
                    });
            });
    },

    // navigation activation with popup
    activateSectionLogic: function (subSectionParams) {
        var view = subSectionParams.view;
        var params = _.omit(subSectionParams, 'view');
        params.server = false;
        params.inAnimated = true;
        app.state.view.update(view, params);
        app.state.isServer = false;
    },


    isSectionLogic: function (prevView, view) {
        return app.state.prevView instanceof Section && app.state.prevView.constructor === view;
        //return app.state.prevView instanceof Section && view === Section;
    },


    onNeedReloadMessage: function (page) {
        this.needReloadPages = this.needReloadPages || {};

        this.needReloadPages[page] = true;
    },


    start: function () {
        var is404 = app.els.$body.hasClass('Page404');

        app.vent.on('need-reload', this.onNeedReloadMessage.bind(this));

        this.history = [];

        this.listenTo(this, 'route', function (name) {
            //do not store popup urls in history, to force popup close to underlying page
            //(even if there is a sequence of opened popups)
            if (/Popup$/.test(name)) {
                return;
            }

            this.history.push(Backbone.history.fragment);
        }.bind(this));


        //If you'd like to use pushState, but have browsers that don't support it natively
        //use full page refreshes instead, you can add {hashChange: false} to the options.
        //for ie 9 mainly
        Backbone.history.start({
            pushState: true,
            hashChange: false,
            silent: is404
        });

        if (is404) {
            this.notFound();
        }
    }
});
