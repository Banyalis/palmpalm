'use strict';

var SubSection = require('front/pages/Section/SubSection');

module.exports = SubSection.extend({

    initialize: function (options) {
        this.isSubSectionDummy = true;

        SubSection.prototype.initialize.call(this, options);
    },

    isRendered: function () {
        return true;
    },


    attach: function () {
    },


    render: function () {
        return this;
    },


    activate: function (params) {
        this.parent.setTitle();

        return SubSection.prototype.activate.call(this, params);
    },


    destroy: function () {
        return SubSection.prototype.destroy.call(this);
    },


    deactivate: function (params) {
        return SubSection.prototype.deactivate.call(this, params);
    }
});
