'use strict';

const Base = require('front/components/Base/Base');

require('./CommonInputNumber.scss');

module.exports = Base.extend({

    events: {
        'click .CommonInputNumber-increment': 'incrementNumber',
        'click .CommonInputNumber-decrement': 'decrementNumber'
    },

    initialize: function (options) {
        this.options = options || {};

        this.inputValue = this.$('.CommonInputNumber-value');

        Base.prototype.initialize.call(this, options);
    },

    incrementNumber: function () {
        const incrementValue = parseInt(this.inputValue.val(), 10);

        if (!isNaN(incrementValue)) {
            this.inputValue.val(incrementValue + 1);
        } else {
            this.inputValue.val(1);
        }
    },

    decrementNumber: function () {
        const decrementValue = parseInt(this.inputValue.val(), 10);

        if (!isNaN(decrementValue) && decrementValue > 1) {
            this.inputValue.val(decrementValue - 1);
        } else {
            this.inputValue.val(1);
        }
    }
});
