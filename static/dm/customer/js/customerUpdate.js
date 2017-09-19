$(function(){
	queryCustomer();	
})
/*
 * 返回服务商列表
 */
function backCustomer(){
	sessionStorage.setItem("readCache","1");
	window.location.href='index.html#customer';
}
/*
 * 获取服务商信息
 */
function queryCustomer() {
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).customerUpdate;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}
    var customerId = parameter;
	$.ajax({
		type: "GET",
		url: '/customer/get',
		data: "data=" + customerId,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var spObject = result.data;
				if(spObject.abb == undefined){
					$("#editAbb").val("");
				}
				else{
					$("#editAbb").val(spObject.abb);
				}
				$("#editAbb").val(spObject.abb);
				$("#editName").val(spObject.name);
				$("#editMobile").val(spObject.mobile);
				$("#editMail").val(spObject.mail);
				$("#editAddress").val(spObject.address);
				$("#editContact").val(spObject.contact);
				$("#customerId").val(spObject.id);				
				query(spObject);
				if ("1" == spObject.type) {
					$("input[name=type][value='1']").attr("checked", true);
				}
				if ("4" == spObject.type) {
					$("input[name=type][value='4']").attr("checked", true);
				}
				
				if ("0" == spObject.enableStatus) {
					$("input[name=enableStatus][value='0']").attr("checked", true);
				}
				if ("1" == spObject.enableStatus) {
					$("input[name=enableStatus][value='1']").attr("checked", true);
				}

				if ("0" == spObject.testStatus) {
					$("input[name=testStatus][value='0']").attr("checked", true);
				}
				if ("1" == spObject.testStatus) {
					$("input[name=testStatus][value='1']").attr("checked", true);
				}
				varligate();				
			} else {
				var ms = result.message;
				ToolTipTop.Show(ms,"error");
			}
		}
	});
}
/*
 * 更新服务商信息
 */
function updateCustomer() {	
	$json = form2json($("#updateCustomer"));
	$.ajax({
		type: "POST",
		url: '/customer/modify',
		data: $json,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				backCustomer();				
				ToolTipTop.Show("修改服务商信息成功","success");
			} else {
				var message = result.message;
				resetEditModel();
				ToolTipTop.Show(message,"error");
			}
		}
	});	
}
//编辑服务商失败后重置验证
function resetEditModel(){
	$("#updateCustomer").data('bootstrapValidator').destroy();
	$('#updateCustomer').data('bootstrapValidator', null);
	varligate();
};
/*
 * 获取服务商
 */
function query(datas) {
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
				var salesId = datas.salesId;
				var salesName = datas.salesName;
				var html ="";
				if(salesId == undefined){
					salesId = "";
				};
				if(salesName == undefined){
					salesName = "";
				};
				html = "<option value='"+salesId+"' selected='selected'>"+salesName+"</option>";
				var saleList = result.data;
				for(var i = 0; i < saleList.length; i++) {
					if(datas.salesId != saleList[i].id){
						html += "<option value='" + saleList[i].id + "'>" + saleList[i].userName + "</option>"
					}
				};
				$("#editSell").html(html);
			}
		}
	});
}
/*
 * 正则验证
 */
function varligate(){
	$('#updateCustomer')
	.bootstrapValidator({
		message: 'This value is not valid',
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},
		fields: {
			name: {
				message: '用户名验证不通过',
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
//					,
//					regexp: {
//                      regexp: /(^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/,
//						regexp: /^(\*|\+|-|[0-9]){1,15}$/,
//                      message: '联系电话输入错误'
//                  }					
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
			},
			editSell: {
				validators: {
					notEmpty: {
						message: '销售人员不能为空'
					}
				}
			}
		}
	})
	.on('success.form.bv', function(e) {
		e.preventDefault();
		var $form = $(e.target);
		var bv = $form.data('bootstrapValidator');
		updateCustomer();
	});
}