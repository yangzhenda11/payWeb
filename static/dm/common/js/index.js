var router = new Router();
showUnwrap();	//加载顶部topbar	
showNavbar();	//加载左侧菜单栏
checkNav();		//菜单栏点击存储选中内容

/*
 * 加载路由
 */
//生产管理_设备申请
router.addroute('applyDeviceIds',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("factory/applyDeviceIds.html?"+timestamp()+" #applyDeviceIdsContainer",function(){
			var dynamicHtml = '<script src="factory/js/applyDeviceIds.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//生产管理_新增设备类型
router.addroute('addDeviceType',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("factory/addDeviceType.html?"+timestamp()+" #addDeviceTypeContainer",function(){
			var dynamicHtml = '<script src="factory/js/addDeviceType.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//生产管理_生产设备列表
router.addroute('factoryDeviceList',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("factory/factoryDeviceList.html?"+timestamp()+" #deviceListContainer",function(){
			var dynamicHtml = '<script src="factory/js/factoryDeviceList.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//服务商管理
router.addroute('customer',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("customer/customer.html?"+timestamp()+" #customerContainer",function(){
			var dynamicHtml = '<script src="customer/js/customer.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//服务商管理_增加服务商
router.addroute('customerAdd',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("customer/customerAdd.html?"+timestamp()+" #customerAddContainer",function(){
			var dynamicHtml = '<script src="customer/js/customerAdd.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//服务商管理_服务商详情
router.addroute('customerDetail',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("customer/customerDetail.html?"+timestamp()+" #customerDetailContainer",function(){
			var dynamicHtml = '<script src="customer/js/customerDetail.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//服务商管理_修改服务商
router.addroute('customerUpdate',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("customer/customerUpdate.html?"+timestamp()+" #customerUpdateContainer",function(){
			var dynamicHtml = '<script src="customer/js/customerUpdate.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//服务商管理 _服务商设备列表
router.addroute('customerDeviceList',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("customer/customerDeviceList.html?"+timestamp()+" #customerDeviceListContainer",function(){
			var dynamicHtml = '<script src="customer/js/customerDeviceList.js?v=17050901"></script>'+
								'<script src="sales/js/deviceUpgrade.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//服务商管理 _服务商设备列表_设备详情
router.addroute('customerDeviceDetalis',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("customer/customerDeviceDetails.html?"+timestamp()+" #customerDeviceDetailsContainer",function(){
			var dynamicHtml = '<script src="sales/js/deviceDetails.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//未销售设备列表
router.addroute('bindDeviceCustomer',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("sales/bindDeviceCustomer.html?"+timestamp()+" #bindDeviceCustomerContainer",function(){
			var dynamicHtml = '<script src="sales/js/bindDeviceCustomer.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//已销售设备列表
router.addroute('checkBoundDevice',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("sales/checkBoundDevice.html?"+timestamp()+" #checkBoundDeviceContainer",function(){
			var dynamicHtml = '<script src="sales/js/checkBoundDevice.js?v=17050901"></script>'+
								'<script src="sales/js/deviceUpgrade.js?v=17050901"></script>'
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//已销售设备列表_设备详情
router.addroute('checkBoundDeviceDetails',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("sales/checkBoundDeviceDetails.html?"+timestamp()+" #checkBoundDeviceDetailsContainer",function(){
			var dynamicHtml = '<script src="sales/js/deviceDetails.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//设备状态监控
router.addroute('deviceStatus',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("sales/deviceStatus.html?"+timestamp()+" #deviceStatusContainer",function(){
			var dynamicHtml = '<script src="sales/js/deviceStatus.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//设备状态监控_设备详情
router.addroute('deviceStatusDetails',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("sales/deviceStatusDetails.html?"+timestamp()+" #deviceStatusDetailsContainer",function(){
			var dynamicHtml = '<script src="sales/js/deviceDetails.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//设备列表
router.addroute('deviceList',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("sales/deviceList.html?"+timestamp()+" #deviceListContainer",function(){
			var dynamicHtml = '<script src="sales/js/deviceList.js?v=17050901"></script>'+
								'<script src="sales/js/deviceUpgrade.js?v=17050901"></script>'
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//设备列表_设备详情
router.addroute('deviceDetails',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("sales/deviceDetails.html?"+timestamp()+" #deviceDetailsContainer",function(){
			var dynamicHtml = '<script src="sales/js/deviceDetails.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//支付通道列表
router.addroute('payChannelList',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("configuration/payChannelList.html?"+timestamp()+" #payChannelListContainer",function(){
			var dynamicHtml = '<script src="configuration/js/payChannelList.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//支付通道列表_添加支付通道
router.addroute('payChannelAdd',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("configuration/payChannelAdd.html?"+timestamp()+" #payChannelAddContainer",function(){
			var dynamicHtml = '<script src="configuration/js/payChannelAdd.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//支付通道列表_支付通道详情
router.addroute('payChannelDetails',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("configuration/payChannelDetails.html?"+timestamp()+" #payChannelDetailsContainer",function(){
			var dynamicHtml = '<script src="configuration/js/payChannelDetails.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//支付通道列表_支付通道修改
router.addroute('payChannelConfig',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("configuration/payChannelConfig.html?"+timestamp()+" #payChannelConfigContainer",function(){
			var dynamicHtml = '<script src="configuration/js/payChannelConfig.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//设备配置列表
router.addroute('deviceConfigList',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("configuration/deviceConfigList.html?"+timestamp()+" #deviceConfigListContainer",function(){
			var dynamicHtml = '<script src="configuration/js/deviceConfigList.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//设备配置列表_新增设备配置
router.addroute('addDeviceConfig',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("configuration/deviceConfigAdd.html?"+timestamp()+" #addDeviceConfigContainer",function(){
			var dynamicHtml = '<script src="configuration/js/deviceConfigAdd.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//设备配置列表_设备配置详情
router.addroute('deviceConfigDetails',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("configuration/deviceConfigDetails.html?"+timestamp()+" #deviceConfigDetailsContainer",function(){
			var dynamicHtml = '<script src="configuration/js/deviceConfigDetails.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//设备配置列表_设备配置修改
router.addroute('deviceConfigUpdate',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("configuration/deviceConfigUpdate.html?"+timestamp()+" #deviceConfigUpdateContainer",function(){
			var dynamicHtml = '<script src="configuration/js/deviceConfigUpdate.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//设备配置列表_设备配置设备列表
router.addroute('configuredDeviceList',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("configuration/configuredDeviceList.html?"+timestamp()+" #configuredDeviceContainer",function(){
			var dynamicHtml = '<script src="configuration/js/configuredDeviceList.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//设备配置列表_设备配置设备列表_新增设备
router.addroute('unconfiguredDeviceList',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("configuration/unconfiguredDeviceList.html?"+timestamp()+" #unconfigredDeviceContainer",function(){
			var dynamicHtml = '<script src="configuration/js/unconfigredDeviceList.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//设备配置列表——小票解析
router.addroute('resolve',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("configuration/resolveList.html?"+timestamp()+" #resolveListContainer",function(){
			var dynamicHtml = '<script src="configuration/js/resolveList.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);

	    });
	})
});
//设备配置列表——小票解析_新增小票模板
router.addroute('resolveAdd',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("configuration/resolveEdit.html?"+timestamp()+" #resolveAddContainer",function(){
			var dynamicHtml = '<script src="configuration/js/resolveEdit.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
			getCustomers();
		});
	})
})
//设备配置列表——小票解析_详情页面
router.addroute('resolveDetail',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("configuration/resolveEdit.html?"+timestamp()+" #resolveDetailContainer",function(){
			var dynamicHtml = '<script src="configuration/js/resolveEdit.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
			viewDetails("resolveDetail");
		});
	})
})
//设备配置列表——小票解析_修改页面
router.addroute('resolveConfig',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("configuration/resolveEdit.html?"+timestamp()+" #resolveConfigContainer",function(){
			var dynamicHtml = '<script src="configuration/js/resolveEdit.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
			viewDetails("resolveEdit");
		});
	})
})
//设备配置列表——小票解析_小票模板绑定设备
router.addroute('resolveDeviceList',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("configuration/resolveDeviceList.html?"+timestamp()+" #resolveDeviceContainer",function(){
			var dynamicHtml = '<script src="configuration/js/resolveDeviceList.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);			
		});
	})
})
//设备配置列表——小票解析_小票模板绑定设备_新增设备
router.addroute('resolveDeviceAdd',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("configuration/resolveDeviceAdd.html?"+timestamp()+" #resolveDeviceAddContainer",function(){
			var dynamicHtml = '<script src="configuration/js/resolveDeviceAdd.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);			
		});
	})
})
//用户列表
router.addroute('userList',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("user/userList.html?"+timestamp()+" #userListContainer",function(){
			var dynamicHtml = '<script src="user/js/user.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//用户列表_新增用户
router.addroute('userAdd',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("user/userEdit.html?"+timestamp()+" #userAddContainer",function(){
			var dynamicHtml = '<script src="user/js/userEdit.js?v=17050901"></script>';	
			$("#dynamic").html(dynamicHtml);
			getSpList();
			getRoleList();
			validator();
	    });
	})
});
//用户列表_用户信息详情
router.addroute('userDetails',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("user/userEdit.html?"+timestamp()+" #userDetailsContainer",function(){
			var dynamicHtml = '<script src="user/js/userEdit.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
			userDetails();
	    });
	})
});
//用户列表_编辑用户
router.addroute('userUpdate',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("user/userEdit.html?"+timestamp()+" #userUpdateContainer",function(){
			var dynamicHtml = '<script src="user/js/userEdit.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
			userEdit();
			varligate();
	    });
	})
});
/*
 * 公用加载方法
 */
function commonFn(){
	//clearDynamic();
	showCheckNav();
}
router.refresh();	
