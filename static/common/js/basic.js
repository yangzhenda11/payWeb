/*
* 页面读取缓存(第*页)
* code:页面code
* fn:页面执行的函数
*/
function isCache(code,fn){
	var readCache = sessionStorage.getItem("readCache");
	if(readCache == 1){
		var cacheValue =  sessionStorage.getItem("cache");
		cacheValue = JSON.parse(cacheValue);
		if(cacheValue[code] == code){
			var pageNum = cacheValue.pageNum;
			fn(pageNum);
			sessionStorage.removeItem("readCache");
		}else{
			fn(1);
		}
	}else{
		fn(1);
	};
}

/*
 * 设备类型判断
 * 返回该设备类型
 */
function determineType(data){
	var deviceModel = "";
	switch (data) {
        case 1:
            deviceModel = "RC";
            break;
        case 2:
            deviceModel = "基础版";
            break;
        case 3:
            deviceModel = "兼容版";
            break;
        case 4:
            deviceModel = "加强版";
            break;
        default:
            deviceModel = "未知类型";
    };
    return deviceModel;
}
/*
 * 设备类型解析，并填充
 * 参数：所要填充select框的名称
 */
function getDeviceModelList(name){
	$.ajax({
        url: '/deviceModel/list',
        dataType: 'json',
        success: function (result) {
            isSuccessCode(result.code);
            var html = "<option value='0'>全部</option>";
            var model = "";
            if (result.code === 200) {
                var modelList = result.data;
                var modelArr = new Array();
                for (var i in modelList) {
                    switch (modelList[i].type) {
                        case 1:
                            model = "RC";
                            break;
                        case 2:
                            model = "基础版";
                            break;
                        case 3:
                            model = "兼容版";
                            break;
                        case 4:
                            model = "加强版";
                            break;
                        default:
                            model = "未知类型";
                    };
                    if (modelArr.indexOf(model) < 0) {
                        modelArr.push(model);
                        html += "<option value='" + modelList[i].type + "'>" + model + "</option>";
                    }
                }
            }else{
            	var ms = result.message;
            	ToolTipTop.Show(ms,"error");
            }
            $(""+name+"").html(html);
        }
    })
};

/**
 * 表单元素序列化
 */
function form2json($form) {
    var o = {};
    var a = $form.serializeArray();
    $.each(a, function(index, value) {
        if (o[value.name]) {
            if (!o[value.name].push) {
                o[value.name] = [o[value.name]];
            }
            o[value.name].push(value.value || '');
        } else {
            o[value.name] = value.value || '';
        }
    });

    return JSON.stringify(o);
}
/**
 * 生成时间戳
 */
function timestamp(){
	var getTimestamp=new Date().getTime();  
	getTimestamp = "&t="+getTimestamp;
    return getTimestamp;  
}
/**
 * 下载文件（接收下载地址）
 */
function download_file(url) {	
	if(typeof(download_file.iframe) == "undefined") {
		var iframe = document.createElement("iframe");
		download_file.iframe = iframe;
		document.body.appendChild(download_file.iframe);
	}
	download_file.iframe.src = url;
	download_file.iframe.style.display = "none";
}
/**
 * 判断链接是否有效
 */
function IsLoad(_url,fun){
  $.ajax({
      url:_url,
      dataType:'json',
      processData: false, 
      type:"get",
      success:function(){
        //说明请求的url存在，并且可以访问
        if($.isFunction(fun)){
                fun(true);
              }
      },
      statusCode:{
        404:function(){
          //说明请求的url不存在
          if($.isFunction(fun)){
            fun(false);
          }
        }
      }
    });
}

/**
 * 判断JSON对象是否为空
 * jQuery方法
 * console.log(isEmptyObject());           //true  
 * console.log(isEmptyObject({}));         //true  
 * console.log(isEmptyObject(null));       //true  
 * console.log(isEmptyObject(23));         //true  
 * console.log(isEmptyObject({"te": 2}));      //false  
 */
function isEmptyObject(e) {  
    var t;  
    for (t in e)  
        return !1;  
    return !0  
}  
//扩展Date的format方法
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
/**
 *转换日期对象为日期字符串
 * @param date 日期对象
 * @param isFull 是否为完整的日期数据,
 *               为true时, 格式如"2000-03-05 01:05:04"
 *               为false时, 格式如 "2000-03-05"
 * @return 符合要求的日期字符串
 */
function getSmpFormatDate(date, isFull) {
    var pattern = "";
    if (isFull == true || isFull == undefined) {
        pattern = "yyyy-MM-dd hh:mm:ss";
    } else {
        pattern = "yyyy-MM-dd";
    }
    return getFormatDate(date, pattern);
}
/**
 *转换当前日期对象为日期字符串
 * @param date 日期对象
 * @param isFull 是否为完整的日期数据,
 *               为true时, 格式如"2000-03-05 01:05:04"
 *               为false时, 格式如 "2000-03-05"
 * @return 符合要求的日期字符串
 */

function getSmpFormatNowDate(isFull) {
    return getSmpFormatDate(new Date(), isFull);
}
/**
 *转换long值为日期字符串
 * @param l long值
 * @param isFull 是否为完整的日期数据,
 *               为true时, 格式如"2000-03-05 01:05:04"
 *               为false时, 格式如 "2000-03-05"
 * @return 符合要求的日期字符串
 */

function getSmpFormatDateByLong(l, isFull) {
    if(l<1000){
        return '';
    }
    return getSmpFormatDate(new Date(l), isFull);
}
/**
 *转换long值为日期字符串
 * @param l long值
 * @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss
 * @return 符合要求的日期字符串
 */

function getFormatDateByLong(l, pattern) {
    if(l<1000){
        return '';
    }
    return getFormatDate(new Date(l), pattern);
}
/**
 *转换日期对象为日期字符串
 * @param l long值
 * @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss
 * @return 符合要求的日期字符串
 */
function getFormatDate(date, pattern) {
    if (date == undefined) {
        return '';
    }
    if (pattern == undefined) {
        pattern = "yyyy-MM-dd hh:mm:ss";
    }
    return date.format(pattern);
}

//alert(getSmpFormatDate(new Date(1279849429000), true));
// console.log(getSmpFormatDate(new Date(1279849429000),false));
//alert(getSmpFormatDateByLong(1279829423000, true));
// console.log(getSmpFormatDateByLong(1279829423000,false));
//alert(getFormatDateByLong(1279829423000, "yyyy-MM"));
//alert(getFormatDate(new Date(1279829423000), "yy-MM"));
// console.log(getFormatDateByLong(1279849429000, "yyyy-MM hh:mm:ss"));


//超时退出
function isSuccessCode(code) {
    if (code == "301") {
    	sessionStorage.clear();
        window.location.href='../index.html';
        return;
    } else if(code.code == "301"){
    	sessionStorage.clear();
        window.location.href='../index.html';
        return;
    };
}
//退出登录
function logout() {
    $.ajax({
        type: "POST",
        url: '/logout',
        success: function (data) {
        	sessionStorage.clear();
            window.location = "../index.html";
        }
    });
}

/**
 * 平台切换
 */
function tabPlatform(){
	$(".menu").on("click",function(){
		var topBarCode = $(this).data('topbarcode');
		var userId = sessionStorage.getItem("id");
		if(topBarCode == "sp"){
			var spUrlValue = loadSPValue(userId,topBarCode);
			var firstUrl = getCustomertree(spUrlValue);
			window.location.href = firstUrl;
		}else{
			var firstUrl = loadMenu(userId,topBarCode);
			removeSPStorage();
			window.location.href = firstUrl;
		}
	})
}

/*
 * 删除缓存(SP平台)
 */
function removeSPStorage(){
	sessionStorage.removeItem("checkTree");
	sessionStorage.removeItem("navIconHtml");	
	sessionStorage.removeItem("treeValue");
	sessionStorage.removeItem("spValue");
}

/*
 * 分页
 */
function paging(totalCount,pageSize,nowPageIndex,fn){
	var total_pages = Math.ceil(totalCount / pageSize);
	var page_index_current = nowPageIndex;
	var page_pre;
	var page_post;
	if(Math.ceil(totalCount / pageSize) <= 1) {
		page_pre = 1;
		page_post = 1;
	} else {
		if(page_index_current === 1) {
			page_pre = 1;
			page_post = 2;
		} else if(page_index_current === Math.ceil(totalCount / pageSize)) {
			page_pre = page_index_current - 1;
			page_post = page_index_current;
		} else {
			page_pre = page_index_current - 1;
			page_post = page_index_current + 1;
		}
	}

	var pagination_html = "<li><a href=\"javascript: "+fn+"(" + page_pre + ");\">上一页</a></li>";
	if(page_index_current <= 5) {
		if(Math.ceil(totalCount / pageSize) < 10) {
			for(var i = 1; i <= Math.ceil(totalCount / pageSize); i++) {
				var pageIndex = i;
				if(pageIndex === page_index_current) {
					pagination_html += "<li class='active'><a href=\"javascript: "+fn+"(" + pageIndex + ");\">" +
						pageIndex + "</a></li>";
				} else {
					pagination_html += "<li><a href=\"javascript: "+fn+"(" + pageIndex + ");\">" +
						pageIndex + "</a></li>";
				}
			}
		} else {
			for(var i = 1; i <= 10; i++) {
				var pageIndex = i;
				if(pageIndex === page_index_current) {
					pagination_html += "<li class='active'><a href=\"javascript: "+fn+"(" + pageIndex + ");\">" +
						pageIndex + "</a></li>";
				} else {
					pagination_html += "<li><a href=\"javascript: "+fn+"(" + pageIndex + ");\">" +
						pageIndex + "</a></li>";
				}
			}
		}
	} else if(page_index_current >= (Math.ceil(totalCount / pageSize) - 6)) {
		if(Math.ceil(totalCount / pageSize) < 10){
			for(var i = 1; i <= Math.ceil(totalCount / pageSize); i++) {
				var pageIndex = i;
				if(pageIndex === page_index_current) {
					pagination_html += "<li class='active'><a href=\"javascript: "+fn+"(" + pageIndex + ");\">" +
						pageIndex + "</a></li>";
				} else {
					pagination_html += "<li><a href=\"javascript: "+fn+"(" + pageIndex + ");\">" +
						pageIndex + "</a></li>";
				}
			}
		}else{
			for(var i = (Math.ceil(totalCount / pageSize) - 9); i <= Math.ceil(totalCount / pageSize); i++) {
				var pageIndex = i;
				if(pageIndex === page_index_current) {
					pagination_html += "<li class='active'><a href=\"javascript: "+fn+"(" + pageIndex + ");\">" +
						pageIndex + "</a></li>";
				} else {
					pagination_html += "<li><a href=\"javascript: "+fn+"(" + pageIndex + ");\">" +
						pageIndex + "</a></li>";
				}
			}
		}
	} else {
		for(var i = (page_index_current - 4); i <= (page_index_current + 5); i++) {
			var pageIndex = i;
			if(pageIndex === page_index_current) {
				pagination_html += "<li class='active'><a href=\"javascript: "+fn+"(" + pageIndex + ");\">" +
					pageIndex + "</a></li>";
			} else {
				pagination_html += "<li><a href=\"javascript: "+fn+"(" + pageIndex + ");\">" +
					pageIndex + "</a></li>";
			}
		}
	}
	pagination_html += "<li><a href=\"javascript: "+fn+"(" + page_post + ");\">下一页</a></li>";
	pagination_html += "<div class='divTop' style='margin-top:3px;'>&nbsp;&nbsp;共" + total_pages + "页&nbsp;";
	pagination_html += "到第<input id='pageNo' class='text special textalign' type='text' style='width: 40px;'/>页&nbsp;<button class=\"affirmBtn\" onclick=\"javascript:queryPage(" + total_pages + ","+ fn +")\">确定</button></div>";
	return pagination_html;
}
function queryPage(totalpage,fn) {
	var pageNo = $("#pageNo").val().trim();
	var pageReg = new RegExp("^\\+?[1-9][0-9]*$");
	if (pageReg.test(pageNo)) {
		if (totalpage < pageNo) {
			fn(totalpage);
		} else {
			fn(pageNo);
		}
	} else {
		ToolTipTop.Show("输入页码格式有误，请重新输入","error");
		$("#pageNo").val("");
	}
}

/*
 * 获取topBar菜单，并存入本地缓存中
 * sessionStorage名称:platformPermissions
 */
function queryTopBar(){
	var id = sessionStorage.getItem("id");
	var topBarData = {
		operateType : "permissionQuery",
		loginUserId : id
	}
	$.ajax({
	    type: 'get',
	    url: '/topBar/list',
	    contentType: "application/json",
	    dataType: 'json',
	    data:topBarData,
	    async: false,
	    success: function (result) {
	    	if(result.code == 200){
	    		var data = result.data;	        	
        		var menuValue = new Object();
        		for(var k in data){
        			var topBarCode = data[k].topBarCode;
        			menuValue[topBarCode] = data[k].topBarName;
        		};
        		menuValue = JSON.stringify(menuValue);
        		sessionStorage.setItem("platformPermissions",menuValue);	        			        	
	    	} else {
				var ms = result.message;
				ToolTipTop.Show(ms,"error");
	    	}
	    }
	});
}
/**
 *加载导航栏，如为SP时特殊加载
 */

//加载左侧导航栏列表(非sp平台)
function loadMenu(id,code){	
	var userUrl = "";
	var checkNav = "";
	var updata = {
		"loginUserId":id,
		"topBarCode":code
	}
	$.ajax({
        type: 'get',
        url: '/permissionMenuFunction/permissionSearch/query',
        contentType: "application/json",
        dataType: 'json',
        data:updata,
        async: false,
        success: function (result) {
			var data = result.data;
        	var navHtml = "";
        	var permissionFunction = new Object();
        	var num = null;
        	isSuccessCode(result.code);
			if (result.code === 200 && data != null) {
				function getURL(){
					for(var key in data){
		        		if(!data[key].url == ""){
			        		userUrl = "/"+code+"/index.html"+data[key].url;
			        		checkNav = data[key].menuName;
			        		sessionStorage.setItem("checkNav",checkNav);
			        		return userUrl;
			        	};
		        	}
				}
				userUrl = getURL();
    			for(var key in data){
	        		if(data[key].parentId == -1){
	        			num = 0;
	        			for(var k in data){
	        				if(data[key].menuCode == data[k].parentId){
	        					num++;
	        				}
	        			}
	        			if(num == 0){
	        				navHtml += "<li class='navList'><i class=\"icon iconfont "+data[key].icon+" listIcon\"></i><a data-menucode='"+data[key].menuCode+"' href=\"/"+code+"/index.html"+data[key].url+"\">"+data[key].menuName+"</a></li>";
	        				var fnCode = new Object();
	        				for(var o in data[key].functionList){
	        					var functionCode = data[key].functionList[o].functionCode;
	        					fnCode[functionCode] = functionCode;
	        				}
	        				permissionFunction[data[key].menuCode] = fnCode;
	        			}else if(num > 0){
	        				navHtml += "<li><i class=\"icon iconfont "+data[key].icon+" listIcon\"></i><a href=\"javascript:void(0)\">"+data[key].menuName+"</a><ul>";
	        				for(var k in data){
		        				if(data[key].menuCode == data[k].parentId){
		        					navHtml += "<li class='navList'><a data-menucode='"+data[k].menuCode+"' href=\"/"+code+"/index.html"+data[k].url+"\">"+data[k].menuName+"</a></li>";
		        					var fnCode = new Object();
			        				for(var o in data[k].functionList){
			        					var functionCode = data[k].functionList[o].functionCode;
			        					fnCode[functionCode] = functionCode;
			        				}
			        				permissionFunction[data[k].menuCode] = fnCode;
		        				}
		        			}
	        				navHtml += "</ul></li>";
	        			}
	        		}
	        	};
	        	sessionStorage.setItem("permissionFunction",JSON.stringify(permissionFunction));
    			sessionStorage.setItem("menuList",navHtml);
    		}else{
    			ToolTipTop.Show("暂无数据","error");
    		}	        		
        }
  	});
  	return userUrl;
}

/*
 * 加载sp导航栏列表
 */
function loadSPValue(id,code){
	var userUrl = "";
	var checkNav = "";
	var updata = {
		"loginUserId":id,
		"topBarCode":code
	}
	$.ajax({
        type: 'get',
        url: '/permissionMenuFunction/permissionSearch/query',
        contentType: "application/json",
        dataType: 'json',
        data:updata,
        async: false,
        success: function (result) {
			var data = result.data;
        	var navHtml = "";
        	var navIconHtml ="";
        	var permissionFunction = new Object();
        	var num = null;
        	isSuccessCode(result.code);
			if (result.code === 200 && data != null) {
				function getURL(){
					for(var key in data){
		        		if(!data[key].url == ""){
			        		userUrl = data[key].url;
			        		checkNav = data[key].menuName;
			        		sessionStorage.setItem("checkNav",checkNav);
			        		return userUrl;
			        	};
		        	}
				}
				userUrl = getURL();
    			for(var key in data){
	        		if(data[key].parentId == -1){
	        			num = 0;
	        			for(var k in data){
	        				if(data[key].menuCode == data[k].parentId){
	        					num++;
	        				}
	        			}
	        			if(num == 0){
	        				navHtml += "<li class='navList'><i class=\"icon iconfont "+data[key].icon+" listIcon\"></i><a data-menucode='"+data[key].menuCode+"' data-href=\""+data[key].url+"\">"+data[key].menuName+"</a></li>";
	        				navIconHtml +="<li class='treeList' data-value=\""+data[key].menuName+"\" data-href=\""+data[key].url+"\"><i class=\"icon iconfont "+data[key].icon+" listIcon\"></i></li>";
	        				var fnCode = new Object();
	        				for(var o in data[key].functionList){
	        					var functionCode = data[key].functionList[o].functionCode;
	        					fnCode[functionCode] = functionCode;
	        				}
	        				permissionFunction[data[key].menuCode] = fnCode;
	        			}else if(num > 0){
	        				navHtml += "<li><i class=\"icon iconfont "+data[key].icon+" listIcon\"></i><a data-href=\"javascript:void(0)\">"+data[key].menuName+"</a><ul>";
	        				navIconHtml +="<li class='treeListParent' id=\""+data[key].icon+"\"><i class=\"icon iconfont "+data[key].icon+" listIcon\" data-href=\"javascript:void(0)\"></i><ul id=\"ul"+data[key].icon+"\">";
	        				for(var k in data){
		        				if(data[key].menuCode == data[k].parentId){
		        					navHtml += "<li class='navList'><a data-menucode='"+data[k].menuCode+"' data-href=\""+data[k].url+"\">"+data[k].menuName+"</a></li>";
		        					navIconHtml +="<li class='treeList' data-value=\""+data[k].menuName+"\" data-href=\""+data[k].url+"\">"+data[k].menuName+"</li>";
		        					var fnCode = new Object();
			        				for(var o in data[k].functionList){
			        					var functionCode = data[k].functionList[o].functionCode;
			        					fnCode[functionCode] = functionCode;
			        				}
			        				permissionFunction[data[k].menuCode] = fnCode;
		        				}
		        			}
	        				navHtml += "</ul></li>";
	        				navIconHtml +="</ul></li>"
	        			}
	        		}
	        	};
	        	sessionStorage.setItem("permissionFunction",JSON.stringify(permissionFunction));
    			sessionStorage.setItem("navIconHtml",navIconHtml);
    			sessionStorage.setItem("menuList",navHtml);
    		}else{
				ToolTipTop.Show("暂无数据","error");
    		}	        		
        }
  	});
	return userUrl;
}

/**
 * 以下3个function为递归遍历列表树
 * type : merchant.html  特殊，根据type==3 进入客户详情，其余进列表
 * type 允许二级扩展，type1为第一层，type2为以下层，若加需要单独定义条件
 */

function treeMenu(data,value){
	var listtree = $("<ul></ul>")
	var j = 0;
	var type1,type2;
	if(value == "merchantDevice.html"){
		type1 = "merchantDevice.html";
		type2 = "storeDevice.html";
	}else{
		type1 = value;
		type2 = value;
	}
	for(var i in data){
		if(data[i].parentId == -1){
			$("<li></li>").append("<a data-treeid='"+data[i].treeId+"' data-id='"+data[i].id+"' href=\""+type1+"?customerId="+data[i].id+"&treeId="+data[i].treeId+"&type="+data[i].type+"\">"+data[i].abb+"</a>").append("<ul></ul>").appendTo(listtree);
			forData(data[i].id,data,listtree.children().eq(j).children().eq(1),type2);
			j++;
		}
	};
	return listtree.html();
};

function forData(parentId,data,parentHtmlDom,type2){
	var w = 0;
	var isExists = 0;
	var temp = type2;
	for(var j in data){
		if(data[j].parentId == parentId){
			isExists = 1;
			if(type2 == "merchant.html"){
				if(data[j].type == 3){
					type2 = "storeDetial.html"
					setValue();
				}else{
					setValue();
				}
			}else{
				setValue();
			}
			type2 = temp;
			forData(data[j].id,data,parentHtmlDom.children().eq(w).children().eq(1),type2);
			w++;
		};
	};
	if(isExists == 0){
		parentHtmlDom.remove();
	};
	function setValue(){
		$("<li></li>").append("<a data-treeid='"+data[j].treeId+"' data-id='"+data[j].id+"' href=\""+type2+"?customerId="+data[j].id+"&treeId="+data[j].treeId+"&type="+data[j].type+"\">"+data[j].abb+"</a>").append("<ul></ul>").appendTo(parentHtmlDom);
	};
};

function gettree(data,value) {
	var idNum = null;
	var value = value.split("/")[3];
	var num = null;
	var number = null;
	idNum = data[0].id;
	var customerTreeHtml = treeMenu(data,value);
	sessionStorage.setItem("treeValue",customerTreeHtml);
	sessionStorage.setItem("checkTree",idNum);
};

/**
 * 返回第一服务商URL，并加载树的结构形式，关联gettree()递归函数;
 */
function getCustomertree(type) {
	var url = "";
	var data = null;
	$.ajax({
		type: "get",
		url: '/customer/tree/query',
		contentType: "application/json",
		dataType: 'json',
		async: false,
		success: function(result) {
			isSuccessCode(result.code);
			data = result.data;
			if(data.length > 0){
				for(var k in data){
					if(data[k].parentId == -1){
						url = type+"?customerId="+data[k].id+"&treeId="+data[k].treeId+"&type="+data[k].type;
						return;
					}
				}
			}else{
				ToolTipTop.Show("获取列表失败","error");
			};
		}
	});
	gettree(data,type);
	return url;
}
/*
 * 返回传入menucode下的functionCode
 */
function queryFnCode(){
	var menuCode = $(".checkNav").data("menucode");
	var data = sessionStorage.getItem("permissionFunction");
	data = JSON.parse(data);
	for(var k in data){
		if(k == menuCode){
			return data[k];
		}
	}
};

/*
 * 是否显示增加按钮
 */
function addBtnShow(data){
	if(data.add == "add"){
		$("#addbtn").removeClass("hidden");
	}
};
/**
 * 密码验证
 */
function changePsd() {
	$('#changePassword')
		.bootstrapValidator({
			message: 'This value is not valid',
			feedbackIcons: {
				valid: 'glyphicon',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {
				oldAccountPsd: {
					validators: {
						notEmpty: {
							message: '密码不能为空'
						}						
						
					}
				},
				newAccountPsd: {
					validators: {
						notEmpty: {
							message: '密码不能为空'
						},
						dentical: {
	                        field: 'cofirmPassword',
	                        message: '两次密码输入不同'
	                    }
					}
				},
				cofirmPassword: {
					validators: {
						notEmpty: {
							message: '密码不能为空'
						},
						identical: {
	                        field: 'newAccountPsd',
	                        message: '两次密码输入不同'
	                    }
					}
				}
			}
		})
		.on('success.form.bv', function(e) {
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			tochangePsd();
			
		});
}
//$(function () {
//   $("#btn_bianli").click(function () {
//       var showlist = $("<ul></ul>");
//       showall(menulist.menulist, showlist);
//       $("#div_menu").append(showlist);
//   });
//});
/**
 * 修改密码之前账号填写
 */
function setAccount(){
	var accountName = $("#accountName").html();
	$("#userAccount").val(accountName);
}
/**
 * load密码弹窗
 */
$(function() {
	showUserName();
//	重置表单结构，需要清除文档内容函数，否则内容会存在表单结构中
//	 $('#changePassword').on('hidden.bs.modal', function() {
//      $("#changePassword").data('bootstrapValidator').destroy();
//      $('#changePassword').data('bootstrapValidator', null);
//      setAccount();
//		changePsd();
//  });
	$("#changePassword").load("common/html/common.html?"+timestamp()+" #changePasswordModal",function(){
		setAccount();
		changePsd();		
	});
	$('#changePassword').on('hidden.bs.modal', function () {
		$("#changePassword").load("common/html/common.html?"+timestamp()+" #changePasswordModal",function(){
			setAccount();
			changePsd();
    	});
	});
	$("#load").load("common/html/common.html?"+timestamp()+" .loadEffect");
});

/*
 * load效果，须在每一个模块的common/html中单独添加;
 * loading : beforeSend中添加；
 * loadClose:加载完成后，或请求失败时添加；
 */
function loading(){	
	$("#load").css("display","block");
}
function loadClose(){
	setTimeout("loadingNone()",300);
}
function loadingNone(){
    $("#load").css("display","none");
}
/**
 * 修改密码接口掉用  处理
 */
function tochangePsd() {
	var userName = $("#userAccount").val().trim();
	var passwords = $("#oldAccountPsd").val();
	var newPassword = $("#newAccountPsd").val();
	var data = {
		"userName": userName,
		"oldPassword": passwords,
		"newPassword": newPassword
	};
	
	
	$.ajax({
		type: "post",
		url: '/user/editPassword/edit',
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			if(result.code == 200) {
				ToolTipTop.Show("修改密码成功","success");
				window.location.reload();
			} else {
				var ms = result.message;
				$("#changePassword").load("common/html/common.html?"+timestamp()+" #changePasswordModal",function(){setAccount();changePsd();});
				ToolTipTop.Show(ms,"error");
			}
		}
	});
}


/*
*        -------------------------------------------------------------------------------------------------------
 *        1、消息提示框
 *        arrObject = {
 * 			Msg: "content",           //显示给用户看的内容, 如：亲你的邮箱输入有误！
 *          iconImg: "info",          //提示的图标,  默认没有图片（info 消息  question 问题 error 错误 warning 警告）
 *          title: "提示",             //提示标题,  header上面的内容	
 *          isModal: true,            //模态状态开关  true false
 *          btnOk: "确定",             //确定按钮的默认文字 
 *          btnCancel: "取消",         //取消按钮的默认文字
 *          isHideDate： 		       //设置自动消失的时间 只对 show弹框起作用
 * 		}
 *
 *        Messager.alert(arrObject); // [上面只是说明使用的各个属性的配置] 实际使用如下：
 *        Messager.alert({title: '版本版本,进度进度', Msg: '一天就知道打麻将', isModal: false})
 *
 *        -------------------------------------------------------------------------------------------------------
 *        2、确定提示框(用法基本和上面一样,只不过会有一个回调函数,判断用户点击的是确定还是取消)  使用如下：
 *
 *        Messager.confirm({title: '只要结果,不要过程', Msg: '下次是否能修改完bug,时候能按期完成版本,能否...？', iconImg: 'question'}).on(function(flag){
 * 			if(flag){
 * 				点击确定按钮执行的操作
 * 			}else{
 * 				点击取消钮执执行的操作
 * 			}
 * 		});
 *
 *        -------------------------------------------------------------------------------------------------------
 *        3、自动消失的弹出提示框  isHideDate设置时间  尽量加上 isModal: false 非模态方式
 *        Messager.show({isModal: false, isHideDate: 2000});
 */
$(function () {
    window.Messager = function () {
        var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
        /*弹出框的html结构*/
        var alr = $(['<div id="messager-dialogue" class="modal fade" style="margin-top:200px;">', '<div class="modal-dialog" style="width:400px;">', '<div class="modal-content" style="position: relative;border-radius: 4px;border:none;">', '<div class="msModal" style="padding:10px 0 5px 20px;font-family: \"微软雅黑\";">', '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true" style="position: absolute;top:5px;right:10px;">×</span>', '<span class="sr-only">Close</span>', '</button>', '<h5 class="modal-title" style="font-size:16px;color:#7b7b7b">', '[Title]', '</h5>', '</div>', '<div class="modal-body small" style="padding-bottom:10px;">', '<div class="row">', '<div class="col-xs-12 center-block messageText" style="margin-top:10px;font-size:14px;margin-bottom:40px">[Message]</div>', '<div class="col-xs-12 center-block">','<button type="button" class="ok" data-dismiss="modal">[BtnOk]</button>', '<button type="button" class="cancel" data-dismiss="modal">[BtnCancel]</button>','</div>','</div>', '</div>', '</div>', '</div>' , '</div>'].join(''));
        var ahtml = alr.html();
        /*alert弹出框*/
        var _alert = function (options) {
            alr.html(ahtml);
            alr.find('.cancel').hide();
            _dialog(options);
            return {
                /*回调函数*/
                on: function (callback) {
                    if (callback && callback instanceof Function) {
                        alr.find('.ok').click(function (e) {
                            e.preventDefault();
                            callback(true);
                        });
                    }
                }
            };
        };
        /*confirm弹出框*/
        var _confirm = function (options) {
            alr.html(ahtml);
            alr.find('.cancel').show();
            _dialog(options);
            return {
                on: function (callback) {
                    if (callback && callback instanceof Function) {
                        alr.find('.ok').click(function (e) {
                            e.preventDefault();
                            callback(true);
                        });
                        alr.find('.cancel').click(function (e) {
                            e.preventDefault();
                            callback(false);
                        });
                    }
                }
            };
        };
        /*自动消失的alert弹出框*/
        var _show = function (options) {
            alr.html(ahtml);
            alr.find('.ok').removeClass('btn-success').addClass('btn-primary');
            alr.find('.cancel').hide();
            alr.find('.ok').hide();
            _dialog(options);
            /*判断是否使用默认值，还是用户传入的值*/
            if (options.isHideDate) {
                setTimeout(function () {
                	eval(options.callbackfn);
                    $("#messager-dialogue").modal("hide");
                }, options.isHideDate);
            } else {
                setTimeout(function () {
                	eval(options.callbackfn);
                    $("#messager-dialogue").modal("hide");
                }, 1500);
            }
            return {
                on: function (callback) {
                    if (callback && callback instanceof Function) {
                        alr.find('.ok').click(function () {
                            callback(true);
                        });
                        
                    }
                    
                }
            };
        };
        var _dialog = function (options) {
            /*默认的参数信息*/
            var ops = {
                Msg: "", /*显示给用户看的内容*/
                iconImg: '', /*提示的图标 默认图片是info*/
                title: "提示", /*提示标题*/
                isModal: false, /*模态状态开关*/
                btnOk: "确定", /*确定按钮的默认文字*/
                btnCancel: "取消", /*取消按钮的默认文字*/
                isHideDate: 1500,       /*设置自动消失的时间*/
               	callbackfn:""			/*回调函数*/
            };
            /*传入的值，和默认值进行替换*/
            $.extend(ops, options);
            /*替换模板dom结构里面的内容*/
            var html = alr.html().replace(reg, function (node, key) {
                return {
                    Title: ops.title,
                    Message: ops.Msg,
                    BtnOk: ops.btnOk,
                    BtnCancel: ops.btnCancel,
                    MessagerIcon: '<img class="messagerIcon" style="width:80px;" src="../common/images/' + ops.iconImg + '.png">'
                }[key];
            });
            alr.html(html);
            alr.modal({
                width: 1000,
                backdrop: 'static'
            });
            /*模态默认样式清除*/
            //$("body").css("padding", 0);
            /*设置模态状态*/
            if (!ops.isModal) {
                $("body > div.modal-backdrop:last").css("display", "none");
            }
        };
        /*返回给用户进行方法的调用 	可以看成接口*/
        return {
            alert: _alert,
            confirm: _confirm,
            show: _show
        };
    }();
});

/**
 * 加载用户名
 */
function showUserName(){
	var userName = sessionStorage.getItem("username");
	$("#accountName").html(userName);
}

/*
 * 信息弹出框
 */
var ToolTipTop={
 	Show:function(Msg,status,delayTime){
		$(".tooltiptop").stop();
		delayTime == null ? delayTime = 2400 : delayTime;
 		if(status == "success"){
 			var msPic = "icon-chenggong";
 			var msColor = "#44b549";
 		}else if(status == "error"){
 			var msPic = "icon-shibai11";
 			var msColor = "#d93939";
 			delayTime = 3000;
 		};
		$(".tooltiptop .main .toolValue").html("<i class='iconfont " + msPic + "' style='padding-right:15px;font-size:24px;color:" + msColor + "'></i><p class='msValue'>"+Msg+"</p>");
		$(".tooltiptop").stop().css("display","block").animate({marginTop:"0px"},400).delay(delayTime).animate({marginTop:"-50px"},400);
  	},
  	Hide:function(){
    	$(".tooltiptop").stop();
  	}
}
