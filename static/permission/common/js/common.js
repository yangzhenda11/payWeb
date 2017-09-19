
/*
 * 导航栏插件引入
 */
function dropdown(){
	$('#nav').tendina({
        animate: true,
        speed: 500,
        openCallback: function($clickedEl) {
          
        },
        closeCallback: function($clickedEl) {
          
        }
    })
};

/**
 * 判断按钮是否隐藏部分权限
 */
function showUnwrap(){
	/**
	 * modal窗点击外部不能关闭问题解决
	 */
	$('#changePassword').modal({show:false,backdrop:'static'});	
	var platformPermissions = sessionStorage.getItem("platformPermissions");
	var data = JSON.parse(platformPermissions);
	$(".logoBarContent .menu").remove();
	for(var i in data){
		$(".logoBarContent").append("<a href=\"javascript:void(0)\" class=\"menu navuncheck\" data-topbarcode="+i+">"+data[i]+"</a>");		
	};
	$(".menu[data-topbarcode='permission']").removeClass("navuncheck").addClass("navcheck");
	tabPlatform();		
};

/*
 * 导航栏点击存储选中内容
 */
function checkNav(){
	$("#nav .navList a").click(function(){
		var checkNav = this.innerText;
		sessionStorage.setItem("checkNav",checkNav);
	});
};

/**
 * 导航栏添加高亮效果
 */
function showCheckNav(){	
	$("#nav li a").removeClass("checkNav");
	var len = $("#nav a").length;
	var navbar = sessionStorage.getItem("checkNav");
	for(var i=0;i<len;i++){
		if($("#nav li a")[i].innerHTML == navbar){
			if($("#nav li a").eq(i).parent().parent().hasClass("navList")){
				
			}else{
				$("#nav li a").eq(i).parent().parent().css("display","block");
			}
			$("#nav li a").eq(i).addClass("checkNav");
			$("#nav li i").css("color","#555");
			$("#nav li a").eq(i).parent().find("i").css("color","#fff");
		}
	}
	$("#nav").css("display","block");
};
/*
 * 清空上一次加载的JS和CSS
 */
function clearDynamic(){
	//$("#dynamicLink").html("");
	//$("#dynamic").html("");
}
/**
 * 加载左侧导航栏
 */
function showNavbar() {
	var navHtml = sessionStorage.getItem("menuList");
	$("#nav").html(navHtml);
	dropdown();
};



