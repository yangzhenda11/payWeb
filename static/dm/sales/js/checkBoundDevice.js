$(function () {
    getDeviceModelList("#queryDeviceType");
    isCache("checkBoundDevice",getDeviceList);
    getAppList();
    $('#confimUpgrade').modal({show:false,backdrop:'static'});
    var fnCode = queryFnCode();
 	if(fnCode.unbind == "unbind"){
    	$("#unwrap").removeClass("hidden");
   };
   	if(fnCode.deviceUpgrade == "deviceUpgrade"){
    	$("#addbtn").removeClass("hidden");
    };
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
/*
 * 获取APP版本
 */
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
/*
 * 解绑设备
 */
function unBindCustomer() {
    var checkedDeviceIdList = [];
    var i = 0;
    var customerId = location.search.slice(1).split("&")[0];
    $('input[name="check"]:checked').each(function () {
        checkedDeviceIdList[i] = ($(this).data("id"));
        i++;
    });
    var data = {
        "deviceIdList": checkedDeviceIdList,
        "customerId": customerId
    };
    if (checkedDeviceIdList.length > 0) {
        Messager.confirm({Msg: '确认解绑当前选择的'+checkedDeviceIdList.length+'台设备?', title: '解绑设备'}).on(function (flag) {
            if (flag) {
                $.ajax({
                    type: "post",
                    url: '/device/modify?operateType=unbindCustomer',
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    dataType: 'json',
                    async: false,
                    success: function (result) {
                        if (result.code == 200) {
                        	ToolTipTop.Show("设备解绑成功","success");                                    
                            getDeviceList(1);
                        } else {
                        	ToolTipTop.Show("设备解绑失败","error");
                        }
                    }
                })
            }

        });

    } else {
        ToolTipTop.Show("请先选择要解绑的设备","error");
    }
}

function getDeviceList(pageIndex) {
    $("#ckAll").removeAttr('checked');
    var totalCount = 0;
    var pageSize = 15;
    var serialNum = $("#queryDeviceId").val();
    var connectState = $("#connectState").val();
    var customerName = $("#customerName").val();
    var appName = $("#appNameList").val();
    $("#pagination").html('');

    var type = $("#queryDeviceType").val();
    if (type == 0) {
        type = null;
    }
    var data = {
        "customerId": "",
        "customerName": customerName,
        "type": type,
        "pageIndex": pageIndex,
        "pageSize": pageSize,
        "serialNum": serialNum,
        "connectState": connectState,
        "appName": appName,
        "operateType":"sales"
        // "orderFlag": orderFlag,
        // "orderTbField": orderTbField,
    };

    $.ajax({
        type: "GET",
        url: '/deviceSale/pageList',
        data: data,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            isSuccessCode(result.code);
            if (result.code === 200) {
                var deviceResult = result.data;
                var deviceList = deviceResult.list;
                if (deviceList.length > 0) {
                    var device_list_html = "";
                    var pagNum = deviceResult.pageIndex;
                    totalCount = deviceResult.listCount;
                    $(".fontbold").text(totalCount);
                    var modelType = '';
                    for (var i = 0; i < deviceList.length; i++) {
                        var device = deviceList[i];
                        var appVer;                        
                        var deviceCustomerName;
                        var producedDate = device.producedDate == null ? '' : getSmpFormatDateByLong(device.producedDate, false);
                        var soldDate = device.soldDate == null ? '' : getSmpFormatDateByLong(device.soldDate, false);
                        var connState = '未连接';
                        if (device.customerName == undefined) {
                            deviceCustomerName = "";
                        } else {
                            deviceCustomerName = device.customerName;
                        }
                        if (device.connected === true) {
                            connState = '已连接';
                            appVer = '版本获取中...';
                            getAppVersionBySerialNum(device.serialNum);
                        } else {
                            appVer = '未连接状态';
                        };
                        modelType = determineType(device.modelType);                        
                        device_list_html += "<tr>" +
                            "<td style='text-align:center;'><input id='deviceIdChecked' type='checkbox'  name='check' value='" + device.serialNum + "' data-id='" + device.id + "' data-connected='"+device.connected+"'></td>"
                            + "<td><a href='javascript:void(0);' onclick='gocustomerDeviceDetails(\""+device.serialNum+"^&^"+pagNum+"\")'>" + device.serialNum + "</a></td>"
                            + "<td>" + deviceCustomerName + "</td>"
                            + "<td>" + modelType + "</td>"
                            + "<td>" + connState + "</td>"
                            + "<td>" + soldDate + "</td>"
                            + "<td id ='" + device.serialNum + "'>" + appVer + "</td>"

                        $("#devicesTbody").html(device_list_html);
                    }					
					var pageIndex = deviceResult.pageIndex;
					var fn = "getDeviceList";
					var pagination_html = paging(totalCount,pageSize,pageIndex,fn)				
					$("#pagination").html(pagination_html);                   
                    // doWebSocketSetConnectState(devices);

                } else {
                    emptyList();
                    $("#devicesTbody").html("<tr><td colspan='7' style='text-align: center'>查询不到数据!</td></tr>");
                }
            } else {
                $("#devicesTbody").html("<tr><td colspan='7' style='text-align: center'>查询不到数据!</td></tr>");
            }
        }
    });
};

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
		"checkBoundDevice":"checkBoundDevice"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#checkBoundDeviceDetails";
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

function checkAllApp() {
    if ($("#checkAllApp").prop('checked')) {
    	
        $("#upgradeTbl input[name='checkapp']").prop('checked', true);
    } else {
        $("#upgradeTbl input[name='checkapp']").prop('checked', false);
    }
}

function bindDeviceChooseApp() {
    $("#devicesTbody").find("tr").each(function () {
        var tdArr = $(this).children();
        if(tdArr.eq(7).text() != "未连接状态"){
        	var serialNum = $.trim(tdArr.eq(1).text());        	
        	getAppVersionBySerialNum(serialNum);
        }
    });
}
