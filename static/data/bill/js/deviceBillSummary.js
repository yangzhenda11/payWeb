$(function(){
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
 * 支付方式填充
 */
function setParameterPayType(parameter){
	var payType = parameter.split("&")[3].split("=")[1];
	payType = payType.split(",");
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
			if($.inArray(k, payType) != -1){						
				checkboxHtml += '<li><label><input type="checkbox" name="payItem" value="'+k+'" checked=""/>'+commonObj[k]+'</label></li>';
			}
		}				
		$("#payTypeItem").html(checkboxHtml);
	}else{				
		$("#payTypeItem").html("<li style='text-align:center;margin-top:5px;'>暂无支付方式</li>");
	}
	checkAllFn();
	$("#checkAll").prop("checked",false);
	setPayType();
	devicListBill(1);
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
 * 查询
 */
function devicListBill(pageIndex){					
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).deviceBillSummary;
	if(parameter == null){
		Messager.show({Msg: "参数错误",iconImg: 'warning', isModal: false});
	}else{
		var loginUserId = sessionStorage.getItem("id");
		var pageSize = 15;
		var type = $("#queryDeviceType").val();
		var customerId = parameter.split("&")[0].split("=")[1];
		var treeId = parameter.split("&")[1].split("=")[1];
		var days = parameter.split("&")[2].split("=")[1];		
		var serialNum = $("#queryDeviceId").val();
		var checkedPayType = $("#payType").data("payType");		
		var payType = JSON.stringify(checkedPayType).replace("[","").replace("]","").replace(/,/g,"_");	
		var data={
			"loginUserId":loginUserId,
			"pageIndex":pageIndex,
			"pageSize":pageSize,
			"type":type,
			"payType":payType,
			"customerId":customerId,
			"serialNum":serialNum,
			"treeId":treeId
		};		
		if(days.length == 7){
			data.month = days;
		}else if(days.length == 10){
			data.day = days; 
		};		
		if(checkedPayType == ""){		
			$("#deviceBillSummary").addClass("hide");
			$("#billEmpty").removeClass("hide");
		} else {	
			$("#deviceBillSummary").removeClass("hide");
			$("#billEmpty").addClass("hide");
			if(checkedPayType.length == 3){
				$("#tableValue").css("width","1100px");
			}else if(checkedPayType.length == 4){
				$("#tableValue").css("width","1300px");
			}else if(checkedPayType.length == 5){
				$("#tableValue").css("width","1500px");
			}else{
				$("#tableValue").css("width","auto");
			};
			$.ajax({
				type: "get",
				url: '/customerDeviceQuery/pageList',
				contentType: "application/json",
				dataType: 'json',
				data:data,
				async: false,
				beforeSend:loading,
				success: function(result) {
					isSuccessCode(result.code);			
					if(result.code == 200){
						var data = result.data;
						var billList = data.list;
						if(billList != null){
							var html = "<tr id='tableTitleTr'><td></td><td></td><td></td><td></td>";
							var tableTitleTh = "<th style='width: 150px;'>设备编号</th>"+
											"<th style='width: 200px;'>商户名称</th>"+
											"<th style='width: 80px;'>设备类型</th>"+
											"<th style='width: 100px;'>时间</th>";
							if($.inArray(1, checkedPayType) != -1){
								tableTitleTh += "<th class='payTitle' colspan='2'>微信支付</th>";
								html += "<td class='borderL weixinColor'><span>金额</span></td><td class='weixinColor'>笔数</td>";							
							}
							if($.inArray(2, checkedPayType) != -1){
								tableTitleTh += "<th class='payTitle' colspan='2'>支付宝支付</th>";
								html += "<td class='borderL aliColor'><span>金额</span></td><td class='aliColor'>笔数</td>";											
							}
							if($.inArray(11, checkedPayType) != -1){
								tableTitleTh += "<th class='payTitle' colspan='2'>威富通支付</th>";
								html += "<td class='borderL swiftColor'><span>金额</span></td><td class='swiftColor'>笔数</td>";									
							}
							if($.inArray(4, checkedPayType) != -1){
								tableTitleTh += "<th class='payTitle' colspan='2'>百度钱包支付</th>";
								html += "<td class='borderL baiduColor'><span>金额</span></td><td class='baiduColor'>笔数</td>";									
							}
							if($.inArray(3, checkedPayType) != -1){
								tableTitleTh += "<th class='payTitle' colspan='2'>浦发银行支付</th>";
								html += "<td class='borderL pufaColor'><span>金额</span></td><td class='pufaColor'>笔数</td>";										
							}
							tableTitleTh += "<th class='payTitle' colspan='2'>支付总计</th>";
							html += "<td class='borderL totalColor'><span>金额</span></td><td class='totalColor'>笔数</td></tr>";													
							$("#tableTitleTh").html(tableTitleTh);										
							if(billList.length > 0) {						
								for(var i = 0; i < billList.length; i++) {
									var serialNum = billList[i].serialNum;
									var customerName = billList[i].customerName;
									var deviceType = billList[i].deviceType;
									deviceType = determineType(deviceType);
									var day = billList[i].createdTime;
									var weixinTotalCount = 0,weixinTotalFee = 0,aliTotalCount = 0,alipayTotalFee = 0,swiftpassPayCount = 0,swiftpassTotalFee = 0,baiDuPayCount = 0,baiDuTotalFee = 0,spdbTotalCount = 0,spdbTotalFee = 0;
				                    html += "<tr class='boderBot'><td>" + serialNum + "</td>";
									html += "<td>" + customerName + "</td>";
									html += "<td>" + deviceType + "</td>";
									html += "<td>" + day + "</td>";
									var paymentList = billList[i].paymentStatisticsList;
									var paymentLen = billList[i].paymentStatisticsList.length;
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
											baiDuPayCount = paymentList[m].payCount;
											baiDuTotalFee = paymentList[m].payFee/100;
										};
										if(paymentList[m].payTypeEnum == "SWIFTPASS"){
											swiftpassPayCount = paymentList[m].payCount;
											swiftpassTotalFee = paymentList[m].payFee/100;
										};									
									};
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
										var totalSwift = swiftpassPayCount;
										var feeSwift = swiftpassTotalFee;
										html += "<td class='borderL'>"+swiftpassTotalFee+"</td><td>"+swiftpassPayCount+"</td>";						
									}else{
										var totalSwift = 0;
										var feeSwift = 0;
									};
									if($.inArray(4, checkedPayType) != -1){
										var totalBaidu = baiDuPayCount;
										var feeBaidu = baiDuTotalFee;
										html += "<td class='borderL'>"+baiDuTotalFee+"</td><td>"+baiDuPayCount+"</td>";						
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
								}
								$("#tableValue tbody").html(html);											
								$.each($("#tableValue tbody td"), function(key,value) {
									if($(value).text() == "0"){
										$(value).html("-");
										$(value).css("color","#ccc");
									}
								});						
								totalCount = data.listCount;
								var pageIndex = data.pageIndex;
								var fn = "devicListBill";
								var pagination_html = paging(totalCount,pageSize,pageIndex,fn)				
								$("#pagination").html(pagination_html);
							}else{
								$("#tableValue tbody").html("<tr ><td colspan='10' style='text-align:center;'>查询不到数据！</td></tr>");
								$("#pagination").html("");
							}
						}else{
							$("#tableValue tbody").html("<tr ><td colspan='10' style='text-align:center;'>查询不到数据！</td></tr>");
							$("#pagination").html("");
						}
					} else {
						$("#tableValue tbody").html("<tr ><td colspan='10' style='text-align:center;'>查询不到数据！</td></tr>");
						$("#pagination").html("");
						var ms =result.message;
						ToolTipTop.Show(ms,"error");
					}
				},
				error: function(msg) {
					ToolTipTop.Show("加载超时","error");
					$("#tableValue tbody").html("<tr ><td colspan='10' style='text-align:center;'>查询不到数据！</td></tr>");
					$("#pagination").html("");
				}
			})
		}
	}
};

/*
 * 返回跳转
 */
function backBill(){
	sessionStorage.setItem("readCache","1");
	window.location.href = "index.html#billSummary";
}
/*
 * AJAX加载等待函数
 */
function loading(){
	$("#tableValue tbody").html("<tr><td colspan='8' style='text-align:center;'>正在加载数据........</td></tr>");
}
var funcRef = function(evt){
    evt = evt || window.event;
    if (evt.keyCode==13){
        devicListBill(1);
    }
}
window.onkeydown = funcRef;

/*
 * 获取设备类型列表，之后再查询设备
 */
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
            var parameter = sessionStorage.getItem("parameter");
			parameter = JSON.parse(parameter).deviceBillSummary;
			if(parameter == null){
				ToolTipTop.Show("参数错误","error");
			}else{
				setParameterPayType(parameter);				
			}
        }
    });
};
