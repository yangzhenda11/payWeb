
/**
 * modal窗点击外部不能关闭问题解决
 */
$('#changePassword').modal({show:false,backdrop:'static'});
$('#addMerchantModal,#merchantDetails,#editMerchantModal,#detailsModal').modal({show:false,backdrop:'static'});
$('#storeDetails,#editStoreModal,#addStoreModal,#addUserModal,#editModal').modal({show:false,backdrop:'static'});
/**
 * 一些网页跳转函数
 */
function godeviceConfigList(){
	window.location.href="deviceConfigList.html?" + timestamp();
}
function gopayChannelList(){
	window.location.href="payChannelList.html?" + timestamp();
}
function gouserList(){
	window.location.href="userList.html?" + timestamp();
}
/**
 * 左部导航栏收缩功能引用
 */
function dropdown(){
	$('#nav').tendina({
        animate: true,
        speed: 500,
        openCallback: function($clickedEl) {
          
        },
        closeCallback: function($clickedEl) {
          
        }
  });
}
/**
 * 左部导航树收缩功能引用
 */
function treedropdown(){
	$(".listTree").treemenu({delay:300}).openActive();
}

$(function(){
	/**
	 * 判断按钮是否隐藏部分权限
	 */
	function showUnwrap(){
		var isAdmin = sessionStorage.getItem("isAdmin");
		var roleId = sessionStorage.getItem("roleId");
		var platformPermissions = sessionStorage.getItem("platformPermissions");
		var data = JSON.parse(platformPermissions);
		$(".logoBarContent .menu").remove();
		for(var i in data){
			$(".logoBarContent").append("<a href=\"javascript:void(0)\" class=\"menu navuncheck\" data-topbarcode="+i+">"+data[i]+"</a>");
		};
		$(".menu[data-topbarcode='sp']").removeClass("navuncheck").addClass("navcheck");
		tabPlatform();
	}
	showUnwrap();
	
	/**
	 * 导航栏添加高亮效果
	 */
	function switchNav(){
		$("#nav .navList a").click(function(){
			var checkNav = this.innerText;
			sessionStorage.setItem("checkNav",checkNav);
			var toUrl = getCustomertree($(this).data("href"));
			window.location.href = toUrl;
		});
		$("#navIcon .treeList").on("click",function(){
			var checkNav = $(this).data("value");
			sessionStorage.setItem("checkNav",checkNav);
			var toUrl = getCustomertree($(this).data("href"));
			window.location.href = toUrl;
		});
		var len = $("#nav a").length;
		var navbar = sessionStorage.getItem("checkNav");
		for(var i=0;i<len;i++){
			if($("#nav li a")[i].innerHTML == navbar){
				if(!$("#nav li a").eq(i).parent().parent().hasClass("navList")){
					$("#nav li a").eq(i).parent().parent().css("display","block")
				}
				$("#nav li a").eq(i).addClass("checkNav");
				$("#nav li a").eq(i).parent().find("i").css("color","#fff");
			}
		};
		var lenght = $("#navIcon li").length;
		for(var i=0;i<lenght;i++){
			if($($("#navIcon li")[i]).data("value") == navbar){
				if($("#navIcon li").eq(i).parent().parent().hasClass("treeListParent")){
					$("#navIcon li").eq(i).parent().parent().addClass("checked");
				}else{
					$("#navIcon li").eq(i).addClass("checked");
				}
			}
		}
		$("#navIcon .checked").hover(function(){
			$(this).css({"background":"#44b549","color":"#fff"});
			$(this).children().eq(1).css({"color":"#333"});
		});
		$("#nav .checkNav").hover(function(){
			$(this).css({"background":"#44b549","color":"#fff"});
		});
	}
	switchNav();
});
/**
 * 导航树添加高亮效果-------
 */
function checkNav(){
	$("#listTree a").on("click",function(){
		var checkTreeValue = $(this).data("id");
		var spValue = this.href.split("?")[1];
		sessionStorage.setItem("spValue",spValue);
		sessionStorage.setItem("checkTree",checkTreeValue);
	});
	var checkTree = sessionStorage.getItem("checkTree");
	var len = $("#listTree a").length;
	var spValue = sessionStorage.getItem("spValue");
	for(var i=0;i<len;i++){
		if($($("#listTree a")[i]).data("id") == checkTree){
			$($("#listTree a")[i]).addClass("checkTree");
			$($("#listTree a")[i]).parent().addClass("active");
			if(!spValue){
				var isAdmin = sessionStorage.getItem("isAdmin");
				if(isAdmin == "false"){
					$($("#listTree a")[i]).siblings("ul").children().first().addClass("active");
				}				
			}
		}
	};
}
/**
 * 加载左侧导航栏
 */
function showNavbar() {
	var navHtml = sessionStorage.getItem("menuList");
	var navIconHtml = sessionStorage.getItem("navIconHtml");
	$("#navIcon").empty();
	$("#nav").empty();
	$("#nav").html(navHtml);
	$("#navIcon").html(navIconHtml);
	dropdown();
	hoverNav();
};
showNavbar();
/**
 * 大屏下左侧导航栏划过效果
 */
function hoverNav(){
	$("#nav li a").hover(function(){
		$(this).css("background","#eee");
	},function(){
		$(this).css("background","#fff");
	});
	
}
hoverNav();

//填充左侧列表树内容
function setTreeValue(){
	var value = sessionStorage.getItem("treeValue");
	$("#listTree").empty();
	$("#listTree").html(value);
}

/**
 * 为商户页面修改树时调用，设置树的内容并存入本地
 */

function gettreevalue(value) {
	var customerTreeHtml = "";
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
				customerTreeHtml = treeMenu(data,value);
			}else{
				Messager.show({Msg: '列表获取失败',iconImg: 'warning', isModal: false});
			};
			
		}
	});
	sessionStorage.setItem("treeValue",customerTreeHtml);
};

/**
 * 以下3个function为递归便利列表树
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

function forData (parentId,data,parentHtmlDom,type2){
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
	var checkTree = sessionStorage.getItem("checkTree");
	if(!checkTree){
		sessionStorage.setItem("checkTree",idNum);
	}
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
			var spValue = sessionStorage.getItem("spValue");			
			if(spValue){
				var types = spValue.split("&")[2].split("=")[1];				
				if(type == "/sp/customer/merchant.html"){
					if(types == 3){
						spUrl = "/sp/customer/storeDetial.html";
					}else {
						spUrl = "/sp/customer/merchant.html";
					}
				}else if(type == "/sp/deviceList/merchantDevice.html"){
					if(types == 1){
						spUrl = "/sp/deviceList/merchantDevice.html";
					}else{
						spUrl = "/sp/deviceList/storeDevice.html";
					}
				}else{
					spUrl = type;
				};
				url = spUrl + "?" + spValue;
			}else{
				if(data.length > 0){
					for(var k in data){
						if(data[k].parentId == -1){
							url = type+"?customerId="+data[k].id+"&treeId="+data[k].treeId+"&type="+data[k].type;
							return;
						}
					}
				}else{
					Messager.show({Msg: '列表获取失败',iconImg: 'warning', isModal: false});
				};
			}			
		}
	});
	gettree(data,type);
	return url;
}

//搜索查询function
$("#searchlistTree i").on("click",function(){
	searchlistTree();
});
function searchlistTree(){
	var searchValue = $("#searchTreeValue").val();
	setTreeValue();  //设置列表树内容
	var len = $("#listTree a").length;	
	if(!searchValue == ""){
		for(var i=0;i<len;i++){
			if($($("#listTree a")[i]).text().indexOf(searchValue)>=0){
		        $($("#listTree a")[i]).addClass("searchTree");
				$($("#listTree a")[i]).parent().addClass("active");
			};
		};
		var len = $(".searchTree").length;
		var html = "";
		for(var i = 0; i< len; i++){
			var treeId = $($(".searchTree")[i]).data("treeid");
			var treeIdLen = treeId.length;
			var step = treeIdLen/4-1;
			var vali = 1;			
			for(var k = 0; k < step; k++){
				var num = (k+1)*4;
				var id = treeId.substring(0,num);
				for(var j = 0;j < len; j++){
					if(id == $($(".searchTree")[j]).data("treeid")){
						vali = 0;
						break;
					}
				}
				if(vali ==  0){
					break;
				}
			}
			if(vali == 1){
				html += "<li>" + $($(".searchTree")[i]).parent().html() +"</li>";
			}
		}
		$("#listTree").empty();
		$("#listTree").html(html);
	}
	checkNav();			//选择高亮显示
	treedropdown();		//加载列表树格式
}
var funcRef = function(evt){
    evt = evt || window.event;
    if (evt.keyCode==13){
        searchlistTree();
    }
}
window.onkeydown = funcRef;



//样式设置
$(function(){
	var flagStatue = sessionStorage.getItem("listFlag");
	if(flagStatue == 0){
		$("#control i").removeClass("icon-xiangyouzhankai").addClass("icon-xiangzuoshouqi-copy");
		$(".leftContainer").css("width","14%");
		$(".rightContainer").css("width","69.8%");
		$("#nav").css("display","block");
		$("#navIcon").css("display","none");
	}else if(flagStatue == 1){
		$("#control i").removeClass("icon-xiangzuoshouqi-copy").addClass("icon-xiangyouzhankai");
		$(".leftContainer").css("width","4%");
		$(".rightContainer").css("width","80%");
		$("#nav").css("display","none");
		$("#navIcon").css("display","block");
	};
	$("#icon-iconfontchanpin").hover(function(){
		$("#ulicon-iconfontchanpin").fadeIn("50");
	},function(){
		$("#ulicon-iconfontchanpin").fadeOut("50");
	});
	$("#icon-peizhi").hover(function(){
		$("#ulicon-peizhi").fadeIn("50");
	},function(){
		$("#ulicon-peizhi").fadeOut("50");
	});
});
function setstyle(){
	var height = $(".rightContainer").height()+30;
	$(".leftContainer").css({"min-height":height});
	$(".listTree").css({"height":height-55,"overflow":"auto"});
}
$("#control i").on("click",function(){
	var flag = sessionStorage.getItem("listFlag");
	if(flag == 0){
		$(".leftContainer").animate({ 
			width: "4%",
		},500);
		$(".rightContainer").animate({ 
			width: "80%",
		},500 ,function(){
			sessionStorage.setItem("listFlag","1");
			$("#control i").removeClass("icon-xiangzuoshouqi-copy").addClass("icon-xiangyouzhankai");
			$("#nav").css("display","none");
			$("#navIcon").css("display","block");
			setstyle();
		});
	}else if(flag == 1){
		$("#nav").css("display","block");
		$("#navIcon").css("display","none");
		$(".leftContainer").animate({ 
			width: "14%",
		}, 500);
		$(".rightContainer").animate({ 
			width: "69.9%",
		}, 500 ,function(){
			sessionStorage.setItem("listFlag","0");
			$("#control i").removeClass("icon-xiangyouzhankai").addClass("icon-xiangzuoshouqi-copy");
			setstyle();
		});
	};
});

