'use strict';

// var _ = require('underscore/underscore');
var Section = require('front/pages/Section/Section');

const BlogHero = require('front/components/BlogHero/BlogHero');
const BlogCategories = require('front/components/BlogCategories/BlogCategories');
const BlogNews = require('front/components/BlogNews/BlogNews');

require('./Blog.scss');

module.exports = Section.extend({

    el: '.Blog',

    mainContentSelector: '.Blog-content',

    events: {
    },

    //Base creates an instances for each one of found dom nodes (by selector) when parent view is rendered itself
    VIEWS_TO_REGISTER: {
        'BlogHero': {selector: '.BlogHero', viewConstructor: BlogHero},
        'BlogCategories': {selector: '.BlogCategories', viewConstructor: BlogCategories},
        'BlogNews': {selector: '.BlogNews', viewConstructor: BlogNews}
    },

    initialize: function (options) {
        this.options = options || {};

        // _.bindAll(this, '');
        app.els.$body.css('overflow-x', 'hidden');

        Section.prototype.initialize.call(this, options);
    }
});
