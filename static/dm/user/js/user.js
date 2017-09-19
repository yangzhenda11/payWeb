$(function () {
    isCache("userList",getUserList);
	var fnCode = queryFnCode();
	addBtnShow(fnCode);
});

/*
 * 获取用户列表
 */
function getUserList(pageIndex) {
    $url = '/user/pageList';
    var pageSize = 15;
    var userName = $("#queryUser").val();
    var loginUserId = sessionStorage.getItem("id");
    var data = {
        "userName" : userName,
        "pageIndex" : pageIndex,
        "pageSize" : pageSize,
        "loginUserId":loginUserId,
        "operateType": "customer"
    }
    $.ajax({
        type: 'GET',
        url: $url,
        data: data,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
        	isSuccessCode(result.code);
            if (result.code === 200) {
				var fnCode = queryFnCode();                
                var userList = result.data.list;
                var html = "";
                var role = "";
                var totalCount = result.data.listCount;
                $(".fontbold").text(totalCount);
                if(userList.length > 0){
                	var pageIndex = result.data.pageIndex;
	                $.each(userList, function (index, user) {
	                    var contact = user.contact;
	                    if (contact == undefined) {
	                        contact = "";
	                    };                    
	                    var customerName = user.customerName;
	                    if(user.customerName == undefined){
	                    	customerName = '';
	                    };
	                    var roleName = user.roleName;
	                    var enableStatus = null;
	                    var transmit = user.id + "^&^" + pageIndex;
	                    if(user.enableStatus == 1){
		                	enableStatus = "启用";
		                }else{
		                	enableStatus = "禁用";
		                }					
	                    html += "<tr id='" + user.id + "'>"+
	                    "<td style='padding-left:20px'>" + user.userName + "</td>"+
	                    "<td>" + roleName + "</td>"+
	                    "<td>" + customerName + "</td>"+
	                    "<td style='text-align:center;'>" + enableStatus + "</td>";
	                    html += "<td style='text-align:center;'>";	                    
	                    if(fnCode.details == "details"){
							html += "<a style='text-decoration: none;cursor:pointer;' data-toggle='tooltip' data-placement='bottom' title='详情' onclick='userDetails(\"" + transmit +"\")'><i class='icon iconfont icon-xiangqing operate'></i></a>";
						};
						if(fnCode.modify == "modify"){
							html += "<a data-toggle='tooltip' data-placement='bottom' title='修改' style='margin-left: 10px;cursor:pointer;text-decoration: none;' onclick='userEdit(\"" + transmit +"\")'><i class='icon iconfont icon-bianji operate'></i></a>";
						};
						if(fnCode.delete == "delete"){
							html += "<a data-toggle='tooltip' data-placement='bottom' title='删除' style='margin-left: 10px;cursor:pointer;text-decoration: none;' onclick='deleteUser(" + user.id + ");'><i class='icon iconfont icon-shanchu operate'></i></a>";
					};
					html += "</td></tr>";
	                });
	                $("#userTable tbody").html(html);								
					var fn = "getUserList";
					var pagination_html = paging(totalCount,pageSize,pageIndex,fn);
					$("#pagination").html(pagination_html);                
                }else{
                	$("#userTable tbody").html("<tr><td style='text-align:center' colspan='6'>查询不到数据！</td></tr>");
	            	$("#pagination").html("");
                }
            } else {
                var ms = result.message;
                ToolTipTop.Show(ms,"error");
            }
        },
        error: function (result) {
            ToolTipTop.Show("加载超时","error");
        }
    })
}
var funcRef = function(evt){
    evt = evt || window.event;
    if (evt.keyCode==13){
        getUserList(1);
    }
}
window.onkeydown = funcRef;

/*
 * 新增用户
 */
function userAdd(){
	window.location.href = "index.html#userAdd";
}

/*
 * 设置缓存，跳转用户编辑页面
 */
function userEdit(data){
	var id = data.split("^&^")[0];
	var pageNum = data.split("^&^")[1];
	var parameter = {
		"userEdit":id
	};
	var cache = {
		"pageNum":pageNum,
		"userList":"userList"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#userUpdate";
};

/*
 * 设置缓存，跳转用户详情页面
 */
function userDetails(data){
	var id = data.split("^&^")[0];
	var pageNum = data.split("^&^")[1];
	var parameter = {
		"userDetails":id
	};
	var cache = {
		"pageNum":pageNum,
		"userList":"userList"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#userDetails";
};

//删除用户
function deleteUser(id) {
    $userList = $.parseJSON('[' + id + ']');
    $url = '/user/deletes';
    Messager.confirm({Msg: '确认删除当前选择的用户?', title: '删除用户'}).on(function (flag) {
        if (flag) {
        	$.ajax({
	            type: 'POST',
	            url: $url,
	            data: JSON.stringify($userList),
	            contentType: "application/json",
	            dataType: 'json',
	            success: function (result) {
	                isSuccessCode(result.code);
	                if (result.code === 200) {
	                	ToolTipTop.Show("删除用户成功","success");
	                	getUserList(1);											
					} else {
						var ms = result.message;
						ToolTipTop.Show(ms,"error");
					}
		        },
	           	error: function (result) {
	                ToolTipTop.Show("加载超时","error");
	            }
           	})
	    }
    });    
}



