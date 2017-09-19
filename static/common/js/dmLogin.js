$('#addUser').modal({
	show: false,
	backdrop: 'static'
});
$(function() {
	viewfunction();
	$(".dingLogin").click(function() {
		$("#dingLogin").show();
		$("#userLogin").hide();
	})
	$(".userLogin").click(function() {
		$("#userLogin").show();
		$("#dingLogin").hide();
	})
	var hanndleMessage = function(event) {
		var loginTmpCode = event.data; //拿到loginTmpCode后就可以在这里构造跳转链接进行跳转了
		var origin = event.origin;
		window.location.href = 'https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=dingoaipb9gn5unu3cbnmk&response_type=code&scope=snsapi_login&state=123&redirect_uri=http://dm.devel.2dupay.com/dmLogin.html&loginTmpCode=' + loginTmpCode
	};
	if(typeof window.addEventListener != 'undefined') {
		window.addEventListener('message', hanndleMessage, false);
	} else if(typeof window.attachEvent != 'undefined') {
		window.attachEvent('onmessage', hanndleMessage);
	}
	var redirect = encodeURIComponent('https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=dingoaipb9gn5unu3cbnmk&response_type=code&scope=snsapi_login&state=123&redirect_uri=http://dm.devel.2dupay.com/dmLogin.html');
	var obj = DDLogin({
		id: "dingLogin",
		goto: redirect,
		style: "",
		href: "",
		width: "300px",
		height: "300px"
	});
	getDingCode();
});

//function iframeform(url) //创建form和iframe
//{
//	var object = this;
//	object.time = new Date().getTime();
//	object.form = $('<form action="' + url + '" target="iframe' + object.time + '" method="post" style="display:none;" id="form' + object.time + '" name="form' + object.time + '"></form>');
//	//name 属性必须
//	object.addParameter = function(parameter, value) {
//		$("<input type='hidden' />")
//			.attr("name", parameter)
//			.attr("value", value)
//			.appendTo(object.form);
//	}
//
//	object.send = function() {
//		var iframe = $('<iframe data-time="' + object.time + '" style="display:none;" id="iframe"' + object.time + '" name="iframe' + object.time + '"></iframe>'); 
//		$("body").append(iframe);
//		$("body").append(object.form);
//		object.form.submit();
//		iframe.load(function() {
//			$('#form' + $(this).data('time')).remove();
//			$(this).remove();
//		});
//	}
//}
///******************************/
///*
// *用法
// */
//var PostData = { //需要发送的数据
//	vid: $(this).data(vid),
//	msg: TMdata.msg,
//	time: timeformatted,
//	fontSize: TMdata.fontSize,
//	fontMode: TMdata.fontMode,
//	fontColor: TMdata.fontColor,
//	timestamp: timestamp()
//};
//
//var dummy = new iframeform('TM.html');
//dummy.addParameter('vid', PostData.vid);
//dummy.addParameter('msg', PostData.msg);
//dummy.addParameter('time', PostData.time);
//dummy.addParameter('fontSize', PostData.fontSize);
//dummy.addParameter('fontMode', PostData.fontMode);
//dummy.addParameter('fontColor', PostData.fontColor);
//dummy.addParameter('timestamp', PostData.timestamp);
//dummy.send();
//!function (window, document) {
//  function d(a) {
//      var e, c = document.createElement("iframe"),
//          d = "https://login.dingtalk.com/login/qrcode.htm?goto=" + a.goto ;
//      d += a.style ? "&style=" + a.style : "",
//          d += a.href ? "&href=" + a.href : "",
//          c.src = d,
//          c.frameBorder = "0",
//          c.allowTransparency = "true",
//          c.scrolling = "no",
//          c.width =  "365px",
//          c.height = "400px",
//          e = document.getElementById(a.id),
//          e.innerHTML = "",
//          e.appendChild(c)
//  }
//  window.DDLogin = d
//}(window, document);

/*
 * 扫码登录获取code值
 */
function getDingCode() {
	var searchValue = window.location.search.slice(1).split("&");
	var vauleObj = {};
	for(var i = 0; i < searchValue.length; i++) {
		var key = searchValue[i].split("=")[0];
		var value = searchValue[i].split("=")[1];
		vauleObj[key] = value;
	}
	var code = vauleObj.code;
	console.log(code);
	if(!!code) {
		$.ajax({
			type: "get",
			contentType: 'application/json',
			url: "/api/dingding/login",
			dataType: 'json',
			data: "code=" + code,
			success: function(result) {
				console.log(result);
				if(result.errcode == 0) {
					var name = result.userName;
					var isAdmin = result.isAdmin;
					var id = result.userInfoid;
					sessionStorage.setItem("isAdmin", isAdmin);
					sessionStorage.setItem("username", name);
					sessionStorage.setItem("id", id);
					idLogin(id);
				} else if(result.errcode == "60121") {
					$("#userLogin").show();
					$("#dingLogin").hide();
					Messager.show({
						Msg: "您不是本公司的员工，请使用账号登录",
						iconImg: 'warning',
						isModal: false
					});
				} else if(result.errcode == "201") {
					var userid = result.userid;
					addDingdingUser(userid);
					$("#addUser").modal('show');
				} else {
					var ms = result.errmsg + "<br/>请使用账号登录";
					$("#userLogin").show();
					$("#dingLogin").hide();
					Messager.show({
						Msg: ms,
						iconImg: 'warning',
						isModal: false
					});
				}
			}
		});
	}
}

/*
 * 新增钉钉用户
 */
function addUser(userid) {
	var userName = $("#userAccount").val();
	var password = $("#cofirmPassword").val();
	var addData = {
		"dingdingUserid": userid,
		"userName": userName,
		"password": password
	}
	$.ajax({
		type: "post",
		url: '/api/dingding/add',
		data: JSON.stringify(addData),
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			console.log(result)
			if(result.errcode == "10") {
				var name = result.userName;
				var isAdmin = result.isAdmin;
				var id = result.userInfoid;
				sessionStorage.setItem("isAdmin", isAdmin);
				sessionStorage.setItem("username", name);
				sessionStorage.setItem("id", id);
				var fn = idLogin(id);
				Messager.show({
					Msg: "您已成功注册，即将为您登录",
					isModal: false,
					isHideDate: 1500,
					callbackfn: fn
				});
			} else {
				var ms = result.errmsg + "请使用账号登录";
				$("#userLogin").show();
				$("#dingLogin").hide();
				Messager.show({
					Msg: ms,
					iconImg: 'warning',
					isModal: false
				});
			}
		},
		error: function() {
			Messager.show({
				Msg: "连接服务器失败",
				iconImg: 'warning',
				isModal: false
			});
		}
	});
}
/*
 * 生成时间戳
 */
function timestamp() {
	var getTimestamp = new Date().getTime();
	getTimestamp = "&t=" + getTimestamp;
	return getTimestamp;
};

/*
 * 用户登录开始函数
 */
function signIns() {
	var userName = $("#userName").val().trim();
	var passwords = $("#password").val().trim();
	var loginUrl = null;
	var checkNav = null;
	var data = {
		"userName": userName,
		"password": passwords,
	};
	if(userName == "" && !passwords == "") {
		Messager.show({
			Msg: '用户名不能为空',
			iconImg: 'warning',
			isModal: false
		});
	};
	if(passwords == "" && !userName == "") {
		Messager.show({
			Msg: '密码不能为空',
			iconImg: 'warning',
			isModal: false
		});
	};
	if(passwords == "" && userName == "") {
		Messager.show({
			Msg: '用户名不能为空',
			iconImg: 'warning',
			isModal: false
		});
	};
	if(!passwords == "" && !userName == "") {
		rememberPassword(data);
		$.ajax({
			type: "post",
			url: '/login',
			data: JSON.stringify(data),
			contentType: "application/json",
			dataType: 'json',
			success: function(result) {
				if(result.code == 200) {
					var name = result.data.userName;
					var isAdmin = result.data.admin;
					var id = result.data.id;
					sessionStorage.setItem("isAdmin", isAdmin);
					sessionStorage.setItem("username", name);
					sessionStorage.setItem("id", id);
					idLogin(id);
				} else {
					resetLogin();
					var ms = result.message;
					Messager.show({
						Msg: ms,
						iconImg: 'warning',
						isModal: false
					});
				}
			},
			error: function() {
				Messager.show({
					Msg: "连接服务器失败",
					iconImg: 'warning',
					isModal: false
				});
			}
		});
	};
};
/*
 * 登录接口
 */
function idLogin(id) {
	var topBarData = {
		operateType: "permissionQuery",
		loginUserId: id
	};
	/*
	 * 获取顶部导航栏（topbar）
	 */
	$.ajax({
		type: 'get',
		url: '/topBar/list',
		contentType: "application/json",
		dataType: 'json',
		data: topBarData,
		success: function(result) {
			if(result.code == 200) {
				var result = result.data;
				var data = [];
				var step = 0;
				for(var i in result) {
					if(result[i].topBarCode != "testing") {
						var obj = {
							"topBarCode": result[i].topBarCode,
							"topBarName": result[i].topBarName
						};
						data.push(obj);
					}
				};
				/*
				 * 长度为0，提示无法进入
				 * 长度大于0，取第一个系统code进去
				 * 若第一个为SP，特殊处理（包括两层树的结构）
				 */
				if(data.length == 0) {
					Messager.show({
						Msg: "您没有进入系统的权限！",
						iconImg: 'warning',
						isModal: false
					});
				} else if(data.length > 0) {
					var menuValue = new Object();
					var firstTopBarCode = data[0].topBarCode;
					for(var k in data) {
						var topBarCode = data[k].topBarCode;
						menuValue[topBarCode] = data[k].topBarName;
					};
					menuValue = JSON.stringify(menuValue);
					sessionStorage.setItem("platformPermissions", menuValue);
					sessionStorage.setItem("listFlag", 0);
					if(data[0].topBarCode == "sp") {
						var spUrlValue = loadSPValue(id, firstTopBarCode);
						var firstUrl = getCustomertree(spUrlValue);
						window.location.href = firstUrl;
					} else {
						var firstUrl = loadMenu(id, firstTopBarCode);
						window.location.href = firstUrl;
					}
				};
			} else {
				resetLogin();
				var ms = result.message;
				Messager.show({
					Msg: ms,
					iconImg: 'warning',
					isModal: false
				});
			}
		}
	});
}
/*
 * 记住密码，并将用户名和密码存储在localstorage中
 * localstorage名称acpa;base64键值对存储
 */
function rememberPassword(data) {
	var base = new Base64();
	if($("#remember").prop("checked")) {
		var value = localStorage.getItem("acpa");
		var userName = base.encode(data.userName);
		var passwords = base.encode(data.password);
		if(value == null) {
			var newValue = new Object();
			newValue[userName] = passwords;
			localStorage.setItem("acpa", JSON.stringify(newValue));
		} else {
			value = JSON.parse(value);
			value[userName] = passwords;
			localStorage.setItem("acpa", JSON.stringify(value));
		};
	}
};
/*
 * 自动获取用户名焦点
 */
function viewfunction() {
	var base = new Base64();
	$("input[name=user_name]").focus();
	$("input[name=user_name]").on("blur", function() {
		var accout = $("input[name=user_name]").val();
		accout = base.encode(accout);
		var acpa = localStorage.getItem("acpa");
		if(acpa != null) {
			acpa = JSON.parse(acpa);
			for(var key in acpa) {
				if(key == accout) {
					var psd = acpa[key];
					psd = base.decode(psd);
					$("input[name=password]").val(psd);
					$("#remember").prop("checked", true);
				}
			}
		}
	});
	$("#remember").on("change", function() {
		if($("#remember").prop("checked")) {

		} else {
			var value = localStorage.getItem("acpa");
			var accout = $("input[name=user_name]").val();
			if(value != null) {
				value = JSON.parse(value);
				var userName = base.encode(accout);
				delete value[userName];
				localStorage.setItem("acpa", JSON.stringify(value));
			}
		}
	})
}
/*
 * 回车键登录
 */
var funcRef = function(evt) {
	evt = evt || window.event;
	if(evt.keyCode == 13) {
		signIns();
	}
};
window.onkeydown = funcRef;
/*
 * 重置输入框
 */
function resetLogin() {
	$("#userName").val("");
	$("#password").val("");
};
/**
 *加载导航栏，如为SP时特殊加载
 */

//加载左侧导航栏列表（非sp平台）（dm  data）
function loadMenu(id, code) {
	var userUrl = "";
	var checkNav = "";
	var updata = {
		"loginUserId": id,
		"topBarCode": code
	}
	$.ajax({
		type: 'get',
		url: '/permissionMenuFunction/permissionSearch/query',
		contentType: "application/json",
		dataType: 'json',
		data: updata,
		async: false,
		success: function(result) {
			var data = result.data;
			var navHtml = "";
			var permissionFunction = new Object();
			var num = null;
			if(result.code === 200 && data != null) {
				function getURL() {
					for(var key in data) {
						if(!data[key].url == "") {
							userUrl = "/" + code + "/index.html" + data[key].url;
							checkNav = data[key].menuName;
							sessionStorage.setItem("checkNav", checkNav);
							return userUrl;
						};
					}
				}
				userUrl = getURL();
				for(var key in data) {
					if(data[key].parentId == -1) {
						num = 0;
						for(var k in data) {
							if(data[key].menuCode == data[k].parentId) {
								num++;
							}
						}
						if(num == 0) {
							navHtml += "<li class='navList'><i class=\"icon iconfont " + data[key].icon + " listIcon\"></i><a data-menucode='" + data[key].menuCode + "' href=\"/" + code + "/index.html" + data[key].url + "\">" + data[key].menuName + "</a></li>";
							var fnCode = new Object();
							for(var o in data[key].functionList) {
								var functionCode = data[key].functionList[o].functionCode;
								fnCode[functionCode] = functionCode;
							}
							permissionFunction[data[key].menuCode] = fnCode;
						} else if(num > 0) {
							navHtml += "<li><i class=\"icon iconfont " + data[key].icon + " listIcon\"></i><a href=\"javascript:void(0)\">" + data[key].menuName + "</a><ul>";
							for(var k in data) {
								if(data[key].menuCode == data[k].parentId) {
									navHtml += "<li class='navList'><a data-menucode='" + data[k].menuCode + "' href=\"/" + code + "/index.html" + data[k].url + "\">" + data[k].menuName + "</a></li>";
									var fnCode = new Object();
									for(var o in data[k].functionList) {
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
				sessionStorage.setItem("permissionFunction", JSON.stringify(permissionFunction));
				sessionStorage.setItem("menuList", navHtml);
			} else {
				Messager.show({
					Msg: '暂无数据',
					iconImg: 'warning',
					isModal: false
				});
			}
		}
	});
	return userUrl;
}
/*
 * 加载sp导航栏列表
 */
function loadSPValue(id, code) {
	var userUrl = "";
	var checkNav = "";
	var updata = {
		"loginUserId": id,
		"topBarCode": code
	}
	$.ajax({
		type: 'get',
		url: '/permissionMenuFunction/permissionSearch/query',
		contentType: "application/json",
		dataType: 'json',
		data: updata,
		async: false,
		success: function(result) {
			var data = result.data;
			var navHtml = "";
			var navIconHtml = "";
			var permissionFunction = new Object();
			var num = null;
			if(result.code === 200 && data != null) {
				function getURL() {
					for(var key in data) {
						if(!data[key].url == "") {
							userUrl = data[key].url;
							checkNav = data[key].menuName;
							sessionStorage.setItem("checkNav", checkNav);
							return userUrl;
						};
					}
				}
				userUrl = getURL();
				for(var key in data) {
					if(data[key].parentId == -1) {
						num = 0;
						for(var k in data) {
							if(data[key].menuCode == data[k].parentId) {
								num++;
							}
						}
						if(num == 0) {
							navHtml += "<li class='navList'><i class=\"icon iconfont " + data[key].icon + " listIcon\"></i><a data-menucode='" + data[key].menuCode + "' data-href=\"" + data[key].url + "\">" + data[key].menuName + "</a></li>";
							navIconHtml += "<li class='treeList' data-value=\"" + data[key].menuName + "\" data-href=\"" + data[key].url + "\"><i class=\"icon iconfont " + data[key].icon + " listIcon\"></i></li>";
							var fnCode = new Object();
							for(var o in data[key].functionList) {
								var functionCode = data[key].functionList[o].functionCode;
								fnCode[functionCode] = functionCode;
							}
							permissionFunction[data[key].menuCode] = fnCode;
						} else if(num > 0) {
							navHtml += "<li><i class=\"icon iconfont " + data[key].icon + " listIcon\"></i><a data-href=\"javascript:void(0)\">" + data[key].menuName + "</a><ul>";
							navIconHtml += "<li class='treeListParent' id=\"" + data[key].icon + "\"><i class=\"icon iconfont " + data[key].icon + " listIcon\" data-href=\"javascript:void(0)\"></i><ul id=\"ul" + data[key].icon + "\">";
							for(var k in data) {
								if(data[key].menuCode == data[k].parentId) {
									navHtml += "<li class='navList'><a data-menucode='" + data[k].menuCode + "' data-href=\"" + data[k].url + "\">" + data[k].menuName + "</a></li>";
									navIconHtml += "<li class='treeList' data-value=\"" + data[k].menuName + "\" data-href=\"" + data[k].url + "\">" + data[k].menuName + "</li>";
									var fnCode = new Object();
									for(var o in data[k].functionList) {
										var functionCode = data[k].functionList[o].functionCode;
										fnCode[functionCode] = functionCode;
									}
									permissionFunction[data[k].menuCode] = fnCode;
								}
							}
							navHtml += "</ul></li>";
							navIconHtml += "</ul></li>"
						}
					}
				};
				sessionStorage.setItem("permissionFunction", JSON.stringify(permissionFunction));
				sessionStorage.setItem("navIconHtml", navIconHtml);
				sessionStorage.setItem("menuList", navHtml);
			} else {
				Messager.show({
					Msg: '暂无数据',
					iconImg: 'warning',
					isModal: false
				});
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

function treeMenu(data, value) {
	var listtree = $("<ul></ul>")
	var j = 0;
	var type1, type2;
	if(value == "merchantDevice.html") {
		type1 = "merchantDevice.html";
		type2 = "storeDevice.html";
	} else {
		type1 = value;
		type2 = value;
	}
	for(var i in data) {
		if(data[i].parentId == -1) {
			$("<li></li>").append("<a data-treeid='" + data[i].treeId + "' data-id='" + data[i].id + "' href=\"" + type1 + "?customerId=" + data[i].id + "&treeId=" + data[i].treeId + "&type=" + data[i].type + "\">" + data[i].abb + "</a>").append("<ul></ul>").appendTo(listtree);
			forData(data[i].id, data, listtree.children().eq(j).children().eq(1), type2);
			j++;
		}
	};
	return listtree.html();
};

function forData(parentId, data, parentHtmlDom, type2) {
	var w = 0;
	var isExists = 0;
	var temp = type2;
	for(var j in data) {
		if(data[j].parentId == parentId) {
			isExists = 1;
			if(type2 == "merchant.html") {
				if(data[j].type == 3) {
					type2 = "storeDetial.html"
					setValue();
				} else {
					setValue();
				}
			} else {
				setValue();
			}
			type2 = temp;
			forData(data[j].id, data, parentHtmlDom.children().eq(w).children().eq(1), type2);
			w++;
		};
	};
	if(isExists == 0) {
		parentHtmlDom.remove();
	};

	function setValue() {
		$("<li></li>").append("<a data-treeid='" + data[j].treeId + "' data-id='" + data[j].id + "' href=\"" + type2 + "?customerId=" + data[j].id + "&treeId=" + data[j].treeId + "&type=" + data[j].type + "\">" + data[j].abb + "</a>").append("<ul></ul>").appendTo(parentHtmlDom);
	};
};

function gettree(data, value) {
	var idNum = null;
	var value = value.split("/")[3];
	var num = null;
	var number = null;
	idNum = data[0].id;
	var customerTreeHtml = treeMenu(data, value);
	sessionStorage.setItem("treeValue", customerTreeHtml);
	sessionStorage.setItem("checkTree", idNum);
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
			data = result.data;
			if(data.length > 0) {
				for(var k in data) {
					if(data[k].parentId == -1) {
						url = type + "?customerId=" + data[k].id + "&treeId=" + data[k].treeId + "&type=" + data[k].type;
						return;
					}
				}
			} else {
				Messager.show({
					Msg: '列表获取失败',
					iconImg: 'warning',
					isModal: false
				});
			};
		}
	});
	gettree(data, type);
	return url;
}

/**
 * 钉钉新用户验证
 */
function addDingdingUser(userid) {
	$('#addUserModal')
		.bootstrapValidator({
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {
				userAccount: {
					validators: {
						notEmpty: {
							message: '密码不能为空'
						}

					}
				},
				accountPsd: {
					validators: {
						notEmpty: {
							message: '密码不能为空'
						}
					}
				},
				cofirmPassword: {
					validators: {
						notEmpty: {
							message: '密码不能为空'
						},
						identical: {
							field: 'accountPsd',
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
			addUser(userid);

		});
}
//弹出框结构
$(function() {
	window.Messager = function() {
		var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
		/*弹出框的html结构*/
		var alr = $(['<div id="messager-dialogue" class="modal fade" style="margin-top:100px;">', '<div class="modal-dialog modal-sm">', '<div class="modal-content" style="position: relative;">', '<div class="modal-header" style="padding-bottom:5px;font-family: \"微软雅黑\";">', '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true" style="position: absolute;top:5px;right:8px;">×</span>', '<span class="sr-only">Close</span>', '</button>', '<h4 class="modal-title" style="color:#7b7b7b">', '<i class="fa fa-exclamation-circle"></i> [Title]', '</h4>', '</div>', '<div class="modal-body small">', '<div class="row">', '<div class="col-xs-12 center-block">[MessagerIcon]</div>', '<div class="col-xs-12 center-block messageText" style="margin-top:20px;font-size:16px;margin-bottom:30px">[Message]</div>', '<div class="col-xs-12 center-block">', '<button type="button" class="ok" data-dismiss="modal">[BtnOk]</button>', '<button type="button" class="cancel" data-dismiss="modal">[BtnCancel]</button>', '</div>', '</div>', '</div>', '</div>', '</div>', '</div>'].join(''));
		var ahtml = alr.html();
		/*alert弹出框*/
		var _alert = function(options) {
			alr.html(ahtml);
			alr.find('.ok').removeClass('btn-success').addClass('btn-primary');
			alr.find('.cancel').hide();
			_dialog(options);
			return {
				/*回调函数*/
				on: function(callback) {
					if(callback && callback instanceof Function) {
						alr.find('.ok').click(function(e) {
							e.preventDefault();
							callback(true);
						});
					}
				}
			};
		};
		/*confirm弹出框*/
		var _confirm = function(options) {
			alr.html(ahtml);
			alr.find('.cancel').show();
			_dialog(options);
			return {
				on: function(callback) {
					if(callback && callback instanceof Function) {
						alr.find('.ok').click(function(e) {
							e.preventDefault();
							callback(true);
						});
						alr.find('.cancel').click(function(e) {
							e.preventDefault();
							callback(false);
						});
					}
				}
			};
		};
		/*自动消失的alert弹出框*/
		var _show = function(options) {
			alr.html(ahtml);
			alr.find('.ok').removeClass('btn-success').addClass('btn-primary');
			alr.find('.cancel').hide();
			alr.find('.ok').hide();
			_dialog(options);
			/*判断是否使用默认值，还是用户传入的值*/
			if(options.isHideDate) {
				setTimeout(function() {
					eval(options.callbackfn);
					$("#messager-dialogue").modal("hide");
				}, options.isHideDate);
			} else {
				setTimeout(function() {
					eval(options.callbackfn);
					$("#messager-dialogue").modal("hide");
				}, 1500);
			}
			return {
				on: function(callback) {
					if(callback && callback instanceof Function) {
						alr.find('.ok').click(function() {
							callback(true);
						});

					}

				}
			};
		};
		var _dialog = function(options) {
			/*默认的参数信息*/
			var ops = {
				Msg: "",
				/*显示给用户看的内容*/
				iconImg: 'info',
				/*提示的图标 默认图片是info,只是消息而已*/
				title: "提示",
				/*提示标题*/
				isModal: false,
				/*模态状态开关*/
				btnOk: "确定",
				/*确定按钮的默认文字*/
				btnCancel: "取消",
				/*取消按钮的默认文字*/
				isHideDate: 1500,
				/*设置自动消失的时间*/
				callbackfn: "" /*回调函数*/
			};
			/*传入的值，和默认值进行替换*/
			$.extend(ops, options);
			/*替换模板dom结构里面的内容*/
			var html = alr.html().replace(reg, function(node, key) {
				return {
					Title: ops.title,
					Message: ops.Msg,
					BtnOk: ops.btnOk,
					BtnCancel: ops.btnCancel,
					MessagerIcon: '<img class="messagerIcon" style="width:80px;" src="sp/common/images/' + ops.iconImg + '.png">'
				}[key];
			});
			alr.html(html);
			alr.modal({
				width: 600,
				backdrop: 'static'
			});
			/*模态默认样式清除*/
			//$("body").css("padding", 0);
			/*设置模态状态*/
			if(!ops.isModal) {
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