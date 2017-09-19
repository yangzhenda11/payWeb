$(function () {    
	var fnCode = queryFnCode();
	addBtnShow(fnCode);
	isCache("deviceConfigList",findDeviceConfigs);
	var isAdmin = sessionStorage.getItem("isAdmin");
	if(isAdmin == "true"){
		$("#customer_name").removeClass("hidden");
		$("#customer_input").removeClass("hidden");
	};
});
var funcRef = function(evt){
    evt = evt || window.event;
    if (evt.keyCode==13){
        findDeviceConfigs(1);
    }
}
window.onkeydown = funcRef;
function findDeviceConfigs(pageIndex) {
    var totalCount = 0;
    var pageSize = 15;
    var configName = $("#configName").val();
    configName = $.trim(configName);
    var customer_input = $("#customer_input").val();
    var jsondata = {
        "configName": configName,
        "pageIndex": pageIndex,
        "pageSize": pageSize,
        "customerName":customer_input
    };
    $.ajax({
        type: "get",
        url: '/deviceConfig/pageList',
        data: jsondata,
        contentType: "application/json",
        dataType: 'json',
        success: function (resultdata) {
            isSuccessCode(resultdata.code);
			var fnCode = queryFnCode();
            if (resultdata.code == "200") {
                var deviceConfigResult = resultdata.data;
                totalCount = deviceConfigResult.listCount;
                $(".fontbold").text(totalCount);
                if (deviceConfigResult.list.length != 0) {
                    var str = null;
                    var scanName = null;
                    var resultVaule = null;
               		var payChannelName = null;
               		var customerName = null;
                    var indexNum = resultdata.data.pageIndex;
                    $.each(deviceConfigResult.list, function (i, result) {
                        var config_name = (result['configName'] == null || result['configName'] == undefined) ? "" : result['configName'];
                        payChannelName = result.payChannelName == null ? '' : result.payChannelName;
                        customerName = result.customerName == null ? '' : result.customerName;                        
                        if(result.scan == "1"){
                        	scanName = "主扫(扫码)";
                        };
                        if(result.scan == "2"){
                        	scanName = "被扫(刷卡)";
                        };
                        if(result.scan == "3"){
                        	scanName = "主扫+被扫";
                        };
                        str += "<tr id='device-" + result['id'] + "'>" +
                            "<td style='padding-left:20px;'>" + config_name + "</td>" +
                            "<td>" + customerName + "</td>" +
                            "<td>" + scanName + "</td>" +
                            "<td>" + payChannelName + "</td>" +
                            "<td style='text-align:center;'>";
                        if(fnCode.details == "details"){
							str += '<a style="margin-right: 10px;cursor:pointer;text-decoration: none;" data-toggle="tooltip" data-placement="bottom" title="详情" href="javascript:void(0);" onclick="goDeviceConfigDetails(\''+result.id + '^&^' + indexNum +'\')"><i class="icon iconfont icon-xiangqing operate"></i></a>';
						};
						if(fnCode.list == "list"){
							str += '<a style="margin-right: 10px;cursor:pointer;text-decoration: none;" data-toggle="tooltip" data-placement="bottom" title="列表" href="javascript:void(0);" onclick="goConfiguredDeviceList(' + result.customerId + ',' + result['id'] + ')"><i class="icon iconfont icon-list operate"></i></a>';
						};
						if(fnCode.modify == "modify"){
							str += '<a style="margin-right: 10px;cursor:pointer;text-decoration: none;" data-toggle="tooltip" data-placement="bottom" title="修改" onclick="updateConfig(\''+result.customerId + '^&^' + result.id + '^&^' + indexNum +'\')"><i class="icon iconfont icon-bianji operate"></i></a>';
						};
						if(fnCode.delete == "delete"){
							str += '<a data-toggle="tooltip" style="cursor:pointer;text-decoration: none;" data-placement="bottom" title="刪除" onclick="removeConfig(' + result['id'] + ')"><i class="icon iconfont icon-shanchu operate"></i></a>';
						};
						str += "</td></tr>";                             
                    });

                    $("#deviceconfigTable tbody").html(str);										
					var fn = "findDeviceConfigs";
					var pagination_html = paging(totalCount,pageSize,indexNum,fn);
					$("#pagination").html(pagination_html);                    
                } else {
                    $("#deviceconfigTable tbody").html("<tr><td style='text-align:center' colspan='5'>查询不到数据！</td></tr>");
                    $("#pagination").html('');
                }
            }else{
            	var ms = resultdata.message;
            	ToolTipTop.Show(ms,"error");
            }
        }
    });
};
/*
 * go新增配置设备配置页面
 */
function addDeviceConfig(){	
	window.location.href = "index.html#addDeviceConfig";
};

/*
 * go设备配置详情页面
 */
function goDeviceConfigDetails(data){
	var id = data.split("^&^")[0];
	var pageNum = data.split("^&^")[1];
	var parameter = {
		"deviceConfigDetails":id
	};
	var cache = {
		"pageNum":pageNum,
		"deviceConfigList":"deviceConfigList"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#deviceConfigDetails";
};


/*
 * go设备配置修改页面
 */
function updateConfig(data) {
	var customerId = data.split("^&^")[0];
	var configId = data.split("^&^")[1];
	var pageNum = data.split("^&^")[2];
	var vaule = "customerId="+customerId+"&configId="+configId;
	var parameter = {
		"deviceConfigUpdata":vaule
	};
	var cache = {
		"pageNum":pageNum,
		"deviceConfigList":"deviceConfigList"
	};
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#deviceConfigUpdate";
};

/*
 * go设备配置下设备列表页面
 */
function goConfiguredDeviceList(customerId, configId) {
	var vaule = "customerId="+customerId+"&configId="+configId;
	var parameter = {
		"configuredDeviceList":vaule
	};
	parameter = JSON.stringify(parameter);
	sessionStorage.setItem("parameter",parameter);
	window.location.href = "index.html#configuredDeviceList";
}
/*
 * 删除
 */
function removeConfig(configId, customerId) {
    var jsondata = [configId];
    Messager.confirm({Msg: '确认删除此设备配置?', title: '删除设备配置'}).on(function (flag) {
        if (flag) {
        	$.ajax({
	            type: "POST",
	            url: '/deviceConfig/deletes',
	            data: JSON.stringify(jsondata),
	            dataType: "json",
	            contentType: "application/json",
	            success: function (data) {
	                if (data.message === "SUCCESS") {
	                	findDeviceConfigs(1);
	                	ToolTipTop.Show("删除成功","success");
					} else {
						var ms = data.message;
						ToolTipTop.Show(ms,"error");
					}
	            }
	        })           
        }        
    }); 
}
//$("#ipTr").hide();
//  $("#portTrId").hide();
//  $("#scan").click(function () {
//      if ($("#scan").is(":checked")) {
//          $("#paymentTypeTr").show();
//      } else {
//          if (!$("#scaned").is(":checked")) {
//              $("#paymentTypeTr").hide();
//          }
//          $("#paymentTypeTr").hide();
//      }
//  });
//  $("#scaned").click(function () {
//      if (!$("#scan").is(":checked") && !$("#scaned").is(":checked")) {
//          $("#paymentTypeTr").hide();
//      }
//  });
//  $("#interfaceTypeseletId").change(function () {
//      var selectedVar = $(this).val();
//      if ("Net" == selectedVar) {
//          $("#ipTr").css("display", "table-row");
//          $("#portTrId").css("display", "table-row");
//          $("#baudrateTr").css("display", "none");
//      } else if ("Serial" == selectedVar) {
//          $("#baudrateTr").css("display", "table-row");
//          $("#portTrId").css("display", "none");
//          $("#ipTr").css("display", "none");
//      } else {
//          $("#ipTr").css("display", "none");
//          $("#baudrateTr").css("display", "none");
//          $("#portTrId").css("display", "none");
//      }
//  });

