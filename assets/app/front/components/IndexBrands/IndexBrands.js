'use strict';

const Base = require('front/components/Base/Base');

require('./IndexBrands.scss');

module.exports = Base.extend({

    initialize: function (options) {
        this.options = options || {};

        this.$el.onCustom('screen-enter', () => {
            if (!this.isBrandsShown) {
                this.isBrandsShown = true;

                setTimeout(() => {
                    this.$el.removeClass('isInitialState');
                }, 100);
            }
        });

        Base.prototype.initialize.call(this, options);
    }
});
