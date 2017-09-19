$(function(){
	queryCustomer();	
})
/*
 * 返回服务商列表
 */
function backCustomer(){
	sessionStorage.setItem("readCache","1");
	window.location.href='index.html#customer';
}
/*
 * 获取服务商信息
 */
function queryCustomer() {
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).customerDetail;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}
    var customerId = parameter;
	$.ajax({
		type: "GET",
		url: '/customer/get',
		data: "data=" + customerId,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var spObject = result.data;
				var abb = spObject.abb == null ? '0' : spObject.abb;								
				$("#name").val(spObject.name);
				$("#abb").val(abb);
				$("#mobile").val(spObject.mobile);
				$("#mail").val(spObject.mail);
				$("#address").val(spObject.address);
				$("#contact").val(spObject.contact);							
				query(spObject);
				var createdTime = spObject.createdTime == null ? '' : getFormatDateByLong(spObject.createdTime, "yyyy-MM-dd hh:mm:ss");
				if ("1" == spObject.type) {
					$("input[name=type][value='1']").attr("checked", true);
				}
				if ("4" == spObject.type) {
					$("input[name=type][value='4']").attr("checked", true);
				}				
				if ("0" == spObject.enableStatus) {
					$("input[name=enableStatus][value='0']").attr("checked", true);
				}
				if ("1" == spObject.enableStatus) {
					$("input[name=enableStatus][value='1']").attr("checked", true);
				}
				if ("0" == spObject.testStatus) {
					$("input[name=testStatus][value='0']").attr("checked", true);
				}
				if ("1" == spObject.testStatus) {
					$("input[name=testStatus][value='1']").attr("checked", true);
				};
				$("#createdTime").val(createdTime);
			} else {
				var ms = result.message;
				ToolTipTop.Show(ms,"error");
			}
		}
	});
}
/*
 * 获取服务商
 */
function query(datas) {
	var data = {
		"operateType": "sales"
	};
	$.ajax({
		type: "GET",
		url: '/user/list',
		data: data,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var salesId = datas.salesId;
				var salesName = datas.salesName;
				var html ="";
				if(salesId == undefined){
					salesId = "";
				};
				if(salesName == undefined){
					salesName = "";
				};
				html = "<option value='"+salesId+"' selected='selected'>"+salesName+"</option>";
				var saleList = result.data;
				for(var i = 0; i < saleList.length; i++) {
					if(datas.salesId != saleList[i].id){
						html += "<option value='" + saleList[i].id + "'>" + saleList[i].userName + "</option>"
					}
				};
				$("#editSell").html(html);
			}
		}
	});
}
