
/*
 * 读取参数
 * code:参数名称
 */
function readParameter(code){
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter)[code];
	if(parameter == undefined){
        ToolTipTop.Show("参数错误","error");
	}else{
		return parameter;
	}
}
/*
 * 获得服务商
 */
function getCustomers() {
    var data = {
        "operateType":"chooseServiceProvider"
    };
    $.ajax({
        type: "get",
        url: '/customer/list',
        data: data,
        contentType: "application/json",
        dataType: 'json',
        async: false,
        success: function (result) {
            var html = "";
            var customerList = result.data;
            if (customerList != null) {
                for (var i = 0; i < customerList.length; i++) {
                    html += "<option value='" + customerList[i].id + "'>" + customerList[i].name + "</option>"
                }
            }
            $("#customerId").html(html);
            $('#customerId').selectpicker({
                liveSearch: 'true',
                title:"请选择服务商",
                width:"100%"
            });
            validator();
        }
    });
}

/*
 * 新增模板验证成功保存
 */
function save(){
    var customerId = $("#customerId").val();
    if(customerId == ""){
        resetResolveModel();
        ToolTipTop.Show("请选择服务商","error");
    }else{
        var id=$("#resolveId").val();
        var name=$("input[name='name']").val();
        var description=$("input[name='description']").val();
        var exclusiveKeysArr=[];
        $("input[name='exclusiveKeys']").each(function(){
            var exclusiveKeys=$(this).val();
            exclusiveKeysArr.push(exclusiveKeys);
        });
        var notifyUrl=$("input[name='notifyUrl']").val();
        var customerId=$("#customerId").val();
        var fieldsArr=[];
        var keyValue = true;
        var keyValue1 = true;
        var keyValue2 = true;
        var aa=1;
        $(".tr-item").each(function(){
            var endType=$(this).find("select[name='endType'] option:selected").val();
            var fetchType=$(this).find("select[name='fetchType'] option:selected").val();
            var key=$(this).find("textarea[name='key']").val();
            var keywords=$(this).find("textarea[name='keywords']").val().split(/,|，/);
            var keyword2=$(this).find("textarea[name='keywords']").val();
            var urlParam=$(this).find("textarea[name='urlParam']").val();
            if(fetchType == 1){
                if(!!key && !!urlParam){
                    var  fieldObj={
                        "endType":endType,
                        "fetchType":fetchType,
                        "key":key,
                        "keywords":keywords,
                        "urlParam":urlParam
                    };
                    fieldsArr.push(fieldObj);
                    keyValue = true;
                    keyValue2 = true;
                    aa=1;
                }
                if(!key){
                    keyValue = false;
                    aa=0;
                }
                if(!urlParam){
                    keyValue2 = false;
                    aa=0;
                }
            }else if(fetchType == 2){
                if(!!key && !!keyword2 && !!urlParam){
                    var  fieldObj={
                        "endType":endType,
                        "fetchType":fetchType,
                        "key":key,
                        "keywords":keywords,
                        "urlParam":urlParam
                    };
                    fieldsArr.push(fieldObj);
                    keyValue = true;
                    keyValue1 = true;
                    keyValue2 = true;
                    aa=1;
                }
                if(!key){
                    keyValue = false;
                    aa=0;
                }
                 if(!keyword2){
                    keyValue1 = false;
                    aa=0;
                }
                if(!urlParam){
                    keyValue2 = false;
                    aa=0;
                }
            }
            if(aa == 0){
                return false;
            }
        })
        if(!keyValue){
            resetResolveModel();
            ToolTipTop.Show("请完善关键字","error");
        }
        else if(!keyValue1){
            resetResolveModel();
            ToolTipTop.Show("请完善候选字","error");
        }
        else if (!keyValue2){
            resetResolveModel();
            ToolTipTop.Show("请完善参数名","error");
        }
        if(aa == 1){
            var enabled=$("input[name='enabled']:checked").val();
            var data={
                name:name,
                description:description,
                exclusiveKeys:exclusiveKeysArr,
                customerId:customerId,
                notifyUrl:notifyUrl,
                fields:fieldsArr,
                enabled:enabled
            };
            saveResolve(data,id);
        }

    }
}
/*
 * 新增&修改提交保存
 */
function saveResolve(data,id){
	var hash = window.location.href;
	hash = hash.split("#")[1];	
	if(hash == "resolveConfig"){
        data.id = id;
		var $url = '/receiptTemplate/modify';
		var successMs = "修改模板成功";
	}else if(hash == "resolveAdd"){		
		var $url = '/receiptTemplate/add';
		var successMs = "添加模板成功";
	};

  $.ajax({
      type: "POST",
      url: $url,
      data: JSON.stringify(data),
      contentType: "application/json",
      dataType: 'json',
      success: function (result) {
          if (result.code === 200) {
              ToolTipTop.Show(successMs,"success");
              window.location.href="index.html#resolve";
          } else {
              var ms = result.message;
              resetResolveModel();
              ToolTipTop.Show(ms,"error");
          }
      },
      error: function (result) {
           resetResolveModel();
          ToolTipTop.Show("加载超时","error");
      }
    })
}

/*
 *增加删除按钮
 */
$(document).on('click','.iconDel',function(){
    $(this).parents('tr').remove()
})
function addTable(){
    var temp='<tr class="tr-item" style="border: 1px solid #ccc;border-top: 0px">'
        +'<td style="border-right:1px solid #ccc">'
        +'<select name="endType" style="outline: none;" id="endType">'
        +'<option value="1">空白</option>'
        +'<option value="2">换行</option>'
        +'</select>'
        +'</td>'
        +'<td style="border-right:1px solid #ccc">'
        +'<select name="fetchType"  style="outline: none;" id="fetchType">'
        +'<option value="1">关键字</option>'
        +'<option value="2">候选字</option>'
        +'</select>'
        +'</td>'
        +'<td style="border-right:1px solid #ccc">'
        +' <textarea name="key" id="key"></textarea>'
        +'</td>'
        +'<td style="border-right:1px solid #ccc">'
        +' <textarea name="keywords" id="keywords"></textarea>'
        +'</td>'
        +'<td style="border-right:1px solid #ccc">'
        +'<textarea type="text" name="urlParam" id="urlParam"></textarea>'
        +'</td>'
        +'<td style="border-right:1px solid #ccc;text-align: center">'
        +'<i class="icon iconfont icon-shanchu operate iconDel"></i>'
        +'</td>'
        +'</tr>';
    $("tbody").append(temp);
}

/*
 * 删除key&value列表操作
 */
$(document).on('click','.keyDelete',function(){
    $(this).prev().remove();
    $(this).remove();
})

function addResolve(){
    var trm= '<input type="text" class="form-control2 field" name="exclusiveKeys" id="exclusiveKeys" placeholder="请输入排除关键字" />'
        +'<button class="keyDelete">'+'删除'+'</button>';
    $(".exclusiveKeys").append(trm);
}
/*
 * 返回模板列表
 */
function backResolveList(value){
	if(value == 1){
		sessionStorage.setItem("readCache","1");	
	};
	window.location.href = "index.html#resolve";
};
//新增失败后重置验证
function resetResolveModel(){
	$("#resolveForm").data('bootstrapValidator').destroy();
	$('#resolveForm').data('bootstrapValidator', null);
	validator();
};
//表单验证
function validator() {
	$('#resolveForm')
		.bootstrapValidator({
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			fields: {
				name: {
					validators: {
						notEmpty: {
							message: '模板名称不能为空'
						}

					}
				},
				description: {
					validators: {
						notEmpty: {
							message: '模板描述不能为空'
						}
					}
				},
                notifyUrl: {
                    validators: {
                        notEmpty: {
                            message: '通知地址不能为空'
                        }
                    }
                }
            }
		})
		.on('success.form.bv', function(e) {
			e.preventDefault();
			var $form = $(e.target);
			var bv = $form.data('bootstrapValidator');
			save();
		});
};
/*
 * 获取设备配置服务商信息
 */
function getCustomersEdit(id,name) {
    var data = {
        "operateType":"chooseServiceProvider"
    };
    $.ajax({
        type: "get",
        url: '/customer/list',
        contentType: "application/json",
        data: data,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            if(result.code == 200){
                var customerList = result.data;
                var html = "<option value='" + id + "'>" + name + "</option>";
                for (var i in customerList) {
                    if(customerList[i].id != id){
                        html += "<option value='" + customerList[i].id + "'>" + customerList[i].name + "</option>"
                    }
                };
                $("#customerId").html(html);
                $('#customerId').selectpicker({
                    liveSearch: 'true',
                    width:"100%"
                });
            }else{
                var ms = result.message;
                ToolTipTop.Show(ms,"error");
            }
        }
    });
}
/*
 * 显示填充
 */
function viewDetails(code) {
    var id = readParameter(code);
    var url = '/receiptTemplate/get';
    $.ajax({
        type: 'GET',
        url: url,
        data: "data=" + id,
        contentType: "application/json",
        dataType: 'json',
        success: function (result) {
            if (result.code === 200) {
                var data = result.data;
                $("#resolveId").val(data.id);
                $("#name").val(data.name);
                $("#description").val(data.description);
                for(var length=0; length<data.exclusiveKeys.length;length++){
                    $(".exclusiveKeys").append(
                    '<input type="text" class="form-control2 field" name="exclusiveKeys" id="exclusiveKeys"  value='+data.exclusiveKeys[length]+' />'
                    +'<button class="keyDelete">删除</button>'
                    );
                }
                $(".exclusiveKeys").after(
                '<div onclick="addResolve()" class="keyAdd">增加</div>'
                )
                $("#notifyUrl").val(data.notifyUrl);
                $("#customerId").val(data.customerId);
                for (var length=0; length<data.fields.length;length++){
                    var keywords = data.fields[length].keywords == null ? "" : data.fields[length].keywords;
                    var tem='<tr class="tr-item" style="border: 1px solid #ccc;border-top: 0px">'
                        +'<td style="border-right:1px solid #ccc">'
                        +'<select name="endType" data-sel="endType' + length + '" style="outline: none;">'
                        +'<option value="1">空白</option>'
                        +'<option value="2">换行</option>'
                        +'</select>'
                        +'</td>'
                        +'<td style="border-right:1px solid #ccc">'
                        +'<select  name="fetchType" data-sel="fetchType' + length + '" style="outline: none;">'
                        +'<option value="1">关键字</option>'
                        +'<option value="2">候选字</option>'
                        +'</select>'
                        +'</td>'
                        +'<td style="border-right:1px solid #ccc">'
                        +' <textarea name="key" id="key" class="key" >'+data.fields[length].key+'</textarea>'
                        +'</td>'
                        +'<td style="border-right:1px solid #ccc">'
                        +' <textarea name="keywords" id="keywords" class="keywords">'+keywords+'</textarea>'
                        +'</td>'
                        +'<td style="border-right:1px solid #ccc">'
                        +'<textarea type="text" name="urlParam" id="urlParam" class="urlParam">'+data.fields[length].urlParam+'</textarea>'
                        +'</td>'
                        +'<td style="border-right:1px solid #ccc; text-align: center">'
                        +'<i class="icon iconfont icon-shanchu operate iconDel"></i>'
                        +'</td>'
                        +'</tr>'
                    $("tbody").append(tem);
                    $("select[name='endType'][data-sel='endType" + length + "']").val(data.fields[length].endType);
                    $("select[name='fetchType'][data-sel='fetchType" + length + "']").val(data.fields[length].fetchType);
                }
                $("input[name='enabled'][value='"+ data.enabled+"']").attr("checked",true);
                getCustomersEdit(data.customerId,data.customerName);
                if(code == "resolveEdit"){
					validator();
                }
            } else {
                var ms = result.message;
                ToolTipTop.Show(ms,"error");
            }            
        },
        error: function (result) {
            ToolTipTop.Show("加载超时","error");
        }
    });
}
