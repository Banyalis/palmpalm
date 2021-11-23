'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var Utils = require('front/utils/Utils');

//Base component, most other views are inherider from it
//can render itself and control the child components
module.exports = Backbone.View.extend(_.extend({}, Backbone.Events, {

    showLoader: false,

    initialize: function (options) {
        this.options = options || {};

        //storade for child views
        this.views = {};

        if (this.options.server === false) {
            this.setElement($(''));
        }
    },

    isRendered: function () {
        return !!this.$el.length;
    },

    $parent: function () {
        return null;
    },

    attach: function () {
        var $parent = this.$parent();
        if ($parent) {
            $parent.append(this.$el);
        }
    },

    renderData: function () {
        return this.data || {};
    },

    render: function () {
        var data = this.renderData();
        data.viewOptions = this.options;

        this.setElement(this.template.render(data));
        this.attach();

        return this;
    },

    activate: function () {
        this.viewName && $('html').attr('data-activeView', this.viewName);


        return this.loadData()
            .then(function () {
                if (!this.isRendered() || this.$el.parents('html').length === 0) {
                    this.render();
                }

                this.viewsRegistration();
            }.bind(this))
            .then(function () {
                // activate child view
                var promise = Utils.createEmptyPromise();

                if (this.views) {
                    promise = Promise.all(_.map(this.views, function (view) {
                        return view.activate();
                    }));
                }

                return promise;
            }.bind(this));
    },

    deactivate: function (params) {
        params = params || {};

        var promise = Utils.createEmptyPromise();

        if (this.views) {
            promise = Promise.all(_.map(this.views, function (view) {
                return view.deactivate(params);
            }));
        }

        return promise.then(function () {
            if (params.destroy) {
                this.destroy();
            }
        }.bind(this));
    },

    destroy: function () {
        this.undelegateEvents();
        this.$el.removeData().unbind();
        this.remove();
    },

    viewsRegistration: function () {
        var viewsToRegister = this.VIEWS_TO_REGISTER || {};

        //create an individual instances of all listed inside VIEWS_TO_REGISTER items
        _.each(viewsToRegister, function (params, viewName) {
            let itemIndex = 0;
            this.$(params.selector).each(function (ind, item) {
                //skip if found inside popup content when we are searching only for page content
                if ($(item).closest('.Section-content').length && this.$el.hasClass('Section')) {
                    return;
                }
                var data = {el: item};
                this.registerView(viewName + (itemIndex ? ' ' + itemIndex : ''), new params.viewConstructor(data));
                itemIndex++;
            }.bind(this));
        }.bind(this));
    },

    registerView: function (viewName, view) {
        view.parent = this;
        this.views[viewName] = view;

        return view;
    },

    addView: function (view) {
        this.views.push(view);
    },

    getView: function (viewName) {
        return this.views[viewName];
    },

    destroyView: function (viewName) {
        this.views[viewName].destroy();
        delete this.views[viewName];
    },

    //to override in descendants
    proceedDataOnLoad: function (data) {
        this.data = data;
    },


    onDataLoadStart: function () {
        if (!this.showLoader) {
            return;
        }

        if (this.isLoading) {
            return;
        }

        this.isLoading = true;

        this.loaderTimeout = setTimeout(function () {
            $('.PopupLoader').addClass('PopupLoader--visible');
        }, 500);
    },


    onDataLoadEnd: function () {
        if (!this.showLoader) {
            return;
        }

        if (!this.isLoading) {
            return;
        }

        this.isLoading = false;

        clearTimeout(this.loaderTimeout);

        $('.PopupLoader').removeClass('PopupLoader--visible');
    },


    forceLoadData: function (apiUrl) {
        var api;
        var apiUrl;
        var self = this;
        apiUrl = apiUrl || this.apiUrl;

        if (apiUrl) {
            api = _.isFunction(apiUrl) ? apiUrl() : apiUrl;

            self.onDataLoadStart();

            return Promise.resolve($.getJSON(api)
                .then(function (data) {
                    this.proceedDataOnLoad(data);
                    self.onDataLoadEnd();
                }.bind(this))
                .fail(function () {
                    console.log('Data load error');
                    self.onDataLoadEnd();
                    app.router.navigateBack();
                }));
        } else {
            return Utils.createEmptyPromise();
        }
    },

    loadData: function () {
        var apiUrl = _.isFunction(this.apiUrl) ? this.apiUrl() : this.apiUrl;

        if (!this.data && apiUrl) {
            if (!this.disableCache) {
                //is caching is allowed then cache it and return
                if (window.app.cache[apiUrl] !== undefined) {
                    this.data = window.app.cache[apiUrl];

                    return Utils.createEmptyPromise();
                }

                return this.forceLoadData(apiUrl)
                    .then(function () {
                        window.app.cache[apiUrl] = this.data;
                    }.bind(this));
            } else {
                return this.forceLoadData(apiUrl);
            }
        } else {
            return Utils.createEmptyPromise();
        }
    },

    //method for animation logic on component activation
    playIn: function () {
        // empty Promise, signal that method is done his work
        return Utils.createEmptyPromise();
    },

    //method for animation logic on component deactivation
    playOut: function () {
        // empty Promise, signal that method is done his work
        return Utils.createEmptyPromise();
    }
}));
