$(function () {
    viewDetails();
});

/*
 * 返回列表
 */
function goBackpayChannelList(){
	sessionStorage.setItem("readCache","1");
	window.location.href='index.html#payChannelList';
};
/*
 * 显示详情
 */
function viewDetails() {
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).payChannelDetails;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	};
    var id = parameter;
    var url = '/payChannel/get';
    $.ajax({
        type: 'GET',
        url: url,
        data: "data=" + id,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            if (result.code === 200) {
                var data = result.data;
                $("#description").val(data.description);
                $("#customerName").val(data.customerName);
                if (data.channelType == 1) {
                    $("#channelTypeCommon").attr('checked', 'true');
                } else {
                    $("#channelTypeSlef").attr('checked', 'true');
                    $("#fixationPayDiv").attr("style", "display:block;");
                }
                $("#refundUrl").val(data.refundUrl);
                $("#fixationPay").val(data.fixationMoney);
                $("#sign_key").val(data.signKey);
                $("#query_order_url").val(data.queryOrderUrl);
                $("#scanned_pay_url").val(data.scannedPayUrl);
                $("#generate_order_url").val(data.generateOrderUrl);
                $("#time_out").val(data.timeout);
            } else {
                var ms = result.message;
                ToolTipTop.Show(ms,"error");
            }
        },
        error: function (result) {
        	ToolTipTop.Show("加载超时","error");
        }
    });
}