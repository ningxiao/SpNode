/** 
 * 工具类
 * @type {exports} 
 */  
var utils = {
    istype:function(obj){
        return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];     
    },
    ismatched:function(name){
    	if(name.match(/css|html|/ig)){
    		return true;
    	}
    	return false;
    },
    isexpires:function(name){
        if(name.match(/^(gif|png|jpg|js|css|swf)$/ig)){
            return true;
        }
        return false;
    },    
    nodirectory:function(path,list){
    	for(var i=0,len = list.length;i<len;i++){
    		if(path.indexOf(list[i])!=-1){
    			return false;
    		}
    	}
    	return true;
    },
    format:function(tmpl){
        var json,date = new Date();
        json = { 
            "M+" : date.getMonth()+1,
            "d+" : date.getDate(),
            "h+" : date.getHours(),
            "m+" : date.getMinutes(),
            "s+" : date.getSeconds(),
            "q+" : Math.floor((date.getMonth()+3)/3),
            "S" : date.getMilliseconds()
        } 
        if(/(y+)/.test(tmpl)) { 
            tmpl = tmpl.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
        } 
        for(var k in json) { 
            if(new RegExp("("+ k +")").test(tmpl)) { 
                tmpl = tmpl.replace(RegExp.$1, RegExp.$1.length==1 ? json[k] : ("00"+ json[k]).substr((""+ json[k]).length)); 
            } 
        } 
        return tmpl;     
    }
};
module.exports = utils;