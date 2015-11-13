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
angular.module('3mp.core.eplEditor',['ui.router','ngDragDrop', 'angular.filter','ui.bootstrap.datetimepicker']).controller('EventViewController', EventViewController);

function EventViewController($scope, $modal ,$http, $state, $stateParams, dataFactory, $q, $timeout, store, messageBox) {
    if( $stateParams && $stateParams.type == 'default'){
        $state.go(eventListState);
    }
    $scope.mode = $stateParams.type;
    var canvas = new OG.Canvas('canvas', [953, 691], 'white', 'url(images/activity_status/grid.svg)');

    canvas._CONFIG.DEFAULT_STYLE.EDGE["edge-type"] = "bezier";
    canvas._CONFIG.DEFAULT_STYLE.EDGE["stroke"] = "#4c4c4c";
    canvas._CONFIG.AUTO_EXTENSIONAL = true;

    canvas.initConfig({
        selectable: true,
        dragSelectable: true,
        movable: true,
        resizable: true,
        connectable: true,
        selfConnectable: false,
        connectCloneable: false,
        connectRequired: true,
        labelEditable: true,
        groupDropable: true,
        collapsible: true,
        enableHotKey: true,
        enableContextMenu: true
    });
    canvas.setCurrentCanvas(canvas);
    dataFactory.setEditorCanvas(canvas);

    /**
     * 도형이 이어졌을경우 호출되는 메서드
     */
    canvas.onConnectShape(function (event, edgeElement, fromElement, toElement) {

    });
    /**
     * 도형이 삭제되었을경우 호출되는 메서드
     */
    canvas.onBeforeRemoveShape(function (event, shapeElement) {
        if( $(shapeElement).attr('_shape') == 'GEOM' && $(shapeElement).attr('_shape_id') == 'OG.shape.epl.A_DeviceShape'){
            var eleId = $(shapeElement).attr('id');
            var objectData = canvas.getCustomData(eleId);
            if( objectData && objectData.deviceData){
                var data = dataFactory.getInputDataByEleId('device', objectData.deviceData.devModelSeq);
                if( data != null ){
                    for(var i=0; i <data.length; i++){
                        var errorElement = canvas.getElementById(data[i].elementId);
                        if( errorElement ){
                            $scope.validationDraw(errorElement, 'error');
                        }
                    }
                }
            }
        }else if( $(shapeElement).attr('_shape') == 'GEOM' && $(shapeElement).attr('_shape_id') == 'OG.shape.epl.A_EventShape'){
            var eleId = $(shapeElement).attr('id');
            var objectData = canvas.getCustomData(eleId);
            if( objectData && objectData.eventName){
                var data = dataFactory.getInputDataByEleId('event', objectData.eventName.eventId);
                if( data != null ){
                    for(var i=0; i <data.length; i++){
                        var errorElement = canvas.getElementById(data[i].elementId);
                        if( errorElement ){
                            $scope.validationDraw(errorElement, 'error');
                        }
                    }
                }
            }
        }

    });

    /**
     * 도형이 그려졌을때 호출되는 메서드
     */
    canvas.onDrawShape(function (event, element) {
        var id = $(element).attr('id');
        var graph_type = id.split('_')[0];
        var objectData = dataFactory.getObjectData(graph_type);
        $(element).unbind('dblclick');
        $(element).unbind('mouseleave');
        /********************************************
         이벤트 설정 시작
         ********************************************/
        $(element).on({
            dblclick: function (event) {
                if (event.stopPropagation) {
                    event.stopPropagation();
                }
                var modalInstance = $modal.open({
                    templateUrl: objectData._html,
                    controller: objectData._controller,
                    scope: $scope,
                    windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                        items: function () {
                            var item = {
                                elementId: id,
                                mode : $scope.mode,
                                data: canvas.getCustomData(id)
                            }
                            return item;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    if (selectedItem.title || selectedItem.title == '') {
                        // 도형이름 변경
                        canvas.drawLabel(element, selectedItem.title);
                    }
                    canvas.setCustomData(id, selectedItem);
                    if (!selectedItem.validate) {
                        $scope.validationDraw(element, 'error');
                    } else {
                        $scope.validationDraw(element, 'success');
                    }
                    console.log('result data = ' + JSON.stringify({selectedItem: selectedItem}));
                }, function () {
                });
            },
            mouseenter : function(event) {
                if (event.stopPropagation) {
                    event.stopPropagation();
                }
                if (element.shape instanceof OG.shape.bpmn.A_Task || element.shape instanceof OG.shape.VerticalGroupShape) {
                    var handler = canvas._HANDLER;
                    $(handler._RENDERER.getRootElement()).find("[_type=CUSTOM_CONTROL]").each(function(n, selectedItem){
                        if( typeof selectedItem.remove != 'function' ){
                            $(selectedItem).remove();
                        }else{
                            selectedItem.remove();
                        }
                    });

                    var ur_x = element.shape.geom.boundary._upperLeft.x;
                    var ur_y = element.shape.geom.boundary._upperLeft.y;
                    ur_x = element.shape.geom.boundary._width + ur_x;

                    var edit = handler._RENDERER._PAPER.image("images/activity_status/btn_modify.svg", ur_x - 55, ur_y + 5, 25, 25);
                    var del = handler._RENDERER._PAPER.image("images/activity_status/btn_del.svg", ur_x - 30, ur_y + 5, 25, 25);
                    edit.attr({
                        cursor: "pointer"
                    });
                    del.attr({
                        cursor: "pointer"
                    });

                    var group = handler._RENDERER._PAPER.group();
                    $(group.node).attr("_type", "CUSTOM_CONTROL");
                    group.appendChild(edit);
                    group.appendChild(del);
                    var rElement = handler._RENDERER._getREleById(OG.Util.isElement(element) ? element.id : element);
                    group.insertAfter(rElement);

                    $(edit.node).bind({
                        click: function (event, param) {
                            $(element).dblclick();
                        }
                    });
                    $(del.node).bind({
                        click: function (event, param) {
                            handler.selectShape(element, event, param);
                            handler.deleteSelectedShape();
                            $(handler._RENDERER.getRootElement()).find("[_type=CUSTOM_CONTROL]").each(function(n, selectedItem){
                                if( typeof selectedItem.remove != 'function' ){
                                    $(selectedItem).remove();
                                }else{
                                    selectedItem.remove();
                                }
                            });
                        }
                    });
                }
            },
            mouseleave: function (event) {
                if (event.stopPropagation) {
                    event.stopPropagation();
                }
                // 밖으로 이동할때만 수정, 삭제 버튼 제거
                // epl로 선언된 도형들만 체크를 하여 지워준다.
                if (typeof String.prototype.startsWith != 'function') {
                    // see below for better implementation!
                    String.prototype.startsWith = function (str){
                        return this.indexOf(str) === 0;
                    };
                }
                if( element.shape && element.shape.SHAPE_ID && element.shape.SHAPE_ID.startsWith('OG.shape.epl')|| element.shape instanceof OG.shape.VerticalGroupShape ){
                    if(event.toElement && event.toElement.tagName == 'svg'){
                        $(canvas._HANDLER._RENDERER.getRootElement()).find("[_type=CUSTOM_CONTROL]").each(function(n, selectedItem){
                            if( typeof selectedItem.remove != 'function' ){
                                $(selectedItem).remove();
                            }else{
                                selectedItem.remove();
                            }
                        });
                    }
                }
            }
        });
        /********************************************
         이벤트 설정 종료
         ********************************************/

        /********************************************
         * 이벤트 정의 도형은 연결되어있는 도형이 없다면 빨간색으로 표시를 한다.
         ********************************************/
    });

    /**
     * 드래그 시작시에 셋팅을 해주는 정보
     * @param event
     * @param ui
     */
    $scope.startCallback = function (event, ui) {
        var $draggable = $(event.target);
        ui.helper.width($draggable.width());
        ui.helper.height($draggable.height());
    };
    /**
     * 드래그시에 자동 revert 되는 메서드
     * @param valid
     * @returns {boolean}
     */
    $scope.revertCard = function (valid) {
        if (!valid) {
            var that = this;
            setTimeout(function () {
                $(that).css('opacity', 'inherit');
            }, 500);
        }
        return !valid;
    };

    /**
     * 캔버스에 드롭을 하였을시 도형을 그린다.
     * @param event
     * @param ui
     */
    $scope.dropCallback = function (event, ui) {
        var canvasOffset = angular.element("#canvas").offset();
        var graph_type = $(ui.draggable).attr('_graph_type');
        var objectData = dataFactory.getObjectData(graph_type);

        if (objectData) {
            var pageX = ui.offset.left - canvasOffset.left + objectData._width / 2;
            var pageY = ui.offset.top - canvasOffset.top + objectData._height / 2;

            var baseElement = canvas.getElementsByShapeId(objectData._shape_id);
            if( baseElement && baseElement.length > 0){
                var message = '';
                if (graph_type == EVENT_OPERATOR_TYPE_EVENTBASE) {
                    message = '이벤트 정의는 한번만 설정 할 수 있습니다';
                } else if (graph_type == EVENT_OPERATOR_TYPE_EVENTOCCUR) {
                    message = '이벤트 발생조건은 한번만 설정 할 수 있습니다';
                } else if (graph_type == EVENT_OPERATOR_TYPE_EVENTTIME) {
                    message = '시간정보 등록은 한번만 설정 할 수 있습니다';
                } else if (graph_type == EVENT_OPERATOR_TYPE_EVENTGROUP) {
                    message = '그룹설정은 한번만 설정 할 수 있습니다';
                } else if (graph_type == EVENT_OPERATOR_TYPE_EVENTMAP) {
                    message = '위치기반 이벤트는 한번만 설정 할 수 있습니다';
                } else if (graph_type == EVENT_OUTPUT_TYPE_SMS) {
                    message = 'SMS는 한번만 설정 할 수 있습니다';
                } else if (graph_type == EVENT_OUTPUT_TYPE_CONTROL) {
                    message = '제어는 한번만 설정 할 수 있습니다';
                }

                if( message != ''){
                    messageBox.open(message, {
                        type: "info",
                        title: "설정을 확인하여 주세요"
                    });
                    return;
                }
            }
            if( graph_type == EVENT_OPERATOR_TYPE_EVENTMAP){
                // 지도를 그리려고 할적에 발생조건이 있으면 한개만 그려질수 있다고 한다.
                var tempElement = canvas.getElementsByShapeId('OG.shape.epl.A_EventOccurShape');
                if( tempElement && tempElement.length > 0){
                    messageBox.open('위치기반 이벤트는 이벤트 발생조건과 같이 설정할 수 없습니다.', {
                        type: "info",
                        title: "설정을 확인하여 주세요"
                    });
                    return;
                }
            }

            if( graph_type == EVENT_OPERATOR_TYPE_EVENTOCCUR){
                // 지도를 그리려고 할적에 발생조건이 있으면 한개만 그려질수 있다고 한다.
                var tempElement = canvas.getElementsByShapeId('OG.shape.epl.A_EventMapShape');
                if( tempElement && tempElement.length > 0){
                    messageBox.open('이벤트 발생조건은 위치기반 이벤트와 같이 설정할 수 없습니다.', {
                        type: "info",
                        title: "설정을 확인하여 주세요"
                    });
                    return;
                }
            }


            var initText = objectData._label;
            var id = graph_type + '_' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);
            var shape = null;
            if (initText && initText != "" && initText != null) {
                shape = eval('new ' + objectData._shape_id + '(\'' + initText + '\')');
            } else {
                shape = eval('new ' + objectData._shape_id + '()');
            }

            /** 실제 도형을 그리는 부분 */
            var element = canvas.drawShape([
                    pageX, pageY
                ],
                shape, [parseInt(objectData._width, 10), parseInt(objectData._height, 10)], null, id, null, false);

        }
    };

    /**
     * 이벤트를 초기 로드시에, input데이터들을 로딩시킨 후 DataFactory에 값을 셋팅해 놓는다.
     */
    $scope.inputDataLoad = function(loadJsonData){

        var ogObj = eval(loadJsonData.opengraph);
        var ogArr = ogObj.cell;
        for (var i = 0; i < ogArr.length; i++) {
            var og = ogArr[i]
            var ogId = og['@id'];
            var graph_type = ogId.split('_')[0];
            var objectData = canvas.getCustomData(ogId);
            if (graph_type == EVENT_INPUT_TYPE_DEVICE) {
                dataFactory.deviceDataInitSetting(ogId, objectData.deviceData , objectData.deviceAlias, objectData.spotDevData);
            } else if (graph_type == EVENT_INPUT_TYPE_EVENT) {
                dataFactory.eventDataInitSetting(ogId, objectData.eventName , objectData.eventAlias);
            }
        }
    };

    /**
     * save 버튼 클릭
     */
    $scope.saveNodes = function () {
        var graphJsonString = canvas.toJSON();
        var ogObj = eval(graphJsonString.opengraph);
        var ogArr = ogObj.cell;

        var deviceList = [];
        var eventList = [];
        var eventSchedule = null;
        var eventBase = null;
        var eventOccur = null;
        var eventTime = null;
        var eventGroup = null;
        var eventMap = null;
        var eventEPL = null;
        var outputSMS = null;
        var outputControl = null;
        for (var i = 0; i < ogArr.length; i++) {
            var og = ogArr[i]
            var ogId = og['@id'];
            var graph_type = ogId.split('_')[0];
            var objectData = canvas.getCustomData(ogId);
            if( og['@shapeType'] == 'GEOM' && objectData == null ){
                messageBox.open('데이터가 저장이 되어있지 않습니다.', {
                    type: "info",
                    title: "설정을 확인하여 주세요"
                });
                var errorElement = canvas.getElementById(ogId);
                $scope.validationDraw(errorElement, 'error');
                return;
            }
            if( objectData && objectData != null ){
                objectData.elementId = ogId;
                if( objectData.validate == false){
                    messageBox.open('에러가 있는 도형이 있습니다.', {
                        type: "info",
                        title: "설정을 확인하여 주세요"
                    });
                    return;
                }
            }

            // 각 도형별 데이터 셋팅
            if (objectData) {
                if (graph_type == EVENT_INPUT_TYPE_DEVICE) {
                    deviceList.push(objectData);
                } else if (graph_type == EVENT_INPUT_TYPE_EVENT) {
                    eventList.push(objectData);
                } else if (graph_type == EVENT_INPUT_TYPE_SCHEDULE) {
                    eventSchedule = objectData;
                } else if (graph_type == EVENT_OPERATOR_TYPE_EVENTBASE) {
                    eventBase = objectData;
                } else if (graph_type == EVENT_OPERATOR_TYPE_EVENTOCCUR) {
                    eventOccur = objectData;
                } else if (graph_type == EVENT_OPERATOR_TYPE_EVENTTIME) {
                    eventTime = objectData;
                } else if (graph_type == EVENT_OPERATOR_TYPE_EVENTGROUP) {
                    eventGroup = objectData;
                } else if (graph_type == EVENT_OPERATOR_TYPE_EVENTMAP) {
                    eventMap = objectData;
                } else if (graph_type == EVENT_OUTPUT_TYPE_SMS) {
                    outputSMS = objectData;
                } else if (graph_type == EVENT_OUTPUT_TYPE_CONTROL) {
                    outputControl = objectData;
                } else if (graph_type == EVENT_OPERATOR_TYPE_EVENTEPL) {
                	eventEPL = objectData;
                }
            }

        }
        /**********************
         validation check 시작
         **********************/
        if( eventBase == null ){
            var message = '이벤트 정의가 되어있지 않습니다.';
            messageBox.open(message, {
                type: "info",
                title: message
            });
            return;
        }
        var baseElement = canvas.getElementsByShapeId('OG.shape.VerticalGroupShape');
        if( baseElement.length > 1 ){
            var message = '이벤트 정의는 1개만 정의되어야 합니다.';
            messageBox.open(message, {
                type: "info",
                title: message
            });
            return;
        }
        if( eventBase.statEvetNm == null ){
            var message = '이벤트 이름이 정의 되어있지 않습니다.';
            messageBox.open(message, {
                type: "info",
                title: message
            });
            return;
        }
        // Grouping을 설정하였을때 시간정보가 없으면 안된다.
        if( eventGroup != null && eventTime == null ){
            var message = 'Grouping을 설정하였을때 시간정보가 없으면 안됩니다.';
            messageBox.open(message, {
                type: "info",
                title: message
            });
            var groupElement = canvas.getElementById(eventGroup.elementId);
            $scope.validationDraw(groupElement, 'error');
            return;
        }
        // 이벤트 발생조건과 위치기반 이벤트는 같이 있을수 없다.
        if( eventMap != null && eventOccur != null ){
            var message = '이벤트 발생조건과 위치기반 이벤트는 같이 설정할수 없습니다 \n 둘중 한개를 삭제하여 주세요.';
            messageBox.open(message, {
                type: "info",
                title: message
            });
            var element1 = canvas.getElementById(eventMap.elementId);
            $scope.validationDraw(element1, 'error');
            var element2 = canvas.getElementById(eventOccur.elementId);
            $scope.validationDraw(element2, 'error');
            return;
        }
        // input값이 있는 도형은, 설정후에 input값이 지워졌다면 에러를 발생해야한다.
        /*********************
         * validation check 끝
         **********************/

        var requestParam = {
            "graphJsonString": JSON.stringify(graphJsonString),
            "deviceList": deviceList,
            "eventList": eventList,
            "eventSchedule": eventSchedule,
            "eventBase": eventBase,
            "eventOccur": eventOccur,
            "eventTime": eventTime,
            "eventGroup": eventGroup,
            "eventMap": eventMap,
            "eventEPL": eventEPL,
            "outputSMS": outputSMS,
            "outputControl": outputControl
        };

        //console.log(JSON.stringify(requestParam));
        var url_temp = url_event + '/event/editor/';
        if( $scope.mode == 'save' ){
            url_temp += 'save?mbrId=' + store.get('mbr_id');
        }else if( $scope.mode == 'edit' ){
            url_temp += 'edit?mbrId=' + store.get('mbr_id');
            url_temp += '&eplSeq=' + dataFactory.eplSeq;
        }
        $scope.isSaving = true;
        
        var response = $http.post(url_temp, requestParam);
        response.success(function (data, status, headers, config) {
            console.log(data);
            if( data.responseCode == 'OK'){
                for (var i = 0; i < ogArr.length; i++) {
                    var og = ogArr[i]
                    var ogId = og['@id'];
                    if (og['@shapeType'] == 'GEOM') {
                        var completeElement = canvas.getElementById(ogId);
                        $scope.validationDraw(completeElement, 'complete');
                    }
                    if( og['@shapeType'] == 'GROUP' ){
                        var completeElement = canvas.getElementById(ogId);
                        var completeStyle = {
                            "fill" : '#47c1c1',
                            "stroke": '#47c1c1'
                        };
                        canvas.setShapeStyle(completeElement,completeStyle);
                    }
                    if( og['@shapeType'] == 'EDGE' ){
                        var completeElement = canvas.getElementById(ogId);
                        var completeStyle = {
                            "stroke": '#47c1c1'
                        };
                        canvas._RENDERER.setShapeStyle(completeElement,completeStyle);

                    }
                }
                var eplStatus = 'add';
                if( $scope.mode == 'save' ){
                    eplStatus = 'add';
                }else if( $scope.mode == 'edit' ){
                    eplStatus = 'replace';
                }
                var wfYn = data.data.workFlowYn + "";
                var deployEngineUrl = url_event + '/deploy/event/' + data.data.eplSeq + '?status=' + eplStatus + '&workFlowYn=' + wfYn;
                var deployEnginerResponse = $http.get(deployEngineUrl);
                deployEnginerResponse.success(function (data1, status, headers, config) {
                    $scope.isSaving = false;
                    var message = '저장에 성공하였습니다.';
                    var box = messageBox.open(message, {
                        type: "info",
                        title: message,
                        result : true
                    });
                    box.result.then(function() {
                        $state.go(eventListState, {},{reload : true});
                    });
                })
                deployEnginerResponse.error(function (data1, status, headers, config) {
                    $scope.isSaving = false;
                    var message = '저장에 실패하였습니다.';
                    messageBox.open(message, {
                        type: "info",
                        title: message
                    });
                });

            }else{
                $scope.isSaving = false;
                var message = '저장에 실패하였습니다.';
                messageBox.open(message, {
                    type: "info",
                    title: message
                });
            }
        })
        response.error(function (data, status, headers, config) {
            //alert("Exception details: " + JSON.stringify({data: data}));
        });
    };

    // 이벤트 초기 로드
    dataFactory.init();
    if( $stateParams.data ){
        var jsonObj = JSON.parse($stateParams.data);
        if( jsonObj && jsonObj.epl_seq ) {
            dataFactory.eplSeq = jsonObj.epl_seq;
            dataFactory.dstrCd = jsonObj.dstr_cd;
            dataFactory.svcThemeCd = jsonObj.svc_theme_cd;
            dataFactory.unitSvcCd = jsonObj.unit_svc_cd;
            dataFactory.statEvetCd = jsonObj.stat_evet_cd;
            dataFactory.evetGdCd = jsonObj.evet_gd_cd;

            /*********************************************
             *  이벤트 viewer
             *********************************************/
            var url_temp = url_event + '/event/editor/' + jsonObj.epl_seq;
            var response = $http.get(url_temp);
            response.success(function (data, status, headers, config) {
                if (data.data && data.data.eplViewerCd) {
                    var loadData = JSON.parse(data.data.eplViewerCd);
                    canvas.loadJSON(loadData);
                    // 1초간의 텀을 주고 호출한다.
                    $q(function (resolve, reject) {
                        $timeout(function () {
                            $scope.inputDataLoad(loadData);
                        }, 1000);
                    });

                } else {
                    var message = '도식화가 어렵습니다. 관리자에게 문의하세요.';
                    messageBox.open(message, {
                        type: "info",
                        title: message
                    });
                    $state.go(eventListState, {}, {reload: true});
                }
            });
            response.error(function (data, status, headers, config) {
                //alert("Exception details: " + JSON.stringify({data: data}));
            });

            /*********************************************
             *  이벤트 value
             *********************************************/
            var query = '?dstrCd=' + dataFactory.dstrCd + '&svcThemeCd=' + dataFactory.svcThemeCd + '&unitSvcCd=' + dataFactory.unitSvcCd + '&statEvetCd=' + dataFactory.statEvetCd;
            var url_temp1 = url_event + '/event/eventValList' + query;
            var response1 = $http.get(url_temp1);
            response1.success(function (data, status, headers, config) {
                if (data.data && data.data.rows) {
                    var eventValList = data.data.rows;
                    for (var i = 0; i < eventValList.length; i++) {
                        eventValList[i].statEvetNm = '';
                    }
                    dataFactory.addCurrentEventValData(eventValList);
                }


            });
            response1.error(function (data, status, headers, config) {
                //alert("Exception details: " + JSON.stringify({data: data}));
            });
        }

    }

    $scope.validationDraw = function(element, status){
        if( status == 'error'){
            canvas.setExceptionType(element, 'error');
            var errorStyle = {
                "stroke": '#e34345'
            };
            canvas.setShapeStyle(element,errorStyle);
        }else if( status == 'success'){
            canvas.setExceptionType(element, '');
            var errorStyle = {
                "stroke": '#4c4c4c'
            };
            canvas.setShapeStyle(element,errorStyle);
        }else if( status == 'complete'){
            canvas.setExceptionType(element, 'complete');
            var errorStyle = {
                "stroke": '#47c1c1'
            };
            canvas.setShapeStyle(element,errorStyle);
        }
    };

    $scope.goList = function(){
        $state.go(eventListState , {},{reload: true});
    }

};

window.EventViewController = EventViewController;