$(function() {
	getSystemPackList(1);
	$("#detailsModal").load("resource/html/systemResourceModel.html?" + timestamp() + " #modalDetail");
	$('#detailsModal').on('hidden.bs.modal', function() {
		$("#detailsModal").load("resource/html/systemResourceModel.html?" + timestamp() + " #modalDetail");
	});
	$("#editModal").load("resource/html/systemResourceModel.html?" + timestamp() + " #modalBody", function() {
		validator();
	});
	$('#editModal').on('hidden.bs.modal', function() {
		$("#editModal").load("resource/html/systemResourceModel.html?" + timestamp() + " #modalBody", function() {
			validator();
		});
	});
	var fnCode = queryFnCode();
	if(fnCode.upload == "upload"){
		$("#addbtn").removeClass("hidden");
	};
	$('#detailsModal,#editModal').modal({show:false,backdrop:'static'});
});

/*
 * 上传文件跳转函数
 */
function addSystemPack(){
	window.location.href = "index.html#uploadSystemPack";
};

/*
 * 获取系统资源列表
 */
function getSystemPackList(pageIndex){
	var totalCount = 0;
	var pageSize = 15;
	var obj = new Object();
	var fileName = $("#systemPackName").val();
	obj.fileName = fileName;
	obj.pageIndex = pageIndex;
	obj.pageSize = pageSize;
	$.ajax({
		type: "GET",
		url: '/upgradePackage/pageList',
		data: obj,
		beforeSend:loading,
		contentType: "application/json",
		dataType: 'json',
		async: false,
		success: function(result) {
			loadClose();
			isSuccessCode(result.code);
			var fnCode = queryFnCode();
			var data = result.data;
			var dataList = data.list;
			totalCount = data.listCount;
			$(".fontbold").text(totalCount);
			if(result.code == 200 && dataList.length > 0) {
				$.ajax({
					type: "GET",
					url: '/dictionary/tree/query',
					contentType: "application/json",
					dataType: 'json',
					success: function(results) {
						var results = results.data;
						if(result.code == 200) {
							detection(results);
							var html = null;
							for(var i = 0; i < dataList.length; i++) {
								var fileName = dataList[i].fileName == null ? '' : dataList[i].fileName;
								var version = dataList[i].version == null ? '' : dataList[i].version;
								var type = dataList[i].type == null ? '' : dataList[i].type;
								var ossUrl = dataList[i].ossUrl == null ? '' : dataList[i].ossUrl;
								var typeName = detection(results,type);
								var status = '';
								if(dataList[i].syncStatus == 0) {
									status = '未同步';
								}else if(dataList[i].syncStatus == 1){
									status = '已同步';
								};
								html += "<tr><td style='text-align:center;'>" + (i+1) + "</td>";
								html += "<td style='text-align:center;'>" + fileName + "</td>";
								html += "<td style='text-align:center;'>" + version + "</td>";
								html += "<td style='text-align:center;'>" + typeName + "</td>";
								html += "<td style='text-align:center;'>" + status + "</td>";
								html += "<td style='text-align:center;'>";
								if(fnCode.details == "details"){
									html += "<a style='margin-right: 10px;cursor:pointer;overflow:hidden;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='详情' onclick='resourcePackDetails(" + dataList[i].id + ");'><i class='icon iconfont icon-xiangqing operate'></i></a>";
								};								
								if(fnCode.modify == "modify"){
									html += "<a style='margin-right: 10px;cursor:pointer;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='修改' onclick='resourcePackEdit(" + dataList[i].id + ");'><i class='icon iconfont icon-bianji operate'></i></a>";
								};
								if(fnCode.download == "download"){
									html += "<a style='margin-right: 10px;cursor:pointer;text-decoration: none;' data-toggle='tooltip' data-placement='bottom' title='下载文件' href='javascript:void(0);'><i class='icon iconfont icon-xiazai2 operate' onclick='download_file(\""+ossUrl+"\");'></i></a>";
								};
								if(fnCode.delete == "delete"){
									html += "<a data-toggle='tooltip' style='cursor:pointer;text-decoration: none;' data-placement='bottom' title='删除' onclick='deleteResourcePack(" + dataList[i].id + ");'><i class='icon iconfont icon-shanchu operate'></i></a></td></tr>";
								}
								html += "</td></tr>"
							}
							$("#systemPackTable tbody").html(html);
							
							var pageIndex = data.pageIndex;
							var fn = "getSystemPackList";
							var pagination_html = paging(totalCount,pageSize,pageIndex,fn)				
							$("#pagination").html(pagination_html);
						}
					}
				});
			} else {
				$("#systemPackTable tbody").html("<tr ><td colspan='6' style='text-align:center;'>查询不到数据！</td></tr>");
				$("#pagination").html("");
			}
		},
		error: function(msg) {
			loadClose();
			ToolTipTop.Show("加载超时","error");
		}
	});
};

//加载编辑文件详情
function resourcePackEdit(id){
	$.ajax({
		type: "GET",
		url: '/upgradePackage/get',
		data: "data=" + id,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var data = result.data;
				var fileName = data.fileName;
				var version = data.version;
				var type = data.type;
				var localPath = data.localPath;
				var typeName = data.typeName;
				var ossUrl = data.ossUrl;
				$("#editID").val(id);
				$("#editFileName").val(fileName);
				$("#editVersion").val(version);
				$("#packType").val(type);
				$("#editTypeName").val(typeName);
				$("#localPath").val(localPath);
				$("#editOssUrl").val(ossUrl);
				showEditModal();
			} else {
				var ms = result.message;
				ToolTipTop.Show(ms,"error");
			}
		}
	});	
}
//回车查询
var funcRef = function(evt){
    evt = evt || window.event;
    if (evt.keyCode==13){
        getSystemPackList(1);
    }
}
window.onkeydown = funcRef;
//编辑文件保存
function saveConfig(){
	var $editPack = form2json($("#editSystemInfor"));
    $.ajax({
        type: 'POST',
        url: '/upgradePackage/modify',
        data: $editPack,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            isSuccessCode(result.code);
            if (result.code == 200) {
            	ToolTipTop.Show("系统资源包信息修改成功","success");
            	$('#editModal').modal('hide');
            	getSystemPackList(1);
            } else {
                var ms = result.message;
                $("#editSystemInfor").data('bootstrapValidator').destroy();
        		$('#editSystemInfor').data('bootstrapValidator', null);
        		validator(); 
        		ToolTipTop.Show(ms,"error");              	
            }
        },
        error: function (result) {
            ToolTipTop.Show("加载超时","error");
        }
    })
}
function showEditModal() {
	$('#editModal').modal();
}
//下载文件
function downloadFile(vaule){
	if(vaule == 1){		
		var url = $("#editOssUrl").val();
	}else{
		var url = $("#loadurl").val();
	}
	download_file(url);
}

//检测类型
function detection(data,type){
	var typeName = "";
	for(var i = 0; i < data.length; i++) {
		if(data[i].id == type){
			typeName = data[i].dictionaryName;
			return typeName;
		}
	}
}
//查看资源包详情
function resourcePackDetails(id){
	$.ajax({
		type: "GET",
		url: '/upgradePackage/get',
		data: "data=" + id,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var data = result.data;
				var fileName = data.fileName == null ? '' : data.fileName;
				var version = data.version == null ? '' : data.version;
				var typeName = data.typeName == null ? '' : data.typeName;
				var ossFileName = data.ossFileName == null ? '' : data.ossFileName;
				var ossPath = data.ossPath == null ? '' : data.ossPath;
				var ossUrl = data.ossUrl == null ? '' : data.ossUrl;
				var status = '';
				if(data.syncStatus == 0) {
					status = '未同步';
				}else if(data.syncStatus == 1){
					status = '已同步';
				};
				$("#fileName").text(fileName);
				$("#version").text(version);
				$("#typeName").text(typeName);
//				$("#ossFileName").text(ossFileName);
//				$("#ossPath").text(ossPath);
//				$("#ossUrl").text(ossUrl);
				$("#status").text(status);
				$("#loadurl").val(ossUrl);
				detailsModal();
			} else {
				var ms = result.message;
				ToolTipTop.Show(ms,"error");
			}
		}
	});
};
function detailsModal() {
	$('#detailsModal').modal();
};
//删除资源包
function deleteResourcePack(id) {
	Messager.confirm({Msg: '确定删除此资源包?', title: '删除资源包'}).on(function (flag) {
        if (flag) {
            var $IdList = $.parseJSON('[' + id + ']');
			$.ajax({
				type: "POST",
				url: '/upgradePackage/deletes',
				data: JSON.stringify($IdList),
				contentType: "application/json",
				dataType: 'json',
				success: function(result) {
					isSuccessCode(result.code);
					if(result.code == 200) {
						ToolTipTop.Show("删除成功","success");
						getSystemPackList(1);
					} else {
						var ms = result.message;
						ToolTipTop.Show(ms,"error");
					}
				}
			});
        }
        
    });	
};
/*
 * 修改资源包验证
 */
function validator() {
	$('#editSystemInfor')
		.bootstrapValidator({
			message: 'This value is not valid',
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {
				fileName: {
					message: '用户名验证不通过',
					validators: {
						notEmpty: {
							message: '文件名不能为空'
						},
						stringLength: {
	                        max: 25,
	                        message: '文件名不能超过25个字符'
	                    }
					}
				},
				version: {
					validators: {
						notEmpty: {
							message: '版本号不能为空'
						},
						stringLength: {
	                        max: 15,
	                        message: '版本号不能超过15个字符'
	                   }
					}
				}
			}
		})
		.on('success.form.bv', function(e) {
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			saveConfig();
		});
};