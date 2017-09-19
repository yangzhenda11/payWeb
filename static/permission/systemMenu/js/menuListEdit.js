/*
 * 返回
 */
function backMenuList(){
	sessionStorage.setItem("readCache","1");
	window.location.href = "index.html#menuList";
}
/*
 * 新增内容填充
 */
function addMenuSet(){
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).menuAdd;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}else{
		var topBarCode = parameter.split("^&^")[0];
		var topBarName = parameter.split("^&^")[1];
		var addLoginUserId = sessionStorage.getItem("id");
		$("#addLoginUserId").val(addLoginUserId);
		$("#addTopBarName").val(topBarName);
		$(".setSystemName").text(topBarName);
		$("#addTopBarCode").val(topBarCode);
		queryParent(topBarCode);
		validator();
	};    
};

//新增系统模块保存事件
function saveAddMenu(){
	var $json = form2json($("#addMenu"));
	//alert($json);
	$.ajax({
		type: "POST",
		url: '/menu/add',
		data: $json,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				ToolTipTop.Show("添加成功","success");
				backMenuList();
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

//得到父级菜单列表
function queryParent(topBarCode) {
	var obj = new Object();
	var loginUserId = sessionStorage.getItem("id");
	obj.userId = loginUserId;
	obj.needRoot = "no";
	obj.topBarCode = topBarCode;
	$.ajax({
		type: "GET",
		url: '/menu/tree/query',
		contentType: "application/json",
		data:obj,
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var html = "";
				var data = result.data;
					html = "<option value='-1'> ———— 父级菜单 ————</option>";
					for(var i = 0; i < data.length; i++) {
						if(data[i].parentId == -1){
							var len = data[i].treeId.length/4-2;
							html += "<option value='" +data[i].menuCode+"'>"+ blankReturn(len) +"" + data[i].menuName + "</option>";
						}					
					}
				$("#addparentId").html(html);
			}
		}
	});
}

//查看菜单详情
function menuDetail(){
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).menuDetail;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}else{
		var topBarCode = parameter.split("^&^")[0];
		var topBarName = parameter.split("^&^")[1];
		var menuCode = parameter.split("^&^")[2];
		var value = topBarCode + "-" + menuCode;
		$(".setSystemName").text(topBarName);
		$.ajax({
			type: "GET",
			url: '/menu/get',
			data: "data=" + value,
			contentType: "application/json",
			dataType: 'json',
			success: function(result) {
				isSuccessCode(result.code);
				if(result.code == 200) {
					var data = result.data;
					var menuName = data.menuName == null ? '' : data.menuName;
					var menuCode = data.menuCode == null ? '' : data.menuCode;
					var urls = data.url == null ? '' : data.url;					
					var description = data.description == null ? '' : data.description;
					var icon = data.icon == null ? '' : data.icon;
					var createdTime = data.createdTime == null ? '' : getFormatDateByLong(data.createdTime, "yyyy-MM-dd hh:mm:ss");
					var status = '';
					var type = '';
					if(data.type == 1){
						type = "普通菜单";
					}else if(data.type == 2){
						type = "权限菜单";
					}else if(data.type == 3){
						type = "权限设置菜单";
					};
					if(data.parentId == -1){
						$("#parentMenuDetails").val("本身为父级菜单");
					}else{
						var parentmenuDetails = data.parentName == null ? '' : data.parentName;						
						$("#parentMenuDetails").val(parentmenuDetails);
					}
					$("#menuNameDetails").val(menuName);
					$("#menuCodeDetails").val(menuCode);
					$("#urlDetails").val(urls);
					$("#iconDetails").val(icon);	
					$("#systemDetails").val(topBarName);
					$("#typeDetails").val(type);
					$("#descriptionDetails").val(description);
					$("#statusDetails").val(status);				
					$("#createdTimeDetails").val(createdTime);
					if(data.status == 0) {
						$("input[name=status][value='0']").attr("checked", true);
					}else if(data.status == 1){
						$("input[name=status][value='1']").attr("checked", true);
					};
					
				} else {
					var ms = result.message;
					ToolTipTop.Show("加载超时","error");
				}
			}
		});
	}
}

//修改填充菜单
function editMenu() {
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).menuEdit;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}else{
		var topBarCode = parameter.split("^&^")[0];
		var topBarName = parameter.split("^&^")[1];
		var menuCode = parameter.split("^&^")[2];
		var value = topBarCode + "-" + menuCode;
		$(".setSystemName").text(topBarName);
		$.ajax({
			type: "GET",
			url: '/menu/get',
			data: "data=" + value,
			contentType: "application/json",
			dataType: 'json',
			success: function(result) {
				isSuccessCode(result.code);
				if(result.code == 200) {
					var data = result.data;
					var menuName = data.menuName == null ? '' : data.menuName;
					var menuCode = data.menuCode == null ? '' : data.menuCode;
					var icon = data.icon == null ? '' : data.icon;
					var urls = data.url == null ? '' : data.url;
					var description = data.description == null ? '' : data.description;
					var loginUserId = sessionStorage.getItem("id");
					if(data.type == 1){
						$("#editType option[value='1']").attr("selected", true);
					}else if(data.type == 2){
						$("#editType option[value='2']").attr("selected", true);
					}else if(data.type == 3){
						$("#editType option[value='3']").attr("selected", true);
					};			
					if(data.status == 0) {
						$("input[name=status][value='0']").attr("checked", true);
					}else if(data.status == 1){
						$("input[name=status][value='1']").attr("checked", true);
					};
					$("#editIcon").val(icon);
					$("#editLoginUserId").val(loginUserId);
					$("#editMenuName").val(menuName);
					$("#editMenuCode").val(menuCode);
					$("#editTopBarName").val(topBarName);
					$("#editMenuCodes").val(menuCode);
					$("#editTopBarCode").val(topBarCode);
					$("#editUrl").val(urls);
					$("#editDescription").val(description);
					query(data,topBarCode);
					varligate();
				} else {
					var ms = result.message;
					ToolTipTop.Show(ms,"error");
				}
			}
		});
	};
}

//编辑菜单父级
function query(datas,topBarCode) {
	var obj = new Object();
	var loginUserId = sessionStorage.getItem("id");
	obj.userId = loginUserId;
	obj.needRoot = "no";
	obj.topBarCode = topBarCode;
	obj.menuCode = $("#editMenuCodes").val();
	$.ajax({
		type: "GET",
		url: '/menu/tree/query',
		contentType: "application/json",
		data:obj,
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
				var html = "";
				var data = result.data;
				var isMenuName = datas.menuName;
				var checkedParentId = datas.parentId;
				var checkedparentName = datas.parentName;
				if(checkedParentId == -1){
					html = "<option value='-1'> ———— 父级菜单 ————</option>";
				}else{
					html = "<option value='" + checkedParentId + "'>" + checkedparentName + "</option>";
					html += "<option value='-1'> ———— 父级菜单 ————</option>";
				}
				for(var i = 0; i < data.length; i++) {
					if(data[i].menuName != isMenuName){
						if(data[i].menuName != checkedparentName){
							if(data[i].parentId == -1){
								var len = data[i].treeId.length/4-2;
								html += "<option value='" + data[i].menuCode + "'>"+ blankReturn(len) +"" + data[i].menuName + "</option>";
							}
						}
					}
				}
				$("#editparentId").html(html);
			}		
	});
}
//修改菜单提交
function updateMenu(){
	$json = form2json($("#editMenu"));
	$.ajax({
		type: "POST",
		url: '/menu/modify',
		data: $json,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				ToolTipTop.Show("修改成功","success");
				backMenuList();
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
//编辑失败后重置验证
function resetEditModel(){
	$("#editMenu").data('bootstrapValidator').destroy();
	$('#editMenu').data('bootstrapValidator', null);
	varligate();
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
//新增字典失败后重置验证
function resetAddModel(){
	$("#addMenu").data('bootstrapValidator').destroy();
	$('#addMenu').data('bootstrapValidator', null);
	validator();
}
//新增系统模块验证
function validator() {
	$('#addMenu')
		.bootstrapValidator({
			message: 'This value is not valid',
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {
				menuName: {
					message: '用户名验证不通过',
					validators: {
						notEmpty: {
							message: '菜单名称不能为空'
						},
						stringLength: {
	                        max: 10,
	                        message: '菜单名称不能超过10个字符'
	                    }
					}
				},
				menuCode: {
					validators: {
						notEmpty: {
							message: '菜单编号不能为空'
						},
						stringLength: {
	                        max: 40,
	                        message: '菜单编号不能超过40个字符'
	                    },
						regexp: {
	                        regexp: /^\w{1,}$/,
	                        message: '菜单编号只能为字母数字下划线'
	                   	}
					}
				},
				description: {
					validators: {
						notEmpty: {
							message: '描述不能为空'
						},
						stringLength: {
	                        max: 40,
	                        message: '描述不能超过40个字符'
	                    }
					}
				}
			}
		})
		.on('success.form.bv', function(e) {
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			saveAddMenu();
		});
};

/*
 * 编辑验证
 */
function varligate() {
	$('#editMenu')
		.bootstrapValidator({
			message: 'This value is not valid',
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {
				menuName: {
					message: '用户名验证不通过',
					validators: {
						notEmpty: {
							message: '菜单名称不能为空'
						},
						stringLength: {
	                        max: 10,
	                        message: '菜单名称不能超过10个字符'
	                    }
					}
				},
				menuCode: {
					validators: {
						notEmpty: {
							message: '菜单编号不能为空'
						},
						stringLength: {
	                        max: 40,
	                        message: '菜单编号不能超过40个字符'
	                    },
						regexp: {
	                        regexp: /^\w{1,}$/,
	                        message: '菜单编号只能为字母数字下划线'
	                   	}
					}
				},
				description: {
					validators: {
						notEmpty: {
							message: '描述不能为空'
						},
						stringLength: {
	                        max: 40,
	                        message: '描述不能超过40个字符'
	                    }
					}
				}
			}
		})
		.on('success.form.bv', function(e) {
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			updateMenu();
		});
}