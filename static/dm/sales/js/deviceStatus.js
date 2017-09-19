$(function () {
    getDeviceModelList("#queryDeviceType");
    getCustomers();
    getAppList();
    isCache("deviceStaus",getDeviceList);
    $("#queryDeviceType,#connectState,#appNameList").on("change",function(){
		getDeviceList(1);
	})
});

var funcRef = function(evt){
    evt = evt || window.event;
    if (evt.keyCode==13){
        getDeviceList(1);
    }
}
window.onkeydown = funcRef;


function getDeviceList(pageIndex) {
    //$("#ckAll").removeAttr('checked');
    var totalCount = 0;
    var pageSize = 15;
    var customerId = $("#customerId").val();
    var serialNum = $("#queryDeviceId").val();
    var type = null;
    if($("#queryDeviceType").val() == 0){
    	type = null;
    }else{
    	type = $("#queryDeviceType").val();
    };
    var appName = $("#appNameList").val();
    var connectState = $("#connectState").val();
    $("#pagination").html('');
    var data = {
        "customerId": customerId,
        "type": type,
        "pageIndex": pageIndex,
        "pageSize": pageSize,
        "serialNum": serialNum,
        "connectState": connectState,
        "appName": appName,
    };
    $.ajax({
        type: "GET",
        url: '/deviceMonitor/pageList',
        data: data,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            isSuccessCode(result.code);
            if (result.code === 200) {
                var deviceResult = result.data;
                var deviceList = deviceResult.list;
                totalCount = deviceResult.listCount;
                $(".fontbold").text(totalCount);
                if (deviceList.length > 0) {               	
                	var pagNum = result.data.pageIndex;
                    var device_list_html = "";
                    var device = null;
                    var appVer = null;
                    var modelType = null;
                    var deviceCustomerName = null;
                    var producedDate = null;
                    var soldDate = null;
                    var connState = '未连接';
                    var rebootCount = "";
                    for (var i = 0; i < deviceList.length; i++) {
                        device = deviceList[i];
                        if (device.customerName == undefined) {
                            deviceCustomerName = "";
                        } else {
                            deviceCustomerName = device.customerName;
                        };
                        modelType = determineType(device.modelType);
                        if(device.rebootCount == undefined){
                        	rebootCount = "";
                        }else{
                        	rebootCount = device.rebootCount;
                        }
                        if (device.connected == true) {
                            connState = '已连接';
                            appVer = '版本获取中...';
                            getAppVersionBySerialNum(device.serialNum);
                        } else {
	                        connState = '未连接';
                            appVer = '未连接状态';
                        };
                        connectTime = device.connectTime == null ? '' : getFormatDateByLong(device.connectTime, "yyyy-MM-dd hh:mm:ss");
                        disConnectTime = device.disConnectTime == null ? '' : getFormatDateByLong(device.disConnectTime, "yyyy-MM-dd hh:mm:ss");

                        device_list_html += "<tr>" 
                        	+ "<td style='padding-left:20px;'><a href='javascript:void(0);' onclick='gocustomerDeviceDetails(\""+device.serialNum+"^&^"+pagNum+"\")'>" + device.serialNum + "</a></td>"
                            + "<td>" + deviceCustomerName + "</td>"
                            + "<td>" + modelType + "</td>"
                            + "<td>" + connState + "</td>"
                            + "<td style='text-align:center;'>" + rebootCount + "</td>"
                            + "<td id ='" + device.serialNum + "'>" + appVer + "</td></tr>"

                    }
                    $("#devicesTbody").html(device_list_html);					
					var pageIndex = deviceResult.pageIndex;
					var fn = "getDeviceList";
					var pagination_html = paging(totalCount,pageSize,pageIndex,fn)				
					$("#pagination").html(pagination_html);
                } else {
                    emptyList();
                    $("#devicesTbody").html("<tr><td colspan='8' style='text-align: center'>查询不到数据!</td></tr>");
                }
            } else {
                $("#devicesTbody").html("<tr><td colspan='8' style='text-align: center'>查询不到数据!</td></tr>");
            }
        }
    });
}

/*
 * 设置缓存，跳转设备详情
 */
function gocustomerDeviceDetails(data){
	var id = data.split("^&^")[0];
	var pageNum = data.split("^&^")[1];
	var parameter = {
		"deviceId":id
	}
	var cache = {
		"pageNum":pageNum,
		"deviceStaus":"deviceStaus"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#deviceStatusDetails";
};

function getAppVersionBySerialNum(serialNum) {
    var app = $("#appNameList").val();
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
                if (result.data != null) {
                    var appAndVersion = result.data;
                    $("#" + serialNum).text(appAndVersion[app]);
                }
            } else {
                $("#" + serialNum).text("");
            }
        },
        fail: function () {
        }
    });
}

function emptyList() {
    $("#devicesTable tbody").html('');
    $("#pagination").html('');
}

function checkAllId() {
    if ($("#checkAllId").prop('checked')) {
        $("#devicesTable input[name='check']").prop('checked', true);
    } else {
        $("#devicesTable input[name='check']").prop('checked', false);
    }
}

function bindDeviceChooseApp() {
    $("#devicesTbody").find("tr").each(function () {
        var tdArr = $(this).children();
        if(tdArr.eq(7).text() != "未连接状态"){
        	var serialNum = $.trim(tdArr.eq(0).text());
        	getAppVersionBySerialNum(serialNum);
        }
    });
}
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
			    width:'150px'
			});
			$('#customerId').selectpicker('setStyle', 'selectStyle', 'add');
			$(".selectStyle").css({"padding-top":"4px","padding-bottom":"4px"});
			$(".selectStyle").parent().css({"height":"30px","margin-top":"-2px"});
        }
    });
}
function getAppList() {
    $.ajax({
        type: "GET",
        url: '/upgrade/listApp/query',
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            isSuccessCode(result.code);
            var apps = result.data;
            var html = "";
            for (var key in apps) {
                html += "<option value='" + key + "'>" + key + "</option>";
            }
            $("#appNameList").append(html);

        },
        error: function () {
            ToolTipTop.Show("获取app更新版本失败","error");
        }
    });
}