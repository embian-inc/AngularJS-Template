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
angular.module('3mp.core.eplEditor').controller('OperatorTimeController', OperatorTimeController);

function OperatorTimeController($scope , items, $modalInstance, dataFactory, $filter) {

    $scope.windowTimeView = true;
    $scope.timerView = false;

    $scope.windows = [
        { key : "win:time" , displayName : "발생이전시간(time window)"},
        { key : "timer:at" , displayName : "기간내 발생 조건(between)"}
    ];
    $scope.winTimes = [
        { key : "Seconds"},
        { key : "Minutes"}
        //{ key : "Hours" },
        //{ key : "Days"}
    ];
    $scope.intervalSelect = [
        { key : "Any" , index : 0},
        { key : "Every", index : 1 },
        { key : "Between", index : 2}
        //{ key : "Days"}
    ];

    $scope.dayOfWeekCheck = [
        { key : "월" , value : 0},
        { key : "화" , value : 1},
        { key : "수" , value : 2},
        { key : "목" , value : 3},
        { key : "금" , value : 4},
        { key : "토" , value : 5},
        { key : "일" , value : 6}
    ];


    // default
    $scope.windowSelect = $scope.windows[0];
    $scope.winTimeSelect = $scope.winTimes[0];

    $scope.minuteSelect = $scope.intervalSelect[0];
    $scope.hourSelect = $scope.intervalSelect[0];
    $scope.dayOfMonthSelect = $scope.intervalSelect[0];
    $scope.monthSelect = $scope.intervalSelect[0];
    $scope.dayOfWeekSelect = $scope.intervalSelect[0];

    if( items && items.data ){
        // 이렇게 카피를 해야 이전객체가 저장이 된다.
        angular.copy(items.data.logicData, $scope.logicData);
    }

    $scope.saveData = function() {
        var title = '';
        var minutes = null;
        var hours = null;
        var daysOfMonth = null;
        var month = null;
        var daysOfWeek = null;

        var nullCheck = function(value){
            if( !value || value == ''){
                alert('채워지지 않은 입력값이 있습니다.');
                return;
            }
        }

        if( $scope.windowSelect.key == 'win:time'){
            title = $scope.windowSelect.key + '(' +  $scope.winTimeValue + ')';
        }else if($scope.windowSelect.key == 'timer:at'){
            if( $scope.minuteSelect.key == 'Any' ){
                minutes = null;
            }else if( $scope.minuteSelect.key == 'Every' ){
                nullCheck($scope.minuteTextVal);
                minutes = $scope.minuteTextVal;
            }else if( $scope.minuteSelect.key == 'Between' ){
                nullCheck($scope.minuteTextValA);
                nullCheck($scope.minuteTextValB);
                minutes = $scope.minuteTextValA + ':' + $scope.minuteTextValB;
            }

            if( $scope.hourSelect.key == 'Any' ){
                hours = null;
            }else if( $scope.hourSelect.key == 'Every' ){
                nullCheck($scope.hourTextVal);
                hours = $scope.hourTextVal;
            }else if( $scope.hourSelect.key == 'Between' ){
                nullCheck($scope.hourTextValA);
                nullCheck($scope.hourTextValB);
                hours = $scope.hourTextValA + ':' + $scope.hourTextValB;
            }

            if( $scope.dayOfMonthSelect.key == 'Any' ){
                daysOfMonth = null;
            }else if( $scope.dayOfMonthSelect.key == 'Every' ){
                nullCheck($scope.dayOfMonthTextVal);
                daysOfMonth = $scope.dayOfMonthTextVal;
            }else if( $scope.dayOfMonthSelect.key == 'Between' ){
                nullCheck($scope.dayOfMonthTextValA);
                nullCheck($scope.dayOfMonthTextValB);
                daysOfMonth = $scope.dayOfMonthTextValA + ':' + $scope.dayOfMonthTextValB;
            }

            if( $scope.monthSelect.key == 'Any' ){
                month = null;
            }else if( $scope.monthSelect.key == 'Every' ){
                nullCheck($scope.monthTextVal);
                month = $scope.monthTextVal;
            }else if( $scope.monthSelect.key == 'Between' ){
                nullCheck($scope.monthTextValA);
                nullCheck($scope.monthTextValB);
                month = $scope.monthTextValA + ':' + $scope.monthTextValB;
            }

            if( $scope.dayOfWeekSelect.key == 'Any' ){
                daysOfWeek = null;
            }else if( $scope.dayOfWeekSelect.key == 'Every' ){
                nullCheck($scope.dayOfweekTextVal);
                daysOfWeek = $scope.dayOfweekTextVal.value;
            }else if( $scope.dayOfWeekSelect.key == 'Between' ){
                nullCheck($scope.dayOfweekTextValA);
                nullCheck($scope.dayOfweekTextValB);
                daysOfWeek = $scope.dayOfweekTextValA + ':' + $scope.dayOfweekTextValB;
            }

            title = $scope.windowSelect.key + '( ';
            title += ( minutes == null ? '*' : minutes ) + ',';
            title += ( hours == null ? '*' : hours ) + ',';
            title += ( daysOfMonth == null ? '*' : daysOfMonth ) + ',';
            title += ( month == null ? '*' : month ) + ',';
            title += ( daysOfWeek == null ? '*' : daysOfWeek ) + ',';
            title += '* )' ;
        }

        var validate = $scope.validation();

        var rowData = {
            title : title,
            validate : validate,
            windowTimeView : $scope.windowTimeView,
            windows : $scope.windowSelect,
            winTimes : $scope.winTimeSelect,
            winTimeValue : $scope.winTimeValue,
            minuteSelect : $scope.minuteSelect,
            hourSelect : $scope.hourSelect,
            dayOfMonthSelect : $scope.dayOfMonthSelect,
            monthSelect : $scope.monthSelect,
            dayOfWeekSelect : $scope.dayOfWeekSelect,
            minutes : minutes,
            hours : hours,
            daysOfMonth : daysOfMonth,
            month : month,
            daysOfWeek : daysOfWeek
        };
        $modalInstance.close(rowData);

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.windowChange = function () {
        if( $scope.windowSelect.key == 'win:time' ){
            $scope.windowTimeView = true;
            $scope.betweenView = false;
        }else if($scope.windowSelect.key == 'timer:at'){
            $scope.windowTimeView = false;
            $scope.betweenView = true;
        }
    };

    $scope.validation = function () {
        return true;
    };

    $scope.init = function () {
        // default whereIsTimers setting
        /*
        $scope.whereIsTimers.push({name : 'Pattern', 'relatedId' : '' , 'type' : 'origin'});
        var canvas = dataFactory.getEditorCanvas();
        // 연결되어있는 디바이스 정보를 찾는다.
        var shapeId = 'OG.shape.VerticalGroupShape';
        var eventBase = canvas.getElementsByShapeId(shapeId)
        if( !eventBase || eventBase.length == 0 ) {
            $scope.errorMassage = '윈도우 정보 등록은 이벤트 기본조건 안쪽에 들어있어야 합니다.';
        }else{
            var getShapeFromTerminal = function (terminal) {
                var terminalId = OG.Util.isElement(terminal) ? terminal.id : terminal;
                if (terminalId) {
                    return canvas.getRenderer().getElementById(terminalId.substring(0, terminalId.indexOf(OG.Constants.TERMINAL_SUFFIX.GROUP)));
                } else {
                    return null;
                }
            };

            var groupElement = eventBase[0];
            var fromEdges = $(groupElement).attr('_fromedge');
            if( fromEdges ){
                var fromEdge = fromEdges.split(',');
                for( var i=0; i <fromEdge.length; i++){
                    var fromTerminal = $('#'+fromEdge[i]).attr('_from');
                    var fromElement = getShapeFromTerminal(fromTerminal);
                    var fromElementId = $(fromElement).attr('id');
                    var fromGraphType = fromElementId.split('_')[0];
                    if (fromGraphType == EVENT_INPUT_TYPE_DEVICE) {
                        var rowData = dataFactory.getDeviceData(fromElementId);
                        //console.log(rowData);
                        if( rowData ){
                            $scope.whereIsTimers.push({'name' : rowData.devNm , 'relatedId' : rowData.devModelNm , 'type' : 'device'});
                        }
                    } else if (fromGraphType == EVENT_INPUT_TYPE_EVENT) {
                        // 이벤트 리스트를 가져와서 호출한다.
                        var rowData = dataFactory.getEventData(fromElementId);
                        //console.log(rowData);
                        if( rowData ){
                            $scope.whereIsTimers.push({'name' : rowData.statEvetNm , 'relatedId' : rowData.eventId , 'type' : 'event'});
                        }
                    }
                }
            }

        }
        */
        if( items && items.data ){
            $scope.windowSelect = items.data.windows;
            $scope.winTimeSelect.key = items.data.winTimes.key;
            $scope.windowTimeView = items.data.windowTimeView;
            $scope.winTimeValue = items.data.winTimeValue;

            $scope.minuteSelect = $scope.intervalSelect[items.data.minuteSelect.index];
            $scope.hourSelect = $scope.intervalSelect[items.data.hourSelect.index];
            $scope.dayOfMonthSelect = $scope.intervalSelect[items.data.dayOfMonthSelect.index];
            $scope.monthSelect = $scope.intervalSelect[items.data.monthSelect.index];
            $scope.dayOfWeekSelect = $scope.intervalSelect[items.data.dayOfWeekSelect.index];

            if( $scope.minuteSelect.key == 'Every' ){
                $scope.minuteTextVal = items.data.minutes;
            }else if( $scope.minuteSelect.key == 'Between' ){
                var temp = items.data.minutes.split(':');
                $scope.minuteTextValA = temp[0];
                $scope.minuteTextValB = temp[1];
            }

            if( $scope.hourSelect.key == 'Every' ){
                $scope.hourTextVal = items.data.hours;
            }else if( $scope.hourSelect.key == 'Between' ){
                var temp = items.data.hours.split(':');
                $scope.hourTextValA = temp[0];
                $scope.hourTextValB = temp[1];
            }

            if( $scope.dayOfMonthSelect.key == 'Every' ){
                 $scope.dayOfMonthTextVal = items.data.daysOfMonth;
            }else if( $scope.dayOfMonthSelect.key == 'Between' ){
                var temp = items.data.daysOfMonth.split(':');
                $scope.dayOfMonthTextValA = temp[0];
                $scope.dayOfMonthTextValB = temp[1];
            }

            if( $scope.monthSelect.key == 'Every' ){
                $scope.monthTextVal = items.data.month;
            }else if( $scope.monthSelect.key == 'Between' ){
                var temp = items.data.month.split(':');
                $scope.monthTextValA = temp[0];
                $scope.monthTextValB = temp[1];
            }

            if( $scope.dayOfWeekSelect.key == 'Every' ){
                $scope.dayOfweekTextVal = $scope.dayOfWeekCheck[items.data.daysOfWeek];
            }else if( $scope.dayOfWeekSelect.key == 'Between' ){
                var temp = items.data.daysOfWeek.split(':');
                $scope.dayOfweekTextValA = temp[0];
                $scope.dayOfweekTextValB = temp[1];
            }
        }
    };

    $scope.init();
};