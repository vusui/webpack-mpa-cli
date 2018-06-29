/**
 * webpack 基础配置
 */
const webpack = require('webpack');

const path = require("path");
// 引入模板插件
const HTMLWebpackPlugin = require("html-webpack-plugin");
//  环境变量
const env = process.env.NODE_ENV
// 提取js中的css
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// 引入config.js
const config = require("./config");
// 通过 html-webpack-plugin 生成的 HTML 集合
let HTMLPlugins = [];
// 入口文件集合
let Entries = {}

// 生成多页面的集合
config.HTMLDirs.forEach((page) => {
    const htmlPlugin = new HTMLWebpackPlugin({
        filename: `${page}.html`,
        template: path.resolve(__dirname, `../src/view/${page}.html`),
        chunks: [page, 'commons'],
        minify: {
            "removeAttributeQuotes": true,
            "removeComments": true,
            "removeEmptyAttributes": true,
        }
    });
    HTMLPlugins.push(htmlPlugin);
    Entries[page] = path.resolve(__dirname, `../src/js/${page}.js`);
})

module.exports = {
    // 入口文件
    entry: Entries,
    // 启用 sourceMap
    devtool: "cheap-module-source-map",
    // 输出文件
    output: {
        filename: config.staticPath + 'js/[name].bundle.[hash:7].js',
        path: path.resolve(__dirname, config.distPath),
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js'] // 配置简写，配置过后，书写该文件路径的时候可以省略文件后缀
    },
    // 加载器
    module: {
        rules: [{
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        attrs: ['img:src', 'link:href'],
                        interpolate: true
                    }
                }]
            },
            {
                // 对 css 后缀名进行处理
                test: /\.css$/,
                // 不处理 node_modules 文件中的 css 文件
                exclude: /node_modules/,
                use: env === 'prod' ?
                    ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader']
                    }) : ['style-loader', 'css-loader']
            },
            {
                test: /\.(sass|scss)$/,
                use: env === 'prod' ?
                    ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader', 'sass-loader']
                    }) : ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }],
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        // 打包生成图片的名字
                        name: config.staticPath + 'img/[name].[hash:7].[ext]'
                    }
                }],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ["url-loader"]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: config.staticPath + 'fonts/[name].[hash:7].[ext]'
                }
            }
        ],
    },
    // 插件
    plugins: [
        // new webpack.BannerPlugin('Created by YourName.')
        // 自动生成 HTML 插件
        ...HTMLPlugins
    ],
}