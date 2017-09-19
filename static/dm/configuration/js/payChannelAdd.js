$(function(){
	getCustomers();
})

/*
 * 获得服务商
 */
function getCustomers() {
	var data = {
		"operateType":"chooseServiceProvider"
	};
    $.ajax({
        type: "get",
        url: '/customer/list',
        data: data,
        contentType: "application/json",
        dataType: 'json',
        async: false,
        success: function (result) {
            var html = "";
            var customerList = result.data;
            if (customerList != null) {            	
                for (var i = 0; i < customerList.length; i++) {
                    html += "<option value='" + customerList[i].id + "'>" + customerList[i].name + "</option>"
                }
            }
            $("#customerId").html(html);
            $('#customerId').selectpicker({
			    liveSearch: 'true',
			    title:"请选择服务商",
			    width:"100%"
			});
        	validator();
        }
    });
};

/*
 * 添加通道
 */
function addPayChannel() {
    var customerId = $("#customerId").val();
    if(customerId == ""){
    	resetAddModel();
    	ToolTipTop.Show("请选择服务商","error");
    }else{
    	var $json = form2json($("#addChannelForm"));
    	$url = '/payChannel/add';
	    $.ajax({
	        type: "POST",
	        url: $url,
	        data: $json,
	        contentType: "application/json",
	        dataType: 'json',
	        success: function (result) {
	            if (result.code === 200) {	            	
	                ToolTipTop.Show("添加支付通道成功","success");
	                window.location.href="index.html#payChannelList";
	            } else {
	                var ms = result.message;
	                resetAddModel();
	                ToolTipTop.Show(ms,"error");
	            }
	        },
	        error: function (result) {
	            ToolTipTop.Show("加载超时","error");
	        }
	    });
    }  
};

//新增通道失败后重置验证
function resetAddModel(){
	$("#addChannelForm").data('bootstrapValidator').destroy();
	$('#addChannelForm').data('bootstrapValidator', null);
	validator();
};

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
};

/*
 * 返回支付通道列表
 */
function goBackpayChannelList(){
	window.location.href = "index.html#payChannelList";
};

/*
 * 验证
 */
function validator() {
	$('#addChannelForm')
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
				fixationMoney: {
					validators: {
						notEmpty: {
							message: '金额不能为空'
						},
						regexp: {
	                        //regexp: /^((([1-9]|[1-9]\d)(\.\d{1,2})?)|(0(\.[1-9]))|(0(\.[0-9][1-9])))$/,
	                        regexp: /^(([1-9]\d*)|([0-9]+\.[0-9]{1,2}))$/,
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
//				queryOrderUrl: {
//					validators: {
//						notEmpty: {
//							message: '订单查询链接不能为空'
//						}
//					}
//				},
//				scannedPayUrl: {
//					validators: {
//						notEmpty: {
//							message: '刷卡支付链接不能为空'
//						}
//					}
//				},
//				generateOrderUrl: {
//					validators: {
//						notEmpty: {
//							message: '统一下单链接不能为空'
//						}
//					}
//				},
//				timeOut: {
//					validators: {	
//						regexp: {
//	                        regexp: /^([123456789]|[1-5][0-9]|60)$/,
//	                        message: '请输入1-60之间的正整数'
//	                   	},
//						
//						notEmpty: {
//							message: '请求超时时间不能为空'
//						}
//					}
//				}
			}
		})
		.on('success.form.bv', function(e) {
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			addPayChannel();
		});	
};