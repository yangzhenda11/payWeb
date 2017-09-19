$(function(){
	validator();
})
function addDeviceType(){
	$json = form2json($("#addDeviceType"));
	$.ajax({
		type: "POST",
		url: '/deviceModel/add',
		data: $json,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);			
			if(result.code == 200) {
				ToolTipTop.Show("添加成功！","success");
				backApplyDevice();
			} else {
				var ms = result.message;
				resetAddModel();
	            ToolTipTop.Show(ms,"error");
			}
		}
	});
}

/*
 * 返回设备申请
 */
function backApplyDevice(){
	window.location.href = "index.html#applyDeviceIds"
}
//新增失败后重置验证
function resetAddModel(){
	$("#addDeviceType").data('bootstrapValidator').destroy();
	$('#addDeviceType').data('bootstrapValidator', null);
	validator();
}
/*
 * 正则验证条件
 */
function validator() {
	$('#addDeviceType')
		.bootstrapValidator({
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {
				code: {
					validators: {
						notEmpty: {
							message: '类型名称不能为空'
						}
					}
				},
				serialCode: {
					validators: {
						notEmpty: {
							message: '序列号ID代码不能为空'
						},
						regexp: {
	                        regexp: /^([1-9][0-9]{3})$/,
	                        message: '序列号ID代码固定为4位数字'
	                   }
                  	}										
				},
				type: {
					validators: {
						notEmpty: {
							message: '类型不能为空'
						}
					}
				},
				status:{
					validators: {
						notEmpty: {
							message: '状态不能为空'
						}
					}
				},
				description: {
					validators: {
						notEmpty: {
							message: '描述不能为空'
						},
						stringLength: {
	                        max: 30,
	                        message: '描述不能超过30个字符'
	                    }
					}
				}
			}
		})
		.on('success.form.bv', function(e) {
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			addDeviceType();
		});
};