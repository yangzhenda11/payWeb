$(function () {
    var fnCode = queryFnCode();
    addBtnShow(fnCode);
    
    isCache("resolveList",findTemplateList)
});
/*
 * 增加模板
 */
function addTemplate(){
    window.location.href = "index.html#resolveAdd";
}
/*
 * 模板列表
 */
function findTemplateList(pageIndex){
	var totalCount = 0;
    var pageSize = 15;
    var templateName = $.trim($("#templateName").val());
    var jsondata = {
        "name": templateName,
        "pageIndex": pageIndex,
        "pageSize": pageSize,
    };
    $.ajax({
        type: "get",
        url: '/receiptTemplate/pageList',
        data: jsondata,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {        	
            isSuccessCode(result.code);            
            if(result.code == 200){
            	var result = result.data;
            	totalCount = result.listCount;            	
                $(".fontbold").text(totalCount);
	            if (result.list.length != 0) {
	                var str = "";               
	                var indexNum = result.pageIndex;	                
	                var resolveList = result.list;
	                var fnCode = queryFnCode();	                
	                $.each(resolveList, function (i, value) {  	                	
	                	var resolveName = value.name == null ? '' : value.name;
						var customerName = value.customerName == null ? '' : value.customerName;
						var description = value.description == null ? '' : value.description;
	                    str += "<tr><td style='padding-left:20px;'>" + resolveName + "</td>" +                      
	                        "<td>" + customerName + "</td>" +
	                        "<td>" + description + "</td>" +
	                        "<td style='text-align:center;'>"
	                    if(fnCode.details == "details"){
							str += '<a style="margin-right: 10px;cursor:pointer;text-decoration: none;" data-toggle="tooltip" data-placement="bottom" title="详情" href="javascript:void(0);" onclick="resolveDetails(\''+value.id + '^&^' + indexNum +'\')"><i class="icon iconfont icon-xiangqing operate"></i></a>';
						};
						if(fnCode.list == "list"){
							str += '<a style="margin-right: 10px;cursor:pointer;text-decoration: none;" data-toggle="tooltip" data-placement="bottom" title="设备列表" href="javascript:void(0);" onclick="resolveDeviceList(\''+value.id + '^&^' + value.customerId + '^&^' + indexNum +'\')"><i class="icon iconfont icon-list operate"></i></a>';
						};
						if(fnCode.modify == "modify"){
							str += '<a style="margin-right: 10px;cursor:pointer;text-decoration: none;" data-toggle="tooltip" data-placement="bottom" title="修改" onclick="resolveConfig(\'' + value.id + '^&^' + indexNum +'\')"><i class="icon iconfont icon-bianji operate"></i></a>';
						};
						if(fnCode.delete == "delete"){
							str += '<a data-toggle="tooltip" style="cursor:pointer;text-decoration: none;" data-placement="bottom" title="刪除" onclick="resolveRemove(' + value.id + ')"><i class="icon iconfont icon-shanchu operate"></i></a>';
						};
						str += "</td></tr>";                             
	                });
	                $("#templateTable tbody").html(str);									
					var fn = "findTemplateList";
					var pagination_html = paging(totalCount,pageSize,indexNum,fn);
					$("#pagination").html(pagination_html);	                
	            } else {
	                $("#templateTable tbody").html("<tr><td style='text-align:center' colspan='4'>查询不到数据！</td></tr>");
	                $("#pagination").html('');
	            }
	        } else {
	        	var ms = result.message;
	        	Messager.show({Msg: ms,iconImg: 'warning', isModal: false});
	        }
        },
        error: function (result) {
        	$("#templateTable tbody").html("<tr><td style='text-align:center' colspan='4'>查询不到数据！</td></tr>");
            $("#pagination").html('');
            Messager.show({Msg: '加载超时',iconImg: 'warning', isModal: false});
        }
    });
}
var funcRef = function(evt){
    evt = evt || window.event;
    if (evt.keyCode==13){
        findTemplateList(1);
    }
}
window.onkeydown = funcRef;

/*
 * 模板详情
 */
function resolveDetails(data){
	var id = data.split("^&^")[0];
	var pageNum = data.split("^&^")[1];
	var parameter = {
		"resolveDetail":id
	};
	var cache = {
		"pageNum":pageNum,
		"resolveList":"resolveList"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#resolveDetail";
};
/*
 * 设备列表
 */
function resolveDeviceList(data){
	var id = data.split("^&^")[0];
	var customerId = data.split("^&^")[1];
	var pageNum = data.split("^&^")[2];
	var parameter = {
		"resolveDeviceList":id + "^&^" + customerId
	};
	var cache = {
		"pageNum":pageNum,
		"resolveList":"resolveList"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#resolveDeviceList";
}
/*
 * 模板修改
 */
function resolveConfig(data){
	var id = data.split("^&^")[0];
	var pageNum = data.split("^&^")[1];
	var parameter = {
		"resolveEdit":id
	};
	var cache = {
		"pageNum":pageNum,
		"resolveList":"resolveList"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#resolveConfig";
};

/*
 * 模板删除
 */
function resolveRemove(id) {
    $data = $.parseJSON('[' + id + ']');
    $url = '/receiptTemplate/deletes';
	Messager.confirm({Msg: '确认删除此模板?', title: '删除模板'}).on(function (flag) {
        if (flag) {
        	$.ajax({
		        type: 'POST',
		        url: $url,
		        data: JSON.stringify($data),
		        contentType: "application/json",
		        dataType: 'json',
		        success: function (result) {
	                if(result.code == 200) {
	                	setTimeout(function () {
		                	Messager.show({Msg: "删除成功", isModal: false,isHideDate: 1500,callbackfn:"findTemplateList(1)"});
		                }, 300);
					} else {
						var ms = result.message;
						setTimeout(function () {
		                	Messager.show({Msg: ms,iconImg: 'warning', isModal: false});
		                }, 300);
					}
	            }
	        })
        }
    })
};