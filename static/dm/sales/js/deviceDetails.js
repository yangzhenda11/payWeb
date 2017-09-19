$(document).ready(function () {
    getApps();
    getConnectHistory(1);
});
/*
 * 一些页面返回函数
 */
function gocustomerDeviceList(){
	sessionStorage.setItem("readCache","1");
	window.location.href = "index.html#customerDeviceList";
}
function gocheckBoundDevice(){
	sessionStorage.setItem("readCache","1");
	window.location.href = "index.html#checkBoundDevice";
}
function godeviceStatus(){
	sessionStorage.setItem("readCache","1");
	window.location.href = "index.html#deviceStatus";
}
function godeviceList(){
	sessionStorage.setItem("readCache","1");
	window.location.href = "index.html#deviceList";
}
/*
 * 设备软件版本
 */
function getApps() {
    var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).deviceId;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	};
    var serialNum = parameter;
    $("#detailDeviceId").html("设备编号:" + serialNum);

    var data = {
        "serialNum": serialNum
    };

    $.ajax({
        type: "GET",
        url: '/upgrade/getAppVersion/query',
        data: data,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            if (result.code == "200") {
                var appAndVersion = result.data;
				if(isEmptyObject(appAndVersion)){
					 $("#versionTBody").html("<tr><td colspan='2' style='text-align:center;'>暂无版本记录</td></tr>");
				}else{
					var app_html;
	                for (var app in appAndVersion) {
	                    app_html += "<tr><td>" + app + "</td><td>" + appAndVersion[app] + "</td></tr>";
	                };
	                $("#versionTBody").html(app_html);
				}
                
            } else {
                $("#versionTBody").html("<tr><td colspan='2'>" + result.msg + "</td></tr>");
            }
        }
    });
}
/*
 * 设备连接记录
 */
function getConnectHistory(pageIndex) {
    var totalCount = 0;
    var pageSize = 15;
    var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).deviceId;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	};
    var serialNum = parameter;

    var data = {
        "pageIndex": pageIndex,
        "pageSize": pageSize,
        "serialNum": serialNum
    };

    $.ajax({
        type: "get",
        url: '/connectHistory/pageList',
        data: data,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {

            isSuccessCode(result.code);

            var pageData = result.data;
            if (result.code === 200) {
                var deviceResult = pageData.list;
                var connect_history_html;
                if (deviceResult.length > 0) {
                    //TODO
                    for (var i = 0; i < deviceResult.length; i++) {
                        var connectTime = getFormatDateByLong(deviceResult[i].connectTime, "yyyy-MM-dd hh:mm:ss");
                        var disconnectTime = deviceResult[i].disconnectTime;
                        if(disconnectTime == undefined){
                        	disconnectTime = "";
                        }else{
                        	disconnectTime = getFormatDateByLong(deviceResult[i].disconnectTime, "yyyy-MM-dd hh:mm:ss");
                        }
                        connect_history_html += "<tr><td>" + connectTime + "</td><td>" + disconnectTime + "</td></tr>";
                    }

                    $("#historyTbody").html(connect_history_html);
					
					totalCount = pageData.listCount;
					var pageIndex = pageData.pageIndex;
					var fn = "getConnectHistory";
					var pagination_html = paging(totalCount,pageSize,pageIndex,fn)				
					$("#pagination").html(pagination_html);
                } else {
                    //TODO
                    $("#pagination").html("无连接历史记录");
                }
            } else {
                $("#historyTbody").html(result.msg);
            }
        }
    });
}