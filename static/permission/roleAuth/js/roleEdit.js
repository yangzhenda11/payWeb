/*
 * 新增用户角色ID值填充
 */
function addRoleFill() {
	var userID = sessionStorage.getItem("id");
	$("#addUserId").val(userID);
	var isAdmin = sessionStorage.getItem("isAdmin");
	if(isAdmin == "true"){
		$("#roleType3").removeClass("hidden");
	};
	if(userID == "1"){
		$("#roleType4").removeClass("hidden");
	};
}
/*
 * 新增用户角色父级角色填充
 */
function queryParent() {
	$.ajax({
		type: "GET",
		url: '/role/tree/query',
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var html = "";
				var data = result.data;
				var minLen = 1000;				
				for(var i = 0; i < data.length; i++) {
					if(minLen > data[i].treeId.length){
						minLen = data[i].treeId.length
					}
				};
				minLen = minLen/4;
				for(var i = 0; i < data.length; i++) {
					var len = data[i].treeId.length/4-minLen;
					html += "<option value='" + data[i].roleId + "'>"+ blankReturn(len) + data[i].roleName + "</option>"
				}
				$("#addparentId").html(html);
			}
		}
	})
};
/*
 *编辑角色父级角色填充
 */
function query(datas) {
	var parameter = sessionStorage.getItem("parameter");
	var roleId = JSON.parse(parameter).roleEdit;
	var data= {
		"roleId":roleId
	};
	$.ajax({
		type: "GET",
		url: '/role/tree/query',
		contentType: "application/json",
		dataType: 'json',
		data:data,
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var html = "";
				var data = result.data;
				var checkedId = datas.id;
				var checkedParentId = datas.parentId;
				var checkedparentName = datas.parentName;
				var minLen = 1000;
				html = "<option value='" + checkedParentId + "'>" + checkedparentName + "</option>";					
				for(var i = 0; i < data.length; i++) {
					if(minLen > data[i].treeId.length){
						minLen = data[i].treeId.length
					}
				};
				minLen = minLen/4;
				for(var i = 0; i < data.length; i++) {
					
					if(data[i].roleId != checkedParentId){
						var len = data[i].treeId.length/4-minLen;
						html += "<option value='" + data[i].roleId + "'>"+ blankReturn(len) +"" + data[i].roleName + "</option>"
					}
					
				}
				$("#editParentId").html(html);
			}
		}
	});
};
//返回空格填充
function blankReturn(num){
	var arr = [];
	for(var i=0;i<num;i++){
		arr.push("&nbsp;&nbsp;&nbsp;")
	};
	arr = arr.join("");
	arr = arr.replace(",","");
	return arr;
}
//新增角色保存事件
function saveRole(){
	var $json = form2json($("#addRole"));
	$.ajax({
		type: "POST",
		url: '/role/add',
		data: $json,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				ToolTipTop.Show("添加角色信息成功","success");
				gobackRole();			
			}else{
				var ms = result.message;
				resetAddModel();
				ToolTipTop.Show(ms,"error");
			}
		},
		error: function(msg) {
			ToolTipTop.Show("加载超时","error");
		}
	});
}
//新增角色失败后重置验证
function resetAddModel(){
	$("#addRole").data('bootstrapValidator').destroy();
	$('#addRole').data('bootstrapValidator', null);
	validator();
}

//查看用户角色详情
function roleDetail(){
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).roleDetail;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}else{
		var id = parameter;
		$.ajax({
			type: "GET",
			url: '/role/get',
			data: "data=" + id,
			contentType: "application/json",
			dataType: 'json',
			success: function(result) {
				isSuccessCode(result.code);
				if(result.code == 200) {
					var userId = sessionStorage.getItem("id");
					var isAdmin = sessionStorage.getItem("isAdmin");
					if(isAdmin == "true"){
						$("#roleType3").removeClass("hidden");
					};
					if(userId == "1"){
						$("#roleType4").removeClass("hidden");
					};					
					var data = result.data;
					var parentName = data.parentName == null ? '':data.parentName;
					var roleName = data.roleName == null ? '' : data.roleName;
					var description = data.description == null ? '' : data.description;
					var createdTime = data.createdTime == null ? '' : getFormatDateByLong(data.createdTime, "yyyy-MM-dd hh:mm:ss");
					if(data.status == 0) {
						$("input[name=status][value='0']").attr("checked", true);
					}else if(data.status == 1){
						$("input[name=status][value='1']").attr("checked", true);
					};
					if(data.roleType == 1){
						$("input[name=roleType][value='1']").attr("checked", true);
					}else if(data.roleType == 2){
						$("input[name=roleType][value='2']").attr("checked", true);
					}else if(data.roleType == 3){
						$("input[name=roleType][value='3']").attr("checked", true);
					}else if(data.roleType == 4){
						$("input[name=roleType][value='4']").attr("checked", true);
					};
					$("#parentName").val(parentName);
					$("#roleNameDetails").val(roleName);
					$("#descriptionDetails").val(description);
					$("#createdTime").val(createdTime);
				} else {
					var ms = result.message;
					ToolTipTop.Show(ms,"error");
				}
			}
		});
	}
}

//修改填充角色
function editRole() {
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).roleEdit;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}else{
		var id = parameter;
		$.ajax({
			type: "GET",
			url: '/role/get',
			data: "data=" + id,
			contentType: "application/json",
			dataType: 'json',
			success: function(result) {
				isSuccessCode(result.code);
				if(result.code == 200) {
					var userId = sessionStorage.getItem("id");
					var isAdmin = sessionStorage.getItem("isAdmin");
					if(isAdmin == "true"){
						$("#roleType3").removeClass("hidden");
					};
					if(userId == "1"){
						$("#roleType4").removeClass("hidden");
					};					
					var data = result.data;
					var roleName = data.roleName == null ? '' : data.roleName;
					var description = data.description == null ? '' : data.description;
					var roleId = data.roleId == null ? '' : data.roleId;					
					if(data.status == 0) {
						$("input[name=status][value='0']").attr("checked", true);
					}else if(data.status == 1){
						$("input[name=status][value='1']").attr("checked", true);
					};
					if(data.roleType == 1){
						$("input[name=roleType][value='1']").attr("checked", true);
					}else if(data.roleType == 2){
						$("input[name=roleType][value='2']").attr("checked", true);
					}else if(data.roleType == 3){
						$("input[name=roleType][value='3']").attr("checked", true);
					}else if(data.roleType == 4){
						$("input[name=roleType][value='4']").attr("checked", true);
					};
					$("#editUserId").val(userId);
					$("#editRoleName").val(roleName);
					$("#editDescription").val(description);
					$("#editRoleId").val(roleId);
					query(data);
				} else {
					var ms = result.message;
					ToolTipTop.Show(ms,"error");
				}
			}
		});
	}
}
//修改角色提交
function updateRole(){
	$json = form2json($("#editRole"));
	//alert($json)
	$.ajax({
		type: "POST",
		url: '/role/modify',
		data: $json,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				ToolTipTop.Show("修改角色信息成功","success");
				gobackRole(1);				
			}else{
				var ms = result.message;
				resetEditModel();
				ToolTipTop.Show(ms,"error");
			}
		},
		error: function(msg) {
			ToolTipTop.Show("加载超时","error");
		}
	});
}
//编辑角色失败后重置验证
function resetEditModel(){
	$("#editRole").data('bootstrapValidator').destroy();
	$('#editRole').data('bootstrapValidator', null);
	varligate();
}
/*
 *返回用户列表
 * 1加缓存
 */
function gobackRole(value){
	if(value == 1){
		sessionStorage.setItem("readCache","1");	
	};
	window.location.href = "index.html#roleList";
};
//新增系统模块验证
function validator() {
	$('#addRole')
		.bootstrapValidator({
			message: 'This value is not valid',
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {
				roleName: {
					message: '用户名验证不通过',
					validators: {
						notEmpty: {
							message: '角色名称不能为空'
						},
						stringLength: {
	                        max: 10,
	                        message: '角色名称不能超过10个字符'
	                    }
					}
				},				
				description: {
					validators: {
						notEmpty: {
							message: '描述不能为空'
						},
						stringLength: {
	                        max: 40,
	                        message: '描述不能超过40个字符'
	                    }
					}
				}
			}
		})
		.on('success.form.bv', function(e) {
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			saveRole();
		});
};

function varligate() {
	$('#editRole')
		.bootstrapValidator({
			message: 'This value is not valid',
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {
				roleName: {
					message: '用户名验证不通过',
					validators: {
						notEmpty: {
							message: '角色名称不能为空'
						},
						stringLength: {
	                        max: 10,
	                        message: '角色名称不能超过10个字符'
	                    }
					}
				},
				parentId: {	
					validators: {
						notEmpty: {
							message: '所属父级角色不能为空'
						}
					}
				},
				description: {
					validators: {
						notEmpty: {
							message: '描述不能为空'
						},
						stringLength: {
	                        max: 40,
	                        message: '描述不能超过40个字符'
	                    }
					}
				}
			}
		})
		.on('success.form.bv', function(e) {
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			updateRole();
		});
}












//查看用户详情
function userDetails(){
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).userDetails;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	};
    var id = parameter;
	$.ajax({
		type: "GET",
		url: '/user/get',
		data: "data=" + id,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var data = result.data;
				var customerName = data.customerName == null ? '' : data.customerName;
				var userName = data.userName == null ? '' : data.userName;				
				var password = data.password == null ? '' : data.password;
				var roleName = data.roleName == null ? '' : data.roleName;
				var createdTime = data.createdTime == null ? '' : getFormatDateByLong(data.createdTime, "yyyy-MM-dd hh:mm:ss");
				if(data.enableStatus == 0) {
					$("input[name=enableStatus][value='0']").attr("checked", true);
				}else if(data.enableStatus == 1){
					$("input[name=enableStatus][value='1']").attr("checked", true);
				};
				$("#userNameDetails").val(userName);				
				$("#passwordDetails").val(password);				
				$("#roleDetails").val(roleName);				
				$("#customerDetails").val(customerName);				
				$("#createdTime").val(createdTime)			
			} else {
				var ms = result.message;
				ToolTipTop.Show(ms,"error");
			}
		}
	});
}

/*
 * 新增用户角色
 */
function addUser() {
    $json = form2json($("#addUserForm"));
    $.ajax({
        type: "POST",
        url: '/user/add',
        data: $json,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            isSuccessCode(result.code);
            if (result.code === 200) {
            	ToolTipTop.Show("新增用户角色成功","success");
            	backUserList();               
            } else {
				var ms = result.message;
				resetAddModel();
                ToolTipTop.Show(ms,"error");
            }
        },
        error: function (result) {
            ToolTipTop.Show("加载超时","error");
        }
    });
}


/*
 * 修改用户角色填充
 */
function userEdit() {
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).userEdit;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	};
    var id = parameter;
	$.ajax({
		type: "GET",
		url: '/user/get',
		data: "data=" + id,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var data = result.data;
				var customerName = data.customerName == null ? '' : data.customerName;
				var userName = data.userName == null ? '' : data.userName;
				var id = data.id == null ? '' : data.id;
				var password = data.password == null ? '' : data.password;
				var roleName = data.roleName == null ? '' : data.roleName;
				var roleId = data.roleId == null ? '' : data.roleId;				
				var customerId = data.customerId == null ? '' : data.customerId;				
				if(data.enableStatus == 0) {
					$("input[name=enableStatus][value='0']").attr("checked", true);
				}else if(data.enableStatus == 1){
					$("input[name=enableStatus][value='1']").attr("checked", true);
				};
				$("#editUsername").val(userName);
				$("#editId").val(id);
				$("#editPassword").val(password);
				$("#editPasswordRepeat").val(password);
				$("#editRole").val(roleName);
				$("#editRoleValue").val(roleName);
				$("#editRoleId").val(roleId);
				$("#editCustomerNameValue").val(customerName);
				$("#editCustomerName").val(customerName);
				$("#editCustomerId").val(customerId);
			} else {
				var ms = result.message;
				ToolTipTop.Show(ms,"error");
			}
		}
	});
};
