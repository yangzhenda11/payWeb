var newConfig = null;
$(function(){
	addListTree();	
	setstyle();
	getCustomerConfig()
});

//加载列表树
function addListTree(){
	setTreeValue();  //设置列表树内容
	checkNav();			//选择高亮显示
	treedropdown();		//加载列表树格式
}

/*
 * 获取间连通道
 */
function getCustomerConfig(){
	var customerId = location.search.slice(1).split("&")[0].split("=")[1];
	$.ajax({
		type: "GET",
		url: '/spChannelChoose/get',
		data: "data="+customerId,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var status = isEmptyObject(result.data);
				if(status == true){
					newConfig = 1;
					$("#default").prop("checked",true);
				}else{
					newConfig = 0;
					setConfig(result.data);
				};
			} else {
				var ms =result.message;
				Messager.show({Msg: ms,iconImg: 'warning', isModal: false});
			}
		}
	});
};

/*
 * 设置配置方式
 */
function setConfig(data){
	if(data.type == 1){
		$("#straight").prop("checked",true);
	}else if(data.type == 2){
		$("#relation").prop("checked",true);
	}else{
		$("#default").prop("checked",true);
	}
}

/*
 * 配置新增(1) && 修改(0)
 */
function saveConfig(){
	if(newConfig == 1){
		var customerId = location.search.slice(1).split("&")[0].split("=")[1];
		var loginUserId = sessionStorage.getItem("id");
		$value = form2json($("#customerSelect"));
		$value = JSON.parse($value);
		$value.customerId = customerId;
		$value.loginUserId = loginUserId;
		if($value.type == ""){
			Messager.show({Msg: "请选择一个通道", isModal: false,iconImg: 'warning',isHideDate: 1500,callbackfn:fn});
		}else{
			$.ajax({
		        type: 'POST',
		        url: '/spChannelChoose/add',
		        data: JSON.stringify($value),
		        contentType: "application/json",
		        dataType: 'json',
		        success: function (result) {
		            isSuccessCode(result.code);
		            if (result.code === 200) {
		                Messager.show({Msg: "通道配置成功", isModal: false,isHideDate: 1500,callbackfn:"getCustomerConfig()"});
		            } else {
		                var ms = result.message;
		                var fn = '$("#default").prop("checked",true);';
		                Messager.show({Msg: ms, isModal: false,iconImg: 'warning',isHideDate: 1500,callbackfn:fn});
		            }
		        },
		        error: function (result) {
		        	var fn = '$("#default").prop("checked",true);';
		            Messager.show({Msg: '加载超时',iconImg: 'warning', isModal: false,callbackfn:fn});
		        }
		    });
		}
	}else if(newConfig == 0){
		Messager.confirm({Msg: '确认修改支付配置?', iconImg: 'question'}).on(function (flag) {
        	if (flag) {
        		var customerId = location.search.slice(1).split("&")[0].split("=")[1];
				var loginUserId = sessionStorage.getItem("id");
				$value = form2json($("#customerSelect"));
				$value = JSON.parse($value);
				$value.customerId = customerId;
				$value.loginUserId = loginUserId;
				if($value.type == ""){
					Messager.show({Msg: "请选择一个通道", isModal: false,iconImg: 'warning',isHideDate: 1500,callbackfn:fn});
				}else{
					$.ajax({
				        type: 'POST',
				        url: '/spChannelChoose/modify',
				        data: JSON.stringify($value),
				        contentType: "application/json",
				        dataType: 'json',
				        success: function (result) {
				            isSuccessCode(result.code);
				            if (result.code === 200) {
				            	setTimeout(function () {Messager.show({Msg: "通道配置成功", isModal: false,isHideDate: 1500});}, 300);
				            } else {
				                var ms = result.message;
				                var fn = '$("#default").prop("checked",true);';
				                setTimeout(function () {Messager.show({Msg: ms, isModal: false,isHideDate: 1500,callbackfn:fn});}, 300);
				            }
				        },
				        error: function (result) {
				        	var fn = '$("#default").prop("checked",true);';
				            Messager.show({Msg: '加载超时',iconImg: 'warning', isModal: false,callbackfn:fn});
				        }
				    });
				}
        	}
 		});
	}
};

//间连通道选择（只能选择一个通道）
function relationSelect(){
	$("#relation input[type='checkbox']").on("click",function(){
		if($(this).prop("checked") == false){
			$("#relation input[type='checkbox']").prop("checked",false);
		}else{
			$("#relation input[type='checkbox']").prop("checked",false);
			$(this).prop("checked",true);
		}
	});
	$("#configSelectBtn").on("click",function(){
		for(var i =0;i<$("#relation input[type='checkbox']").length;i++){
		    if($("input[type='checkbox']").eq(i).is(':checked')){                            
		    	var relationSelect = $("input[type='checkbox']").eq(i).val();
		    }
		}
		console.log(relationSelect);
	})
}
