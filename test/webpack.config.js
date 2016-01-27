var webpack = require('webpack');
var ES5Shim4Webpack = require("../ES5Shim4Webpack");
module.exports = {
	entry: "./app.js",
	output: {
		path: __dirname + "/build/",
		filename: "bundle.js"
	},
    module: {
        loaders: [
            {test: /\.css$/, loader: "style!css" },
            {test: /\.scss$/, loader: "style!css"},
        ]
    }
    /*use the plugins*/
    ,plugins: [
        new ES5Shim4Webpack({
            warnings: true, 
            logContext: true
        })
    ]
};