
var ES5Bind = function(){
	//bind
	if(!Function.prototype.bind){
  		Function.prototype.bind = function(){   
 			var fn = this, 
 			args = [].slice.call(arguments), 
 			object = args.shift();   
 			return function(){   
 				return fn.apply(object,args.concat([].slice.call(arguments)));   
 			}
 		}
 	}
};

module.exports = ES5Bind;