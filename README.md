
##ES5Shim4Webpack
解决webpack打包css/img到js后不支持ES5的问题


##概述

如果需要将css或者图片等静态资源打包到一个js文件中，这是在webpack内部会用到ES5的一些方法(bind和filter)：

* filter
```javascript
var replaceText = (function () {
	var textStore = [];
	
	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();
```
* bind
```javascript
function addStyle(obj, options) {
    	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} 
	//...
}
```

在不支持ES5的浏览器中，如果不对打包后的文件处理程序将跑不起来

##解决方案
在webpack打包的时候，拦截打包文件，动态加入ES5Shim

##用法
以webpack插件的方式引入ES5Shim4Webpack到你的webpack.config.js配置文件中
```javascript
var webpack = require('webpack');
var ES5Shim4Webpack = require("./ES5Shim4Webpack");
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
}
```
