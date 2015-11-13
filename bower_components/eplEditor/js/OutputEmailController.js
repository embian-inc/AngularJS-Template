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
angular.module('3mp.core.eplEditor').controller('OutputEmailController', OutputEmailController);

function OutputEmailController($scope , items, $modalInstance,$http ) {

    // default value setting
    $scope.mode = 'save';

    if (items && items.data) {
    } else {
        // 초기화
    }

    $scope.saveData = function () {
        var title = '';
        var validate = $scope.validation();
        var rowData = {
            title: title,
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

};