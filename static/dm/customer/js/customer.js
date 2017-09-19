$(function() {
	isCache("customer",getCustomerList);
	var fnCode = queryFnCode();
	addBtnShow(fnCode);
	var isAdmin = sessionStorage.getItem("isAdmin");
	if(isAdmin == "true"){
		$("#salesNameText,#salesName").removeClass("hidden");
	};
	querySales();
	$("#salesName").on("change",function(){
		getCustomerList(1);
	})
});

var funcRef = function(evt){
    evt = evt || window.event;
    if (evt.keyCode==13){
        getCustomerList(1);
    }
}
window.onkeydown = funcRef;
/*
 * 获取服务商列表
 */
function getCustomerList(pageIndex) {
	var totalCount = 0;
	var pageSize = 15;
	var obj = new Object();
	var name = $("#customerName").val();
	var salesName = $("#salesName").val();
	obj.name = name;
	obj.salesName = salesName;
	obj.pageIndex = pageIndex;
	obj.pageSize = pageSize;
	$.ajax({
		type: "GET",
		url: '/customer/pageList',
		data: obj,
		contentType: "application/json",
		dataType: 'json',
		async: false,
		success: function(result) {
			isSuccessCode(result.code);			
			if(result.code == 200) {
				var customerResult = result.data;
				var customerList = customerResult.list;
				totalCount = customerResult.listCount;
				$(".fontbold").text(totalCount);
				if(customerList.length > 0){					
					var html = '';
	                var fnCode = queryFnCode();
	                var pageNum = result.data.pageIndex;
					for(var i = 0; i < customerList.length; i++) {					
						var data = customerList[i];
						var customerName = data.name == null ? '' : data.name;
	                    var contact = data.contact == null ? '' : data.contact;
	                    var mobile = data.mobile == null ? '' : data.mobile;
	                    var salesName = data.salesName == null ? '' : data.salesName;                    
	                    var enableStatus = '启用';
	                    if (data.enableStatus == 0) {
	                        enableStatus = '禁用'
	                    };
	                    var testStatus = '是';
	                    if (data.testStatus == 0) {
	                        testStatus = '否';
	                    };
	                    var updateValue = data.id +"^&^"+pageNum;
	                    html += "<tr><td class='col-sm-1' style='padding-left:20px'>" + customerName + "</td>";
						html += "<td class='col-sm-1'>" + contact + "</td>";
						html += "<td class='col-sm-1'>" + mobile + "</td>";
						html += "<td class='col-sm-1'>" + salesName + "</td>";
						html += "<td class='col-sm-1' style='text-align:center;'>" + enableStatus + "</td>";
						html += "<td class='col-sm-1' style='text-align:center;'>" + testStatus + "</td>";
						html += "<td class='col-sm-2' style='text-align:center;'>";
						if(fnCode.details == "details"){
							html += "<a style='margin-right: 10px;cursor:pointer;overflow:hidden;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='详情' onclick='customerDetail(\"" + updateValue + "\");'><i class='icon iconfont icon-xiangqing operate'></i></a>";
						};
						if(fnCode.list == "list"){
							html += "<a data-toggle='tooltip' data-placement='bottom' title='设备列表' onclick='gocustomerdeveicList(\""+data.id+"\")' href='javascript:void(0);' style='margin-right: 10px;cursor:pointer;text-decoration: none;'><i class='icon iconfont icon-list operate'></i></a>";
						};
						if(fnCode.modify == "modify"){
							html += "<a style='margin-right: 10px;cursor:pointer;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='修改'  onclick='customerUpdate(\"" + updateValue + "\");'><i class='icon iconfont icon-bianji operate'></i></a>";
						};
						if(fnCode.delete == "delete"){
							html += "<a data-toggle='tooltip' style='cursor:pointer;text-decoration: none;' data-placement='bottom' title='删除' onclick='deleteCustomer(" + data.id + ");'><i class='icon iconfont icon-shanchu operate'></i></a>";
						}
						html += "</td></tr>"
					}
					$("#customerTable tbody").html(html);
					var pageIndex = customerResult.pageIndex;
					var fn = "getCustomerList";
					var pagination_html = paging(totalCount,pageSize,pageIndex,fn);
					$("#pagination").html(pagination_html);
				} else {
					$("#customerTable tbody").html("<tr ><td colspan='7' style='text-align:center;'>查询不到数据！</td></tr>");
					$("#pagination").html("");
				}
			} else {
				var ms = result.message;
				ToolTipTop.Show(ms,"error");
				$("#customerTable tbody").html("<tr ><td colspan='7' style='text-align:center;'>查询不到数据！</td></tr>");
				$("#pagination").html("");
			}
		},
		error: function(msg) {
			ToolTipTop.Show("加载超时","error");
		}
	});
}
/*
 * 进入服务商设备列表列面
 */
function gocustomerdeveicList(id){
	var parameter = {
		"customerDeviceList":id
	};
	parameter = JSON.stringify(parameter);
	sessionStorage.setItem("parameter",parameter);
	window.location.href = "index.html#customerDeviceList";
};
/*
 * 新增服务商
 */
function addCustomerModal(){
	window.location.href = "index.html#customerAdd";
};

/*
 * 设置缓存，跳转修改服务商
 */
function customerUpdate(data){
	var id = data.split("^&^")[0];
	var pageNum = data.split("^&^")[1];
	var parameter = {
		"customerUpdate":id
	};
	var cache = {
		"pageNum":pageNum,
		"customer":"customer"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#customerUpdate";
};
/*
 * 设置缓存，跳转服务商详情
 */
function customerDetail(data) {
	var id = data.split("^&^")[0];
	var pageNum = data.split("^&^")[1];
	var parameter = {
		"customerDetail":id
	};
	var cache = {
		"pageNum":pageNum,
		"customer":"customer"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#customerDetail";
}
/*
 * 删除服务商
 */
function deleteCustomer(customerId) {
	Messager.confirm({Msg: '确定删除此服务商?',title:"删除服务商"}).on(function (flag) {
        if (flag) {
            $customerIdList = $.parseJSON('[' + customerId + ']');
			$.ajax({
				type: "POST",
				url: '/customer/deletes',
				data: JSON.stringify($customerIdList),
				contentType: "application/json",
				dataType: 'json',
				success: function(result) {
					isSuccessCode(result.code);
					if(result.code == 200) {						
						ToolTipTop.Show("删除服务商信息成功！","success");
						getCustomerList(1);
					} else {
						var ms = result.message;
						ToolTipTop.Show(ms,"error");						
						
					}
				},
		        error: function (result) {
		            ToolTipTop.Show("加载超时！","error");
		        }
			});
       	}        
    });	
}
/*
 * 销售列表
 */
function querySales() {
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
				var html = "";
				var saleList = result.data;
				html = "<option value=''>全部</option>";
				for(var i = 0; i < saleList.length; i++) {
					html += "<option value='" + saleList[i].userName + "'>" + saleList[i].userName + "</option>"
				};
				$("#salesName").html(html);
			}
		}
	});
}