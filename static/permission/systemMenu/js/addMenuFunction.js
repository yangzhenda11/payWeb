$(function() {
	getFunctionList(1);
	$("#addMenuFunction").modal({show:false,backdrop:'static'});
});

$("#addSaveFuncton").on("click",function(){
	var checkedAddFunctionList = [];
    var i = 0;
    var data = {};
    var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).addMenuFunction;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	};
    var menuCode = parameter.split("^&^")[1];
	var topBarCode = parameter.split("^&^")[0];
    $('#addfunctionTable input[name="check"]:checked').each(function () {
        checkedAddFunctionList[i] = ($(this).data("code"));
        i++;
    });
    if(checkedAddFunctionList.length == 0){
    	$('#addMenuFunction').modal('hide');
    }else{
    	data = {
	    	"menuCode":menuCode,
	    	"topBarCode":topBarCode,
	    	"functionCodes":checkedAddFunctionList
	    }
	    data = JSON.stringify(data)
    	$.ajax({
	        type: "post",
	        url: '/menuFunction/add',
	        data: data,
	        contentType: "application/json",
	        dataType: 'json',
	        async: false,
	        success: function (result) {
	            if (result.code == 200) {
	            	ToolTipTop.Show("添加成功","success");
	                $('#addMenuFunction').modal('hide');
	                getFunctionList(1);
	            } else {
	            	var ms = result.message;
	                ToolTipTop.Show(ms,"error");
	            }
	        }
	    })
    }   
});
function addMenuFunction(data){
	$("#addMenuFunction").modal("show");
	var obj = new Object();
	var loginUserId = sessionStorage.getItem("id");
	obj.loginUserId = loginUserId;
	$.ajax({
		type: "GET",
		url: '/function/list',
		data: obj,
		contentType: "application/json",
		dataType: 'json',
		async: false,
		success: function(result) {
			isSuccessCode(result.code);
			var dataList = result.data;
			var vaule = dataList;
			if(result.code == 200 && dataList.length > 0) {
				var html = null;
				if(data != undefined){
					for(var i = 0;i<data.length;i++){
						for(var k = 0; k < vaule.length; k++) {
							if(data[i].functionCode == vaule[k].functionCode){
								dataList.splice(k,1)
							}
						}
					}
				}		
				if(dataList.length>0){
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
						html += "<td>" + status + "</td>";
					}
					$("#addfunctionTable tbody").html(html);
				}else{
					$("#addfunctionTable tbody").html("<tr ><td colspan='5' style='text-align:center;'>查询不到数据！</td></tr>");
				}
				
			}else{
				$("#addfunctionTable tbody").html("<tr ><td colspan='5' style='text-align:center;'>查询不到数据！</td></tr>");
			}
		}
	});
}

//回车搜索
var funcRef = function(evt) {
	evt = evt || window.event;
	if(evt.keyCode == 13) {
		getFunctionList(1);
	}
}
window.onkeydown = funcRef;
//获取系统功能列表
function getFunctionList(pageIndex) {	
	var obj = new Object();
	var functionName = $("#functionNameSearch").val();
	var loginUserId = sessionStorage.getItem("id");
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).addMenuFunction;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	};
    var menuCode = parameter.split("^&^")[1];
	var topBarCode = parameter.split("^&^")[0];
	obj.loginUserId = loginUserId;
	obj.functionName = functionName;
	obj.menuCode = menuCode;
	obj.topBarCode = topBarCode;

	$.ajax({
		type: "GET",
		url: '/menuFunction/list',
		data: obj,
		contentType: "application/json",
		dataType: 'json',
		async: false,
		success: function(result) {
			isSuccessCode(result.code);
			//var data = result.data;
			//var dataList = data.list;
			var dataList = result.data;
			if(result.data == undefined){
				$("#functionTable tbody").html("<tr ><td colspan='6' style='text-align:center;'>查询不到数据！</td></tr>");
				$("#addbtn").on("click",function(){
					addMenuFunction();
				});
			}else if(result.code == 200 && dataList.length > 0) {
				var html = null;
				for(var i = 0; i < dataList.length; i++) {
					var functionName = dataList[i].functionName == null ? '' : dataList[i].functionName;
					var functionCode = dataList[i].functionCode == null ? '' : dataList[i].functionCode;
					var sort = dataList[i].sort == null ? '' : dataList[i].sort;
					var description = dataList[i].description == null ? '' : dataList[i].description;
					var status = '';
					if(dataList[i].status == 0) {
						status = '禁用';
					}else if(dataList[i].status == 1){
						status = '启用';
					};
					var  createdTime = dataList[i].createdTime == null ? '' : getFormatDateByLong(dataList[i].createdTime, "yyyy-MM-dd hh:mm:ss");
					html += "<tr><td style='text-align:center;'>"+(i+1)+"</td>";
					html += "<td style=''>" + functionName + "</td>";
					html += "<td>" + functionCode + "</td>";
					
					html += "<td>" + description + "</td>";
					html += "<td>" + status + "</td>";
					html += "<td style='text-align:center;'><a data-toggle='tooltip' style='cursor:pointer;text-decoration: none;' data-placement='bottom' title='删除此功能' onclick='deleteFunction(\"" + dataList[i].functionCode + "\");'><i class='icon iconfont icon-shanchu operate'></i></a></td></tr>";
				}
				$("#functionTable tbody").html(html);
				$("#addbtn").on("click",function(){
					addMenuFunction(dataList);
				});
//				totalCount = data.listCount;
//				var pageIndex = data.pageIndex;
//				var fn = "getFunctionList";
//				var pagination_html = paging(totalCount,pageSize,pageIndex,fn)				
//				$("#pagination").html(pagination_html);
			} else {
				$("#functionTable tbody").html("<tr ><td colspan='6' style='text-align:center;'>查询不到数据！</td></tr>");
				//$("#pagination").html("");
			}
		},
		error: function(msg) {
			ToolTipTop.Show("加载超时","error");
		}
	});
}
//删除功能
function deleteFunction(id){
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).addMenuFunction;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	};
    var menuCode = parameter.split("^&^")[1];
	var topBarCode = parameter.split("^&^")[0];
	var data = {		
		"topBarCode":topBarCode,
		"menuCode":menuCode,
		"functionCode":id
	}
	data = JSON.stringify(data);
	Messager.confirm({Msg: '确认删除此功能?', title: '删除功能'}).on(function (flag) {
        if (flag) {     	
			$.ajax({
				type: "post",
				url: '/menuFunction/deletes',
				data: data,
				contentType: "application/json",
				dataType: 'json',
				success: function(result) {
					isSuccessCode(result.code);
					if(result.code == 200) {
						ToolTipTop.Show("删除成功","success");						
						getFunctionList(1);
					} else {
						var ms = result.message;
						ToolTipTop.Show(ms,"error");					
					}
				}
			});
        }        
    });
}
function checkAllFunctionCode(){
	if ($("#checkAllAddFunction").prop('checked')) {
        $("#addfunctionTable input[name='check']").prop('checked', true);
    } else {
        $("#addfunctionTable input[name='check']").prop('checked', false);
    }
}

function gobackUrl(){
	sessionStorage.setItem("readCache","1");
	window.location.href = "index.html#menuList";
}
