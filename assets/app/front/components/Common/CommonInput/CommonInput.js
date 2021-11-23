'use strict';

const Base = require('front/components/Base/Base');

require('./CommonInput.scss');

module.exports = Base.extend({

    initialize: function (options) {
        this.options = options || {};

        const $input = this.$('input');

        $input.on('blur', function () {
            if ($input.val()) {
                $input.parent().addClass('isUsed');
            } else {
                $input.parent().removeClass('isUsed');
            }
        }.bind(this));

        const $passwordButton = this.$('.CommonInput-passwordButton');

        $passwordButton.on('click', function () {
            if ($input.attr('type') === 'password') {
                $input.attr('type', 'text');
            } else {
                $input.attr('type', 'password');
            }
        }.bind(this));

        Base.prototype.initialize.call(this, options);
    }
});
