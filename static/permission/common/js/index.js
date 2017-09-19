var router = new Router();
showUnwrap();	//加载顶部topbar	
showNavbar();	//加载左侧菜单栏
checkNav();		//菜单栏点击存储选中内容

/*
 * 加载路由
 */
//字典管理
router.addroute('dictionaryList',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("resource/dictionaryList.html?"+timestamp()+" #dictionaryListContainer",function(){
			var dynamicHtml = '<script src="resource/js/dictionaryList.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//字典管理_字典新增
router.addroute('dictionaryAdd',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("resource/dictionaryEdit.html?"+timestamp()+" #dictionaryAddContainer",function(){
			var dynamicHtml = '<script src="resource/js/dictionaryEdit.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
			queryParent();
			validator();
	    });
	})
});
//字典管理_字典修改
router.addroute('dictionaryEdit',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("resource/dictionaryEdit.html?"+timestamp()+" #dictionaryEditContainer",function(){
			var dynamicHtml = '<script src="resource/js/dictionaryEdit.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
			editDictionary();
			varligate();
	    });
	})
});
//字典管理_字典详情
router.addroute('dictionaryDetail',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("resource/dictionaryEdit.html?"+timestamp()+" #dictionaryDetailContainer",function(){
			var dynamicHtml = '<script src="resource/js/dictionaryEdit.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
			dictionaryDetails();
	    });
	})
});
//系统资源包管理
router.addroute('systemResourcePack',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("resource/systemResourcePack.html?"+timestamp()+" #resourcePackContainer",function(){
			var dynamicHtml = '<script src="resource/js/systemResourcePack.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//系统资源包管理_新增
router.addroute('uploadSystemPack',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("resource/uploadSystemPack.html?"+timestamp()+" #uploadResourceContainer",function(){
			var dynamicHtml = '<script src="resource/js/uploadSystemPackFileinput.js?v=17050901" type="text/javascript" charset="utf-8"></script>'+
								'<script src="resource/js/uploadSystemPack.js?v=17050901"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//模块管理
router.addroute('systemList',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("systemMenu/systemList.html?"+timestamp()+" #systemListContainer",function(){
			var dynamicHtml = '<script src="systemMenu/js/systemList.js?v=17050901" type="text/javascript" charset="utf-8"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//模块管理_模块新增
router.addroute('systemAdd',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("systemMenu/systemEdit.html?"+timestamp()+" #systemAddContainer",function(){
			var dynamicHtml = '<script src="systemMenu/js/systemEdit.js?v=17050901" type="text/javascript" charset="utf-8"></script>';
			$("#dynamic").html(dynamicHtml);
			validator();
	    });
	})
});
//模块管理_模块修改
router.addroute('systemEdit',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("systemMenu/systemEdit.html?"+timestamp()+" #systemEditContainer",function(){
			var dynamicHtml = '<script src="systemMenu/js/systemEdit.js?v=17050901" type="text/javascript" charset="utf-8"></script>';
			$("#dynamic").html(dynamicHtml);
			editSystem();
			varligate();
	    });
	})
});
//模块管理_模块详情
router.addroute('systemDetail',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("systemMenu/systemEdit.html?"+timestamp()+" #systemDetailContainer",function(){
			var dynamicHtml = '<script src="systemMenu/js/systemEdit.js?v=17050901" type="text/javascript" charset="utf-8"></script>';
			$("#dynamic").html(dynamicHtml);
			systemDetail();
	    });
	})
});
//功能管理
router.addroute('menuFunctionList',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("systemMenu/menuFunctionList.html?"+timestamp()+" #menuFunctionListContainer",function(){
			var dynamicHtml = '<script src="systemMenu/js/menuFunctionList.js?v=17050901" type="text/javascript" charset="utf-8"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//功能管理_新增功能
router.addroute('menuFunctionAdd',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("systemMenu/menuFunctionEdit.html?"+timestamp()+" #menuFunctionAddContainer",function(){
			var dynamicHtml = '<script src="systemMenu/js/menuFunctionEdit.js?v=17050901" type="text/javascript" charset="utf-8"></script>';
			$("#dynamic").html(dynamicHtml);
			validator();
	    });
	})
});
//功能管理_功能详情
router.addroute('menuFunctionDetail',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("systemMenu/menuFunctionEdit.html?"+timestamp()+" #menuFunctionDetailContainer",function(){
			var dynamicHtml = '<script src="systemMenu/js/menuFunctionEdit.js?v=17050901" type="text/javascript" charset="utf-8"></script>';
			$("#dynamic").html(dynamicHtml);
			functionDetail();
	    });
	})
});
//功能管理_功能修改
router.addroute('menuFunctionEdit',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("systemMenu/menuFunctionEdit.html?"+timestamp()+" #menuFunctionEditContainer",function(){
			var dynamicHtml = '<script src="systemMenu/js/menuFunctionEdit.js?v=17050901" type="text/javascript" charset="utf-8"></script>';
			$("#dynamic").html(dynamicHtml);
			editFunction();
			varligate();
	    });
	})
});
//菜单管理
router.addroute('menuList',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("systemMenu/menuList.html?"+timestamp()+" #menuListContainer",function(){
			var dynamicHtml = '<script src="systemMenu/js/menuList.js?v=17050901" type="text/javascript" charset="utf-8"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//菜单管理_菜单详情
router.addroute('menuDetail',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("systemMenu/menuListEdit.html?"+timestamp()+" #menuDetaliContainer",function(){
			var dynamicHtml = '<script src="systemMenu/js/menuListEdit.js?v=17050901" type="text/javascript" charset="utf-8"></script>';
			$("#dynamic").html(dynamicHtml);
			menuDetail();
	    });
	})
});
//菜单管理_新增菜单
router.addroute('menuAdd',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("systemMenu/menuListEdit.html?"+timestamp()+" #menuAddContainer",function(){
			var dynamicHtml = '<script src="systemMenu/js/menuListEdit.js?v=17050901" type="text/javascript" charset="utf-8"></script>';
			$("#dynamic").html(dynamicHtml);
			addMenuSet();
	    });
	})
});
//菜单管理_增加菜单功能
router.addroute('menuEdit',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("systemMenu/menuListEdit.html?"+timestamp()+" #menuEditContainer",function(){
			var dynamicHtml = '<script src="systemMenu/js/menuListEdit.js?v=17050901" type="text/javascript" charset="utf-8"></script>';
			$("#dynamic").html(dynamicHtml);
			editMenu();
	    });
	})
});
//菜单管理_增加菜单功能
router.addroute('addMenuFunction',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("systemMenu/addMenuFunction.html?"+timestamp()+" #addMenuFunctionContainer",function(){
			var dynamicHtml = '<script src="systemMenu/js/addMenuFunction.js?v=17050901" type="text/javascript" charset="utf-8"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//角色授权管理
router.addroute('roleList',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("roleAuth/roleList.html?"+timestamp()+" #roleListContainer",function(){
			var dynamicHtml = '<script src="roleAuth/js/roleList.js?v=17050901" type="text/javascript" charset="utf-8"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//角色授权管理_角色下用户列表
router.addroute('roleUserList',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("roleAuth/roleUserList.html?"+timestamp()+" #roleUserListContainer",function(){
			var dynamicHtml = '<script src="roleAuth/js/roleUserList.js?v=17050901" type="text/javascript" charset="utf-8"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//角色授权管理_角色授权
router.addroute('accredit',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("roleAuth/accredit.html?"+timestamp()+" #accreditContainer",function(){
			var dynamicHtml = '<script src="roleAuth/js/accredit.js?v=17050901" type="text/javascript" charset="utf-8"></script>';
			$("#dynamic").html(dynamicHtml);
	    });
	})
});
//角色授权管理_角色增加
router.addroute('roleAdd',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("roleAuth/roleEdit.html?"+timestamp()+" #roleAddContainer",function(){
			var dynamicHtml = '<script src="roleAuth/js/roleEdit.js?v=17050901" type="text/javascript" charset="utf-8"></script>';
			$("#dynamic").html(dynamicHtml);
			addRoleFill();
			queryParent();
			validator();
	    });
	})
});
//角色授权管理_角色详情
router.addroute('roleDetail',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("roleAuth/roleEdit.html?"+timestamp()+" #roleDetailContainer",function(){
			var dynamicHtml = '<script src="roleAuth/js/roleEdit.js?v=17050901" type="text/javascript" charset="utf-8"></script>';
			$("#dynamic").html(dynamicHtml);
			roleDetail();
	    });
	})
});
//角色授权管理_角色编辑
router.addroute('roleEdit',function(){
	$(function(){
		commonFn();
		$("#rightContaner").load("roleAuth/roleEdit.html?"+timestamp()+" #rolrEditContainer",function(){
			var dynamicHtml = '<script src="roleAuth/js/roleEdit.js?v=17050901" type="text/javascript" charset="utf-8"></script>';
			$("#dynamic").html(dynamicHtml);
			editRole();
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