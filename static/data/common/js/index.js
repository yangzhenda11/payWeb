var router = new Router();
showUnwrap();	//加载顶部topbar	
showNavbar();	//加载左侧菜单栏
checkNav();		//菜单栏点击存储选中内容

/*
 * 加载路由
 */
//支付汇总
router.addroute('billSummary',function(){	
	$(function(){		
		showCheckNav();
		$("#rightContaner").load("bill/billSummary.html?"+timestamp()+" #billSummaryContainer",function(){
			$("#dynamic").html('<script src="bill/js/billSummary.js?'+timestamp()+'" type="text/javascript"></script>');
			getCustomers();
			loadExcel();
	    });
	})
});
//支付汇总（设备具体日期查询）
router.addroute('deviceBillSummary',function(){
	$(function(){
		showCheckNav();
		$("#rightContaner").load("bill/deviceBillSummary.html?"+timestamp()+" #deviceBillContainer",function(){
			$("#dynamic").html('<script src="bill/js/deviceBillSummary.js?'+timestamp()+'" type="text/javascript"></script>');
			getDeviceModelList();
	    });
	})
});
//支付明细
router.addroute('billDetails',function(){
	$(function(){		
		showCheckNav();
		$("#rightContaner").load("bill/billDetails.html?"+timestamp()+" #billDetailContainer",function(){
			$("#dynamic").html('<script src="bill/js/billDetails.js?'+timestamp()+'" type="text/javascript"></script>');			
	    });
	})
});
//退款明细
router.addroute('refoundDetails',function(){
	$(function(){
		showCheckNav();
		$("#rightContaner").load("bill/refoundDetails.html?"+timestamp()+" #refoundDetailsContainer",function(){
			$("#dynamic").html('<script src="bill/js/refoundDetails.js?'+timestamp()+'" type="text/javascript"></script>');
	    });
	})
});
router.refresh();	