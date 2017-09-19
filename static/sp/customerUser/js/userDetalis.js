$(function(){
	userDetails();	
})
$(function(){
	var flagStatue = sessionStorage.getItem("listFlag");
	if(flagStatue == 0){
		$("#control i").removeClass("icon-xiangyouzhankai").addClass("icon-xiangzuoshouqi-copy");
		$(".unleftContainer").css("width","14%");
		$(".unrightContainer").css("width","85.8%");
		$("#nav").css("display","block");
		$("#navIcon").css("display","none");
	}else if(flagStatue == 1){
		$("#control i").removeClass("icon-xiangzuoshouqi-copy").addClass("icon-xiangyouzhankai");
		$(".unleftContainer").css("width","4%");
		$(".unrightContainer").css("width","96%");
		$("#nav").css("display","none");
		$("#navIcon").css("display","block");
	};
	var height = $(".unrightContainer").height();
	$(".unleftContainer").css({"min-height":height,"border":"none"});
});
$("#control i").on("click",function(){
	var flag = sessionStorage.getItem("listFlag");
	if(flag == 0){
		$(".unleftContainer").animate({ 
			width: "4%",
		},500);
		$(".unrightContainer").animate({ 
			width: "96%",
		},500 ,function(){
			sessionStorage.setItem("listFlag","1");
			$("#control i").removeClass("icon-xiangzuoshouqi-copy").addClass("icon-xiangyouzhankai");
			$("#nav").css("display","none");
			$("#navIcon").css("display","block");
		});
	}else if(flag == 1){
		$("#nav").css("display","block");
		$("#navIcon").css("display","none");
		$(".unleftContainer").animate({ 
			width: "14%",
		}, 500);
		$(".unrightContainer").animate({ 
			width: "85.8%",
		}, 500 ,function(){
			sessionStorage.setItem("listFlag","0");
			$("#control i").removeClass("icon-xiangyouzhankai").addClass("icon-xiangzuoshouqi-copy");
			
		});
	};
});
/*
 *返回用户列表
 */
function backUserList(){
	sessionStorage.setItem("readCache","1");
	window.location.href = "userList.html";
}
//用户角色填充
function userDetails() {
	var parameter = sessionStorage.getItem("parameter");
	parameter = JSON.parse(parameter).customerUserDetails;
	if(parameter == null){
		ToolTipTop.Show("参数错误","error");
	};
    var id = parameter;
	$.ajax({
		type: "GET",
		url: '/user/get',
		data: "data=" + id,
		contentType: "application/json",
		dataType: 'json',
		success: function(result) {
			isSuccessCode(result.code);
			if(result.code == 200) {
				var data = result.data;
				var customerName = data.customerName == null ? '' : data.customerName;
				var userName = data.userName == null ? '' : data.userName;				
				var password = data.password == null ? '' : data.password;
				var roleName = data.roleName == null ? '' : data.roleName;				
				var createdTime = data.createdTime == null ? '' : getFormatDateByLong(data.createdTime, "yyyy-MM-dd hh:mm:ss");		
				if(data.enableStatus == 0) {
					$("input[name=enableStatus][value='0']").attr("checked", true);
				}else if(data.enableStatus == 1){
					$("input[name=enableStatus][value='1']").attr("checked", true);
				};
				$("#userNameDetails").val(userName);				
				$("#passwordDetails").val(password);				
				$("#roleDetails").val(roleName);				
				$("#customerDetails").val(customerName);
				$("#createdTime").val(createdTime);				
			} else {
				var ms = result.message;
				ToolTipTop.Show(ms,"error");
			}
		}
	});
};
