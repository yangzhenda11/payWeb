$(function(){
	$("#payStatus,#payType").on("change",function(){
		searchbillDetail(1);
	})
})
function searchbillDetail(pageIndex){
	var pageSize = 15;
	var loginUserId = sessionStorage.getItem("id");
	var customerId = $("#customerId").val();
	var serialNum = $("#queryDeviceId").val();
	var searchDateRange = $("#searchDateRange").text();
	var startDate = searchDateRange.substring(0,10);
	var endDate  = searchDateRange.substring(13,23);
	var payStatus = $("#payStatus").val();
	var payType = $("#payType").val();
	var treeId = $("#customerId").find("option:selected").data("treeid");
	var data={
		"loginUserId":loginUserId,
		"pageIndex":pageIndex,
		"pageSize":pageSize,
		"customerId":customerId,
		"treeId":treeId,
		"serialNum":serialNum,
		"startDate":startDate,
		"endDate":endDate,
		"payStatus":payStatus,
		"payType":payType
	}
	$.ajax({
		type: "get",
		url: '/order/pageList',
		contentType: "application/json",
		dataType: 'json',
		data:data,
		async: false,
		success: function(result) {
			isSuccessCode(result.code);
			var fnCode = queryFnCode();
			if(result.code == 200){
				var data = result.data;
				var billList = data.list;
				if(billList.length > 0) {
					var html = "";
					var deviceSerialNum = null,customerName = null,payNumber = null,totalFee = null,payType = null,tradeType = null,payStatus = null;createdTime = null,payId = null,payFee=null;
					for(var i = 0; i < billList.length; i++) {
						deviceSerialNum = billList[i].deviceSerialNum;
						customerName = billList[i].customerName;
						payType = billList[i].payType;
						totalFee = billList[i].totalFee/100;					
						
						tradeType = billList[i].tradeType == null ? '' : billList[i].tradeType;
						payStatus = billList[i].payStatus;
						payNumber = billList[i].payNumber == null ? '' : billList[i].payNumber;
						payId = billList[i].id == null ? '' : billList[i].id;
						if(tradeType == 1){
							tradeType = "主扫";
							payNumber = billList[i].transactionId;
							if(payNumber == undefined){
								payNumber = "";
							};
						}else if(tradeType == 2){
							tradeType = "被扫"
							payNumber = billList[i].transactionId;
							if(payNumber == undefined){
								payNumber = "";
							};
						};
						if(payType == 1){
							payType = "微信";
						}else if(payType == 2){
							payType = "支付宝";
						}else if(payType == 3){
							payType = "浦发银行";
						}else if(payType == 4){
							payType = "百度钱包"
						}else if(payType == 11){
							payType = "威富通"
						}else{
							payType = "未知类型";
						}
						if(payStatus == 1){
							payStatus = "未支付";
							payFee = 0;
						}else if(payStatus == 2){
							payStatus = "已支付";
							payFee = billList[i].payFee/100;
						};
						createdTime = billList[i].createdTime == null ? '' : getFormatDateByLong(billList[i].createdTime, "yyyy-MM-dd hh:mm:ss");
	                    html += "<tr><td class='alignCenter'>" + createdTime + "</td>";
						html += "<td class='alignCenter' style='word-break:break-all;'>" + payNumber + "</td>";
						html += "<td class='alignCenter' style='word-break:break-all;'>" + deviceSerialNum + "</td>";
						html += "<td class='alignCenter'>" + customerName + "</td>";						
						html += "<td style='text-align:left;'>应付金额：" + totalFee + "</br>实付金额：" + payFee + "</br>支付方式：" + payType + "</br>交易类型：" + tradeType + "</td>";
						if(payStatus == "未支付"){
							html += "<td class='alignCenter' style='color:#bbb;'>" + payStatus + "</td>";
						}else{
							html += "<td class='alignCenter'>" + payStatus + "</td>";
						};
						html += "<td class='alignCenter'>";
						if(fnCode.refund == "refund"){
							if(payStatus == "已支付"){
								if(billList[i].canRefound == true){
									html += "<a style='cursor:pointer;overflow:hidden;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='退款订单' onclick='refoundOrder(" + payId + ")'><i class='icon iconfont icon-iconfonttuikuaneps operate'></i></a>";
								}
							}
						};
						html += "</td></tr>";					
					}
					$("#billDetailTable tbody").html(html);
					totalCount = data.listCount;
					var pageIndex = data.pageIndex;
					var fn = "searchbillDetail";
					var pagination_html = paging(totalCount,pageSize,pageIndex,fn);
					$("#export").removeClass("hidden");
					$("#pagination").html(pagination_html);
				}else{
					$("#export").addClass("hidden");
					$("#billDetailTable tbody").html("<tr ><td colspan='9' class='alignCenter'>查询不到数据！</td></tr>");
					$("#pagination").html("");
				}
			} else {
				$("#billDetailTable tbody").html("<tr ><td colspan='9' class='alignCenter'>查询不到数据！</td></tr>");
				$("#pagination").html("");
				$("#export").addClass("hidden");
				var ms =result.message;
				ToolTipTop.Show(ms,"error");
			}
		},
		error: function(msg) {
			ToolTipTop.Show("加载超时","error");
		}
	})
	
};
function refoundOrder(id){
	Messager.confirm({Msg: '确认对该订单进行退款?', title: '退款'}).on(function (flag) {
        if (flag) {
            data={
            	"orderId":id
            }
			$.ajax({
				type: "post",
				url: '/order/refund/edit',
				data:JSON.stringify(data),
				contentType: "application/json",
				dataType: 'json',
				success: function(result) {
					isSuccessCode(result.code);
					if(result.code == "200") {
						ToolTipTop.Show("订单退款成功","success");
						searchbillDetail(1);
					} else {
						var ms = result.message;
						ToolTipTop.Show("退款失败,错误信息:"+ms+"","error");						
					};
				},
				error:function(){
					ToolTipTop.Show("连接服务器失败","error");
				}
			});
        }
    });
}
function selec(result){
	var ms = null;
	if(result.sub_msg != undefined){
		ms = result.sub_msg;
		return ms;
	}else if(result.msg != undefined){
		ms = result.msg;
//		var data = result.msg;
//		var firstNum = data.indexOf("【")+1;
//		var lastNum = data.indexOf("】");
//		if(firstNum == -1 || lastNum == -1){
//			ms = result.sub_code;
//		}else{
//			ms = data.substring(firstNum,lastNum);
//		}
		return ms;
	}else{
		ms = result.sub_code;
		return ms;
	}
}
var funcRef = function(evt){
    evt = evt || window.event;
    if (evt.keyCode==13){
        searchbillDetail(1);
    }
}
window.onkeydown = funcRef;

/*
 * 获取服务商
 */
function getCustomers() {
	var loginUserId = sessionStorage.getItem("id");
	var data = {
		"loginUserId":loginUserId
	};
    $.ajax({
        type: "get",
        url: '/customer/subTree/query',
        data: data,
        contentType: "application/json",
        dataType: 'json',
        async: false,
        success: function (result) {
            var html = "";
            var customerList = result.data;
            var len = 40;
            if (customerList != null) {           	
                for (var i = 0; i < customerList.length; i++) {
                	if(len > customerList[i].treeId.length){
                		len = customerList[i].treeId.length;
                	};
                }
                for (var i = 0; i < customerList.length; i++) {
                    var num = (customerList[i].treeId.length - len)/4;
                    html += "<option data-treeid='"+ customerList[i].treeId +"' value='" + customerList[i].id + "'>" + blankReturn(num) + customerList[i].name + "</option>"
                }
            };
            $("#customerId").html(html);
            $("#customerId").selectpicker({
			    liveSearch: 'true',
			    width:"220px"
			});
			$('#customerId').selectpicker('setStyle', 'selectStyle', 'add');
			$(".selectStyle").css({"padding-top":"5px","padding-bottom":"5px"});
			$(".selectStyle").parent().css({"height":"32px","float":"left"});
			$(".selectStyle").parent().find("ul").css("position","none");
			$(".selectStyle").parent().find("ul").find("span").removeClass("glyphicon-ok");
        }
    });
};

/*
 * 返回空格填充
 */
function blankReturn(num){
	var arr = [];
	for(var i=0;i<num;i++){
		arr.push("&nbsp;&nbsp;&nbsp;")
	};
	arr = arr.join("");
	arr = arr.replace(",","");
	return arr;
};

function getDeviceModelList() {
    $.ajax({
        url: '/deviceModel/list',
        dataType: 'json',
        success: function (result) {
            isSuccessCode(result.code);
            var html = "<option value='0'>全部</option>";
            var model;
            if (result.code === 200) {
                var modelList = result.data;
                var modelArr = new Array();

                for (var i in modelList) {
                    switch (modelList[i].type) {
                        case 1:
                            model = "RC";
                            break;
                        case 2:
                            model = "基础版";
                            break;
                        case 3:
                            model = "兼容版";
                            break;
                        case 4:
                            model = "加强版";
                            break;
                        default:
                            model = "未知类型";
                    }

                    if (modelArr.indexOf(model) < 0) {
                        modelArr.push(model);
                        html += "<option value='" + modelList[i].type + "'>" + model + "</option>";
                    }
                }
            }
			
            $("#queryDeviceType").html(html);
        }
    });
};
$(document).ready(function (){
	//时间插件
	$('#reportrange span').html(moment().format('YYYY-MM-DD') + ' - ' + moment().format('YYYY-MM-DD'));
	$('#reportrange').daterangepicker(
		{
			//startDate: '2016-12-14',
			//endDate: moment(),
			minDate: '2012-01-10',	//最小时间
			maxDate : moment(), //最大时间 
			dateLimit : {
				days : 30
			}, //起止时间的最大间隔
			showDropdowns : true,
			showWeekNumbers : false, //是否显示第几周
			timePicker : false, //是否显示小时和分钟
			timePickerIncrement : 60, //时间的增量，单位为分钟
			timePicker12Hour : false, //是否使用12小时制来显示时间
			ranges : {
				//'最近1小时': [moment().subtract('hours',1), moment()],
				//'今日': [moment(), moment()],
	            '昨日': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
	            '最近7日': [moment().subtract('days', 6), moment()],
	            '最近30日': [moment().subtract('days', 29), moment()]
			},
			opens : 'right', //日期选择框的弹出位置
			buttonClasses : [ 'btn btn-default' ],
			applyClass : 'btn-small btn-primary blue',
			cancelClass : 'btn-small',
			format : 'YYYY-MM-DD', //控件中from和to 显示的日期格式
			separator : ' to ',
			locale : {
				applyLabel : '确定',
				cancelLabel : '取消',
				fromLabel : '起始时间',
				toLabel : '结束时间',
				customRangeLabel : '自定义',
				daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
				monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',
						'七月', '八月', '九月', '十月', '十一月', '十二月' ],
				firstDay : 1
			}
		}, function(start, end, label) {//格式化日期显示框
	     	$('#reportrange span').html(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
	   });
	//设置日期菜单被选项
  	var dateOption ;
  	if("${riqi}"=='day') {
		dateOption = "今日";
    }else if("${riqi}"=='yday') {
		dateOption = "昨日";
    }else if("${riqi}"=='week'){
		dateOption ="最近7日";
    }else if("${riqi}"=='month'){
		dateOption ="最近30日";
    }else if("${riqi}"=='year'){
		dateOption ="最近一年";
    }else{
		dateOption = "自定义";
    }
  	$(".daterangepicker").find("li").each(function (){
		if($(this).hasClass("active")){
			$(this).removeClass("active");
		}
		if(dateOption==$(this).html()){
			$(this).addClass("active");
		}
    });
    getCustomers();
	searchbillDetail(1);
  
});
		

