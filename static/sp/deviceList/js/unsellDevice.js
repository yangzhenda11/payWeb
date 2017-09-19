//样式设置
$(function(){
	var flagStatue = sessionStorage.getItem("listFlag");
	if(flagStatue == 0){
		$("#control i").removeClass("icon-xiangyouzhankai").addClass("icon-xiangzuoshouqi-copy");
		$(".unleftContainer").css("width","14%");
		$(".unrightContainer").css("width","85.8%");
		$("#nav").css("display","block");
		$("#navIcon").css("display","none");
	}else if(flagStatue == 1){
		$("#control i").removeClass("icon-xiangzuoshouqi-copy").addClass("icon-xiangyouzhankai");
		$(".unleftContainer").css("width","4%");
		$(".unrightContainer").css("width","96%");
		$("#nav").css("display","none");
		$("#navIcon").css("display","block");
	};
	var height = $(".unrightContainer").height();
	$(".unleftContainer").css({"min-height":height,"border":"none"});
});
$("#control i").on("click",function(){
	var flag = sessionStorage.getItem("listFlag");
	if(flag == 0){
		$(".unleftContainer").animate({ 
			width: "4%",
		},500);
		$(".unrightContainer").animate({ 
			width: "96%",
		},500 ,function(){
			sessionStorage.setItem("listFlag","1");
			$("#control i").removeClass("icon-xiangzuoshouqi-copy").addClass("icon-xiangyouzhankai");
			$("#nav").css("display","none");
			$("#navIcon").css("display","block");
		});
	}else if(flag == 1){
		$("#nav").css("display","block");
		$("#navIcon").css("display","none");
		$(".unleftContainer").animate({ 
			width: "14%",
		}, 500);
		$(".unrightContainer").animate({ 
			width: "85.8%",
		}, 500 ,function(){
			sessionStorage.setItem("listFlag","0");
			$("#control i").removeClass("icon-xiangyouzhankai").addClass("icon-xiangzuoshouqi-copy");
			
		});
	};
});
$(function() {
	addListTree();
	getDeviceModelList("#queryDeviceType");
	getDeviceList(1);
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
       	"operateType":"unsell",
       	"treeId":treeId,
       	"customerType":customerType
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
                        device_list_html += "<tr>" + "<td style='text-align:center;'><input id='deviceIdChecked' type='checkbox'  name='check' data-id='"+device.id+"'></td>"
                            + "<td>" + device.serialNum + "</td>"
                            + "<td>" + device.customerName + "</td>"
                            + "<td>" + model + "</td>"
                            + "<td>" + soldDate + "</td>"
                    }
                    $("#devicesTbody").html(device_list_html);					
					var pageIndex = deviceResult.pageIndex;
					var fn = "getDeviceList";
					var pagination_html = paging(totalCount,pageSize,pageIndex,fn);
					$("#pagination").html(pagination_html);
                } else {
                    emptyList();
                    $("#devicesTbody").html("<tr><td colspan='5' style='text-align: center'>查询不到数据!</td></tr>");
                }
            } else {
                $("#devicesTbody").html("<tr><td colspan='5' style='text-align: center'>查询不到数据!</td></tr>");
            }
        }
    });
}
var funcRef = function(evt){
    evt = evt || window.event;
    if (evt.keyCode==13){
        getDeviceList(1);
    }
}
window.onkeydown = funcRef;
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

function checkAllId() {
    if ($("#checkAllId").prop('checked')) {
        $("#devicesTable input[name='check']").prop('checked', true);
    } else {
        $("#devicesTable input[name='check']").prop('checked', false);
    }
};