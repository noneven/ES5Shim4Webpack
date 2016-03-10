
##ES5Shim4Webpack
解决webpack打包css/img到js后不支持ES5的问题

## run

* install ==> npm install shim4webpack

>var ES5Shim4Webpack = require("shim4webpack");
 plugins: [
	new ES5Shim4Webpack({
    	warnings: true, 
    	logContext: true
	})
]

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
##效果
```javascript
/******/ (function(modules) { // webpackBootstrap
/******/
/******/    //bind
/******/	if(!Function.prototype.bind){
/******/  		Function.prototype.bind = function(){   
/******/ 			var fn = this, 
/******/ 			args = [].slice.call(arguments), 
/******/ 			object = args.shift();   
/******/ 			return function(){   
/******/ 				return fn.apply(object,args.concat([].slice.call(arguments)));   
/******/ 			}
/******/ 		}
/******/ 	}

/******/	//filter
/******/	if (!Array.prototype.filter){
/******/		Array.prototype.filter = function(fun /*, thisp*/){
/******/ 			var len = this.length;
/******/ 			if (typeof fun != "function") throw new TypeError(); 
/******/ 			var res = new Array();
/******/ 			var thisp = arguments[1];
/******/ 			for (var i = 0; i < len; i++){
/******/ 				if (i in this){
/******/ 					var val = this[i]; // in case fun mutates this
/******/ 					if (fun.call(thisp, val, i, this)) res.push(val);
/******/ 				}
/******/ 			} 
/******/ 			return res;
/******/		}
/******/	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ 
```
