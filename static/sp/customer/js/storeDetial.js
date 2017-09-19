$(function() {
	addListTree();
	merchantDetails();
	varligate();
	setstyle();
});
//加载列表树
function addListTree(){ 
	setTreeValue();  //设置列表树内容
	checkNav();			//选择高亮显示
	treedropdown();		//加载列表树格式
}
//商户详情
function merchantDetails(){
	var storeId = location.search.slice(1).split("&")[0].split("=")[1];
	var data = "data="+storeId;
	$.ajax({
		type: "GET",
		url: '/customer/get',
		data: data,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var spObject = result.data;
				$("#detName").val(spObject.name);
				$("#detAbb").val(spObject.abb);
				$("#detMobile").val(spObject.mobile);
				$("#detMail").val(spObject.mail);
				$("#detAddress").val(spObject.address);
				$("#detContact").val(spObject.contact);
				$("#storeId").val(spObject.id);
				$("#storeparentId").val(spObject.parentId);
				if ("0" == spObject.enableStatus) {
					$("input[name=enableStatus][value='0']").attr("checked", true);
				}
				if ("1" == spObject.enableStatus) {
					$("input[name=enableStatus][value='1']").attr("checked", true);
				}
				if(spObject.type == 1) {
					$("input[id='editType1']").attr("checked", true);
				}else if(spObject.type == 2) {
					$("input[id='editType2']").attr("checked", true);
				}else if(spObject.type == 3){
					$("input[id='editType3']").attr("checked", true);
				}else{
					
				}
				if ("0" == spObject.testStatus) {
					$("input[name=testStatus][value='0']").attr("checked", true);
				}
				if ("1" == spObject.testStatus) {
					$("input[name=testStatus][value='1']").attr("checked", true);
				}
			} else {
				var ms = result.message;
				ToolTipTop.Show(ms,"error");
			}
		}
	});
}
//修改商户信息提交接口
function updateMerchant() {
	$json = form2json($("#deviceConfigForm"));
	$.ajax({
		type: "POST",
		url: '/customer/modify',
		data: $json,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if (result.code === 200) {
            	$("#deviceConfigForm").data('bootstrapValidator').destroy();
		        $('#deviceConfigForm').data('bootstrapValidator', null);
		        varligate();
            	merchantDetails();
            	gettreevalue('merchant.html');
            	addListTree();
                ToolTipTop.Show("修改客户信息成功","success");
            } else {
                var ms = result.message;
                $("#deviceConfigForm").data('bootstrapValidator').destroy();
        		$('#deviceConfigForm').data('bootstrapValidator', null);
        		varligate();
        		merchantDetails();
                ToolTipTop.Show(ms,"error");
            }
		}
	});
	
}
//修改商户信息表单验证
function varligate(){
	$('#deviceConfigForm')
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
						message: '客户名称不能为空'
					}
					
				}
			},
			abb:{
				message: '用户名验证不通过',
				validators: {
					notEmpty: {
						message: '客户简称不能为空'
					},
					stringLength: {
                        max: 6,
                        message: '客户简称不能超过6个字符'
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
			mobile: {
				validators: {
					notEmpty: {
						message: '联系电话不能为空'
					},
					regexp: {
                        regexp: /^(\*|\+|-|[0-9]){1,15}$/,
                        message: '联系电话输入错误'
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
		updateMerchant();
	});
}