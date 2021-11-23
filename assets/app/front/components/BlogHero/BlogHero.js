'use strict';

const _ = require('underscore');
const Base = require('front/components/Base/Base');

var template = require('./BlogHero.jinja');
require('./BlogHero.scss');

const Swiper = require('swiper/swiper-bundle.min');
require('swiper/swiper.scss');

module.exports = Base.extend({

    template: template,

    events: {
        'click .BlogHero-listSliderButtons': 'onClick'
    },

    //Base creates an instances for each one of found dom nodes (by selector) when parent view is rendered itself
    VIEWS_TO_REGISTER: {},

    initialize: function (options) {
        this.options = options || {};

        _.bindAll(this, 'slider');

        this.$('.BlogHero-listItem').first()
            .addClass('isShow isAnimated');

        this.slider();

        app.utils.updateLinksAttributes(this.$el);

        Base.prototype.initialize.call(this, options);
    },

    slider: function () {
        new Swiper('.BlogHero-listSlider', {
            slidesPerView: 'auto',
            speed: 1000,
            loop: true,
            simulateTouch: false,
            effect: 'fade',
            navigation: {
                nextEl: '.BlogHero-listSliderButtons-next',
                prevEl: '.BlogHero-listSliderButtons-prev'
            }
        });
    },

    onClick: function () {
        const $currentSlide = this.$('.BlogHero-listSliderImage.swiper-slide-active');
        const $list = this.$('.BlogHero-listInner');
        const $currentListItem = this.$('.BlogHero-listItem[data-id=' + $currentSlide.data('id') + ']');

        if (!$currentListItem.hasClass('isShow')) {
            clearTimeout(this.animated);

            $currentListItem.addClass('isActive');

            $list.children().removeClass('isShow isAnimated');
            $currentListItem.addClass('isShow');

            this.animated = setTimeout(function () {
                $currentListItem.addClass('isAnimated');
            }, 200);
        }
    }
});
