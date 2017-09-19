$(function() {
	setSystemHeight();
	getSystemList();
	$('#editModal,#detailsModal').modal({show:false,backdrop:'static'});
	var fnCode = queryFnCode();
	addBtnShow(fnCode);
});
//获取系统菜单
function getSystemList(){
	var obj = new Object();
	var loginUserId = sessionStorage.getItem("id");
	obj.loginUserId = loginUserId;
	$.ajax({
		type: "GET",
		url: '/topBar/list',
		contentType: "application/json",
		data:obj,
		dataType: 'json',
		async: false,
		success: function(result) {
			isSuccessCode(result.code);
			var data = result.data;
			if(result.code == 200 && data.length > 0) {
				var html = "";
				for(var i = 0; i < data.length; i++) {
					html += "<li data-code="+data[i].topBarCode+" class='systemCode'>"+data[i].topBarName+"</li>"
				}
				$("#systemContainer").html(html);
				setFirstStyle();
				systemListSwitch();
				getMenuList(1);
			} else {
				var html = "<li class='empty'>查询不到数据</li>";
				$("#systemContainer").html(html);
			}
		},
		error: function(msg) {
			ToolTipTop.Show("加载超时","error");
		}
	});
}
//列表切换
function systemListSwitch(){
	$(".systemCode").click(function(){
		$("#systemContainer li").css({"background":"#fff","color":"#555"});
		$("#systemContainer li").removeClass("checkSystem")
		$(this).css({"background":"#44b549","color":"#fff"});
		$(this).addClass("checkSystem");
		getMenuList(1);
	})
}
//设置第一个系统列表样式
function setFirstStyle(){
	var topbarCode = isReadCache();
	if(topbarCode != ""){		
		$("#systemContainer li[data-code='"+topbarCode+"']").addClass("checkSystem")
		$("#systemContainer li[data-code='"+topbarCode+"']").css({"background":"#44b549","color":"#fff"});
	}else{
		$("#systemContainer li:first-child").addClass("checkSystem")
		$("#systemContainer li:first-child").css({"background":"#44b549","color":"#fff"});
	}
}
/*
 * 判断是否读取缓存
 */
function isReadCache(){
	var readCache = sessionStorage.getItem("readCache");
	var value = "";
	if(readCache == 1){
		var cacheValue =  sessionStorage.getItem("cache");
		cacheValue = JSON.parse(cacheValue);
		if(cacheValue.menuList == "menuList"){
			value = cacheValue.topBarCode;
			sessionStorage.removeItem("readCache");
		}
	};
	return value;
}
//设置高度
function setSystemHeight(){
	var height = $(".rightContainer").height()-74;
	$(".systemDiv").css("height",height);
}
//回车搜索
var funcRef = function(evt) {
	evt = evt || window.event;
	if(evt.keyCode == 13) {
		getMenuList(1);
	}
}
window.onkeydown = funcRef;
//获取系统模块菜单列表
function getMenuList(pageIndex) {
	var totalCount = 0;
	var pageSize = 15;
	var topBarCode = $(".checkSystem").data("code");
	var loginUserId = sessionStorage.getItem("id");
	var obj = new Object();
	var menuName = $("#menuNameSearch").val();
	obj.topBarCode = topBarCode;
	obj.pageIndex = pageIndex;
	obj.pageSize = pageSize;
	obj.loginUserId = loginUserId;
	obj.menuName = menuName;
	$.ajax({
		type: "GET",
		url: '/menu/pageList',
		data: obj,
		contentType: "application/json",
		dataType: 'json',
		async: false,
		beforeSend:loading,
		success: function(result) {
			loadClose();
			isSuccessCode(result.code);
			var data = result.data;
			var dataList = data.list;
			var fnCode = queryFnCode();
			totalCount = data.listCount;
			$(".fontbold").text(totalCount);
			if(result.code == 200 && dataList.length > 0) {
				var html = null;
				for(var i = 0; i < dataList.length; i++) {
					var menuName = dataList[i].menuName == null ? '' : dataList[i].menuName;
					var menuCode = dataList[i].menuCode == null ? '' : dataList[i].menuCode;
					var urls = dataList[i].url == null ? '' : dataList[i].url;
					var description = dataList[i].description == null ? '' : dataList[i].description;
					var status = '';
					if(dataList[i].status == 0) {
						status = '禁用';
					}else if(dataList[i].status == 1){
						status = '启用';
					};
					html += "<tr><td style='text-align:center;'>" + (i+1) + "</td>";
					if(dataList[i].parentId == -1){
						html += "<td style=''>" + menuName + "</td>";
					}else{
						html += "<td style='padding-left:22px;'>" + menuName + "</td>";
					};
					html += "<td>" + menuCode + "</td>";
					html += "<td>" + urls + "</td>";
					html += "<td>" + status + "</td>";
					html += "<td style='text-align:center;'>";
					if(fnCode.details == "details"){
						html += "<a style='margin-right: 5px;cursor:pointer;overflow:hidden;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='详情' onclick='menuDetails(\"" + dataList[i].menuCode + "\");'><i class='icon iconfont icon-xiangqing operate'></i></a>";
					};
					if(fnCode.list == "list"){
						html += "<a data-toggle='tooltip' data-placement='bottom' title='当前菜单功能列表' onclick='menuFn(\"" + topBarCode + "^&^" + dataList[i].menuCode +"\");' style='margin-right: 5px;cursor:pointer;text-decoration: none;'><i class='icon iconfont icon-list operate'></i></a>";
					};
					if(fnCode.modify == "modify"){
						html += "<a style='margin-right: 5px;cursor:pointer;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='修改' onclick='editMenu(\"" + dataList[i].menuCode + "\");'><i class='icon iconfont icon-bianji operate'></i></a>";
					};
					if(fnCode.up == "up"){
						html += "<a style='margin-right: 5px;cursor:pointer;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='菜单上移' onclick='menuUp(\"" + dataList[i].menuCode + "\");'><i class='icon iconfont icon-shangyi operate'></i></a>";
					};
					if(fnCode.down == "down"){
						html += "<a style='margin-right: 5px;cursor:pointer;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='菜单下移' onclick='menuDown(\"" + dataList[i].menuCode + "\");'><i class='icon iconfont icon-xiayi operate'></i></a>";
					};
					if(fnCode.delete == "delete"){
						html += "<a data-toggle='tooltip' style='cursor:pointer;text-decoration: none;' data-placement='bottom' title='删除' onclick='deleteDictionary(\"" + dataList[i].menuCode + "\");'><i class='icon iconfont icon-shanchu operate'></i></a></td></tr>";
					};					
					html += "</td></tr>"
				}
				$("#menuListTable tbody").html(html);				
				var pageIndex = data.pageIndex;
				var fn = "getMenuList";
				var pagination_html = paging(totalCount,pageSize,pageIndex,fn);
				$("#pagination").html(pagination_html);
				setSystemHeight();
			} else {
				$("#menuListTable tbody").html("<tr><td colspan='6' style='text-align:center;'>查询不到数据！</td></tr>");
				$("#pagination").html("");
			}
		},
		error: function(msg) {
			loadClose();
			ToolTipTop.Show("加载超时","error");
		}
	});
}
//新增菜单模块  点击事件
function addMenuModal() {
	var topBarCode = $(".checkSystem").data("code");
	var topBarName = $(".checkSystem").text();	
	var parameterValue = topBarCode +"^&^" + topBarName
	var parameter = {
		"menuAdd":parameterValue
	};
	var cache = {
		"topBarCode":topBarCode,
		"menuList":"menuList"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#menuAdd";
}
//菜单详情
function menuDetails(menuCode){
	var topBarCode = $(".checkSystem").data("code");
	var topBarName = $(".checkSystem").text();	
	var parameterValue = topBarCode +"^&^" + topBarName +"^&^"+ menuCode;
	var parameter = {
		"menuDetail":parameterValue
	};
	var cache = {
		"topBarCode":topBarCode,
		"menuList":"menuList"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#menuDetail";
}
//修改填充菜单
function editMenu(menuCode) {
	var topBarCode = $(".checkSystem").data("code");
	var topBarName = $(".checkSystem").text();	
	var parameterValue = topBarCode +"^&^" + topBarName +"^&^"+ menuCode;
	var parameter = {
		"menuEdit":parameterValue
	};
	var cache = {
		"topBarCode":topBarCode,
		"menuList":"menuList"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#menuEdit";
}

/*
 * 设置缓存，跳转菜单功能项
 */
function menuFn(data){
	var topBarCode = data.split("^&^")[0];
	var menuCode = data.split("^&^")[1];
	var parameterValue = topBarCode +"^&^" + menuCode;
	var parameter = {
		"addMenuFunction":parameterValue
	};
	var cache = {
		"topBarCode":topBarCode,
		"menuList":"menuList"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#addMenuFunction";
};

//上移菜单
function menuUp(id){
	var topBarCode = $(".checkSystem").data("code");
	var data = {
		"topBarCode" : topBarCode,
		"menuCode" : id		
	};
	data = JSON.stringify(data);
	$.ajax({
		type: "POST",
		url: '/menu/modify?operateType=up',
		data: data,
		beforeSend:loading,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			loadClose();
			isSuccessCode(result.code);
			if(result.code == 200) {	
				ToolTipTop.Show("修改成功","success");
				getMenuList(1);
			}else{
				var ms = result.message;
				ToolTipTop.Show(ms,"error");
			}
		},
		error: function(msg) {
			loadClose();
			ToolTipTop.Show("加载超时","error");
		}
	});
}

//下移菜单
function menuDown(id){
	var topBarCode = $(".checkSystem").data("code");
	var data = {
		"topBarCode" : topBarCode,
		"menuCode" : id		
	};
	data = JSON.stringify(data);
	$.ajax({
		type: "POST",
		url: '/menu/modify?operateType=down',
		data: data,
		beforeSend:loading,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			loadClose();
			isSuccessCode(result.code);
			if(result.code == 200) {
				ToolTipTop.Show("修改成功","success");
				getMenuList(1);
			}else{
				var ms = result.message;
				ToolTipTop.Show(ms,"error");
			}
		},
		error: function(msg) {
			loadClose();
			ToolTipTop.Show("加载超时","error");
		}
	});
}

//删除菜单
function deleteDictionary(id) {
	var topBarCode = $(".checkSystem").data("code");
	var data = {		
		"topBarCode":topBarCode,
		"menuCode":id			
	}
	data = JSON.stringify(data);
	Messager.confirm({Msg: '确定删除此菜单?', title: '删除菜单'}).on(function (flag) {
        if (flag) {       	
			$.ajax({
				type: "post",
				url: '/menu/deletes',
				data: data,
				contentType: "application/json",
				dataType: 'json',
				success: function(result) {
					isSuccessCode(result.code);
					if(result.code == 200) {
						ToolTipTop.Show("删除成功","success");
						getMenuList(1);
					} else {
						var ms = result.message;
						ToolTipTop.Show(ms,"error");
					}
				}
			});
        }        
    });	
}
