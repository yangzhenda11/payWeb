$(function() {
	isCache("systemList",getSerivceList);
	var fnCode = queryFnCode();
	addBtnShow(fnCode);
});

//回车搜索
var funcRef = function(evt) {
	evt = evt || window.event;
	if(evt.keyCode == 13) {
		getSerivceList(1);
	}
}
window.onkeydown = funcRef;
//获取系统模块列表
function getSerivceList(pageIndex) {
	var totalCount = 0;
	var pageSize = 15;
	var obj = new Object();
	var topBarName = $("#systemName").val();
	var loginUserId = sessionStorage.getItem("id");
	obj.loginUserId = loginUserId;
	obj.topBarName = topBarName;
	obj.pageIndex = pageIndex;
	obj.pageSize = pageSize;

	$.ajax({
		type: "GET",
		url: '/topBar/pageList',
		data: obj,
		contentType: "application/json",
		dataType: 'json',
		beforeSend:loading,
		async: false,
		success: function(result) {
			loadClose();
			isSuccessCode(result.code);
			var data = result.data;
			var dataList = data.list;
			var transmit = null;
			var fnCode = queryFnCode();
			totalCount = data.listCount;
			$(".fontbold").text(totalCount);
			if(result.code == 200 && dataList.length > 0) {
				var html = null;
				for(var i = 0; i < dataList.length; i++) {
					var topBarCode = dataList[i].topBarCode == null ? '' : dataList[i].topBarCode;
					var topBarName = dataList[i].topBarName == null ? '' : dataList[i].topBarName;
					var sortCode = dataList[i].sort == null ? '' : dataList[i].sort;
					var icon = dataList[i].icon == null ? '' : dataList[i].icon;
					var status = '';
					var pageIndex = data.pageIndex;
					transmit = dataList[i].topBarCode + "^&^" + pageIndex;
					if(dataList[i].status == 0) {
						status = '禁用';
					}else if(dataList[i].status == 1){
						status = '启用';
					};
					html += "<tr><td style='text-align:center;'>" + (i+1) + "</td>";
					html += "<td style=''>" + topBarName + "</td>";
					html += "<td>" + topBarCode + "</td>";
					html += "<td>" + icon + "</td>";
					html += "<td>" + sortCode + "</td>";
					html += "<td>" + status + "</td>";
					html += "<td style='text-align:center;'>";
					if(fnCode.details == "details"){
						html += "<a style='margin-right: 10px;cursor:pointer;overflow:hidden;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='详情' onclick='systemDetails(\"" + transmit + "\");'><i class='icon iconfont icon-xiangqing operate'></i></a>";
					};					
					if(fnCode.modify == "modify"){
						html += "<a style='margin-right: 10px;cursor:pointer;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='修改' onclick='editSystem(\"" + transmit + "\");'><i class='icon iconfont icon-bianji operate'></i></a>";
					};
					if(fnCode.state == "state"){
						if(dataList[i].status == 0){
							html += "<a style='margin-right: 10px;cursor:pointer;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='启用此模块' onclick='enabledFunction(\"" + dataList[i].topBarCode + "\");'><i class='icon iconfont icon-huifujinyong operate'></i></a>";
						}else if(dataList[i].status == 1){
							html += "<a style='margin-right: 10px;cursor:pointer;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='禁用此模块' onclick='disableFunction(\"" + dataList[i].topBarCode + "\");'><i class='icon iconfont icon-jinyong operate'></i></a>";
						}
					};
					if(fnCode.delete == "delete"){
						html += "<a data-toggle='tooltip' style='cursor:pointer;text-decoration: none;' data-placement='bottom' title='删除' onclick='deleteDictionary(\"" + dataList[i].topBarCode + "\");'><i class='icon iconfont icon-shanchu operate'></i></a>";
					}
					html += "</td></tr>"
					//html += "<a data-toggle='tooltip' data-placement='bottom' title='当前系统权限列表' href='menuList.html?" + dataList[i].id +timestamp()+ "' style='margin-right: 10px;cursor:pointer;text-decoration: none;'><i class='icon iconfont icon-list operate'></i></a>";
				}
				$("#systemListTable tbody").html(html);						
				var fn = "getSerivceList";
				var pagination_html = paging(totalCount,pageSize,pageIndex,fn);
				$("#pagination").html(pagination_html);
				
			} else {
				$("#systemListTable tbody").html("<tr ><td colspan='6' style='text-align:center;'>查询不到数据！</td></tr>");
				$("#pagination").html("");
			}
		},
		error: function(msg) {
			loadClose();
			ToolTipTop.Show("加载超时","error");
		}
	});
}

//新增系统模块  点击事件
function addSystem() {
	window.location.href = "index.html#systemAdd";
}
/*
 * 设置缓存，跳转系统模块详情页面
 */
function systemDetails(data){
	var id = data.split("^&^")[0];
	var pageNum = data.split("^&^")[1];
	var parameter = {
		"systemDetail":id
	};
	var cache = {
		"pageNum":pageNum,
		"systemList":"systemList"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#systemDetail";
};
/*
 * 设置缓存，跳转系统模块编辑页面
 */
function editSystem(data){
	var id = data.split("^&^")[0];
	var pageNum = data.split("^&^")[1];
	var parameter = {
		"systemEdit":id
	};
	var cache = {
		"pageNum":pageNum,
		"systemList":"systemList"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#systemEdit";
};

//启用模块
function enabledFunction(id){
	Messager.confirm({Msg: '确定启用此模块?', title: '启用模块'}).on(function (flag) {
        if (flag) {
			var data = {
				"topBarCode":id,
				"status":"1"
			};
			data = JSON.stringify(data);
			$.ajax({
				type: "POST",
				url: '/topBar/modify',
				data: data,
				contentType: "application/json",
				dataType: 'json',
				success: function(result) {
					isSuccessCode(result.code);
					if(result.code == 200) {						
						ToolTipTop.Show("启用成功","success");
	                	getSerivceList(1);
	                	queryTopBar();
	                	showUnwrap();		                
					}else{
						var ms = result.message;
						ToolTipTop.Show(ms,"error");
					}
				},
				error: function(msg) {
					ToolTipTop.Show("加载超时","error");
				}
			});
		}
    });
}
//禁用模块
function disableFunction(id){
	Messager.confirm({Msg: '确定禁用此模块?', title: '禁用模块'}).on(function (flag) {
        if (flag) {
			var data = {
				"topBarCode":id,
				"status":"0"
			};
			data = JSON.stringify(data);
			$.ajax({
				type: "POST",
				url: '/topBar/modify',
				data: data,
				contentType: "application/json",
				dataType: 'json',
				success: function(result) {
					isSuccessCode(result.code);
					if(result.code == 200) {
						ToolTipTop.Show("禁用成功！","success");
						getSerivceList(1);
						queryTopBar();
						showUnwrap();					
					}else{
						var ms = result.message;
						ToolTipTop.Show(ms,"error");
					}
				},
				error: function(msg) {
					ToolTipTop.Show("加载超时","error");
				}
			});
		}
	});
}
//删除系统模块
function deleteDictionary(id) {
	Messager.confirm({Msg: '确定删除此模块?', title: '删除模块'}).on(function (flag) {
        if (flag) {
        	var $IdList = '["' + id + '"]';
			$.ajax({
				type: "POST",
				url: '/topBar/deletes',
				data: $IdList,
				contentType: "application/json",
				dataType: 'json',
				success: function(result) {
					isSuccessCode(result.code);
					if(result.code == 200) {
						ToolTipTop.Show("删除成功","success");
		                queryTopBar();
		                showUnwrap();
		                getSerivceList(1);
					} else {
						var ms = result.message;
						ToolTipTop.Show(ms,"error");						
					}
				}
			});
        }        
    });	
}
