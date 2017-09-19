$(function(){
	getSpList();
	getRoleList();
	validator();
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
	window.location.href = "userList.html";
}
//新增用户角色
function addUser() {
    var customerId = $("#customer_id").val();
    if(customerId == ""){
    	resetAddModel();
        ToolTipTop.Show("请选择该账号所属商户","error");
    }else{
	    var $json = form2json($("#addUserForm"));
    	$.ajax({
	        type: "POST",
	        url: '/user/add?operateType=customer',
	        data: $json,
	        contentType: "application/json",
	        dataType: 'json',
	        success: function (result) {
	            isSuccessCode(result.code);
	            if (result.code === 200) {
	            	sessionStorage.setItem("toolMessage","已成功添加用户")
	            	backUserList()
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
}

//新增用户失败后重置验证
function resetAddModel(){
	$("#addUserForm").data('bootstrapValidator').destroy();
	$('#addUserForm').data('bootstrapValidator', null);
	validator();
}
/*
 * 得到商户名称
 */
function getSpList() {
    $url = '/customer/list';
    var data = {
		"operateType":"merchant"
	};
    $.ajax({
        type: 'GET',
        url: $url,
        data:data,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            isSuccessCode(result.code);
            if (result.code == 200) {
                var list = result.data;
                var html = "";
                var len = 40;
                if(list.length > 0 ){
                	$.each(list, function(index, data) {
	                	if(len > data.treeId.length){
	                		len = data.treeId.length;
	                	}
	                });
	                $.each(list, function(index, data) {  
	                	var num = (data.treeId.length - len)/4;
	                    html += "<option value='" + data.id + "'>" + blankReturn(num) + data.name + "</option>";
	                });
	                $("#customer_id").html(html);
	                $('#customer_id').selectpicker({
					    liveSearch: 'true',			    
					    width:"100%",
					    title:"请选择所属商户"
					});
                }else{
                	$('#customer_id').selectpicker({
					    liveSearch: 'true',			    
					    width:"auto",
					    title:"当前登陆用户下暂无下级商户或门店"
					});               	
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
//得到角色类型
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
                $.each(list, function(index, data) {
                    html += "<option value='" + data.roleId + "'>" + data.roleName + "</option>";
                });
                $("#role").html(html);
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
 * 新增用户验证
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
		})
		.on('success.form.bv', function(e) {
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			addUser();
		});
	
};