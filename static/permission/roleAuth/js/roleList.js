$(function() {
	isCache("roleList",getRoleList);
	var fnCode = queryFnCode();
	addBtnShow(fnCode);
});

//回车搜索
var funcRef = function(evt) {
	evt = evt || window.event;
	if(evt.keyCode == 13) {
		getRoleList(1);
	}
}
window.onkeydown = funcRef;
//获取角色列表
function getRoleList(pageIndex) {
	var totalCount = 0;
	var pageSize = 15;
	var obj = new Object();
	var roleName = $("#roleName").val();
	var loginUserId = sessionStorage.getItem("id");
	obj.loginUserId = loginUserId;
	obj.roleName = roleName;
	obj.pageIndex = pageIndex;
	obj.pageSize = pageSize;
	$.ajax({
		type: "GET",
		url: '/role/pageList',
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
			var pageIndex = data.pageIndex;
			var fnCode = queryFnCode();
			var transmit = null;
			totalCount = data.listCount;
			$(".fontbold").text(totalCount);
			if(result.code == 200 && dataList.length > 0) {
				var html = null;
				var minLen = 1000;
				for(var i = 0; i < dataList.length; i++) {
					if(minLen > dataList[i].treeId.length){
						minLen = dataList[i].treeId.length
					}
				};
				minLen = minLen/4;
				for(var i = 0; i < dataList.length; i++) {
					var roleName = dataList[i].roleName == null ? '' : dataList[i].roleName;
					var description = dataList[i].description == null ? '' : dataList[i].description;
					var roleType = '';
					var status = '';
					transmit = dataList[i].roleId + "^&^" + pageIndex;
					accreditTransmit = dataList[i].roleId + "^&^" + pageIndex + "^&^" + roleName;
					if(dataList[i].roleType == 1) {
						roleType = '管理员';
					}else if(dataList[i].roleType == 2){
						roleType = '业务员';
					}else if(dataList[i].roleType == 3){
						roleType = '销售';
					}else if(dataList[i].roleType == 4){
						roleType = '系统管理员';
					};
					if(dataList[i].status == 0) {
						status = '禁用';
					}else if(dataList[i].status == 1){
						status = '启用';
					};
					
					var treeIdLen = (dataList[i].treeId.length)/4-minLen;
					html += "<tr><td style='text-align:center;'>" + (i+1) + "</td>";
					html += "<td style='padding-left:"+(treeIdLen*20+10)+"px'>" + roleName + "</td>";
					html += "<td>" + roleType + "</td>";
					html += "<td>" + description + "</td>";
					html += "<td>" + status + "</td>";
					html += "<td style='text-align:center;'>";
					if(fnCode.details == "details"){
						html += "<a style='margin-right: 10px;cursor:pointer;overflow:hidden;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='详情' onclick='roleDetails(\"" + transmit + "\");'><i class='icon iconfont icon-xiangqing operate'></i></a>";
					};					
					if(fnCode.modify == "modify"){
						html += "<a style='margin-right: 10px;cursor:pointer;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='修改' onclick='editRole(\"" + transmit + "\");'><i class='icon iconfont icon-bianji operate'></i></a>";
					};
					if(fnCode.list == "list"){
						html += "<a data-toggle='tooltip' style='margin-right: 10px;cursor:pointer;text-decoration: none;' data-placement='bottom' title='当前角色下的用户列表' onclick='roleUser(\"" + transmit + "\");'><i class='icon iconfont icon-iconset0203 operate'></i></a>";
					};
					if(fnCode.accredit == "accredit"){
						html += "<a data-toggle='tooltip' data-placement='bottom' title='当前用户角色授权' onclick='goAccredit(\"" + accreditTransmit + "\");' style='margin-right: 10px;cursor:pointer;text-decoration: none;'><i class='icon iconfont icon-shouquanguanli operate'></i></a>";
					};
					
					if(fnCode.delete == "delete"){
						html += "<a data-toggle='tooltip' style='cursor:pointer;text-decoration: none;' data-placement='bottom' title='删除' onclick='deleteRole(\"" + dataList[i].roleId + "\");'><i class='icon iconfont icon-shanchu operate'></i></a>";
					};					
					html += "</td></tr>"					
				}
				$("#roleListTable tbody").html(html);								
				var fn = "getRoleList";
				var pagination_html = paging(totalCount,pageSize,pageIndex,fn);
				$("#pagination").html(pagination_html);				
			} else {
				$("#roleListTable tbody").html("<tr ><td colspan='6' style='text-align:center;'>查询不到数据！</td></tr>");
				$("#pagination").html("");
			}
		},
		error: function(msg) {
			loadClose();
			ToolTipTop.Show("加载超时","error");
		}
	});
};

/*
 * 新增用户角色
 */
function addRoleModal() {
	window.location.href = "index.html#roleAdd";
}
/*
 * 设置缓存，跳转用户角色详情页面
 */
function roleDetails(data){
	var id = data.split("^&^")[0];
	var pageNum = data.split("^&^")[1];
	var parameter = {
		"roleDetail":id
	};
	var cache = {
		"pageNum":pageNum,
		"roleList":"roleList"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#roleDetail";
};
/*
 * 设置缓存，跳转用户角色编辑页面
 */
function editRole(data){
	var id = data.split("^&^")[0];
	var pageNum = data.split("^&^")[1];
	var parameter = {
		"roleEdit":id
	};
	var cache = {
		"pageNum":pageNum,
		"roleList":"roleList"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#roleEdit";
};
/*
 * 设置缓存，跳转该用户下的用户列表
 */
function roleUser(data){
	var id = data.split("^&^")[0];
	var pageNum = data.split("^&^")[1];
	var parameter = {
		"roleUserList":id
	};
	var cache = {
		"pageNum":pageNum,
		"roleList":"roleList"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#roleUserList";
};

/*
 * 设置缓存，跳转该用户授权
 */
function goAccredit(data){
	var id = data.split("^&^")[0];
	var pageNum = data.split("^&^")[1];
	var roleName = data.split("^&^")[2];
	var value = id + "^&^" + roleName;
	var parameter = {
		"accredit":value
	};
	var cache = {
		"pageNum":pageNum,
		"roleList":"roleList"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#accredit";
};



//删除角色
function deleteRole(id) {
	Messager.confirm({Msg: '确认删除此角色?', title: '删除角色'}).on(function (flag) {
        if (flag) {
        	var data={
        		"roleId":id
        	};
        	data = JSON.stringify(data);
			$.ajax({
				type: "POST",
				url: '/role/deletes',
				data: data,
				contentType: "application/json",
				dataType: 'json',
				success: function(result) {
					isSuccessCode(result.code);
					if(result.code == 200) {
						ToolTipTop.Show("删除角色信息成功","success");
						getRoleList(1);
					} else {
						var ms = result.message;
						ToolTipTop.Show(ms,"error");
					}
				}
			});
        }        
    });	
}


