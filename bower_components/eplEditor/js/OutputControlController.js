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
angular.module('3mp.core.eplEditor').controller('OutputControlController', OutputControlController);

function OutputControlController($scope , items, $modal, $modalInstance, $http, store) {

    $scope.isAdmin = (eventDeployType == 'admin') ? true : false;
    // default value setting
    $scope.mode = 'save';
    $scope.deviceDataList = [];
    $scope.controlList = [];
    $scope.tagStrmList = [];
    $scope.devNm = '';
    $scope.controlValue = '';
    $scope.riTypeCd = [
        //{key : '00' ,value : 'Source Type(변환 없음)'},
        {key : '01' ,value : '문자열'},
        {key : '02' ,value : 'INT'},
        //{key : '03' ,value : 'LONG'},
        //{key : '04' ,value : 'FLOAT'},
        {key : '05' ,value : 'DOUBLE'},
        //{key : '06' ,value : 'BOOLEAN'},
        {key : '07' ,value : 'Byte Array'}
        //{key : '08' ,value : 'Hex String'}
    ];
    $scope.riTypeCode = $scope.riTypeCd[0];

    $scope.changeDeviceId = function () {
        $scope.tagStrmList = [];
        $scope.devNm = '';
        if( $scope.deviceData != null){
            $scope.devNm = $scope.deviceData.devNm;
            var url_temp = url_master + '/streams/' +$scope.deviceData.svcTgtSeq+ '/' +  $scope.deviceData.spotDevSeq;
            var response = $http.get(url_temp);
            var factory = this;
            response.success(function(data, status, headers, config) {
                if( data.data ){
                    angular.forEach(data.data.rows, function(value, key) {
                        if( value.tagStrmPrpsTypeCd == '0000020'){
                            //  tagStrmPrpsTypeCdNm: "제어" 값만 리스트에 넣는다.
                            // 태그스트림에 모델값을 주입한다.
                            value.devNm =  $scope.deviceData.devNm;
                            value.devModelNm =  $scope.deviceData.devModelCd;
                            $scope.tagStrmList.push(value);
                        }
                    });
                }
            });
            response.error(function(data, status, headers, config) {
            });
        }
    };
    $scope.showDeviceAdminList = function () {

        var modalInstance = $modal.open({
            templateUrl: deployHtmlUrl + "eplEditor/html/InputDevicePopup.html",
            controller: InputDeviceController,
            scope: $scope,
            windowClass: 'app-modal-window',
            size: 'lg',
            resolve: {
                items: function () {
                    var item = {
                        deviceAdminPopupView : true
                    }
                    return item;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.deviceData = selectedItem;
            $scope.changeDeviceId();
        }, function () {
        });
    };

    $scope.createItem = function () {
        if( $scope.deviceData == null ){
            alert('디바이스를 선택하여 주세요.');
            return;
        }
        if( $scope.tagStrm == null ){
            alert('태그스트림을 선택하여 주세요.');
            return;
        }
        if( $scope.riTypeCode.key == '02'){
            if (!$scope.controlValue.match(/^\d+$/) ) {
                alert('INT형만 입력할 수 있습니다.');
                return;
            }
        }else if ( $scope.riTypeCode.key == '05'){
            if (!$scope.controlValue.match(/^[0-9]*[.][0-9]+$/) ) {
                alert('Double형만 입력할 수 있습니다.');
                return;
            }
        }else if($scope.riTypeCode.key == '08'){
            if( !($scope.controlValue.match(/^([0-9A-Fa-f]{2})+$/)) ){
                alert('잘못된 입력값 입니다.');
                return;
            }
        }
        var listData = {
            deviceData : $scope.deviceData,
            tagStrm : $scope.tagStrm,
            riTypeCode : $scope.riTypeCode,
            controlValue : $scope.controlValue
        }
        $scope.controlList.push(listData);
        $scope.riTypeCode = $scope.riTypeCd[1];
        $scope.controlValue = '';
    };
    $scope.deleteItem = function (item) {
        var index = $scope.controlList.indexOf(item);
        $scope.controlList.splice(index, 1);
    };

    $scope.saveData = function () {
        var title = '';
        var validate = $scope.validation();
        if( $scope.controlList.length > 0 ){
            title = $scope.controlList[0].tagStrm.tagStrmId + ' : ' +  $scope.controlList[0].controlValue;
            if( $scope.controlList.length > 1 ){
                title += ' 외' + ($scope.controlList.length -1) + '개';
            }
            title += '\n 항목 제어';
        }else{
            validate = false;
        }

        var rowData = {
            title: title,
            controlList: $scope.controlList,
            validate: validate
        }
        $modalInstance.close(rowData);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.validation = function () {
        return true;
    };

    $scope.init = function(pageNum, pageCon){
        var url_temp = url_master + '/protocols/' + store.get('svc_tgt_seq') + '?pageNum=' + pageNum + '&pageCon=' + pageCon ;
        var response = $http.get(url_temp);
        response.success(function (data, status, headers, config) {
            if (data.data && data.data.rows) {
                $scope.deviceDataList = data.data.rows;
            }
        });
        response.error(function (data, status, headers, config) {
            //alert( "Exception details: " + JSON.stringify({data: data}));
        });
        if (items && items.data) {
            angular.copy(items.data.controlList, $scope.controlList);
        } else {
            // 초기화
        }

    };

    $scope.init(1, 100);

};