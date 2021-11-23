const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const BundleTracker = require('webpack-bundle-tracker');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const CompressionPlugin = require('compression-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV;
const isDevelopment = NODE_ENV === 'development';

const getPath = (folderName) => path.join(__dirname, folderName);

var jsonConfig = {};
try {
    jsonConfig = require('./config.json');
} catch (e) {
    jsonConfig = require('./config.test.json');
}

const JS_REGEX = /\.js$|\.es6$|\.babel$/;
const EXCLUDE_REGEX = /node_modules/;

// write static url const for LESS
fs.writeFileSync(path.join(__dirname, 'assets', 'app', 'front', 'static-url.scss'), '$static_url: \'' + (jsonConfig.HOT_RELOADING ? jsonConfig.STATIC_URL_HOT : jsonConfig.STATIC_URL) + '\';\n');

let webpackSettings = {

    devtool: isDevelopment ? 'cheap-module-source-map' : 'sourcemap',

    mode: isDevelopment ? 'development' : 'production',

    entry: {
        front: getPath('./assets/app/front/App'),
    },

    output: {
        filename: isDevelopment ? 'app/[name]/main.js' : 'app/[name]/main.[hash].js',
        path: getPath('static'),
        publicPath: jsonConfig.HOT_RELOADING ? 'http://127.0.0.1:9999/static/' : undefined
    },

    resolve: {
        modules: [
            'node_modules',
            'assets/app',
            'assets/custom_libs/',
            'assets/app/front/',
            'assets/js/',
            'assets'
        ]
    },

    optimization: {},

    resolveLoader: {
        modules: [getPath('node_modules')]
    },

    devServer: {
        historyApiFallback: true,
        noInfo: false,
        headers: {
            "Access-Control-Allow-Origin": "\*",
        },
        contentBase: false,
        clientLogLevel: 'warning',
        port: 9999,
        hot: true
    },

    module: {
        rules: [{
            test: JS_REGEX,
            exclude: EXCLUDE_REGEX,
            enforce: 'pre',
            use: [{
                loader: 'eslint-loader',
                options: {
                    fix: true
                }
            }]
        }, {
            test: JS_REGEX,
            exclude: EXCLUDE_REGEX,
            use: [{
                loader: 'babel-loader',
                query: {
                    presets: [
                        [
                            '@babel/preset-env', {
                                'targets': {
                                    'ie': '11',
                                    'chrome': '69',
                                    'firefox': '60',
                                    'safari': '10',
                                    'edge': '42',
                                    'ios': '10'
                                }
                            }
                        ]
                    ]
                }
            }]
        }, {
            test: /reverse\.js$/,
            use: ['imports-loader?me=>{}', 'exports-loader?me.Urls']
        }, {
            test: /\.jinja$/,
            use: {
                loader: 'nunjucks-loader',
                options: {
                    config: __dirname + '/nunjucks.config.js'
                }
            }
        }, {
            test: /\.scss$/,
            use: [{
                loader: jsonConfig.HOT_RELOADING ? "style-loader" : MiniCssExtractPlugin.loader
            }, {
                loader: "css-loader",
            }, {
                loader: 'postcss-loader',
                options: {
                    plugins() {
                        return [
                            postcssPresetEnv()
                        ];
                    }
                }
            }, {
                loader: "sass-loader"
            }]
        }, {
            test: /\.(png|jpe?g|webp|gif|mp4)(\?.*)?$/,
            loader: 'file-loader',
            // options: {
            //     name: '[name].[hash:8].[ext]',
            //     outputPath: 'img/',
            //     publicPath: 'static/img/'
            // }
        }, {
            test: /\.css$/,
            use: [{
                loader: MiniCssExtractPlugin.loader
            }, {
                loader: "css-loader"
            }, {
                loader: 'postcss-loader',
                options: {
                    plugins() {
                        return [
                            postcssPresetEnv()
                        ];
                    }
                }
            }]
        }, {
            test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: 'file-loader',
                // options: {
                //     name: '[hash].[ext]',
                //     outputPath: 'fonts/',
                //     publicPath: '/static/fonts/'
                // }
            }]
        }]
    },

    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                getPath('static/app/front'),
            ]
        }),
        /*new WebpackShellPlugin({
            onBuildStart:['python manage.py collectstatic_js_reverse --settings=config.control_reverse']
        }),*/
        new MiniCssExtractPlugin({
            filename: isDevelopment ? 'app/[name]/main.css' : 'app/[name]/main.[hash].css'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                isStaging: (NODE_ENV === 'development' || NODE_ENV === 'staging'),
                NODE_ENV: `"${NODE_ENV}"`
            }
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new SVGSpritemapPlugin(getPath('assets/svg/front/*.svg'), {
            output: {
                filename: 'svg/front.sprite.svg',
                svg4everybody: false,
                svgo: true
            },
            sprite: {
                prefix: false,
                generate: {
                    use: true
                }
            }
        }),
        new CopyWebpackPlugin({
            patterns: [{
                from: 'assets/img/',
                to: 'img/'
            }, {
                from: 'assets/favicon/',
                to: 'favicon/'
            },{
                from: 'assets/custom_libs/',
                to: 'custom_libs/'
            }, {
                from: 'assets/fonts/',
                to: 'fonts/'
            }]
        }),
        new BundleTracker({
            path: __dirname,
            filename: './webpack.front.stats.json'
        })
    ],

    performance: {
        hints: false
    },

    stats: {
        colors: true,
        hash: false,
        version: false,
        timings: false,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        // errors: false,
        errorDetails: false,
        warnings: true,
        publicPath: false
    }
};

if (!isDevelopment) {
    webpackSettings.plugins.push(new CompressionPlugin());
}

module.exports = webpackSettings
