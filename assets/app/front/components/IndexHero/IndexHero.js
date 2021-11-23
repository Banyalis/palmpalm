'use strict';

const _ = require('underscore');
const Base = require('front/components/Base/Base');

require('./IndexHero.scss');

const IndexHeroBottle = require('front/components/IndexHeroBottle/IndexHeroBottle');
const CommonSocial = require('front/components/Common/CommonSocial/CommonSocial.js');

module.exports = Base.extend({

    mainContentSelector: '.IndexHero',

    //Base creates an instances for each one of found dom nodes (by selector) when parent view is rendered itself
    VIEWS_TO_REGISTER: {
        'IndexHeroBottle': {selector: '.IndexHeroBottle', viewConstructor: IndexHeroBottle},
        'CommonSocial': {selector: '.CommonSocial', viewConstructor: CommonSocial}
    },

    events: {
        'mouseenter .IndexHero-order-aspect': 'onOrderMouseenter',
        'mousemove .IndexHero-order-aspect': 'onOrderMousemove',
        'mouseleave .IndexHero-order-aspect': 'onOrderMouseleave'
    },

    initialize: function (options) {
        this.options = options || {};

        _.bindAll(this, 'onScroll', 'onOrderMovementRAF');

        this.title = this.$('.IndexHero-title')[0];
        this.bottleWrapper = this.$('.IndexHero-bottle-wrapper')[0];

        this.textSplitObj = app.utils.splitMultilineToSeparateSpans({
            $container: this.$('.IndexHero-text'),
            className: 'IndexHero-text-line',
            autoWidth: true,
            transparent: true
        });

        this.orderData = {
            currentX: 0,
            currentY: 0,
            $wrapper: this.$('.IndexHero-order-wrapper'),
            $circle: this.$('.IndexHero-order-circle'),
            velocity: 0
        };

        this.$el.onCustom('screen-enter', () => {
            if (!this.shown) {
                this.shown = true;

                setTimeout(() => {
                    this.$(`
                        .IndexHero-bottle-wrapper,
                        .IndexHero-title,
                        .IndexHero-text,
                        .IndexHero-order,
                        .IndexHero-right .CommonSocial,
                        .IndexHero-left .IndexHero-logo,
                        .IndexHero-left .IndexHero-contacts
                    `).addClass('shown');

                    this.textSplitObj.makeSplit();

                    app.utils.animateTextByLines(this.textSplitObj, app.settings.animationDuration,
                        app.settings.animationDelay, null, false, 0, 366);
                }, 100);
            }

            app.vent.on('scroll', this.onScroll);
            this.$el.removeClass('paused');
            this.views.IndexHeroBottle.play();
        });

        this.$el.onCustom('screen-leave', () => {
            app.vent.off('scroll', this.onScroll);
            this.$el.addClass('paused');
            this.views.IndexHeroBottle.pause();
        });

        Base.prototype.initialize.call(this, options);
    },


    onScroll: function () {
        if (!this.fixedHidden && window.app.sizes.scrollTop > 50) {
            this.$('.IndexHero-right .CommonSocial, .IndexHero-left .IndexHero-contacts').addClass('hidden');
            this.fixedHidden = true;
        } else if (this.fixedHidden && window.app.sizes.scrollTop < 50) {
            this.$('.IndexHero-right .CommonSocial, .IndexHero-left .IndexHero-contacts').removeClass('hidden');
            this.fixedHidden = false;
        }

        if (app.sizes.layout !== 'phone') {
            const shiftTitle = Math.round(window.app.sizes.scrollTop * 0.7);
            const shiftBottleWrapper = Math.round(window.app.sizes.scrollTop * 0.5);

            this.title.style.transform = 'translate3d(0, ' + -shiftTitle + 'px, 0)';
            this.bottleWrapper.style.transform = 'translate3d(0, ' + -shiftBottleWrapper + 'px, 0)';
        }
    },


    onOrderMouseenter: function (e) {
        if (!app.settings.isDesktop) {
            return;
        }

        const dat = this.orderData;
        const radiusWrapper = dat.$wrapper.width() / 2;
        const radiusCircle = dat.$circle.width() / 2 * 1.13;//1.13 is for blur effect around cause all aspect wrapper has overflow

        dat.maxLen = radiusWrapper - radiusCircle;

        this.onOrderMousemove(e);

        !dat.rafId && (dat.rafId = window.requestAnimationFrame(this.onOrderMovementRAF));
    },


    onOrderMousemove: function (e) {
        if (!app.settings.isDesktop) {
            return;
        }

        const dat = this.orderData;
        const rect = e.currentTarget.getBoundingClientRect();

        dat.targetX = Math.round(e.clientX - rect.left - rect.width / 2);
        dat.targetY = Math.round(e.clientY - rect.top - rect.height / 2);

        const curLen = Math.pow(Math.pow(dat.targetX, 2) + Math.pow(dat.targetY, 2), 0.5);

        if (curLen > dat.maxLen) {
            const scale = dat.maxLen / curLen;
            dat.targetX *= scale;
            dat.targetY *= scale;
        }

        !dat.rafId && (dat.rafId = window.requestAnimationFrame(this.onOrderMovementRAF));
    },


    onOrderMouseleave: function () {
        if (!app.settings.isDesktop) {
            return;
        }

        const dat = this.orderData;

        dat.targetX = 0;
        dat.targetY = 0;

        !dat.rafId && (dat.rafId = window.requestAnimationFrame(this.onOrderMovementRAF));
    },


    onOrderMovementRAF: function (time) {
        const dat = this.orderData;

        let dist = Math.pow(Math.pow(dat.currentX - dat.targetX, 2) + Math.pow(dat.currentY - dat.targetY, 2), 0.5);
        let scale = app.utils.smoothDamp(0, dist, dat, 300, 10000, dat.prevTime ? (time - dat.prevTime) : 1 / 60);
        scale /= dist;

        if (isNaN(scale) || scale > 1) {
            scale = 1;
        }

        dat.prevTime = time;

        dat.currentX = dat.currentX + (dat.targetX - dat.currentX) * scale;
        dat.currentY = dat.currentY + (dat.targetY - dat.currentY) * scale;

        let equals = 0;

        if (Math.abs(dat.currentX - dat.targetX) <= 0.01) {
            dat.currentX = dat.targetX;
            equals++;
        }

        if (Math.abs(dat.currentY - dat.targetY) <= 0.01) {
            dat.currentY = dat.targetY;
            equals++;
        }

        dat.$wrapper.css('transform', `translate3d(${dat.currentX}px, ${dat.currentY}px, 0)`);

        if (equals < 2) {
            this.orderData.rafId = window.requestAnimationFrame(this.onOrderMovementRAF);
        } else {
            this.orderData.rafId = undefined;
            dat.prevTime = undefined;
        }
    }
});
