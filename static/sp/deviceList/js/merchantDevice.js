$(function() {
	addListTree();
	getDeviceModelList("#queryDeviceType");
	getDeviceList(1);
	setstyle();
	var fnCode = queryFnCode();
	if(fnCode.unbind == "unbind"){
		$("#addbtn").removeClass("hidden");
	};
	if(fnCode.bind == "bind"){
		$("#unwrap").removeClass("hidden");
	};
	readToolMessage();
	$("#queryDeviceType").on("change",function(){
		getDeviceList(1);
	})
});
//加载列表树
function addListTree(){ 
	setTreeValue();  //设置列表树内容
	checkNav();			//选择高亮显示
	treedropdown();		//加载列表树格式
}
//加载列表
function getDeviceList(pageIndex) {
    $("#ckAll").removeAttr('checked');
    var totalCount = 0;
    var pageSize = 15;
    var serialNum = $("#queryDeviceId").val();
    var customerName = $("#queryCustomerName").val();
    //var connectState = $("#connectState").val();
    var type = $("#queryDeviceType").val();
    var customerId = location.search.slice(1).split("&")[0].split("=")[1];
    var treeId = location.search.slice(1).split("&")[1].split("=")[1];
    var customerType = location.search.slice(1).split("&")[2].split("=")[1];
    
    $("#pagination").html('');
    if (type == 0) {
        type = null;
    }
    var data = {
        "customerId": customerId,
        "type": type,
        "pageIndex": pageIndex,
        "pageSize": pageSize,
        "serialNum": serialNum,
        "customerName": customerName,
       	"operateType":"boundDevice",
       	"treeId":treeId,
       	"customerType":""
    };
    $.ajax({
        type: "GET",
        url: '/deviceInfo/pageList',
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
                    var model = null;
                    for (var i = 0; i < deviceList.length; i++) {
                        var device = deviceList[i];                       
                        var soldDate = device.soldDate == null ? '' : getSmpFormatDateByLong(device.soldDate, false);
                        var connState = '未连接';
                        var customerName = null;
						model = determineType(device.type);
                        device_list_html += "<tr>" +
                            "<td style='text-align:center;'><input id='deviceIdChecked' type='checkbox'  name='check' data-id='"+device.id+"'></td>"
                            + "<td>" + device.serialNum + "</td>"
                            + "<td>" + device.customerName + "</td>"
                            + "<td>" + model + "</td>"
                            + "<td>" + soldDate + "</td>"

                        $("#devicesTbody").html(device_list_html);
                    }					
					var pageIndex = deviceResult.pageIndex;
					var fn = "getDeviceList";
					var pagination_html = paging(totalCount,pageSize,pageIndex,fn);
					$("#pagination").html(pagination_html);
                    setstyle();
                } else {
                    emptyList();
                    $("#devicesTbody").html("<tr><td colspan='5' style='text-align: center'>查询不到数据!</td></tr>");
                }
            } else {
            	var ms = result.message;
            	ToolTipTop.Show(ms,"error");
                $("#devicesTbody").html("<tr><td colspan='5' style='text-align: center'>查询不到数据!</td></tr>");
            }
        }
    });
}
//添加设备跳转
function addDevice(){
	var value = location.search.slice(1).split("&");
	var customerId = value[0].split("=")[1];
    var treeId = value[1].split("=")[1];
    var type = value[2].split("=")[1];
    window.location.href = "addDeviceList.html?customerId="+customerId+"&treeId="+treeId+"&type="+type;
}
//清空列表
function emptyList() {
    $("#devicesTable tbody").html('');
    $("#pagination").html('');
}
/*
 * 解绑设备
 */
function unbindCustomer() {
    var value = location.search.slice(1).split("&");
	var customerId = value[0].split("=")[1];
    var deviceIdList = [];
    $('input[name="check"]:checked').each(function () {
        deviceIdList.push($(this).data("id"));
    });
    if (deviceIdList.length > 0) {
    	var deviceNumber = deviceIdList.length;
    	Messager.confirm({Msg: "确认解绑"+deviceNumber+"台设备?",iconImg: 'question'}).on(function (flag) {
			if (flag) {
				var jsondata = {"deviceIdList": deviceIdList,
		        				"customerId":customerId,
		        				"operateType":"unbindCustomer"};
		        $.ajax({
		            type: "post",
		            url: '/deviceInfo/modify',
		            data: JSON.stringify(jsondata),
		            contentType: "application/json",
		            dataType: 'json',
		            success: function (result) {
		                if (result.code == 200) {
		                	ToolTipTop.Show("设备解绑成功","success");
		                	getDeviceList(1);
		                } else {
		                    var ms = result.message;
		                    ToolTipTop.Show(ms,"error");
		                }
		            }
		        });
			}
		});
    } else {
        ToolTipTop.Show("请选择要解绑的设备","error");
    }
}
function checkAllId() {
    if ($("#checkAllId").prop('checked')) {
        $("#devicesTable input[name='check']").prop('checked', true);
    } else {
        $("#devicesTable input[name='check']").prop('checked', false);
    }
};