var funnyFunction = {

    //数字相关
    math: {

        //四舍五入
        //params:Number,Number
        decimal: function(num, v) {
            var vv = Math.pow(10, v);
            return Math.round(num * vv) / vv;
        },

        //精确相乘
        //params:Number,Number
        accMul: function(arg1, arg2) {
            var m = 0,
                s1 = arg1.toString(),
                s2 = arg2.toString();
            try {
                m += s1.split(".")[1].length
            } catch (e) {}
            try {
                m += s2.split(".")[1].length
            } catch (e) {}
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
        },

        //千位分隔符
        //params:String
        //返回:123,456,789
        milliDivision: function(s) {
            var num = s + "";
            var re = /(-?\d+)(\d{3})/;
            while (re.test(num)) {
                num = num.replace(re, "$1,$2");
            }
            return num;
        }
    },

    //字符串相关
    string: {
        url: {
            /** 
			/* 2015-1-13 yc   
			/* url解析
			/* params :String
			/* @url   http://abc.com:8080/dir/index.html?id=255&m=hello#top
			//SAMPLE
			// var myURL = parseURL('http://abc.com:8080/dir/index.html?id=255&m=hello#top'); 
			// alert(myURL.file); // = 'index.html' 
			// myURL.hash; // = 'top' 
			// myURL.host; // = 'abc.com' 
			// myURL.query; // = '?id=255&m=hello' 
			// myURL.params; // = Object = { id: 255, m: hello } 
			// myURL.path; // = '/dir/index.html' 
			// myURL.segments; // = Array = ['dir', 'index.html'] 
			// myURL.port; // = '8080' 
			// myURL.protocol; // = 'http' 
			// myURL.source; // = 'http://abc.com:8080/dir/index.html?id=255&m=hello#top' 
			*/
            parse: function(url) {
                var anchor = document.createElement('a');
                anchor.href = url;
                return {
                    source: url,
                    protocol: anchor.protocol.replace(':', ''),
                    host: anchor.hostname,
                    port: anchor.port,
                    query: anchor.search,
                    params: (function() {
                        var ret = {},
                            seg = anchor.search.replace(/^\?/, '').split('&'),
                            len = seg.length,
                            i = 0,
                            str;
                        for (; i < len; i++) {
                            if (!seg[i]) {
                                continue;
                            }
                            str = seg[i].split('=');
                            ret[str[0]] = str[1];
                        }
                        return ret;
                    })(),
                    file: (anchor.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
                    hash: anchor.hash.replace('#', ''),
                    path: anchor.pathname.replace(/^([^\/])/, '/$1'),
                    relative: (anchor.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
                    segments: anchor.pathname.replace(/^\//, '').split('/')
                };
            },

            //返回当前url参数
            //params:String
            param: function(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return window.unescape(r[2]);
                return null;
            },

            //返回当前url完整路口
            fullPath: function() {
                return window.location.protocol + "//" + window.location.host + window.location.pathname;
            }
        },

        //对象转换成字符串
        //params: JSON Object
        objectToStr: function(o) {
            var
                str = (function obj2str(o) {
                    var r = [];
                    if (typeof o == "string" || o == null) {
                        return o;
                    }
                    if (typeof o == "object") {
                        if (!o.sort) {
                            r[0] = "{"
                            for (var i in o) {
                                r[r.length] = i;
                                r[r.length] = ":";
                                if (typeof o[i] == 'object' && o[i].top && o[i].window && o[i].location) {
                                    r[r.length] = "ve";
                                } else {
                                    r[r.length] = obj2str(o[i]);
                                }
                                r[r.length] = ",";
                            }
                            if (r.length > 1) r[r.length - 1] = "}";
                            else r[r.length] = "}";
                        } else {
                            r[0] = "["
                                // alert(o.length);
                            for (var i = 0; i < o.length; i++) {
                                r[r.length] = obj2str(o[i]);
                                r[r.length] = ",";
                            }
                            if (r.length > 1) r[r.length - 1] = "]";
                            else r[r.length] = "]";
                        }
                        return r.join("");
                    }
                    return o.toString();
                })(o);
            return str.replace(/[\r\n]/g, '');
        },

        //根据字符串计算hash数值
        hash: function(a) {
            var b, c = 1,
                d = 0;
            if (!this.IsEmpty(a))
                for (c = 0, b = a.length - 1; b >= 0; b--)
                    d = a.charCodeAt(b), c = (c << 6 & 268435455) + d + (d << 14), d = 266338304 & c, c = 0 != d ? c ^ d >> 21 : c;
            return c
        },

        //返回计算字符串（中英文）变量的长度
        //params:String
        len: function(str) {
            return str.replace(/[^\x00-\xff]/g, "aaa").length;
        },

        //截取定长字符串 包含中文处理  
        //(串,长度,增加...)  
        subString: function(str, len, hasDot) {
            var newLength = 0;
            var newStr = "";
            var chineseRegex = /[^\x00-\xff]/g;
            var singleChar = "";
            var strLength = str.replace(chineseRegex, "**").length;
            for (var i = 0; i < strLength; i++) {
                singleChar = str.charAt(i).toString();
                if (singleChar.match(chineseRegex) != null) newLength += 2;
                else newLength++;

                if (newLength > len) break;
                newStr += singleChar;
            }
            if (hasDot && strLength > len) newStr += "...";
            return newStr;
        },

        /*
         *json对象字符串替换
         * rpl('<div>{{data.name}}</div>',{name:"chenchangwen"})
         */
        rpl: function(tmp, data) {
            if (!ve) return false;
            tmp = tmp.replace(/\{\{(.*?)\}\}/gi, function(a, b) {
                return eval(b);
            });
            return tmp;
        }
    },

    //日期相关
    date: {
        //返回两个日期之间的天数差
        //params:Date,Date
        diffDay: function(date1, date2) {
        	var stringToTime= function(){
        		var f = window.string.split(' ', 2);
	            var d = (f[0] ? f[0] : '').split('-', 3);
	            var t = (f[1] ? f[1] : '').split(':', 3);
	            return (new Date(
	                parseInt(d[0], 10) || null, (parseInt(d[1], 10) || 1) - 1,
	                parseInt(d[2], 10) || null,
	                parseInt(t[0], 10) || null,
	                parseInt(t[1], 10) || null,
	                parseInt(t[2], 10) || null
	            )).getTime();
        	}
            var type1 = typeof date1,
                type2 = typeof date2;
            if (type1 == 'string')
                date1 = this.stringToTime(date1);
            else if (date1.getTime)
                date1 = date1.getTime();
            if (type2 == 'string')
                date2 = this.stringToTime(date2);
            else if (date2.getTime)
                date2 = date2.getTime();
            return (date2 - date1) / (1000 * 60 * 60 * 24);
        }
    },

    //数组相关
    array: {
        //去重
        unique: function() {
            var ret = [];
            var hash = {};
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                var key = typeof(item) + item;
                if (hash[key] !== 1) {
                    ret.push(item);
                    hash[key] = 1;
                }
            }
            return ret;
        }
    },

    //JSON相关
    json: {
        
    },

    //对象相关
    obj: {
        //调用对象所有方法,arguments:过滤方法名
        //params:Object
        callFn: function(obj) {
            var arg, sum = 0,
                name = '',
                fn;
            for (var fname in obj) {
                sum = 0;
                for (var i = 1; i < arguments.length; i++) {
                    arg = arguments[i];
                    if (fname === arg) {
                        sum++;
                    }
                }
                if (sum === 0) {
                    fn = obj[fname];
                    if (typeof fn === 'function') {
                        fn();
                    }
                }
            };
        },

        //返回类型
        //params: Object
        type: function(object) {
            return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
        },

        //类数组对象转换成数组，如arguments
        arg2arr: function(args) {
            return Array.prototype.slice.call(args);
        },

        //返回数量
        //params: Object
        size: function(obj) {
            var size = 0,
                key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        }
    },

    //文档对象模型相关
    dom: {

        //返回当前window大小对象
        windowSize: function() {
            var doch = window.innerHeight || document.documentElement.offsetHeight || document.body.clientHieght;
            var docw = window.innerWidth || document.documentElement.offsetWidth || document.body.clientWidth;
            var docST = document.documentElement.scrollTop || document.body.scrollTop;
            var docSL = document.documentElement.scrollLeft || document.body.scrollLeft;
            return {
                dw: docw,
                dh: doch,
                st: docST,
                sl: docSL
            };
        },

        //[jquery]获取element的实际大小及位置
        //params: element
        ElementSize: function(element) {
            if (!$(element).length) return;
            var offset = $(element).offset();
            offset.bottom = offset.top + $(element).height();
            offset.right = offset.left + $(element).width();
            offset.width = $(element).width();
            offset.height = $(element).height();
            return offset;
        }
    },

    //通用相关


    //变量相关
    variable: {
        //是否为空
        isEmpty: function(a) {
            return void 0 == a || "-" == a || "" == a
        }
    },

    //样式相关
    style: {
        //返回当前元素style
        //params: element
        get: function(element) {
            return element.currentStyle || document.defaultView.getComputedStyle(element, null);
        }
    },
    //基础类型判断相关
    baseType:{
    	isNumber:function(s){
    		return !isNaN(s)
    	},
    	isString:function(s){
    		return typeof s ==='string';
    	},
    	isBoolean:function(s)
    	{
    		return typeof s ==='boolean';
    	},
    	isFunction:function(s)
    	{
    		return typeof s ==='funciton';
    	},
    	isNull:function(s)
    	{
    		return s===null;
    	},
    	isUndefined:function(s)
    	{
    		return typeof s ==='undefined';
    	},
    	isEmpty:function(s)
    	{
    		return /^\s*$/.test(s);
    	},
    	isArray:function(s)
    	{
    		return s instanceof Array;
    	}
    }
}


/*这不是毛线注释*/