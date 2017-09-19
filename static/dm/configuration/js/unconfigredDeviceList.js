$(function () {
    $("#queryDeviceId").val("");
    queryUnConfigDevice(1);
    getDeviceModelList("#queryDeviceType");
    $("#queryDeviceType").on("change",function(){
		queryUnConfigDevice(1);
	})
});
var funcRef = function(evt){
    evt = evt || window.event;
    if (evt.keyCode==13){
        queryUnConfigDevice(1);
    }
}
window.onkeydown = funcRef;
function checkAllId() {
    if ($("#ckAll").prop('checked')) {
        $("#addDevicesTable input[name='check']").prop('checked', true);
    } else {
        $("#addDevicesTable input[name='check']").prop('checked', false);
    }
}
function goBackList(){
	window.location = "index.html#configuredDeviceList";
}

/*
 * 得到设备列表
 */
function queryUnConfigDevice(pageIndex) {
    var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).configuredDeviceList;			//与configuredDeviceList公用参数(特殊处理)
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}
    var customerId = parameter.split("&")[0].split("=")[1];
    var configId = parameter.split("&")[1].split("=")[1];
    var totalCount = 0;
    var pageSize = 15;
    var serialNum = $("#queryDeviceId").val();
    $("#configId").val(configId);

    var type = $("#queryDeviceType").val();
    if (type == 0) {
        type = null;
    }
    var jsondata = {
        "customerId": customerId,
        "configId": "",
        "pageIndex": pageIndex,
        "pageSize": pageSize,
        "type": type,
        "serialNum": serialNum
    };
    $.ajax({
        type: "GET",
        url: '/deviceBindConfig/pageList',
        data: jsondata,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            isSuccessCode(result.code);
            var htm = "";
            var deviceResult = result.data;
            var deviceList = deviceResult.list;
            totalCount = deviceResult.listCount;
            $(".fontbold").text(totalCount);
            if (deviceList.length == 0) {
                htm += "<tr><td colspan='3' style='text-align:center;'>查询不到数据！</td></tr>";
                $("#pagination").html('');
                $("#addDeviceDiv").addClass("hidden");
            } else {
            	var modelType = "";
                for (var i = 0; i < deviceList.length; i++) {                    
                    modelType = determineType(deviceList[i].modelType);
                    htm += '<tr><td style="text-align:center;"><input id="deviceIdChecked" name="check" type="checkbox"  value="' + deviceList[i].id + '"></td>';
                    htm += "<td style='text-align:center;'>" + deviceList[i].serialNum + "</td>";
                    htm += "<td style='text-align:center;'>" + modelType + "</td></tr>";
                };
                $("#addDeviceDiv").removeClass("hidden");				
				var pageIndex = deviceResult.pageIndex;
				var fn = "queryUnConfigDevice";
				var pagination_html = paging(totalCount,pageSize,pageIndex,fn)				
				$("#pagination").html(pagination_html);
            }            
            $("#addDevicesTable tbody").html(htm);
        }
    });
};
/*
 * 添加设备提交
 */
function addConfig() {
    var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).configuredDeviceList;		//与configuredDeviceList公用参数(特殊处理)
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}
    var configId = parameter.split("&")[1].split("=")[1];
    var deviceIdList = [];
    $('input[name="check"]:checked').each(function () {
        deviceIdList.push($(this).val());
    });
    if (deviceIdList.length > 0) {
        var jsondata = {"deviceIdList": deviceIdList, "configId": configId};
        $.ajax({
            type: "post",
            url: '/device/modify?operateType=bindConfig',
            data: JSON.stringify(jsondata),
            contentType: "application/json",
            dataType: 'json',
            success: function (result) {
                if (result.code == 200) {
            		ToolTipTop.Show("设备添加成功","success");
            		window.location.href = "index.html#configuredDeviceList";	                	
                } else {
                    var ms = result.message;
                    ToolTipTop.Show(ms,"error");
                }
            }
        });
    } else {
        ToolTipTop.Show("请先选择要添加的设备","error");
    }
}

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

