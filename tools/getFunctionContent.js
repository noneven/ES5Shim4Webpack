
var getFunctionContent = function(fn){
	var _fn = fn.toString();
	return _fn.substring(_fn.indexOf("{") + 1,  _fn.lastIndexOf("}") - 1);
};

module.exports = getFunctionContent;