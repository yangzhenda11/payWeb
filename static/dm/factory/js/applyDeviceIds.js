$(function () {
	var fnCode = queryFnCode();
	addBtnShow(fnCode);
    showDeviceCodeList();
    validator();
});
/*
 * 显示申请设备型号
 */
function showDeviceCodeList() {
    $.ajax({
       type: 'get',
        url: '/deviceModel/list',
        contentType: "application/json",
        dataType: 'json',
        async: false,
        success: function (result) {
            isSuccessCode(result.code);
            var deviceCode = new Array();
            if(result.code === 200){
                var deviceCodes = result.data;                
                for (var i = 0; i < deviceCodes.length; i++) {
                    deviceCode.push("<option value='" + deviceCodes[i].id + "'>" + deviceCodes[i].code + "</option>");
                }
                $("#deviceType").html(deviceCode.join(""));
                $('#deviceType').selectpicker({
				    liveSearch: 'true',
				    width:"290px",
				    title:"请选择设备型号"
				});
				$('#deviceType').selectpicker('setStyle', 'selectStyle', 'add');
				$(".selectStyle").css({"padding-left":"10px"});
				//$(".selectStyle").parent().css({"border":"1px solid #ccc"});
            }else {
                deviceCode.push("<option value=''>————请选择————</option>");
                $("#deviceType").html(deviceCode.join(""));
                var ms = result.message;
               	ToolTipTop.Show(ms,"error");
            }
        }
    });
};

/*
 * 设备申请
 */
function applyIds(){
	var deviceType = $("#deviceType").val();
	if(deviceType){
		apply();
	}else{
		resetAddModel();
		ToolTipTop.Show("请选择设备类型","error");
	}
	
}
function apply() {
    var deviceType = $("#deviceType").val().trim();
    var deviceCount = $("#deviceCount").val().trim();
    var batchNum = $("#batchNum").val().trim();
    var typeName = $(".selectStyle .filter-option").text();
    var data = {
        "modelId": deviceType,
        "serialNumCount": deviceCount,
        "batchNum": batchNum
    }
    $.ajax({
        type: "post",
        url: '/device/add',
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: 'json',
        beforeSend:loading,
        success: function (result) {
            isSuccessCode(result.code);
            if (result.code == 200) {
            	resetAddModel();
                getApplyResults(result.data,data,typeName);
            } else {
                $("#applyIdResult").addClass("hidden");
                resetAddModel();
                var ms = result.message;
                ToolTipTop.Show(ms,"error");
            }
        },
        error: function(msg) {
			loadClose();
			ToolTipTop.Show("加载超时","error");
		}
    });
}
//申请失败后重置验证
function resetAddModel(){
	$("#applyDeviceForm").data('bootstrapValidator').destroy();
	$('#applyDeviceForm').data('bootstrapValidator', null);
	validator();
};
/*
 * 申请结果展示
 */
function getApplyResults(produceBatchNum,applyData,typeName) {
	var applyData = applyData;
	var typeName = typeName;
    var serialNumCount = parseInt($("#deviceCount").val());
    var data = {
        "produceBatchNum": produceBatchNum,
        "serialNumCount":serialNumCount
    };
    $.ajax({
       type: "get",
        url: '/device/productDevice/query',
        data: data,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
        	loadClose();
            isSuccessCode(result.code);           
            if(result.code === 200) {           	
                var data = result.data;
                var endDeviceId = parseInt(data.endSerialNum);
                var startDeviceId = endDeviceId - serialNumCount + 1;
                $("#startDeviceId").text(startDeviceId);
                $("#endDeviceId").text(endDeviceId);
                $("#deviceIdSum").text(serialNumCount);
				$("#retBatchId").text(produceBatchNum);
                $("#applyIdResult").removeClass("hidden");
                //表格导出
                loadExcel(produceBatchNum,serialNumCount,startDeviceId,endDeviceId,typeName);
                //批次号取消
				$(".cancelApply").on("click",function(){
					Messager.confirm({Msg: '确认取消本批次下所有设备?', title: '取消批次设备'}).on(function (flag) {
						if (flag) {
							cancelApplyIds(applyData);
						}
					})
				})
            } else {
                $("#applyIdResult").addClass("hidden");
                var ms = result.message;
                ToolTipTop.Show(ms,"error");
            }
        },
        error: function(msg) {
			loadClose();
			ToolTipTop.Show("加载超时","error");
		}
    });
}

/*
 * 取消设备申请函数
 */
function cancelApplyIds(applyData) {
    var data = JSON.stringify(applyData);
    $.ajax({
        type: "post",
        url: '/device/deletes',
        data: data,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            isSuccessCode(result.code);
            if (result.code == 200) {
            	$("#applyIdResult").addClass("hidden");
            	ToolTipTop.Show("取消成功","success");            	
            } else {
                $("#applyIdResult").addClass("hidden");                
                var ms = result.message;
                ToolTipTop.Show(ms,"error");
            }
        }
    });
}

/*
 * 导出execl表格
 */
function loadExcel(batchNum,serialNumCount,startDeviceId,endDeviceId,typeName){
 	$(".export").on("click",function(){
		var urls = "/device/excel?batchNum="+batchNum+"&serialNumCount="+serialNumCount+"&startDeviceId="+startDeviceId+"&endDeviceId="+endDeviceId+"&code="+typeName;
		download_file(urls);
 	})
}
/*
 * 新增设备型号
 */
function addDeviceType(){
	window.location.href = "index.html#addDeviceType";
}
/*
 * 正则验证
 */
function validator() {
	$('#applyDeviceForm')
		.bootstrapValidator({
			feedbackIcons: {				
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {				
				batchNum: {
					validators: {
						notEmpty: {
							message: '请输入产品批次号'
						},
						regexp: {
	                        regexp: /^([a-zA-Z0-9]{1,10})$/,
	                        message: '请输入正确的产品批次号(最高支持10位字母或数字)'
	                    }
					}
				},
				deviceCount: {
					validators: {
						notEmpty: {
							message: '请输入申请数量'
						},
						regexp: {
	                        regexp: /^\+?[1-9][0-9]*$/,
	                        message: '请输入正确的申请数量'
	                    }
					}
				}
			}
		})
		.on('success.form.bv', function(e) {
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			applyIds();
		});
};