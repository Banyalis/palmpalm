'use strict';

const _ = require('underscore');
const Base = require('front/components/Base/Base');

require('./CommonCursor.scss');

module.exports = Base.extend({

    initialize: function (options) {
        this.options = options || {};

        _.bindAll(this, 'onMouseEnter', 'onMouseMove', 'onMouseLeave', 'onMouseDown', 'onMouseUp');

        this.$parentCursor = this.$el.parent();

        this.$parentCursor.on('mouseenter', this.onMouseEnter);
        this.$parentCursor.on('mousemove', this.onMouseMove);
        this.$parentCursor.on('mouseleave', this.onMouseLeave);
        this.$parentCursor.on('mousedown', this.onMouseDown);
        this.$parentCursor.on('mouseup', this.onMouseUp);

        Base.prototype.initialize.call(this, options);
    },

    onMouseEnter: function () {
        if (app.settings.isMobile) {
            return;
        }

        clearTimeout(this.showCursor);
        clearTimeout(this.hideCursor);

        this.$el.show();

        this.showCursor = setTimeout(function () {
            this.$el.addClass('isShow');
        }.bind(this), 20);
    },

    onMouseMove: function (e) {
        if (app.settings.isMobile) {
            return;
        }

        const x = e.pageX - $(e.currentTarget).offset().left;
        const y = e.pageY - $(e.currentTarget).offset().top;

        this.$el.css({
            transform: 'translate3d(' + x + 'px, ' + y + 'px, 0)'
        });
    },

    onMouseLeave: function () {
        if (app.settings.isMobile) {
            return;
        }

        clearTimeout(this.showCursor);
        clearTimeout(this.hideCursor);

        this.$el.removeClass('isShow');

        this.hideCursor = setTimeout(function () {
            this.$el.hide();
        }.bind(this), 650);
    },

    onMouseDown: function () {
        this.$el.addClass('isPressed');
    },

    onMouseUp: function () {
        this.$el.removeClass('isPressed');
    }
});
