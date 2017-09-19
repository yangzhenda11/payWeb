$(function() {
	addListTree();
	serchMerchant(1);
	setstyle();
	$("#addMerchantModal").load("html/model.html?v=17050901 #storeAdd",function(){
		validator();
	});
	$("#editMerchantModal").load("html/model.html?v=17050901 #storeEdit",function(){
		varligate();
	});
	$('#addMerchantModal').on('hidden.bs.modal', function () {
		$("#addMerchantModal").load("html/model.html?v=17050901 #storeAdd",function(){
			validator();
    	});
	});
	$('#editMerchantModal').on('hidden.bs.modal', function () {
		$("#editMerchantModal").load("html/model.html?v=17050901 #storeEdit",function(){
			varligate();
    	});
	});
	$(".tostore").click(function(){
		var checkTreeValue = $(this).data("id");
		sessionStorage.setItem("checkTree",checkTreeValue);
		window.location.href = "merchant.html?merchantId="+$(this).data("id")+"&treeId="+$(this).data("treeid")+"&type="+$(this).data("type");
	});
	var fnCode = queryFnCode();
	addBtnShow(fnCode);
});

//加载商户列表
function serchMerchant(pageIndex){
	var parentId = location.search.slice(1).split("&")[0].split("=")[1];
	var treeId = location.search.slice(1).split("&")[1].split("=")[1];
	var pageSize = 15;
	var name = $("#merchantName").val();
	var data={
		"parentId":parentId,
		"treeId":treeId,
		"name":name,
		"pageIndex":pageIndex,
		"pageSize":pageSize,
		"operateType":"sp",
	}
	$.ajax({
		type: "get",
		url: '/customer/pageList',
		contentType: "application/json",
		dataType: 'json',
		data:data,
		async: false,
		success: function(result) {
			isSuccessCode(result.code);
			var fnCode = queryFnCode();			
			if(result.code == 200) {				
				var data = result.data;
				var merchantList = data.list;
				totalCount = data.listCount;
				$(".fontbold").text(totalCount);
				if(merchantList.length > 0){
					var html = "";
					for(var i = 0; i < merchantList.length; i++) {
						var merchant = merchantList[i];
						var name = '';
	                    var contact = '';
	                    var mobile = '';
	                    var mail = '';
	                    var abb = '';
	                    var types = '';
	                    if(merchant.type == 1){
	                    	types = "服务商";
	                    }else if(merchant.type == 2){
	                    	types = "商户";
	                    }else if(merchant.type == 3){
	                    	types = "门店";
	                    };
	                    if(merchant.abb != undefined){
	                    	abb = merchant.abb;
	                    };
	                    if (merchant.name) {
	                        name= merchant.name;
	                    }
	                    if (merchant.contact) {
	                        contact= merchant.contact;
	                    }
	                    if (merchant.mobile) {
	                        mobile = merchant.mobile;
	                    }
	                    if (merchant.mail) {
	                        mail = merchant.mail;
	                    };	                    
	                    var enableStatus = '启用';
	                    if (merchant.enableStatus == 0) {
	                        enableStatus = '禁用'
	                    }
	                    
	                    html += "<tr><td style='padding-left:20px;'>" +abb + "</td>";
	                    html += "<td class='merOver'>" + "<span title='"+name+"'>" +name + "</span>" + "</td>";
						html += "<td class='merOver'>" +"<span title='"+ contact +"'>" + contact + "</span>" + "</td>";
						html += "<td>" + mobile + "</td>";
						html += "<td style='text-align:center;'>" + enableStatus + "</td>";
						html += "<td style='text-align:center;'>" + types + "</td>";
						html += "<td style='text-align:left;'>";
						if(fnCode.details == "details"){
							html += "<a style='margin-right: 10px;cursor:pointer;overflow:hidden;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='详情' onclick='merchantDetails(" +merchant.id+ ");'><i class='icon iconfont icon-iconfontxiangqing operate'></i></a>";
						};
						if(merchant.type != 3){	                    	
	                    	if(fnCode.list == "list"){
								html += "<a class='tostore' data-id="+merchant.id+" data-treeid="+merchant.treeId+" data-type="+merchant.type+" data-toggle='tooltip' data-placement='bottom' title='下级客户列表' style='margin-right: 10px;cursor:pointer;text-decoration: none;'><i class='icon iconfont icon-list operate'></i></a>";
							}
	                   	};					
						if(fnCode.modify == "modify"){
							html += "<a style='margin-right: 10px;cursor:pointer;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='修改' onclick='queryMerchant(" + merchant.id + ");'><i class='icon iconfont icon-iconfontxiugai operate'></i></a>";
						};
						if(fnCode.delete == "delete"){
							html += "<a data-toggle='tooltip' style='cursor:pointer;text-decoration: none;' data-placement='bottom' title='删除' onclick='deleteMerchant(" + merchant.id + ");'><i class='icon iconfont icon-shanchu operate'></i></a>";
						}
						html += "</td></tr>"
					}
					$("#merchantTable tbody").html(html);					
					var pageIndex = data.pageIndex;
					var fn = "serchMerchant";
					var pagination_html = paging(totalCount,pageSize,pageIndex,fn);
					$("#pagination").html(pagination_html);
				}else{
					$("#merchantTable tbody").html("<tr ><td colspan='8' style='text-align:center;'>查询不到数据！</td></tr>");
					$("#pagination").html("");
				}
			} else {
				$("#merchantTable tbody").html("<tr ><td colspan='8' style='text-align:center;'>查询不到数据！</td></tr>");
				$("#pagination").html("");
				var ms = result.message;
                ToolTipTop.Show(ms,"error");
			};
			setstyle();
		},
		error: function(msg) {
			ToolTipTop.Show("加载超时","error");
		}
	})	
}
//删除商户
function deleteMerchant(merchantID){
	Messager.confirm({Msg: '确认删除此客户?', title: '删除客户'}).on(function (flag) {
        if (flag) {
            $merchantList = $.parseJSON('[' + merchantID + ']');
			$.ajax({
				type: "POST",
				url: '/customer/deletes',
				data: JSON.stringify($merchantList),
				contentType: "application/json",
				dataType: 'json',
				success: function(result) {
					isSuccessCode(result.code);
					if(result.code == 200) {
						ToolTipTop.Show("删除成功","success");
						gettreevalue('merchant.html');
						addListTree();
						serchMerchant(1);
					} else {
						var ms = result.message;
						ToolTipTop.Show(ms,"error");
					}
				}
			});
        }
    });
}
//商户详情
function merchantDetails(merchantId){
	var data = "data="+merchantId;
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
				$("#detName").text(spObject.name);
				$("#detAbb").text(spObject.abb);
				$("#detMobile").text(spObject.mobile);
				$("#detMail").text(spObject.mail);
				$("#detAddress").text(spObject.address);
				$("#detContact").text(spObject.contact);
				$("#detProId").text(spObject.id);
				$("#detSell").text(spObject.salesName);
				var createdTime = spObject.createdTime == null ? '' : getFormatDateByLong(spObject.createdTime, "yyyy-MM-dd hh:mm:ss");
				if(spObject.enableStatus == 1) {
					$("#enableStatus").text("启用");
				} else {
					$("#enableStatus").text("禁用");
				}
				if(spObject.testStatus == 1) {
					$("#testStatus").text("是");
				} else {
					$("#testStatus").text("否");
				}
				if(spObject.type == 1) {
					$("#detType").text("服务商");
				}else if(spObject.type == 2) {
					$("#detType").text("商户");
				}else if(spObject.type == 3){
					$("#detType").text("门店");
				}else{
					$("#detType").text("未知商户类型");
				};
				$("#createdTime").text(createdTime);
				$('#merchantDetails').modal('show');
			} else {
				var ms = result.message;
				ToolTipTop.Show(ms,"error");
			}
		}
	});
}
//编辑商户信息
function queryMerchant(merchantId) {
	$.ajax({
		type: "GET",
		url: '/customer/get',
		data: "data=" + merchantId,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var spObject = result.data;
				$("#editName").val(spObject.name);
				$("#editMobile").val(spObject.mobile);
				$("#editAbb").val(spObject.abb);
				$("#editMail").val(spObject.mail);
				$("#editAddress").val(spObject.address);
				$("#editContact").val(spObject.contact);
				$("#storeId").val(spObject.id);
				$("#storeparentId").val(spObject.parentId);
				if(spObject.type == 1) {
					$("input[id='editType1']").attr("checked", true);
				}else if(spObject.type == 2) {
					$("input[id='editType2']").attr("checked", true);
				}else if(spObject.type == 3){
					$("input[id='editType3']").attr("checked", true);
				};
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
				$('#editMerchantModal').modal();
			} else {
				var ms =result.message;
				ToolTipTop.Show(ms,"error");
			}
		}
	});
}
//修改商户信息提交接口
function updateMerchant() {
	$json = form2json($("#updateStore"));
	
	$.ajax({
		type: "POST",
		url: '/customer/modify',
		data: $json,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				ToolTipTop.Show("修改信息成功","success");
				gettreevalue('merchant.html');
				addListTree();
				serchMerchant(1);
			} else {
				var ms = result.message;
				resetEditModel();
				ToolTipTop.Show(ms,"error");			
			}
		}
	});	
}
//编辑商户信息失败后重置验证
function resetEditModel(){
	$("#updateStore").data('bootstrapValidator').destroy();
	$('#updateStore').data('bootstrapValidator', null);
	varligate();
}
//加载列表树
function addListTree(){ 
	setTreeValue();  //设置列表树内容
	checkNav();			//选择高亮显示
	treedropdown();		//加载列表树格式
	$('#addMerchantModal').modal('hide');
	$('#editMerchantModal').modal('hide');
}

//新增商户
function addMerchant(){
	$('#addMerchantModal').modal('show');
}
//新增服务商商户提交接口
function addCustomerMerchant(){
	var parentId = location.search.slice(1).split("&")[0].split("=")[1];
	$("#parentId").val(parentId);
	var data = form2json($("#storeModal"));
	var name = $("#name").val();
	var parentId = location.search.slice(1).split("&")[0].split("=")[1];
	var treeId = location.search.slice(1).split("&")[1].split("=")[1];
	var value={
		"parentId":parentId,
		"treeId":treeId,
		"name":name
	}
	var res = getAsyncAjax('/customer/list', value);
	if(res.code == 200 && res.data.length > 0) {
		$("#addMerchantModal").modal("hide");
		$("#addMerchantModal").load("html/model.html #merchantAdd",function(){var parentId = location.search.slice(1).split("&")[0].split("=")[1];$("#parentId").val(parentId);validator();});
		ToolTipTop.Show("客户名称已存在","error");
		return;
	} else {
		$.ajax({
			type: "post",
			url: '/customer/add',
			contentType: "application/json",
			dataType: 'json',
			data:data,
			async: false,
			success: function(result) {
				ToolTipTop.Show("新增客户信息成功","success");
				gettreevalue('merchant.html');
				addListTree();
				serchMerchant(1);
			},
			error:function(ms) {
				ToolTipTop.Show("加载超时","error");
			}
		})
	}
}
function getAsyncAjax(url, value) {
	var data = null;
	$.ajax({
		type: "GET",
		url: url,
		data: value,
		contentType: "application/json",
		dataType: 'json',
		async: false,
		success: function(result) {
			data = result;
		},
		error: function(msg) {
			ToolTipTop.Show("加载超时","error");
		}
	});
	return data;
}
//新增商户表单验证
function validator() {
	$('#storeModal')
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
							message: '商户名称不能为空'
						}
						
					}
				},
				abb: {
					message: '用户名验证不通过',
					validators: {
						notEmpty: {
							message: '商户简称不能为空'
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
			addCustomerMerchant();
		});
};
//修改商户信息表单验证
function varligate(){
	$('#updateStore')
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
						message: '商户名称不能为空'
					}
					
				}
			},
			abb:{
				message: '用户名验证不通过',
				validators: {
					notEmpty: {
						message: '商户简称不能为空'
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
};
