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
// 전역변수 선언
/**
 * 로컬 개발시 아래 활성화 시작
 */
//var eventDeployType = 'potal';
//var eventDeployType = 'admin';
//var deployHtmlUrl = '../src/';
//var eventListState = 'event';
//var eventEditorState = 'event.editor';
//var url_event = 'http://localhost:8180/coreapi/v1';
//var url_master = 'http://localhost:8080/masterapi/v1';
/**
 * 포탈 배포시 아래 활성화 끝
 */

/**
 * 포탈 배포시 아래 활성화 시작
 */
//var eventDeployType = 'potal';
//var eventListState = 'event';
//var eventEditorState = 'event.editor';
//var deployHtmlUrl = 'eventEditorTemp/';
//var url_event = 'http://iotmakers.olleh.com:8040/coreapi/v1';
//var url_master = 'http://iotmakers.olleh.com:8040/masterapi/v1';
/**
 * 포탈 배포시 아래 활성화 끝
 */

/**
 * admin 배포시 아래 활성화 시작
  */
var eventDeployType = 'admin';
var eventListState = 'eplList.event';
var eventEditorState = 'eplList.editor';
var deployHtmlUrl = 'bower_components/';
var url_event = 'http://iotmakers.olleh.com:8040/coreapi/v1';
var url_master = 'http://iotmakers.olleh.com:8040/masterapi/v1';
/**
 * admin 배포시 아래 활성화 끝
 */

var EVENT_INPUT_TYPE_DEVICE = 'device';
var EVENT_INPUT_TYPE_EVENT  = 'event';
var EVENT_INPUT_TYPE_SCHEDULE  = 'schedule';
var EVENT_OPERATOR_TYPE_EVENTBASE = 'eventBase';
var EVENT_OPERATOR_TYPE_EVENTOCCUR = 'eventOccur';
var EVENT_OPERATOR_TYPE_EVENTTIME = 'eventTime';
var EVENT_OPERATOR_TYPE_EVENTGROUP = 'eventGroup';
var EVENT_OPERATOR_TYPE_EVENTMAP = 'eventMap';
var EVENT_OPERATOR_TYPE_EVENTEPL = 'eventEPL';
var EVENT_OUTPUT_TYPE_EMAIL = 'email';
var EVENT_OUTPUT_TYPE_PUSH = 'push';
var EVENT_OUTPUT_TYPE_SMS = 'sms';
var EVENT_OUTPUT_TYPE_CONTROL = 'control';


// sampleData
var dstrCd = '001';
var svcThemeCd = 'PTL';
var unitSvcCd = '001';

if( window.console == undefined) {console = {log : function(){} };}
