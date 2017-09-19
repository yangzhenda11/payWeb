$(function () {
	isCache("payChannelList",getPayChannelList);
    var fnCode = queryFnCode();
	addBtnShow(fnCode);
	var isAdmin = sessionStorage.getItem("isAdmin");
	if(isAdmin == "true"){
		$("#customer_name").removeClass("hidden");
		$("#customer_input").removeClass("hidden");
	};
	$("#channelType").on("change",function(){
		getPayChannelList(1);
	})
})

/*
 * 获取列表
 */
function getPayChannelList(pageIndex) {
    var url = '/payChannel/pageList';
    var pageSize = 15;
    var channelName = $("#channelName").val();
    channelName = $.trim(channelName);
    var channelType = $("#channelType").val();
    var channelName = $("#channelName").val();
	var customer_input = $("#customer_input").val();
    $.ajax({
        type: 'GET',
        url: url,
        data: {
            "pageIndex": pageIndex,
            "pageSize": pageSize,
            "description": channelName,
            "customerName":customer_input,
            "channelType": channelType
        },
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            isSuccessCode(result.code);
            if (result.code === 200) {
                var payChannelList = result.data.list;
                var fnCode = queryFnCode();
                var html;
                totalCount = result.data.listCount;
                $(".fontbold").text(totalCount);
              	if(payChannelList.length>0){
	                $.each(payChannelList, function (index, payChannel) {
	                    var fixationMoney = payChannel.fixationMoney == null ? '0' : payChannel.fixationMoney;
						var customerName = payChannel.customerName == null ? '' : payChannel.customerName;
	                    if (payChannel.channelType == '1') {
	                        channelType = "普通通道";
	                    } else if (payChannel.channelType == '2') {
	                        channelType = "定额通道";
	                    } else {
	                        channelType = "未知类型";
	                    };					                    
						var timeout = payChannel.timeout == null ? '' : payChannel.timeout;
						var payChannelId = payChannel.id +"^&^"+result.data.pageIndex;
	                    html += "<tr id='" + payChannel.id + "'>" +
	                        "<td style='padding-left:20px'>" + payChannel.description + "</td>" +
	                        "<td>" + customerName + "</td>" +
	                        "<td>" + timeout + "</td>" +
	                        "<td>" + channelType + "</td>" +
	                        "<td>" + fixationMoney + "</td>";
	                    html +="<td style='text-align:center;'>";
	                    if(fnCode.details == "details"){
							html += "<a data-toggle='tooltip' data-placement='bottom' title='详情' style='margin-right: 10px;cursor:pointer;text-decoration: none;' href='javascript:void(0);' onclick='goPayChanneDetalis(\""+payChannelId+"\")'><i class='icon iconfont icon-xiangqing operate'></i></a>";
						};
						if(fnCode.modify == "modify"){
							html += "<a style='margin-right: 10px;cursor:pointer;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='修改' href='javascript:void(0);' onclick='goPayChanneConfig(\""+payChannelId+"\")'><i class='icon iconfont icon-bianji operate'></i></a>";
						};
						if(fnCode.delete == "delete"){
							html += "<a data-toggle='tooltip' data-placement='bottom' title='删除' style='cursor:pointer;text-decoration: none;' onclick='deletePayChannel(" + payChannel.id + ")'><i class='icon iconfont icon-shanchu operate'></i></a>";
						};
						html += "</td></tr>";
	                });
	                $("table tbody").html(html);	              
					var pageIndex = result.data.pageIndex;
					var fn = "getPayChannelList";
					var pagination_html = paging(totalCount,pageSize,pageIndex,fn);
					$("#pagination").html(pagination_html);               
				}else{
	            	$("#deviceconfigTable tbody").html("<tr><td style='text-align:center' colspan='6'>查询不到数据！</td></tr>");
	            	$("#pagination").html("");
	            }
            } else {
                var ms = result.message;
                ToolTipTop.Show(ms,"error");
            
            }
        },
        error: function (result) {
            ToolTipTop.Show("加载超时","error");
        }
    })
};
/*
 * go支付通道新增
 */
function goPayChannelAdd(){
	window.location.href = "index.html#payChannelAdd";
};
/*
 * go支付通道详情
 */
function goPayChanneDetalis(data){
	var id = data.split("^&^")[0];
	var pageNum = data.split("^&^")[1];
	var parameter = {
		"payChannelDetails":id
	};
	var cache = {
		"pageNum":pageNum,
		"payChannelList":"payChannelList"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#payChannelDetails";
};

/*
 * go支付通道修改
 */
function goPayChanneConfig(data){
	var id = data.split("^&^")[0];
	var pageNum = data.split("^&^")[1];
	var parameter = {
		"payChannelConfig":id
	};
	var cache = {
		"pageNum":pageNum,
		"payChannelList":"payChannelList"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#payChannelConfig";
};
var funcRef = function(evt){
    evt = evt || window.event;
    if (evt.keyCode==13){
        getPayChannelList(1);
    }
}
window.onkeydown = funcRef;

/*
 * 删除
 */
function deletePayChannel(id) {
    $data = $.parseJSON('[' + id + ']');
    $url = '/payChannel/deletes';
	Messager.confirm({Msg: '确认删除此支付通道?', title: '删除支付通道'}).on(function (flag) {
        if (flag) {
        	$.ajax({
		        type: 'POST',
		        url: $url,
		        data: JSON.stringify($data),
		        contentType: "application/json",
		        dataType: 'json',
		        success: function (result) {
	                if(result.code == 200) {
	                	ToolTipTop.Show("删除支付通道成功","success");
	                	getPayChannelList(1);
					} else {
						var ms = result.message;
						ToolTipTop.Show(ms,"error");
					}
	            }
	        })
        }
    })
};
