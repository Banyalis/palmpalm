'use strict';

var Section = require('front/pages/Section/Section');

require('./Index.scss');

var IndexHero = require('front/components/IndexHero/IndexHero');
var IndexVideo = require('front/components/IndexVideo/IndexVideo');
var IndexReviews = require('front/components/IndexReviews/IndexReviews');
var IndexArticles = require('front/components/IndexArticles/IndexArticles');
var IndexBrands = require('front/components/IndexBrands/IndexBrands');
var IndexNews = require('front/components/IndexNews/IndexNews');
var IndexFaq = require('front/components/IndexFaq/IndexFaq');

module.exports = Section.extend({

    el: '.Index',

    mainContentSelector: '.Index-content',

    events: {
    },

    //Base creates an instances for each one of found dom nodes (by selector) when parent view is rendered itself
    VIEWS_TO_REGISTER: {
        'IndexHero': {selector: '.IndexHero', viewConstructor: IndexHero},
        'IndexVideo': {selector: '.IndexVideo', viewConstructor: IndexVideo},
        'IndexReviews': {selector: '.IndexReviews', viewConstructor: IndexReviews},
        'IndexArticles': {selector: '.IndexArticles', viewConstructor: IndexArticles},
        'IndexBrands': {selector: '.IndexBrands', viewConstructor: IndexBrands},
        'IndexNews': {selector: '.IndexNews', viewConstructor: IndexNews},
        'IndexFaq': {selector: '.IndexFaq', viewConstructor: IndexFaq}
    },

    initialize: function (options) {
        this.options = options || {};

        Section.prototype.initialize.call(this, options);
    },


    getReadyPromise: function () {
        return new Promise(function (resolve) {
            app.vent.on('bottle3d-is-ready', () => {
                resolve();
            });
        });
    }


});
