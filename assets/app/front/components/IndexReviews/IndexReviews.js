'use strict';

const _ = require('underscore');
const Base = require('front/components/Base/Base');

require('./IndexReviews.scss');

const Swiper = require('swiper/swiper-bundle.min');
require('swiper/swiper.scss');

const CommonCursor = require('front/components/Common/CommonCursor/CommonCursor');

module.exports = Base.extend({

    VIEWS_TO_REGISTER: {
        'CommonCursor': {selector: '.CommonCursor', viewConstructor: CommonCursor}
    },

    events: {
        'mouseover .IndexReviews-sliderAreaPrev': 'onAreaPrev',
        'mouseover .IndexReviews-sliderAreaNext': 'onAreaNext',
        'mouseleave .IndexReviews-sliderArea': 'onMouseLeave'
    },

    initialize: function (options) {
        this.options = options || {};

        _.bindAll(this, 'reviewsSlider');

        this.reviewsSlider();

        this.$cursor = this.$('.CommonCursor');

        Base.prototype.initialize.call(this, options);
    },

    onAreaPrev: function () {
        this.$cursor.removeClass('isNext').addClass('isPrev');
        this.$('.swiper-slide-prev').addClass('onHover');
        this.$('.swiper-slide-next').removeClass('onHover');
    },

    onAreaNext: function () {
        this.$cursor.removeClass('isPrev').addClass('isNext');
        this.$('.swiper-slide-next').addClass('onHover');
        this.$('.swiper-slide-prev').removeClass('onHover');
    },

    onMouseLeave: function () {
        this.$('.IndexReviews-sliderItem').removeClass('onHover');
    },

    reviewsSlider: function () {
        const slider = new Swiper('.IndexReviews-sliderWrapper', {
            initialSlide: 1,
            slidesPerView: 'auto',
            spaceBetween: 0,
            centeredSlides: true,
            speed: 1000,
            loop: true,
            simulateTouch: false,
            navigation: {
                nextEl: '.IndexReviews-sliderAreaNext',
                prevEl: '.IndexReviews-sliderAreaPrev'
            }
        });

        slider.on('slidePrevTransitionStart', function () {
            this.$('.swiper-slide-active').nextAll()
                .removeClass('toLeft')
                .addClass('toRight');
        }.bind(this));

        slider.on('slidePrevTransitionEnd', function () {
            this.$('.swiper-slide')
                .removeClass('toRight');
        });

        slider.on('slideNextTransitionStart', function () {
            this.$('.swiper-slide-active').prevAll()
                .removeClass('toRight')
                .addClass('toLeft');
        });

        slider.on('slideNextTransitionEnd', function () {
            this.$('.swiper-slide')
                .removeClass('toLeft');
        });
    }
});
