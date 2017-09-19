$(function () {
    var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).payChannelConfig;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	};
    viewDetails(parameter);
    validator();
});

/*
 * 返回按钮，设置读取缓存
 */
function gopayChannelList(){
	sessionStorage.setItem("readCache","1");
	window.location.href='index.html#payChannelList';
}

/*
 * 显示填充
 */
function viewDetails(id) {
    var url = '/payChannel/get';
    $.ajax({
        type: 'GET',
        url: url,
        data: "data=" + id,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            if (result.code === 200) {
                var data = result.data;
                $("#id").val(id);
                $("#description").val(data.description);
                $("#customerName").val(data.customerName);				
				if (data.channelType == 1) {
                    $("#channelTypeCommon").attr('checked', 'true');
                } else {
                    $("#channelTypeSlef").attr('checked', 'true');
                    $("#fixationPayDiv").attr("style", "display:block;");
                };                
				$("#fixationMoney").val(data.fixationMoney);
                $("#sign_key").val(data.signKey);
                $("#refundUrl").val(data.refundUrl);
                $("#query_order_url").val(data.queryOrderUrl);
                $("#scanned_pay_url").val(data.scannedPayUrl);
                $("#generate_order_url").val(data.generateOrderUrl);
                $("#time_out").val(data.timeout);
                $("#customerId").val(data.customerId);
            } else {
                var ms = result.message;
                ToolTipTop.Show(ms,"error");
            }
        },
        error: function (result) {
            ToolTipTop.Show("加载超时","error");
        }
    });
}
/*
 * 修改支付通道
 */
function updatePayChannel() {
    $json = form2json($("#payChannelForm"));
    $url = '/payChannel/modify';
    $.ajax({
        type: 'POST',
        url: $url,
        data: $json,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            if (result.code === 200) {                
                ToolTipTop.Show("修改支付通道成功","success");
                gopayChannelList()
            } else {
                var ms = result.message;
                ToolTipTop.Show(ms,"error");
            }
        },
        error: function (result) {
            ToolTipTop.Show("加载超时","error");
        },

    });
}
/*
 * 定额切换
 */
function changeChannelType(channelType) {
	if (channelType == 2) {
		$("#fixationPayDiv").attr("style", "display:block;");
	} else {
		$("#fixationPayDiv").attr("style", "display:none;");
		$("#fixationMoney").val("0");
	}
}
//表单验证	
function validator() {
	$('#payChannelForm')
		.bootstrapValidator({
			message: 'This value is not valid',
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {
				description: {
					message: '用户名验证不通过',
					validators: {
						notEmpty: {
							message: '通道名称不能为空'
						}
						
					}
				},
				customerName: {
					validators: {
						notEmpty: {
							message: '服务商名称不能为空'
						}
					}
				},
				fixationMoney: {
					validators: {
						notEmpty: {
							message: '金额不能为空'
						},
						regexp: {
	                        //regexp: /^((([1-9]|[1-9]\d)(\.\d{1,2})?)|(0(\.[1-9]))|(0(\.[0-9][1-9])))$/,
	                        regexp: /^(([1-9]\d*)|([0-9]\d*\.\d?[1-9]{1}))$/,
                        	message: '请输入大于0的正确金额'
	                   	}
					}
				},
				signKey: {
					validators: {
						notEmpty: {
							message: '密钥不能为空'
						}
					}
				}
//					queryOrderUrl: {
//						validators: {
//							notEmpty: {
//								message: '订单查询链接不能为空'
//							}
//						}
//					},
//					scannedPayUrl: {
//						validators: {
//							notEmpty: {
//								message: '刷卡支付链接不能为空'
//							}
//						}
//					},
//					generateOrderUrl: {
//						validators: {
//							notEmpty: {
//								message: '统一下单链接不能为空'
//							}
//						}
//					},
//					
//					timeOut: {
//						validators: {	
//							regexp: {
//								
//		                        regexp: /^([123456789]|[1-5][0-9]|60)$/,
//		                        message: '请输入1-60之间的正整数'
//		                   },
//							
//							notEmpty: {
//								message: '请求超时时间不能为空'
//							}
//						}
//					}
			}
		})
		.on('success.form.bv', function(e) {
			// Prevent form submission
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			updatePayChannel();
		});
	
};