/*
 * 返回设备配置列表，存储缓存
 */
function godeviceConfigList(){
	sessionStorage.setItem("readCache","1");
	window.location.href = "index.html#deviceConfigList"
}

$(function () {
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).deviceConfigDetails;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	};
    var configId =  parameter;
    $.ajax({
        type: "GET",
        url: '/deviceConfig/get',
        data: 'data=' + configId,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            isSuccessCode(result.code);
            var data = result.data;
            if (data != null) {
                $("#payChannelId").text(data.payChannelName);                
                $("#payChannelId").attr('href', "javascript:void(0);");
				$("#payChannelId").click(function(){			    	
			    	var id =  data.payChannelId;
			    	goPayChanneDetalis(id);
			    })
//              if (data.scan) {
//                  $("#scanConfigTdId").text("被扫(刷卡)");
//                  $("#paymentTypeTr").css("display", "none")
//
//                  if (data.scan) {
//                      $("#paymentTypeTr").css("display", "table-row");
//                  } else {
//                      $("#paymentTypeTr").css("display", "none");
//                  }
//              }
//              if (data.scan) {
//                  $("#scanConfigTdId").text("主扫(扫码)");
//                  $("#paymentTypeTr").css("display", "table-row");
//
//                  var payTypeKeyword = data.payTypeKeyword;
//                  var payTypeKeyword1 = "";
//                  var payTypeKeyword2 = "";
//
//                  if (payTypeKeyword != null) {
//                      payTypeKeyword1 = payTypeKeyword.split(",")[0];
//                      payTypeKeyword2 = payTypeKeyword.split(",")[1];
//                  }
//
//                  var payTypeHtml = "";
//                  if (payTypeKeyword1 != null && payTypeKeyword1 != "") {
//                      if ("wxpay" == payTypeKeyword1) {
//                          payTypeHtml = "微信";
//                      } else if ("alipay" == payTypeKeyword1) {
//                          payTypeHtml = "支付宝"
//                      }
//                  }
//
//                  if (payTypeKeyword2 != null && payTypeKeyword2 != "") {
//                      if ("wxpay" == payTypeKeyword2) {
//                          payTypeHtml += ", " + "微信";
//                      } else if ("alipay" == payTypeKeyword2) {
//                          payTypeHtml += ", " + "支付宝";
//                      }
//                  }
//
//                  if ("" != payTypeHtml) {
//                      $("#paymentTypeTdId").text(payTypeHtml);
//                  }
//              }

                $("#configName").val(data.configName);
                $("#spName").val(data.configName);

                $("#feeKeyword").val(data.feeKeyword);
                $("#exclusionKeyword").val(data.exclusionKeyword);
                $("#printerType").val(data.printerType);
				
                if ("Serial" == data.interfaceType) {
                    $("#interfaceType").val("串口RS232");
					$("#baudrateSelectId").parent().css("display","block");
                    $("#baudrateSelectId").val(data.baudrate);
                } else if("Parallel" == data.interfaceType){
                    $("#interfaceType").val("并口");
                } else if("USB" == data.interfaceType){
                	$("#interfaceType").val("USB");
                } else if("Net" == data.interfaceType){
                	$("#interfaceType").val("网络");
                	$("#port").parent().css("display","block");
					$("#ip").parent().css("display","block");
					$("#port").val(data.port);
					$("#ip").val(data.ip);
                } else{
                	$("#interfaceType").val(data.interfaceType);
                }
//              if ("Net" == data.interfaceType) {
//              	alert(1)
//                  $("#interfaceTypeTdId").val("网络");
//
//                  $("#port").val(data.port);
//                  $("#portTrId").css("display", "table-row");
//
//                  $("#ipTr").css("display", "table-row");
//                  $("#ip").val(data.ipAddress);
//              } else {
//                  $("#portTrId").css("display", "none");
//                  $("#ipTr").css("display", "none");
//              }
//
//              $("#interfaceTypeTdId").val(data.interfaceType);

                if ("Ascii" == data.imagePrintType) {
                    $("#imagePrintType").val("ASCII");
                } else if ("CustomAscii" == data.imagePrintType) {
                    $("#imagePrintType").val("CustomASCII");
                } else {
                    $("#imagePrintType").val(data.imagePrintType);
                }
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
                }
                $("#topMargin").val(data.topMargin);
                $("#bottomMargin").val(data.bottomMargin);
            } else {
                ToolTipTop.Show("获取失败","error");
            }
        }
    });
    
});
/*
 * go支付通道详情
 */
function goPayChanneDetalis(id){
	sessionStorage.setItem("checkNav","支付通道");
	var parameter = {
		"payChannelDetails":id
	};
	parameter = JSON.stringify(parameter);
	sessionStorage.setItem("parameter",parameter);
	window.location.href = "index.html#payChannelDetails";
};
