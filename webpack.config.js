const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')

const packageJson = require('./package.json');
const chromeExtensionMeta = packageJson.chromeExtension;

const entryConfigs = {
    service_worker: chromeExtensionMeta?.background?.service_worker,
    default_pop: chromeExtensionMeta?.action?.default_popup,
    options_page: chromeExtensionMeta?.options_page
};

function loadEntries(entries) {
    let entry = {};
    for (let value of Object.values(entries)) {
        if (value) {
            entry[value.name] = `./src/${value.name}.js`;
        }
    }
    return entry;
}

function getHtmlWebPackPlugins(entries) {
    const plugins = [];
    for (let value of Object.values(entries)) {
        if (value && value.page) {
            plugins.push(new HtmlWebpackPlugin(
                {
                    template: path.resolve(__dirname, `./src/${value.name}.html`),
                    filename: `${value.name}.html`,
                    chunks: [value.name]
                }
            ));
        }
    }
    return plugins;
}

function getIgnoreHtmlFileNames(entries) {
    const ignores = [];
    for (let value of Object.values(entries)) {
        if (value) {
            ignores.push(`${value.name}.html`);
        }
    }
    return ignores;
}

const entry = loadEntries(entryConfigs);
const plugins = getHtmlWebPackPlugins(entryConfigs);
const copyIgnoreExtension = [".js", ".css", ".md"];
const copyIgnoreFileName = getIgnoreHtmlFileNames(entryConfigs);

module.exports = {
    mode: "production",
    entry: entry,
    output: {
        clean: true,
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
    },

    module: {
        rules: [
            {
                test: /\.jsx$|\.es6$|\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env', {
                            "targets": {
                                "chrome": "58",
                            }
                        }]],
                    }
                },
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            minimize: true,
                            sourceMap: true,
                        }
                    },
                ],
            },
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css',
            chunkFilename: '[id].css'
        }),
        ...plugins,
        new CopyWebpackPlugin({
            patterns: [
                // { from: path.resolve(__dirname, './src/images'), to: './images/' },
                {
                    from: "**/*",
                    to: "./",
                    context: path.resolve(__dirname, "src"),
                    filter: async (resourcePath) => {
                        const extName = path.extname(resourcePath);
                        const baseName = path.basename(resourcePath);
                        if (copyIgnoreExtension.includes(extName) || copyIgnoreFileName.includes(baseName)) {
                            return false;
                        }
                        return true;
                    },

                }
            ]
        }),
    ],

};