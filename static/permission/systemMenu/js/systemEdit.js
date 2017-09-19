/*
 * 返回跳转按钮
 *  1加缓存
 */
function backSystemList(value){
	if(value == 1){
		sessionStorage.setItem("readCache","1");	
	};
	window.location.href = "index.html#systemList";
};
//新增系统模块保存事件
function saveDictionary(){
	var $json = form2json($("#addSystem"));
	$.ajax({
		type: "POST",
		url: '/topBar/add',
		data: $json,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				ToolTipTop.Show("“添加成功","success");
				queryTopBar();
				showUnwrap();
				backSystemList();
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
//新增字典失败后重置验证
function resetAddModel(){
	$("#addSystem").data('bootstrapValidator').destroy();
	$('#addSystem').data('bootstrapValidator', null);
	validator();
}

//修改填充系统模块
function editSystem() {
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).systemEdit;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}else{
		$.ajax({
			type: "GET",
			url: '/topBar/get',
			data: "data=" + parameter,
			contentType: "application/json",
			dataType: 'json',
			success: function(result) {
				isSuccessCode(result.code);
				if(result.code == 200) {
					var data = result.data;
					var topBarCode = data.topBarCode == null ? '' : data.topBarCode;
					var topBarName = data.topBarName == null ? '' : data.topBarName;
					var editIcon = data.icon == null ? '' : data.icon;
					var sorts = data.sort == null ? '' : data.sort;
					var status = '';
					if(data.status == 0) {
						$("input[name=status][value='0']").attr("checked", true);
					}else if(data.status == 1){
						$("input[name=status][value='1']").attr("checked", true);
					};
					$("#editsort").val(sorts);
					$("#editsTopBarCode").val(topBarCode);
					$("#editIcon").val(editIcon);
					$("#editTopBarName").val(topBarName);
					$("#editTopBarCode").val(topBarCode);
				} else {
					var ms = result.message;
					ToolTipTop.Show(ms,"error");
				}
			}
		});
	}
}
//修改系统模块提交
function updateSystem(){
	$json = form2json($("#editSystem"));
	$.ajax({
		type: "POST",
		url: '/topBar/modify',
		data: $json,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				ToolTipTop.Show("修改成功","success");
				queryTopBar();
				showUnwrap();
				backSystemList(1);
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
//编辑字典失败后重置验证
function resetEditModel(){
	$("#editSystem").data('bootstrapValidator').destroy();
	$('#editSystem').data('bootstrapValidator', null);
	varligate();
}

//查看系统模块详情
function systemDetail(){
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).systemDetail;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}else{
		$.ajax({
			type: "GET",
			url: '/topBar/get',
			data: "data=" + parameter,
			contentType: "application/json",
			dataType: 'json',
			success: function(result) {
				isSuccessCode(result.code);
				if(result.code == 200) {
					var data = result.data;
					var topBarCode = data.topBarCode == null ? '' : data.topBarCode;
					var topBarName = data.topBarName == null ? '' : data.topBarName;
					var iconDetail = data.icon == null ? '' : data.icon;
					var sorts = data.sort == null ? '' : data.sort;
					//var createdTime = data.createdTime == null ? '' : getFormatDateByLong(data.createdTime, "yyyy-MM-dd hh:mm:ss");
					if(data.status == 0) {
						$("input[name=status][value='0']").attr("checked", true);
					}else if(data.status == 1){
						$("input[name=status][value='1']").attr("checked", true);
					};
					$("#iconDetail").val(iconDetail);
					$("#sortDetails").val(sorts);
					$("#topBarNameDetails").val(topBarName);
					$("#topBarCodeDetails").val(topBarCode);
				} else {
					var ms = result.message;
					ToolTipTop.Show(ms,"error");
				}
			}
		});
	}
}
//新增系统模块验证
function validator() {
	$('#addSystem')
		.bootstrapValidator({
			message: 'This value is not valid',
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {
				topBarName: {
					message: '用户名验证不通过',
					validators: {
						notEmpty: {
							message: '系统模块名称不能为空'
						},
						stringLength: {
	                        max: 10,
	                        message: '系统模块不能超过10个字符'
	                    }
					}
				},
				sort: {
					validators: {
						notEmpty: {
							message: '排序号不能为空'
						},
						regexp: {
	                        regexp: /^[0-9]*$/,
	                        message: '排序号只能为数字'
	                   	}
					}
				},
				icon: {
					validators: {
						notEmpty: {
							message: '系统模块图标不能为空'
						}
					}
				},
				topBarCode: {
					validators: {
						notEmpty: {
							message: '系统模块编号不能为空'
						},
						stringLength: {
	                        max: 20,
	                        message: '系统模块编号不能超过20个字符'
	                    },
						regexp: {
	                        regexp: /^\w{1,}$/,
	                        message: '系统模块编号只能为字母数字下划线'
	                   	}
					}
				}
			}
		})
		.on('success.form.bv', function(e) {
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			saveDictionary();
		});
};
/*
 * 修改系统验证
 */
function varligate() {
	$('#editSystem')
		.bootstrapValidator({
			message: 'This value is not valid',
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {
				topBarName: {
					message: '用户名验证不通过',
					validators: {
						notEmpty: {
							message: '系统模块名称不能为空'
						},
						stringLength: {
	                        max: 10,
	                        message: '系统模块不能超过10个字符'
	                    }
					}
				},
				sort: {
					validators: {
						notEmpty: {
							message: '排序号不能为空'
						},
						regexp: {
	                        regexp: /^[0-9]*$/,
	                        message: '排序号只能为数字'
	                   	}
					}
				},
				icon: {
					validators: {
						notEmpty: {
							message: '系统模块图标不能为空'
						}
					}
				},
				topBarCode: {
					validators: {
						notEmpty: {
							message: '系统模块编号不能为空'
						},
						stringLength: {
	                        max: 20,
	                        message: '系统模块编号不能超过20个字符'
	                    },
						regexp: {
	                        regexp: /^\w{1,}$/,
	                        message: '系统模块编号只能为字母数字下划线'
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