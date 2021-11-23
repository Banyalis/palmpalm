'use strict';

const _ = require('underscore');
const Base = require('front/components/Base/Base');

require('./IndexFaq.scss');

module.exports = Base.extend({

    events: {
        'click .IndexFaq-listItemHeader': 'onQuestionClick'
    },

    initialize: function (options) {
        this.options = options || {};

        _.bindAll(this, 'onResize');

        this.splitTitle = app.utils.splitMultilineToSeparateSpans({
            $container: this.$('.IndexFaq-title'),
            className: 'IndexFaq-titleLine',
            autoWidth: true,
            transparent: true
        });

        this.$el.onCustom('screen-enter', () => {
            if (!this.isFaqTitleShown) {
                this.isFaqTitleShown = true;

                setTimeout(() => {
                    this.splitTitle.makeSplit();

                    app.utils.animateTextByLines(this.splitTitle, app.settings.animationDuration,
                        app.settings.animationDelay, null, false, 40, 150);
                }, 100);
            }
        });

        this.$('.IndexFaq-list').onCustom('screen-enter', () => {
            if (!this.isFaqListShown) {
                this.isFaqListShown = true;

                setTimeout(() => {
                    this.$('.IndexFaq-list').removeClass('isInitialState');
                }, 100);
            }
        });

        app.vent.on('resize', this.onResize);
        this.onResize();

        this.textSplitArray = [];

        _.each(this.$('.IndexFaq-listItemAnswer'), (item) => {
            this.textSplitArray.push(app.utils.splitMultilineToSeparateSpans({
                $container: $(item),
                className: 'IndexFaq-listItemAnswerLine',
                autoWidth: true,
                transparent: true
            }));
        });

        _.each(this.textSplitArray, (item) => {
            item.makeSplit();
        });

        Base.prototype.initialize.call(this, options);
    },

    onResize: function () {
        const $openQuestion = this.$('.IndexFaq-listItem.isOpen');
        const openQuestionHeight = $openQuestion.find('.IndexFaq-listItemAnswer')
            .innerHeight();
        this.padding = this.paddingTop + this.paddingBottom;

        this.paddingTop = Number(this.$('.IndexFaq-listItem:first .IndexFaq-listItemAnswer').css('padding-top')
            .slice(0, -2));
        this.paddingBottom = Number(this.$('.IndexFaq-listItem:first .IndexFaq-listItemAnswer').css('padding-bottom')
            .slice(0, -2));

        $openQuestion.find('.IndexFaq-listItemInner').css('max-height', (openQuestionHeight + this.padding));
    },

    onQuestionClick: function (e) {
        let $currentTarget = $(e.currentTarget);

        if ($currentTarget.parent().hasClass('isOpen')) {
            this.closeQuestion($currentTarget);

            delete this.$lastOpenedQuestion;
        } else {
            if (this.$lastOpenedQuestion) {
                this.closeQuestion(this.$lastOpenedQuestion);
            }

            this.openQuestion($currentTarget);

            this.$lastOpenedQuestion = $currentTarget;
        }
    },

    openQuestion: function ($currentTarget) {
        const $content = $currentTarget.parent().find('.IndexFaq-listItemInner');
        const $contentText = $content.find('.IndexFaq-listItemAnswer');
        const contentHeight = $contentText.innerHeight();

        $currentTarget.parent().addClass('isOpen');
        $content.css({
            'opacity': '',
            'max-height': (contentHeight + this.padding)
        });

        _.each(this.textSplitArray, (item) => {
            if (item.$container[0] === $contentText[0]) {
                app.utils.animateTextByLines(item, app.settings.animationDuration,
                    app.settings.animationDelay, null, false, 40, 150);
            }
        });
    },

    closeQuestion: function ($currentTarget) {
        const $content = $currentTarget.parent().find('.IndexFaq-listItemInner');

        $content.css('opacity', 0);

        setTimeout(() => {
            $currentTarget.parent().removeClass('isOpen');
            $content.css('max-height', 0);
        }, 16);
    }
});
