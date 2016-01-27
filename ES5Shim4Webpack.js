var ES5Bind = require("./ES5Shim/bind");
var ES5Filter = require("./ES5Shim/filter");
var getFunctionContent = require("./tools/getFunctionContent");
/*
  ES5Shim4Webpack constructor
 */
var ES5Shim4Webpack = function(options){
  this.options = options||{};
  /*output the warnings*/
  if (options.warnings) {
    if(!Function.prototype.bind){
      console.warning("The running context does not support the bind method.");
    }
    if (!Array.prototype.filter){
      console.warning("The running context does not support the bind method.");
    }
  }
  /*output the context*/
  if (options.logContext) {
    /* global define, exports, module */
    if (typeof define === 'function') {
      console.log("AMD+CMD");
    } else if (typeof exports === 'object') {
      console.log("Node");
    } else {
      console.log("Browser");
    }
  }
};

ES5Shim4Webpack.prototype.apply = function(compiler){
  
  compiler.plugin('emit', function(compilation, callback) {
    for (var filename in compilation.assets) {
      /*fix the bind*/
      // var _ES5Bind = "\n\t//bind \
      //   \n\tif(!Function.prototype.bind){\
      //   \n\t\tFunction.prototype.bind = function(){\
      //   \n\t\t\tvar fn = this,\
      //   \n\t\t\targs = [].slice.call(arguments),\
      //   \n\t\t\tobject = args.shift(); \
      //   \n\t\t\treturn function(){ \
      //   \n\t\t\t\treturn fn.apply(object,args.concat([].slice.call(arguments)));\
      //   \n\t\t\t}\
      //   \n\t\t}\
      //   \n\t}\
      //   \n";
      var _ES5Bind = getFunctionContent(ES5Bind);

      /*fix the filter*/
      // var _ES5Filter = "\n\t//filter\
      //   \n\tif (!Array.prototype.filter){\
      //   \n\t\tArray.prototype.filter = function(fun /*, thisp*/){\
      //   \n\t\t\tvar len = this.length;\
      //   \n\t\t\tif (typeof fun != 'function') throw new TypeError(); \
      //   \n\t\t\tvar res = [];\
      //   \n\t\t\tvar thisp = arguments[1];\
      //   \n\t\t\tfor (var i = 0; i < len; i++){\
      //   \n\t\t\t\tif (i in this){\
      //   \n\t\t\t\t\tvar val = this[i]; // in case fun mutates this \
      //   \n\t\t\t\t\tif (fun.call(thisp, val, i, this)) res.push(val);\
      //   \n\t\t\t\t}\
      //   \n\t\t\t}\
      //   \n\t\t\treturn res;\
      //   \n\t\t}\
      //   \n\t}\
      //   \n";
      var _ES5Filter = getFunctionContent(ES5Filter);
      
      /*prev webpack add the fixs*/
      compilation.assets[filename]["_source"]["children"][0]["children"][1]["_source"]["_value"] = _ES5Bind+_ES5Filter+"\n\n"+ 
      compilation.assets[filename]["_source"]["children"][0]["children"][1]["_source"]["_value"];
    }
    callback();
  })
};

module.exports = ES5Shim4Webpack;