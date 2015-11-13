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
angular.module('3mp.core.eplEditor').controller('OperatorLogicGenController', OperatorLogicGenController);

function OperatorLogicGenController($scope , items, $modalInstance, dataFactory) {
    var elementId = items.elementId;
    $scope.logicData = [];
    $scope.tagStrmList = [];
    $scope.snsntagList = [];
    $scope.conditions = [
        { key : "=" },
        { key : "!=" },
        { key : ">" },
        { key : "<" },
        { key : "=>" },
        { key : "<=" },
        { key : "like" }
    ];
    $scope.relatedEventList = [];
    $scope.eventItemList = [];
    
    $scope.snsntagsChecked = true;

    if( items && items.data ){
        // 이렇게 카피를 해야 이전객체가 저장이 된다.
        angular.copy(items.data.logicData, $scope.logicData);
    }



    $scope.saveData = function() {
        var title = '';
        angular.forEach($scope.logicData, function(value, key) {
            title += value.viewHtml + ' ';
        });
        if( $scope.logicData.length == 0 ){
            alert('발생조건을 입력하여 주세요');
            return;
        }
        // 나중에 validation을 하기 위하여 데이터를 저장하여 놓는다.
        for(var i = 0; i < $scope.logicData.length; i++){
            if( 'deviceLogic' == $scope.logicData[i].name ){
                var relatedDataStore = {
                    type : 'device',
                    data : $scope.logicData[i].value.devModelSeq,
                    elementId : elementId
                };
                dataFactory.addInputDataByEleId(relatedDataStore);
            }else if( 'eventLogic_01' == $scope.logicData[i].name || 'eventLogic_02' == $scope.logicData[i].name ){
                var relatedDataStore = {
                    type : 'event',
                    data : $scope.logicData[i].value.eventId,
                    elementId : elementId
                };
                dataFactory.addInputDataByEleId(relatedDataStore);
            }
        }

        var validate = $scope.validation();

        var rowData = {
            title : title,
            validate : validate,
            logicData : $scope.logicData
        };

        $modalInstance.close(rowData);

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.deviceLogicView = function () {
        if( $scope.deviceChecked ){
            $scope.deviceChecked = false;
        }else{
            $scope.deviceChecked = true;
        }
        $scope.eventChecked = false;
    };
    $scope.eventLogicView = function () {
        if( $scope.eventChecked ){
            $scope.eventChecked = false;
        }else{
            $scope.eventChecked = true;
        }
        $scope.deviceChecked = false;
    };

    $scope.searchSnsntagsView = function () {
    	 if( $scope.snsntagsChecked & $scope.streamsChecked){
             $scope.snsntagsChecked = false;
         }else{
             $scope.snsntagsChecked = true;
         }
         $scope.streamsChecked = false;
    };
    
    $scope.searchStreamsView = function () {
    	 if( $scope.streamsChecked & $scope.snsntagsChecked){
             $scope.streamsChecked = false;
         }else{
             $scope.streamsChecked = true;
         }
         $scope.snsntagsChecked = false;
    };
    
    $scope.addLogic = function (name , value, viewHtml) {

        // 로직 추가시에 안되는 정보를 넣어준다.
        var logicType = null;
        if( name == 'AND' || name == 'OR'){
            logicType = '01';
        }else if ( name == '(' || name == ')'){
            logicType = '02';
        }else if ( name == '->'){
            logicType = '03';
        }else{
            logicType = '04';
        }
        var dataLength = $scope.logicData.length;
        if( dataLength == 0 && (logicType == '01' || logicType == '02' || logicType == '03')){
            alert('조합기호는 처음에 올 수 없습니다.');
            return;
        }

        if( dataLength > 0 ){
            var lastIdx = dataLength - 1;
            var lastData = $scope.logicData[lastIdx];
            var lastName = lastData.name;
            if( lastName == name ){
                // 연속된 같은 정보는 올수 없다.
                alert('잘못된 입력 값입니다.');
                return;
            }
            var lastLogicType = null;
            if( lastName == 'AND' || lastName == 'OR'){
                lastLogicType = '01';
            }else if ( lastName == '(' || lastName == ')'){
                lastLogicType = '02';
            }else if ( lastName == '->'){
                lastLogicType = '03';
            }else{
                lastLogicType = '04';
            }
            // 조합기호는 연속적으로 올 수 없다.
            if( (logicType == '01' || logicType == '03') && (lastLogicType == '01' || lastLogicType == '03')){
                alert('조합기호는 연속적으로 올 수 없습니다.');
                return;
            }
            // 연속적으로 장비나 이벤트 조건문이 올 수가 없다.
            if( logicType == '04' && lastLogicType == '04' ){
                alert('잘못된 입력 값입니다.');
                return;
            }
        }

        if( !viewHtml ){
            viewHtml = value;
        }
        var data = {
            name :   name,
            value :   value,
            viewHtml : viewHtml
        };

        $scope.logicData.push(data);
    };
    
    // 센싱태그 연산식 추가
    $scope.addSnsnTagDeviceLogic = function () {
        if( !$scope.snsnTag ){
            alert('태그스트림을 선택하여 주세요!');
            return;
        }
        if( !$scope.comprOptr ){
            alert('조건을 선택하여 주세요!');
            return;
        }
        // TODO 디바이스 아이디를 같이 보내야 할듯 하다.. 아니면 디바이스 아이디라도 저장을 해 놔야 한다.
        var value = {
            devModelNm : $scope.snsnTag.devModelNm,
            devModelSeq : $scope.snsnTag.devModelSeq,
            spotDevSeq : $scope.snsnTag.spotDevSeq,
            alias : $scope.snsnTag.alias,
            tagStream : $scope.snsnTag.snsnTagCd,
            tagStrmSeq : $scope.snsnTag.snsnTagCd,
            comprOptr : $scope.comprOptr.key,
            comprOptrVal : $scope.comprOptrVal
        }
        var viewHtml = value.tagStream + ' ' + value.comprOptr + ' ' +value.comprOptrVal;
        $scope.addLogic('deviceLogic', value, viewHtml);

        $scope.tagStrm = null;
        $scope.comprOptr = null;
        $scope.comprOptrVal = '';

        // select box 초기화
    };
    
    // 태그스트림 식 추가
    $scope.addDeviceLogic = function () {
        if( !$scope.tagStrm ){
            alert('태그스트림을 선택하여 주세요!');
            return;
        }
        if( !$scope.comprOptr ){
            alert('조건을 선택하여 주세요!');
            return;
        }
        // TODO 디바이스 아이디를 같이 보내야 할듯 하다.. 아니면 디바이스 아이디라도 저장을 해 놔야 한다.
        var value = {
            devModelNm : $scope.tagStrm.devModelNm,
            devModelSeq : $scope.tagStrm.devModelSeq,
            spotDevSeq : $scope.tagStrm.spotDevSeq,
            alias : $scope.tagStrm.alias,
            tagStream : $scope.tagStrm.tagStrmId,
            tagStrmSeq : $scope.tagStrm.tagStrmSeq,
            comprOptr : $scope.comprOptr.key,
            comprOptrVal : $scope.comprOptrVal
        }
        var viewHtml = value.tagStream + ' ' + value.comprOptr + ' ' +value.comprOptrVal;
        $scope.addLogic('deviceLogic', value, viewHtml);

        $scope.tagStrm = null;
        $scope.comprOptr = null;
        $scope.comprOptrVal = '';

        // select box 초기화
    };
    $scope.addEventLogic = function (type, item) {
        if( type == '01' ){
            // 이벤트 자체를 추가하는 경우
            var eventId = item.eventId;
            var value = {
                eventId : eventId,
                alias : item.alias,
                eventItem : item
            }
            var viewHtml = value.eventItem.statEvetNm ;
            $scope.addLogic('eventLogic_01', value, viewHtml);
        }else{
            // 사용자 정의 컬럼으로 추가하는 경우
            var eventId = $scope.eventItemNm.eventId;
            var value = {
                eventId : eventId,
                alias : $scope.eventItemNm.alias,
                eventItem : $scope.eventItemNm,
                evetItemId : $scope.eventItemNm.evetItemId,
                eventComprOptr : $scope.eventComprOptr.key,
                eventComprOptrVal : $scope.eventComprOptrVal
            }
            var viewHtml = value.eventItem.itemHanNm + ' ' + value.eventComprOptr + ' ' +value.eventComprOptrVal;
            $scope.addLogic('eventLogic_02', value, viewHtml);
        }

        $scope.eventItemNm = null;
        $scope.eventComprOptr = null;
        $scope.eventComprOptrVal = '';

    };

    $scope.delLogic = function (item) {
        var lastIdx;
        if( item ){
            lastIdx = $scope.logicData.indexOf(item);
        }else{
            // 마지막 로우만 지운다.
            if( $scope.logicData.length > 0 ) {
                lastIdx = $scope.logicData.length - 1;
            }
        }
        if( lastIdx == 0 ){
            $scope.logicData = [];
        }else if( lastIdx ){
            $scope.logicData.splice(lastIdx, 1);
        }
    };

    $scope.validation = function () {
        return true;
    };
    // init 로직
    $scope.init = function () {
        var canvas = dataFactory.getEditorCanvas();
        // 연결되어있는 디바이스 정보를 찾는다.
        var shapeId = 'OG.shape.VerticalGroupShape';
        var eventBase = canvas.getElementsByShapeId(shapeId);
        if( !eventBase || eventBase.length == 0 ) {
            $scope.eventView = false;
            $scope.errorMassage = '이벤트 발생조건은 이벤트 정의 안쪽에 들어있어야 합니다.';
        }else{
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
            if( fromEdges ){
                var fromEdge = fromEdges.split(',');
                $scope.tagStrmList = [];
                $scope.snsntagList = [];
                for( var i=0; i <fromEdge.length; i++){
                    var fromTerminal = $('#'+fromEdge[i]).attr('_from');
                    var fromElement = getShapeFromTerminal(fromTerminal);
                    var fromElementId = $(fromElement).attr('id');
                    var fromGraphType = fromElementId.split('_')[0];
                    // 장치데이터를 설정할때 태그스트림도 가져와서 dataFactory에 저장이 되어있다.
                    if (fromGraphType == EVENT_INPUT_TYPE_DEVICE) {
                        //$scope.tagStrmList=  dataFactory.getTagStreamData(fromElementId) ;
                        var rowData = dataFactory.getTagStreamData(fromElementId);
                        var rowData_snsntag = dataFactory.getSnsntagData(fromElementId);
                        if( rowData ){
                            for( var j=0; j <rowData.item.length; j++){
                                var rowDataItems = rowData.item[j];
                                if( rowDataItems.tagStrmPrpsTypeCd == '0000010') {
                                    //  tagStrmPrpsTypeCdNm: "수집" 값만 리스트에 넣는다.
                                    rowDataItems.alias = rowData.alias;
                                    $scope.tagStrmList.push(rowDataItems);
                                }
                            }
                        }
                        if( rowData_snsntag ){
                        	for( var j=0; j <rowData_snsntag.item.length; j++){
                        		var rowDataItems = rowData_snsntag.item[j];
                        		if( rowDataItems.snsnTagTypeCd == '1000') {
                        			//  snsnTagTypeCd: "수집" 값만 리스트에 넣는다.
                        			rowDataItems.alias = rowData_snsntag.alias;
                        			$scope.snsntagList.push(rowDataItems);
                        		}
                        	}
                        }
                        relatedElementFlag = true;
                    } else if (fromGraphType == EVENT_INPUT_TYPE_EVENT) {
                        // 이벤트 리스트를 가져와서 호출한다.
                        var rowData = dataFactory.getEventData(fromElementId);
                        if( rowData && rowData.item) {
                            var rowDataItems = rowData.item;
                            rowDataItems.alias = rowData.alias;
                            $scope.relatedEventList.push(rowDataItems);
                        }
                        var rowData1 = dataFactory.getEventValData(fromElementId);
                        if( rowData1 && rowData1.item ) {
                            for (var j = 0; j < rowData1.item.length; j++) {
                                var rowDataItems = rowData1.item[j];
                                rowDataItems.alias = rowData1.alias;
                                $scope.eventItemList.push(rowDataItems);
                            }
                        }
                        relatedElementFlag = true;
                    }
                }
            }
            // TODO 현재 이벤트를 설정하였을대 EPL 문장이 어떻게 나오는지 모름
            //var rowData2 = dataFactory.getCurrentEventValData();
            //if( rowData2 ) {
            //    for (var j = 0; j < rowData2.length; j++) {
            //        var rowDataItems = rowData2[j];
            //        rowDataItems.alias = '';
            //        rowDataItems.statEvetNm = '현재 이벤트';
            //
            //        $scope.eventItemList.push(rowDataItems);
            //    }
            //}
            if( relatedElementFlag ){
                $scope.eventView = true;
            }else{
                $scope.eventView = false;
                $scope.errorMassage = '※ 연결되어있는 디바이스 및 이벤트 데이터가 없습니다. Input 데이터를 먼저 연결하여 주세요.';
            }

        }
    };

    $scope.init();
};
