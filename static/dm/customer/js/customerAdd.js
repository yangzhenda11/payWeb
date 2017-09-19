$(function(){
	querySales();
	validator();
});
/*
 * 返回服务商列表
 */
function backCustomer(){
	window.location.href = "index.html#customer";
}
/*
 * 保存服务商
 */
function saveCustomer() {
	var mailVerify = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;	
	var name = $("#name").val();
	var contact = $("#contact").val()
	var mobile = $("#mobile").val();
	var mail = $("#mail").val();
	var address = $("#address").val();
	var data = {
		"name": name
	}
	var res = getAsyncAjax('/customer/list', data);
	if(res.code == 200 && res.data.length > 0) {
		resetAddModel();
		ToolTipTop.Show("该服务商名称已存在","error");
		return;
	} else {
		$json = form2json($("#addCustomer"));
		$.ajax({
			type: "POST",
			url: '/customer/add',
			data: $json,
			contentType: "application/json",
			dataType: 'json',
			success: function(result) {
				isSuccessCode(result.code);
				if(result.code == 200) {
					window.location.href = "index.html#customer";
					ToolTipTop.Show("添加服务商信息成功","success");
				} else {
					var ms = result.message;
					resetAddModel();
                	ToolTipTop.Show(ms,"success");    
				}
			}
		});
	}
};
//新增服务商失败后重置验证
function resetAddModel(){
	$("#addCustomer").data('bootstrapValidator').destroy();
	$('#addCustomer').data('bootstrapValidator', null);
	validator();
}
/*
 * 验证是否名称相同
 */
function getAsyncAjax(url, data) {
	var json = null;
	$.ajax({
		type: "GET",
		url: url,
		data: data,
		contentType: "application/json",
		dataType: 'json',
		async: false,
		success: function(result) {
			json = result;
		},
		error: function(msg) {
			ToolTipTop.Show("加载超时！","error");
		}
	});
	return json;
}
/*
 * 销售人员列表
 */
function querySales() {
	var data = {
		"operateType": "sales"
	};
	$.ajax({
		type: "GET",
		url: '/user/list',
		data: data,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var html = "";
				var saleList = result.data;
				// var login = $("#accountName").val();				
				html = "<option value=''>请选择销售人员</option>";
				for(var i = 0; i < saleList.length; i++) {
					html += "<option value='" + saleList[i].id + "'>" + saleList[i].userName + "</option>"
				};
				$("#sell").html(html);
			}
		}
	});
}
/*
 * 正则验证条件
 */
function validator() {
	$('#addCustomer')
		.bootstrapValidator({
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {
				name: {
					validators: {
						notEmpty: {
							message: '服务商名称不能为空'
						}
						
					}
				},
				contact: {
					validators: {
						notEmpty: {
							message: '联系人名称不能为空'
						}
					}
				},
				abb: {
					validators: {
						notEmpty: {
							message: '服务商简称不能为空'
						},
						stringLength: {
	                        max: 6,
	                        message: '服务商简称不能超过6个字符'
	                    }
					}
				},
				mobile: {
					validators: {
						notEmpty: {
							message: '联系电话不能为空'
						}
//						},
//						regexp: {
//	                        regexp: /^(\*|\+|-|[0-9]){1,15}$/,
//	                        message: '联系电话输入错误'
//	                   }
					}
				},
				sales_id:{
					validators: {
						notEmpty: {
							message: '请选择销售人员'
						}
					}
				},
				mail: {
					validators: {
						emailAddress: {
							message: '邮箱格式错误'
						},
						notEmpty: {
							message: '邮箱不能为空'
						}
					}
				},
				address: {
					validators: {
						notEmpty: {
							message: '地址不能为空'
						}
					}
				}
			}
		})
		.on('success.form.bv', function(e) {
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			saveCustomer();
		});
};