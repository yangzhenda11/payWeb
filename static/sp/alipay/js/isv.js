var paramsJSON;
$(function() {
    var url = location.search.slice(1);
    // var url = "http://beta3.semoor.net/o2o_alipay/isv.php?id=24&client_id=812&app_id=2016071701630800&source=alipay_app_auth&app_auth_code=57bf6c9d08c243f69619f8880382bE00";
    // var url = "http://dm.2dupay.com?app_id=2016012901129787&source=alipay_app_auth&app_auth_code=49bbf888e1df4de8ab4dcd16eb047E00&customerId=39";
    //var url = "http://dm.testing.2dupay.com/sp/alipay/isv.html?customerId=138&app_id=2017032706430799&source=alipay_app_auth&app_auth_code=07e9137e9f514fffa8a76c19e84f3X86"
    console.log("url: " + url);
    paramsJSON = getQueryString(url);
    //获取customerName
    getCustomerNameByAppId(paramsJSON.customerId);
});

function getTokenByAuthCode() {

    $.ajax({
        type: "POST",
        url: "/isv/getTokenByAuthCode",
        data: JSON.stringify(paramsJSON),
        dataType: 'json',
        contentType: 'application/json',
        success: function (result) {
            if (result.code == "SUCCESS") {
                $("#content").css("display","none");
                $("#successDiv").css("display","block");
            } else {
            	var ms = result.sub_msg;
                $("#failureValue").text(ms);
                $("#content").css("display","none");
                $("#failureDiv").css("display","block");
            }
        }

    });

}

function getCustomerNameByAppId(customerId) {
    var data = {};
    data.customerId = customerId;
    $.ajax({
        type: "POST",
        url: "/isv/getNameByCustomerId",
        data: customerId,
        dataType: 'json',
        contentType: 'application/json',
        success: function (result) {
            $("#customerName").text(result.customerName);
        }
    });
}

function getQueryString(url) {

    if(url) {
        //字符串截取，比我之前的split()方法效率高
        url=url.substr(url.indexOf("?")+1);
    }
    //创建一个对象，用于存name，和value
    var result = {};
    //location.search设置或返回从问号 (?) 开始的 URL（查询部分）。
    var queryString = url || location.search.substring(1);
    //param array
    var paramArray = [] ;
    var re = /([^&=]+)=([^&]*)/g;
    //exec()正则表达式的匹配，具体不会用
    while (paramArray = re.exec(queryString)) {
        //使用 decodeURIComponent() 对编码后的 URI 进行解码
        result[decodeURIComponent(paramArray[1])] = decodeURIComponent(paramArray[2]);
    };
	var appId = result.app_id;
	var appAuthCode = result.app_auth_code;
	delete result.app_id;
	delete result.app_auth_code;
	result.appId = appId;
	result.appAuthCode = appAuthCode;
    console.log(result);	
    return result;
}