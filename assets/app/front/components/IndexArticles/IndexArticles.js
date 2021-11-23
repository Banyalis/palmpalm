'use strict';

const Base = require('front/components/Base/Base');

require('./IndexArticles.scss');

module.exports = Base.extend({

    initialize: function (options) {
        this.options = options || {};

        this.$('.IndexArticles-item').onCustom('screen-enter', (e, data) => {
            if (!Number(data.$el.data('shown'))) {
                data.$el[0].setAttribute('data-shown', 1);

                setTimeout(() => {
                    data.$el.removeClass('isInitialState');
                }, 100);
            }
        });

        app.utils.updateLinksAttributes(this.$el);

        Base.prototype.initialize.call(this, options);
    }
});
