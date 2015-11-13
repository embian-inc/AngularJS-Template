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
angular.module('3mp.core.eplEditor').controller('InputEventController', InputEventController);

function InputEventController($scope , items, $http,$modal, $modalInstance, dataFactory, store) {
    var elementId = items.elementId;
    var previousEventData = null;
    $scope.isAdmin = (eventDeployType == 'admin') ? true : false;
    $scope.eventAdminListView = false;
    if( items && items.eventAdminListView == true){
        $scope.eventAdminListView = true;
    }
    $scope.evnetDataAdminList = {
        rows:[
        ]
    };

    $scope.saveData = function() {
        if( !$scope.eventName ){
            alert('이벤트를 선택하여 주세요.');
            return;
        }
        if( !$scope.eventAlias ){
            alert('별칭을 입력하여 주세요.');
            return;
        }
        var eng_check = /^[A-za-z]*$/;
        if(!eng_check.test($scope.eventAlias)){
            alert("영어만 입력할 수 있습니다.");
            $scope.eventAlias="";
            return false;
        }
        if( dataFactory.bookedKeyword.indexOf($scope.eventAlias.toLocaleLowerCase()) > -1 ){
            alert("예약어는 입력할 수 없습니다.");
            $scope.eventAlias="";
            return false;
        }
        if( previousEventData != null && previousEventData.epl_seq != $scope.eventName.epl_seq){
            // 이전에 설정해 놓았던 이벤트가 변경이 되었다면, 이전에 선택되었던 이벤트를 사용하였던 도형들을 찾아서 에러로 표시를 해준다.
            var data = dataFactory.getInputDataByEleId('event', previousEventData.eventId);
            if( data != null ){
                var canvas = dataFactory.getEditorCanvas();
                for(var i=0; i <data.length; i++){
                    var errorElement = canvas.getElementById(data[i].elementId);
                    if( errorElement ){
                        $scope.validationDraw(errorElement, 'error');
                    }
                }
            }
        }

        var title = '이름 : ' + $scope.eventName.statEvetNm + '\n';
            title += '별칭 : ' + $scope.eventAlias;
        var validate = $scope.validation();
        var rowData = {
            title : title,
            validate : validate,
            eventName : $scope.eventName,
            eventAlias : $scope.eventAlias
        }
        // main.js $scope.inputDataLoad() 와 연관되기 때문에 추가시 변경을 해줘야함
        dataFactory.eventDataInitSetting(elementId, $scope.eventName, $scope.eventAlias);

        $modalInstance.close(rowData);
    };

    /*******************************************
     * Admin 검색관련 셋팅 시작
     ******************************************/

    $scope.selectRow = function (selectData) {
        $scope.eventName = selectData;
    };
    $scope.changePage = function(page, rowNum) {
        $scope.init(page, rowNum);
    };
    $scope.selectData = function() {
        if( !$scope.eventName ){
            alert('이벤트를 선택하여 주세요');
            return;
        }
        $modalInstance.close($scope.eventName);
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
            $scope.eventName = selectedItem;

        }, function () {
        });
    };

    $scope.searchList = function(searchEventName, searchStatEvetCd, searchTagStrm, searchDstrCd , searchSvcThemeCd , searchUnitSvcCd){
        $scope.searchEventName = searchEventName;
        $scope.searchStatEvetCd = searchStatEvetCd;
        $scope.searchTagStrm = searchTagStrm;
        $scope.searchDstrCd = searchDstrCd;
        $scope.searchSvcThemeCd = searchSvcThemeCd;
        $scope.searchUnitSvcCd = searchUnitSvcCd;
        $scope.init(1, 10);
    };
    $scope.dstrCdList = [];
    $scope.svcThemeCdList = [];
    $scope.unitSvcCdList = [];
    $scope.getDstrCdList = function(){
        var url_temp = url_master  + '/svcs/dstr';
        var response = $http.get(url_temp);
        response.success(function (data, status, headers, config) {
            $scope.dstrCdList = data.data.rows;
        });
        response.error(function (data, status, headers, config) {
        });
    };
    $scope.getSvcThemeCdList = function(dstr){
        if( dstr && dstr != '' ){
            var url_temp = url_master  + '/svcs/dstr/'+dstr;
            var response = $http.get(url_temp);
            response.success(function (data, status, headers, config) {
                $scope.svcThemeCdList = data.data.rows;
            });
            response.error(function (data, status, headers, config) {
            });
        }

    };
    $scope.getUnitSvcCdList = function(dstr, svcThemeCd){
        if( dstr && dstr != '' && svcThemeCd && svcThemeCd != '') {
            var url_temp = url_master + '/svcs/dstr/' + dstr + '/svcTheme/' + svcThemeCd;
            var response = $http.get(url_temp);
            response.success(function (data, status, headers, config) {
                $scope.unitSvcCdList = data.data.rows;
            });
            response.error(function (data, status, headers, config) {
            });
        }
    };
    /*******************************************
     * Admin 검색관련 셋팅 끝
     ******************************************/

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.validation = function () {
        if( !$scope.eventName || !$scope.eventAlias ){
            return false;
        }
        return true;
    };

    $scope.init = function(pageNum, pageCon){
        if( ($scope.isAdmin && $scope.eventAdminListView) || (!$scope.isAdmin && !$scope.eventLists) ){
            var url_temp = url_event  + '/event/eventList?pageNum=' + pageNum + '&pageCon=' + pageCon
                + '&svcTgtSeq=' + store.get('svc_tgt_seq') + '&mbrId=' + store.get('mbr_id');
            if($scope.isAdmin){   // admin 일때?
                url_temp = url_event  + '/event/eventList?pageNum=' + pageNum + '&pageCon=' + pageCon ;
                if($scope.searchDstrCd){
                    url_temp += '&dstrCd=' + $scope.searchDstrCd.dstrCd ;
                }
                if($scope.searchSvcThemeCd){
                    url_temp += '&svcThemeCd=' + $scope.searchSvcThemeCd.svcThemeCd ;
                }
                if($scope.searchUnitSvcCd){
                    url_temp += '&unitSvcCd=' + $scope.searchUnitSvcCd.unitSvcCd ;
                }
                if($scope.searchEventName && $scope.searchEventName != '' ){
                    url_temp += '&searchEventName=' + $scope.searchEventName ;
                }
                if($scope.searchStatEvetCd && $scope.searchStatEvetCd != ''){
                    url_temp += '&searchStatEvetCd=' + $scope.searchStatEvetCd ;
                }
                if($scope.searchTagStrm && $scope.searchTagStrm != ''){
                    url_temp += '&searchTagStrm=' + $scope.searchTagStrm ;
                }
            }
            var response = $http.get(url_temp);
            response.success(function (data, status, headers, config) {
                if( $scope.isAdmin){
                    if( data.data.rows && data.data.rows.length > 0 ){
                        $scope.evnetDataAdminList.rows =  data.data.rows;
                        $scope.evnetDataAdminList.total = parseInt( data.data.total / pageCon ) + (parseInt( data.data.total % pageCon ) == 0 ? '' : 1) ;
                        $scope.evnetDataAdminList.page = data.data.page;
                    }else{
                        $('#eventListGrid-emptyMsg').html( "<div style='font-size:8pt;text-align:center;padding:10px;height:auto'>데이터가 없습니다.</div>" );
                    }
                }else {
                    $scope.eventLists = data.data.rows;
                    if (items && items.data) {
                        angular.forEach(data.data.rows, function (value, key) {
                            if (value.epl_seq == items.data.eventName.epl_seq) {
                                $scope.eventName = value;
                                previousEventData = value;
                            }
                        });
                        $scope.eventAlias = items.data.eventAlias;
                    }
                }
            });
            response.error(function (data, status, headers, config) {
                alert("Exception details: " + JSON.stringify({data: data}));
            });
        }else{
            if( items && items.data ){
                $scope.eventName = items.data.eventName;
                previousEventData = items.data.eventName;
                $scope.eventAlias = items.data.eventAlias;
            }else{
                $scope.eventName = null;
                $scope.eventAlias = null;
            }
        }

    };
    $scope.init(1, 10);
    if($scope.isAdmin){
        $scope.getDstrCdList();
    }

};
