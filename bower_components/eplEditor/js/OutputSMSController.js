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
angular.module('3mp.core.eplEditor').controller('OutputSMSController', OutputSMSController);

function OutputSMSController($scope , items, $modalInstance,dataFactory) {

    // default value setting
    $scope.mode = 'save';
    $scope.telNo = '';
    $scope.msg = '';
    $scope.wrkGroupCd = '01';   // 개별
    $scope.riTypeCd = '01';     // String

    if (items && items.data) {
        $scope.msg =  items.data.msg;
        $scope.telNo = items.data.telNo;
    } else {
        // 초기화
    }
    $scope.delTelNo = function () {
        $scope.telNo = '';
    };
    $scope.addKeywordMessage = function (message) {
        $scope.msg += ' {{' + message + '}} ';
        var element = $('[ng-model="msg"]');
        if(element)
            element.focus();
    };

    $scope.saveData = function () {
        if( $scope.telNo == '' ){
            alert('전화번호를 입력하여 주세요.');
            var element = $('[ng-model="telNo"]');
            if(element)
                element.focus();
            return;
        }
        var regExp = /^(?:(010-\d{4})|(01[1|6|7|8|9]-\d{3,4}))-(\d{4})$/;
        if ( !regExp.test($scope.telNo) ) {
            alert("잘못된 휴대폰 번호입니다. \n숫자, - 를 포함한 휴대폰번호를 입력하세요.");
            var element = $('[ng-model="telNo"]');
            if(element)
                element.focus();
            return;
        }
        //var title = $scope.telNo ;
        var title = $scope.telNo + '\n';
        var msgStr = $scope.msg;
        if( msgStr && msgStr.length > 18 ){
            msgStr = msgStr.slice(0, 18) + '...';
        }
        title += msgStr;
        var validate = $scope.validation();
        var rowData = {
            title: title,
            msg: $scope.msg,
            telNo: $scope.telNo,
            wrkGroupCd: $scope.wrkGroupCd,
            riTypeCd: $scope.riTypeCd,
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

    $scope.init = function(){
        var canvas = dataFactory.getEditorCanvas();
        var shapeId = 'OG.shape.VerticalGroupShape';
        var eventBase = canvas.getElementsByShapeId(shapeId);
        if( eventBase ) {
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
            if (fromEdges) {
                var fromEdge = fromEdges.split(',');
                $scope.tagStrmList = [];
                for (var i = 0; i < fromEdge.length; i++) {
                    var fromTerminal = $('#' + fromEdge[i]).attr('_from');
                    var fromElement = getShapeFromTerminal(fromTerminal);
                    var fromElementId = $(fromElement).attr('id');
                    var fromGraphType = fromElementId.split('_')[0];
                    // 장치데이터를 설정할때 태그스트림도 가져와서 dataFactory에 저장이 되어있다.
                    if (fromGraphType == EVENT_INPUT_TYPE_DEVICE) {
                        //$scope.tagStrmList=  dataFactory.getTagStreamData(fromElementId) ;
                        var rowData = dataFactory.getTagStreamData(fromElementId);
                        if (rowData) {
                            for (var j = 0; j < rowData.item.length; j++) {
                                var rowDataItems = rowData.item[j];
                                console.log(rowDataItems);
                                if (rowDataItems.tagStrmPrpsTypeCd == '0000010') {
                                    //  tagStrmPrpsTypeCdNm: "수집" 값만 리스트에 넣는다.
                                    rowDataItems.alias = rowData.alias;
                                    $scope.tagStrmList.push(rowDataItems);
                                }
                            }
                        }
                    }
                }
            }
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
    };

    $scope.init();
};