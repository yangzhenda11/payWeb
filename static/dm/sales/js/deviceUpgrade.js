$(document).ready(function () {
    $("#queryDeviceId").val("");
});
/*
 * 确认升级设备
 */
function deviceUpgradeConfirm() {
    var upgradeSerialNumList = [];
    var tab = document.getElementById('devicesTable');
    var j = 0;

    $('#devicesTable input[name="check"]:checked').each(function () {
        upgradeSerialNumList.push($(this).val());
    });

    var deviceLenth = $('input[name="check"]:checked').length;
	Messager.confirm({Msg: '确认升级当前选择的'+ deviceLenth + '台设备?', title: '升级设备'}).on(function (flag) {
        if (flag) {
            upgradeVersion(upgradeSerialNumList);
            ToolTipTop.Show("升级指令已下发到您指定的"+ deviceLenth + "台设备。","success");
        }        
    });
   
    if ($("#checkAllId").prop('checked')) {
        $("input[name = 'check']").prop('checked', false);
    } else if ($('#devicesTable input[name="check"]:checked').length > 0) {
        $('#devicesTable input[name="check"]:checked').each(function () {
            $("#devicesTable input[name = 'check']").prop('checked', false);
            j++;
        });
    }
}

function upgradeVersion(serialNumArray) {
    var upgradeSerialNumList = [];
    var tab = document.getElementById('devicesTable');
    var tab = document.getElementById('upgradeTbl');
    var appVersionMap = new Object();

    $('input[name="checkapp"]:checked').each(function () {
        appVersionMap[$(this).val()] = $("#" + $(this).val()).val();
    });

    var data = {
        "serialNumList": serialNumArray,
        "appVersionMap": appVersionMap
    };

    $.ajax({
        type: "post",
        url: '/upgrade/add',
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: 'json',
        async: false,
        success: function (result) {
        }
    });
    $('#confimUpgrade').modal('hide');
}

function getUpgradeAppVersion() {
	var deviceLenth = $('input[name="check"]:checked').length;
	var flag = 1;
	$('input[name="check"]:checked').each(function () {
		if($(this).data("connected") == false){
			flag = 0;
		}
    });
    if (deviceLenth == 0) {
    	ToolTipTop.Show("请先选择要升级的设备","error");
        return;
    }else if(flag == 0){
    	ToolTipTop.Show("请选择已连接的设备进行升级","error");
        return;
    }else{
    	$.ajax({
	        type: "GET",
	        url: '/upgrade/listApp/query',
	        contentType: "application/json",
	        dataType: 'json',
	        success: function (result) {
	            isSuccessCode(result.code);
	            var apps = result.data;
	            var html = "";
	            //apps = apps.sort();
	            for (var key in apps) {
	                html += "<tr><td style='text-align:center;'><input type='checkbox'  name='checkapp' value='" + key + "'></td><td style='text-align:center;'>" + key + "</td><td style='text-align:center;'><select id='" + key + "'>";
	                for (var j = 0; j < apps[key].length; j++) {
	                    html += "<option value='" + apps[key][j] + "'>" + apps[key][j] + "</option>"
	                }
	                html += "</select></td></tr>"
	            }
	            confimUpgradeModal();
	            $("#upgradeTbl tbody").html(html);
	        },
	        error: function () {
	        	Messager.show({Msg: '获取app更新版本失败',iconImg: 'warning', isModal: false});
	        }
	    });
    }
    
}

function chooseApp() {
    var option = $("#appNameList option:selected");
    var appName = option.val();

    $("#devicesTbody").find("tr").each(function () {
        var tdArr = $(this).children();
        var deviceId = $.trim(tdArr.eq(0).text());

        getAppVersion(deviceId);
    });
}


function confimUpgradeModal() {
    $('#confimUpgrade').modal();
}
