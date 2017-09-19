$(function () {
    $("#queryDeviceId").val("");
    queryDeviceList(1);
    getDeviceModelList("#queryDeviceType");
});

/*
 * 设备列表
 */
function queryDeviceList(pageIndex) {
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).resolveDeviceList;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}else{
		var templateId = parameter.split("^&^")[0];
	    var customerId = parameter.split("^&^")[1];
	    var pageSize = 15;
	    var totalCount = 0;
	    var queryDeviceId = $("#queryDeviceId").val();
	    var type = $("#queryDeviceType").val();
	    if (type == 0) {
	        type = null;
	    }
	    var jsondata = {
	        "customerId": customerId,
	        "templateId": templateId,
	        "pageIndex": pageIndex,
	        "pageSize": pageSize,
	        "type": type,
	        "serialNum": queryDeviceId
	    };
	    $.ajax({
	        type: "GET",
	        url: '/deviceReceiptTemplateConfig/pageList',
	        data: jsondata,
	        contentType: "application/json",
	        dataType: 'json',
	        success: function (result) {
	            isSuccessCode(result.code);
	            if (result.code == "200") {
	                var deviceResult = result.data;
	                var deviceList = deviceResult.list;
	                var html = "";
	                var modelType = "";
	                if (deviceList.length == 0) {
	                    html = "<tr><td colspan='4' style='text-align:center;'>该小票模板下暂时没有绑定设备!</td></tr>";
	                    $("#devicesTable tbody").html(html);
	                    $("#pagination").html('');
	                    return;
	                }
	                for (var i = 0; i < deviceList.length; i++) {
	                    var device = deviceList[i];
	                    var serialNum = device.serialNum;
	                    modelType = determineType(device.modelType);
	                    html += "<tr><td style='text-align:center;'><input class='deviceIdChecked' name='check' type='checkbox' data-serialnum='"+deviceList[i].serialNum+"' value='" + deviceList[i].id + "'></td>" + "<td style='text-align: center;'>" + serialNum + "</td>"
	                        + "<td style='text-align: center;'>" + modelType + "</td>";
	                    html += "<td style='text-align: center;'>" +
	                        "<a data-toggle='tooltip' style='cursor:pointer;text-decoration: none;' data-placement='bottom' title='删除' type='button' onclick='revomeConfirm(" + device.id + ")'><i class='icon iconfont icon-shanchu operate'></i></a></td></tr>";
	                };
	                $("#devicesTable tbody").html(html);
					totalCount = deviceResult.listCount;
					var pageIndex = deviceResult.pageIndex;
					var fn = "queryDeviceList";
					var pagination_html = paging(totalCount,pageSize,pageIndex,fn);
					$("#pagination").html(pagination_html);
	            } else {
	            	var ms = result.message;
					ToolTipTop.Show(ms,"error");
	                $("#devicesTable tbody").html("<tr><td colspan='4' style='text-align:center;'>暂无数据</td></tr>");
	                $("#pagination").html('');
	            }
	        }
	    });
	}
}
var funcRef = function(evt){
    evt = evt || window.event;
    if (evt.keyCode==13){
        queryDeviceList(1);
    }
}
window.onkeydown = funcRef;

/*
 * 全选反选
 */
function checkSelect() {
    if ($("#checkall").prop('checked')) {
        $("input[name='check']").prop('checked', true);
    } else {
        $("input[name='check']").prop('checked', false);
    }
}

/*
 * 返回模板列表
 */
function backResolveList(){	
	sessionStorage.setItem("readCache","1");	
	window.location.href = "index.html#resolve";
};
/*
 * 设备绑定
 */
function addDevices(){
	window.location.href = "index.html#resolveDeviceAdd";
}

/*
 * 解绑设备（多个）
 */
function unBindDevice(){
	var deviceIdList = [];
	$('input[name="check"]:checked').each(function(){
        var id = $(this).val();	            
        deviceIdList.push(id);           
    });
    if(deviceIdList.length > 0){
    	Messager.confirm({Msg: "确认解绑当前选择的" + deviceIdList.length + "设备?", title: '解绑设备'}).on(function (flag) {
			if (flag) {
				var parameter = sessionStorage.getItem("parameter");
				parameter = JSON.parse(parameter).resolveDeviceList;
				var templateId = parameter.split("^&^")[0];
				var jsondata = {
					"templateId": templateId,
					"deviceIdList": deviceIdList
				};
				deviceRemoveCommit(jsondata);
			}
		})
    }else{
    	ToolTipTop.Show("请先选择要解绑的设备","error");
    }
	
}
/*
 * 删除设备（单个）
 */
function revomeConfirm(deviceId) {
	Messager.confirm({Msg: '确认解绑当前选择的设备?', title: '解绑设备'}).on(function (flag) {
        if (flag) {
        	var deviceIdList = [];
		    var parameter = sessionStorage.getItem("parameter");
			parameter = JSON.parse(parameter).resolveDeviceList;	
			var templateId = parameter.split("^&^")[0];		   
		    deviceIdList.push(deviceId);
			var jsondata = {"templateId": templateId,
							"deviceIdList":deviceIdList
							};
			deviceRemoveCommit(jsondata);
        }        
    })
}
/*
 * 删除设备提交
 */
function deviceRemoveCommit(data){
	$.ajax({
        type: "post",
        url: '/deviceReceiptTemplateConfig/deletes',
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
        if (result.code == '200') {
        		ToolTipTop.Show("设备解绑成功","success");
        		queryDeviceList(1);						
			} else {
				var ms = result.message;
				ToolTipTop.Show(ms,"error");
			}
        }
   })
}
