$(function(){
	//loadExcel();
	//getDeviceModelList();
	$("#payType").on("change",function(){
		searchbillDetail(1);
	})
});
/*
 * 导出execl表格
 */
 function loadExcel(){
 	$("#export a").on("click",function(){
		var loginUserId = sessionStorage.getItem("id");
		var customerId = $("#customerId").val();
		var serialNum = $("#queryDeviceId").val();
		var searchDateRange = $("#searchDateRange").text();
		var startDate = searchDateRange.substring(0,10);
		var endDate  = searchDateRange.substring(13,23);
		var payStatus = 3;
		var treeId = $("#customerId").find("option:selected").data("treeid");
		var payType = $("#payType").val();
 	})
};
/*
 * 退款明细列表
 */
function searchbillDetail(pageIndex){
	var pageSize = 15;
	var loginUserId = sessionStorage.getItem("id");
	var customerId = $("#customerId").val();
	var serialNum = $("#queryDeviceId").val();
	var searchDateRange = $("#searchDateRange").text();
	var startDate = searchDateRange.substring(0,10);
	var endDate  = searchDateRange.substring(13,23);
	var payStatus = 3;
	var treeId = $("#customerId").find("option:selected").data("treeid");
	var payType = $("#payType").val();
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
	};
	$.ajax({
		type: "get",
		url: '/order/pageList',
		contentType: "application/json",
		dataType: 'json',
		data:data,
		async: false,
		success: function(result) {
			
			isSuccessCode(result.code);
			
			if(result.code == 200){
				var data = result.data;
				var billList = data.list;
				if(billList.length > 0) {
					var html = "";
					var deviceSerialNum = null,customerName = null,payNumber = null,totalFee = null,payType = null,tradeType = null,createdTime = null,refundFee = null,refundTime = null,refundNo = null;
					for(var i = 0; i < billList.length; i++) {
						deviceSerialNum = billList[i].deviceSerialNum;
						customerName = billList[i].customerName;
						payType = billList[i].payType;
						totalFee = billList[i].totalFee/100;
						tradeType = billList[i].tradeType == null ? '' : billList[i].tradeType;
						payNumber = billList[i].payNumber == null ? '' : billList[i].payNumber;
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
							payType = "支付宝"
						}else if(payType == 3){
							payType = "浦发银行"
						}else if(payType == 4){
							payType = "百度钱包"
						}else if(payType == 11){
							payType = "威富通"
						};
						createdTime = billList[i].createdTime == null ? '' : getFormatDateByLong(billList[i].createdTime, "yyyy-MM-dd hh:mm:ss");
						refundFee = billList[i].refundFee == null ? '' : billList[i].refundFee/100;
						refundTime = billList[i].refundTime == null ? '' : getFormatDateByLong(billList[i].refundTime, "yyyy-MM-dd hh:mm:ss");;
						refundNo = billList[i].refundNo == null ? '' : billList[i].refundNo;
						html += "<tr><td class='alignCenter'>" + refundTime + "</td>";
	                    html += "<td class='alignCenter' style='word-break:break-all;'>" + refundNo + "</td>";
	                    html += "<td class='alignCenter' style='word-break:break-all;'>" + deviceSerialNum + "</td>";
						html += "<td class='alignCenter'>" + customerName + "</td>";
						html += "<td class='alignCenter' style='word-break:break-all;'>" + payNumber + "</td>";
						html += "<td>退款金额：" + refundFee + "</br>支付方式：" + payType + "</br>交易类型：" + tradeType + "</td></tr>";						
					}
					$("#billDetailTable tbody").html(html);
					totalCount = data.listCount;
					var pageIndex = data.pageIndex;
					var fn = "searchbillDetail";
					var pagination_html = paging(totalCount,pageSize,pageIndex,fn);					
					$("#pagination").html(pagination_html);
				}else{
					$("#billDetailTable tbody").html("<tr><td colspan='8' style='text-align:center;'>查询不到数据！</td></tr>");
					$("#pagination").html("");
				}
			} else {
				$("#billDetailTable tbody").html("<tr><td colspan='8' style='text-align:center;'>查询不到数据！</td></tr>");
				$("#pagination").html("");
				var ms =result.message;
				ToolTipTop.Show(ms,"error");
			}
		},
		error: function(msg) {
			ToolTipTop.Show("加载超时","error");
		}
	})
	
};
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
			    width:"195px"
			});
			$('#customerId').selectpicker('setStyle', 'selectStyle', 'add');
			$(".selectStyle").css({"padding-top":"5px","padding-bottom":"5px"});
			$(".selectStyle").parent().css({"height":"32px","float":"left"});
			$(".selectStyle").parent().find("ul").css("position","none");
			$(".selectStyle").parent().find("ul").find("span").removeClass("glyphicon-ok");
			searchbillDetail(1);
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
});
		

