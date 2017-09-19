$(function () {
    $("#queryDeviceId").val("");
    getAllUnboundDevices(1);
    getAllCustomer();
    getDeviceModelList("#queryDeviceType");
    $("#sell").modal({show:false,backdrop:'static'});
    var fnCode = queryFnCode();
    if(fnCode.sell == "sell"){
    	$("#salebtn").removeClass("hidden");
    };
    $("#queryDeviceType").on("change",function(){
		getAllUnboundDevices(1);
	})
});
/*
 * 全选反选
 */
function checkAll() {
    if ($("#checkAllId").prop('checked')) {
        $("input[name='check']").prop('checked', true);
    } else {
        $("input[name='check']").prop('checked', false);
    }
}
/*
 * 清空列表
 */
function emptyList() {
    $("#devicesTable tbody").html('');
    $("#pagination").html('');
}

function getAllUnboundDevices(pageIndex) {
    var totalCount = 0;
    var pageSize = 15;
    var serialNum = $("#queryDeviceId").val();
    var deviceType = $("#queryDeviceType").val();
    if (deviceType == 0) {
        deviceType = null;
    };
    var data = {
        "pageIndex": pageIndex,
        "pageSize": pageSize,
        "serialNum": serialNum,
        "type" : deviceType,
        "func" : "unbindDevices"
    };
    $.ajax({
        type: "GET",
        url: '/device/pageList',
        data: data,
        contentType: "application/json",
        dataType: 'json',
        async: false,
        success: function (result) {
            isSuccessCode(result.code);
            if (result.code === 200) {
                var deviceResult = result.data;
                var deviceList = deviceResult.list;
                totalCount = deviceResult.listCount;
                $(".fontbold").text(totalCount);
                var html = "";
                var deviceModel = "";
                if (deviceList.length > 0) {
                    for (var i = 0; i < deviceList.length; i++) {                       
                        var producedDate = getFormatDateByLong(deviceList[i].producedDate, "yyyy-MM-dd");                        
                        deviceModel = determineType(deviceList[i].modelType);
                        html += "<tr><td style='text-align:center;'><input id='deviceIdChecked' type='checkbox'  name='check' value='"
                            + deviceList[i].id + "'></td><td style='text-align:center;'>" + deviceList[i].serialNum + "</td>"
                            + "<td style='text-align:center;'>" + deviceModel + "</td>"
                            + "<td style='text-align:center;'>" + producedDate + "</td></tr>"
                    }
                    $("#unboundDeviceTblId tbody").html(html);                   
					var pageIndex = deviceResult.pageIndex;
					var fn = "getAllUnboundDevices";
					var pagination_html = paging(totalCount,pageSize,pageIndex,fn);
					$("#pagination").html(pagination_html);
                }else{
                	emptyList();
                    $("#unboundDeviceTblId tbody").html("<tr><td colspan='4' style='text-align: center'>查询不到数据!</td></tr>");
                }
            }else{
            	$("#unboundDeviceTblId").html("<tr><td colspan='4' style='text-align: center'>查询不到数据</td></tr>");
            }
        }
    });
}

function sellModal() {
	var checkedDeviceIdList = [];
    var i = 0;
    $('input[name="check"]:checked').each(function () {
        checkedDeviceIdList[i] = ($(this).val());
        i++;
    });
    if (checkedDeviceIdList.length > 0) {
    	$('#sell').modal();
    }else{
    	ToolTipTop.Show("请先选择要销售的设备","error");
    }
}
var funcRef = function(evt){
    evt = evt || window.event;
    if (evt.keyCode==13){
        getAllUnboundDevices();
    }
}
window.onkeydown = funcRef;
/*
 * 设备销售
 */
function bindCustomer() {
    var checkedDeviceIdList = [];
    var i = 0;
    var customerTreeId = $('#customerList').val();
    var customerId;
    var treeId = '';
    if(customerTreeId != null && customerTreeId.indexOf("_") > 0) {
        var tmpArr = customerTreeId.split("_");
        customerId = tmpArr[0];
        treeId = tmpArr[1];
    }

    $('input[name="check"]:checked').each(function () {
        checkedDeviceIdList[i] = ($(this).val());
        i++;
    });

    var data = {
        "deviceIdList": checkedDeviceIdList,
        "customerId": customerId,
        "treeId": treeId
    };
    $.ajax({
        type: "post",
        url: '/device/modify?operateType=bindCustomer',
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: 'json',
        async: false,
        success: function (result) {
            if (result.code === 200) {
				$('#sell').modal('hide');
				getAllUnboundDevices(1);
            	ToolTipTop.Show("设备已成功销售！","success");
            }else{
            	var ms = result.message;
            	ToolTipTop.Show(ms,"error");
            }
        }
    })
}
/*
 * 服务商列表
 */
function getAllCustomer() {	
	var data = {
		"operateType":"chooseServiceProvider"
	};
	$.ajax({
        type: "GET",
        url: '/customer/list',
        contentType: "application/json",
        dataType: 'json',
        data:data,
        async: false,
        success: function (result) {

            isSuccessCode(result.code);

            if (result.code == 200) {
                var customerList = result.data;
                var html = "";

                if (customerList != null && customerList.length > 0) {
                    for (var i = 0; i < customerList.length; i++) {
                        html += "<option value='" + customerList[i].id + "_" + customerList[i].treeId + "'>" + customerList[i].name + "</option>"
                    }
                }
                $("#customerList").html(html);
                $('#customerList').selectpicker({
				    liveSearch: 'true',
				    width:"250px"
				});	                
            }
        }
    });
}
