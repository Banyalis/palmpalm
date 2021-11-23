'use strict';

const _ = require('underscore');
const Base = require('front/components/Base/Base');

require('./IndexNews.scss');

const CommonCursor = require('front/components/Common/CommonCursor/CommonCursor');

module.exports = Base.extend({

    VIEWS_TO_REGISTER: {
        'CommonCursor': {selector: '.CommonCursor', viewConstructor: CommonCursor}
    },

    events: {
        'mouseenter .IndexNews-listItem': 'onMouseEnter',
        'mousemove .IndexNews-listItem': 'onMouseMove',
        'mouseleave .IndexNews-listItem': 'onMouseLeave'
    },

    initialize: function (options) {
        this.options = options || {};

        this.$el.onCustom('screen-enter', () => {
            if (!this.isNewsShown) {
                this.isNewsShown = true;

                setTimeout(() => {
                    this.$el.removeClass('isInitialState');
                }, 100);
            }
        });

        this.$('.IndexNews-listItem').onCustom('screen-enter', (e, data) => {
            if (!Number(data.$el.data('shown'))) {
                data.$el[0].setAttribute('data-shown', 1);

                setTimeout(() => {
                    data.$el.removeClass('isInitialState');
                }, 100);
            }
        });

        _.each(this.$('.IndexNews-listItem'), (item) => {
            $(item).onCustom('screen-position', (e, data) => {
                const parallaxStrength = Math.pow(data.screenPosition * 0.5, 2) * 0.3;
                const shift = (window.app.sizes.scrollTop + window.app.sizes.windowHeight - data.elTop)
                * parallaxStrength;

                data.$el.css({
                    'transform': 'translate3d(0, ' + -shift + 'px, 0)'
                });
            });
        });

        this.moveImage.__throttled = _.throttle(this.moveImage.bind(this), 30);

        app.utils.updateLinksAttributes(this.$el);

        Base.prototype.initialize.call(this, options);
    },

    onMouseEnter: function (e) {
        if (app.settings.isMobile) {
            return;
        }

        const $currentTarget = $(e.currentTarget);
        const $newsImage = $currentTarget.find('.IndexNews-listItemImage');

        $newsImage.removeClass('disableTransform');
    },

    onMouseMove: function (e) {
        this.moveImage.__throttled(e);
    },

    moveImage: function (e) {
        const $currentTarget = $(e.currentTarget);
        const $newsImage = $currentTarget.find('.IndexNews-listItemImage');

        const pos = $currentTarget.offset();
        const x = pos.left;
        const y = pos.top;
        const w = $currentTarget.width();
        const h = $currentTarget.height();

        const mx = e.pageX;
        const my = e.pageY;

        const dx = (mx - x) / w;
        const dy = (my - y) / h;

        $newsImage.css('transform', 'translate(' + dx * 20 + 'px, ' + dy * 10 + 'px) scale(.95)');
    },

    onMouseLeave: function (e) {
        if (app.settings.isMobile) {
            return;
        }

        const $currentTarget = $(e.currentTarget);
        const $newsImage = $currentTarget.find('.IndexNews-listItemImage');

        $newsImage.addClass('disableTransform');
    }
});
