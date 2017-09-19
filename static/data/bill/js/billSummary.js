
$(function (){
//	var height = document.documentElement.clientHeight - $("#queryDeviceIdBtn").offset().top - 100;
//	$("#customerDiv").css("height",height);
//	$(window).resize(function () { 
//		var resizeHeight = document.documentElement.clientHeight - $("#queryDeviceIdBtn").offset().top - 80;
//		$("#customerDiv").css("height",resizeHeight);
//	});
	setPayType();
	/*
	 * 搜索按钮点击
	 */
	$("#querybtn").on("click",function(){
		var queryDeviceId = $("#queryDeviceId").val();	
		if(queryDeviceId == ""){			
			searchcustomerBill(1);				//按服务商查询
		}else{			
			searchDeviceBill(1);				//按设备查询			
		};
	})
	/*
	 * 支付汇总点击
	 */
	document.querySelector('#payType').addEventListener('click', function(e){
    	$('#payTypeItem').addClass('show');
    	e.stopPropagation();
	}, false);
	document.querySelector('#payTypeItem').addEventListener('click', function(e){
    	e.stopPropagation();
	}, false);
	document.addEventListener('click', function(){
    	$('#payTypeItem').removeClass('show');
	}, false);
	/*
	 * 事件监听
	 */
	$("#cusId").on("change",function(){
		getPayType();
	});
	$("#queryDeviceId").bind('input propertychange', function() {
		var deviceLen = $("#queryDeviceId").val().length;
		if(deviceLen == 16 || deviceLen == 0){
			getPayType();
		}else{
			$("#billSummary").addClass("hide");
			$("#billEmpty").removeClass("hide");
		}
	});
	/*
	 * 服务商点击
	 */
//	document.querySelector('#cusName').addEventListener('click', function(e){
//  	$('#customerDiv').addClass('show');
//  	e.stopPropagation();
//	}, false);
//	document.querySelector('#customerDiv').addEventListener('click', function(e){
//  	e.stopPropagation();
//	}, false);
//	document.addEventListener('click', function(){
//  	$('#customerDiv').removeClass('show');
//	}, false);
	checkAllFn();
})
/*
 * 全选全不选
 */	
function checkAllFn(){
	$("#checkAll").click(function() {
	    $('input[name="payItem"]').prop("checked",this.checked); 
	    setPayType();
	});
	var $payItem = $("input[name='payItem']");
	$payItem.click(function(){    	
    $("#checkAll").prop("checked",$payItem.length == $("input[name='payItem']:checked").length ? true : false);
    	setPayType();
	});
}
/*
 * 获取服务商
 */
function getCustomerTree() {
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
            	var readCache = sessionStorage.getItem("readCache");
				if(readCache == 1){
					var cacheValue =  sessionStorage.getItem("cache");
					cacheValue = JSON.parse(cacheValue);
					if(cacheValue.billSummary == "billSummary"){
						var customerId = cacheValue.customerId;
						
		            }     
				}               
            };           
        }
    });
};

/*
 * 获取支付方式数量
 */
function getPayType(){
	var queryDeviceId = $("#queryDeviceId").val();	
	var countBy = $("#summaryType").val();
	var searchDateRange = $("#searchDateRange").text();
	var customerId = $("#cusId").val();
	var treeId = $("#cusId").find("option:selected").data("treeid");
	if(countBy == "M"){
		var startDate = searchDateRange.substring(0,7);
		var endDate  = searchDateRange.substring(10,17);		
	}else if(countBy =="D"){
		var startDate = searchDateRange.substring(0,10);
		var endDate  = searchDateRange.substring(13,23);		
	};
	if(queryDeviceId == ""){		
		var data={
			"customerId":customerId,
			"startDate":startDate,
			"endDate":endDate,			
			"countBy":countBy,
			"treeId":treeId,
			"operateType":"byCustomer"
		};		
	}else{
		var loginUserId = sessionStorage.getItem("id");
		var data={
			"customerId":customerId,
			"loginUserId":loginUserId,
			"serialNum":queryDeviceId,
			"startDate":startDate,
			"endDate":endDate,
			"treeId":treeId,
			"operateType":"byDevice",
			"countBy":countBy
		};		
	};
	$.ajax({
        type: "GET",
        url: '/statistics/getPayType/query',
        data: data,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
        	isSuccessCode(result.code);	        	
            if (result.code == 200) {
            	if(result.data.code == 201){
            		var ms =result.data.msg;
	            	$("#payTypeItem").html("<li style='text-align:center;margin-top:5px;'>暂无支付方式</li>");				
					setPayType();					
					$("#billSummary").addClass("hide");
					$("#billEmpty").removeClass("hide");
					ToolTipTop.Show(ms,"error");
            	}else{
            		var data = result.data.payTypeList;
	                if(queryDeviceId == ""){
	                	setPayTypeValue(data,"customer");
	                }else{
	                	setPayTypeValue(data,"device");
	                }
            	}
            }else{
            	var ms =result.msg;
            	$("#payTypeItem").html("<li style='text-align:center;margin-top:5px;'>暂无支付方式</li>");				
				setPayType();
				
				$("#billSummary").addClass("hide");
				$("#billEmpty").removeClass("hide");
				ToolTipTop.Show(ms,"error");
			}
		},
		error: function(msg) {
			ToolTipTop.Show("加载超时","error");
		}
    })
}
/*
 * 设备支付方式
 */
function setPayTypeValue(data,type){
	var payType = [];
    for(var i in data){
    	if(data[i] != null){
    		payType.push(data[i]["id"]);
    	};
    };    
    if(payType.length > 0){
		var checkboxHtml = '<li><label><input type="checkbox" id="checkAll" value="0" />全部</label></li>';
		var commonObj = {
			1 : "微信",
			2 : "支付宝",
			11 : "威富通",
			4 : "百度钱包",
			3 : "浦发银行"
		};
		for(var k in commonObj){
			k = Number(k);
			if($.inArray(k, payType) != -1){						
				checkboxHtml += '<li><label><input type="checkbox" name="payItem" value="'+k+'" checked=""/>'+commonObj[k]+'</label></li>';
			}
		}				
		$("#payTypeItem").html(checkboxHtml);
		
	}else{				
		$("#payTypeItem").html("<li style='text-align:center;margin-top:5px;'>暂无支付方式</li>");
	}
	checkAllFn();
	setPayType();
	if(type == "customer"){
		searchcustomerBill(1);
	}else if(type == "device"){
		searchDeviceBill(1);
	}
}

/*
 * 支付方式data值
 */
function setPayType(){
	var $payItem = $("input[name='payItem']");
	var payTypeArr = [];
	$.each($("input[name='payItem']:checked"),function(i,value){
		payTypeArr.push(Number($(value).val()));
	})
	$("#payType").data("payType",payTypeArr);
	if($payItem.length == 0){
		$("#payType").html("暂无<b class='caret' style='margin-top:10px;'></b>");
	}else if($payItem.length == $("input[name='payItem']:checked").length){
		$("#checkAll").prop("checked",true); 
		$("#payType").html("全部<b class='caret' style='margin-top:10px;'></b>");		
	}else{
		$("#payType").html("自定义<b class='caret' style='margin-top:10px;'></b>");				
	}	
}
/*
 * 判断登录类型，选择接口查询
 */
function setVagueSearch(){
	var isAdmin = sessionStorage.getItem("isAdmin");
	if(isAdmin == "true"){
		$("#queryDeviceId").bind('input propertychange', function() {
	    	isAdminSearch();
		});	
	}else{		
    	notAdminSearch();				
	}	
}
/*
 * admin查询接口，设置模糊查询
 */
function isAdminSearch(){
  	var serialNum = $("#queryDeviceId").val();
    var data = {
        "customerId": "",
        "customerName": "",
        "type": null,
        "pageIndex": 1,
        "pageSize": 300,
        "serialNum": serialNum,
        "connectState": 0,
        "appName": "",
        "operateType":"sales"        
    };
    $.ajax({
        type: "GET",
        url: '/deviceSale/pageList',
        data: data,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
        	isSuccessCode(result.code);
            if (result.code === 200) {
                var deviceList = result.data.list;
                if (deviceList.length > 0) {
                	var sourceObj = [];
                	for(var i = 0;i < deviceList.length; i++){
                		var obj = {"id":deviceList[i].id,"number":deviceList[i].serialNum};
                		sourceObj.push(obj);
                	};
                	$('#queryDeviceId').typeahead({
				        source: sourceObj,
				        display: 'number',
				        val: 'id',
				        itemSelected: displayResult
				    });                	
                }
            }else{
            	var ms =result.message;
				ToolTipTop.Show(ms,"error");
			}
		},
		error: function(msg) {
			ToolTipTop.Show("加载超时","error");
		}
    })
}
/*
 * 非admin查询接口，设置模糊查询
 */
function notAdminSearch(){
    var len = $("#cusId option").length;
    var minLen = 1000;
    var minIndex = null;
	for (var i = 0; i < len; i++) {
    	if(minLen > $($("#cusId option")[i]).data("treeid").length){
    		minLen = $($("#cusId option")[i]).data("treeid").length;
    		minIndex = i;
    	};
   	}	
	var treeId = $($("#cusId option")[minIndex]).data("treeid");
	var customerType = $($("#cusId option")[minIndex]).data("type");
	var customerId = $($("#cusId option")[minIndex]).val();		
	var serialNum = $("#queryDeviceId").val();
    var data = {
        "customerId": customerId,
        "type": null,
        "pageIndex": 1,
        "pageSize": 400,
        "serialNum": serialNum,
        "customerName": "",
       	"operateType":"boundDevice",
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
            if (result.code === 200) {
                var deviceList = result.data.list;
                if (deviceList.length > 0) {
                	var sourceObj = [];
                	for(var i = 0;i < deviceList.length; i++){
                		var obj = {"id":deviceList[i].id,"number":deviceList[i].serialNum};
                		sourceObj.push(obj);
                	};
                	$('#queryDeviceId').typeahead({
				        source: sourceObj,
				        display: 'number',
				        val: 'id',
				        itemSelected: displayResult
				    });                	
                }
            }else{
            	var ms =result.message;
				ToolTipTop.Show(ms,"error");
			}
		},
		error: function(msg) {
			ToolTipTop.Show("加载超时","error");
		}
    })
}
function displayResult(item, val, text) {
    //console.log(item);
}
/*
 * 导出execl表格
 */
 function loadExcel(){
 	$("#export a").on("click",function(){
 		var queryDeviceId = $("#queryDeviceId").val();	
		if(queryDeviceId == ""){
			var customerId = $("#cusId").val();
			var treeId = $("#cusId").find("option:selected").data("treeid");
			var countBy = $("#summaryType").val();
			var searchDateRange = $("#searchDateRange").text();
			if(countBy == "M"){
				var startDate = searchDateRange.substring(0,7);
				var endDate  = searchDateRange.substring(10,17);				
			}else if(countBy =="D"){
				var startDate = searchDateRange.substring(0,10);
				var endDate  = searchDateRange.substring(13,23);				
			};					
			var urls = "/statisticsByCustomer/excel?customerId="+customerId+"&startDate="+startDate+"&endDate="+endDate+"&payType=0&countBy="+countBy+"&treeId="+treeId;
			download_file(urls);
 		}		
 	})
};

/*
 * 账单搜索条件判断
 */
function billSearch(){
	var queryDeviceId = $("#queryDeviceId").val();	
	if(queryDeviceId == ""){
		customerBillSearch();			//按服务商查询
	}else{
		searchDeviceBill(1);			//按设备查询	
	}
}
/*
 * 日期类型切换
 */
$("#summaryType").on("change",function(){
	var summaryType = $("#summaryType").val();
	if(summaryType == "M"){
		monthSummary();
		getPayType();		
	}else if(summaryType == "D"){
		daySummary();
		getPayType();
	}
})
/*
 * 按服务商查询
 */
function customerBillSearch(){
	var readCache = sessionStorage.getItem("readCache");
	if(readCache == 1){
		var cacheValue =  sessionStorage.getItem("cache");
		cacheValue = JSON.parse(cacheValue);
		if(cacheValue.billSummary == "billSummary"){
			var dates = cacheValue.dates;
			var summaryType = cacheValue.summaryType;			
			var pageNum = cacheValue.pageNum;
			var checkPayType = cacheValue.checkPayType;
			var payType = cacheValue.payType;							
			if(payType.length > 0){
				var checkboxHtml = '<li><label><input type="checkbox" id="checkAll" value="0" />全部</label></li>';
				var commonObj = {
					1 : "微信",
					2 : "支付宝",
					11 : "威富通",
					4 : "百度钱包",
					3 : "浦发银行"
				};
				for(var k in commonObj){
					k = Number(k);
					if($.inArray(k, payType) != -1){						
						checkboxHtml += '<li><label><input type="checkbox" name="payItem" value="'+k+'" checked=""/>'+commonObj[k]+'</label></li>';
					}
				}				
				$("#payTypeItem").html(checkboxHtml);
			}else{				
				$("#payTypeItem").html("<li style='text-align:center;margin-top:5px;'>暂无支付方式</li>");
			}
			checkAllFn();
			for(var i = 0; i < payType.length; i++){
				var keys = payType[i];
				if($.inArray(keys, checkPayType) != -1){
					$("input[name='payItem'][value='" + keys + "']").prop("checked",true);
				}else{
					$("input[name='payItem'][value='" + keys + "']").prop("checked",false);
				};				
			};
			$("#checkAll").prop("checked",false);
			setPayType();
			$('#reportrange span').html(dates);
			$("#summaryType").val(summaryType);
			if(summaryType == "D"){
				daySummary(1);
			}else if(summaryType == "M"){
				monthSummary(1);
			};
			sessionStorage.removeItem("readCache");
			searchcustomerBill(pageNum);
		}else{
			daySummary();
			getPayType();			
		}
	}else{
		daySummary();		
		getPayType();
	}
};

/*
 * 按服务商查询
 */
function searchcustomerBill(pageIndex){
	var pageNum = pageIndex;
	var customerId = $("#cusId").val();
	var treeId = $("#cusId").find("option:selected").data("treeid");
	var countBy = $("#summaryType").val();
	var searchDateRange = $("#searchDateRange").text();
	var num = null;
	var checkedPayType = $("#payType").data("payType");		
	var payType = JSON.stringify(checkedPayType).replace("[","").replace("]","").replace(/,/g,"_");	
	var pageSize = 15;
	if(countBy == "M"){
		var startDate = searchDateRange.substring(0,7);
		var endDate  = searchDateRange.substring(10,17);
		for(var i = 0; i < 15;i++){
			var timer = moment(endDate).subtract('month', i);
			if(moment(startDate) >= moment(timer)){
				num = i;
				break;
			}
		}
	}else if(countBy =="D"){
		var startDate = searchDateRange.substring(0,10);
		var endDate  = searchDateRange.substring(13,23);
		for(var i = 0; i < 35;i++){
			var timer = moment(endDate).subtract('day', i);
			if(moment(startDate) >= moment(timer)){
				num = i;
				break;
			}
		}
	};
	if(checkedPayType == ""){		
		$("#billSummary").addClass("hide");
		$("#billEmpty").removeClass("hide");
	} else {	
		$("#billSummary").removeClass("hide");
		$("#billEmpty").addClass("hide");		
		if(checkedPayType.length == 3){
			$("#tableValue").css("width","1150px");
		}else if(checkedPayType.length == 4){
			$("#tableValue").css("width","1350px");
		}else if(checkedPayType.length == 5){
			$("#tableValue").css("width","1550px");
		}else{
			$("#tableValue").css("width","auto");
		};
		var isAdmin = sessionStorage.getItem("isAdmin");
		var data={
			"customerId":customerId,
			"startDate":startDate,
			"endDate":endDate,
			"payType":payType,
			"countBy":countBy,
			"treeId":treeId
		};
		$.ajax({
			type: "get",
			url: '/statistics/customer/query',
			contentType: "application/json",
			dataType: 'json',
			data:data,
			async: false,
			beforeSend:loading,
			success: function(result) {			
				isSuccessCode(result.code);
				if(result.code == 200){
					var collect = "";
					var tableTitleTh = "<th style='width: 120px;'>时间</th><th style='width: 280px;'>商户名称</th>";
					var html = "<tr id='tableTitleTr'><td></td><td></td>";
					var data = result.data;
					var customerNames = data.customerName;
					var count = pageSize*(pageNum-1);				
					var value = data.pair.value;
					var len = data.pair.value.length;
					var wechatGrossFee = 0,wechatGrossCount = 0,aliGrossCount = 0,aliGrossFee = 0,swiftpassGrossCount = 0,swiftpassGrossFee = 0,baiduGrossCount = 0,baiduGrossFee = 0,spdbGrossCount = 0,spdbGrossFee = 0;											
					//计算总计													
					if($.inArray(1, checkedPayType) != -1){
						wechatGrossCount = data.wechatPayCount == null ? 0 : data.wechatPayCount;
						wechatGrossFee = data.wechatTotalFee == null ? 0 : data.wechatTotalFee/100;
						html += "<td class='borderL weixinColor'><span>金额</span></td><td class='weixinColor'>笔数</td>";
						tableTitleTh += "<th class='payTitle' colspan='2'>微信支付</th>";
						collect += "<span class='collectPay'><p>微信笔数</p><p class='weixinColor'><span>"+wechatGrossCount+"</span></p><p>微信金额</p><p class='weixinColor'><span class='weixinColorLine'>"+wechatGrossFee+"</span></p></span>";
					};
					if($.inArray(2, checkedPayType) != -1){
						aliGrossCount = data.aliPayCount == null ? 0 : data.aliPayCount;
						aliGrossFee = data.aliTotalFee == null ? 0 : data.aliTotalFee/100;
						html += "<td class='borderL aliColor'><span>金额</span></td><td class='aliColor'>笔数</td>";	
						tableTitleTh += "<th class='payTitle' colspan='2'>支付宝支付</th>";
						collect += "<span class='collectPay'><p>支付宝笔数</p><p class='aliColor'><span>"+aliGrossCount+"</span></p><p>支付宝金额</p><p class='aliColor'><span class='aliColorLine'>"+aliGrossFee+"</span></p></span>";				
					};
					if($.inArray(11, checkedPayType) != -1){
						swiftpassGrossCount = data.swiftpassPayCount == null ? 0 : data.swiftpassPayCount;
						swiftpassGrossFee = data.swiftpassTotalFee == null ? 0 : data.swiftpassTotalFee/100;
						html += "<td class='borderL swiftColor'><span>金额</span></td><td class='swiftColor'>笔数</td>";	
						tableTitleTh += "<th class='payTitle' colspan='2'>威富通支付</th>";
						collect += "<span class='collectPay'><p>威富通笔数</p><p class='swiftColor'><span>"+swiftpassGrossCount+"</span></p><p>威富通金额</p><p class='swiftColor'><span class='swiftColorLine'>"+swiftpassGrossFee+"</span></p></span>";
					};
					if($.inArray(4, checkedPayType) != -1){
						baiduGrossCount = data.baiDuPayCount == null ? 0 : data.baiDuPayCount;
						baiduGrossFee = data.baiDuTotalFee == null ? 0 : data.baiDuTotalFee/100;
						html += "<td class='borderL baiduColor'><span>金额</span></td><td class='baiduColor'>笔数</td>";	
						tableTitleTh += "<th class='payTitle' colspan='2'>百度钱包支付</th>";
						collect += "<span class='collectPay'><p>百度钱包笔数</p><p class='baiduColor'><span>"+baiduGrossCount+"</span></p><p>百度钱包金额</p><p class='baiduColor'><span class='baiduColorLine'>"+baiduGrossFee+"</span></p></span>";				
					};
					if($.inArray(3, checkedPayType) != -1){
						spdbGrossCount = data.spdbPayCount == null ? 0 : data.spdbPayCount;
						spdbGrossFee = data.spdbTotalFee == null ? 0 : data.spdbTotalFee/100;
						html += "<td class='borderL pufaColor'><span>金额</span></td><td class='pufaColor'>笔数</td>";
						tableTitleTh += "<th class='payTitle' colspan='2'>浦发银行支付</th>";
						collect += "<span class='collectPay'><p>浦发银行笔数</p><p class='pufaColor'><span>"+spdbGrossCount+"</span></p><p>浦发银行金额</p><p class='pufaColor'><span class='pufaColorLine'>"+spdbGrossFee+"</span></p></span>";				
					};
					var summations = (aliGrossFee + wechatGrossFee + spdbGrossFee + baiduGrossFee + swiftpassGrossFee).toFixed(2);
					if(summations == 0){
						summations = 0;
					};	
					html += "<td class='borderL totalColor'><span>金额</span></td><td class='totalColor'>笔数</td></tr>";
					tableTitleTh += "<th class='payTitle' colspan='2'>支付总计</th>";
					collect += "<span class='collectPayTotal'><p>总笔数</p><p class='totalColor'><span>"+(wechatGrossCount+aliGrossCount+baiduGrossCount+spdbGrossCount+swiftpassGrossCount)+"</span></p><p>总金额</p><p class='totalColor'><span class='totalColorLine'>"+summations+"</span></p></span>";	
					$("#collectValue").html(collect);
					$("#tableTitleTh").html(tableTitleTh);
					//单行
					for(var i = count; i < (pageSize*pageNum); i++) {
						var weixinTotalCount = 0,weixinTotalFee = 0,aliTotalCount = 0,alipayTotalFee = 0;
						var spdbTotalCount = 0,spdbTotalFee = 0,baiduTotalCount = 0,baiduTotalFee = 0,swiftTotalCount = 0,swiftTotalFee = 0;					
						if(countBy == "M"){
							var timer = moment(endDate).subtract('month', i).format('YYYY-MM');
						}else if(countBy =="D"){
							var timer = moment(endDate).subtract('day', i).format('YYYY-MM-DD');
						};
						for(var k=0; k<len;k++){
							if(value[k].createdTime == timer){
								var paymentList = value[k].paymentStatisticsList;
								var paymentLen = value[k].paymentStatisticsList.length;
								for(var m=0;m<paymentLen;m++){
									if(paymentList[m].payTypeEnum == "WXPAY"){
										weixinTotalCount = paymentList[m].payCount;
										weixinTotalFee = paymentList[m].payFee/100;
									};
									if(paymentList[m].payTypeEnum == "ALIPAY"){
										aliTotalCount = paymentList[m].payCount;
										alipayTotalFee = paymentList[m].payFee/100;
									};
									if(paymentList[m].payTypeEnum == "SPDB"){
										spdbTotalCount = paymentList[m].payCount;
										spdbTotalFee = paymentList[m].payFee/100;
									};
									if(paymentList[m].payTypeEnum == "BAIDU"){
										baiduTotalCount = paymentList[m].payCount;
										baiduTotalFee = paymentList[m].payFee/100;
									};
									if(paymentList[m].payTypeEnum == "SWIFTPASS"){
										swiftTotalCount = paymentList[m].payCount;
										swiftTotalFee = paymentList[m].payFee/100;
									};									
								}
							}
						};						
						html += "<tr class='boderBot'><td><a onclick='deviceSummary(\"" + timer +"^&^"+ pageNum+"\")' href='javascript:void(0);' title='点击查看"+timer+"的设备支付记录'>" + timer + "</a></td>";
						html += "<td><a onclick='deviceSummary(\"" + timer +"^&^"+ pageNum+"\")' href='javascript:void(0);' title='点击查看"+timer+"的设备支付记录'>" + customerNames + "</a></td>";					
						if($.inArray(1, checkedPayType) != -1){
							var totalWeixin = weixinTotalCount;
							var feeWeixin = weixinTotalFee;
							html += "<td class='borderL'>"+weixinTotalFee+"</td><td>"+weixinTotalCount+"</td>";												
						}else{
							var totalWeixin = 0;
							var feeWeixin = 0;
						};
						if($.inArray(2, checkedPayType) != -1){
							var totalAli = aliTotalCount;
							var feeAli = alipayTotalFee;
							html += "<td class='borderL'>"+alipayTotalFee+"</td><td>"+aliTotalCount+"</td>";						
						}else{
							var totalAli = 0;
							var feeAli = 0;
						};
						if($.inArray(11, checkedPayType) != -1){
							var totalSwift = swiftTotalCount;
							var feeSwift = swiftTotalFee;
							html += "<td class='borderL'>"+swiftTotalFee+"</td><td>"+swiftTotalCount+"</td>";						
						}else{
							var totalSwift = 0;
							var feeSwift = 0;
						};
						if($.inArray(4, checkedPayType) != -1){
							var totalBaidu = baiduTotalCount;
							var feeBaidu = baiduTotalFee;
							html += "<td class='borderL'>"+baiduTotalFee+"</td><td>"+baiduTotalCount+"</td>";						
						}else{
							var totalBaidu = 0;
							var feeBaidu = 0;
						};
						if($.inArray(3, checkedPayType) != -1){
							var totalPufa = spdbTotalCount;
							var feePufa = spdbTotalFee;
							html += "<td class='borderL'>"+spdbTotalFee+"</td><td>"+spdbTotalCount+"</td>";							
						}else{
							var totalPufa = 0;
							var feePufa = 0;
						};
						var summation = (feeWeixin + feeAli + feeSwift + feeBaidu + feePufa).toFixed(2);
						if(summation == 0){
							summation = 0;
						};
						html += "<td class='borderL'>"+summation+"</td><td>"+(totalWeixin + totalAli + totalSwift + totalBaidu + totalPufa)+"</td></tr>";
						if(startDate >= timer){
							break;
						};
					}
					$("#tableValue tbody").html(html);					
									
					$.each($("#collectValue p"), function(key,value) {
						if($(value).text() == "0"){
							$(value).text("--");
						}
					});
					$.each($("#tableValue tbody td"), function(key,value) {
						if($(value).text() == "0"){
							$(value).html("-");
							$(value).css("color","#ccc");
						}
					});
					totalCount = num + 1;
					var fn = "searchcustomerBill";
					var pagination_html = paging(totalCount,pageSize,pageNum,fn)				
					$("#pagination").html(pagination_html);
					$("#export").removeClass("hidden");	
				} else {					
					$("#billSummary").addClass("hide");
					$("#billEmpty").removeClass("hide");
					var ms =result.message;
					ToolTipTop.Show(ms,"error");
				}
			},
			error: function(msg) {
				ToolTipTop.Show("加载超时","error");
				
				$("#billSummary").addClass("hide");
				$("#billEmpty").removeClass("hide");
			}
		})
	}
};
/*
 * 跳转，存储参数
 */
function deviceSummary(data){
	var countBy = $("#summaryType").val();
	var timer = data.split("^&^")[0];
	var pageNum = data.split("^&^")[1];
	var customerId = $("#cusId").val();
	var dates = $("#searchDateRange").text();
	var summaryType = $("#summaryType").val();
	var checkedPayType = $("#payType").data("payType");
	var commonArr = [];
	$.each($("input[name='payItem']"),function(i,value){
		commonArr.push(Number($(value).val()));
	});
	var cache = {
		"dates":dates,
		"summaryType":summaryType,
		"pageNum":pageNum,
		"checkPayType":checkedPayType,
		"payType":commonArr,
		"customerId":customerId,
		"billSummary":"billSummary"
	};
	sessionStorage.setItem("cache",JSON.stringify(cache));
	var treeId = $("#cusId").find("option:selected").data("treeid");
	var data={
		"customerId":customerId,
		"startDate":timer,
		"endDate":timer,			
		"countBy":countBy,
		"treeId":treeId,
		"operateType":"byCustomer"
	};			
	$.ajax({
        type: "GET",
        url: '/statistics/getPayType/query',
        data: data,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
        	isSuccessCode(result.code);	        	
            if (result.code == 200) {
                var data = result.data.payTypeList;
                var payType = [];
			    for(var i in data){
			    	if(data[i] != null){
			    		payType.push(data[i]["id"]);
			    	};
			    };    
			    if(payType.length > 0){
					var parameter = {
						"deviceBillSummary":"customerId=" + customerId + "&treeId=" + treeId + "&timer=" + timer + "&payType=" + payType
					};
					parameter = JSON.stringify(parameter);
					sessionStorage.setItem("parameter",parameter);
					window.location.href = "/data/index.html#deviceBillSummary";					
				}else{
					ToolTipTop.Show("该日期下暂无支付数据","error",3000);
				}
                
            }else{
            	var ms =result.message;          
				ToolTipTop.Show(ms,"error");
			}
		},
		error: function(msg) {
			ToolTipTop.Show("加载超时","error");
		}
    })
}

/*
 * 按设备查询
 */
function searchDeviceBill(pageIndex){
	$("#export").addClass("hidden");	
	var serialNum = $("#queryDeviceId").val();		
	var pageNum = pageIndex;
	var loginUserId = sessionStorage.getItem("id");
	var countBy = $("#summaryType").val();
	var searchDateRange = $("#searchDateRange").text();
	var customerId = $("#cusId").val();
	var treeId = $("#cusId").find("option:selected").data("treeid");	
	var num = null;
	var pageSize = 15;
	if(countBy == "M"){
		var startDate = searchDateRange.substring(0,7);
		var endDate  = searchDateRange.substring(10,17);
		for(var i = 0; i < 15;i++){
			var timer = moment(endDate).subtract('month', i);
			if(moment(startDate) >= moment(timer)){
				num = i;
				break;
			}
		}
	}else if(countBy =="D"){
		var startDate = searchDateRange.substring(0,10);
		var endDate  = searchDateRange.substring(13,23);
		for(var i = 0; i < 35;i++){
			var timer = moment(endDate).subtract('day', i);
			if(moment(startDate) >= moment(timer)){
				num = i;
				break;
			}
		}
	};	
	var checkedPayType = $("#payType").data("payType");
	var payType = JSON.stringify(checkedPayType).replace("[","").replace("]","").replace(/,/g,"_");
	if(checkedPayType == ""){		
		$("#billSummary").addClass("hide");
		$("#billEmpty").removeClass("hide");
	} else {	
		$("#billSummary").removeClass("hide");
		$("#billEmpty").addClass("hide");
		if(checkedPayType.length == 3){
			$("#tableValue").css("width","1120px");
		}else if(checkedPayType.length == 4){
			$("#tableValue").css("width","1310px");
		}else if(checkedPayType.length == 5){
			$("#tableValue").css("width","1510px");
		}else{
			$("#tableValue").css("width","auto");
		};
		var data={
			"customerId":customerId,
			"treeId":treeId,
			"loginUserId":loginUserId,
			"serialNum":serialNum,
			"startDate":startDate,
			"endDate":endDate,
			"payType":payType,
			"countBy":countBy
		}
		$.ajax({
			type: "get",
			url: '/statistics/device/query',
			contentType: "application/json",
			dataType: 'json',
			data:data,
			async: false,
			beforeSend:loading,
			success: function(result) {
				isSuccessCode(result.code);					
				if(result.code == 200){
					var tableTitleTh = "<th style='width: 100px;'>时间</th><th style='width: 220px;'>商户名称</th><th style='width: 150px;'>设备编号</th>";
					var html = "<tr id='tableTitleTr'><td></td><td></td><td></td>";
					var collect = "";				
					var data = result.data;
					var aliPayCount = 0,aliPayTotalFee = 0,wechatPayCount = 0,wechatTotalFee = 0,spdbPayCount = 0,spdbPayTotalFee = 0,baiDuPayCollect = 0,baiDuTotalFeeCollect = 0,swiftPayCollect = 0,swiftTotalFee = 0;
					var customerNames = data.customerName;
					var deviceType = data.deviceType;
					deviceType = searchDeviceType(deviceType);
					var count = pageSize*(pageNum-1);
					var len = data.pair.value.length;
					var value = data.pair.value;
					
					//计算总计
					for(var j = 0;j<len;j++){
						var paymentList = value[j].paymentStatisticsList;
						var paymentLen = value[j].paymentStatisticsList.length;
						for(var m=0;m<paymentLen;m++){
							if(paymentList[m].payTypeEnum == "WXPAY"){
								wechatPayCount += paymentList[m].payCount;
								wechatTotalFee += paymentList[m].payFee/100;
							};
							if(paymentList[m].payTypeEnum == "ALIPAY"){
								aliPayCount += paymentList[m].payCount;
								aliPayTotalFee += paymentList[m].payFee/100;
							};
							if(paymentList[m].payTypeEnum == "SPDB"){
								spdbPayCount += paymentList[m].payCount;
								spdbPayTotalFee += paymentList[m].payFee/100;
							};
							if(paymentList[m].payTypeEnum == "BAIDU"){
								baiDuPayCollect += paymentList[m].payCount;
								baiDuTotalFeeCollect += paymentList[m].payFee/100;
							};
							if(paymentList[m].payTypeEnum == "SWIFTPASS"){
								swiftPayCollect += paymentList[m].payCount;
								swiftTotalFee += paymentList[m].payFee/100;
							};
						};
					}				
					if($.inArray(1, checkedPayType) != -1){
						var devTotalWeixin = wechatPayCount;
						var devFeeWeixin = wechatTotalFee;
						tableTitleTh += "<th class='payTitle' colspan='2'>微信支付</th>";
						html += "<td class='borderL weixinColor'><span>金额</span></td><td class='weixinColor'>笔数</td>";
						collect += "<span class='collectPay'><p>微信笔数</p><p class='weixinColor'><span>"+wechatPayCount+"</span></p><p>微信金额</p><p class='weixinColor'><span class='weixinColorLine'>"+wechatTotalFee+"</span></p></span>";
					}else{
						var devTotalWeixin = 0;
						var devFeeWeixin = 0;
					};
					if($.inArray(2, checkedPayType) != -1){
						var devTotalAli = aliPayCount;
						var devFeeAli = aliPayTotalFee;
						tableTitleTh += "<th class='payTitle' colspan='2'>支付宝支付</th>";
						html += "<td class='borderL aliColor'><span>金额</span></td><td class='aliColor'>笔数</td>";
						collect += "<span class='collectPay'><p>支付宝笔数</p><p class='aliColor'><span>"+aliPayCount+"</span></p><p>支付宝金额</p><p class='aliColor'><span class='aliColorLine'>"+aliPayTotalFee+"</span></p></span>";				
					}else{
						var devTotalAli = 0;
						var devFeeAli = 0;
					};
					if($.inArray(11, checkedPayType) != -1){
						var devTotalSwift = swiftPayCollect;
						var devFeeSwift = swiftTotalFee;
						tableTitleTh += "<th class='payTitle' colspan='2'>威富通支付</th>";
						html += "<td class='borderL swiftColor'><span>金额</span></td><td class='swiftColor'>笔数</td>";
						collect += "<span class='collectPay'><p>威富通笔数</p><p class='swiftColor'><span>"+swiftPayCollect+"</span></p><p>威富通金额</p><p class='swiftColor'><span class='swiftColorLine'>"+swiftTotalFee+"</span></p></span>";
					}else{
						var devTotalSwift = 0;
						var devFeeSwift = 0;
					};
					if($.inArray(4, checkedPayType) != -1){
						var devTotalBaidu = baiDuPayCollect;
						var devFeeBaidu = baiDuTotalFeeCollect;
						tableTitleTh += "<th class='payTitle' colspan='2'>百度钱包支付</th>";
						html += "<td class='borderL baiduColor'><span>金额</span></td><td class='baiduColor'>笔数</td>";
						collect += "<span class='collectPay'><p>百度钱包笔数</p><p class='baiduColor'><span>"+baiDuPayCollect+"</span></p><p>百度钱包金额</p><p class='baiduColor'><span class='baiduColorLine'>"+baiDuTotalFeeCollect+"</span></p></span>";				
					}else{
						var devTotalBaidu = 0;
						var devFeeBaidu = 0;
					};
					if($.inArray(3, checkedPayType) != -1){
						var devTotalPufa = spdbPayCount;
						var devFeePufa = spdbPayTotalFee;
						tableTitleTh += "<th class='payTitle' colspan='2'>浦发银行支付</th>";
						html += "<td class='borderL pufaColor'><span>金额</span></td><td class='pufaColor'>笔数</td>";
						collect += "<span class='collectPay'><p>浦发银行笔数</p><p class='pufaColor'><span>"+spdbPayCount+"</span></p><p>浦发银行金额</p><p class='pufaColor'><span class='pufaColorLine'>"+spdbPayTotalFee+"</span></p></span>";				
					}else{
						var devTotalPufa = 0;
						var devFeePufa = 0;
					};
					var summations = (devFeeWeixin + devFeeAli + devFeeSwift + devFeeBaidu + devFeePufa).toFixed(2);
					if(summations == 0){
						summations = 0;
					}
					tableTitleTh += "<th class='payTitle' colspan='2'>支付总计</th>";
					html += "<td class='borderL totalColor'><span>金额</span></td><td class='totalColor'>笔数</td></tr>";
					collect += "<span class='collectPayTotal'><p>总笔数</p><p class='totalColor'><span>"+(devTotalWeixin + devTotalAli + devTotalSwift + devTotalBaidu + devTotalPufa) +"</span></p><p>总金额</p><p class='totalColor'><span class='totalColorLine'>"+summations+"</span></p></span>";																				
					$("#collectValue").html(collect);
					$("#tableTitleTh").html(tableTitleTh);				
					
					//单条计算				
					for(var i = count; i < (pageSize*pageNum); i++) {
						var weixinTotalCount = 0,weixinTotalFee = 0,aliTotalCount = 0,alipayTotalFee = 0,spdbTotalCount = 0,spdbTotalFee = 0,baiDuTotalFee = 0,baiDuPayCount = 0,swiftpassTotalFee = 0,swiftpassPayCount = 0;
						if(countBy == "M"){
							var timer = moment(endDate).subtract('month', i).format('YYYY-MM');
						}else if(countBy =="D"){
							var timer = moment(endDate).subtract('day', i).format('YYYY-MM-DD');;
						};
						for(var k=0; k<len;k++){
							if(value[k].createdTime == timer){
								var paymentList = value[k].paymentStatisticsList;
								var paymentLen = value[k].paymentStatisticsList.length;
								for(var m=0;m<paymentLen;m++){
									if(paymentList[m].payTypeEnum == "WXPAY"){
										weixinTotalCount += paymentList[m].payCount;
										weixinTotalFee += paymentList[m].payFee/100;
									};
									if(paymentList[m].payTypeEnum == "ALIPAY"){
										aliTotalCount += paymentList[m].payCount;
										alipayTotalFee += paymentList[m].payFee/100;
									};
									if(paymentList[m].payTypeEnum == "SPDB"){
										spdbTotalCount += paymentList[m].payCount;
										spdbTotalFee += paymentList[m].payFee/100;
									};
									if(paymentList[m].payTypeEnum == "BAIDU"){
										baiDuPayCount += paymentList[m].payCount;
										baiDuTotalFee += paymentList[m].payFee/100;
									};
									if(paymentList[m].payTypeEnum == "SWIFTPASS"){
										swiftpassPayCount += paymentList[m].payCount;
										swiftpassTotalFee += paymentList[m].payFee/100;
									};									
								};							
							}
						};					
						html += "<tr class='boderBot'><td>" + timer + "</td>";
						html += "<td>" + customerNames + "</td>";
						html += "<td>" + serialNum + "</td>";	
						if($.inArray(1, checkedPayType) != -1){
							var tiTotalWeixin = weixinTotalCount;
							var tiFeeWeixin = weixinTotalFee;
							html += "<td class='borderL'>"+weixinTotalFee+"</td><td>"+weixinTotalCount+"</td>";
						}else{
							var tiTotalWeixin = 0;
							var tiFeeWeixin = 0;
						};
						if($.inArray(2, checkedPayType) != -1){
							var tiTotalAli = aliTotalCount;
							var tiFeeAli = alipayTotalFee;
							html += "<td class='borderL'>"+alipayTotalFee+"</td><td>"+aliTotalCount+"</td>";			
						}else{
							var tiTotalAli = 0;
							var tiFeeAli = 0;
						};
						if($.inArray(11, checkedPayType) != -1){
							var tiTotalSwift = swiftpassPayCount;
							var tiFeeSwift = swiftpassTotalFee;
							html += "<td class='borderL'>"+swiftpassTotalFee+"</td><td>"+swiftpassPayCount+"</td>";			
						}else{
							var tiTotalSwift = 0;
							var tiFeeSwift = 0;
						};
						if($.inArray(4, checkedPayType) != -1){
							var tiTotalBaidu = baiDuPayCount;
							var tiFeeBaidu = baiDuTotalFee;
							html += "<td class='borderL'>"+baiDuTotalFee+"</td><td>"+baiDuPayCount+"</td>";
						}else{
							var tiTotalBaidu = 0;
							var tiFeeBaidu = 0;
						};
						if($.inArray(3, checkedPayType) != -1){
							var tiTotalPufa = spdbTotalCount;
							var tiFeePufa = spdbTotalFee;
							html += "<td class='borderL'>"+spdbTotalFee+"</td><td>"+spdbTotalCount+"</td>";	
						}else{
							var tiTotalPufa = 0;
							var tiFeePufa = 0;
						};
						var summation = (tiFeeWeixin + tiFeeAli + tiFeeSwift + tiFeeBaidu + tiFeePufa).toFixed(2);
						if(summation == 0){
							summation = 0;
						}
						html += "<td class='borderL'>"+summation+"</td><td>"+(tiTotalWeixin + tiTotalAli + tiTotalSwift + tiTotalBaidu + tiTotalPufa)+"</td></tr>";										
						if(startDate >= timer){
							break;
						}
					}								
					$("#tableValue tbody").html(html);					
					$.each($("#collectValue p"), function(key,value) {
						if($(value).text() == "0"){
							$(value).text("--");						
						}
					});
					$.each($("#tableValue tbody td"), function(key,value) {
						if($(value).text() == "0"){
							$(value).text("-");
							$(value).css("color","#ccc");
						}
					});				
					totalCount = num + 1;
					var fn = "searchDeviceBill";
					var pagination_html = paging(totalCount,pageSize,pageNum,fn)				
					$("#pagination").html(pagination_html);
				} else {
					$("#tableValue tbody").html("<tr><td colspan='8' style='text-align:center;'>查询不到数据！</td></tr>");
					$("#pagination").html("");
					var ms =result.message;
					ToolTipTop.Show(ms,"error");
				}
			},
			error: function(msg) {
				ToolTipTop.Show("加载超时","error");
			}
		})
	}
}

/*
 * 按回车查询
 */
var funcRef = function(evt){
    evt = evt || window.event;
    if (evt.keyCode==13){
    	var queryDeviceId = $("#queryDeviceId").val();	
		if(queryDeviceId == ""){
			searchcustomerBill(1);
		}else{
			searchDeviceBill(1);			
		}
    }
}
window.onkeydown = funcRef;

/*
 * AJAX加载等待函数
 */
function loading(){
	$("#tableDiv tbody").html("<tr><td colspan='7' style='text-align:center;'>正在加载数据........</td></tr>");
}

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
            	var readCache = sessionStorage.getItem("readCache");
				if(readCache == 1){
					var cacheValue =  sessionStorage.getItem("cache");
					cacheValue = JSON.parse(cacheValue);
					if(cacheValue.billSummary == "billSummary"){
						var customerId = cacheValue.customerId;
						for (var i = 0; i < customerList.length; i++) {
		                	if(len > customerList[i].treeId.length){
		                		len = customerList[i].treeId.length;
		                	};
		                }
						for (var i = 0; i < customerList.length; i++) {
		                   if(customerList[i].id == customerId){
			                   	var num = (customerList[i].treeId.length - len)/4;
			                    html += "<option data-type='"+ customerList[i].type +"' data-treeid='"+ customerList[i].treeId +"' value='" + customerList[i].id + "'>" + blankReturn(num) + customerList[i].name + "</option>";
		                   }
		                }
		                for (var i = 0; i < customerList.length; i++) { 
		                   	if(customerList[i].id != customerId){
			                   	var num = (customerList[i].treeId.length - len)/4;
			                    html += "<option data-type='"+ customerList[i].type +"' data-treeid='"+ customerList[i].treeId +"' value='" + customerList[i].id + "'>" + blankReturn(num) + customerList[i].name + "</option>";
		                   }
		                }		                		                
					}else{
						for (var i = 0; i < customerList.length; i++) {
		                	if(len > customerList[i].treeId.length){
		                		len = customerList[i].treeId.length;
		                	};
		                }
		                for (var i = 0; i < customerList.length; i++) { 
		                   	var num = (customerList[i].treeId.length - len)/4;
		                    html += "<option data-type='"+ customerList[i].type +"' data-treeid='"+ customerList[i].treeId +"' value='" + customerList[i].id + "'>" + blankReturn(num) + customerList[i].name + "</option>";
		                }
					}			
				}else{
					for (var i = 0; i < customerList.length; i++) {
	                	if(len > customerList[i].treeId.length){
	                		len = customerList[i].treeId.length;
	                	};
	                }
	                for (var i = 0; i < customerList.length; i++) { 
	                   	var num = (customerList[i].treeId.length - len)/4;
	                    html += "<option data-type='"+ customerList[i].type +"' data-treeid='"+ customerList[i].treeId +"' value='" + customerList[i].id + "'>" + blankReturn(num) + customerList[i].name + "</option>";
	                }
				}
                
            };
            $("#cusId").html(html);
			$("#cusId").selectpicker({
			    liveSearch: 'true',
			    width:"230px"
			});
			$('#cusId').selectpicker('setStyle', 'selectStyle', 'add');
			$(".selectStyle").css({"padding-top":"5px","padding-bottom":"5px"});
			$(".selectStyle").parent().css({"height":"32px","float":"left"});
			$(".selectStyle").parent().find("ul").css("position","none");
			$(".selectStyle").parent().find("ul").find("span").removeClass("glyphicon-ok");
			setVagueSearch();
			billSearch();
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

/*
 * 设备类型返回
 */
function searchDeviceType(value){
	var model = null;
	if(value == 1){
		model = "RC";
	}else if(value == 2){
		model = "基础版";
	}else if(value == 3){
		model = "兼容版";
	}else if(value == 4){
		model = "加强版";
	}else{
		model = "未知类型";
   };
    return model;
}
//按月汇总设置时间
function monthSummary(flag){
	if(flag != 1){
    	$('#reportrange span').html(moment().format('YYYY-MM') + ' - ' + moment().format('YYYY-MM'));
    }
	$('#reportrange').daterangepicker(
		{
			//startDate: '2016-12-14',
			//endDate: moment(),
			minDate: '2012-01-01',	//最小时间
			maxDate : moment(), //最大时间 
			dateLimit : {
				months : 11
			}, //起止时间的最大间隔
			showDropdowns : true,
			showWeekNumbers : false, //是否显示第几周
			timePicker : false, //是否显示小时和分钟
			timePickerIncrement : 60, //时间的增量，单位为分钟
			timePicker12Hour : false, //是否使用12小时制来显示时间
			ranges : {
				//'最近1小时': [moment().subtract('hours',1), moment()],
				//'本月': [moment(), moment()],
	            '最近3个月': [moment().subtract('month', 2).startOf('day'), moment()],
	            '最近6个月': [moment().subtract('month', 5), moment()],
	            '最近1年': [moment().subtract('month', 11), moment()]
			},
			opens : 'right', //日期选择框的弹出位置
			buttonClasses : [ 'btn btn-default' ],
			applyClass : 'btn-small btn-primary blue',
			cancelClass : 'btn-small',
			format : 'YYYY-MM', //控件中from和to 显示的日期格式
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
	     	$('#reportrange span').html(start.format('YYYY-MM') + ' - ' + end.format('YYYY-MM'));
	     	getPayType();
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
};
//按天汇总设置时间
function daySummary(flag){
	if(flag != 1){
    	$('#reportrange span').html(moment().format('YYYY-MM-DD') + ' - ' + moment().format('YYYY-MM-DD'));
   	}	
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
	     	getPayType();
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
};		

