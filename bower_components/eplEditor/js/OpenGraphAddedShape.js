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
OG.shape.epl = {};
OG.shape.epl.A_DeviceShape = function (label) {
    OG.shape.bpmn.A_ServiceTask.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.epl.A_DeviceShape';
    this.label = label;
    this.CONNECTABLE = true;
    this.GROUP_COLLAPSIBLE = false;
    this.LoopType = "None";
    this.TaskType = "Device";
    this.shapeTitle = true;

}
OG.shape.epl.A_DeviceShape.prototype = new OG.shape.bpmn.A_Task();
OG.shape.epl.A_DeviceShape.superclass = OG.shape.bpmn.A_Task;
OG.shape.epl.A_DeviceShape.prototype.constructor = OG.shape.epl.A_DeviceShape;
OG.A_DeviceShape = OG.shape.epl.A_DeviceShape;

/**
 * 드로잉할 Shape 을 생성하여 반환한다.
 *
 * @return {OG.geometry.Geometry} Shape 정보
 * @override
 */
OG.shape.epl.A_DeviceShape.prototype.createShape = function () {
    if (this.geom) {
        return this.geom;
    }

    this.geom = new OG.geometry.Rectangle([0, 0], 100, 100);
    this.geom.style = new OG.geometry.Style({
        //fill: 'r[(10, 10)]#FFFFFF-#FFFFCC',
        'fill-r' : 1,
        'fill-cx' : .1,
        'fill-cy' : .1,
        "stroke-width" : 1.2,
        "stroke" : '#4c4c4c',
        'fill-opacity': 1,
        r : '0'
    });

    this.geom.titleText = '';

    this.geom.titleX = 70;
    this.geom.titleY = 20;
    this.geom.titleStyle = {
        'font-size' : 12,
        'font-family':'나눔 고딕,NanumGothic,NG,돋움,dotum,AppleGothic',
        'font-weight':'normal'
    };

    switch(this.TaskType) {
        case "Device":
            this.geom.titleText = '디바이스데이터';
            break;
        case "Event":
            this.geom.titleText = '이벤트데이터';
            break;
        case "Schedule":
            this.geom.titleText = '스케쥴러';
            break;
        case "EventOccur":
            this.geom.titleText = '이벤트발생조건';
            this.geom.titleX = 80;
            break;
        case "EventTime":
            this.geom.titleText = '시간조건 등록';
            break;
        case "EventGroup":
            this.geom.titleText = '그룹핑 설정';
            break;
        case "EventMap":
            this.geom.titleText = '위치기반 이벤트';
            this.geom.titleX = 82;
            break;
        case "EventEPL":
            this.geom.titleText = 'EPL 문장입력';
            break;
        case "Email":
            this.geom.titleText = 'EMAIL';
            break;
        case "Push":
            this.geom.titleText = 'PUSH';
            break;
        case "Sms":
            this.geom.titleText = 'SMS';
            break;
        case "Control":
            this.geom.titleText = '제어';
            break;
    }

    return this.geom;
};


OG.shape.epl.A_DeviceShape.prototype.createTerminal = function(){
    if (!this.geom) {
        return [];
    }

    var envelope = this.geom.getBoundary();

    return [
        new OG.Terminal(envelope.getCentroid(), OG.Constants.TERMINAL_TYPE.C, OG.Constants.TERMINAL_TYPE.OUT),
        new OG.Terminal(envelope.getRightCenter(), OG.Constants.TERMINAL_TYPE.E, OG.Constants.TERMINAL_TYPE.OUT),
        new OG.Terminal(envelope.getLeftCenter(), OG.Constants.TERMINAL_TYPE.W, OG.Constants.TERMINAL_TYPE.OUT),
        new OG.Terminal(envelope.getLowerCenter(), OG.Constants.TERMINAL_TYPE.S, OG.Constants.TERMINAL_TYPE.OUT),
        new OG.Terminal(envelope.getUpperCenter(), OG.Constants.TERMINAL_TYPE.N, OG.Constants.TERMINAL_TYPE.OUT)
    ];
};

OG.shape.epl.A_EventShape = function (label) {
    OG.shape.epl.A_DeviceShape.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.epl.A_EventShape';
    this.label = label;
    this.CONNECTABLE = true;
    this.GROUP_COLLAPSIBLE = false;
    this.LoopType = "None";
    this.TaskType = "Event";
    this.shapeTitle = true;
}
OG.shape.epl.A_EventShape.prototype = new OG.shape.epl.A_DeviceShape();
OG.shape.epl.A_EventShape.superclass = OG.shape.bpmn.A_Task;
OG.shape.epl.A_EventShape.prototype.constructor = OG.shape.epl.A_EventShape;
OG.A_EventShape = OG.shape.epl.A_EventShape;

OG.shape.epl.A_ScheduleShape = function (label) {
    OG.shape.epl.A_DeviceShape.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.epl.A_ScheduleShape';
    this.label = label;
    this.CONNECTABLE = true;
    this.GROUP_COLLAPSIBLE = false;
    this.LoopType = "None";
    this.TaskType = "Schedule";
    this.shapeTitle = true;
}
OG.shape.epl.A_ScheduleShape.prototype = new OG.shape.epl.A_DeviceShape();
OG.shape.epl.A_ScheduleShape.superclass = OG.shape.bpmn.A_Task;
OG.shape.epl.A_ScheduleShape.prototype.constructor = OG.shape.epl.A_ScheduleShape;
OG.A_ScheduleShape = OG.shape.epl.A_ScheduleShape;

OG.shape.epl.A_EventOccurShape = function (label) {
    OG.shape.epl.A_EventOccurShape.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.epl.A_EventOccurShape';
    this.label = label;
    this.CONNECTABLE = false;
    this.GROUP_COLLAPSIBLE = false;
    this.LoopType = "None";
    this.TaskType = "EventOccur";
    this.shapeTitle = true;
}
OG.shape.epl.A_EventOccurShape.prototype = new OG.shape.epl.A_DeviceShape();
OG.shape.epl.A_EventOccurShape.superclass = OG.shape.bpmn.A_Task;
OG.shape.epl.A_EventOccurShape.prototype.constructor = OG.shape.epl.A_EventOccurShape;
OG.A_EventOccurShape = OG.shape.epl.A_EventOccurShape;

OG.shape.epl.A_EventTimeShape = function (label) {
    OG.shape.epl.A_EventTimeShape.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.epl.A_EventTimeShape';
    this.label = label;
    this.CONNECTABLE = false;
    this.GROUP_COLLAPSIBLE = false;
    this.LoopType = "None";
    this.TaskType = "EventTime";
    this.shapeTitle = true;
}
OG.shape.epl.A_EventTimeShape.prototype = new OG.shape.epl.A_DeviceShape();
OG.shape.epl.A_EventTimeShape.superclass = OG.shape.bpmn.A_Task;
OG.shape.epl.A_EventTimeShape.prototype.constructor = OG.shape.epl.A_EventTimeShape;
OG.A_EventTimeShape = OG.shape.epl.A_EventTimeShape;

OG.shape.epl.A_EventGroupShape = function (label) {
    OG.shape.epl.A_EventGroupShape.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.epl.A_EventGroupShape';
    this.label = label;
    this.CONNECTABLE = false;
    this.GROUP_COLLAPSIBLE = false;
    this.LoopType = "None";
    this.TaskType = "EventGroup";
    this.shapeTitle = true;
}
OG.shape.epl.A_EventGroupShape.prototype = new OG.shape.epl.A_DeviceShape();
OG.shape.epl.A_EventGroupShape.superclass = OG.shape.bpmn.A_Task;
OG.shape.epl.A_EventGroupShape.prototype.constructor = OG.shape.epl.A_EventGroupShape;
OG.A_EventGroupShape = OG.shape.epl.A_EventGroupShape;

OG.shape.epl.A_EventMapShape = function (label) {
    OG.shape.epl.A_EventMapShape.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.epl.A_EventMapShape';
    this.label = label;
    this.CONNECTABLE = false;
    this.GROUP_COLLAPSIBLE = false;
    this.LoopType = "None";
    this.TaskType = "EventMap";
    this.shapeTitle = true;
}
OG.shape.epl.A_EventMapShape.prototype = new OG.shape.epl.A_DeviceShape();
OG.shape.epl.A_EventMapShape.superclass = OG.shape.bpmn.A_Task;
OG.shape.epl.A_EventMapShape.prototype.constructor = OG.shape.epl.A_EventMapShape;
OG.A_EventMapShape = OG.shape.epl.A_EventMapShape;

OG.shape.epl.A_EventEplShape = function (label) {
    OG.shape.epl.A_EventEplShape.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.epl.A_EventEplShape';
    this.label = label;
    this.CONNECTABLE = false;
    this.GROUP_COLLAPSIBLE = false;
    this.LoopType = "None";
    this.TaskType = "EventEPL";
    this.shapeTitle = true;
}
OG.shape.epl.A_EventEplShape.prototype = new OG.shape.epl.A_DeviceShape();
OG.shape.epl.A_EventEplShape.superclass = OG.shape.bpmn.A_Task;
OG.shape.epl.A_EventEplShape.prototype.constructor = OG.shape.epl.A_EventEplShape;
OG.A_EventEplShape = OG.shape.epl.A_EventEplShape;

/**
 *
 * @param label
 * @constructor
 */
OG.shape.epl.A_OutputEmailShape = function (label) {
    OG.shape.epl.A_OutputEmailShape.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.epl.A_OutputEmailShape';
    this.label = label;
    this.CONNECTABLE = true;
    this.GROUP_COLLAPSIBLE = false;
    this.LoopType = "None";
    this.TaskType = "Email";
    this.shapeTitle = true;
}
OG.shape.epl.A_OutputEmailShape.prototype = new OG.shape.epl.A_DeviceShape();
OG.shape.epl.A_OutputEmailShape.superclass = OG.shape.bpmn.A_Task;
OG.shape.epl.A_OutputEmailShape.prototype.constructor = OG.shape.epl.A_OutputEmailShape;
OG.A_OutputEmailShape = OG.shape.epl.A_OutputEmailShape;

OG.shape.epl.A_OutputEmailShape.prototype.createTerminal = function(){
    if (!this.geom) {
        return [];
    }

    var envelope = this.geom.getBoundary();

    return [
        new OG.Terminal(envelope.getCentroid(), OG.Constants.TERMINAL_TYPE.C, OG.Constants.TERMINAL_TYPE.IN),
        new OG.Terminal(envelope.getRightCenter(), OG.Constants.TERMINAL_TYPE.E, OG.Constants.TERMINAL_TYPE.IN),
        new OG.Terminal(envelope.getLeftCenter(), OG.Constants.TERMINAL_TYPE.W, OG.Constants.TERMINAL_TYPE.IN),
        new OG.Terminal(envelope.getLowerCenter(), OG.Constants.TERMINAL_TYPE.S, OG.Constants.TERMINAL_TYPE.IN),
        new OG.Terminal(envelope.getUpperCenter(), OG.Constants.TERMINAL_TYPE.N, OG.Constants.TERMINAL_TYPE.IN)
    ];
};


OG.shape.epl.A_OutputPushShape = function (label) {
    OG.shape.epl.A_OutputPushShape.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.epl.A_OutputPushShape';
    this.label = label;
    this.CONNECTABLE = true;
    this.GROUP_COLLAPSIBLE = false;
    this.LoopType = "None";
    this.TaskType = "Push";
    this.shapeTitle = true;
}
OG.shape.epl.A_OutputPushShape.prototype = new OG.shape.epl.A_DeviceShape();
OG.shape.epl.A_OutputPushShape.superclass = OG.shape.bpmn.A_Task;
OG.shape.epl.A_OutputPushShape.prototype.constructor = OG.shape.epl.A_OutputPushShape;
OG.A_OutputPushShape = OG.shape.epl.A_OutputPushShape;

OG.shape.epl.A_OutputPushShape.prototype.createTerminal = function(){
    if (!this.geom) {
        return [];
    }

    var envelope = this.geom.getBoundary();

    return [
        new OG.Terminal(envelope.getCentroid(), OG.Constants.TERMINAL_TYPE.C, OG.Constants.TERMINAL_TYPE.IN),
        new OG.Terminal(envelope.getRightCenter(), OG.Constants.TERMINAL_TYPE.E, OG.Constants.TERMINAL_TYPE.IN),
        new OG.Terminal(envelope.getLeftCenter(), OG.Constants.TERMINAL_TYPE.W, OG.Constants.TERMINAL_TYPE.IN),
        new OG.Terminal(envelope.getLowerCenter(), OG.Constants.TERMINAL_TYPE.S, OG.Constants.TERMINAL_TYPE.IN),
        new OG.Terminal(envelope.getUpperCenter(), OG.Constants.TERMINAL_TYPE.N, OG.Constants.TERMINAL_TYPE.IN)
    ];
};


OG.shape.epl.A_OutputSmsShape = function (label) {
    OG.shape.epl.A_OutputSmsShape.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.epl.A_OutputSmsShape';
    this.label = label;
    this.CONNECTABLE = true;
    this.GROUP_COLLAPSIBLE = false;
    this.LoopType = "None";
    this.TaskType = "Sms";
    this.shapeTitle = true;
}
OG.shape.epl.A_OutputSmsShape.prototype = new OG.shape.epl.A_DeviceShape();
OG.shape.epl.A_OutputSmsShape.superclass = OG.shape.bpmn.A_Task;
OG.shape.epl.A_OutputSmsShape.prototype.constructor = OG.shape.epl.A_OutputSmsShape;
OG.A_OutputSmsShape = OG.shape.epl.A_OutputSmsShape;

OG.shape.epl.A_OutputSmsShape.prototype.createTerminal = function(){
    if (!this.geom) {
        return [];
    }

    var envelope = this.geom.getBoundary();

    return [
        new OG.Terminal(envelope.getCentroid(), OG.Constants.TERMINAL_TYPE.C, OG.Constants.TERMINAL_TYPE.IN),
        new OG.Terminal(envelope.getRightCenter(), OG.Constants.TERMINAL_TYPE.E, OG.Constants.TERMINAL_TYPE.IN),
        new OG.Terminal(envelope.getLeftCenter(), OG.Constants.TERMINAL_TYPE.W, OG.Constants.TERMINAL_TYPE.IN),
        new OG.Terminal(envelope.getLowerCenter(), OG.Constants.TERMINAL_TYPE.S, OG.Constants.TERMINAL_TYPE.IN),
        new OG.Terminal(envelope.getUpperCenter(), OG.Constants.TERMINAL_TYPE.N, OG.Constants.TERMINAL_TYPE.IN)
    ];
};


OG.shape.epl.A_OutputControlShape = function (label) {
    OG.shape.epl.A_OutputControlShape.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.epl.A_OutputControlShape';
    this.label = label;
    this.CONNECTABLE = true;
    this.GROUP_COLLAPSIBLE = false;
    this.LoopType = "None";
    this.TaskType = "Control";
    this.shapeTitle = true;
}
OG.shape.epl.A_OutputControlShape.prototype = new OG.shape.epl.A_DeviceShape();
OG.shape.epl.A_OutputControlShape.superclass = OG.shape.bpmn.A_Task;
OG.shape.epl.A_OutputControlShape.prototype.constructor = OG.shape.epl.A_OutputControlShape;
OG.A_OutputControlShape = OG.shape.epl.A_OutputControlShape;

OG.shape.epl.A_OutputControlShape.prototype.createTerminal = function(){
    if (!this.geom) {
        return [];
    }

    var envelope = this.geom.getBoundary();

    return [
        new OG.Terminal(envelope.getCentroid(), OG.Constants.TERMINAL_TYPE.C, OG.Constants.TERMINAL_TYPE.IN),
        new OG.Terminal(envelope.getRightCenter(), OG.Constants.TERMINAL_TYPE.E, OG.Constants.TERMINAL_TYPE.IN),
        new OG.Terminal(envelope.getLeftCenter(), OG.Constants.TERMINAL_TYPE.W, OG.Constants.TERMINAL_TYPE.IN),
        new OG.Terminal(envelope.getLowerCenter(), OG.Constants.TERMINAL_TYPE.S, OG.Constants.TERMINAL_TYPE.IN),
        new OG.Terminal(envelope.getUpperCenter(), OG.Constants.TERMINAL_TYPE.N, OG.Constants.TERMINAL_TYPE.IN)
    ];
};