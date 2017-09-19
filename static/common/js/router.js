 var Router = (function(){
 	var hashroute = {};
 	//添加一个动态路由集合
 	var regextroute = [];
 	function hashchange(){
		var url = window.location.hash;
		var location = window.location.hash;
		location = location.replace(/^#/g,"").split("?")[1]; //清除开头的 # 字符
		url = url.replace(/^#/g,"").split("?")[0]; //清除开头的 # 字符
		var state = true; //假设静态固定的路由里面匹配不到此次触发的地址
		//判断 url 是否在路由中
		if(url && url in hashroute){
			state = false; //假设条件不成立，已经匹配到
			//循环执行添加的路由
			hashroute[url].forEach(function(hook) {
				//将当前触发的路由地址传入回去
				hook(url);
			});
		}
		if(state == true){
			//循环以前的所有路由，依次匹配保存的路由
			for(var i=0 , len = regextroute.length; i < len;i++){
				var item = regextroute[i];
				//测试字符串是否匹配正则条件
				if(item.reg.test(url)){
					//循环勾子中的回调函数
					item.hooks.forEach(function(hook) {
						hook(url);
					});
					break;
				}
			}
		}
	}
	//监听地址栏 hahs 参数值的变化
	window.addEventListener("hashchange", function(){
		//变化后调用地址栏 hash 值的解析
		hashchange(); 
	});
 	function main(){
 		//添加路由
		this.addroute = function(url,hook){
			switch (typeof url) {
				//固定的字符串格式路由
				case "string":
					//判断路由是否存在
					if(url in hashroute){
						//存在的情况下将回调函数添加到路由对应的值中
						hashroute[url].push(hook);
					}else{
						//不存在直接将回调函数保存起来
						hashroute[url] = [hook];
					}
					break;
				case "object":
					//假设以前没有添加该路由
					var state = true; 
					//循环以前的所有路由，依次判断新添加的路有以前是否添加过
					for(var i=0 , len = regextroute.length; i < len;i++){
						var item = regextroute[i];
						var reg = item.reg;
						//判断两个正则的匹配条件是否相同
						//在匹配两个正则的修饰符是否相同
						if(reg.source == url.source && reg.flags == url.flags){
							//把回调函数添加到勾子中
							item.hooks.push(hook);
							//上面的假设条件不成立，因为比对到相同的正则
							state = false;
							break;
						}
					}
					//假设条件成立
					if(state == true){
						//将新的路有添加到集合中
						regextroute.push({
							"reg" : url,
							"hooks" : [ hook ]
						});
					}
					break;
				default:
					// statements_def
					break;
			}
		}
		//更新当前路由
		this.refresh = function(){
			hashchange(); 
		};
 	}
 	return main;
 })();