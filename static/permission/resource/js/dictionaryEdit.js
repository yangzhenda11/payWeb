
/*
 * 返回跳转按钮
 *  1加缓存
 */
function backDictionary(value){
	if(value == 1){
		sessionStorage.setItem("readCache","1");	
	};
	window.location.href = "index.html#dictionaryList";
};
//新增字典保存事件
function saveDictionary(){
	var $json = form2json($("#addDictionary"));
	var loginUserId = sessionStorage.getItem("id");
	$json = JSON.parse($json);
	$json.loginUserId = loginUserId;
	$json = JSON.stringify($json);
	$.ajax({
		type: "POST",
		url: '/dictionary/add',
		data: $json,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				ToolTipTop.Show("添加成功！","success");
				backDictionary(0);				
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
	$("#addDictionary").data('bootstrapValidator').destroy();
	$('#addDictionary').data('bootstrapValidator', null);
	validator();
};

/*
 * 查看字典详情
 */
function dictionaryDetails(){
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).dictionaryDetail;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}else{
		$.ajax({
			type: "GET",
			url: '/dictionary/get',
			data: "data=" + parameter,
			contentType: "application/json",
			dataType: 'json',
			success: function(result) {
				isSuccessCode(result.code);
				if(result.code == 200) {
					var data = result.data;
					var dictionaryName = data.dictionaryName == null ? '' : data.dictionaryName;
					var dictionaryCode = data.dictionaryCode == null ? '' : data.dictionaryCode;
					var description = data.description == null ? '' : data.description;
					var createdTime = data.createdTime == null ? '' : getFormatDateByLong(data.createdTime, "yyyy-MM-dd hh:mm:ss");
					if(data.status == 0) {
						$("input[name=status][value='0']").attr("checked", true);
					}else if(data.status == 1){
						$("input[name=status][value='1']").attr("checked", true);
					};
					if(data.parentId == -1){
						$("#parentName").val("该字典属于父级字典");
					}else{
						var parentName = data.parentName == null ? '' : data.parentName;
						$("#parentName").val(parentName);
					}
					$("#dictionaryNameDetails").val(dictionaryName);
					$("#dictionaryCodeDetails").val(dictionaryCode);
					$("#descriptionDetails").val(description);					
					$("#createdTime").val(createdTime);
					
				} else {
					var ms = result.message;
					ToolTipTop.Show(ms,"error");
				}
			}
		});
	}
};

/*
 * 修改填充字典
 */
function editDictionary() {
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).dictionaryEdit;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}else{
		$.ajax({
			type: "GET",
			url: '/dictionary/get',
			data: "data=" + parameter,
			contentType: "application/json",
			dataType: 'json',
			success: function(result) {
				isSuccessCode(result.code);
				if(result.code == 200) {
					var data = result.data;
					var dictionaryName = data.dictionaryName == null ? '' : data.dictionaryName;
					var dictionaryCode = data.dictionaryCode == null ? '' : data.dictionaryCode;
					var description = data.description == null ? '' : data.description;
					var status = '';
					if(data.status == 0) {
						$("input[name=status][value='0']").attr("checked", true);
					}else if(data.status == 1){
						$("input[name=status][value='1']").attr("checked", true);
					};
					$("#editDictionaryId").val(parameter);
					$("#editDictionaryName").val(dictionaryName);
					$("#editDictionaryCode").val(dictionaryCode);
					$("#editDescription").val(description);
					$("#editDictionaryCodes").val(dictionaryCode);
					query(data);
				} else {
					var ms = result.message;
					ToolTipTop.Show(ms,"error");
				}
			}
		});
	}
};

/*
 * 修改验证后提交
 */
function updateDictionary(){
	$json = form2json($("#editDictionary"));
	var loginUserId = sessionStorage.getItem("id");
	$json = JSON.parse($json);
	$json.loginUserId = loginUserId;
	$json = JSON.stringify($json);
	$.ajax({
		type: "POST",
		url: '/dictionary/modify',
		data: $json,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				ToolTipTop.Show("修改成功","success");
				backDictionary(1);
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
};

/*
 *编辑字典父级
 */
function query(datas) {
	$.ajax({
		type: "GET",
		url: '/dictionary/tree/query',
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var html = "";
				var data = result.data;
				var checkedId = datas.id;
				var checkedParentId = datas.parentId;
				var checkedparentName = datas.parentName;
				if(checkedParentId == -1){
					html = "<option value='-1'> ———— 父级字典 ————</option>";
				}else{
					html = "<option value='" + checkedParentId + "'>" + checkedparentName + "</option>";
					html += "<option value='-1'> ———— 父级字典 ————</option>";
				}
				for(var i = 0; i < data.length; i++) {
					if(data[i].id != checkedId){
						if(data[i].id != checkedParentId){
							var len = data[i].treeId.length/4-1;
							html += "<option value='" + data[i].id + "'>"+ blankReturn(len) +"" + data[i].dictionaryName + "</option>"
						}
					}
				}
				$("#editParentId").html(html);
			}
		}
	});
}

//得到父级字典列表
function queryParent() {
	$.ajax({
		type: "GET",
		url: '/dictionary/tree/query',
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var html = "";
				var data = result.data;
					html = "<option value='-1'> ———— 父级字典 ————</option>";
					for(var i = 0; i < data.length; i++) {
						var len = data[i].treeId.length/4-1;
						html += "<option value='" + data[i].id + "'>"+ blankReturn(len) + data[i].dictionaryName + "</option>"
					}
				$("#addparentId").html(html);
			}
		}
	});
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

//编辑字典失败后重置验证
function resetEditModel(){
	$("#editDictionary").data('bootstrapValidator').destroy();
	$('#editDictionary').data('bootstrapValidator', null);
	varligate();
}


/*
 * 编辑字典验证
 */
function varligate() {
	$('#editDictionary')
		.bootstrapValidator({
			message: 'This value is not valid',
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {
				dictionaryName: {
					message: '用户名验证不通过',
					validators: {
						notEmpty: {
							message: '字典名称不能为空'
						},
						stringLength: {
	                        max: 30,
	                        message: '字典名称不能超过30个字符'
	                    }

					}
				},
				dictionaryCode: {
					validators: {
						notEmpty: {
							message: '字典编号不能为空'
						},
						stringLength: {
	                        max: 30,
	                        message: '字典编号不能超过30个字符'
	                    },
						regexp: {
	                        regexp: /^\w{1,}$/,
	                        message: '字典编号只能为字母数字下划线'
	                   	}
					}
				},
				description: {
					validators: {
						notEmpty: {
							message: '描述不能为空'
						},
						stringLength: {
	                        max: 60,
	                        message: '描述不能超过60个字符'
	                    }
					}
				}
			}
		})
		.on('success.form.bv', function(e) {
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			updateDictionary();
		});
}

//新增字典验证
function validator() {
	$('#addDictionary')
		.bootstrapValidator({
			message: 'This value is not valid',
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {
				dictionaryName: {
					message: '用户名验证不通过',
					validators: {
						notEmpty: {
							message: '字典名称不能为空'
						},
						stringLength: {
	                        max: 30,
	                        message: '字典名称不能超过30个字符'
	                    }
					}
				},
				dictionaryCode: {
					validators: {
						notEmpty: {
							message: '字典编号不能为空'
						},
						stringLength: {
	                        max: 30,
	                        message: '字典编号不能超过30个字符'
	                    },
						regexp: {
	                        regexp: /^\w{1,}$/,
	                        message: '字典编号只能为字母数字下划线'
	                   	}
					}
				},
				description: {
					validators: {
						notEmpty: {
							message: '描述不能为空'
						},
						stringLength: {
	                        max: 60,
	                        message: '描述不能超过60个字符'
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