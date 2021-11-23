'use strict';

var Page = require('front/pages/Page/Page');

module.exports = Page.extend({

    //for subviews with equal constructor enables/disables appearance animation
    noAnimationOnEqualSubviews: true,


    initialize: function (options) {
        this.isSubSection = true;

        Page.prototype.initialize.call(this, options);
    },


    $parent: function () {
        return this.parent.$content;
    }
});
