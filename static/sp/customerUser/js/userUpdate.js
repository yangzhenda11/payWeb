$(function(){
	userEdit();	
})
$(function(){
	var flagStatue = sessionStorage.getItem("listFlag");
	if(flagStatue == 0){
		$("#control i").removeClass("icon-xiangyouzhankai").addClass("icon-xiangzuoshouqi-copy");
		$(".unleftContainer").css("width","14%");
		$(".unrightContainer").css("width","85.8%");
		$("#nav").css("display","block");
		$("#navIcon").css("display","none");
	}else if(flagStatue == 1){
		$("#control i").removeClass("icon-xiangzuoshouqi-copy").addClass("icon-xiangyouzhankai");
		$(".unleftContainer").css("width","4%");
		$(".unrightContainer").css("width","96%");
		$("#nav").css("display","none");
		$("#navIcon").css("display","block");
	};
	var height = $(".unrightContainer").height();
	$(".unleftContainer").css({"min-height":height,"border":"none"});
});
$("#control i").on("click",function(){
	var flag = sessionStorage.getItem("listFlag");
	if(flag == 0){
		$(".unleftContainer").animate({ 
			width: "4%",
		},500);
		$(".unrightContainer").animate({ 
			width: "96%",
		},500 ,function(){
			sessionStorage.setItem("listFlag","1");
			$("#control i").removeClass("icon-xiangzuoshouqi-copy").addClass("icon-xiangyouzhankai");
			$("#nav").css("display","none");
			$("#navIcon").css("display","block");
		});
	}else if(flag == 1){
		$("#nav").css("display","block");
		$("#navIcon").css("display","none");
		$(".unleftContainer").animate({ 
			width: "14%",
		}, 500);
		$(".unrightContainer").animate({ 
			width: "85.8%",
		}, 500 ,function(){
			sessionStorage.setItem("listFlag","0");
			$("#control i").removeClass("icon-xiangyouzhankai").addClass("icon-xiangzuoshouqi-copy");
			
		});
	};
});
/*
 *返回用户列表
 */
function backUserList(){
	sessionStorage.setItem("readCache","1");
	window.location.href = "userList.html";
}
//修改用户角色填充
function userEdit() {
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).customerUserUpdate;
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
				varligate();
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
        url: '/user/modify?operateType=customer',
        data: $json,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            isSuccessCode(result.code);
            if (result.code === 200) {
            	sessionStorage.setItem("toolMessage","修改用户信息成功")
            	backUserList();           
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
};

/*
 * 修改用户验证
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