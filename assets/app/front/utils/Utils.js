'use strict';

var scrollbarWidth;

var TimelineLite = require('gsap/TimelineLite').TimelineLite;
var Expo = require('gsap/EasePack').Expo;
/* eslint-disable */
require('gsap/CSSPlugin').CSSPlugin;
/* eslint-enable */

var SplitText = require('SplitText.min');

SVGElement.prototype.hasClass = function (className) {
    return new RegExp('(\\s|^)' + className + '(\\s|$)').test(this.getAttribute('class'));
};


SVGElement.prototype.addClass = function (className) {
    if (!this.hasClass(className)) {
        this.setAttribute('class', this.getAttribute('class') + ' ' + className);
    }
};


SVGElement.prototype.removeClass = function (className) {
    var removedClass = this.getAttribute('class').replace(new RegExp('(\\s|^)' + className + '(\\s|$)', 'g'), '$2');
    if (this.hasClass(className)) {
        this.setAttribute('class', removedClass);
    }
};


SVGElement.prototype.toggleClass = function (className) {
    if (this.hasClass(className)) {
        this.removeClass(className);
    } else {
        this.addClass(className);
    }
};


$.fn.flashClass = function (className, delay) {
    var self = this;
    var timeout;
    this.addClass(className);
    clearTimeout(this.data('timeout'));
    timeout = setTimeout(function () {
        if (typeof self === 'object' && self.length) {
            self.removeClass(className);
            self.data('timeout', null);
        }
    }, delay);
    this.data('timeout', timeout);

    return this;
};

var urlsType = {};
for (var url in window.Urls) {
    if (window.Urls.hasOwnProperty(url)) {
        var urlStr = window.Urls[url]();
        if (urlStr) {
            urlsType[urlStr] = (/popup$/i).test(url) ? 'popup' : 'page';
        }
    }
}


if (typeof Object.assign !== 'function') {
    Object.assign = function (target) {
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source != null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }

        return target;
    };
}

// Restricts input for the set of matched elements to the given inputFilter function.
(function ($) {
    $.fn.inputFilter = function (inputFilter) {
        return this.on('input keydown keyup mousedown mouseup select contextmenu drop', function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty('oldValue')) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = '';
            }
        });
    };
})(jQuery);


// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
            || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)        {
        window.requestAnimationFrame = function (callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            },
            timeToCall);
            lastTime = currTime + timeToCall;

            return id;
        };
    }

    if (!window.cancelAnimationFrame)        {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
})();


jQuery.fn.serializeObject = function () {
    var arrayData;
    var objectData;
    arrayData = this.serializeArray();
    objectData = {};

    $.each(arrayData, function () {
        var value;
        var name = this.name.slice(-2) === '[]' ? this.name.slice(0, -2) : this.name;

        if (this.value != null) {
            value = this.value;
        } else {
            value = '';
        }

        if (objectData[name] != null) {
            if (!objectData[name].push) {
                objectData[name] = [objectData[name]];
            }

            objectData[name].push(value);
        } else {
            objectData[name] = value;
        }
    });

    return objectData;
};



$.fn.onCustom = function (eventName, callback) {
    this.each(function (ind, item) {
        var listeners = $(item).data('listeners');
        listeners && listeners[eventName] && listeners[eventName].push(callback);
    });

    return this;
};


$.fn.triggerCustom = function (eventName, options) {
    this.each(function (ind, item) {
        var listeners = $(item).data('listeners')[eventName];
        for (var i = 0 ; i < listeners.length; i++) {
            listeners[i]({}, options);
        }
    });

    return this;
};


$.fn.offCustom = function (eventName) {
    this.each(function (ind, item) {
        var listeners = $(item).data('listeners');
        listeners && listeners[eventName] && (listeners[eventName] = []);
    });

    return this;
};


//escaping all control symbols inside Media Base Url to use it as regular expression + check url ends with file
//extension: // \.\w{2, 7}$  (.ai, .mp4, .sketch, etc..)
var mediaRegex = new RegExp('^' + app.settings.mediaUrl.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '.*\\.\\w{2,7}$');
var originRegex = new RegExp('^' + window.location.origin.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'));

// Generate unique cid for object
//
var _cid = 0;


const utils = {

    animateWindowScroll: function (scrollTop) {
        app.state.preventMenuShowOnScroll = true;
        $('body, html').animate({'scrollTop': scrollTop}, 400);

        setTimeout(function () {
            app.state.preventMenuShowOnScroll = false;
        }, 500);
    },


   /*eslint-disable */
    easingFunctions: function (st, ed, per, easing) {
        var functions = {
            //simple linear tweening - no easing, no acceleration
            linearTween: function (t, b, c, d) {
                return c * t / d + b;
            },

            // quadratic easing in - accelerating from zero velocity
            easeInQuad: function (t, b, c, d) {
                t /= d;

                return c * t * t + b;
            },

            // quadratic easing out - decelerating to zero velocity
            easeOutQuad: function (t, b, c, d) {
                t /= d;

                return -c * t * (t - 2) + b;
            },

            // quadratic easing in/out - acceleration until halfway, then deceleration
            easeInOutQuad: function (t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;

                return -c / 2 * (t * (t - 2) - 1) + b;
            },

            // cubic easing in - accelerating from zero velocity
            easeInCubic: function (t, b, c, d) {
                t /= d;

                return c * t * t * t + b;
            },

            // cubic easing out - decelerating to zero velocity
            easeOutCubic: function (t, b, c, d) {
                t /= d;
                t--;

                return c * (t * t * t + 1) + b;
            },

            // cubic easing in/out - acceleration until halfway, then deceleration
            easeInOutCubic: function (t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t * t + b;
                t -= 2;

                return c / 2 * (t * t * t + 2) + b;
            },

            // quartic easing in - accelerating from zero velocity
            easeInQuart: function (t, b, c, d) {
                t /= d;

                return c * t * t * t * t + b;
            },

            // quartic easing out - decelerating to zero velocity
            easeOutQuart: function (t, b, c, d) {
                t /= d;
                t--;

                return -c * (t * t * t * t - 1) + b;
            },

            // quartic easing in/out - acceleration until halfway, then deceleration
            easeInOutQuart: function (t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t * t * t + b;
                t -= 2;

                return -c / 2 * (t * t * t * t - 2) + b;
            },

            // quintic easing in - accelerating from zero velocity
            easeInQuint: function (t, b, c, d) {
                t /= d;

                return c * t * t * t * t * t + b;
            },

            // quintic easing out - decelerating to zero velocity
            easeOutQuint: function (t, b, c, d) {
                t /= d;
                t--;

                return c * (t * t * t * t * t + 1) + b;
            },

            // quintic easing in/out - acceleration until halfway, then deceleration
            easeInOutQuint: function (t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t * t * t * t + b;
                t -= 2;

                return c / 2 * (t * t * t * t * t + 2) + b;
            },

            // sinusoidal easing in - accelerating from zero velocity
            easeInSine: function (t, b, c, d) {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            },

            // sinusoidal easing out - decelerating to zero velocity
            easeOutSine: function (t, b, c, d) {
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
            },

            // sinusoidal easing in/out - accelerating until halfway, then decelerating
            easeInOutSine: function (t, b, c, d) {
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
            },

            // exponential easing in - accelerating from zero velocity
            easeInExpo: function (t, b, c, d) {
                return c * Math.pow( 2, 10 * (t / d - 1) ) + b;
            },

            // exponential easing out - decelerating to zero velocity
            easeOutExpo: function (t, b, c, d) {
                return c * ( -Math.pow( 2, -10 * t / d ) + 1 ) + b;
            },

            // exponential easing in/out - accelerating until halfway, then decelerating
            easeInOutExpo: function (t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * Math.pow( 2, 10 * (t - 1) ) + b;
                t--;

                return c / 2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
            },

            // circular easing in - accelerating from zero velocity
            easeInCirc: function (t, b, c, d) {
                t /= d;

                return -c * (Math.sqrt(1 - t * t) - 1) + b;
            },

            // circular easing out - decelerating to zero velocity
            easeOutCirc: function (t, b, c, d) {
                t /= d;
                t--;

                return c * Math.sqrt(1 - t * t) + b;
            },

            // circular easing in/out - acceleration until halfway, then deceleration
            easeInOutCirc: function (t, b, c, d) {
                t /= d / 2;
                if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                t -= 2;

                return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
            }
        };

        return functions[easing](per, st, ed - st, 1);
    },
    /*eslint-enable */


    blockScrollOnSwipe: function (el) {
        let x;
        let y;
        let scroll;

        const onTouchStart = function (e) {
            if (e.touches.length > 1) {
                return;
            }

            scroll = undefined;
            x = e.touches[0].pageX;
            y = e.touches[0].pageY;
        };

        const onTouchMove = function (e) {
            if (scroll === 'v') {
                return;
            }

            const dX = e.touches[0].pageX - x;
            const dY = e.touches[0].pageY - y;

            if (scroll === 'h') {
                e.preventDefault();
            } else if (Math.abs(dX) > 5 || Math.abs(dY) > 5) {
                scroll = Math.abs(dX) > Math.abs(dY) ? 'h' : 'v';
            }
        };

        el.addEventListener('touchstart', onTouchStart, {
            passive: false
        });
        el.addEventListener('touchmove', onTouchMove, {
            passive: false
        });
    },


    PageVisibilityManager: (function () {
            // Set the name of the hidden property and the change event for visibility
        var hidden; var visibilityChange;
        if (typeof document.hidden !== 'undefined') {
            hidden = 'hidden';
            visibilityChange = 'visibilitychange';
        } else if (typeof document.mozHidden !== 'undefined') {
            hidden = 'mozHidden';
            visibilityChange = 'mozvisibilitychange';
        } else if (typeof document.msHidden !== 'undefined') {
            hidden = 'msHidden';
            visibilityChange = 'msvisibilitychange';
        } else if (typeof document.webkitHidden !== 'undefined') {
            hidden = 'webkitHidden';
            visibilityChange = 'webkitvisibilitychange';
        }

        var add = function (callback) {
            if (!hidden) {
                return false;
            }
            document.addEventListener(visibilityChange, callback);
        };

        var remove = function (callback) {
            if (!hidden) {
                return false;
            }
            document.removeEventListener(visibilityChange, callback);
        };

        var isHidden = function () {
            return document[hidden];
        };

        return {
            addEventListener : add,
            removeEventListener: remove,
            isPageHidden: isHidden
        };
    })(),


    //create blank video and check if it can be autoplayed without direct user interaction or not
    detectVideoAutoplayFeature: function (cb) {
        const base64BlankVideo = 'data:video/mp4;base64,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IHdlaWdodGI9MCBvcGVuX2dvcD0wIHdlaWdodHA9MCBrZXlpbnQ9MzAwIGtleWludF9taW49MzAgc2NlbmVjdXQ9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD02MCByYz1jcmYgbWJ0cmVlPTEgY3JmPTUxLjAgcWNvbXA9MC42MCBxcG1pbj0wIHFwbWF4PTY5IHFwc3RlcD00IHZidl9tYXhyYXRlPTIwMDAwIHZidl9idWZzaXplPTI1MDAwIGNyZl9tYXg9MC4wIG5hbF9ocmQ9bm9uZSBmaWxsZXI9MCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAADj2WIgQAGomKAAeunc99999999999999999999999999999999999999bvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrwAAAACUGaCRYJQASxgAAAAAlBnhCDgSgAljAAAAAIAZ4YE0UAEsYAAAAIAZ4YI0UAEsYAAAAIAZ4YM0UAEsYAAAAIAZ4YQ0UAEsYAAAAIAZ4YU0UAEsYAAAAIAZ4YY0UAEsYAAAAIAZ4Yc0UAEsYAAAAIAZ4YlqUAEsYAAAAIAZ4YpqUAEsYAAAAIAZ4YtqUAEsYAAAAIAZ4YxqUAEsYAAAAIAZ4Y1qUAEsYAAAAIAZ4Y5qUAEsYAAAAIAZ4Y9qUAEsYAAAAIAZ4ZBqUAEsYAAAAKQZoZ1eloigAljAAAAAlBniFy4OgAljAAAAAJAZ4pItFABLGAAAAACQGeKTLRQASxgAAAAAkBnilC0UAEsYAAAAAJAZ4pUtFABLGAAAAACQGeKWLRQASxgAAAAAkBnimGSUAEsYAAAAAJAZ4plklABLGAAAAACQGeKaZJQASxgAAAAAkBnim2SUAEsYAAAAAJAZ4pxklABLGA';
        const $video = $('<video muted playsinline crossorigin loop preload="auto">')
            .attr('src', base64BlankVideo)
            .css({
                'position': 'absolute',
                'top': -9999
            })
            .appendTo('body');
        const playPromise = $video[0].play();

        // browsers that don't yet support this functionality,
        // playPromise won't be defined.
        if (playPromise !== undefined && !app.settings.isIE && !app.settings.isEdge ) {
            let res;
            playPromise
                .then(() => {
                    res = true;
                })
                .catch(() => {
                    res = false;
                })
                .finally(() => {
                    $video.remove();
                    cb(res);
                });
        } else {
            $video.remove();
            cb(true); //for older browsers autoplay is almost certanly enabled
        }
    },


    cid: function (data) {
        if (typeof data !== 'undefined') {
            return Object.assign({}, data, {_cid: data._cid || ++_cid});
        }

        return ++_cid;
    },


    /* eslint-disable */
    isValidEmail: function (email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return re.test(email);
    },
    /* eslint-enable */


    updateLinksAttributes: function ($container) {
        $('a', $container).each(function () {
            var $link = $(this);

            if ($link.hasClass('u-skipUrlParser')) {
                return;
            }

            var href = $link.attr('href');
            var linkType = 'inner';

            if (/\.\w{2,7}$/i.test(href)) {
                linkType = 'file';
            }
            if (/^tel\:/i.test(href)) {
                linkType = 'tel';
            }
            if (/^mailto\:/i.test(href)) {
                linkType = 'mail';
            }
            if (/^http/i.test(href)) {
                linkType = 'outer';
            }
            if (originRegex.test(href)) {
                $link.attr('href', href.substring(window.location.origin.length));
                linkType = 'inner';
            }
            if (/^#/i.test(href)) {
                linkType = 'anchor';
            }
            if (mediaRegex.test(href)) {
                linkType = 'file';
            } //in case of mediaUrl starts with http and "/^http/i" conditional statement overrides file conditional statement "/\.\w{2,7}$/i"

            if (linkType === 'outer' || linkType === 'file') {
                $link.attr('target', '_blank');
            } else {
                $link.removeAttr('target');
            }

            if (urlsType[$link.attr('href')] === 'page') {
                linkType = 'page'; //no router processing, needs reload
            }

            $link.toggleClass('u-Outer', linkType === 'outer');
            $link.toggleClass('u-Route', linkType === 'inner');
            $link.toggleClass('u-Tel', linkType === 'tel');
            $link.toggleClass('u-Mail', linkType === 'mail');
            $link.toggleClass('u-File', linkType === 'file');
            $link.toggleClass('u-Anchor', linkType === 'anchor');

            if (linkType === 'file') {
                $link.attr('data-type', href.match(/\.(\w{2,7})$/i)[1]);
            }
        });
    },


    createEmptyPromise: function () {
        return new Promise(function (resolve) {
            resolve();
        });
    },


    getFocusBack: function () {
        $('<input style="position: absolute;left: -999px;font-size:20px" type="text"/>')
            .appendTo('body')
            .css({'top': $(window).scrollTop()})
            .focus()
            .remove();
    },


    waitForTransitionEnd: function ($obj, property, cb, safeTimeout) {
        var transEndEventNames = {
            'transition'       : 'transitionend',
            'WebkitTransition' : 'webkitTransitionEnd',
            'MozTransition'    : 'transitionend',
            'OTransition'      : 'oTransitionEnd',
            'msTransition'     : 'MSTransitionEnd'
        };

        var transitionSafeTimeout;

        var getTransitionEndName = function () {
            if (!window.getComputedStyle || !document.documentElement) {
                return 'transitionend';
            }

            var styles = window.getComputedStyle(document.documentElement, '');

            for (var i in transEndEventNames) {
                if (styles[i] !== undefined) {
                    return transEndEventNames[i];
                }
            }

            return 'transitionend';
        };

        var transEndEventName = getTransitionEndName();

        var transitionEndCallback = function (e) {
            if (e) {
                var prop = e.originalEvent.propertyName.toLowerCase();
                if (!$(e.target).is($obj)) {
                    return;
                }
                if (prop.indexOf(property) === -1) {
                    return;
                }
            }

            $obj.off(transEndEventName, transitionEndCallback);

            clearTimeout(transitionSafeTimeout);

            cb();
        };

        var resetAllHandlers = function () {
            $obj.off(transEndEventName, transitionEndCallback);

            clearTimeout(transitionSafeTimeout);
        };


        $obj.on(transEndEventName, transitionEndCallback);

        transitionSafeTimeout = setTimeout(transitionEndCallback, safeTimeout === undefined ?
            this.getTransitionDuration($obj[0], property) + 100 : safeTimeout);

        return resetAllHandlers;
    },



    getScrollbarWidth: function () {
        if (scrollbarWidth !== undefined) {
            return scrollbarWidth;
        }

        var outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.width = '100px';
        outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps

        document.body.appendChild(outer);

        var widthNoScroll = outer.offsetWidth;
        // force scrollbars
        outer.style.overflow = 'scroll';

        // add innerdiv
        var inner = document.createElement('div');
        inner.style.width = '100%';
        outer.appendChild(inner);

        var widthWithScroll = inner.offsetWidth;

        // remove divs
        outer.parentNode.removeChild(outer);

        scrollbarWidth = widthNoScroll - widthWithScroll;

        return scrollbarWidth;
    },


    queryUrlGetParam: function (variable, url) {
        if (!url) {
            return '';
        }

        try {
            var queryParts = url.split('?');
            var query = queryParts[queryParts.length - 1];

            if (!query) {
                return '';
            }

            var v = query.split('&');
            for (var i = 0; i < v.length; i++ ) {
                var p = v[i].split('=');
                if (p[0] === variable) {
                    if (p.length > 1) {
                        return decodeURIComponent(p[1]);
                    } else {
                        return ''; //if variable for empty param, without value
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    },


    splitMultilineToSeparateSpans: function (params) {
        var splitObj = {};
        var innerHTML = params.$container[0].innerHTML;
        // var text = params.$container.text();
        // var words = text.split(' ');
        var cancelSplit = function () {
            if (!splitObj.isSplitted) {
                return;
            }
            splitObj.isSplitted = false;

            params.$container[0].innerHTML = innerHTML;
        };


        var makeSplit = function () {
            if (splitObj.isSplitted) {
                return;
            }
            splitObj.isSplitted = true;

            var split = new SplitText(params.$container, {
                type: 'lines',
                linesClass: params.className
            });

            splitObj.lines = split.lines;

            $(split.lines)
                .css({
                    'display': params.autoWidth ? 'inline-block' : 'block',
                    'opacity': params.transparent && !splitObj.animated ? '0' : '',
                    'will-change': 'opacity, transform'
                });
        };

        splitObj = {
            $container: params.$container,
            className: params.className,
            makeSplit: makeSplit,
            cancel: function (needRevert) {
                app.vent.off('resize-started', cancelSplit);
                app.vent.off('resize-ended', makeSplit);
                needRevert && (params.$container[0].innerHTML = innerHTML);
            }
        };

        makeSplit();
        app.vent.on('resize-started', cancelSplit);
        app.vent.on('resize-ended', makeSplit);
        app.vent.on('fonts-loaded', () => {
            cancelSplit();
            makeSplit();
        });

        return splitObj;
    },


    animateTextByLines: function (splitObj, lineDuration, lineDelay, cb, cancelOnEnd, shift, delay) {
        var tl = new TimelineLite();
        var $lines = splitObj.$container.find('.' + splitObj.className);

        shift = shift || 0;
        delay = delay || 0;

        splitObj.animated = true;

        tl.staggerFromTo($lines, lineDuration / 1000, {
            y: shift,
            opacity: 0.01
        }, {
            y: 0,
            opacity: 1,
            ease: Expo.easeOut
        }, lineDelay / 1000, 0);

        tl.delay(delay / 1000);

        tl.add(function () {
            $lines
                .css({
                    transform: '',
                    opacity: ''
                });
            cancelOnEnd && splitObj.cancel(true);
            cb && cb();
        });

        tl.play();

        return $lines.length;
    },


    smoothDamp: function (current, target, dat, smoothTime, maxSpeed, deltaTime) {
        smoothTime = Math.max(0.0001, smoothTime);

        var num = 2 / smoothTime;
        var num2 = num * deltaTime;
        var num3 = 1 / (1 + num2 + 0.48 * num2 * num2 + 0.235 * num2 * num2 * num2);
        var num4 = current - target;
        var num5 = target;
        var num6 = maxSpeed * smoothTime;
        var num7; var num8;

        num4 = Math.min(Math.max(num4, -num6), num6);

        target = current - num4;
        num7 = (dat.velocity + num * num4) * deltaTime;
        dat.velocity = (dat.velocity - num * num7) * num3;
        num8 = target + (num4 + num7) * num3;

        if ((num5 - current > 0) === (num8 > num5)) {
            num8 = num5;
            dat.velocity = (num8 - num5) / deltaTime;
        }

        return num8;
    }

};


module.exports = utils;
