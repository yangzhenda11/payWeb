var newConfig = null;
var newWxpayConfig = null;
var newAlipayConfig = null;
var newSpdpayConfig = null;
var newBfbpayConfig = null;
var newSwiftpayConfig = null;
$(function(){
	addListTree();
	getCustomerConfig();
	wxpayValidator();
	alipayValidator();
	spdpayValidator();
	bfbpayValidator();
	swiftpayValidator();
	setstyle();

});
/*
 * 获取通道
 */
function getCustomerConfig(){
	var customerId = location.search.slice(1).split("&")[0].split("=")[1];
	$("#straight").on("click",function(){
		wxpayConfig();
	});
	$("#pufaGallery").on("click",function(){
		spdpayConfig();
	})
	$("#swiftGallery").on("click",function(){
		swiftpayConfig();
	})
	$.ajax({
		type: "GET",
		url: '/spChannelChoose/get',
		data: "data="+customerId,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var status = isEmptyObject(result.data);
				if(status == true){
					newConfig = 1;
					$("#default").prop("checked",true);
					getConfig();
				}else{
					newConfig = 0;
					setConfig(result.data);
				};
			} else {
				var ms =result.message;
				ToolTipTop.Show(ms,"error");
			}
		}
	});
};

/*
 * 设置配置方式
 */
function setConfig(data){
	if(data.type == 1){
		$("#straight").prop("checked",true);
		wxpayConfig();
	}else if(data.type == 2){
		$("#pufaGallery").prop("checked",true);
		spdpayConfig();
	}else if(data.type == 3){
		$("#swiftGallery").prop("checked",true);
		//spdpayConfig();
	}else{
		$("#default").prop("checked",true);
		getConfig();
	}
}

/*
 * 配置新增(1) && 修改(0)
 */
function saveConfig(fn,errorFn){
	var fun = fn;
	var errorFn = errorFn;
	if(newConfig == 1){
		var customerId = location.search.slice(1).split("&")[0].split("=")[1];
		var loginUserId = sessionStorage.getItem("id");
		$value = form2json($("#customerSelect"));
		$value = JSON.parse($value);
		$value.customerId = customerId;
		$value.loginUserId = loginUserId;
		if($value.type == ""){
			ToolTipTop.Show("请选择一个通道","error");
			errorFn();
			
		}else{
			$.ajax({
		        type: 'POST',
		        url: '/spChannelChoose/add',
		        data: JSON.stringify($value),
		        contentType: "application/json",
		        dataType: 'json',
		        async:false,
		        success: function (result) {
		            isSuccessCode(result.code);
		            if (result.code === 200) {
		            	newConfig = 0;
		            	fun();
		            } else {
		                var ms = result.message;
		                $("#default").prop("checked",true);
		                errorFn();
		                ToolTipTop.Show(ms,"error");
		            }
		        },
		        error: function (result) {
		        	$("#default").prop("checked",true);
		        	errorFn();
		            ToolTipTop.Show("加载超时","error");
		        }
		    });
		}
	}else if(newConfig == 0){		
		var customerId = location.search.slice(1).split("&")[0].split("=")[1];
		var loginUserId = sessionStorage.getItem("id");
		$value = form2json($("#customerSelect"));
		$value = JSON.parse($value);
		$value.customerId = customerId;
		$value.loginUserId = loginUserId;
		if($value.type == ""){
			ToolTipTop.Show("请选择一个通道","error");
			errorFn();
		}else{
			$.ajax({
		        type: 'POST',
		        url: '/spChannelChoose/modify',
		        data: JSON.stringify($value),
		        contentType: "application/json",
		        dataType: 'json',
		        async:false,
		        success: function (result) {
		            isSuccessCode(result.code);
		            if (result.code === 200) {
		            	fun();
		            } else {
		                var ms = result.message;
		                $("#default").prop("checked",true);
		                errorFn();
		                ToolTipTop.Show(ms,"error");
		            }
		        },
		        error: function (result) {
		        	$("#default").prop("checked",true);
		        	errorFn();
		            ToolTipTop.Show("加载超时","error");
		        }
		    });
		}
   };
};

//证书上传
(function (_, $) {
    $("#file").fileinput({
        language: 'zh', 
        uploadUrl: "/file/upload", 
        uploadAsync: true,
        allowedFileExtensions: ['p12'],
        maxFileSize: 1024000,
        maxFileCount: 10,
        //showPreview:false,
        slugCallback: function (filename) {
            return filename;
        }
    });
    $("#file").on("fileuploaded", function (event, data) {
        var res=data.response;
        if(res.code == 200){
        	setstyle();
        	$("#wxcertLocalPath").val(res.data);
        	$("#fileStaut").text("(证书已上传)");
        }else{
        	var ms = res.message;
        	ToolTipTop.Show(ms,"error");
        }
    });

})(window, jQuery);

//获取配置数据
function getConfig(){
	if($("#wxPayBtn").attr("class") == "checkbtn"){
		$("#alipayConfigForm,#spdConfigForm,#bfbConfigForm,#swiftConfigForm").removeClass("show").addClass("hidden");
		$("#wxpayConfigForm").removeClass("hidden").addClass("show");
		getwxpayConfig();		
	}else if($("#aliPayBtn").attr("class") == "checkbtn"){
		$("#alipayConfigForm").removeClass("hidden").addClass("show");
		$("#wxpayConfigForm,#spdConfigForm,#bfbConfigForm,#swiftConfigForm").removeClass("show").addClass("hidden");
		$("#getAliQR").css("display","block");
		$("#getState").css("display","none");
		$("#unwraps").css("display","none");
		$("#qrCodeValue").css("display","none");
		$("#qrCode").empty();
		getalipayConfig();
	}else if($("#spdPayBtn").attr("class") == "checkbtn"){
		$("#wxpayConfigForm,#alipayConfigForm,#bfbConfigForm,#swiftConfigForm").removeClass("show").addClass("hidden");
		$("#spdConfigForm").removeClass("hidden").addClass("show");
		getSpdPayConfig();
	}else if($("#bfbPayBtn").attr("class") == "checkbtn"){
		$("#wxpayConfigForm,#alipayConfigForm,#spdConfigForm,#swiftConfigForm").removeClass("show").addClass("hidden");
		$("#bfbConfigForm").removeClass("hidden").addClass("show");
		getBfbPayConfig();
	}else if($("#swiftPayBtn").attr("class") == "checkbtn"){
		$("#wxpayConfigForm,#alipayConfigForm,#spdConfigForm,#bfbConfigForm").removeClass("show").addClass("hidden");
		$("#swiftConfigForm").removeClass("hidden").addClass("show");
		getSwiftPayConfig();
	}
}
//支付宝配置点击
function alipayConfig(){
	$("#aliPayBtn").removeClass("uncheckbtn").addClass("checkbtn");
	$("#wxPayBtn,#spdPayBtn,#bfbPayBtn,#swiftPayBtn").removeClass("checkbtn").addClass("uncheckbtn");
	$("#straight").prop("checked",true);
	getConfig();
}
//微信配置点击
function wxpayConfig(){
	$("#aliPayBtn,#spdPayBtn,#bfbPayBtn,#swiftPayBtn").removeClass("checkbtn").addClass("uncheckbtn");
	$("#wxPayBtn").removeClass("uncheckbtn").addClass("checkbtn");
	$("#straight").prop("checked",true);
	getConfig();
}
//百付宝配置点击
function bfbpayConfig() {
	$("#aliPayBtn,#wxPayBtn,#spdPayBtn,#swiftPayBtn").removeClass("checkbtn").addClass("uncheckbtn");
	$("#bfbPayBtn").removeClass("uncheckbtn").addClass("checkbtn");
	$("#straight").prop("checked",true);
	getConfig();
}
//浦发银行配置点击
function spdpayConfig(){
	$("#aliPayBtn,#wxPayBtn,#bfbPayBtn,#swiftPayBtn").removeClass("checkbtn").addClass("uncheckbtn");
	$("#spdPayBtn").removeClass("uncheckbtn").addClass("checkbtn");
	$("#pufaGallery").prop("checked",true);
	getConfig();
}
//威富通点击
function swiftpayConfig(){
	$("#aliPayBtn,#wxPayBtn,#bfbPayBtn,#spdPayBtn").removeClass("checkbtn").addClass("uncheckbtn");
	$("#swiftPayBtn").removeClass("uncheckbtn").addClass("checkbtn");
	$("#swiftGallery").prop("checked",true);
	getConfig();
}


//获取微信配置
function getwxpayConfig() {
	var customerId = location.search.slice(1).split("&")[0].split("=")[1];
	$.ajax({
		type: "GET",
		url: '/wxpayConfig/customer/query',
		data: "customerId=" + customerId,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var status = isEmptyObject(result.data);
				if(status == true){
					newWxpayConfig = 1;
					resetWxpayValue(0);
				}else{
					newWxpayConfig = 0;
					setWxpayValue(result.data);
				};
			} else {
				var ms =result.message;
				ToolTipTop.Show(ms,"error");
			}
		}
	});
}
//获取支付宝配置
function getalipayConfig() {
	var customerId = location.search.slice(1).split("&")[0].split("=")[1];
	$.ajax({
		type: "GET",
		url: '/alipayConfig/customer/query',
		data: "customerId=" + customerId,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var status = isEmptyObject(result.data);
				if(status == true){
					newAlipayConfig = 1;
					resetAlipayValue(0);
				}else{
					newAlipayConfig = 0;
					setAlipayValue(result.data);
				};
			} else {
				var ms =result.message;
				ToolTipTop.Show(ms,"error");
			}
		}
	});
}
/*
 * 获取浦发银行配置
 */
function getSpdPayConfig(){
	var customerId = location.search.slice(1).split("&")[0].split("=")[1];
	$.ajax({
		type: "GET",
		url: '/spdbPayConfig/customer/query',
		data: "customerId=" + customerId,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var status = isEmptyObject(result.data);
				if(status == true){
					newSpdpayConfig = 1;
					resetSpdpayValue(0);
				}else{
					newSpdpayConfig = 0;
					setSpdpayValue(result.data);
				};
			} else {
				var ms =result.message;
				ToolTipTop.Show(ms,"error");
			}
		}
	});
}

/*
 * 获取百付宝配置
 */
function getBfbPayConfig(){
	var customerId = location.search.slice(1).split("&")[0].split("=")[1];
	$.ajax({
		type: "GET",
		url: '/bfbpayConfig/customer/query',
		data: "customerId=" + customerId,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var status = isEmptyObject(result.data);
				if(status == true){
					newBfbpayConfig = 1;
					resetBfbpayValue(0);
				}else{
					newBfbpayConfig = 0;
					setBfbpayValue(result.data);
				};
			} else {
				var ms =result.message;
				ToolTipTop.Show(ms,"error");
			}
		}
	});
}
/*
 * 获取威富通配置
 */
function getSwiftPayConfig(){
	var customerId = location.search.slice(1).split("&")[0].split("=")[1];
	$.ajax({
		type: "GET",
		url: '/swiftpassConfig/customer/query',
		data: "customerId=" + customerId,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var status = isEmptyObject(result.data);
				if(status == true){
					newSwiftpayConfig = 1;
					resetSwiftpayValue(0);
				}else{
					newSwiftpayConfig = 0;
					setSwiftpayValue(result.data);
				};
			} else {
				var ms =result.message;
				ToolTipTop.Show(ms,"error");
			}
		}
	});
}
//获取二维码
$("#getAliQR").on("click",function(){
	saveConfig(getQR);
});
function getQR(){
	if($('#aliType3').is(':checked')){
		var customerId = location.search.slice(1).split("&")[0].split("=")[1];
		var storeId = $("#storeId").val();
		var data = {
			"customerId":customerId
		}
		$.ajax({
			type: "get",
			url: '/alipayConfig/isvappid/query',
			data:data,
			contentType: "application/json",
			dataType: 'json',
			success: function(result) {
				isSuccessCode(result.code);
				if(result.code == 200){
					var data = result.data;					
					var url = "http://openauth.alipay.com/oauth2/appToAppAuth.htm?app_id="+data+"&redirect_uri=http://dm.2dupay.com/sp/alipay/isv.html?customerId="+customerId+"&storeId="+storeId;
//					var url = "http://openauth.alipay.com/oauth2/appToAppAuth.htm?app_id="+data+"&redirect_uri=http://dm.testing.2dupay.com/sp/alipay/isv.html?customerId="+customerId+"&storeId="+storeId;	
					jQuery('#qrCode').qrcode(url);
//					jQuery('#qrCode').qrcode({
//			     	 	render : "canvas",
//			         	text : url,
//			         	width : "300",               //二维码的宽度
//		                height : "300",              //二维码的高度
//		                background : "#ffffff",       //二维码的后景色
//		                foreground : "#000000",        //二维码的前景色
//		                src: '../../common/images/qrCode.png'             //二维码中间的图片
//				     });

					$("#qrCodeValue").css("display","block");
					$("#qrCodeValue").data("href",url);
					$("#getAliQR").css("display","none");
					$("#getState").css("display","block");
				}else{
					var ms = result.message;
					ToolTipTop.Show(ms,"error");
				}
			},
			error:function(result){
				ToolTipTop.Show("加载超时","error");
			}
		});
	}
}
$("#unwraps").on("click",function(){
	Messager.confirm({Msg: '确认解绑此支付配置？', title: '解绑支付配置'}).on(function (flag) {
    	if (flag) {
			var id = $("#ISVId").val();
			var $data = $.parseJSON('[' + id + ']');
			$.ajax({
				type: "post",
				url: '/alipayConfig/deletes',
				data:JSON.stringify($data),
				contentType: "application/json",
				dataType: 'json',
				success: function(result) {
					isSuccessCode(result.code);
					if(result.message == "SUCCESS"){
						getConfig();
						ToolTipTop.Show("账户解绑成功","success");						
					}else{
						var ms = result.message;
						getConfig();
		            	ToolTipTop.Show(ms,"error");
					}
				},
				error: function (result) {
		            ToolTipTop.Show("加载超时","error");
		        }
			});
		}
    });
});
$("#qrCodeValue").on("click",function(){
	var qrurl = $("#qrCodeValue").data("href");
	window.open(qrurl);
});
$("#getState").on("click",function(){
	getConfig();
});

//微信配置新增(1) && 修改(0)
function saveWxpay(){
	if($("input[id='wxType3']").prop("checked")){
		saveConfig(saveWxconfig,resteWxpayValidator);
	}else{
		if($("#fileStaut").text() == "(证书未上传)"){
			ToolTipTop.Show("请先上传证书文件","error");
		}else{
			saveConfig(saveWxconfig,resteWxpayValidator);
		}
	}
};
function saveWxconfig(){
	if(newWxpayConfig == 1){		
		var customerId = location.search.slice(1).split("&")[0].split("=")[1];
		$("#wxCustomerId").val(customerId);
		$wxpayValue = form2json($("#wxpayConfigForm"));
		$wxpayValue = JSON.parse($wxpayValue);
		delete $wxpayValue.id;
		delete $wxpayValue.parentId;
		$wxpayValue = JSON.stringify($wxpayValue);
		//alert($wxpayValue);
	    $.ajax({
	        type: 'POST',
	        url: '/wxpayConfig/add',
	        data: $wxpayValue,
	        contentType: "application/json",
	        dataType: 'json',
	        success: function (result) {
	            isSuccessCode(result.code);
	            if (result.code === 200) {
	            	$("#wxpayConfigForm").data('bootstrapValidator').destroy();
			        $('#wxpayConfigForm').data('bootstrapValidator', null);
			        wxpayValidator();
	            	getConfig();
	                ToolTipTop.Show("新增支付配置信息成功","success");
	            } else {
	                var ms = result.message;
	                resteWxpayValidator();
	        		getConfig();	                
                	ToolTipTop.Show(ms,"error");              
	            }
	        },
	        error: function (result) {
	            ToolTipTop.Show("加载超时","error");
	        }
	    })
	};
	if(newWxpayConfig == 0){
		Messager.confirm({Msg: '确认修改此支付配置信息?', title: '修改支付配置'}).on(function (flag) {
        	if (flag) {
        		$wxpayValue = form2json($("#wxpayConfigForm"));
			    $.ajax({
			        type: 'POST',
			        url: '/wxpayConfig/modify',
			        data: $wxpayValue,
			        contentType: "application/json",
			        dataType: 'json',
			        success: function (result) {
			            isSuccessCode(result.code);
			            if (result.code == 200) {
					        resteWxpayValidator();
			            	getConfig();
			            	ToolTipTop.Show("修改支付配置信息成功","success");
			            } else {
			                var ms = result.message;
			                resteWxpayValidator();
			        		getConfig();
			               	ToolTipTop.Show(ms,"error");
			            }
			        },
			        error: function (result) {
			            ToolTipTop.Show("加载超时","error");
			        }
			    })
        	}
 		});
	}
}
//支付宝配置新增(1) && 修改(0)
function saveAlipay(){
	if(newAlipayConfig == 1){
		if($('#aliType1').is(':checked') || $('#aliType2').is(':checked')){
			var customerId = location.search.slice(1).split("&")[0].split("=")[1];
			$("#aliCustomerId").val(customerId);
			$alipayValue = form2json($("#alipayConfigForm"));
			$alipayValue = JSON.parse($alipayValue);
			delete $alipayValue.id;
			delete $alipayValue.parentId;
			delete $alipayValue.appAuthAppId;
			delete $alipayValue.ISVId;
			delete $alipayValue.storeId;
			$alipayValue = JSON.stringify($alipayValue);
		    $.ajax({
		        type: 'POST',
		        url: '/alipayConfig/add',
		        data: $alipayValue,
		        contentType: "application/json",
		        dataType: 'json',
		        success: function (result) {
		            isSuccessCode(result.code);
		            if (result.code === 200) {
		            	resteAlipayValidator();
		            	getConfig();
		            	ToolTipTop.Show("新增支付配置信息成功","success");
		            } else {
		                var ms = result.message;
		                resteAlipayValidator();
	            		getConfig();
	            		ToolTipTop.Show(ms,"error");
		            }
		        },
		        error: function (result) {
		        	ToolTipTop.Show("加载超时","error");
		        }
		    });
		};
	};
	if(newAlipayConfig == 0){
		Messager.confirm({Msg: '确认修改此支付配置信息?', title: '修改支付配置'}).on(function (flag) {
        	if (flag) {
        		if($('#aliType1').is(':checked') || $('#aliType2').is(':checked')){
	        		$alipayValue = form2json($("#alipayConfigForm"));
	        		$alipayValue = JSON.parse($alipayValue);
					delete $alipayValue.appAuthAppId;
					delete $alipayValue.ISVId;
					delete $alipayValue.storeId;
					$alipayValue = JSON.stringify($alipayValue);
				    $.ajax({
				        type: 'POST',
				        url: '/alipayConfig/modify',
				        data: $alipayValue,
				        contentType: "application/json",
				        dataType: 'json',
				        success: function (result) {
				            isSuccessCode(result.code);
				            if (result.code == 200) {
						        resteAlipayValidator();
				            	getConfig();
				            	ToolTipTop.Show("修改支付配置信息成功","success");				            	
				            } else {
				            	resteAlipayValidator();
			            		getConfig();
				                var ms = result.message;
				                ToolTipTop.Show(ms,"error");
				            }
				        },
				        error: function (result) {
				            ToolTipTop.Show("加载超时","error");
				        }
				    })
				};
        	}
 		});
	}
};
//浦发银行配置新增(1) && 修改(0)
function saveSpdpay(){
	if(newSpdpayConfig == 1){
		var customerId = location.search.slice(1).split("&")[0].split("=")[1];
		$("#spdCustomerId").val(customerId);
		$spdpayValue = form2json($("#spdConfigForm"));
		$spdpayValue = JSON.parse($spdpayValue);
		delete $spdpayValue.id;
		$spdpayValue = JSON.stringify($spdpayValue);
	    $.ajax({
	        type: 'POST',
	        url: '/spdbPayConfig/add',
	        data: $spdpayValue,
	        contentType: "application/json",
	        dataType: 'json',
	        success: function (result) {
	            isSuccessCode(result.code);
	            if (result.code === 200) {	            	
	            	resteSpdpayValidator();
	            	getConfig();
	                ToolTipTop.Show("新增支付配置信息成功","success");
	            } else {
	                var ms = result.message;
	                resteSpdpayValidator();
	        		getConfig();
	                ToolTipTop.Show(ms,"error");
	            }
	        },
	        error: function (result) {
	            ToolTipTop.Show("加载超时","error");
	        }
	    })
	};
	if(newSpdpayConfig == 0){
		Messager.confirm({Msg: '确认修改此支付配置信息?', title: '修改支付配置'}).on(function (flag) {
        	if (flag) {
        		$spdpayValue = form2json($("#spdConfigForm"));
			    $.ajax({
			        type: 'POST',
			        url: '/spdbPayConfig/modify',
			        data: $spdpayValue,
			        contentType: "application/json",
			        dataType: 'json',
			        success: function (result) {
			            isSuccessCode(result.code);
			            if (result.code == 200) {
					        resteSpdpayValidator();
			            	getConfig();
			            	ToolTipTop.Show("修改支付配置信息成功","success");			            	
			            } else {
			                var ms = result.message;
			                resteSpdpayValidator();
			        		getConfig();
			               	ToolTipTop.Show(ms,"error");
			            }
			        },
			        error: function (result) {
			            ToolTipTop.Show("加载超时","error");
			        }
			    })
        	}
 		});
	}
};
//百付宝配置新增(1) && 修改(0)
function saveBfbpay(){
	if(newBfbpayConfig == 1){
		var customerId = location.search.slice(1).split("&")[0].split("=")[1];
		$("#bfbCustomerId").val(customerId);
		$bfbpayValue = form2json($("#bfbConfigForm"));
		$bfbpayValue = JSON.parse($bfbpayValue);
		delete $bfbpayValue.id;
		$bfbpayValue = JSON.stringify($bfbpayValue);
		$.ajax({
			type: 'POST',
			url: '/bfbpayConfig/add',
			data: $bfbpayValue,
			contentType: "application/json",
			dataType: 'json',
			success: function (result) {
				isSuccessCode(result.code);
				if (result.code === 200) {
					resteBfbpayValidator();
					getConfig();
					ToolTipTop.Show("新增支付配置信息成功","success");
				} else {
					var ms = result.message;
					resteBfbpayValidator();
					getConfig();
					ToolTipTop.Show(ms,"error");
				}
			},
			error: function (result) {
				ToolTipTop.Show("加载超时","error");
			}
		})
	};
	if(newBfbpayConfig == 0){
		Messager.confirm({Msg: '确认修改此支付配置信息?', title: '修改支付配置'}).on(function (flag) {
			if (flag) {
				$bfbpayValue = form2json($("#bfbConfigForm"));
				$.ajax({
					type: 'POST',
					url: '/bfbpayConfig/modify',
					data: $bfbpayValue,
					contentType: "application/json",
					dataType: 'json',
					success: function (result) {
						isSuccessCode(result.code);
						if (result.code == 200) {
							resteBfbpayValidator();
							getConfig();
							ToolTipTop.Show("修改支付配置信息成功","success");
						} else {
							var ms = result.message;
							resteBfbpayValidator();
							getConfig();
							ToolTipTop.Show(ms,"error");
						}
					},
					error: function (result) {
						ToolTipTop.Show("加载超时","error");
					}
				})
			}
		});
	}
};

//威富通配置新增(1) && 修改(0)
function saveSwiftpay(){
	if(newSwiftpayConfig == 1){
		var customerId = location.search.slice(1).split("&")[0].split("=")[1];
		$("#swiftCustomerId").val(customerId);
		$swiftpayValue = form2json($("#swiftConfigForm"));
		$swiftpayValue = JSON.parse($swiftpayValue);
		delete $swiftpayValue.id;
		$swiftpayValue = JSON.stringify($swiftpayValue);
		$.ajax({
			type: 'POST',
			url: '/swiftpassConfig/add',
			data: $swiftpayValue,
			contentType: "application/json",
			dataType: 'json',
			success: function (result) {
				isSuccessCode(result.code);
				if (result.code === 200) {
					resteSwiftpayValidator();
					getConfig();
					ToolTipTop.Show("新增支付配置信息成功","success");
				} else {
					var ms = result.message;
					resteSwiftpayValidator();
					getConfig();
					ToolTipTop.Show(ms,"error");
				}
			},
			error: function (result) {
				ToolTipTop.Show("加载超时","error");
			}
		})
	};
	if(newSwiftpayConfig == 0){
		Messager.confirm({Msg: '确认修改此支付配置信息?', title: '修改支付配置'}).on(function (flag) {
			if (flag) {
				$swiftpayValue = form2json($("#swiftConfigForm"));
				$.ajax({
					type: 'POST',
					url: '/swiftpassConfig/modify',
					data: $swiftpayValue,
					contentType: "application/json",
					dataType: 'json',
					success: function (result) {
						isSuccessCode(result.code);
						if (result.code == 200) {
							resteSwiftpayValidator();
							getConfig();
							ToolTipTop.Show("修改支付配置信息成功","success");
						} else {
							var ms = result.message;
							resteSwiftpayValidator();
							getConfig();
							ToolTipTop.Show(ms,"error");
						}
					},
					error: function (result) {
						ToolTipTop.Show("加载超时","error");
					}
				})
			}
		});
	}
}
//微信配置文档填充
function setWxpayValue(data){
	$("#wxpayConfigForm input[type='text']").val("")
	$("#wxCustomerId").val(data.customerId);
	$("#wxParentId").val(data.parentId);
	$("#wxId").val(data.id);
	$("#wxConfigName").val(data.configName);
	if(data.type == 1 || data.type == 2){
		$("#wxChild").removeClass("show").addClass("hidden");
		$("#wxParent").removeClass("hidden").addClass("show");
		$("#wxappId").val(data.appId);
		$("#wxappidKey").val(data.appidKey);
		$("#wxmchNum").val(data.mchNum);
		$("#wxappSecret").val(data.appSecret);
		if(data.certLocalPath == "undefind" || data.certLocalPath ==""){
			$("#wxcertLocalPath").val("");
       		$("#fileStaut").text("(证书未上传)");
		}else{
			$("#wxcertLocalPath").val(data.certLocalPath);
        	$("#fileStaut").text("(证书已上传)");
		}
		if(data.type == 1){
			$("input[id='wxType1']").prop("checked",true);
			$("input[id='wxType2']").unbind("click").on("click",function(){
				$("#wxConfigName,#wxappId,#wxappidKey,#wxmchNum,#wxappSecret,#wxcertLocalPath").val("");
				$("#fileStaut").text("(证书未上传)");
				resteWxpayValidator();
			});
			$("input[id='wxType1']").unbind("click").on("click",function(){
				getConfig();
				resteWxpayValidator();
			});
			$("input[id='wxType3']").unbind("click").on("click",function(){
				$("#wxConfigName,#wxcertLocalPath").val("");
				resteWxpayValidator();
			});
		};
		if(data.type == 2){
			$("input[id='wxType2']").prop("checked",true);
			$("input[id='wxType2']").unbind("click").on("click",function(){
				getConfig();
				resteWxpayValidator();
			});
			$("input[id='wxType1']").unbind("click").on("click",function(){
				$("#wxConfigName,#wxappId,#wxappidKey,#wxmchNum,#wxappSecret,#wxcertLocalPath").val("");
				$("#fileStaut").text("(证书未上传)");
				resteWxpayValidator();
			});
			$("input[id='wxType3']").unbind("click").on("click",function(){
				$("#wxConfigName,#wxcertLocalPath").val("");
				resteWxpayValidator();
			});
		};
	};
	if(data.type == 3){
		$("input[id='wxType3']").prop("checked",true);
		$("#wxParent").removeClass("show").addClass("hidden");
		$("#wxChild").removeClass("hidden").addClass("show");
		$("#wxsubMchNum").val(data.subMchNum);
		$("#wxsubAppid").val(data.subAppid);
		$("#wxsubAppSecret").val(data.subMchNum);
		$("input[id='wxType3']").unbind("click").on("click",function(){
			getConfig();
			resteWxpayValidator();
		});
		$("input[id='wxType1']").unbind("click").on("click",function(){
			$("#wxConfigName,#wxappId,#wxappidKey,#wxmchNum,#wxappSecret,#wxcertLocalPath").val("");
			$("#fileStaut").text("(证书未上传)");
			resteWxpayValidator();
		});
		$("input[id='wxType2']").unbind("click").on("click",function(){
			$("#wxConfigName,#wxappId,#wxappidKey,#wxmchNum,#wxappSecret,#wxcertLocalPath").val("");
			$("#fileStaut").text("(证书未上传)");
			resteWxpayValidator();
		});
	};
};
function resteWxpayValidator(){
	$("#wxpayConfigForm").data('bootstrapValidator').destroy();
    $('#wxpayConfigForm').data('bootstrapValidator', null);
    wxpayValidator();
}
//支付宝配置文档填充
function setAlipayValue(data){
	$("#alipayConfigForm input[type='text']").val("")
	$("#aliCustomerId").val(data.customerId);
	$("#aliParentId").val(data.parentId);
	$("#aliId").val(data.id);
	if(data.type == 1 || data.type == 2){
		$("#aliConfigName").val(data.configName);
		$("#aliChild").removeClass("show").addClass("hidden");
		$("#aliParent").removeClass("hidden").addClass("show");
		$("#aliappId").val(data.appId);
		$("#aliPartner").val(data.partner);
		$("#alitimeExpress").val(data.timeExpress);
		$("#alipayPrivateKey").val(data.alipayPrivateKey);
		if(data.type == 1){
			$("input[id='aliType1']").prop("checked",true);
			$("input[id='aliType2']").unbind("click").on("click",function(){
				$("#aliConfigName,#aliappId,#aliPartner,#alitimeExpress,#alipayPrivateKey").val("");
				resteAlipayValidator();
			});
			$("input[id='aliType1']").unbind("click").on("click",function(){
				getConfig();
				resteAlipayValidator();
			});
			$("input[id='aliType3']").unbind("click").on("click",function(){
				$("#aliConfigName,#aliappId,#aliPartner,#alitimeExpress,#alipayPrivateKey").val("");
				resteAlipayValidator();
			});
		};
		if(data.type == 2){
			$("input[id='aliType2']").prop("checked",true);
			$("input[id='aliType1']").unbind("click").on("click",function(){
				$("#aliConfigName,#aliappId,#aliPartner,#alitimeExpress,#alipayPrivateKey").val("");
				resteAlipayValidator();
			});
			$("input[id='aliType2']").unbind("click").on("click",function(){
				getConfig();
				resteAlipayValidator();
			});
			$("input[id='aliType3']").unbind("click").on("click",function(){
				$("#aliConfigName,#aliappId,#aliPartner,#alitimeExpress,#alipayPrivateKey").val("");
				resteAlipayValidator();
			});
		};
	};
	if(data.type == 3){
		$("#aliParent").removeClass("show").addClass("hidden");
		$("#aliChild").removeClass("hidden").addClass("show");
		$("input[id='aliType3']").prop("checked",true);
		$("#unwraps").css("display","block");
		var textValue = data.authAppId+"("+data.configName+")";
		$("#appAuthAppId").val(textValue);
		$("#storeId").val(data.storeId);
		$("#ISVId").val(data.id);
		$("input[id='aliType2']").unbind("click").on("click",function(){
			$("#aliConfigName,#aliappId,#aliPartner,#alitimeExpress,#alipayPrivateKey").val("");
			resteAlipayValidator();
		});
		$("input[id='aliType3']").unbind("click").on("click",function(){
			getConfig();
			resteAlipayValidator();
		});
		$("input[id='aliType1']").unbind("click").on("click",function(){
			$("#aliConfigName,#aliappId,#aliPartner,#alitimeExpress,#alipayPrivateKey").val("");
			resteAlipayValidator();
		});
	};
}
function resteAlipayValidator(){
	$("#alipayConfigForm").data('bootstrapValidator').destroy();
    $('#alipayConfigForm').data('bootstrapValidator', null);
    alipayValidator();
}
//浦发银行配置文档填充
function setSpdpayValue(data){
	$("#spdConfigForm input[type='text']").val("");
	$("#spdCustomerId").val(data.customerId);
	$("#spdId").val(data.id);
	$("#spdConfigName").val(data.configName);
	if(data.type == 1){
		$("#spdParent").removeClass("hidden");
		$("#spdChild").addClass("hidden");
		$("#spdInscd").val(data.inscd);
		$("#spdTerminalId").val(data.terminalId);		
		$("input[id='spdType1']").prop("checked",true);
		$("input[id='spdType2']").unbind("click").on("click",function(){
			$("#spdConfigName,#spdInscd,#spdTerminalId,#spdMerchantId,#spdbKey").val("");
			$("#WXP").prop("checked",true);
			resteSpdpayValidator();
		});
		$("input[id='spdType1']").unbind("click").on("click",function(){
			getConfig();
			resteSpdpayValidator();
		});
	}else if(data.type == 2){
		$("#spdChild").removeClass("hidden");
		$("#spdParent").addClass("hidden");
		$("input[id='spdType2']").prop("checked",true);
		$("#spdMerchantId").val(data.merchantId);
		$("#spdbKey").val(data.spdbKey);
		$("input[id='"+data.unifiedType+"']").prop("checked",true);
		$("input[id='spdType2']").unbind("click").on("click",function(){
			getConfig();
			resteSpdpayValidator();
		});
		$("input[id='spdType1']").unbind("click").on("click",function(){
			$("#spdConfigName,#spdInscd,#spdTerminalId,#spdMerchantId,#spdbKey").val("");
			$("#WXP").prop("checked",true);
			resteSpdpayValidator();
		});
	};
};
function resteSpdpayValidator(){
	$("#spdConfigForm").data('bootstrapValidator').destroy();
    $('#spdConfigForm').data('bootstrapValidator', null);
    spdpayValidator();
}

//百付宝配置文档填充
function setBfbpayValue(data){
	$("#bfbConfigForm input[type='text']").val("");
	$("#bfbCustomerId").val(data.customerId);
	$("#bfbId").val(data.id);
	$("#bfbConfigName").val(data.configName);
	$("#bfbMerchantId").val(data.merchantId);
	$("#baifubaoKey").val(data.baifubaoKey);
	$("#timeExpress").val(data.timeExpress);
	resteBfbpayValidator();
};
function resteBfbpayValidator(){
	$("#bfbConfigForm").data('bootstrapValidator').destroy();
	$('#bfbConfigForm').data('bootstrapValidator', null);
	bfbpayValidator();
}
//威富通配置文档填充
function setSwiftpayValue(data){
	$("#swiftConfigForm input[type='text']").val("");
	$("#swiftCustomerId").val(data.customerId);
	$("#swiftId").val(data.id);
	$("#swiftConfigName").val(data.configName);
	$("#swiftMerchantId").val(data.merchantId);
	$("#swiftpassKey").val(data.swiftpassKey);
	$("#swiftpastimeExpress").val(data.timeExpress);
	resteSwiftpayValidator();
}
function resteSwiftpayValidator(){
	$("#swiftConfigForm").data('bootstrapValidator').destroy();
	$('#swiftConfigForm').data('bootstrapValidator', null);
	swiftpayValidator();
}
//清空微信配置内容
function resetWxpayValue(type){
	$("#wxpayConfigForm input[type='text']").val("")
	if(type == "0"){
		$("input[id='wxType2']").prop("checked",true);
		wxParentSwitch();
	};
}
//清空支付宝配置内容
function resetAlipayValue(type){
	$("#alipayConfigForm input[type='text']").val("");
	if(type == "0"){
		$("input[id='aliType3']").unbind("click");
		$("input[id='aliType2']").prop("checked",true);
		aliParentSwitch();
	};
}
//清空浦发银行配置内容
function resetSpdpayValue(type){
	$("#spdConfigForm input[type='text']").val("");
	var customerType = location.search.slice(1).split("&")[2].split("=")[1];
	if(type == "0"){
		if(customerType == 1){
			$("input[id='spdType1']").prop("checked",true);
			spdParentSwitch();
		}else{
			$("input[id='spdType2']").prop("checked",true);
			spdChildSwitch();
		}
	};
}
//清空百付宝配置内容
function resetBfbpayValue(type){
	$("#bfbConfigForm input[type='text']").val("");
}
//清空威富通配置内容
function resetSwiftpayValue(type){
	$("#swiftConfigForm input[type='text']").val("");
}
//加载列表树
function addListTree(){
	setTreeValue();  //设置列表树内容
	checkNav();			//选择高亮显示
	treedropdown();		//加载列表树格式
}

//普通商户，子商户切换
function wxParentSwitch(){
	$("#wxParent").removeClass("hidden").addClass("show");
	$("#wxChild").removeClass("show").addClass("hidden");
}
function wxChildSwitch(){
	$("#wxParent").removeClass("show").addClass("hidden");
	$("#wxChild").removeClass("hidden").addClass("show");
}
function aliParentSwitch(){
	$("#aliParent").removeClass("hidden").addClass("show");
	$("#aliChild").removeClass("show").addClass("hidden");
}
function aliChildSwitch(){
	$("#aliParent").removeClass("show").addClass("hidden");
	$("#aliChild").removeClass("hidden").addClass("show");
}
function spdParentSwitch(){
	$("#spdChild").addClass("hidden");
	$("#spdParent").removeClass("hidden");
	$("#WXP").prop("checked",true);
}
function spdChildSwitch(){
	$("#spdParent").addClass("hidden");
	$("#spdChild").removeClass("hidden");
	$("#WXP").prop("checked",true);
}
function wxpayValidator() {
	$('#wxpayConfigForm')
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
							message: '微信配置名称不能为空'
						}
						
					}
				},
				appId: {
					validators: {
						notEmpty: {
							message: '公共账号AppID不能为空'
						}
						
					}
				},
				appidKey: {
					validators: {
						notEmpty: {
							message: '公共账号应用秘钥不能为空'
						}
					}
				},
				mchNum: {
					validators: {	
						
						notEmpty: {
							message: '微信商户号不能为空'
						}
					}
				},
				appSecret: {
					validators: {
						notEmpty: {
							message: '微信商户API秘钥不能为空'
						}
					}
				},
				subMchNum: {
					validators: {
						notEmpty: {
							message: '子商户号不能为空'
						}
					}
				}
			}
		})
		.on('success.form.bv', function(e) {
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			saveWxpay();
		});
	
};
//支付宝验证
function alipayValidator() {
	$('#alipayConfigForm')
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
							message: '支付宝配置名称不能为空'
						}
						
					}
				},
				appId: {
					validators: {
						notEmpty: {
							message: '支付宝AppID不能为空'
						}
						
					}
				},
				partner: {
					validators: {
						notEmpty: {
							message: '合作者身份ID不能为空'
						}
					}
				},
				timeExpress: {
					validators: {	
						notEmpty: {
							message: '订单有效时间不能为空'
						},
						regexp: {
	                        regexp: /^[0-9]*$/,
	                        message: '请输入正确的时间'
	                    }
					}
				},
				alipayPrivateKey: {
					validators: {
						notEmpty: {
							message: '支付宝私钥不能为空'
						}
					}
				}
			}
		})
		.on('success.form.bv', function(e) {
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			saveConfig(saveAlipay,resteAlipayValidator);
		});	
};
//浦发银行验证
function spdpayValidator() {
	$('#spdConfigForm')
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
							message: '浦发银行配置名称不能为空'
						}
						
					}
				},
				inscd: {
					validators: {
						notEmpty: {
							message: '机构代码不能为空'
						}
						
					}
				},
				terminalId: {
					validators: {
						notEmpty: {
							message: '终端号不能为空'
						}
					}
				},
				merchantId: {
					validators: {	
						notEmpty: {
							message: '商户号不能为空'
						}
					}
				},
				spdbKey: {
					validators: {
						notEmpty: {
							message: '私钥不能为空'
						}
					}
				}
			}
		})
		.on('success.form.bv', function(e) {
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			saveConfig(saveSpdpay,resteSpdpayValidator);
		});	
};
//百付宝验证
function bfbpayValidator() {
	$('#bfbConfigForm')
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
							message: '百付宝配置名称不能为空'
						}

					}
				},
				merchantId: {
					validators: {
						notEmpty: {
							message: '商户号不能为空'
						}
					}
				},
				baifubaoKey: {
					validators: {
						notEmpty: {
							message: '秘钥不能为空'
						}
					}
				},
				timeExpress: {
					validators: {
						notEmpty: {
							message: '订单有效时间不能为空'
						},
						regexp: {
	                        regexp: /^[0-9]*$/,
	                        message: '请输入正确的时间'
	                    }
					}
				}
			}
		})
		.on('success.form.bv', function(e) {
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			saveConfig(saveBfbpay,resteBfbpayValidator);
		});
};
//威富通验证
function swiftpayValidator(){
	$('#swiftConfigForm')
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
							message: '威富通配置名称不能为空'
						}

					}
				},
				merchantId: {
					validators: {
						notEmpty: {
							message: '商户号不能为空'
						}
					}
				},
				baifubaoKey: {
					validators: {
						notEmpty: {
							message: '秘钥不能为空'
						}
					}
				},
				timeExpress: {
					validators: {
						notEmpty: {
							message: '订单有效时间不能为空'
						},
						regexp: {
	                        regexp: /^[0-9]*$/,
	                        message: '请输入正确的时间'
	                    }
					}
				}
			}
		})
		.on('success.form.bv', function(e) {
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			saveConfig(saveSwiftpay,resteSwiftpayValidator);
		});
}
