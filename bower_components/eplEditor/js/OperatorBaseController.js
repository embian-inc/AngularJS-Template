/*
 * GiGA IoT Platform version 2.0
 *
 *  Copyright ⓒ 2015 kt corp. All rights reserved.
 *
 *  This is a proprietary software of kt corp, and you may not use this file except in
 *  compliance with license agreement with kt corp. Any redistribution or use of this
 *  software, with or without modification shall be strictly prohibited without prior written
 *  approval of kt corp, and the copyright notice above does not evidence any actual or
 *  intended publication of such software.
 */
angular.module('3mp.core.eplEditor').controller('OperatorBaseController', OperatorBaseController);

function OperatorBaseController($scope , $modal, items, $modalInstance, dataFactory, $http) {

    $scope.isAdmin = (eventDeployType == 'admin') ? true : false;
    $scope.eventName = {};

    // default value setting
    $scope.dstrCd = dstrCd;
    $scope.svcThemeCd = svcThemeCd;
    $scope.unitSvcCd = unitSvcCd;
    $scope.mode = 'save';
    $scope.userDefineColumnList = [];
    $scope.otherDefineColumnList = [];

    $scope.evetGdList = [
        { index : "0", evetGdCd : "01", statEvetGdNm : "주의" },
        { index : "1", evetGdCd : "02", statEvetGdNm : "경고" },
        { index : "2", evetGdCd : "03", statEvetGdNm : "위험" }
    ];
    if(items && items.mode){
        $scope.mode = items.mode;
    }

    if (items && items.data) {
        $scope.statEvetNm = items.data.statEvetNm;
        $scope.dstrCd = items.data.dstrCd;
        $scope.svcThemeCd = items.data.svcThemeCd;
        $scope.unitSvcCd = items.data.unitSvcCd;
        $scope.statEvetGdDesc = items.data.statEvetGdDesc;
        if( items.data.eventGd ) {
            for (var i = 0; i < $scope.evetGdList.length; i++) {
                if (items.data.eventGd.evetGdCd == $scope.evetGdList[i].evetGdCd) {
                    $scope.eventGd = $scope.evetGdList[i];
                }
            }
        }
    } else {
        // 초기화
        $scope.statEvetNm = null;
        $scope.statEvetGdDesc = null;
        $scope.eventGd = $scope.evetGdList[0];
    }

    $scope.addColumn = function() {
        $scope.userDefineColumnList.push({type : 'default'});
    };
    $scope.delColumn = function(item) {
        var index = $scope.userDefineColumnList.indexOf(item);
        $scope.userDefineColumnList.splice(index, 1);
    };

    $scope.saveData = function () {
        var validate = $scope.validation();

        var listTemp = $scope.userDefineColumnList;
        var list = [];
        var eng_check = /^[A-za-z]*$/;
        for( var i=0; i< listTemp.length; i++){
            if( !listTemp[i].itemNm){
                alert('컬럼의 ID를 설정하여 주세요.');
                return;
            }
            if(!eng_check.test(listTemp[i].itemNm)){
                alert('컬럼의 ID는 영어로만 설정할 수 있습니다.');
                listTemp[i].itemNm = '';
                return;
            }
            list.push({
                    "itemNm" : listTemp[i].itemNm,
                    "itemHanNm" : listTemp[i].itemHanNm,
                    "statEvetNm" : '현재 이벤트'
                }
            );
        }
        if( $scope.isAdmin && $scope.otherDefineColumnList ){
            for( var i=0; i< $scope.otherDefineColumnList.length; i++){
                list.push({
                        "itemNm" : $scope.otherDefineColumnList[i].itemNm,
                        "itemHanNm" : $scope.otherDefineColumnList[i].itemHanNm,
                        "statEvetNm" : '현재 이벤트'
                    }
                );
            }
        }

        var rowData = {
            title: $scope.statEvetNm,
            statEvetNm: $scope.statEvetNm,
            dstrCd: $scope.dstrCd,
            svcThemeCd: $scope.svcThemeCd,
            unitSvcCd: $scope.unitSvcCd,
            eventGd: $scope.eventGd,
            statEvetGdDesc: $scope.statEvetGdDesc,
            eventId : $scope.eventId,
            userDefineColumnList : list,
            validate: validate
        }
        dataFactory.dstrCd = $scope.dstrCd;
        dataFactory.svcThemeCd = $scope.svcThemeCd;
        dataFactory.unitSvcCd = $scope.unitSvcCd;
        dataFactory.addCurrentEventValData(list);

        $modalInstance.close(rowData);

    };

    $scope.showEventAdminList = function () {
        var modalInstance = $modal.open({
            templateUrl: deployHtmlUrl + "eplEditor/html/InputEventPopup.html",
            controller: InputEventController,
            scope: $scope,
            windowClass: 'app-modal-window',
            size: 'lg',
            resolve: {
                items: function () {
                    var item = {
                        eventAdminListView : true
                    }
                    return item;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            //$scope.eventName = selectedItem;
            $scope.statEvetNm = selectedItem.statEvetNm;
            $scope.dstrCd = selectedItem.dstr_cd;
            $scope.svcThemeCd = selectedItem.svc_theme_cd;
            $scope.unitSvcCd = selectedItem.unit_svc_cd;
            if( selectedItem.evet_gd_cd ) {
                for (var i = 0; i < $scope.evetGdList.length; i++) {
                    if (selectedItem.evet_gd_cd == $scope.evetGdList[i].evetGdCd) {
                        $scope.eventGd = $scope.evetGdList[i];
                    }
                }
            }
            $scope.eventId = selectedItem.eventId;
            var query = '?dstrCd='+ selectedItem.dstr_cd + '&svcThemeCd=' + selectedItem.svc_theme_cd + '&unitSvcCd=' + selectedItem.unit_svc_cd +'&statEvetCd=' + selectedItem.stat_evet_cd;
            var url_temp = url_event  + '/event/eventValList' +  query;
            var response = $http.get(url_temp);
            response.success(function (data, status, headers, config) {
                var eventValList = data.data.rows;
                for(var i=0; i < eventValList.length; i++){
                    eventValList[i].statEvetNm = selectedItem.statEvetNm;
                    eventValList[i].eventId = selectedItem.eventId;
                    eventValList[i].epl_seq = selectedItem.epl_seq;
                }
                $scope.otherDefineColumnList = eventValList;
            });
            response.error(function (data, status, headers, config) {
            });

        }, function () {
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.validation = function () {
        return true;
    };

    $scope.userDefineColumnList = dataFactory.getCurrentEventValData();
};