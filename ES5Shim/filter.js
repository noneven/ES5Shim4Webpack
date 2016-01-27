
var ES5Filter = function(){
	//filter
	if (!Array.prototype.filter){
		Array.prototype.filter = function(fun /*, thisp*/){
 			var len = this.length;
 			if (typeof fun != "function") throw new TypeError(); 
 			var res = new Array();
 			var thisp = arguments[1];
 			for (var i = 0; i < len; i++){
 				if (i in this){
 					var val = this[i]; // in case fun mutates this
 					if (fun.call(thisp, val, i, this)) res.push(val);
 				}
 			} 
 			return res;
		}
	}
};

module.exports = ES5Filter;
