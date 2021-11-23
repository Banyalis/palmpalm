'use strict';

const _ = require('underscore');
const Base = require('front/components/Base/Base');

require('./IndexVideo.scss');

module.exports = Base.extend({

    mainContentSelector: '.IndexVideo',

    //Base creates an instances for each one of found dom nodes (by selector) when parent view is rendered itself
    VIEWS_TO_REGISTER: {
    },

    events: {
    },

    initialize: function (options) {
        this.options = options || {};

        _.bindAll(this, 'onMouseMove', 'onParallaxRAF', 'updateTitleClonePos');

        this.title = this.$('.IndexVideo-title:not(.cloned)')[0];
        this.titleCloned = this.$('.IndexVideo-title.cloned')[0];
        this.video = this.$('video')[0];
        this.videoWrapper = this.$('.IndexVideo-video-wrapper')[0];
        this.gradient = this.$('.IndexVideo-gradient')[0];


        this.textSplitObj = app.utils.splitMultilineToSeparateSpans({
            $container: $(this.title),
            className: 'IndexVideo-title-line',
            autoWidth: true,
            transparent: false
        });

        this.textSplitObjCloned = app.utils.splitMultilineToSeparateSpans({
            $container: $(this.titleCloned),
            className: 'IndexVideo-title-line',
            autoWidth: true,
            transparent: false
        });

        this.$el.onCustom('screen-enter', () => {
            this.isInView = true;
            $(window).on('mousemove', this.onMouseMove);
        });

        this.$el.onCustom('screen-leave', () => {
            this.isInView = false;
            $(window).off('mousemove', this.onMouseMove);
        });

        this.$('.IndexVideo-video-inner').onCustom('screen-enter', () => {
            if (!this.isVideoShown) {
                this.isVideoShown = true;
                setTimeout(() => {
                    this.$('.IndexVideo-video-inner').addClass('shown');
                }, 100);
            }
            if (!this.video.getAttribute('src')) {
                this.updateVideoSrc(app.sizes.layout);
            }
            this.video.play();
        });

        this.$('.IndexVideo-video-inner').onCustom('screen-leave', () => {
            this.video.pause();
        });

        $(this.title).onCustom('screen-top', (e, data) => {
            if (!this.isInView) {
                return;
            }

            let top = app.sizes.windowHeight - data.screenTop;
            top = top / (app.sizes.windowHeight);

            if (top < 0.12 && this.isTitleShown) {
                this.isTitleShown = false;
                $(this.title).removeClass('shown');
                $(this.titleCloned).removeClass('shown');
            } else if (top > 0.12 && !this.isTitleShown) {
                this.isTitleShown = true;
                $(this.title).addClass('shown');
                $(this.titleCloned).addClass('shown');
            }

            top = 1 - Math.min(Math.max(top, 0), 1);

            const shiftFunc = (line, index) => {
                const shift = (index % 2 ? -1 : 1) * top * [30, 30, 50, 100, 40, 50][index];
                line.style.transform = `translate3d(${shift}%, 0, 0)`;
            };

            this.textSplitObj.lines.forEach(shiftFunc);
            this.textSplitObjCloned.lines.forEach(shiftFunc);
        });

        this.parallaxData = [{
            el: this.videoWrapper,
            curX: 0,
            curY: 0,
            velocity: 0,
            strength: 0.03
        }];

        app.vent.on('layout-switch', layout => {
            this.updateVideoSrc(layout);
        });

        app.vent.on('resize', this.updateTitleClonePos);

        this.updateTitleClonePos();

        Base.prototype.initialize.call(this, options);
    },


    updateTitleClonePos: function () {
        const videoWrapperRect = this.videoWrapper.getBoundingClientRect();
        const titleRect = this.title.getBoundingClientRect();
        const shiftX = titleRect.left - videoWrapperRect.left;
        const shiftY = titleRect.top - videoWrapperRect.top;

        this.titleCloned.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0)`;
        this.titleCloned.style.width = titleRect.width + 'px';
    },


    updateVideoSrc: function (layout) {
        const src = this.video.getAttribute('data-src-' + layout);
        this.video.setAttribute('src', src);
        this.video.load();
    },


    onMouseMove: function (e) {
        if (!app.settings.isDesktop) {
            return;
        }

        const dx = Math.round(e.screenX - app.sizes.windowWidth / 2);
        const dy = Math.round(e.screenY - app.sizes.windowHeight / 2);

        this.parallaxData.forEach((item) => {
            item.tarX = Math.round(dx * item.strength);
            item.tarY = Math.round(dy * item.strength);
        });

        const gradientAngle = -80 * dx / (app.sizes.windowWidth / 2);
        this.gradient.style.background =
        `linear-gradient(${gradientAngle}deg, #F3805E 0%, #FCC690 33%, #D4C79A 67%, #7CC9B0 100%)`;

        !this.parallaxData.rafId && (this.parallaxData.rafId = window.requestAnimationFrame(this.onParallaxRAF));
    },


    onParallaxRAF: function (time) {
        let equals = 0;
        const dat = this.parallaxData;

        this.parallaxData.forEach((item) => {
            let dist = Math.pow(Math.pow(item.curX - item.tarX, 2) + Math.pow(item.curY - item.tarY, 2), 0.5);
            let scale = app.utils.smoothDamp(0, dist, item, 300, 1000, this.prevTime ? (time - this.prevTime) : 1 / 60);
            scale /= dist;

            if (isNaN(scale) || scale > 1) {
                scale = 1;
            }

            item.curX = item.curX + (item.tarX - item.curX) * scale;
            item.curY = item.curY + (item.tarY - item.curY) * scale;

            if (Math.abs(item.curX - item.tarX) <= 0.001) {
                item.curX = item.tarX;
                equals++;
            }

            if (Math.abs(item.curY - item.tarY) <= 0.001) {
                item.curY = item.tarY;
                equals++;
            }

            item.el.style.transform = `translate3d(${item.curX}px, ${item.curY}px, 0)`;
        });


        this.updateTitleClonePos();

        this.prevTime = time;

        if (equals < dat.length * 2) {
            dat.rafId = window.requestAnimationFrame(this.onParallaxRAF);
        } else {
            dat.rafId = undefined;
            this.prevTime = undefined;
        }
    }
});
