/*
 *返回用户列表
 * 1加缓存
 */
function backUserList(value){
	if(value == 1){
		sessionStorage.setItem("readCache","1");	
	};
	window.location.href = "index.html#userList";
};
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
            	backUserList();
            	ToolTipTop.Show("已成功添加用户","success");
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

//新增用户失败后重置验证
function resetAddModel(){
	$("#addUserForm").data('bootstrapValidator').destroy();
	$('#addUserForm').data('bootstrapValidator', null);
	validator();
};
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
//编辑用户
function eidtUser(){
	$json = form2json($("#editUserForm"));
	$.ajax({
        type: 'POST',
        url: '/user/modify',
        data: $json,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            isSuccessCode(result.code);
            if (result.code === 200) {
            	backUserList(1);
                ToolTipTop.Show("修改用户信息成功","success");
            } else {
                resetEditModel();
                var ms = result.message;
                ToolTipTop.Show(ms,"error");
            }
        },
        error: function (result) {
            ToolTipTop.Show("加载超时","error");
        }
    })
}
//编辑用户失败后重置验证
function resetEditModel(){
	$("#editUserForm").data('bootstrapValidator').destroy();
	$('#editUserForm').data('bootstrapValidator', null);
	varligate();
}
/*
 * 获取新增用户服务商列表
 */
function getSpList() {
    $url = '/customer/list';
    var data = {
		"operateType":"chooseServiceProvider"
	};
    $.ajax({
        type: 'GET',
        url: $url,
        data:data,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            isSuccessCode(result.code);
            if (result.code === 200) {
                var list = result.data;
                var html = "";
                $.each(list, function(index, data) {
                    html += "<option value='" + data.id + "'>" + data.name + "</option>";
                });
                $("#customer_id").html(html);
                $('#customer_id').selectpicker({
				    liveSearch: 'true',			    
				    width:"100%"
				});
                //eventListener();
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
/*
 * 新增用户获取角色列表
 */
function getRoleList() {
    $.ajax({
        type: 'GET',
        url: '/role/list',
        data:'',
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            isSuccessCode(result.code);
            if (result.code === 200) {
                var list = result.data;
                var html = "<option value=''>请选择用户角色</option>";
//              var isAdmin = sessionStorage.getItem("isAdmin");
//              if(isAdmin == "true"){
//           		html += "<option value='1'>超级管理员</option>";                	
//              };
                $.each(list, function(index, data) {
                    html += "<option value='" + data.roleId + "'>" + data.roleName + "</option>";
                });
                $("#role").html(html);
                //eventListener();
            } else {
                var ms = result.message;
                ToolTipTop.Show(ms,"error");
            }
        },
        error: function (result) {
            ToolTipTop.Show("加载超时","error");
        }
    })
};
/*
 * 服务商角色过滤
 * roleId == 52  系统管理员;
 * roleId == 56  销售;
 * roleId == 57  工厂人员;
 * roleId == 54  客户(无开发能力);
 * roleId == 55  客户(有开发能力);
 * roleId == 60  商户;
 * roleId == 61  门店;
 * 角色是系统管理员（52）、销售（56）或者工厂人员（57）时,所属服务商必须选择北京意锐新创科技有限公司（1）
 */
function eventListener(){
	$("#customer_id").change(function(){
		if($(this).val() != 1){
			if($("#role").val() == 52 || $("#role").val() == 56 || $("#role").val() == 57){
				Messager.alert({Msg: "当您选择的角色是系统管理员、销售或者工厂人员时,所属服务商必须选择\"北京意锐新创科技有限公司\"",iconImg: 'warning',isModal: false}).on(function(flag){
					$("#customer_id").find("option[value='1']").removeAttr("selected");
					$("#customer_id").find("option[value='1']").attr("selected",true);
				});
			}
		}
	});
	$("#role").change(function(){
		if($("#role").val() == 52 || $("#role").val() == 56 || $("#role").val() == 57){
			if($("#customer_id").val() != 1){			
				Messager.alert({Msg: "当您选择的角色是系统管理员、销售或者工厂人员时,所属服务商必须选择\"北京意锐新创有限公司\"",iconImg: 'warning',isModal: false}).on(function(flag){
					$("#customer_id").find("option[value='1']").removeAttr("selected");
					$("#customer_id").find("option[value='1']").attr("selected",true);
				});
			}			
		}
	})
};
/*
 * 新增用户正则验证
 */
function validator() {
	$('#addUserForm')
		.bootstrapValidator({
			message: 'This value is not valid',
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {
				username: {
					message: '用户名验证不通过',
					validators: {
						notEmpty: {
							message: '用户名不能为空'
						}
						
					}
				},
				password: {
					validators: {
						notEmpty: {
							message: '密码不能为空'
						}
						
					}
				},
				passwordRepeat: {
					validators: {
						notEmpty: {
							message: '密码不能为空'
						},
						identical: {
	                        field: 'password',
	                        message: '两次密码输入不同'
	                    }
					}
				},
				roleId: {
					validators: {
						notEmpty: {
							message: '请选择角色'
						}
					}
//				},
//				mobile: {
//					validators: {
//						notEmpty: {
//							message: '联系电话不能为空'
//						},
//						regexp: {
//	                        regexp: /^(\*|\+|-|[0-9]){1,15}$/,
//	                        message: '联系电话输入错误'
//	                    }
//					}
//				},				
//				mail: {
//					validators: {	
//						
//						notEmpty: {
//							message: '邮箱不能为空'
//						},
//						emailAddress: {
//							message: '邮箱格式错误'
//						}
//					}
				}
			}
		})
		.on('success.form.bv', function(e) {
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			addUser();
		});
	
};
/*
 * 编辑用户验证
 */
function varligate() {
	$('#editUserForm')
		.bootstrapValidator({
			message: 'This value is not valid',
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {
				username: {
					message: '用户名验证不通过',
					validators: {
						notEmpty: {
							message: '用户名不能为空'
						}
						
					}
				},
				password: {
					validators: {
						notEmpty: {
							message: '密码不能为空'
						}
						
					}
				},
				passwordRepeat: {
					validators: {
						notEmpty: {
							message: '密码不能为空'
						},
						identical: {
	                        field: 'password',
	                        message: '两次密码输入不同'
	                    }
					}
				},
				roleId: {
					validators: {
						notEmpty: {
							message: '请选择角色'
						}
					}
				}
			}
		})
		.on('success.form.bv', function(e) {
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			eidtUser();
		});
	
};