'use strict';

var $ = require('jquery');
window.jQuery = $;
window.$ = $;

var Backbone = require('backbone');
var _ = require('underscore');
var objectFitImages = require('object-fit-images');
var FontFaceObserver = require('fontfaceobserver');

//Backend urls chhemas to generate them on frontend
window.Urls = require('django_js_front/reverse.js');
window.UrlsAPI = require('django_js_front_api/reverse.js');

var Settings = require('./Settings');
var Router = require('./Router');
var Utils = require('front/utils/Utils.js');

require('front/components/Content/Content');

var Header = require('front/components/Header/Header');
var MenuPopup = require('front/components/MenuPopup/MenuPopup');
var Footer = require('front/components/Footer/Footer');

require('front/style.scss');
// require('mq-genie');

//fix for hovers|active on mobile, what a weird behavior!
//fastclick solves this problem, but adds a bunch of other
if (!app.settings.isDesktop) {
    document.addEventListener('touchstart', function () {}, {passive: true});
}

var Promise = require('promise-polyfill').default;

if (!window.Promise) {
    window.Promise = Promise;
}

app.configure = Settings.configure;
app.configure();

window.app.vent = _.extend({}, Backbone.Events);

Promise.all([
    new FontFaceObserver('Matter SQ 400').load(),
    new FontFaceObserver('Matter SQ 500').load(),
    new FontFaceObserver('GT America 400').load(),
    new FontFaceObserver('GT America 500').load(),
    new FontFaceObserver('GT America 700').load()
]).then(function () {
    window.app.state.fontsLoaded = true;
    window.app.vent.trigger('fonts-loaded');
}, function () {
    console.log('Fonts is not available');
});


window.app.utils = Utils;

window.app.els = {
    $window: $(window),
    $document: $(document),
    $body: $('body'),
    $htmlBody: $('html,body'),
    $content: $('.Content')
};

window.app.getLayout = function () {
    if (window.matchMedia('(min-width: 1440px)').matches) {
        return 'desktop';
    } else if (window.matchMedia('(max-width: 767px)').matches) {
        return 'phone';
    } else {
        return 'tablet';
    }
};


app.router = new Router();

app.els.$body.on('click', '.u-Route', function (e) {
    if (app.els.$body.hasClass('Page404')) {
        return;
    }

    // var currentRoute = Backbone.history.getFragment();

    var parentUrl = $(e.target)
        .closest('a')
        .attr('href');

    var url = $(e.currentTarget).attr('href') || parentUrl;

    e.preventDefault();
    Backbone.history.navigate(url, {trigger: 'true'});
});

app.views = {
    MenuPopup: new MenuPopup({
        el: $('.MenuPopup')
    })
};

app.sizes = {
    scrollTop: window.pageYOffset,
    layout: window.app.getLayout()
};

_.extend(app.views, {
    header: new Header({
        el: $('.Header')
    }),
    footer: new Footer({
        el: $('.Footer')
    })
});

//proceed any popup show/hide
//set all underlying content fixed position
app.vent.on('PopupShown', function () {
    var $items = [];
    var tops = [];
    var scrollTop = $(window).scrollTop();

    //first of all get top position of all elements that need to be fixed on popup shown
    $('.NeedFixOnPopup').each(function (id, item) {
        var $item = $(item);
        $items.push($item);
        tops.push($item.offset().top);
    });

    //after that set all items fixed position and position them at the very point there where they was
    _.each($items, function ($item, ind) {
        $item
            .css('top', tops[ind] - scrollTop)
            .addClass('FixedOnPopup');
    });

    app.state.popupShown = true;

    app.state.forceResize = true;
    $(window).resize();
}.bind(this));


app.vent.on('PopupHidded', function () {
    $('.NeedFixOnPopup').each(function (id, item) {
        $(item)
            .css('top', '')
            .removeClass('FixedOnPopup');
    });

    app.state.popupShown = false;

    app.state.forceResize = true;
    $(window).resize();
}.bind(this));


const onScroll = () => {
    window.app.vent.trigger('scroll');
};

const onScrollThrottled = _.throttle(() => {
    window.app.vent.trigger('scroll-throttled');
}, 100, {trailing: true, leading: true});

const onResize = () => {
    window.app.vent.trigger('resize');
};

const onResizeThrottled = _.throttle(() => {
    window.app.vent.trigger('resize-throttled');
}, 100, {trailing: true, leading: true});

const onResizeDebounced = _.debounce(() => {
    window.app.vent.trigger('resize-debounced');
}, 500);

const onResizeStartedDebounced = _.debounce(() => {
    window.app.vent.trigger('resize-started');
}, 500, true);

const onResizeEndedDebounced = _.debounce(() => {
    window.app.vent.trigger('resize-ended');
}, 500);


var startDate = +new Date();

setTimeout(() => {
    $('html').removeClass('no-transition');
}, 100);

$(window)
    .on('scroll', function () {
        window.app.sizes.scrollTop = window.pageYOffset;
        onScroll();
        onScrollThrottled();
    })
    .on('resize', function () {
        if (new Date() - startDate > 1000) {
            $('html').flashClass('no-transition', 100);
        }
        const windowWidth = $(window).width();
        const windowHeight = $(window).height();
        const windowInnerHeight = window.innerHeight;
        const layout = window.app.getLayout();
        const totalPageHeight = document.body.scrollHeight;

        window.app.sizes.scrollTop = window.pageYOffset;
        window.app.sizes.totalPageHeight = totalPageHeight;

        window.app.sizes.windowInnerHeight = windowInnerHeight;

        //usefull for mobile scroll, when bottom nav panel hides/reveals on up/down scroll
        //causing resize event, which is very harmhull for us
        if (windowWidth === window.app.sizes.windowWidth &&
            windowHeight === window.app.sizes.windowHeight &&
            !app.state.forceResize) {
            return;
        }

        if (layout !== window.app.sizes.layout) {
            app.vent.trigger('layout-switch', layout);
        }

        app.state.forceResize = false;
        window.app.sizes.windowWidth = windowWidth;
        window.app.sizes.windowHeight = windowHeight;
        window.app.sizes.layout = layout;

        onResize();
        onResizeThrottled();
        onResizeDebounced();

        onResizeStartedDebounced();
        onResizeEndedDebounced();
    });



app.utils.detectVideoAutoplayFeature(function (res) {
    app.settings.hasAutoPlay = res;

    app.router.start();

    if (app.settings.isIE) {
        objectFitImages();
    }
});




/* eslint-disable */
// const generateMacros = (layouts, images) => {
//     var bestSizes = [120, 240, 360, 480, 600, 768, 1024, 1280, 1366, 1440, 1680, 1920];

//     const findBestMatch = (size) => {
//         for (let i = 0; i < bestSizes.length ; i++) {
//             if (bestSizes[i] >= size) {
//                 return bestSizes[i];
//             }
//         }

//         return bestSizes[bestSizes.length - 1];
//     };

//     const generateSrcset = (varName, tp, scale) => {
//         let res = `{% set ${varName} = '' %}`;
//         let keysCount = Object.keys(sizes).length;

//         if (keysCount == 1 && scale > 1) {
//             return '';
//         }

//         for (let size in sizes) {
//             if (sizes.hasOwnProperty(size)) {
//                 let isLast = !--keysCount;
//                 res += `
//     {% set ${varName} = ${varName} + data.w${size}${tp ? '_' + tp : ''}_url + ' ${Math.ceil(size * scale)}w${isLast ? '' : ', '}' %}`;
//             }
//         }

//         return res;
//     };


//     const generateSource = (srcset, media, tp, isReal) => {
//         let keysCount = Object.keys(sizes).length;

//         if (keysCount === 1 && media) {
//             return '';
//         }

//         if (isReal) {
//             return `<source srcset="{{ ${srcset} }}" ${media ? 'media="(' + media + ')"' : ''} sizes="{{ sizes }}" ${tp ? 'type="' + tp + '"' : ''}>`;
//         } else {
//             return `<source srcset="{{ static('img/front/stub.png') }} 1w" data-srcset="{{ ${srcset} }}" ${media ? 'media="(' + media + ')"' : ''} data-sizes="{{ sizes }}" ${tp ? 'type="' + tp + '"' : ''}>`;
//         }
//     };


//     const sizes = {};
//     images.forEach((item) => {
//         item.scales.forEach((scale) => {
//             const size = findBestMatch(item.scrW * layouts[item.imgSizeInd] * scale);
//             if (scale === 1) {
//                 sizes[size] = 1;
//             }
//         });
//     });

//     images.forEach((item) => {
//         item.scales.forEach((scale) => {
//             const size = findBestMatch(item.scrW * layouts[item.imgSizeInd] * scale);
//             if (scale != 1) {
//                 let foundBigger = false;
//                 for (let size1x in sizes) {
//                     if (sizes.hasOwnProperty(size1x)) {
//                         if (size1x - 0 >= size) {
//                             foundBigger = true;
//                             break;
//                         }
//                     }
//                 }
//                 if (!foundBigger) {
//                     sizes[size] = 1;
//                 }
//             }
//         });
//     });

//     const sizesList = Object.keys(sizes);
//     const middleSize = sizesList[Math.floor(sizesList.length / 2)];

//     let sizesStr = `{% set sizes = "(max-width: 600px) ${Math.floor(10000 * layouts[0]) / 100}vw, (max-width: 1680px) ${Math.floor(10000 * layouts[1]) / 100}vw, ${Math.floor(1680 * layouts[1])}px" %}`;


//     return `
// {% macro picture(data, alt, color="transparent", isReal=false, isLazy=true) %}
//     ${generateSrcset('srcsetWebp3x', 'webp', 3 / 2)}

//     ${generateSrcset('srcset3x', '', 3 / 2)}

//     ${generateSrcset('srcsetWebp2x', 'webp', 4 / 3)}

//     ${generateSrcset('srcset2x', '', 4 / 3)}

//     ${generateSrcset('srcsetWebp1x', 'webp', 1)}

//     ${generateSrcset('srcset1x', '', 1)}

//     ${sizesStr}

//     {% if (isReal) %}
//         <picture >
//             ${generateSource('srcsetWebp3x', 'min-resolution: 3dppx', 'image/webp', true)}
//             ${generateSource('srcset3x', 'min-resolution: 3dppx', '', true)}
//             ${generateSource('srcsetWebp2x', 'min-resolution: 2dppx', 'image/webp', true)}
//             ${generateSource('srcset2x', 'min-resolution: 2dppx', '', true)}
//             ${generateSource('srcsetWebp1x', '', 'image/webp', true)}
//             ${generateSource('srcset1x', '', '', true)}
//             <img src="{{ data.w${middleSize}_url }}" alt="{{ alt }}" style="background-color: {{ color }}">
//         </picture>
//     {% else %}
//         <picture >
//             ${generateSource('srcsetWebp3x', 'min-resolution: 3dppx', 'image/webp', false)}
//             ${generateSource('srcset3x', 'min-resolution: 3dppx', '', false)}
//             ${generateSource('srcsetWebp2x', 'min-resolution: 2dppx', 'image/webp', false)}
//             ${generateSource('srcset2x', 'min-resolution: 2dppx', '', false)}
//             ${generateSource('srcsetWebp1x', '', 'image/webp', false)}
//             ${generateSource('srcset1x', '', '', false)}
//             <img {% if isLazy %}data-lazy{% endif %} src="{{ static('img/front/stub.png') }}" data-src="{{ data.w${middleSize}_url }}" alt="{{ alt }}" style="background-color: {{ color }}">
//         </picture>
//     {% endif %}
// {% endmacro %}`;
// };



// const generateLocal = (sizeMob, sizeDesc) => {
//     const res = generateMacros(
//         [
//             sizeMob / 320,
//             sizeDesc / 1000
//         ],
//         [
//             {
//                 scrW: 414,
//                 imgSizeInd: 0,
//                 scales: [1.5, 2]
//             },
//             {
//                 scrW: 768,
//                 imgSizeInd: 1,
//                 scales: [1.5]
//             },
//             {
//                 scrW: 1024,
//                 imgSizeInd: 1,
//                 scales: [1, 1.5]
//             },
//             {
//                 scrW: 1366,
//                 imgSizeInd: 1,
//                 scales: [1, 1.5]
//             },
//             {
//                 scrW: 1680,
//                 imgSizeInd: 1,
//                 scales: [1, 1.5]
//             }
//         ]
//     );

//     console.log(res);
// };

// generateLocal(280, 680);
// generateLocal(160, 120);
// generateLocal(160, 152);
// generateLocal(30, 40);

// /* eslint-enable */
