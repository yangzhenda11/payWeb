$(function() {
	isCache("dictionaryList",getDictionaryList);
	var fnCode = queryFnCode();
	addBtnShow(fnCode);
//	IsLoad('https://www.baidu.com',function(res){
//	    if(res){
//	      alert('请求的url可以访问');
//	    }
//	});
});

/*
 * 回车搜索
 */
var funcRef = function(evt) {
	evt = evt || window.event;
	if(evt.keyCode == 13) {
		getDictionaryList(1);
	}
}
window.onkeydown = funcRef;

/*
 * 获取字典列表
 */
function getDictionaryList(pageIndex) {
	var totalCount = 0;
	var pageSize = 15;
	var obj = new Object();
	var dictionaryName = $("#dictionaryName").val();
	obj.dictionaryName = dictionaryName;
	obj.pageIndex = pageIndex;
	obj.pageSize = pageSize;
	$.ajax({
		type: "GET",
		url: '/dictionary/pageList',
		data: obj,
		beforeSend:loading,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			loadClose();
			isSuccessCode(result.code);
			var data = result.data;
			var dataList = data.list;
			var fnCode = queryFnCode();
			if(result.code == 200 && dataList.length > 0) {
				var html = null;
				var transmit = null;
				totalCount = data.listCount;
				$(".fontbold").text(totalCount);
				for(var i = 0; i < dataList.length; i++) {
					var dictionaryName = dataList[i].dictionaryName == null ? '' : dataList[i].dictionaryName;
					var dictionaryCode = dataList[i].dictionaryCode == null ? '' : dataList[i].dictionaryCode;
					var description = dataList[i].description == null ? '' : dataList[i].description;
					var status = '';
					var pageIndex = data.pageIndex;
					if(dataList[i].status == 0) {
						status = '禁用';
					}else if(dataList[i].status == 1){
						status = '启用';
					};
					transmit = dataList[i].id + "^&^" + pageIndex;
					html += "<tr><td style='text-align:center;'>" + (i+1) + "</td>";
					var paddLeft = dataList[i].treeId.length/4*20-10; 
					html += "<td style='padding-left:"+paddLeft+"px;'>" + dictionaryName + "</td>";
					html += "<td>" + dictionaryCode + "</td>";
					html += "<td>" + status + "</td>";
					html += "<td>" + description + "</td>";
					html += "<td style='text-align:center;'>";					
					if(fnCode.details == "details"){
						html += "<a style='margin-right: 10px;cursor:pointer;overflow:hidden;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='详情' onclick='dictionaryDetails(\"" + transmit + "\");'><i class='icon iconfont icon-xiangqing operate'></i></a>";
					};					
					if(fnCode.modify == "modify"){
						html += "<a style='margin-right: 10px;cursor:pointer;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='修改' onclick='editDictionary(\"" + transmit + "\");'><i class='icon iconfont icon-bianji operate'></i></a>";
					};
					if(fnCode.delete == "delete"){
						html += "<a data-toggle='tooltip' style='cursor:pointer;text-decoration: none;' data-placement='bottom' title='删除' onclick='deleteDictionary(" + dataList[i].id + ");'><i class='icon iconfont icon-shanchu operate'></i></a>";
					}
					html += "</td></tr>"
				};
				$("#dictionaryTable tbody").html(html);						
				var fn = "getDictionaryList";
				var pagination_html = paging(totalCount,pageSize,pageIndex,fn);
				$("#pagination").html(pagination_html);
			} else {
				$("#dictionaryTable tbody").html("<tr ><td colspan='6' style='text-align:center;'>查询不到数据！</td></tr>");
				$("#pagination").html("");
			};
		},
		error: function(msg) {
			loadClose();
			ToolTipTop.Show("加载超时","error");
		}
	});
};


/*
 * 新增字典点击事件
 */
function addDictionaryModal() {
	window.location.href = "index.html#dictionaryAdd";
};
/*
 * 设置缓存，跳转用户角色详情页面
 */
function dictionaryDetails(data){
	var id = data.split("^&^")[0];
	var pageNum = data.split("^&^")[1];
	var parameter = {
		"dictionaryDetail":id
	};
	var cache = {
		"pageNum":pageNum,
		"dictionaryList":"dictionaryList"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#dictionaryDetail";
};
/*
 * 设置缓存，跳转用户角色编辑页面
 */
function editDictionary(data){
	var id = data.split("^&^")[0];
	var pageNum = data.split("^&^")[1];
	var parameter = {
		"dictionaryEdit":id
	};
	var cache = {
		"pageNum":pageNum,
		"dictionaryList":"dictionaryList"
	};	
	sessionStorage.setItem("parameter",JSON.stringify(parameter));
	sessionStorage.setItem("cache",JSON.stringify(cache));
	window.location.href = "index.html#dictionaryEdit";
};

/*
 * 删除字典
 */
function deleteDictionary(id) {
	Messager.confirm({Msg: '确认删除此字典项?', title: '删除字典'}).on(function (flag) {
        if (flag) {
        	deleteQuery(id);
        }        
   	});	
};

/*
 * 删除字典验证是否有子级，若有子级不删除，提示，无子级执行删除函数
 */
function deleteQuery(id) {
	var isparent = 0;
	$.ajax({
		type: "GET",
		url: '/dictionary/tree/query',
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var data = result.data;
				for(var i = 0; i < data.length; i++) {
					if(data[i].parentId == id){
						isparent = 1;					
					}
				};
				if(isparent != 1){
		            var $IdList = $.parseJSON('[' + id + ']');
					$.ajax({
						type: "POST",
						url: '/dictionary/deletes',
						data: JSON.stringify($IdList),
						contentType: "application/json",
						dataType: 'json',
						success: function(result) {
							isSuccessCode(result.code);
							if(result.code == 200) {
								ToolTipTop.Show("删除成功","success");
								getDictionaryList(1);																
							} else {
								var ms = result.message;
								ToolTipTop.Show(ms,"error");
							}
						}
					});
				}else{
					ToolTipTop.Show("该字典存在下级字典，不能删除","error");					
				}
			};
		}
	})
};
