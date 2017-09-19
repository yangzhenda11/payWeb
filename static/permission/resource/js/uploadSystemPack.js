$(function(){
	validator();
	querytype();
});

/*
 * 文件上传
 */
(function (_, $) {
    $("#file").fileinput({
        language: 'zh', 
        uploadUrl: "/file/upload", 
        uploadAsync: true,
     	allowedFileExtensions: ['ppm'],
        maxFileSize: 51200,
        //maxFileCount: 10,
        //showPreview:false,
        slugCallback: function (filename) {
            return filename;
        }
    });
    $("#file").on("fileuploaded", function (event, data) {
        var res=data.response;
        if(res.code == 200){
        	$("#localPath").val(res.data);
        	$("#fileStaut").text("(文件已上传)");
        }else{
        	var ms = res.message;
        	ToolTipTop.Show(ms,"error");
        }
    });
})(window, jQuery);

/*
 * 获取字典列表
 */
function querytype() {
	$.ajax({
		type: "GET",
		url: '/dictionary/tree/query',
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var html = "";
				var data = result.data;
					html = "<option value=''> ———— 请选择文件所属类型 ————</option>";
					for(var i = 0; i < data.length; i++) {
						var len = data[i].treeId.length/4-1;
						html += "<option value='" + data[i].id + "'>"+ blankReturn(len) +"" + data[i].dictionaryName + "</option>"
					}
				$("#packType").html(html);
			}
		}
	});
}
//返回空格填充
function blankReturn(num){
	var arr = [];
	for(var i=0;i<num;i++){
		arr.push("&nbsp;&nbsp;&nbsp;")
	};
	arr = arr.join("");
	arr = arr.replace(",","");
	return arr;
}

/*
 * 提交保存时检测文件是否上传
 */
function saveConfig(){	
	if($("#fileStaut").text() == "(文件未上传)"){
		$("#uploadPack").data('bootstrapValidator').destroy();
		$('#uploadPack').data('bootstrapValidator', null);
		validator();
		ToolTipTop.Show("请先上传文件","error");
	}else{
		saveBackpack();
	}
};

/*
 * 文件上传&信息填写无误提交
 */
function saveBackpack(){
	$uploadPack = form2json($("#uploadPack"));
    $.ajax({
        type: 'POST',
        url: '/upgradePackage/add',
        data: $uploadPack,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            isSuccessCode(result.code);
            if (result.code == 200) {
            	ToolTipTop.Show("m系统资源包信息更新成功","success");
            	window.location.href = "index.html#systemResourcePack"           	               
            } else {
                var ms = result.message;
                $("#uploadPack").data('bootstrapValidator').destroy();
        		$('#uploadPack').data('bootstrapValidator', null);
        		validator();       		
               	ToolTipTop.Show(ms,"error");
            }
        },
        error: function (result) {
            ToolTipTop.Show("加载超时","error");
        }
    })
};
/*
 * 返回系统资源页面
 */
function tosystemResourcePack(){
	window.location.href="index.html#systemResourcePack";
}

/*
 * 页面填充验证
 */
function validator() {
	$('#uploadPack')
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
				type: {
					validators: {
						notEmpty: {
							message: '请选择文件所属类型'
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
