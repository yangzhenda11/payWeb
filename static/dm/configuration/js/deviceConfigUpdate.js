$(function () {
    getConfig();
    validator();
});
/*
 * 获取设备配置服务商信息
 */
function getChannelList(id,name) {
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).deviceConfigUpdata;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}
    var customerId= parameter.split("&")[0].split("=")[1];
    $.ajax({
        type: "GET",
        url: '/payChannel/list',
        contentType: "application/json",
        data: "customerId=" + customerId,
        dataType: 'json',
        success: function (result) {
            isSuccessCode(result.code);
			if(result.code == 200){
				var channelList = result.data;
	            var html = "<option value='" + id + "'>" + name + "</option>";
	            for (var i in channelList) {
	            	if(channelList[i].id != id){
	            		html += "<option value='" + channelList[i].id + "'>" + channelList[i].description + "</option>"
	            	}	                
	            };
	            $("#payChannelId").html(html);
	            $('#payChannelId').selectpicker({
				    liveSearch: 'true',
				    width:"100%"
				});
			}else{
				var ms = result.message;
				ToolTipTop.Show(ms,"error");
			}
        }
    }); 
}
/*
 * 获取设备配置信息
 */
function getConfig() {
    var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).deviceConfigUpdata;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}
    var customerId = parameter.split("&")[0].split("=")[1];
    var configId = parameter.split("&")[1].split("=")[1];
    $("#configId").val(configId);
    // $("#customerId").val(customerId);
    $.ajax({
        type: "GET",
        url: '/deviceConfig/get',
        data: 'data=' + configId,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            isSuccessCode(result.code);
            if(result.code == 200){
            	var data = result.data;
            	var panChannelId = data.payChannelId;
            	var payChannelName = data.payChannelName;
                $("#configId").val(configId);
                $("#configName").val(data.configName);
                $("#feeKeyword").val(data.feeKeyword);
                $("#exclusionKeyword").val(data.exclusionKeyword);
                $("#printerType").val(data.printerType);
                if ("Serial" == data.interfaceType) {
                    $("#interfaceTypeseletId").val("Serial");
                    $("#baudrateSelectId").parent().css("display","block");
                    $("#baudrateSelectId").val(data.baudrate);
                }else if("Parallel" == data.interfaceType){
                	$("#interfaceTypeseletId").val("Parallel");
                }else if("USB" == data.interfaceType){
                	$("#interfaceTypeseletId").val("USB");
                }else if("Net" == data.interfaceType){
                	$("#interfaceTypeseletId").val("Net");
                	$("#port").parent().css("display","block");
                	$("#ip").parent().css("display","block");
                	$("#port").val(data.port);
                    $("#ip").val(data.ip);
                }else{
                	$("#interfaceTypeseletId").val(data.interfaceType);
                }
                $("#imagePrintType").val(data.imagePrintType);
                if ("0" == data.headerCut) {
                    $("input[name=headerCut][value='0']").attr("checked", true);
                }
                if ("1" == data.headerCut) {
                    $("input[name=headerCut][value='1']").attr("checked", true);
                }

                if ("0" == data.footerCut) {
                    $("input[name=footerCut][value='0']").attr("checked", true);
                }
                if ("1" == data.footerCut) {
                    $("input[name=footerCut][value='1']").attr("checked", true);
                }
                if ("1" == data.scan) {
                    $("input[name=scan][value='1']").attr("checked", true);
                }
                if ("2" == data.scan) {
                    $("input[name=scan][value='2']").attr("checked", true);
                }
                if ("3" == data.scan) {
                    $("input[name=scan][value='3']").attr("checked", true);
                };				
                $("#topMargin").val(data.topMargin);
                $("#bottomMargin").val(data.bottomMargin);
                getChannelList(panChannelId,payChannelName)
            } else {
            	var ms = result.message;
				ToolTipTop.Show(ms,"error");
            }
        }
    });
}
/*
 * 配置修改
 */
function updateConfig() {	
	var jsondata = form2json($("#deviceConfigForm"));
	$.ajax({
        type: "post",
        url: "/deviceConfig/modify",
        data: jsondata,
        dataType: 'json',
        contentType: 'application/json',
        traditional: true,
        processData: false,
        success: function (result) {
            if (result.code == '200') {           	
            	ToolTipTop.Show("修改设备配置成功","success");
            	goDeviceConfigList();
            } else {
                ToolTipTop.Show("修改设备配置失败","error");
            }
        }

    });
}
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
});

/*
 * 返回按钮，设置读取缓存
 */
function goDeviceConfigList(){
	sessionStorage.setItem("readCache","1");
	window.location.href='index.html#deviceConfigList';
};
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
			updateConfig();
		});
};
