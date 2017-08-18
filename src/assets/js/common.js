var Func = {
	setCookie: function(name,value,time) {
	  	if(!time){
	    	time = 1;
	  	}
	  	let exp = new Date();
	  	exp.setTime(exp.getTime() + time*24*60*60*1000);
	  	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	},
	getCookie: function(name) {
	  	let arr, reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	  	if (arr=document.cookie.match(reg)) {
	    	return unescape(arr[2]);
	  	} else {
	    	return null;
	  	}
	},
	delCookie: function(name) {
	  	let exp = new Date();
	  	exp.setTime(exp.getTime() - 1);
	  	let cval = this.getCookie(name);
	  	if (cval) {
	  		document.cookie= name + "="+cval+";expires="+exp.toGMTString();
	  	}
	},
	toast: function(str) {
		if (document.querySelector('.toast')) {
			return;
		}
		let body = document.querySelector('body');
		let div = document.createElement('div');
		div.className = 'toast';
		div.innerHTML = str;
		body.appendChild(div);
		setTimeout(function () {
	    	div.style.opacity = 1;
	    	setTimeout(function(){
	      		div.style.opacity = 0;
	      		setTimeout(function(){
		      		div.parentNode.removeChild(div);
		    	},350);
	    	},2000);
	  	}, 300);
	}
}

export default Func