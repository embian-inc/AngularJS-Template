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
angular.module('3mp.core.eplEditor').controller('OperatorEPLController', OperatorEPLController);

function OperatorEPLController($scope , items, $modalInstance,$http ) {

    // default value setting
    $scope.EPLString = '';
    $scope.mode = 'save';

    if(items && items.mode){
        $scope.mode = items.mode;
    }

    if (items && items.data) {
        $scope.EPLString = items.data.EPLString;
    } else {
        // 초기화
        $scope.EPLString = '';
    }

    $scope.saveData = function () {
        var EPLString = $scope.EPLString;
        
        var requestParam = {
            "eplString": EPLString
        };
        
        var url_temp = url_event + '/validateEpl';
        var response = $http.post(url_temp, requestParam);
        response.success(function (data, status, headers, config) {
            var validate = false;
            if( data.responseCode == 'OK' && data.data == true){
                validate = true;
            }else{
                validate = false;
            }
            var rowData = {
                title: $scope.statEvetNm,
                EPLString: EPLString,
                validate: validate
            }
            $modalInstance.close(rowData);
        })
        response.error(function (data, status, headers, config) {
            var validate = false;
            var rowData = {
                title: $scope.statEvetNm,
                EPLString: EPLString,
                validate: validate
            }
            $modalInstance.close(rowData);
        });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

};