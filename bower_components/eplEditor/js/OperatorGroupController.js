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
angular.module('3mp.core.eplEditor').controller('OperatorGroupController', OperatorGroupController);

function OperatorGroupController($scope , items, $modalInstance, dataFactory) {

    $scope.useGroupingCheck = false;
    $scope.groupingType = [
        { key : "Sum"},
        { key : "Avg"},
        { key : "Count" }
    ];
    $scope.groupingColumnList = [];
    $scope.groupByColumnList = [];


    $scope.saveData = function() {
        var title = '';
        if( $scope.useGroupingValue ){
            title += $scope.useGroupingValue.key;
        }
        if( $scope.useColumnSelect ){
            title += '(' + $scope.useColumnSelect.key + ')';
        }
        if( $scope.useItemSelect ){
            title += ' => ' + $scope.useItemSelect.itemHanNm;
        }
        if( $scope.useGroupingSelect ){
            title += '\ngroup by ' + $scope.useGroupingSelect.key;
        }

        var validate = $scope.validation();

        var rowData = {
            title : title,
            validate : validate,
            useGroupingValue : $scope.useGroupingValue,
            useColumnSelect : $scope.useColumnSelect,
            useItemSelect : $scope.useItemSelect,
            useGroupingSelect : $scope.useGroupingSelect
        };

        $modalInstance.close(rowData);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.validation = function () {
        if( !$scope.useGroupingValue || !$scope.useColumnSelect || !$scope.useItemSelect){
            return false;
        }
        return true;
    };

    $scope.init = function () {
        // 컬럼 데이터를 셋팅한다.
        var canvas = dataFactory.getEditorCanvas();
        var shapeId = 'OG.shape.VerticalGroupShape';
        var eventBase = canvas.getElementsByShapeId(shapeId)
        if( !eventBase || eventBase.length == 0 ) {
            $scope.eventView = false;
            $scope.errorMassage = '그룹핑 설정은 이벤트 기본조건 안쪽에 들어있어야 합니다.';
        }else {
            $scope.eventView = true;
            var getShapeFromTerminal = function (terminal) {
                var terminalId = OG.Util.isElement(terminal) ? terminal.id : terminal;
                if (terminalId) {
                    return canvas.getRenderer().getElementById(terminalId.substring(0, terminalId.indexOf(OG.Constants.TERMINAL_SUFFIX.GROUP)));
                } else {
                    return null;
                }
            };

            var relatedElementFlag = false;
            var groupElement = eventBase[0];
            var fromEdges = $(groupElement).attr('_fromedge');
            var isDeviceconnected = false;
            if (fromEdges) {
                var fromEdge = fromEdges.split(',');
                for (var i = 0; i < fromEdge.length; i++) {
                    var fromTerminal = $('#' + fromEdge[i]).attr('_from');
                    var fromElement = getShapeFromTerminal(fromTerminal);
                    var fromElementId = $(fromElement).attr('id');
                    var fromGraphType = fromElementId.split('_')[0];
                    // 장치데이터를 설정할때 태그스트림도 가져와서 dataFactory에 저장이 되어있다.
                    if (fromGraphType == EVENT_INPUT_TYPE_DEVICE) {
                        var rowData = dataFactory.getTagStreamData(fromElementId);
                        isDeviceconnected = true;
                        if (rowData) {
                            var alias = rowData.alias;
                            for (var j = 0; j < rowData.item.length; j++) {
                                $scope.groupingColumnList.push({
                                    'key': rowData.item[j].tagStrmId,
                                    'displayName': rowData.item[j].devNm,
                                    'alias': alias,
                                    'type': 'device',
                                    'data': rowData.item[j]
                                });
                            }
                        }
                        relatedElementFlag = true;
                    } else if (fromGraphType == EVENT_INPUT_TYPE_EVENT) {
                        // 이벤트 리스트를 가져와서 호출한다.
                        var rowData1 = dataFactory.getEventValData(fromElementId);
                        if (rowData1 && rowData1.item) {
                            var alias = rowData1.alias;
                            for (var j = 0; j < rowData1.item.length; j++) {
                                $scope.groupingColumnList.push({
                                    'key': rowData1.item[j].itemHanNm,
                                    'displayName': rowData1.item[j].statEvetNm,
                                    'alias': alias,
                                    'type': 'event',
                                    'data': rowData1.item[j]
                                });
                            }
                        }
                        relatedElementFlag = true;
                    }
                }
            }
            angular.copy($scope.groupingColumnList , $scope.groupByColumnList);
            if( isDeviceconnected ){
                $scope.groupByColumnList.push({
                    'key': '디바이스 고유번호',
                    'displayName': '연결된 디바이스',
                    'type': 'connectedDevice',
                    'data': 'spotDevSeq'
                });
                $scope.groupByColumnList.push({
                    'key': '모델 고유아이디',
                    'displayName': '연결된 디바이스',
                    'type': 'connectedDevice',
                    'data': 'deviceModelId'
                });
            }

            $scope.eventItemList = [];
            var rowData2 = dataFactory.getCurrentEventValData();
            if( rowData2 ) {
                for (var j = 0; j < rowData2.length; j++) {
                    var rowDataItems = rowData2[j];
                    rowDataItems.alias = '';
                    rowDataItems.statEvetNm = '현재 이벤트';

                    $scope.eventItemList.push(rowDataItems);
                }
            }

            if (items && items.data) {
                $scope.useGroupingCheck = items.data.useGroupingCheck;
                $scope.useGroupingValue = items.data.useGroupingValue;
                if (items.data.useGroupingSelect && items.data.useGroupingSelect.key) {
                    $scope.useGroupingSelect = items.data.useGroupingSelect;
                }
                if (items.data.useColumnSelect && items.data.useColumnSelect.key) {
                    $scope.useColumnSelect = items.data.useColumnSelect;
                }
                if (items.data.useItemSelect && items.data.useItemSelect.itemNm) {
                    $scope.useItemSelect = items.data.useItemSelect;
                }

            }
        }
    };
    $scope.init();
};