'use strict';

// var _ = require('underscore/underscore');
var Section = require('front/pages/Section/Section');

require('./BlogArticle.scss');

const BlogArticleHero = require('front/components/BlogArticleHero/BlogArticleHero');
const BlogArticleItem = require('front/components/BlogArticleItem/BlogArticleItem');

module.exports = Section.extend({

    el: '.BlogArticle',

    mainContentSelector: '.BlogArticle-content',

    events: {
    },

    //Base creates an instances for each one of found dom nodes (by selector) when parent view is rendered itself
    VIEWS_TO_REGISTER: {
        'BlogArticleHero': {selector: '.BlogArticleHero', viewConstructor: BlogArticleHero},
        'BlogArticleItem': {selector: '.BlogArticleItem', viewConstructor: BlogArticleItem}
    },

    initialize: function (options) {
        this.options = options || {};

        // _.bindAll(this, '');

        app.els.$body.css('overflow-x', 'hidden');

        Section.prototype.initialize.call(this, options);
    }
});
