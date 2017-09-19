$(function () {
    getChannelList();
    validator();
});

/*
 * 获取支付通道
 */
function getChannelList() {
	$.ajax({
		type: "GET",
		url: '/payChannel/list',
		contentType: "application/json",
		dataType: 'json',
		success: function (result) {

			isSuccessCode(result.code);

			var channelList = result.data;
			var html = "";
			for (var i in channelList) {
				html += "<option value='" + channelList[i].id + "'>" + channelList[i].description + "</option>"
			}
			$("#payChannelId").html(html);
			$('#payChannelId').selectpicker({
			    liveSearch: 'true',
			    title:"请选择设备通道",
			    width:"100%"
			});
		}
	});
}

/*
 * 支付通道列表
 */
function addDevicesConfig() {
    var spId = $("#spId").val();
    var configId = $("#configId").val();
    $.ajax({
        type: "POST",
        url: "/device/queryUnConfigDevice",
        data: {
            "spId": spId,
            "configId": configId
        },
        async: false,
        success: function (data) {
            $("#dialog").dialog();
            var htm = '<input id="checkall" onclick="checkSelect()" type="checkbox"  value="">全选<br/> ';
            for (var i = 0; i < data.length; i++) {
                htm += '<input name="check" type="checkbox"  value="' + data[i].deviceId + '">' + data[i].deviceId + "<br/>";
                htm += '<input name="check" type="checkbox"  value="' + data[i].deviceType + '">' + data[i].deviceType + "<br/>";
            }
            $("#addDevicesTable tbody").html(htm);

        },
        error: function (request) {
            ToolTipTop.Show("加载超时","error");
        }
    });
}

function checkSelect() {
    if ($("#checkall").prop('checked')) {
        $("input[name='check']").prop('checked', true);
    } else {
        $("input[name='check']").prop('checked', false);
    }
}

/*
 * 保存配置
 */
function save() {	
	var payChannelId = $("#payChannelId").val();
	if(payChannelId == ""){
		resetAddModel();
		ToolTipTop.Show("支付通道不能为空","error");
	}else{
		var jsondata = form2json($("#deviceConfigForm"));
		$.ajax({
	        type: "post",
	        url: "/deviceConfig/add",
	        data: jsondata,
	        dataType: 'json',
	        contentType: 'application/json',
	        traditional: true,
	        processData: false,
	        success: function (result) {
	            isSuccessCode(result.code);
	            if (result.code == '200') {	            	
	            	ToolTipTop.Show("新增设备配置成功","success");
	            	window.location.href = "index.html#deviceConfigList";
	            } else {
	                var ms = result.message;
	                resetAddModel();
	                ToolTipTop.Show(ms,"error");
	            }
	        }
	    });
	}
}
//新增配置失败后重置验证
function resetAddModel(){
	$("#deviceConfigForm").data('bootstrapValidator').destroy();
	$('#deviceConfigForm').data('bootstrapValidator', null);
	validator();
};
$("#interfaceTypeseletId").on("change",function(){
	if($(this).val() == "Serial"){
		$("#port").parent().css("display","none");
		$("#ip").parent().css("display","none");
		$("#baudrateSelectId").parent().css("display","block");
	}else if($(this).val() == "Parallel"){
		$("#port").parent().css("display","none");
		$("#ip").parent().css("display","none");
		$("#baudrateSelectId").parent().css("display","none");
	}else if($(this).val() == "USB"){
		$("#port").parent().css("display","none");
		$("#ip").parent().css("display","none");
		$("#baudrateSelectId").parent().css("display","none");
	}else{
		$("#port").parent().css("display","block");
		$("#ip").parent().css("display","block");
		$("#baudrateSelectId").parent().css("display","none");
	}
})
/*
 * 返回支付配置列表
 */
function goDeviceConfigList(){
	window.location.href = "index.html#deviceConfigList";
}
//表单验证
function validator() {
	$('#deviceConfigForm')
		.bootstrapValidator({
			message: 'This value is not valid',
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {
				configName: {
					
					validators: {
						notEmpty: {
							message: '配置名称不能为空'
						}
						
					}
				},
				feeKeyword: {
					validators: {
						notEmpty: {
							message: '金额关键字不能为空'
						}
					}
				},
				exclusionKeyword: {
					validators: {
						notEmpty: {
							message: '排除关键字不能为空'
						}
					}
				},
				topMargin: {
					validators: {
						notEmpty: {
							message: '请输入顶部边距值'
						},
						regexp: {
	                        regexp: /(^\d{1,}$)/,
	                        message: '请输入正确的顶部边距值'
	                    }
					}
				},
				bottomMargin: {
					validators: {
						notEmpty: {
							message: '请输入底部边距值'
						},
						regexp: {
	                        regexp: /(^\d{1,}$)/,
	                        message: '请输入正确的底部边距值'
	                    }
					}
				}       
			}
		})
		.on('success.form.bv', function(e) {
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			save();
		});
};