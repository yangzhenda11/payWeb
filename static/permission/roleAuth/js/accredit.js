var globalNum = 0;
$(function() {
	setSystemHeight();
	getSystemList();
	setRoleName();
	$('#copyModal').modal({show:false,backdrop:'static'});
});
/*
 * 全选反选
 */
function checkAllFunctionCode(){
	if ($("#checkAllAddFunction").prop('checked')) {
        $("#functionTable input[name='check']").prop('checked', true);
    } else {
        $("#functionTable input[name='check']").prop('checked', false);
    }
};
/*
 * 权限复制弹窗
 */
 function accreditCopy(){
	$('#copyModal').modal();
 }
 /*
  * 确认复制授权
  */
 function confirmCopy(){
 	Messager.confirm({Msg: '确认复制该角色下的权限?', title: '复制权限'}).on(function (flag) {
        if (flag) {
        	var parameter = sessionStorage.getItem("parameter");
			parameter = JSON.parse(parameter).accredit;
			if(parameter == null){
				ToolTipTop.Show("参数错误","error");
			}else{
				var roleId = parameter.split("^&^")[0];						
//		      	var data={
//		     		"roleId":roleId
//		    	};
//		     	data = JSON.stringify(data);
//				$.ajax({
//					type: "POST",
//					url: '/role/deletes',
//					data: data,
//					contentType: "application/json",
//					dataType: 'json',
//					success: function(result) {
//						isSuccessCode(result.code);
//						if(result.code == 200) {
							var fn = "$('#copyModal').modal('hide');window.location.reload()";						
		                	Messager.show({Msg: "复制权限成功", isModal: false,isHideDate: 1500,callbackfn:fn});
//						} else {
//							var ms = result.message;
//							setTimeout(function () {
//			                	Messager.show({Msg: ms,iconImg: 'warning', isModal: false});
//			                }, 500);
//							
//						}
//					}
//				});
			}
        }        
    });	
}
/*
 * 设置角色名称
 */
function setRoleName(){
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).accredit;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}else{
		var roleName = parameter.split("^&^")[1]+"角色授权";
		$("#roleName").text(roleName);
	}
}
/**
 * 授权
 */
$("#affirmAccredit").on("click",function(){
	var checkedAddFunctionList = [];
    var i = 0;
    var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).accredit;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}else{
		var roleId = parameter.split("^&^")[0];
	}
	var loginUserId = sessionStorage.getItem("id");
	var menuCode = $(".checkMenu").data("code");
	if($(".checkMenu").parent().parent().hasClass("systemCode")){
		var topBarCode = $(".checkMenu").parent().parent().data("code");
	}else if($(".checkMenu").parent().parent().parent().parent().hasClass("systemCode")){
		var topBarCode = $(".checkMenu").parent().parent().parent().parent().data("code");
	}
    $('#functionTable input[name="check"]:checked').each(function () {
        checkedAddFunctionList[i] = ($(this).data("code"));
        i++;
    });      
	data = {
		"roleId":roleId,
    	"menuCode":menuCode,
    	"topBarCode":topBarCode,
    	"functionCodes":checkedAddFunctionList
    }
    data = JSON.stringify(data);
	$.ajax({
        type: "post",
        url: '/permissionFunction/modify',
        data: data,
        beforeSend:loading,
        contentType: "application/json",
        dataType: 'json',
        async: false,
        success: function (result) {
        	loadClose();
            if (result.code == 200) {
            	ToolTipTop.Show("授权成功","success");
                getMenuFunction();                
            } else {
            	var ms = result.message;
                ToolTipTop.Show(ms,"error");
            }
        }
    })
})
/**
 * 导航收缩功能引用
 */
function treedropdown(){
	$("#systemContent").treemenu({delay:300}).openActive();
}
//获取系统菜单
function getSystemList(){
	var obj = new Object();
	var loginUserId = sessionStorage.getItem("id");
	obj.loginUserId = loginUserId;
	$.ajax({
		type: "GET",
		url: '/topBar/list',
		contentType: "application/json",
		data:obj,
		dataType: 'json',
		async: false,
		success: function(result) {
			isSuccessCode(result.code);
			var data = result.data;
			var step = data.length;
			if(result.code == 200 && data.length > 0) {
				var html = "";
				for(var i = 0; i < data.length; i++) {
					html += "<li data-code="+data[i].topBarCode+" class='systemCode'>"+data[i].topBarName+"</li>";
					var code = data[i].topBarCode;
					query(code,step);
				}				
				$("#systemContent").html(html);
				
			} else {
				var html = "<li class='empty'>查询不到数据</li>";
				$("#systemContent").html(html);
			}
		},
		error: function(msg) {
			ToolTipTop.Show("加载超时","error");
		}
	});
}
//获取系统下的菜单
function query(code,step) {
	var obj = new Object();
	var topBarCode = code;
	var loginUserId = sessionStorage.getItem("id");
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).accredit;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}else{
		var roleId = parameter.split("^&^")[0];;
		obj.userId = loginUserId;
		obj.needRoot = "no";
		obj.topBarCode = topBarCode;
		obj.roleId = roleId;
		$.ajax({
			type: "GET",
			url: '/menu/permission/query',
			contentType: "application/json",
			data:obj,
			beforeSend:loading,
			dataType: 'json',
			success: function(result) {
				loadClose();
				isSuccessCode(result.code);
				var data = result.data;
				var navHtml = "";
				for(var key in data){
	        		if(data[key].parentId == -1){
	        			num = 0;
	        			for(var k in data){
	        				if(data[key].menuCode == data[k].parentId){
	        					num++;
	        				}
	        			}
	        			if(num == 0){
	        				navHtml += "<li class='menuCode' data-code="+data[key].menuCode+">"+data[key].menuName+"</li>";
	        			}else if(num > 0){
	        				navHtml += "<li data-code="+data[key].menuCode+">"+data[key].menuName+"<ul>";
	        				for(var k in data){
		        				if(data[key].menuCode == data[k].parentId){
		        					navHtml += "<li class='menuCode' data-code="+data[k].menuCode+">"+data[k].menuName+"</li>"
		        				}
		        			}
	        				navHtml += "</ul></li>";
	        			}
	        		}
	        	};			
				if(navHtml != ""){
					navHtml = "<ul>"+navHtml+"</ul>";
					$("li[data-code="+code+"]").append(navHtml);
				}else{
					$("li[data-code="+code+"]").remove();
				};			
				globalNum ++;
				if(step == globalNum){
					treedropdown();
					setFirstStyle();
					systemListSwitch();				
					getMenuFunction();
				}
			}		
		});
	}	
}
//列表切换
function systemListSwitch(){
	$(".menuCode").click(function(){
		$("#systemContent li").removeClass("checkMenu")
		$(this).addClass("checkMenu");
		getMenuFunction();
	});
	$(".systemCode>span").click(function(){
		$(".systemCode").removeClass("tree-opened").addClass("tree-closed");
		$(".systemCode>ul").css({"display":"none"});
		$(this).parent().removeClass("tree-closed").addClass("tree-opened");
		$(this).next().css({"display":"block"});
	});
}
//设置高度
function setSystemHeight(){
	var height = $(".rightContainer").height()-74;
	$(".systemDiv").css({"height":height,"overflow":"auto"});
}
//获取系统功能
function getMenuFunction(){
	var obj = new Object();
	var functionName = $("#functionNameSearch").val();
	var loginUserId = sessionStorage.getItem("id");
	var menuCode = $(".checkMenu").data("code");
    var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).accredit;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	}else{
		var roleId = parameter.split("^&^")[0];;
	};
	if($(".checkMenu").parent().parent().hasClass("systemCode")){
		var topBarCode = $(".checkMenu").parent().parent().data("code");
	}else if($(".checkMenu").parent().parent().parent().parent().hasClass("systemCode")){
		var topBarCode = $(".checkMenu").parent().parent().parent().parent().data("code");
	}
	obj.loginUserId = loginUserId;
	obj.functionName = functionName;
	obj.menuCode = menuCode;
	obj.topBarCode = topBarCode;
	var resultObj = {
		"topBarCode":topBarCode,
		"menuCode":menuCode,
		"roleId":roleId
	}

	$.ajax({
		type: "GET",
		url: '/menuFunction/list',
		data: obj,
		contentType: "application/json",
		dataType: 'json',
		async: false,
		success: function(result) {
			isSuccessCode(result.code);
			var dataList = result.data;
			if(result.data == undefined){
				$("#functionTable tbody").html("<tr ><td colspan='6' style='text-align:center;'>查询不到数据！</td></tr>");
				$("#affirmAccredit").addClass("hidden");
			}else if(result.code == 200 && dataList.length > 0) {
				var html = null;
				$("#affirmAccredit").removeClass("hidden");
				for(var i = 0; i < dataList.length; i++) {
					var functionName = dataList[i].functionName == null ? '' : dataList[i].functionName;
					var functionCode = dataList[i].functionCode == null ? '' : dataList[i].functionCode;
					var description = dataList[i].description == null ? '' : dataList[i].description;
					var status = '';
					if(dataList[i].status == 0) {
						status = '禁用';
					}else if(dataList[i].status == 1){
						status = '启用';
					};
					html += "<tr><td style='text-align:center;'><input type='checkbox'  name='check' data-code='" + dataList[i].functionCode + "'></td>";
					html += "<td style=''>" + functionName + "</td>";
					html += "<td>" + functionCode + "</td>";
					html += "<td>" + description + "</td>";
					html += "<td>" + status + "</td></tr>";
				}
				$("#functionTable tbody").html(html);
				$("#checkAllAddFunction").prop('checked', false);
				$.ajax({
					type: "GET",
					url: '/permissionFunction/search/query',
					data: resultObj,
					contentType: "application/json",
					dataType: 'json',
					async: false,
					success: function(result) {
						isSuccessCode(result.code);
						var datas = result.data;
						for(var i = 0 ;i < datas.length;i++){
							$("#functionTable input[name='check'][data-code="+datas[i]+"]").prop('checked', true);
						}
					}
				});
			}else{
				$("#functionTable tbody").html("<tr ><td colspan='6' style='text-align:center;'>查询不到数据！</td></tr>");
			}
			setSystemHeight();
		}
	})
}
//设置第一个系统列表样式
function setFirstStyle(){
	$("#systemContent .menuCode:first").addClass("checkMenu");
	if($(".checkMenu").parent().parent().hasClass("systemCode")){
		$(".checkMenu").parent().css("display","block");
		$(".checkMenu").parent().parent().removeClass("tree-closed").addClass("tree-opened");
	}else if($(".checkMenu").parent().parent().parent().parent().hasClass("systemCode")){
		$(".checkMenu").parent().parent().removeClass("tree-closed").addClass("tree-opened");
		$(".checkMenu").parent().parent().parent().parent().removeClass("tree-closed").addClass("tree-opened");
		$(".checkMenu").parent().css("display","block");
		$(".checkMenu").parent().parent().parent().css("display","block");
	}	
}
/*
 * 返回
 */
function gobackRole(){
	sessionStorage.setItem("readCache","1");
	window.location.href = "index.html#roleList";
};







