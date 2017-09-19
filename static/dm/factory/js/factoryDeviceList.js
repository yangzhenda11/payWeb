$(function(){
	getDeviceModelList("#queryDeviceType");
	getDeviceList(1);
	$("#queryDeviceType").on("change",function(){
		getDeviceList(1);
	})
})
function getDeviceList(pageIndex) {
    var totalCount = 0;
    var pageSize = 15;
    var serialNum = $("#queryDeviceId").val();
    var batchNum = $("#batchNum").val();
    $("#pagination").html('');
    var type = $("#queryDeviceType").val();
    if (type == 0) {
        type = null;
    }
    var data = {        
        "type": type,
        "pageIndex": pageIndex,
        "pageSize": pageSize,
        "serialNum": serialNum,
        "batchNum": batchNum        
    };
    $.ajax({
        type: "GET",
        url: '/productDevice/pageList',
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
                	var pagNum = deviceResult.pageIndex;
                    var modelType,createdTime,html = "";
                    $.each(deviceList,function (index,deviceVaule) {
               			modelType = determineType(deviceVaule.type);              			
               			createdTime = deviceVaule.createdTime == null ? '' : getFormatDateByLong(deviceVaule.createdTime, "yyyy-MM-dd hh:mm:ss");
               			html += "<tr><td style='padding-left:20px;'>" + deviceVaule.serialNum + "</a></td>"                     	
                        + "<td>" + deviceVaule.batchNum + "</td>"
                        + "<td>" + modelType + "</td>"
                        + "<td>" + deviceVaule.code + "</td>"
                        + "<td style='text-align:center;'>" + createdTime  + "</td></tr>"
                    });
                    $("#devicesTable tbody").html(html);										
					var fn = "getDeviceList";
					var pagination_html = paging(totalCount,pageSize,pagNum,fn);		
					$("#pagination").html(pagination_html);					                    
                } else {
                    $("#pagination").html('');                    
                    $("#devicesTbody").html("<tr><td colspan='5' style='text-align: center'>查询不到数据!</td></tr>");
                }
            } else {
            	var ms = result.message;
                ToolTipTop.Show(ms,"error");
                $("#devicesTbody").html("<tr><td colspan='5' style='text-align: center'>查询不到数据!</td></tr>");
            }
        },
        error: function(msg) {			
			ToolTipTop.Show("加载超时","error");
		}
    });
}
var funcRef = function(evt){
    evt = evt || window.event;
    if (evt.keyCode==13){
        getDeviceList();
    }
}
window.onkeydown = funcRef;