'use strict';

var _ = require('underscore');
var Cookies = require('js-cookie');

module.exports = {
    configure: function () {
        function csrfSafeMethod(method) {
            // these HTTP methods do not require CSRF protection
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        }

        $.ajaxSetup({
            // data: {
            //     market: app.settings.marketCode
            // },
            beforeSend: function (xhr, settings) {
                var csrftoken;

                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    csrftoken = Cookies.get('csrftoken');
                    xhr.setRequestHeader('X-CSRFToken', csrftoken);
                }
            }
        });

        Backbone.Model.prototype.toJSON = function () {
            var json = _.clone(this.attributes);
            var attr;

            for (attr in json) {
                if ((json[attr] instanceof Backbone.Model) || (json[attr] instanceof Backbone.Collection)) {
                    json[attr] = json[attr].toJSON();
                }
            }

            return json;
        };
    }
};
