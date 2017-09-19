$(function() {
	getRoleUserList(1);
});
//回车搜索
var funcRef = function(evt) {
	evt = evt || window.event;
	if(evt.keyCode == 13) {
		getRoleUserList(1);
	}
}
window.onkeydown = funcRef;
//获取角色列表
function getRoleUserList(pageIndex) {
	var totalCount = 0;
	var pageSize = 15;
	var obj = new Object();
	var userName = $("#userName").val();
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).roleUserList;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}else{
		var roleId = parameter;
		obj.roleId = roleId;
		obj.userName = userName;
		obj.pageIndex = pageIndex;
		obj.pageSize = pageSize;
		$.ajax({
			type: "GET",
			url: '/user/pageList',
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
				var fnCode = queryFnCode();
				totalCount = data.listCount;
				$(".fontbold").text(totalCount);
				if(result.code == 200 && dataList.length > 0) {
					var html = null;
					for(var i = 0; i < dataList.length; i++) {
						var roleName = dataList[i].roleName == null ? '' : dataList[i].roleName;
						var customerName = dataList[i].customerName == null ? '' : dataList[i].customerName;
						var userName = dataList[i].userName == null ? '' : dataList[i].userName;
						var createdTime = dataList[i].createdTime == null ? '' : getFormatDateByLong(dataList[i].createdTime, "yyyy-MM-dd hh:mm:ss");
						var status = '';
						if(dataList[i].enableStatus == 0) {
							status = '禁用';
						}else if(dataList[i].enableStatus == 1){
							status = '启用';
						};
						html += "<tr><td style='text-align:center'>" + (i+1) + "</td>";
						html += "<td>" + userName + "</td>";
						html += "<td style=''>" + roleName + "</td>";
						html += "<td>" + customerName + "</td>";
						html += "<td>" + status + "</td>";										
						html += "<td>" + createdTime + "</td></tr>"					
					}
					$("#roleUserTable tbody").html(html);					
					var pageIndex = data.pageIndex;
					var fn = "getRoleUserList";
					var pagination_html = paging(totalCount,pageSize,pageIndex,fn);
					$("#pagination").html(pagination_html);				
				} else {
					$("#roleUserTable tbody").html("<tr ><td colspan='6' style='text-align:center;'>查询不到数据！</td></tr>");
					$("#pagination").html("");
				}
			},
			error: function(msg) {
				loadClose();
				ToolTipTop.Show("加载超时","error");
			}
		});		
	}	
}
/*
 * 返回
 */
function gobackRole(){
	sessionStorage.setItem("readCache","1");
	window.location.href = "index.html#roleList";
};
