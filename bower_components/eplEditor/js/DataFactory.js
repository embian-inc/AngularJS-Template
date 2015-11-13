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
angular.module('3mp.core.eplEditor').factory('dataFactory', function($http) {

    var data =  [
        {
            _graph_type : EVENT_INPUT_TYPE_DEVICE,
            _shape_type : "GEOM" ,
            _shape_id : "OG.shape.epl.A_DeviceShape",
            _width:"152",
            _height:"96",
            _html : deployHtmlUrl + "eplEditor/html/InputDevice.html",
            _controller : "InputDeviceController"
        },
        {
            _graph_type : EVENT_INPUT_TYPE_EVENT,
            _shape_type : "GEOM" ,
            _shape_id : "OG.shape.epl.A_EventShape",
            _width:"152",
            _height:"96",
            _html : deployHtmlUrl + "eplEditor/html/InputEvent.html",
            _controller : "InputEventController"
        },
        {
            _graph_type : EVENT_INPUT_TYPE_SCHEDULE,
            _shape_type : "GEOM" ,
            _shape_id : "OG.shape.epl.A_ScheduleShape",
            _width:"152",
            _height:"96",
            _html : deployHtmlUrl + "eplEditor/html/InputSchedule.html",
            _controller : "InputScheduleController"
        },
        {
            _graph_type : EVENT_OPERATOR_TYPE_EVENTBASE,
            _shape_type : "GEOM" ,
            _shape_id : "OG.shape.VerticalGroupShape",
            _label : '이벤트 정의',
            _width:"250",
            _height:"300",
            _html : deployHtmlUrl + "eplEditor/html/OperatorBase.html",
            _controller : "OperatorBaseController"
        },
        {
            _graph_type : EVENT_OPERATOR_TYPE_EVENTOCCUR,
            _shape_type : "GEOM" ,
            _shape_id : "OG.shape.epl.A_EventOccurShape",
            _width:"152",
            _height:"96",
            _html : deployHtmlUrl + "eplEditor/html/OperatorLogicGen.html",
            _controller : "OperatorLogicGenController"
        },
        {
            _graph_type : EVENT_OPERATOR_TYPE_EVENTTIME,
            _shape_type : "GEOM" ,
            _shape_id : "OG.shape.epl.A_EventTimeShape",
            _width:"152",
            _height:"96",
            _html : deployHtmlUrl + "eplEditor/html/OperatorTime.html",
            _controller : "OperatorTimeController"
        },
        {
            _graph_type : EVENT_OPERATOR_TYPE_EVENTGROUP,
            _shape_type : "GEOM" ,
            _shape_id : "OG.shape.epl.A_EventGroupShape",
            _width:"152",
            _height:"96",
            _html : deployHtmlUrl + "eplEditor/html/OperatorGroup.html",
            _controller : "OperatorGroupController"
        },
        {
            _graph_type : EVENT_OPERATOR_TYPE_EVENTMAP,
            _shape_type : "GEOM" ,
            _shape_id : "OG.shape.epl.A_EventMapShape",
            _width:"200",
            _height:"120",
            _html : deployHtmlUrl + "eplEditor/html/OperatorMap.html",
            _controller : "OperatorMapController"
        },
        {
            _graph_type : EVENT_OPERATOR_TYPE_EVENTEPL,
            _shape_type : "GEOM" ,
            _shape_id : "OG.shape.epl.A_EventEplShape",
            _width:"152",
            _height:"96",
            _html : deployHtmlUrl + "eplEditor/html/OperatorEPL.html",
            _controller : "OperatorEPLController"
        },
        {
            _graph_type : EVENT_OUTPUT_TYPE_EMAIL,
            _shape_type : "GEOM" ,
            _shape_id : "OG.shape.epl.A_OutputEmailShape",
            _width:"152",
            _height:"96",
            _html : deployHtmlUrl + "eplEditor/html/OutputEmail.html",
            _controller : "OutputEmailController"
        },
        {
            _graph_type : EVENT_OUTPUT_TYPE_PUSH,
            _shape_type : "GEOM" ,
            _shape_id : "OG.shape.epl.A_OutputPushShape",
            _width:"152",
            _height:"96",
            _html : deployHtmlUrl + "eplEditor/html/OutputEmail.html",
            _controller : "OutputEmailController"
        },
        {
            _graph_type : EVENT_OUTPUT_TYPE_SMS,
            _shape_type : "GEOM" ,
            _shape_id : "OG.shape.epl.A_OutputSmsShape",
            _width:"152",
            _height:"96",
            _html : deployHtmlUrl + "eplEditor/html/OutputSMS.html",
            _controller : "OutputSMSController"
        },
        {
            _graph_type : EVENT_OUTPUT_TYPE_CONTROL,
            _shape_type : "GEOM" ,
            _shape_id : "OG.shape.epl.A_OutputControlShape",
            _width:"152",
            _height:"96",
            _html : deployHtmlUrl + "eplEditor/html/OutputControl.html",
            _controller : "OutputControlController"
        }
    ];
    // instantiate our initial object
    var dataFactory = {};

    var relatedDeviceList = [];
    var tagStreamData = [];
    var snsnTagData = [];
    var relatedEventList = [];
    var relatedEventValList = [];
    var currentEventValList = [];
    var inputDataByEleIdList = [];
    this.canvas = null;

    dataFactory.bookedKeyword = [
        "on", "this", "off" , "select" , "delete", "pattern"
    ];

    /**
     * 저장되어있는 데이터를 초기화 시킨다.
     */
    dataFactory.init = function(){
        dataFactory = {};

        relatedDeviceList = [];
        tagStreamData = [];
        snsnTagData = [];
        relatedEventList = [];
        relatedEventValList = [];
        currentEventValList = [];
        inputDataByEleIdList = [];

        dataFactory.eplSeq = '';
        dataFactory.dstrCd = '';
        dataFactory.svcThemeCd = '';
        dataFactory.unitSvcCd = '';
        dataFactory.statEvetCd = '';
        dataFactory.evetGdCd = '';
    };

    /**
     * 도형에 대한 초기 정보를 가져온다.
     */
    dataFactory.getObjectData = function(graph_type) {
        var objectData = null;
        for(var i = 0; i < data.length; i++){
            if( data[i]._graph_type == graph_type){
                objectData = data[i];
            }
        }
        return objectData;
    };
    /**
     * 화면상에 있는 이벤트 데이터를 가져온다
     */
    dataFactory.getEventData = function(eventElementId) {
        var returnData = null;
        for( var i=0; i <relatedEventList.length; i++){
            if( eventElementId == relatedEventList[i].elementId ){
                returnData = relatedEventList[i];
            }
        }
        return returnData;
    };
    dataFactory.getEventValData = function(eventElementId) {
        var returnData = null;
        for( var i=0; i <relatedEventValList.length; i++){
            if( eventElementId == relatedEventValList[i].elementId ){
                returnData = relatedEventValList[i];
            }
        }
        return returnData;
    };


    /**
     * 이벤트를 저장하였을때, 호출이 되어서 저장이 되어있다.
     */
    dataFactory.addEventData = function(eventElementId,data, alias) {
        relatedEventList.push({
            elementId : eventElementId,
            item : data,
            alias : alias
        });
    };
    dataFactory.addEventValData = function(eventElementId,data, alias) {
        relatedEventValList.push({
            elementId : eventElementId,
            item : data,
            alias : alias
        });
    };
    dataFactory.delEventData = function(eventElementId) {

    };
//
    //type : 'device',
    //    data : $scope.logicData[i].devModelNm,
    //elementId : elementId
    /**
     * Operator에서 Input데이터를 사용하였다면 해당 값을 저장해 놓는다.
     * validation 에서 사용을 한다.
     * inputDataByEleIdList
     */
    dataFactory.addInputDataByEleId = function(jsonObject) {
        var flag = true;
        for(var i=0; i <inputDataByEleIdList.length; i++){
            var object = inputDataByEleIdList[i];
            if( object && object.type == jsonObject.type && object.data == jsonObject.data && object.elementId == jsonObject.elementId ){
                flag = false;
            }
        }
        if( flag ){
            inputDataByEleIdList.push(jsonObject);
        }
    };
    dataFactory.getInputDataByEleId = function(type , data) {
        var returnArray = null;
        for(var i=0; i <inputDataByEleIdList.length; i++){
            var object = inputDataByEleIdList[i];
            if( object && object.type == type && object.data == data ){
                if( returnArray == null ){
                    returnArray = [];
                }
                returnArray.push(object);
            }
        }
        return returnArray;
    };


    /**
     * 디바이스를를 저장하였을때, 호출이 되어서 저장이 되어있다.
     */
    dataFactory.getDeviceData = function(deviceElementId) {
        var returnData = null;
        for( var i=0; i <relatedDeviceList.length; i++){
            if( deviceElementId == relatedDeviceList[i].elementId ){
                returnData = relatedDeviceList[i];
            }
        }
        return returnData;
    };
    dataFactory.addDeviceData = function(deviceElementId,data, alias) {
        relatedDeviceList.push({
            elementId : deviceElementId,
            item : data,
            alias : alias
        });
    };
    dataFactory.delDeviceData = function(deviceElementId) {

    };
    /**
     * 이벤트 사용자 정의 컬럼 및 현재 이벤트의 이벤트Val이 저장되어있는
     * currentEventValList
     */
    dataFactory.getCurrentEventValData = function() {
        return currentEventValList;
    };
    dataFactory.addCurrentEventValData = function(list) {
        currentEventValList = list;
    };

    /**
     * 태그스트림 데이터를 가져온다
     */
    dataFactory.getTagStreamData = function(deviceElementId) {
        var returnData = null;
        for( var i=0; i <tagStreamData.length; i++){
            if( deviceElementId == tagStreamData[i].elementId ){
                returnData = tagStreamData[i];
            }
        }
        return returnData;
    };
    
    /**
     * 센싱태그 데이터를 가져온다
     */
    dataFactory.getSnsntagData = function(deviceElementId) {
        var returnData = null;
        for( var i=0; i <snsnTagData.length; i++){
            if( deviceElementId == snsnTagData[i].elementId ){
                returnData = snsnTagData[i];
            }
        }
        return returnData;
    };
    
    dataFactory.addTagStreamData = function(deviceElementId, data, alias) {
        tagStreamData.push({
            elementId : deviceElementId,
            item : data,
            alias : alias
        });
    };
    dataFactory.addSnsnTagData = function(deviceElementId, data, alias) {
        snsnTagData.push({
            elementId : deviceElementId,
            item : data,
            alias : alias
        });
    };
    dataFactory.delTagStreamData = function(deviceElementId) {
    };

    dataFactory.setEditorCanvas = function(canvas) {
        this.canvas = canvas;
    };
    dataFactory.getEditorCanvas = function() {
        return this.canvas;
    };

    dataFactory.deviceDataInitSetting = function(elementId, deviceData, deviceAlias, spotDevData){
        this.addDeviceData(elementId, deviceData, deviceAlias);
        
        if(deviceData.isSelectOnlyModel){
        	 var url_temp = url_master + '/streams/' +deviceData.devModelSeq
        }else{
        	var url_temp = url_master + '/streams/' +deviceData.svcTgtSeq+ '/' +  deviceData.spotDevSeq;
        }
        
        var url_temp2 = url_master + '/snsnTag/selectSnsnTag?devModelSeq=' +deviceData.devModelSeq;
        
        var response = $http.get(url_temp);
        var response2 = $http.get(url_temp2);
        var factory = this;
        response.success(function(data, status, headers, config) {
            if( data.data ){
                var tagStreamData = [];
                angular.forEach(data.data.rows, function(value, key) {
                    // 태그스트림에 모델값을 주입한다.
                    value.devNm =  deviceData.devNm;
                    value.devModelNm =  deviceData.devModelCd;
                    value.devModelSeq =  deviceData.devModelSeq;
                    if( spotDevData && spotDevData.spotDevSeq){
                        value.spotDevSeq =  spotDevData.spotDevSeq;
                    }
                    tagStreamData.push(value);
                });
                factory.addTagStreamData(elementId, tagStreamData, deviceAlias);
            }
        });
        response.error(function(data, status, headers, config) {
        });
        
        response2.success(function(data, status, headers, config) {
            if( data.data ){
                var snsnTagData = [];
                angular.forEach(data.data.rows, function(value, key) {
                    
                    value.devNm =  deviceData.devNm;
                    value.devModelNm =  deviceData.devModelCd;
                    value.devModelSeq =  deviceData.devModelSeq;
                    if( spotDevData && spotDevData.spotDevSeq){
                        value.spotDevSeq =  spotDevData.spotDevSeq;
                    }
                    snsnTagData.push(value);
                });
                factory.addSnsnTagData(elementId, snsnTagData, deviceAlias);
            }
        });
        response2.error(function(data, status, headers, config) {
        });
    };
    dataFactory.eventDataInitSetting = function(elementId, eventData, eventAlias){
        this.addEventData(elementId, eventData, eventAlias);
        var query = '?dstrCd='+ eventData.dstr_cd + '&svcThemeCd=' + eventData.svc_theme_cd + '&unitSvcCd=' + eventData.unit_svc_cd +'&statEvetCd=' + eventData.stat_evet_cd;
        var url_temp = url_event  + '/event/eventValList' +  query;
        var response = $http.get(url_temp);
        var factory = this;
        response.success(function (data, status, headers, config) {
            var eventValList = data.data.rows;
            for(var i=0; i < eventValList.length; i++){
                eventValList[i].statEvetNm = eventData.statEvetNm;
                eventValList[i].eventId = eventData.eventId;
                eventValList[i].epl_seq = eventData.epl_seq;
            }
            factory.addEventValData(elementId, eventValList, eventAlias);
        });
        response.error(function (data, status, headers, config) {
        });
    };


    return dataFactory;
});