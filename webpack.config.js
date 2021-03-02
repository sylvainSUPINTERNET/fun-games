const webpack = require("webpack");
const path = require("path");

console.log(path.resolve(__dirname, "./public"))

let config = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "./public"),
        filename: "./bundle.js",
    },
    devServer: {
        contentBase: path.resolve(__dirname, "./public"),
        watchContentBase: true,
        open: true,
        hot: true
    }
}

module.exports = config;