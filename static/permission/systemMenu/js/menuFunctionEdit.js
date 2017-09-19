//新增系统功能保存事件
function saveFunction(){
	var $json = form2json($("#addFunction"));
	$.ajax({
		type: "POST",
		url: '/function/add',
		data: $json,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				ToolTipTop.Show("添加成功","success");
				backMenuFunction();
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
//新增功能失败后重置验证
function resetAddModel(){
	$("#addFunction").data('bootstrapValidator').destroy();
	$('#addFunction').data('bootstrapValidator', null);
	validator();
}
//查看系统功能详情
function functionDetail(){
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).menuFunctionDetail;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}else{
		$.ajax({
			type: "GET",
			url: '/function/get',
			data: "data=" + parameter,
			contentType: "application/json",
			dataType: 'json',
			success: function(result) {
				isSuccessCode(result.code);
				if(result.code == 200) {
					console.log(result);
					var data = result.data;
					var functionName = data.functionName == null ? '' : data.functionName;
					var functionCode = data.functionCode == null ? '' : data.functionCode;
					var description = data.description == null ? '' : data.description;
					var sort = data.sort == null ? '' : data.sort;
					var createdTime = data.createdTime == null ? '' : getFormatDateByLong(data.createdTime, "yyyy-MM-dd hh:mm:ss");
					if(data.status == 0) {
						$("input[name=status][value='0']").attr("checked", true);
					}else if(data.status == 1){
						$("input[name=status][value='1']").attr("checked", true);
					};
					$("#functionNameDetails").val(functionName);
					$("#functionCodeDetails").val(functionCode);					
					$("#sortDetails").val(sort);
					$("#createdTimeDetails").val(createdTime);
					$("#descriptionDetails").val(description);
				} else {
					var ms = result.message;
					ToolTipTop.Show(ms,"error");
				}
			}
		});
	}
}

//修改填充功能
function editFunction() {
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).menuFunctionEdit;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}else{
		$.ajax({
			type: "GET",
			url: '/function/get',
			data: "data=" + parameter,
			contentType: "application/json",
			dataType: 'json',
			success: function(result) {
				isSuccessCode(result.code);
				if(result.code == 200) {
					var data = result.data;
					var functionName = data.functionName == null ? '' : data.functionName;
					var functionCode = data.functionCode == null ? '' : data.functionCode;
					var description = data.description == null ? '' : data.description;
					var sort = data.sort == null ? '' : data.sort;
					var status = '';
					if(data.status == 0) {
						$("input[name=status][value='0']").attr("checked", true);
					}else if(data.status == 1){
						$("input[name=status][value='1']").attr("checked", true);
					};
					$("#editFunctionName").val(functionName);
					$("#editFunctionCodes").val(functionCode);
					$("#editFunctionCode").val(functionCode);
					$("#editSort").val(sort);
					$("#editDescription").val(description);
					updateModal();
				} else {
					var ms = result.message;
					ToolTipTop.Show(ms,"error");
				}
			}
		});
	}
}
//修改系统功能提交
function updateSystem(){
	$json = form2json($("#editFunction"));
	$.ajax({
		type: "POST",
		url: '/function/modify',
		data: $json,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				ToolTipTop.Show("修改系统功能信息成功","success");
				backMenuFunction(1);
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
//编辑功能失败后重置验证
function resetEditModel(){
	$("#editFunction").data('bootstrapValidator').destroy();
	$('#editFunction').data('bootstrapValidator', null);
	varligate();
}
/*
 * 返回跳转按钮
 *  1加缓存
 */
function backMenuFunction(value){
	if(value == 1){
		sessionStorage.setItem("readCache","1");	
	};
	window.location.href = "index.html#menuFunctionList";
};

//新增系统功能模块验证
function validator() {
	$('#addFunction')
		.bootstrapValidator({
			message: 'This value is not valid',
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {
				functionName: {
					message: '用户名验证不通过',
					validators: {
						notEmpty: {
							message: '系统功能名称不能为空'
						},
						stringLength: {
	                        max: 10,
	                        message: '系统功能不能超过10个字符'
	                    }
					}
				},
				functionCode: {
					validators: {
						notEmpty: {
							message: '系统功能编号不能为空'
						},
						stringLength: {
	                        max: 20,
	                        message: '系统功能编号不能超过20个字符'
	                    },
						regexp: {
	                        regexp: /^\w{1,}$/,
	                        message: '系统功能编号只能为字母数字下划线'
	                   	}
					}
				},
				sort: {
					validators: {
						notEmpty: {
							message: '排序号不能为空'
						},
						stringLength: {
	                        max: 10,
	                        message: '排序号不能超过10个字符'
	                    },
						regexp: {
	                        regexp: /^[0-9]{1,}$/,
	                        message: '排序号只能填写数字'
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
	                        message: '描述不能超过20个字符'
	                    }
					}
				}
			}
		})
		.on('success.form.bv', function(e) {
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			saveFunction();
		});
};
/*
 * 修改验证
 */
function varligate() {
	$('#editFunction')
		.bootstrapValidator({
			message: 'This value is not valid',
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {
				functionName: {
					message: '用户名验证不通过',
					validators: {
						notEmpty: {
							message: '系统功能名称不能为空'
						},
						stringLength: {
	                        max: 10,
	                        message: '系统功能不能超过10个字符'
	                    }
					}
				},
				functionCode: {
					validators: {
						notEmpty: {
							message: '系统功能编号不能为空'
						},
						stringLength: {
	                        max: 20,
	                        message: '系统功能编号不能超过20个字符'
	                    },
						regexp: {
	                        regexp: /^\w{1,}$/,
	                        message: '系统功能编号只能为字母数字下划线'
	                   	}
					}
				},
				sort: {
					validators: {
						notEmpty: {
							message: '排序号不能为空'
						},
						stringLength: {
	                        max: 10,
	                        message: '排序号不能超过10个字符'
	                    },
						regexp: {
	                        regexp: /^[0-9]{1,}$/,
	                        message: '排序号只能填写数字'
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
	                        message: '描述不能超过20个字符'
	                    }
					}
				}
			}
		})
		.on('success.form.bv', function(e) {
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			updateSystem();
		});
}