$(function () {
    getDeviceModelList("#queryDeviceType");
    getAppVersionList();
    isCache("customerDeviceList",getDeviceList);
    var isAdmin = sessionStorage.getItem("isAdmin");
	if(isAdmin == "true"){
		$("#unwrap").removeClass("hidden");
	};
	$('#confimUpgrade').modal({show:false,backdrop:'static'});
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
function gocustomer() {
    window.location.href = "index.html#customer";
}
/*
 * 解绑设备
 */
function unBindCustomer() {
    var checkedDeviceIdList = [];
    var i = 0;
    var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).customerDeviceList;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}
    var customerId = parameter;
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
                        	getDeviceList(1);                            
                        	ToolTipTop.Show("设备解绑成功","success");
                        } else {
                        	var ms = result.message;
							ToolTipTop.Show(ms,"error");
                        }
                    }
                })
            }
        });
    } else {
        ToolTipTop.Show("请先选择要解绑的设备","error");
    }
}
/*
 * 设备列表
 */
function getDeviceList(pageIndex) {
    $("#ckAll").removeAttr('checked');
    var totalCount = 0;
    var pageSize = 15;
    var serialNum = $("#queryDeviceId").val();
    var connectState = $("#connectState").val();
    var appName = $("#appNameList").val();
    var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).customerDeviceList;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}
    var customerId = parameter;   
    $("#pagination").html('');
    var type = $("#queryDeviceType").val();
    if (type == 0) {
        type = null;
    }
    var data = {
        "customerId": customerId,
        "type": type,
        "pageIndex": pageIndex,
        "pageSize": pageSize,
        "serialNum": serialNum,
        "connectState": connectState,
        "appName": appName,
        "operateType":"customer"
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
                totalCount = deviceResult.listCount;
                $(".fontbold").text(totalCount);
                if (deviceList.length > 0) {
                    var device_list_html = "";
                    var pagNum = result.data.pageIndex;
                    var appVer = "";
                    var modelType = "";
                    var producedDate = "";
                    var connState = "";
                    for (var i = 0; i < deviceList.length; i++) {
                        var device = deviceList[i];
                        connState = "未连接";
                        producedDate = device.producedDate == null ? '' : getSmpFormatDateByLong(device.producedDate, false);
                        if (device.connected === true) {
                            connState = '已连接';
                            appVer = '版本获取中...';
                            getAppVersion(device.serialNum);
                        } else {
                            appVer = '未连接状态';
                        }
                        modelType = determineType(device.modelType);                       
                        device_list_html += "<tr>" +
                            "<td style='text-align:center;'><input id='deviceIdChecked' type='checkbox'  name='check' value='" + device.serialNum + "' data-id='"+device.id+"' data-connected='"+device.connected+"'></td>"
                            + "<td><a href='javascript:void(0);' onclick='gocustomerDeviceDetails(\""+device.serialNum +"^&^" +pagNum+"\")'>" + device.serialNum + "</a></td>"
                            + "<td>" + modelType + "</td>"
                            + "<td>" + connState + "</td>"
                            + "<td>" + producedDate + "</td>"
                            + "<td id='" + device.serialNum + "'>" + appVer + "</td>"

                        $("#devicesTbody").html(device_list_html);
                    }					
					var pageIndex = deviceResult.pageIndex;
					var fn = "getDeviceList";
					var pagination_html = paging(totalCount,pageSize,pageIndex,fn);
					$("#pagination").html(pagination_html);
                    // doWebSocketSetConnectState(devices);
                } else {
                    emptyList();
                    $("#devicesTbody").html("<tr><td colspan='6' style='text-align: center'>查询不到数据!</td></tr>");
                }
            } else {
                $("#devicesTbody").html("<tr><td colspan='6' style='text-align: center'>查询不到数据!</td></tr>");
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
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter);
	parameter["deviceId"] = id;
	var cache = {
		"pageNum":pageNum,
		"customerDeviceList":"customerDeviceList"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#customerDeviceDetalis";
};
/*
 * 获取APP列表
 */
function getAppVersion(serialNum) {
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
        $("#upgradeTbl input[name='check']").prop('checked', true);
    } else {
        $("#upgradeTbl input[name='check']").prop('checked', false);
    }
}
/*
 * 设备升级信息
 */
function getAppVersionList() {
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
                html += "<option  name='" + key + "'>" + key + "</option>";
            }

            $("#appNameList").append(html);
        },
        error: function () {
        	ToolTipTop.Show("获取app更新版本失败","error");
        }
    });
}

function customerChooseApp() {
    $("#devicesTbody").find("tr").each(function () {
        var tdArr = $(this).children();
        var serialNum = $.trim(tdArr.eq(1).text());
        getAppVersion(serialNum);
    });
}