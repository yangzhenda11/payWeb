$(function () {
    $("#queryDeviceId").val("");
    queryUnConfigDevice(1);
    getDeviceModelList("#queryDeviceType");
});
var funcRef = function(evt){
    evt = evt || window.event;
    if (evt.keyCode==13){
        queryUnConfigDevice(1);
    }
}
window.onkeydown = funcRef;

/*
 * 得到设备列表
 */
function queryUnConfigDevice(pageIndex) {
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
	    };	   
	    var jsondata = {
	        "customerId": customerId,
	        "templateId": templateId,
	        "pageIndex": pageIndex,
	        "pageSize": pageSize,
	        "type": type,
	        "serialNum": queryDeviceId,
	        "op":"findAvailableAssociateDevice"
	    };
	    $.ajax({
	        type: "GET",
	        url: '/deviceReceiptTemplateConfig/pageList',
	        data: jsondata,
	        contentType: "application/json",
	        dataType: 'json',
	        success: function (result) {
	            isSuccessCode(result.code);
	            var htm = "";
	            var deviceResult = result.data;
	            var deviceList = deviceResult.list;
	            if (deviceList.length == 0) {
	                htm += "<tr><td colspan='3' style='text-align:center;'>查询不到数据！</td></tr>";
	                $("#pagination").html('');
	                $("#addDeviceDiv").addClass("hidden");
	            } else {
	            	var modelType = "";
	                for (var i = 0; i < deviceList.length; i++) {                    
	                    modelType = determineType(deviceList[i].modelType);
	                    htm += '<tr><td style="text-align:center;"><input class="deviceIdChecked" name="check" type="checkbox" data-serialnum="'+deviceList[i].serialNum+'" value="' + deviceList[i].id + '"></td>';
	                    htm += "<td style='text-align:center;'>" + deviceList[i].serialNum + "</td>";
	                    htm += "<td style='text-align:center;'>" + modelType + "</td></tr>";
	                };
	                $("#addDeviceDiv").removeClass("hidden");
					totalCount = deviceResult.listCount;
					var pageIndex = deviceResult.pageIndex;
					var fn = "queryUnConfigDevice";
					var pagination_html = paging(totalCount,pageSize,pageIndex,fn)				
					$("#pagination").html(pagination_html);					
	            }            
	            $("#addDevicesTable tbody").html(htm);
	        }
	    });
	}
}

/*
 * 添加设备提交
 */
function addConfig() {
    var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).resolveDeviceList;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}else{
		var templateId = parameter.split("^&^")[0];
	    var customerId = parameter.split("^&^")[1];
	    var deviceIdList = [];	    
        $('input[name="check"]:checked').each(function(){
            var key = $(this).val();
            var value = $(this).data('serialnum');            
            var obj={"key":key,"value":value}
            deviceIdList.push(obj);           
        });
	    if (deviceIdList.length > 0) {
	        var jsondata = {"associateDevice": deviceIdList, "id": templateId};
	        $.ajax({
	            type: "post",
	            url: '/deviceReceiptTemplateConfig/add',
	            data: JSON.stringify(jsondata),
	            contentType: "application/json",
	            dataType: 'json',
	            success: function (result) {
	                if (result.code == 200) {
	                	ToolTipTop.Show("设备添加成功","success");
                		window.location.href = "index.html#resolveDeviceList";	                	
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



/*
 * 返回模板列表
 */
function backResolveList(){	
	sessionStorage.setItem("readCache","1");	
	window.location.href = "index.html#resolve";
};

/*
 * 返回模板下设备列表
 */
function backResolveDeviceList(){
	window.location.href = "index.html#resolveDeviceList"
}
