$(function() {
	isCache("menuFunctionList",getFunctionList);
	var fnCode = queryFnCode();
	addBtnShow(fnCode);
});

//回车搜索
var funcRef = function(evt) {
	evt = evt || window.event;
	if(evt.keyCode == 13) {
		getFunctionList(1);
	}
}
window.onkeydown = funcRef;
//获取系统功能列表
function getFunctionList(pageIndex) {
	var totalCount = 0;
	var pageSize = 15;
	var obj = new Object();
	var functionName = $("#functionNameSearch").val();
	var loginUserId = sessionStorage.getItem("id");
	obj.loginUserId = loginUserId;
	obj.functionName = functionName;
	obj.pageIndex = pageIndex;
	obj.pageSize = pageSize;
	$.ajax({
		type: "GET",
		url: '/function/pageList',
		data: obj,
		beforeSend:loading,
		contentType: "application/json",
		dataType: 'json',
		async: false,
		success: function(result) {
			loadClose();
			isSuccessCode(result.code);
			var data = result.data;
			var dataList = data.list;
			totalCount = data.listCount;
			$(".fontbold").text(totalCount);
			if(result.code == 200 && dataList.length > 0) {
				var html = null;
				var fnCode = queryFnCode();
				var transmit = null;
				for(var i = 0; i < dataList.length; i++) {
					var functionName = dataList[i].functionName == null ? '' : dataList[i].functionName;
					var functionCode = dataList[i].functionCode == null ? '' : dataList[i].functionCode;
					var sort = dataList[i].sort == null ? '' : dataList[i].sort;
					var description = dataList[i].description == null ? '' : dataList[i].description;
					var status = '';
					var pageIndex = data.pageIndex;
					transmit = dataList[i].functionCode + "^&^" + pageIndex;
					if(dataList[i].status == 0) {
						status = '禁用';
					}else if(dataList[i].status == 1){
						status = '启用';
					};
					html += "<tr><td style='text-align:center;'>" + (i+1) + "</td>";
					html += "<td style=''>" + functionName + "</td>";
					html += "<td>" + functionCode + "</td>";
					html += "<td>" + sort + "</td>";
					html += "<td>" + description + "</td>";
					html += "<td>" + status + "</td>";
					html += "<td style='text-align:center;'>";
					if(fnCode.details == "details"){
						html += "<a style='margin-right: 10px;cursor:pointer;overflow:hidden;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='详情' onclick='functionDetails(\"" + transmit + "\");'><i class='icon iconfont icon-xiangqing operate'></i></a>";
					};
					if(fnCode.modify == "modify"){
						html += "<a style='margin-right: 10px;cursor:pointer;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='修改' onclick='editFunction(\"" + transmit + "\");'><i class='icon iconfont icon-bianji operate'></i></a>";
					};
					if(fnCode.state == "state"){
						if(dataList[i].status == 0){
							html += "<a style='margin-right: 10px;cursor:pointer;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='启用此功能' onclick='enabledFunction(\"" + dataList[i].functionCode + "\");'><i class='icon iconfont icon-huifujinyong operate'></i></a>";
						}else if(dataList[i].status == 1){
							html += "<a style='margin-right: 10px;cursor:pointer;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='禁用此功能' onclick='disableFunction(\"" + dataList[i].functionCode + "\");'><i class='icon iconfont icon-jinyong operate'></i></a>";
						}
					}
					if(fnCode.delete == "delete"){
						html += "<a data-toggle='tooltip' style='cursor:pointer;text-decoration: none;' data-placement='bottom' title='删除' onclick='deleteFunction(\"" + dataList[i].functionCode + "\");'><i class='icon iconfont icon-shanchu operate'></i></a>";
					}
					html += "</td></tr>"
				}
				$("#menuFunctionTable tbody").html(html);				
				var fn = "getFunctionList";
				var pagination_html = paging(totalCount,pageSize,pageIndex,fn);
				$("#pagination").html(pagination_html);
			} else {
				$("#menuFunctionTable tbody").html("<tr ><td colspan='7' style='text-align:center;'>查询不到数据！</td></tr>");
				$("#pagination").html("");
			}
		},
		error: function(msg) {
			loadClose();
			ToolTipTop.Show("加载超时","error");
		}
	});
}


/*
 * 设置缓存，跳转系统功能详情页面
 */
function functionDetails(data){
	var id = data.split("^&^")[0];
	var pageNum = data.split("^&^")[1];
	var parameter = {
		"menuFunctionDetail":id
	};
	var cache = {
		"pageNum":pageNum,
		"menuFunctionList":"menuFunctionList"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#menuFunctionDetail";
};
/*
 * 设置缓存，跳转系统功能编辑页面
 */
function editFunction(data){
	var id = data.split("^&^")[0];
	var pageNum = data.split("^&^")[1];
	var parameter = {
		"menuFunctionEdit":id
	};
	var cache = {
		"pageNum":pageNum,
		"menuFunctionList":"menuFunctionList"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#menuFunctionEdit";
};

//启用功能
function enabledFunction(id){
	Messager.confirm({Msg: '确定启用此功能?', title: '启用功能'}).on(function (flag) {
        if (flag) {
			var data = {
				"functionCode":id,
				"status":"1"
			};
			data = JSON.stringify(data);
			$.ajax({
				type: "POST",
				url: '/function/modify',
				data: data,
				contentType: "application/json",
				dataType: 'json',
				success: function(result) {
					isSuccessCode(result.code);
					if(result.code == 200) {
						ToolTipTop.Show("启用成功","success");
						getFunctionList(1);
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
//禁用功能
function disableFunction(id){
	Messager.confirm({Msg: '确定禁用此功能?', title: '禁用功能'}).on(function (flag) {
        if (flag) {
			var data = {
				"functionCode":id,
				"status":"0"
			};
			data = JSON.stringify(data);
			$.ajax({
				type: "POST",
				url: '/function/modify',
				data: data,
				contentType: "application/json",
				dataType: 'json',
				success: function(result) {
					isSuccessCode(result.code);
					if(result.code == 200) {
						ToolTipTop.Show("禁用成功","success");
						getFunctionList(1);
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
//删除功能
function deleteFunction(id) {
	Messager.confirm({Msg: '确定删除此功能?', title: '删除功能'}).on(function (flag) {
        if (flag) {
        	var $IdList = '["' + id + '"]';
			$.ajax({
				type: "POST",
				url: '/function/deletes',
				data: $IdList,
				contentType: "application/json",
				dataType: 'json',
				success: function(result) {
					isSuccessCode(result.code);
					if(result.code == 200) {
						ToolTipTop.Show("删除成功","success");
						getFunctionList(1);
					} else {
						var ms = result.message;
						ToolTipTop.Show(ms,"error");
					}
				}
			});
        }        
    });
	
}
//新增系统模块  点击事件
function addFunctionModal() {
	window.location.href = "index.html#menuFunctionAdd";
}