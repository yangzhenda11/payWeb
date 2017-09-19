$(function () {
    $("#queryDeviceId").val("");
    queryDeviceList(1);
    getDeviceModelList("#queryDeviceType");
    $("#queryDeviceType").on("change",function(){
		queryDeviceList(1);
	})
});

function initWebSocket() {
    var ws_uri = "ws://" + window.location.host + "/appConnectState";
    websocket = new WebSocket(ws_uri);
    
    websocket.onopen = function (event) {
        //console.log("open....")
    };

    websocket.onmessage = function (event) {
        //console.log("onmessage.... " + event.data)
        var strArr = event.data.split("@");
        setDeviceState(strArr[0], strArr[1]);
    };

    websocket.onerror = function (event) {
        //console.log("error..." + event.data);
    };

    websocket.onclose = function (event) {
        //console.log("close..." + event.data);
    };
}

function doWebSocketSetConnectState(deviceList) {
    if (websocket.readyState === 1) {
        websocket.send(deviceList);
    }
};

/*
 * 设备列表
 */
function queryDeviceList(pageIndex) {
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).configuredDeviceList;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}
    var customerId = parameter.split("&")[0].split("=")[1];
    var configId = parameter.split("&")[1].split("=")[1];
    var pageSize = 15;
    var totalCount = 0;
    var queryDeviceId = $("#queryDeviceId").val();
    var type = $("#queryDeviceType").val();
    if (type == 0) {
        type = null;
    }
    var jsondata = {
        "customerId": customerId,
        "configId": configId,
        "pageIndex": pageIndex,
        "pageSize": pageSize,
        "type": type,
        "serialNum": queryDeviceId
    };
    $.ajax({
        type: "GET",
        url: '/deviceBindConfig/pageList',
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
                var devices = new Array();
                totalCount = deviceResult.listCount;
                $(".fontbold").text(totalCount);
                if (deviceList.length == 0) {
                    html = "<tr><td colspan='4' style='text-align:center;'>该配置下暂时没有设备!</td></tr>";
                    $("#devicesTable tbody").html(html);
                    $("#pagination").html('');
                    return;
                }
                for (var i = 0; i < deviceList.length; i++) {
                    var device = deviceList[i];
                    var serialNum = device.serialNum;
                    modelType = determineType(device.modelType);
                    //var connStateStr = device.connected == true ? "已连接" : "未连接";
                    devices.push(serialNum);
                    html += "<tr><td style='text-align: center;'>" + serialNum + "</td>"
                        + "<td style='text-align: center;'>" + modelType + "</td>";
                    html += "<td style='text-align: center;'>" +
                        "<a data-toggle='tooltip' style='cursor:pointer;text-decoration: none;' data-placement='bottom' title='删除' type='button' onclick='revomeConfirm(" + device.id + ")'><i class='icon iconfont icon-shanchu operate'></i></a></td></tr>";
                };
                $("#devicesTable tbody").html(html);				
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
var funcRef = function(evt){
    evt = evt || window.event;
    if (evt.keyCode==13){
        queryDeviceList(1);
    }
}
window.onkeydown = funcRef;

function addDevicesConfig() {	
    window.location = "index.html#unconfiguredDeviceList";
};
/*
 * 删除设备
 */
function revomeConfirm(deviceId) {
    var deviceIdList = [];
    deviceIdList.push(deviceId);
	var jsondata = {"deviceIdList": deviceIdList};
	Messager.confirm({Msg: '确定解绑此设备?', title: '解绑设备'}).on(function (flag) {
        if (flag) {
        	$.ajax({
	            type: "post",
	            url: '/device/modify?operateType=unbindConfig',
	            data: JSON.stringify(jsondata),
	            contentType: "application/json",
	            dataType: 'json',
	            success: function (result) {
                if (result.code == '200') {
                	queryDeviceList(1);
                	ToolTipTop.Show("设备解绑成功","success");
					} else {
						var ms = result.message;
						ToolTipTop.Show(ms,"error");
					}
	            }
	       })           
        }        
    });   
}

