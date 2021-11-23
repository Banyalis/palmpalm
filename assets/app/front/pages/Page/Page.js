'use strict';

var _ = require('underscore/underscore');
var Base = require('front/components/Base/Base');

var objectFitImages = require('object-fit-images');

module.exports = Base.extend({
    // page type for active menu item
    type: '',

    // page title
    title: undefined,


    initialize: function (options) {
        Base.prototype.initialize.call(this, options);

        this.$mainContent = this.$(this.mainContentSelector);

        if (this.$mainContent.length) {
            this.updateAnimationsList();
        }

        _.bindAll(this, 'onScrollForAnimation', 'onResizeThrottledForAnimation', 'onFontsLoaded', 'onScrollThrottledForAnimation');

        this.readyPromise = this.getReadyPromise();

        if (!this.options.view) {
            return;
        }
    },


    //override in descendants
    getReadyPromise: function () {
        return new Promise(function (resolve) {
            resolve();
        });
    },


    setTitle: function () {
        if (this.isSubSectionDummy) {
            return;
        }

        if (this.$el.attr('data-meta-title')) {
            document.title = this.$el.attr('data-meta-title');
        }
    },


    $parent: function () {
        return app.els.$content;
    },


    viewsRegistration: function () {
        Base.prototype.viewsRegistration.call(this);

        //set links classes: outer, tel, email, file, inner
        //its important for inner routing and for links styling
        //work both for popups and pages
        app.utils.updateLinksAttributes(this.$el);

        objectFitImages();
    },


    activate: function (params) {
        if (!this.isSubSectionDummy) {
            if (window.app.state.fontsLoaded) {
                setTimeout(this.onFontsLoaded, 17); //for runtime popups,to give time to be app.state.popupShown set to tue
            } else {
                window.app.vent.on('fonts-loaded', this.onFontsLoaded);
                this.fontLoadSafeTimeout = setTimeout(this.onFontsLoaded, 1000);
            }
        }

        return Base.prototype.activate.call(this, params).then(() => {
            if (!this.options.server) {
                this.setTitle();
            }


            if (!this.$mainContent.length) {
                this.$mainContent = this.$(this.mainContentSelector);
                this.updateAnimationsList();
            }
        });
    },


    deactivate: function (params) {
        app.vent
            .off('page-height-changed', this.onResizeThrottledForAnimation)
            .off('resize-throttled', this.onResizeThrottledForAnimation)
            .off('scroll-throttled', this.onScrollThrottledForAnimation)
            .off('resize-ended', this.onScrollForAnimation)
            .off('scroll', this.onScrollForAnimation);


        window.app.vent.off('fonts-loaded', this.onFontsLoaded);
        clearTimeout(this.fontLoadSafeTimeout);

        return Base.prototype.deactivate.call(this, params);
    },


    onFontsLoaded: function () {
        clearTimeout(this.fontLoadSafeTimeout);

        this.readyPromise.then(() => {
            app.vent
                .on('page-height-changed', this.onResizeThrottledForAnimation)
                .on('resize-throttled', this.onResizeThrottledForAnimation)
                .on('scroll-throttled', this.onScrollThrottledForAnimation)
                .on('resize-ended', this.onScrollForAnimation) //for text split object to have updated lines available on scroll listener
                .on('scroll', this.onScrollForAnimation);

            app.state.forceResize = true;
            $(window).resize();
        });
    },


    onResizeThrottledForAnimation: function () {
        this.updateAnimationsMetrics();

        this.updateAnimationsState({
            normal: true,
            throttled: true
        });
    },


    onScrollThrottledForAnimation: function () {
        this.updateAnimationsState({
            throttled: true
        });
    },


    onScrollForAnimation: function () {
        this.updateAnimationsState({
            normal: true
        });
    },


    //update list on animation block on page
    updateAnimationsList: function () {
        if (this.isSubSectionDummy) {
            return;
        }

        this.scrollItemsNormal = [];
        this.$mainContent.find('[data-scroll="normal"]').each(function (ind, item) {
            this.scrollItemsNormal.push({
                el: item,
                $el: $(item),
                offset: ($(item).attr('data-scroll-offset') - 0),
                screenPosition: -1,
                listeners: {
                    'screen-position': [],
                    'screen-bottom': [],
                    'screen-top': [],
                    'screen-enter': [],
                    'screen-leave': []
                }
            });

            //we will use custom trigger/on/off realization
            //cause jquery version (the one using dom) is too slow
            $(item).data('listeners', this.scrollItemsNormal[this.scrollItemsNormal.length - 1].listeners);
        }.bind(this));


        this.scrollItemsThrottled = [];
        this.$mainContent.find('[data-scroll="throttled"]').each(function (ind, item) {
            this.scrollItemsThrottled.push({
                el: item,
                $el: $(item),
                offset: ($(item).attr('data-scroll-offset') - 0),
                screenPosition: -1,
                listeners: {
                    'screen-position': [],
                    'screen-bottom': [],
                    'screen-top': [],
                    'screen-enter': [],
                    'screen-leave': []
                }
            });

            //we will use custom trigger/on/off realization
            //cause jquery version (the one using dom) is too slow
            $(item).data('listeners', this.scrollItemsThrottled[this.scrollItemsThrottled.length - 1].listeners);
        }.bind(this));


        this.lazyImgs = [];
        this.$mainContent.find('[data-lazy]').each(function (ind, item) {
            this.lazyImgs.push({
                el: item,
                $el: $(item)
            });
        }.bind(this));
    },


    //calc all animations block position on page relative (to compute fast their visibility on scrolling)
    updateAnimationsMetrics: function () {
        if (this.isSubSectionDummy) {
            return;
        }

        //update page or popup only if it is visible|active right now
        if ((this.isSection && app.state.popupShown) || (this.isSubSection && !app.state.popupShown)) {
            return;
        }

        const updatePos = (item) => {
            item.height = item.$el.height();
            item.top = item.$el.offset().top;
            item.visible = item.el.offsetWidth > 0;
        };

        this.scrollItemsNormal.forEach(updatePos);
        this.scrollItemsThrottled.forEach(updatePos);
        this.lazyImgs.forEach(updatePos);
    },


    //react animations on scroll (trigger or continuous)
    updateAnimationsState: function () {
        if (this.isSubSectionDummy) {
            return;
        }

        //update page or popup only if it is visible|active right now
        if ((this.isSection && app.state.popupShown) || (this.isSubSection && !app.state.popupShown)) {
            return;
        }

        var scrollTop = app.sizes.scrollTop;
        var windowHeight = app.sizes.windowHeight;
        var self = this;


        var triggerEvent = function (item, eventName, options) {
            var listeners = item.listeners[eventName];
            for (var i = 0 ; i < listeners.length; i++) {
                listeners[i]({}, options);
            }
        };

        const proceedScroll = function (item) {
            if (!item.visible) {
                return;
            }
            var screenPosition = (scrollTop - (item.top - windowHeight + item.offset)) /
                (item.height + windowHeight - item.offset);
            var screenPositionConstrained = Math.min(Math.max(screenPosition , 0), 1);
            var screenTop = item.top - scrollTop;
            var screenBottom = scrollTop + windowHeight - (item.top + item.height);

            if (item.screenPositionConstrained !== screenPositionConstrained) {
                triggerEvent(item, 'screen-position', {
                    $el: item.$el,
                    screenPosition: screenPositionConstrained,
                    screenTop: screenTop,
                    screenBottom: screenBottom,
                    height: item.height,
                    elTop: item.top

                });
                item.screenPositionConstrained = screenPositionConstrained;
            }

            triggerEvent(item, 'screen-top', {
                $el: item.$el,
                screenTop: screenTop,
                height: item.height
            });

            triggerEvent(item, 'screen-bottom', {
                $el: item.$el,
                screenBottom: screenBottom,
                height: item.height
            });

            if ((item.screenPosition < 0 && screenPosition >= 0) || (item.screenPosition > 1 && screenPosition <= 1)) {
                if (item['data-scroll-state'] !== 'enter') {
                    triggerEvent(item, 'screen-enter', {
                        $el: item.$el,
                        direction: (item.screenPosition < 0 && screenPosition >= 0) ? 'bottom' : 'top'
                    });

                    item['data-scroll-state'] = 'enter';
                }
            }

            if ((item.screenPosition >= 0 && screenPosition < 0) || (item.screenPosition <= 1 && screenPosition > 1)) {
                if (item['data-scroll-state'] !== 'leave') {
                    triggerEvent(item, 'screen-leave', {
                        $el: item.$el,
                        direction: (item.screenPosition >= 0 && screenPosition < 0) ? 'bottom' : 'top'
                    });

                    item['data-scroll-state'] = 'leave';
                }
            }

            item.screenPosition = screenPosition;
        };

        self.scrollItemsNormal.forEach(proceedScroll);
        self.scrollItemsThrottled.forEach(proceedScroll);


        self.lazyImgs.forEach(function (item) {
            if (item.loaded || !item.visible) {
                return;
            }

            if (item.top <= scrollTop + 1.5 * windowHeight) {
                item.$el.parent().find('source, img')
                    .each(function () {
                        var srcset = this.getAttribute('data-srcset');
                        var sizes = this.getAttribute('data-sizes');
                        var src = this.getAttribute('data-src');
                        srcset && this.setAttribute('srcset', srcset);
                        sizes && this.setAttribute('sizes', sizes);
                        src && this.setAttribute('src', src);
                    });

                item.loaded = true;

                objectFitImages(item.$el.find('img'));
            }
        });
    }
});
