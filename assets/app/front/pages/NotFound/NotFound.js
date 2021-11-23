'use strict';

var Section = require('front/pages/Section/Section');

require('./NotFound.scss');

module.exports = Section.extend({

    el: '.NotFound',

    mainContentSelector: '.NotFound-content',

    events: {
    },


    initialize: function (options) {
        this.options = options || {};

        Section.prototype.initialize.call(this, options);
    }
});
