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
angular.module('3mp.core.eplEditor').controller('InputScheduleController', InputScheduleController);

function InputScheduleController($scope , items, $http,$modal, $modalInstance, $filter) {
    var elementId = items.elementId;
    $scope.isAdmin = (eventDeployType == 'admin') ? true : false;

    $scope.year = [];
    $scope.month = [];
    $scope.days = [];
    $scope.hours = [];
    $scope.minutes = [];
    $scope.seconds = [];

    $scope.$watch('data.date', function (newValue) {
        if( newValue ){
            $scope.stTime = $filter('date')(newValue, 'yyyy-MM-dd HH:mm');
        }
    });

    $scope.saveData = function() {
        var title = '';
        // 실제 스케쥴링을 적용할때 쓰이는 데이터는 serverSideScheduleData 이다.
        var serverSideScheduleData = "iso: 'R-1/";
        if( $scope.stTime ){
            title += '날짜 : ' + $scope.stTime + '\n';
            var tepmTime = $scope.stTime.replace(' ' , 'T');
            // ISO 타입으로 변경
            serverSideScheduleData += tepmTime + ':00Z';
        }
        if( $scope.yearSelect != 0 || $scope.monthSelect != 0 || $scope.daysSelect != 0
            || $scope.hoursSelect != 0 || $scope.minutesSelect != 0 || $scope.secondsSelect != 0){
            var str = 'P';
            if( $scope.yearSelect != 0 ){
                str += $scope.yearSelect + 'Y';
            }
            if( $scope.monthSelect != 0 ){
                str += $scope.monthSelect + 'M';
            }
            if( $scope.daysSelect != 0 ){
                str += $scope.daysSelect + 'D';
            }
            if( $scope.hoursSelect != 0 || $scope.minutesSelect != 0 || $scope.secondsSelect != 0 ){
                str += 'T';
            }
            if( $scope.hoursSelect != 0 ){
                str += $scope.hoursSelect + 'H';
            }
            if( $scope.minutesSelect != 0 ){
                str += $scope.minutesSelect + 'M';
            }
            if( $scope.secondsSelect != 0 ){
                str += $scope.secondsSelect + 'S';
            }
            title += '기간 : ' + str;
            if( $scope.stTime ){
                serverSideScheduleData += '/';
            }
            serverSideScheduleData += str + '\'';
        }

        var validate = $scope.validation();

        var rowData = {
            title : title,
            validate : validate,
            scheduleData : serverSideScheduleData,
            stTime : $scope.stTime,
            yearSelect : $scope.yearSelect,
            monthSelect : $scope.monthSelect,
            daysSelect : $scope.daysSelect,
            hoursSelect : $scope.hoursSelect,
            minutesSelect : $scope.minutesSelect,
            secondsSelect : $scope.secondsSelect
        }

        $modalInstance.close(rowData);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.validation = function () {
        return true;
    };
    $scope.clearTime = function () {
        $scope.stTime = $filter('date')('', 'yyyy-MM-dd HH:mm');
    };
    $scope.clearPeriod = function () {
        $scope.yearSelect =  $scope.year[0];
        $scope.monthSelect =  $scope.month[0];
        $scope.daysSelect =  $scope.days[0];
        $scope.hoursSelect =  $scope.hours[0];
        $scope.minutesSelect =  $scope.minutes[0];
        $scope.secondsSelect =  $scope.seconds[0];
    };

    $scope.init = function(){
        // 시간 데이터 셋팅
        for(var i=0;i<=10;i++) {
            $scope.year.push(i);
        }
        for(var i=0;i<=12;i++) {
            $scope.month.push(i);
        }
        for(var i=0;i<=31;i++) {
            $scope.days.push(i);
        }
        for(var i=0;i<=24;i++) {
            $scope.hours.push(i);
        }
        for(var i=0;i<=60;i++) {
            $scope.minutes.push(i);
        }
        for(var i=0;i<=60;i++) {
            $scope.seconds.push(i);
        }
        if( items && items.data ){
            $scope.yearSelect = items.data.yearSelect;
            $scope.monthSelect = items.data.monthSelect;
            $scope.daysSelect = items.data.daysSelect;
            $scope.hoursSelect = items.data.hoursSelect;
            $scope.minutesSelect = items.data.minutesSelect;
            $scope.secondsSelect = items.data.secondsSelect;
            $scope.stTime = $filter('date')(items.data.stTime, 'yyyy-MM-dd HH:mm');
        }else{
            $scope.clearTime();
            $scope.clearPeriod();
        }
    };
    $scope.init();
    if($scope.isAdmin){
    }

};
