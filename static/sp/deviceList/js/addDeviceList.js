$(function() {
	addListTree();
	getDeviceModelList("#queryDeviceType");
	queryUnConfigDevice(1);
	var backUrl = null;
	setBackUrl();
	$("#queryDeviceType").on("change",function(){
		queryUnConfigDevice(1);
	})
});
//加载列表树
function addListTree(){ 
	setTreeValue();  //设置列表树内容
	checkNav();			//选择高亮显示
	treedropdown();		//加载列表树格式
}
//设置返回地址
function setBackUrl(){
	var value = location.search.slice(1).split("&");
	var customerId = value[0].split("=")[1];
    var treeId = value[1].split("=")[1];
    var type = value[2].split("=")[1];
    backUrl = "storeDevice.html?customerId="+customerId+"&treeId="+treeId+"&type="+type;
    $("#goDevicelist").on("click",function(){
    	window.location.href = backUrl;
    })
    $("#addbtn").on("click",function(){
    	window.location.href = backUrl;
    })
}
//确认设置返回地址
function backHref(){
	var value = location.search.slice(1).split("&");
	var customerId = value[0].split("=")[1];
    var treeId = value[1].split("=")[1];
    var type = value[2].split("=")[1];
    var url = "storeDevice.html?customerId="+customerId+"&treeId="+treeId+"&type="+type;
    return url;
}
//请求列表
function queryUnConfigDevice(pageIndex) {
     $("#ckAll").removeAttr('checked');
    var totalCount = 0;
    var pageSize = 15;
    var serialNum = $("#queryDeviceId").val();
    var type = $("#queryDeviceType").val();
    var value = location.search.slice(1).split("&");
	var customerId = value[0].split("=")[1];
    var treeId = value[1].split("=")[1];
    var customerType = value[2].split("=")[1];
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
       	"operateType":"unbindDevice",
       	"treeId":treeId,
       	"customerType":"1"
    };
    $.ajax({
        type: "GET",
        url: '/deviceInfo/pageList',
        data: data,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            isSuccessCode(result.code);
			if(result.code == 200){
				var htm = "";
	            var deviceResult = result.data;
	            var deviceList = deviceResult.list;
	            var model = null;
	           	totalCount = deviceResult.listCount;
				$(".fontbold").text(totalCount);
	            if (deviceList.length == 0) {
	                htm += "<tr><td colspan='8' style='text-align:center;'>查询不到数据！</td></tr>";
	                $("#pagination").html('');
	                $("#addConfig").addClass("hidden");
	            } else {
	                for (var i = 0; i < deviceList.length; i++) {
	                	model = determineType(deviceList[i].type);	                	
						var soldDate = deviceList[i].soldDate == null ? '' : getSmpFormatDateByLong(deviceList[i].soldDate, false);
	                    htm += '<tr><td style="text-align:center;"><input id="deviceIdChecked" name="check" type="checkbox"  data-id="' + deviceList[i].id + '"></td>';
	                    htm += "<td style='text-align:left;'>" + deviceList[i].serialNum + "</td>";
	                    htm += "<td style='text-align:left;'>" + model + "</td>";
	                    htm += "<td style='text-align:left;'>" +soldDate + "</td></tr>";
	                }	                
					var pageIndex = deviceResult.pageIndex;
					var fn = "queryUnConfigDevice";
					var pagination_html = paging(totalCount,pageSize,pageIndex,fn);
					$("#pagination").html(pagination_html);
					$("#addConfig").removeClass("hidden");
	            }           
	            $("#addDevicesTable tbody").html(htm);
			}else{
				var ms = result.message;
				ToolTipTop.Show(ms,"error");
				$("#addDevicesTable tbody").html("<tr><td colspan='8' style='text-align:center;'>查询不到数据！</td></tr>")
			};
			setstyle();
        },
        error:function(result){
        	var ms = result.message;
            ToolTipTop.Show(ms,"error");
        }
    });
};
function bindCustomer() {
    var value = location.search.slice(1).split("&");
	var customerId = value[0].split("=")[1];
    var deviceIdList = [];
    $('input[name="check"]:checked').each(function () {
        deviceIdList.push($(this).data("id"));
    });
    if (deviceIdList.length > 0) {
    	var deviceNumber = deviceIdList.length;
    	Messager.confirm({Msg: "确认添加"+deviceNumber+"台设备?",iconImg: 'question'}).on(function (flag) {
			if (flag) {
				var jsondata = {"deviceIdList": deviceIdList,
		        				"customerId":customerId,
		        				"operateType":"bindCustomer"};
		        $.ajax({
		            type: "post",
		            url: '/deviceInfo/modify',
		            data: JSON.stringify(jsondata),
		            contentType: "application/json",
		            dataType: 'json',
		            success: function (result) {
		                if (result.code == 200) {
		                	sessionStorage.setItem("toolMessage","已成功添加"+deviceNumber+"台设备");
	                		window.location.href = backHref();		                	
		                } else {
		                    var ms = result.message;
		                   	ToolTipTop.Show(ms,"error");
		                }
		            }
		        });
			}
		});
        
    } else {
        ToolTipTop.Show("请选择要添加的设备","error");
    }
}
function checkAllId() {
    if ($("#ckAll").prop('checked')) {
        $("#addDevicesTable input[name='check']").prop('checked', true);
    } else {
        $("#addDevicesTable input[name='check']").prop('checked', false);
    }
};
function emptyList() {
    $("#devicesTable tbody").html('');
    $("#pagination").html('');
}

