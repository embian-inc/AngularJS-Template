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
angular.module('3mp.core.eplList',['kt.ui','ui.router'])
    .controller('EventListController', EventListController)
    .controller('EPLStringController', EPLStringController)
    .controller('EPLGraphViewController', EPLGraphViewController);

function EventListController($http, $scope, $modal, $state, store, messageBox) {

    $scope.menuName = "이벤트 목록";
    $scope.eventView = true;
    $scope.isAdmin = (eventDeployType == 'admin') ? true : false;
    var eventList = {
        rows:[
        ]
    };

    $scope.eventLogList = [];

    $scope.selectedEtatEvetNm;

    $scope.eventList = eventList;

    $scope.eventCreate = function() {
        if( $scope.isAdmin ){
            $state.go(eventEditorState , {type :'save'});
        }else{
            var url_temp = url_event  + '/event/addEventCheck?mbrId=' + store.get('mbr_id');
            var response = $http.get(url_temp);
            response.success(function(data, status, headers, config) {
                if( data.responseCode == 'OK'){
                    $state.go(eventEditorState , {type :'save'});
                }else if( data.responseCode == 'NG'){
                    messageBox.open(data.message, {
                        type: "info",
                        title: "이벤트 등록 에러"
                    });
                }
            });
            response.error(function(data, status, headers, config) {
            });
        }
    };

    $scope.select = function(selectData) {
        if( $scope.selectedData && $scope.selectedData.epl_seq == selectData.epl_seq){
            return;
        }
        $scope.$apply(function () {
            $scope.initData();
        });
        $scope.selectedData = selectData;
        //console.log($scope.selectedData);
        $scope.selectedEtatEvetNm = selectData.statEvetNm;

        var url_temp = url_event  + '/event/editorData/' + selectData.epl_seq ;
        var response = $http.get(url_temp);
        response.success(function(data, status, headers, config) {
            if( data.data && data.data.evetRelList && data.data.evetRelList.length > 0){
                $scope.evetRelList = data.data.evetRelList;
                $scope.evetRelView = true;
            }
            if( data.data && data.data.deviceRelList && data.data.deviceRelList.length > 0){
                $scope.deviceRelList = data.data.deviceRelList;
                $scope.deviceRelView = true;
            }
            if( data.data && data.data.tagStrmRelList && data.data.tagStrmRelList.length > 0){
                $scope.tagStrmRelList = data.data.tagStrmRelList;
                $scope.tagStrmRelView = true;
            }
            if( data.data && data.data.evetActScrtBasList && data.data.evetActScrtBasList.length > 0){
                $scope.evetActScrtBasList = data.data.evetActScrtBasList;
                //console.log($scope.evetActScrtBasList);
                $scope.workflowRelView = true;
            }
            // TODO lastTime 구하기
            var lastTime = 1427331292000;
            // 일주일 전
            //var lastTime = new Date().getTime() - (60*60*24*7);
            $scope.eventDetailLog(selectData.epl_seq, selectData.eventId ,lastTime );

        });
        response.error(function(data, status, headers, config) {
        });
    };

    $scope.eplListView = function(){
        var modalInstance = $modal.open({
            templateUrl: deployHtmlUrl+'eplList/html/EplStringView.html',
            controller: 'EPLStringController',
            scope : $scope,
            windowClass: 'app-modal-window',
            size: 'le',
            resolve: {
                items: function () {
                    var item = {
                        data : $scope.selectedData
                    }
                    return item;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
        }, function () {
        });
    }

    $scope.viewGraph = function() {
        if( !$scope.selectedEtatEvetNm || $scope.selectedEtatEvetNm == '' ){
            messageBox.open("이벤트를 선택하여 주세요.", {
                type: "info",
                title: "이벤트 선택"
            });
            return;
        }
        var url_temp = url_event + '/event/editor/' + $scope.selectedData.epl_seq;
        var response = $http.get(url_temp);
        response.success(function (data, status, headers, config) {
            if (data.data && data.data.eplViewerCd) {
                $scope.selectedData.eplViewerCd = data.data.eplViewerCd;

                var modalInstance = $modal.open({
                    templateUrl: deployHtmlUrl+'eplList/html/EplGraphView.html',
                    controller: 'EPLGraphViewController',
                    scope : $scope,
                    windowClass: 'app-modal-window',
                    size: 'le',
                    resolve: {
                        items: function () {
                            var item = {
                                data : $scope.selectedData
                            }
                            return item;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                }, function () {
                });
            }else{
                var message = 'IoT 개발 > 나의 디바이스에서 조회하실 수 있습니다.';
                messageBox.open(message, {
                    type: "info",
                    title: message
                });
                return;
            }
        });
        response.error(function (data, status, headers, config) {
            //alert("Exception details: " + JSON.stringify({data: data}));
        });

    };
    $scope.editGraph = function() {
        if( !$scope.selectedEtatEvetNm || $scope.selectedEtatEvetNm == '' ){
            messageBox.open("이벤트를 선택하여 주세요.", {
                type: "info",
                title: "이벤트 선택",
            });
            return;
        }
        var url_temp = url_event + '/event/editor/' + $scope.selectedData.epl_seq;
        var response = $http.get(url_temp);
        response.success(function (data, status, headers, config) {
            if (data.data && data.data.eplViewerCd  && data.data.graphType == '01') {
                $state.go(eventEditorState,{type : 'edit' , data : JSON.stringify($scope.selectedData) , 'reload' : true});
            }else{
                var message = 'IoT 개발 > 나의 디바이스에서 수정하실 수 있습니다.';
                messageBox.open(message, {
                    type: "info",
                    title: message
                });
                return;
            }
        });
        response.error(function (data, status, headers, config) {
            //alert("Exception details: " + JSON.stringify({data: data}));
        });
    };
    $scope.delGraph = function() {

        if( !$scope.selectedEtatEvetNm || $scope.selectedEtatEvetNm == '' ){
            messageBox.open("이벤트를 선택하여 주세요.", {
                type: "info",
                title: "이벤트 선택"
            });
            return;
        }
        messageBox.open('이벤트 이름 : ' + $scope.selectedEtatEvetNm + ' 를 정말 삭제 하시겠습니까? ',{
            type :"info",
            title : "이벤트 삭제",
            confirm : true
        }).result.then(function(confirm) {
            if (confirm) {
                var url_temp = url_event  + '/event/editor/delete?eplSeq=' + $scope.selectedData.epl_seq + '&mbrId=' + store.get('mbr_id');
                var delIndex = $scope.selectedData.$$id;
                var response = $http.delete(url_temp);
                response.success(function(data, status, headers, config) {
                    if( data.responseCode == 'OK'){
                        // 아래와 같이 호출이 안되어서 jquery로 변경함. kt-grid="eventGrid"가 변경되면 아래도 변경되어야함.
                        //$scope.eventGrid.delRowData(delIndex);
                        if( $scope.isAdmin ){
                            $('#eventGridAdmin').delRowData(delIndex);
                        }else{
                            $('#eventGrid').delRowData(delIndex);
                        }

                        // 선택된 값 초기화
                        $scope.initData();
                    }else if( data.responseCode == 'NG'){
                        messageBox.open(data.message, {
                            type: "info",
                            title: "이벤트 삭제 에러"
                        });
                    }
                });
                response.error(function(data, status, headers, config) {});
            }
        });
    };

    $scope.searchList = function(searchEventName, searchStatEvetCd, searchTagStrm, searchDstrCd , searchSvcThemeCd , searchUnitSvcCd){
        $scope.searchEventName = searchEventName;
        $scope.searchStatEvetCd = searchStatEvetCd;
        $scope.searchTagStrm = searchTagStrm;
        $scope.searchDstrCd = searchDstrCd;
        $scope.searchSvcThemeCd = searchSvcThemeCd;
        $scope.searchUnitSvcCd = searchUnitSvcCd;
        $scope.init(1, $scope.gridOption.rowNum);
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

    $scope.gridOption = {
        height : 400,
        width : 900,
        rowNum : 10
    };

    $scope.eventDetailLog = function(eplSeq, eventId, lastTime) {
        var url_temp = url_event  + '/event/logByRuleSeq/' + eplSeq + '/' + lastTime ;
        var response = $http.get(url_temp);

        $scope.complexLogView = false;
        $scope.collectLogView = false;

        response.success(function(data, status, headers, config) {
            if( data.data && data.data.rows && data.data.rows.length > 0 ){
                angular.forEach(data.data.rows, function(value, key) {
                    var collectEventLogVal = value.collectEventObj;
                    if( collectEventLogVal && collectEventLogVal != "[]" ){
                        var jsonObject = JSON.parse(collectEventLogVal);
                        var eventName = value.evetNm;
                        var occDt = '';
                        var attrKey = '';
                        for(var i=0; i < jsonObject.length; i++){
                            if( i > 0 ){
                                attrKey += ' , ';
                            }
                            var attributes = jsonObject[i].attributes;
                            var keys = Object.keys(attributes);
                            for(var j = 0; j < keys.length; j++){
                                var key = keys[j];
                                var values = attributes[key];
                                if( j > 0 ){
                                    attrKey += ' , ';
                                }
                                attrKey += key + ' : ' + values;
                            }
                            occDt = jsonObject[i].occDt;
                        }
                        var message = {
                            type : 'device',
                            tagStrmList : attrKey,
                            eventName : eventName,
                            occDt : occDt
                        }
                        $scope.eventLogList.push(message);

                    }
                    var complexEventLogVal = value.complexEventObj;
                    if( complexEventLogVal && complexEventLogVal != "[]" ){
                        var jsonObject = JSON.parse(complexEventLogVal);
                        var originEventId = '';
                        for(var i=0; i < jsonObject.length; i++){
                            if( i > 0 ){
                                originEventId += ','
                            }
                            originEventId += jsonObject[i].evtId;
                        }
                        var occDt = value.outbDtm;
                        var message = {
                            type : 'event',
                            eventName : value.evetNm,
                            originEventId : originEventId,
                            occDt : occDt
                        }
                        $scope.eventLogList.push(message);
                    }
                });
            }
        });
        response.error(function(data, status, headers, config) {
        });

        /* workFlow log 보기.. 일단 주석 처리함
        var workFlowlogUrl = url_event  + '/event/workflowLog/' + eplSeq + '/' + eventId + '/' + lastTime ;
        var workFlowResponse = $http.get(workFlowlogUrl);

        workFlowResponse.success(function(data, status, headers, config) {
            if( data.data && data.data.rows && data.data.rows.length > 0 ){
                angular.forEach(data.data.rows, function(value, key) {
                    var occDt = value.msrDt;
                    var eventActionObj = value.eventActionObj;
                    var actionCode = '';
                    if( eventActionObj ){
                        var jsonObject = JSON.parse(eventActionObj);
                        var actionTaskList = jsonObject.actionTaskList;
                        for(var i=0; i < actionTaskList.length; i++){
                            actionCode = actionTaskList[i].actionCode;
                            var attrKey = '';
                            if( actionCode == '01'){
                                attrKey = actionTaskList[i].actionTarget;
                            }else if( actionCode == '04') {
                                var actionTarget = JSON.parse(actionTaskList[i].actionTarget);
                                var devNm = actionTarget.spotDevId;
                                console.log(actionTarget.spotDevId);
                                if (actionTaskList[i].taskResources) {
                                    var keys = Object.keys(actionTaskList[i].taskResources);
                                    for (var j = 0; j < keys.length; j++) {
                                        var k = keys[j];
                                        var values = actionTaskList[i].taskResources[k];
                                        if (j > 0) {
                                            attrKey += ' , ';
                                        }
                                        attrKey += k + ' : ' + values;
                                    }
                                    console.log(attrKey);
                                }
                            }
                        }
                    }
                });
            }
        });
        workFlowResponse.error(function(data, status, headers, config) {
        });
        */
    };
    $scope.$on('pushEvent', function (event, data) {
        if( data && data.body ){
            var jsonObj = JSON.parse(data.body);
            var ruleSeq = jsonObj.ruleSeq;
            if( ruleSeq == $scope.selectedData.epl_seq){
                try{
                    var jsonArray = jsonObj.collectSourceEvents[0];
                    if( jsonArray ){
                        var occDt = jsonArray.occDt;
                        var attributes = jsonArray.attributes;

                        var attrKey = '';
                        var keys = Object.keys(attributes);
                        for(var j = 0; j < keys.length; j++){
                            var key = keys[j];
                            var values = attributes[key];
                            if( j > 0 ){
                                attrKey += ' , ';
                            }
                            attrKey += key + ' : ' + values;
                        }
                        var message = {
                            type : 'device',
                            tagStrmList : attrKey,
                            eventName : $scope.selectedEtatEvetNm,
                            occDt : occDt
                        }
                        $scope.$apply(function(){
                            $scope.eventLogList.splice(0, 0, message);
                            $scope.eventLogList.pop();
                        });
                    }
                }catch(e){}
            }

        }
        // TODO 원천데이터가 이벤트일 떄 push 메세지의 json data 확인
        /*
        if( data && data.body ){

            var ruleSeq = '';

            // 발생 이벤트가 다른 이벤트에서 부터 발생시
            var evetOutbInfoWithSourceBody = data.body.split('complexSourceEvents=[');
            if( evetOutbInfoWithSourceBody[0] ){
                try{
                    var temp = evetOutbInfoWithSourceBody[0].split('getRuleSeq()=');
                    var evetIdIdx = temp[1].indexOf(',');
                    ruleSeq = temp[1].substring(0, evetIdIdx);
                }catch(e){}
            }
            if( evetOutbInfoWithSourceBody[1] ) {
                // 1. 원천데이터가 디바이스일 경우
                var collectSourceTemp = evetOutbInfoWithSourceBody[1].split('collectSourceEvents=[');
                if (collectSourceTemp[1]) {
                    try {
                        var jsonObject = JSON.parse(collectSourceTemp[0]);
                        if (jsonObject) {
                            if (ruleSeq == $scope.selectedData.epl_seq) {
                                var occDt = jsonObject.occDt;
                                var attributes = jsonObject.attributes;
                                var attrKey = '';
                                var keys = Object.keys(attributes);
                                for (var j = 0; j < keys.length; j++) {
                                    var key = keys[j];
                                    var values = attributes[key];
                                    if (j > 0) {
                                        attrKey += ' , ';
                                    }
                                    attrKey += key + ' : ' + values;
                                }
                                var message = {
                                    type: 'device',
                                    tagStrmList: attrKey,
                                    eventName: $scope.selectedEtatEvetNm,
                                    occDt: occDt
                                }
                                $scope.$apply(function () {
                                    $scope.eventLogList.splice(0, 0, message);
                                    $scope.eventLogList.pop();
                                });

                            }
                        }
                    } catch (e) {
                    }
                }
                // 1. 원천데이터가 이벤트일 경우
                var complexSourceTemp = evetOutbInfoWithSourceBody[1].split('complexSourceEvents=[');
                if (complexSourceTemp[1]) {
                    try {
                        var jsonObject = JSON.parse(complexSourceTemp[0]);
                        if (jsonObject) {
                            if (ruleSeq == $scope.selectedData.epl_seq) {
                                var originEventId = '';
                                for(var i=0; i < jsonObject.length; i++){
                                    if( i > 0 ){
                                        originEventId += ','
                                    }
                                    originEventId += jsonObject[i].evtId;
                                }
                                var occDt = jsonObject.occDt;
                                var message = {
                                    type : 'event',
                                    eventName : $scope.selectedEtatEvetNm,
                                    originEventId : originEventId,
                                    occDt : occDt
                                }
                                $scope.eventLogList.push(message);
                            }
                        }
                    } catch (e) {
                    }
                }
            }
        }
        */
    });
    $scope.changePage = function(page, rowNum) {
        $scope.init(page, rowNum);
    };

    $scope.statusBtnAction = function (cellvalue, options, rowObject) {
        var checked = '';
        var eplSeq = rowObject.epl_seq;
        if (rowObject.stat_epl == '01') {
            checked = 'checked';
        } else {
            checked = '';
        }
        var statusButton = '<input type="checkbox" id="' + eplSeq + '_status" name="my-checkbox" data-size="mini" data-label-width="10" data-handle-width="60" class="toggleSwitch" '+checked+'>'
        return statusButton;
    }
    var gridComlpeteCheck = false;
    $scope.gridComplete = function () {
        // 여러번을 타기때문에 한번만 타도록 변경함
        $(".toggleSwitch").bootstrapSwitch();
        if( $('input[name="my-checkbox"]') && $('input[name="my-checkbox"]').length > 0 && !gridComlpeteCheck) {
            $('input[name="my-checkbox"]').on('switchChange.bootstrapSwitch', function (event, state) {
                //console.log(this); // DOM element
                //console.log(event); // jQuery event
                //console.log(state); // true | false
                var id = $(this).attr('id');
                var eplSeq = id.split('_status')[0];
                var status = 'start';
                if (state) {
                    // 중지상태를 시작으로 변경함
                    status = 'start';
                } else {
                    status = 'stop';
                }
                var clicked = $(this);

                var url_temp = url_event + '/event/' + eplSeq + '/' + status;
                var response = $http.get(url_temp);
                response.success(function (data, status, headers, config) {
                    if(data.responseCode == 'NG'){
                        clicked.bootstrapSwitch('state', false);
                    }
                });
                response.error(function (data, status, headers, config) {
                    clicked.bootstrapSwitch('state', false);
                    var message = '정상적인 이벤트가 아닙니다.';
                    messageBox.open(message, {
                        type: "info",
                        title: message
                    });
                });

            });
            gridComlpeteCheck = true;
        }

    }

    $scope.pageChanged = function() {
        $scope.eventList.curPage = $scope.curPage;
    }

    $scope.init = function(pageNum, pageCon){
        if( store.get('svc_tgt_seq') == null){
            // 작업을 위하여 default값 셋팅
            store.set('mbr_id', 'admin');
            store.set('svc_tgt_seq', '1000000569');
        }

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
        var response = $http.get(url_temp);
        response.success(function(data, status, headers, config) {
            //console.log(data);
            gridComlpeteCheck = false;
            if( data.data.rows && data.data.rows.length > 0 ){
                $scope.eventList.rows = data.data.rows;
            }else{
                $('#eventGrid-emptyMsg').html( "<div style='font-size:8pt;text-align:center;padding:10px;height:auto'>데이터가 없습니다.</div>" );
            }

            $scope.eventList.total = parseInt( data.data.total / pageCon ) + (parseInt( data.data.total % pageCon ) == 0 ? '' : 1) ;
            $scope.eventList.page = data.data.page;
        });
        response.error(function(data, status, headers, config) {
            $('#eventGrid-emptyMsg').html( "<div style='font-size:8pt;text-align:center;padding:10px;height:auto'>데이터가 없습니다.</div>" );
        });
    }
    $scope.initData = function(){
        $scope.selectedData = '';
        $scope.selectedEtatEvetNm = '';
        $scope.deviceRelView = false;
        $scope.tagStrmRelView = false;
        $scope.evetRelView = false;
        $scope.workflowRelView = false;
        $scope.evetRelList = [];

        $scope.deviceRelList = [];
        $scope.tagStrmRelList = [];
        $scope.evetActScrtBasList = [];

        $scope.eventLogList = [];

        $scope.searchEventName = '';
        $scope.searchStatEvetCd = '';
        $scope.searchTagStrm = '';
    }

    $scope.initData();
    $scope.init(1, $scope.gridOption.rowNum);
    if($scope.isAdmin){
        $scope.getDstrCdList();
    }
};

function EPLStringController($scope , items, $modalInstance) {

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    if( items && items.data ){
        $scope.eplString = items.data.epl_stmt_sbst;
        $scope.statEvetNm = items.data.statEvetNm;
    }

};

function EPLGraphViewController($scope , items, $modalInstance, $q, $timeout) {

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $q(function (resolve, reject) {
        $timeout(function () {
            if( items && items.data && items.data.eplViewerCd ){
                $scope.statEvetNm = items.data.statEvetNm;
                var loadData = JSON.parse(items.data.eplViewerCd);
                // canvas size 조절
                var maxX = 300;
                var maxY = 300;
                var canvasView = new OG.Canvas('canvasView', [maxX, maxY], 'white', 'url(images/activity_status/grid.svg)');

                canvasView._CONFIG.DEFAULT_STYLE.EDGE["edge-type"] = "bezier";
                canvasView._CONFIG.DEFAULT_STYLE.EDGE["stroke"] = "#4c4c4c";
                canvasView._CONFIG.AUTO_EXTENSIONAL = false;

                canvasView.initConfig({
                    selectable: false,
                    dragSelectable: false,
                    movable: false,
                    resizable: false,
                    connectable: false,
                    selfConnectable: false,
                    connectCloneable: false,
                    connectRequired: false,
                    labelEditable: false,
                    groupDropable: false,
                    collapsible: false,
                    enableHotKey: false,
                    enableContextMenu: false
                });
                canvasView.setCurrentCanvas(canvasView);
                canvasView.loadJSON(loadData);
                var margin = 30;
                var ogArr = loadData.opengraph.cell;
                for (var i = 0; i < ogArr.length; i++) {
                    var og = ogArr[i];
                    var ogX = og['@x'];
                    var ogWidth = og['@width'];
                    var tempX = ( ogX*1 + ogWidth/2 + margin );
                    if( tempX > maxX ){
                        maxX = tempX;
                    }

                    var ogY = og['@y'];
                    var ogHeight = og['@height'];
                    var tempY = ( ogY*1 + ogHeight/2 + margin );
                    if( tempY > maxY ){
                        maxY = tempY;
                    }
                }
                canvasView.setCanvasSize([maxX, maxY]);
            }
        }, 1);
    });


};