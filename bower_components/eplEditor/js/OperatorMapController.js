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
angular.module('3mp.core.eplEditor').controller('OperatorMapController', OperatorMapController);

function OperatorMapController($scope , items, $modalInstance, $timeout, dataFactory) {


    $scope.inputDataList = [
        '디바이스데이터', '이벤트데이터'
    ];
    $scope.inputDataSelect = '디바이스데이터';
    $scope.inputDataListView = true;

    $scope.evetGdList = [
        { index : "0", evetGdCd : "01", statEvetGdNm : "주의" },
        { index : "1", evetGdCd : "02", statEvetGdNm : "경고" },
        { index : "2", evetGdCd : "03", statEvetGdNm : "위험" }
    ];

    /** ==================
     * 맵 관련 함수 시작
     ====================*/
    var isDraw = false;
    var startPt;
    var startCoord;

    var isclick = false;
    var flagArray = new Array();
    var circled = false;
    var rected = false;
    var polyed = false;
    var lined = false;

    $scope.mapLeftBottom;
    $scope.mapRightTop;

    $scope.finalPoly = false;
    $scope.finalLine = false;

    $scope.finalCircle = false;
    $scope.finalRect = false;

    var rectBound1 = {};
    var rectBound2 = {};
    var rectBound3 = {};
    var rectBound4 = {};

    var polypaths = new olleh.maps.Path();
    var linepaths = new olleh.maps.Path();

    $scope.isCircle = false;
    $scope.isRect = false;
    $scope.isPoly = false;
    $scope.isLine = false;

    $scope.terrInYn = 'Y';

    var EvtGd = 0;
    $scope.EvtGd = EvtGd;
    $scope.circlePtList= {rows:[{}]};
    $scope.circlePtList.rows.pop();

    $scope.rectPtList = {rows:[{}]};
    $scope.rectPtList.rows.pop();

    $scope.polyPtList = {rows:[{}]};
    $scope.polyPtList.rows.pop();

    $scope.linePtList = {rows:[{}]};
    $scope.linePtList.rows.pop();

    $scope.MapCirclePtList = new Array();
    $scope.MapRectPtList = new Array();
    $scope.MapPolyPtList = new Array();
    $scope.MapLinePtList = new Array();

    $scope.setDrawType = function(strType) {
        if (strType == "Circle") {
            $scope.isCircle = true;
            $scope.isRect = false;
            $scope.isPoly = false;
            $scope.isLine = false;
            $scope.showDrawtype = 1;
        } else if (strType == "Rectangle") {
            $scope.isRect = true;
            $scope.isCircle = false;
            $scope.isPoly = false;
            $scope.isLine = false;
            $scope.showDrawtype = 2;
        } else if (strType == "Poligon") {
            $scope.isPoly = true;
            $scope.isCircle = false;
            $scope.isRect = false;
            $scope.isLine = false;
            $scope.showDrawtype = 3;
        } else if (strType == "Line") {
            $scope.isLine = true;
            $scope.isCircle = false;
            $scope.isRect = false;
            $scope.isPoly = false;
            $scope.showDrawtype = 4;
        } else if (strType == "Move") {
            $scope.isLine = false;
            $scope.isCircle = false;
            $scope.isRect = false;
            $scope.isPoly = false;
        }
        $scope.DrawType = strType;
    }
    $scope.checkDrawed = function(){
        var result = false;
        if($scope.isDrawed == true){
            $scope.isDrawed = false;
            return false;

        }
        if($scope.isCircle){
            if($scope.rected == true || $scope.polyed == true || $scope.lined == true){
                result = true;
            }
        }
        if($scope.isRect){
            if($scope.circled == true || $scope.polyed == true || $scope.lined == true){
                result = true;
            }
        }
        if($scope.isPoly){
            if($scope.circled == true || $scope.rected == true || $scope.lined == true){
                result = true;
            }
        }
        if($scope.isLine){
            if($scope.circled == true || $scope.rected == true || $scope.polyed == true){
                result = true;
            }
        }
        if(result == true){

            return false;
        }else{
            return true;
        }
    }
    /**
     * 화면 도형 초기화
     */
    $scope.ResetDraw = function(){
        $scope.finalCircle = false;
        $scope.finalRect = false;
        $scope.finalPoly = false;
        $scope.finalLine = false;
        $scope.isDrawed = false;
        $scope.ResetDrawData();
    };
    //화면 도형 초기화
    $scope.ResetDrawData = function(){
        $scope.ResetDrawMap();
        if($scope.isCircle){
            $scope.MapCirclePtList[EvtGd].latitudeValue = "";
            $scope.MapCirclePtList[EvtGd].longitudeValue = "";
            $scope.MapCirclePtList[EvtGd].radiusValue = "";
        }
        if($scope.isRect){
            $scope.MapRectPtList[EvtGd].latitudeValue1= "";
            $scope.MapRectPtList[EvtGd].longitudeValue1= "";
            $scope.MapRectPtList[EvtGd].latitudeValue2= "";
            $scope.MapRectPtList[EvtGd].longitudeValue2= "";
        }
        if($scope.isPoly){
            var ptln = $scope.MapPolyPtList[EvtGd].ptPathList.length;
            for(var i=0;i<ptln;i++){
                $scope.MapPolyPtList[EvtGd].ptPathList.pop();
            }
        }
        if($scope.isLine){
            var ptln = $scope.MapLinePtList[EvtGd].ptPathList.length;
            for(var i=0;i<ptln;i++){
                $scope.MapLinePtList[EvtGd].ptPathList.pop();
            }
        }
    };

    $scope.ResetDrawMap = function(){
        if($scope.DrawCircle){
            $scope.DrawCircle.erase();
            $scope.DrawCircle.setVisible(false);
            $scope.DrawCircle = null;
            $scope.removeMarker();
            var ptln = $scope.circlePtList.rows.length;
            for(var i=0;i<ptln;i++){
                $scope.circlePtList.rows.pop();
            }

            $scope.circled = false;
        }
        if($scope.DrawRect){
            $scope.DrawRect.erase();
            $scope.DrawRect.setVisible(false);
            $scope.DrawRect = null;
            $scope.removeMarker();
            var ptln = $scope.rectPtList.rows.length;
            for(var i=0;i<ptln;i++){
                $scope.rectPtList.rows.pop();
            }
            $scope.rected = false;
        }
        if($scope.DrawPoly){
            $scope.finalPoly = false;
            $scope.DrawPoly.erase();
            $scope.DrawPoly.setVisible(false);
            $scope.DrawPoly = null;
            $scope.polypaths.clear();
            $scope.removeMarker();
            var ptln = $scope.polyPtList.rows.length;
            for(var i=0;i<ptln;i++){
                $scope.polyPtList.rows.pop();
            }
            $scope.polyed = false;
        }
        if($scope.DrawLine){
            $scope.finalLine = false;
            $scope.DrawLine.erase();
            $scope.DrawLine.setVisible(false);
            $scope.DrawLine = null;
            $scope.linepaths.clear();
            $scope.removeMarker();
            var ptln = $scope.linePtList.rows.length;
            for(var i=0;i<ptln;i++){
                $scope.linePtList.rows.pop();
            }
            $scope.lined = false;
        }
    }
    //마커 삭제
    $scope.removeMarker = function(){
        if( flagArray ){
            for(var i=0;i<flagArray.length;i++){
                flagArray[i].erase();
            }
        }
        if( $scope.flagArray ){
            for(var i=0;i<$scope.flagArray.length;i++){
                $scope.flagArray[i].erase();
            }
        }
    }
    // 마커 생성
    $scope.drawMarker = function(map, coord){
        var icon = new olleh.maps.overlay.Marker({
            position: coord,
            flat : true,
            icon: {
                url: 'images/common/dot_point_blue.png',    // 아이콘 url만 변경
                size:new olleh.maps.Size(10, 10),
                anchor: new olleh.maps.Point(5, 5)
            },
            map: map
        });

        flagArray.push(icon);
        $scope.flagArray = flagArray;
    }
    //시작 Point 생성
    $scope.createStartPt = function(map, coord, point) {
        if($scope.isCircle == true || $scope.isRect == true || $scope.isPoly == true || $scope.isLine == true){
            startPt = point;
            startCoord = coord;
            isDraw = true;
        }
    }

    //선 그리기
    var oldLine = new olleh.maps.vector.Polyline(linepaths);
    $scope.drawLineTemp = function(map, coord, polypaths){
        var pathLength = linepaths.getCoords();
        if(pathLength.length >1){
            linepaths.pop();
        }
        linepaths.push(coord);

        var polyLine = new olleh.maps.vector.Polyline({
            map: map,
            path: linepaths,
            strokeColor: 'black',
            strokeOpacity: .5,
            strokeWeight: 5
        });
        var Marker = new olleh.maps.overlay.Marker({
            map: map,
            position: coord,
            flat: true,
            icon: {
                url: 'images/common/dot_point_blue.png',    // 아이콘 url만 변경
                size:new olleh.maps.Size(10, 10),
                anchor: new olleh.maps.Point(5, 5)
            },
            caption: "마우스 오른쪽 버튼을<br>누르면 마침"
        });

        oldMarker.erase();
        oldMarker.setVisible(false);
        oldMarker = Marker;

        $scope.DrawLine = polyLine;
        oldLine.erase();
        oldLine.setVisible(false);
        oldLine = polyLine;
    }
    //다각형 그리기
    var oldPoly = new olleh.maps.vector.Polygon(polypaths);
    var oldMarker = new olleh.maps.overlay.Marker();
    $scope.drawPolyTemp = function(map, coord, polypaths){
        var pathLength = polypaths.getCoords();
        if(pathLength.length >1){
            polypaths.pop();
        }
        polypaths.push(coord);

        var polygon = new olleh.maps.vector.Polygon({
            map: map,
            paths: polypaths,
            strokeColor: 'blue',
            strokeOpacity : 0.7,
            strokeWeight : 5,
            fillColor: 'blue',
            fillOpacity: 0.3
        });
        var Marker = new olleh.maps.overlay.Marker({
            map: map,
            position: coord,
            flat: true,
            icon: {
                url: 'images/common/dot_point_blue.png',    // 아이콘 url만 변경
                size:new olleh.maps.Size(10, 10),
                anchor: new olleh.maps.Point(5, 5)
            },
            caption: "마우스 오른쪽 버튼을<br>누르면 마침"
        });

        oldMarker.erase();
        oldMarker.setVisible(false);
        oldMarker = Marker;
        $scope.DrawPoly = polygon;
        oldPoly.erase();
        oldPoly.setVisible(false);
        oldPoly = polygon;
    };
    //사각형 그리기
    var oldRect = new olleh.maps.vector.Rectangle();
    $scope.drawRectTemp = function(map, coord){
        var boundCoord1 = {};
        var boundCoord2 = {};
        if (coord.x > startCoord.x && coord.y < startCoord.y) {
            boundCoord1.x =startCoord.x;
            boundCoord1.y =coord.y;
            boundCoord2.x =coord.x;
            boundCoord2.y =startCoord.y;
        } else if (coord.x > startCoord.x && coord.y > startCoord.y) {
            boundCoord1.x =startCoord.x;
            boundCoord1.y =startCoord.y;
            boundCoord2.x =coord.x;
            boundCoord2.y =coord.y;
        } else if (coord.x < startCoord.x && coord.y < startCoord.y) {
            boundCoord1.x =coord.x;
            boundCoord1.y =coord.y;
            boundCoord2.x =startCoord.x;
            boundCoord2.y =startCoord.y;
        } else if (coord.x < startCoord.x && coord.y > startCoord.y) {
            boundCoord1.x =coord.x;
            boundCoord1.y =startCoord.y;
            boundCoord2.x =startCoord.x;
            boundCoord2.y =coord.y;
        }
        var rectBound = new olleh.maps.Bounds(new olleh.maps.UTMK(boundCoord1.x, boundCoord1.y),
            new olleh.maps.UTMK(boundCoord2.x, boundCoord2.y));
        var rect;
        rect = new olleh.maps.vector.Rectangle({
            map: map,
            bounds: rectBound,
            strokeColor : "green",
            strokeOpacity : 0.7,
            strokeWeight : 5,
            fillColor: 'green',
            fillOpacity: 0.3
        });
        rectBound1 = new olleh.maps.UTMK(boundCoord1.x, boundCoord1.y);
        rectBound2 = new olleh.maps.UTMK(boundCoord2.x, boundCoord2.y);
        rectBound3 = new olleh.maps.UTMK(boundCoord1.x, boundCoord2.y);
        rectBound4 = new olleh.maps.UTMK(boundCoord2.x, boundCoord1.y);

        var LatLngCoord1;
        var LatLngCoord2;
        LatLngCoord1 = olleh.maps.LatLng.valueOf(startCoord.asDefault());
        LatLngCoord2 = olleh.maps.LatLng.valueOf(coord.asDefault());
        // LatLngCoord1.x : Longitude , LatLngCoord1.y : Latitude ,
        $scope.$apply(function(){
            $scope.setRectPt(LatLngCoord1.y.toFixed(6), LatLngCoord1.x.toFixed(6),
                LatLngCoord2.y.toFixed(6), LatLngCoord2.x.toFixed(6));
        });

        $scope.DrawRect = rect;
        oldRect.erase();
        oldRect.setVisible(false);
        oldRect = rect;
    }
    //원 그리기
    var oldCircle = new olleh.maps.vector.Circle();
    $scope.drawCircleTemp = function(map, coord){
        var nRadius = startCoord.distanceTo(coord);
        nRadius = nRadius.toFixed(0);

        var circle;

        circle = new olleh.maps.vector.Circle({
            map: map,
            center: startCoord.asDefault(),
            radius: nRadius,
            strokeColor: "red",
            strokeOpacity: 0.7,
            strokeWeight: 5,
            fillColor: 'red',
            fillOpacity: 0.3
        });

        var LatLngCoord;
        LatLngCoord = olleh.maps.LatLng.valueOf(startCoord.asDefault());

        $scope.$apply(function () {
            $scope.setCirclePt(LatLngCoord.y.toFixed(6), LatLngCoord.x.toFixed(6), nRadius);
        });

        $scope.DrawCircle = circle;
        oldCircle.erase();
        oldCircle.setVisible(false);
        oldCircle = circle;
    }
    $scope.setRectPt = function(latitude1, longitude1, latitude2, longitude2){

        $scope.MapRectPtList[EvtGd].latitudeValue1= "";
        $scope.MapRectPtList[EvtGd].longitudeValue1= "";
        $scope.MapRectPtList[EvtGd].latitudeValue2= "";
        $scope.MapRectPtList[EvtGd].longitudeValue2= "";

        $scope.MapRectPtList[EvtGd].latitudeValue1= latitude1;
        $scope.MapRectPtList[EvtGd].longitudeValue1= longitude1;
        $scope.MapRectPtList[EvtGd].latitudeValue2= latitude2;
        $scope.MapRectPtList[EvtGd].longitudeValue2= longitude2;

        var ptln = $scope.rectPtList.rows.length;
        for(var i=0;i<ptln;i++){
            $scope.rectPtList.rows.pop();
        }
        $scope.rectPtList.rows.push({drawType :"사각", latitudeValue:longitude1, longitudeValue:latitude1});
        $scope.rectPtList.rows.push({drawType :"사각", latitudeValue:longitude2, longitudeValue:latitude2});

    };

    $scope.setCirclePt = function(latitudeValue, longitudeValue, radiusValue){
        $scope.MapCirclePtList[EvtGd].latitudeValue = "";
        $scope.MapCirclePtList[EvtGd].longitudeValue = "";
        $scope.MapCirclePtList[EvtGd].radiusValue = "";

        $scope.MapCirclePtList[EvtGd].latitudeValue = latitudeValue;
        $scope.MapCirclePtList[EvtGd].longitudeValue = longitudeValue;
        $scope.MapCirclePtList[EvtGd].radiusValue = radiusValue;

        $scope.circlePtList.rows.pop();
        $scope.circlePtList.rows.push($scope.MapCirclePtList[EvtGd]);

    };

    /**
     * @ngdoc method
     * @name kt.rule.modelSimpleEvtRuleUpdateForm:simpleEvtRuleUpdateFormCtrl#$scope.addpt
     * @propertyOf kt.rule.modelSimpleEvtRuleUpdateForm:simpleEvtRuleUpdateFormCtrl
     *
     * @description
     * 설정한 다각형과 선의 좌표를 그리드에 설정한다.
     *
     * @param {String=} dType 도형 유형, {String=} latitude 위도 좌표, {String=} longitude 경도 좌표,
     */
    $scope.addpt = function(dType, latitude, longitude) {
        var strType;
        if(dType == 2){
        }else if(dType == 3){
            strType = "다각영역";
            var ptPathList = {};
            ptPathList.latitude = latitude;
            ptPathList.longitude = longitude;
            $scope.MapPolyPtList[EvtGd].ptPathList.push(ptPathList);
            $scope.polyPtList.rows.push({drawType :strType, latitudeValue:latitude, longitudeValue:longitude});
            $scope.polyPtList.total = $scope.polyPtList.rows.length;
            $scope.polyPtList.page = 1;
        }else if(dType == 4){
            strType = "선영역";
            var ptPathList = {};
            ptPathList.latitude = latitude;
            ptPathList.longitude = longitude;
            $scope.MapLinePtList[EvtGd].ptPathList.push(ptPathList);
            $scope.linePtList.rows.push({drawType :strType, latitudeValue:latitude, longitudeValue:longitude});
            $scope.linePtList.total = $scope.linePtList.rows.length;
            $scope.linePtList.page = 1;
        }
    };
    $scope.setOptCondList = function(nCount){
        for(var i=0;i<nCount;i++){
            $scope.MapCirclePtList.push({cnt : nCount, drawType:"원영역", latitudeValue:"", longitudeValue:"", radiusValue:""});
        }
        for(var i=0;i<nCount;i++){
            $scope.MapRectPtList.push({cnt : nCount, drawType:"사각영역", latitudeValue1:"", longitudeValue1:"", latitudeValue2:"", longitudeValue2:""});
        }
        for(var i=0;i<nCount;i++){
            $scope.MapPolyPtList.push({cnt : nCount, drawType:"다각영역", ptPathList:[]});
        }
        for(var i=0;i<nCount;i++){
            $scope.MapLinePtList.push({cnt : nCount, drawType:"선영역", ptPathList:[]});
        }
    }
    /** ==================
     * load 후에 사용할 함수들 시작
     ====================*/
    //원 그리기
    $scope.drawCircle = function(map, xcrd,ycrd, nRadius) {
        var LatLngCoord = new olleh.maps.LatLng(ycrd,xcrd);
        var coord = olleh.maps.UTMK.valueOf(LatLngCoord);
        coord = LatLngCoord.asDefault();

        var DrawCircle = new olleh.maps.vector.Circle({
            map: map,
            center : coord.asDefault(),
            radius : nRadius,
            strokeColor : "red",
            strokeOpacity : 0.7,
            strokeWeight : 5,
            fillColor: 'red',
            fillOpacity: 0.3
        });
        $scope.DrawCircle = DrawCircle;
        $scope.drawMarker(map, coord);
    }
    //사각형 그리기
    $scope.drawRect = function(map, startxcrd, startycrd, endxcrd, endycrd) {
        var LatLngCoord1 = new olleh.maps.LatLng(startycrd, startxcrd);
        var LatLngCoord2 = new olleh.maps.LatLng(endycrd, endxcrd);

        var coord1 = olleh.maps.UTMK.valueOf(LatLngCoord1);
        var coord2 = olleh.maps.UTMK.valueOf(LatLngCoord2);

        var boundCoord1 = {};
        var boundCoord2 = {};
        if (coord2.x > coord1.x && coord2.y < coord1.y) {
            boundCoord1.x =coord1.x;
            boundCoord1.y =coord2.y;
            boundCoord2.x =coord2.x;
            boundCoord2.y =coord1.y;
        } else if (coord2.x > coord1.x && coord2.y > coord1.y) {
            boundCoord1.x =coord1.x;
            boundCoord1.y =coord1.y;
            boundCoord2.x =coord2.x;
            boundCoord2.y =coord2.y;
        } else if (coord2.x < coord1.x && coord2.y < coord1.y) {
            boundCoord1.x =coord2.x;
            boundCoord1.y =coord2.y;
            boundCoord2.x =coord1.x;
            boundCoord2.y =coord1.y;
        } else if (coord2.x < coord1.x && coord2.y > coord1.y) {
            boundCoord1.x =coord2.x;
            boundCoord1.y =coord1.y;
            boundCoord2.x =coord1.x;
            boundCoord2.y =coord2.y;
        }

        var rectBound = new olleh.maps.Bounds(new olleh.maps.UTMK(boundCoord1.x, boundCoord1.y),
            new olleh.maps.UTMK(boundCoord2.x, boundCoord2.y));

        var DrawRect = new olleh.maps.vector.Rectangle({
            map: map,
            bounds: rectBound,
            strokeColor : "green",
            strokeOpacity : 0.7,
            strokeWeight : 5,
            fillColor: 'green',
            fillOpacity: 0.3
        });

        $scope.DrawRect = DrawRect;

        var marker1 = new olleh.maps.UTMK(coord1.x, coord1.y);
        var marker2 = new olleh.maps.UTMK(coord2.x, coord2.y);
        var marker3 = new olleh.maps.UTMK(coord1.x, coord2.y);
        var marker4 = new olleh.maps.UTMK(coord2.x, coord1.y);

        $scope.drawMarker(map, marker1);
        $scope.drawMarker(map, marker2);
        $scope.drawMarker(map, marker3);
        $scope.drawMarker(map, marker4);
        $scope.isDrawed = true;

    }
    //선 그리기
    $scope.linepaths = new olleh.maps.Path();
    var oldLine = new olleh.maps.vector.Polyline($scope.linepaths);
    $scope.drawline = function(map,latCoord, lngCoord) {
        var LatLngCoord = new olleh.maps.LatLng(latCoord,lngCoord);
        var coord = olleh.maps.UTMK.valueOf(LatLngCoord);

        $scope.drawMarker(map, coord);
        $scope.linepaths.push(coord);

        var DrawPolyline = new olleh.maps.vector.Polyline({
            map: map,
            path : $scope.linepaths,
            strokeColor: 'black',
            strokeOpacity: .5,
            strokeWeight: 5
        });
        $scope.DrawLine = DrawPolyline;

        oldLine.erase();
        oldLine.setVisible(false);
        oldLine = DrawPolyline;
    }

    //다각형 그리기
    $scope.polypaths = new olleh.maps.Path();
    var oldPoly = new olleh.maps.vector.Polygon($scope.polypaths);
    $scope.drawPoly = function(map,latCoord, lngCoord) {
        var LatLngCoord = new olleh.maps.LatLng(latCoord,lngCoord);
        var coord = olleh.maps.UTMK.valueOf(LatLngCoord);

        $scope.drawMarker(map, coord);
        $scope.polypaths.push(coord);

        var DrawPoly = new olleh.maps.vector.Polygon({
            map: map,
            paths : $scope.polypaths,
            strokeColor: 'blue',
            strokeOpacity : 0.7,
            strokeWeight : 5,
            fillColor: 'blue',
            fillOpacity: 0.3
        });
        $scope.DrawPoly = DrawPoly;

        oldPoly.erase();
        oldPoly.setVisible(false);
        oldPoly = DrawPoly;
    }

    $scope.changeGd = function(EvtGd){
        $scope.ResetDrawMap();
        if($scope.DrawType == "Poligon"){
            $scope.isPoly = true;
            $scope.showDrawtype = 3;
        }else if($scope.DrawType == "Line"){
            $scope.isLine = true;
            $scope.showDrawtype = 4;
        }else if($scope.DrawType == "Rectangle"){
            $scope.isRect = true;
            $scope.showDrawtype = 2;
        }else if($scope.DrawType == "Circle"){
            $scope.isCircle = true;
            $scope.showDrawtype = 1;
        }
        if($scope.isCircle){
            if($scope.MapCirclePtList[EvtGd].longitudeValue != "" && $scope.MapCirclePtList[EvtGd].latitudeValue != ""){
                $scope.drawCircle(window.map,
                    $scope.MapCirclePtList[EvtGd].longitudeValue,
                    $scope.MapCirclePtList[EvtGd].latitudeValue,
                    $scope.MapCirclePtList[EvtGd].radiusValue
                );
                $scope.finalCircle = true;
                var bound = new olleh.maps.Bounds(new olleh.maps.UTMK($scope.mapLeftBottom.x, $scope.mapLeftBottom.y),
                    new olleh.maps.UTMK($scope.mapRightTop.x, $scope.mapRightTop.y));
                window.map.panToBounds(bound);

                $scope.circlePtList.rows.pop();
                $scope.circlePtList.rows.push($scope.MapCirclePtList[EvtGd]);
            }
            $scope.circlePtList.total = $scope.circlePtList.rows.length;
            $scope.circlePtList.page = 1;
        }
        if($scope.isRect){
            if($scope.MapRectPtList[EvtGd].longitudeValue1 != "" && $scope.MapRectPtList[EvtGd].latitudeValue1 != "" &&
                $scope.MapRectPtList[EvtGd].longitudeValue2 != "" && $scope.MapRectPtList[EvtGd].latitudeValue2 != ""){
                $scope.drawRect(window.map,
                    $scope.MapRectPtList[EvtGd].longitudeValue1,
                    $scope.MapRectPtList[EvtGd].latitudeValue1,
                    $scope.MapRectPtList[EvtGd].longitudeValue2,
                    $scope.MapRectPtList[EvtGd].latitudeValue2
                );
                $scope.finalRect = true;
                var bound = new olleh.maps.Bounds(new olleh.maps.UTMK($scope.mapLeftBottom.x, $scope.mapLeftBottom.y),
                    new olleh.maps.UTMK($scope.mapRightTop.x, $scope.mapRightTop.y));
                window.map.panToBounds(bound);

                var ptln = $scope.rectPtList.rows.length;
                for(var i=0;i<ptln;i++){
                    $scope.rectPtList.rows.pop();
                }

                $scope.rectPtList.rows.push({drawType :"사각",
                    latitudeValue:$scope.MapRectPtList[EvtGd].longitudeValue1,
                    longitudeValue:$scope.MapRectPtList[EvtGd].latitudeValue1});
                $scope.rectPtList.rows.push({drawType :"사각",
                    latitudeValue:$scope.MapRectPtList[EvtGd].longitudeValue2,
                    longitudeValue:$scope.MapRectPtList[EvtGd].latitudeValue2});
            }
            $scope.rectPtList.total = $scope.rectPtList.rows.length;
            $scope.rectPtList.page = 1;
        }
        if($scope.isPoly){
            if($scope.MapPolyPtList[EvtGd].ptPathList.length > 0){
                for(var i=0;i<$scope.MapPolyPtList[EvtGd].ptPathList.length;i++){
                    $scope.drawPoly(window.map, $scope.MapPolyPtList[EvtGd].ptPathList[i].latitude,
                        $scope.MapPolyPtList[EvtGd].ptPathList[i].longitude);
                }
                $scope.finalPoly = true;

                var bound = new olleh.maps.Bounds(new olleh.maps.UTMK($scope.mapLeftBottom.x, $scope.mapLeftBottom.y),
                                                    new olleh.maps.UTMK($scope.mapRightTop.x, $scope.mapRightTop.y));

                window.map.panToBounds(bound);

                var ptln = $scope.polyPtList.rows.length;
                for(var i=0;i<ptln;i++){
                    $scope.polyPtList.rows.pop();
                }
                for(var i=0;i<$scope.MapPolyPtList[EvtGd].ptPathList.length;i++){
                    $scope.polyPtList.rows.push({drawType :"다각영역", latitudeValue:$scope.MapPolyPtList[EvtGd].ptPathList[i].latitude,
                        longitudeValue:$scope.MapPolyPtList[EvtGd].ptPathList[i].longitude});
                }
                $scope.polyPtList.total = $scope.polyPtList.rows.length;
                $scope.polyPtList.page = 1;
                $scope.finalPoly = true;
            }
        }
        if($scope.isLine){
            if($scope.MapLinePtList[EvtGd].ptPathList.length >0){
                for(var i=0;i<$scope.MapLinePtList[EvtGd].ptPathList.length;i++){
                    $scope.drawline(window.map, $scope.MapLinePtList[EvtGd].ptPathList[i].latitude,
                        $scope.MapLinePtList[EvtGd].ptPathList[i].longitude);
                }
                $scope.finalLine = true;
                var bound = new olleh.maps.Bounds(new olleh.maps.UTMK($scope.mapLeftBottom.x, $scope.mapLeftBottom.y),
                    new olleh.maps.UTMK($scope.mapRightTop.x, $scope.mapRightTop.y));
                window.map.panToBounds(bound);

                var ptln = $scope.linePtList.rows.length;
                for(var i=0;i<ptln;i++){
                    $scope.linePtList.rows.pop();
                }
                for(var i=0;i<$scope.MapLinePtList[EvtGd].ptPathList.length;i++){
                    $scope.linePtList.rows.push({drawType :"선영역", latitudeValue:$scope.MapLinePtList[EvtGd].ptPathList[i].latitude,
                        longitudeValue:$scope.MapLinePtList[EvtGd].ptPathList[i].longitude});
                    $scope.linePtList.total = $scope.linePtList.rows.length;
                    $scope.linePtList.page = 1;
                }
            }
        }
    };
    /** ==================
     * load 후에 사용할 함수들 끝
     ====================*/

    /** ==================
     * 맵 관련 함수 끝
     ====================*/

    $scope.inputDataTypeChange = function() {
        if( $scope.inputDataSelect == '이벤트데이터' ){
            $scope.inputDataListView = false;
        }else if( $scope.inputDataSelect == '디바이스데이터' ){
            $scope.inputDataListView = true;
        }
    };
    $scope.saveData = function() {
        var DrawTypeStr = '';
        var otherMsg = '';
        if ($scope.DrawType == "Circle") {
            DrawTypeStr = '원영역';
            otherMsg = '중앙점 : ' + $scope.MapCirclePtList[0].latitudeValue + '-' + $scope.MapCirclePtList[0].longitudeValue + '\n';
            otherMsg += '반지름 : ' + $scope.MapCirclePtList[0].radiusValue + '';
        } else if ($scope.DrawType == "Rectangle") {
            DrawTypeStr = '사각영역';
            otherMsg = '위도 : ' + $scope.MapRectPtList[0].latitudeValue1 + '~' + $scope.MapRectPtList[0].latitudeValue2 + '\n';
            otherMsg += '경도 : ' + $scope.MapRectPtList[0].longitudeValue1 + '~' + $scope.MapRectPtList[0].longitudeValue2 + + '';
        } else if ($scope.DrawType == "Poligon") {
            DrawTypeStr = '다각영역';
        } else if ($scope.DrawType == "Line") {
            DrawTypeStr = '라인영역';
        }
        var title = '선택영역 : ' + DrawTypeStr + '\n';
            title += otherMsg;
        var validate = $scope.validation();

        // 현재 지도의 사이즈를 체크해 놓는다.
        var mapLeftBottom = window.map.getBounds().asDefault().leftBottom;
        var mapRightTop = window.map.getBounds().asDefault().rightTop;

        var rowData = {
            title : title,
            validate : validate,
            DrawType : $scope.DrawType,
            EvtGd : $scope.EvtGd,
            eventGd : $scope.eventGd,
            terrInYn : $scope.terrInYn,
            inputDataSelect : $scope.inputDataSelect,
            latitudeTagStrm : $scope.latitudeTagStrm,
            longitudeTagStrm : $scope.longitudeTagStrm,
            latitudeEventItem : $scope.latitudeEventItem,
            longitudeEventItem : $scope.longitudeEventItem,
            mapLeftBottom : mapLeftBottom,
            mapRightTop : mapRightTop,
            MapCirclePtList : $scope.MapCirclePtList,
            MapRectPtList : $scope.MapRectPtList,
            MapPolyPtList : $scope.MapPolyPtList,
            MapLinePtList : $scope.MapLinePtList
        };

        $modalInstance.close(rowData);

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.validation = function () {
        if( $scope.inputDataSelect == '이벤트데이터' ){
            if( !$scope.latitudeEventItem | !$scope.longitudeEventItem ){
                return false;
            }
        }else if( $scope.inputDataSelect == '디바이스데이터' ){
            if( !$scope.latitudeTagStrm | !$scope.longitudeTagStrm ){
                return false;
            }
        }

        if ($scope.DrawType == "Circle") {
            if( $scope.MapCirclePtList[0].latitudeValue == '' && $scope.MapCirclePtList[0].longitudeValue == ''){
                return false;
            }
        } else if ($scope.DrawType == "Rectangle") {
            if( $scope.MapRectPtList[0].latitudeValue1 == '' && $scope.MapRectPtList[0].longitudeValue1 == ''
                && $scope.MapRectPtList[0].latitudeValue2 == '' && $scope.MapRectPtList[0].longitudeValue2 == '' ){
                return false;
            }
        } else if ($scope.DrawType == "Poligon") {
            if( !$scope.MapPolyPtList[0].ptPathList.length > 0 ){
                return false;
            }
        } else if ($scope.DrawType == "Line") {
            if( !$scope.MapLinePtList[0].ptPathList.length > 0 ){
                return false;
            }
        }
        return true;
    };

    $scope.init = function () {

        var canvas = dataFactory.getEditorCanvas();
        // 연결되어있는 디바이스 정보를 찾는다.
        var shapeId = 'OG.shape.VerticalGroupShape';
        var eventBase = canvas.getElementsByShapeId(shapeId)
        if( !eventBase || eventBase.length == 0 ) {
            $scope.eventView = false;
            $scope.errorMassage = '위치기반 이벤트 등록은 이벤트 정의 안쪽에 들어있어야 합니다.';
            return;
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
                $scope.eventItemList = [];
                for( var i=0; i <fromEdge.length; i++){
                    var fromTerminal = $('#'+fromEdge[i]).attr('_from');
                    var fromElement = getShapeFromTerminal(fromTerminal);
                    var fromElementId = $(fromElement).attr('id');
                    var fromGraphType = fromElementId.split('_')[0];
                    // 디바이스데이터를 설정할때 태그스트림도 가져와서 dataFactory에 저장이 되어있다.
                    if (fromGraphType == EVENT_INPUT_TYPE_DEVICE) {
                        //$scope.tagStrmList=  dataFactory.getTagStreamData(fromElementId) ;
                        var rowData = dataFactory.getTagStreamData(fromElementId);
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
                        relatedElementFlag = true;
                    } else if (fromGraphType == EVENT_INPUT_TYPE_EVENT) {
                        // 이벤트 val 데이터를 가져온다 - 이벤트가 처음에 설정되는 시점에 셋팅이 되어있는 정보를 가져온다.
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
            var rowData2 = dataFactory.getCurrentEventValData();
            if( rowData2 ) {
                for (var j = 0; j < rowData2.length; j++) {
                    var rowDataItems = rowData2[j];
                    rowDataItems.alias = '';
                    rowDataItems.statEvetNm = '현재 이벤트';

                    $scope.eventItemList.push(rowDataItems);
                }
            }
            if( relatedElementFlag ){
                $scope.eventView = true;
            }else{
                $scope.eventView = false;
                $scope.errorMassage = '※ 연결되어있는 디바이스 및 이벤트 데이터가 없습니다. Input 데이터를 먼저 연결하여 주세요.';
                return;
            }
        }

        // default whereIsTimers setting
        var mapOptions = {
            center: new olleh.maps.UTMK(958386.063532902, 1941447.5761742294),
            zoom: 10,
            mapTypeId: 'ROADMAP'

        };
        var map = new olleh.maps.Map(document.getElementById('modal_map1'), mapOptions);

        // default setting
        $scope.setOptCondList($scope.EvtGd + 1);
        $scope.setDrawType('Circle');
        $scope.eventGd = $scope.evetGdList[0];

        /*********************************
         * 이벤트 설정 시작
         ********************************/
        map.onEvent('rightclick', function (event, payload) {
            if (isDraw == true){
                if($scope.isLine == true){
                    oldMarker.erase();
                    oldMarker.setVisible(false);
                    $scope.finalLine = true;
                    $scope.drawMarker(map, event.getCoord());
                    $scope.linepaths = linepaths;
                    var LatLngCoord;
                    LatLngCoord = olleh.maps.LatLng.valueOf(event.getCoord().asDefault());
                    $scope.$apply(function(){
                        $scope.addpt(4,LatLngCoord.y.toFixed(6),LatLngCoord.x.toFixed(6));
                    });
                }
                if($scope.isPoly == true){
                    oldMarker.erase();
                    oldMarker.setVisible(false);
                    $scope.finalPoly = true;
                    $scope.drawMarker(map, event.getCoord());
                    $scope.polypaths = polypaths;
                    var LatLngCoord;
                    LatLngCoord = olleh.maps.LatLng.valueOf(event.getCoord().asDefault());
                    $scope.$apply(function(){
                        $scope.addpt(3,LatLngCoord.y.toFixed(6),LatLngCoord.x.toFixed(6));
                    });
                }
            }
            isDraw = false;

        });
        map.onEvent('click', function (event, payload) {
            var result = $scope.checkDrawed();
            if($scope.finalPoly == true || $scope.finalLine == true || $scope.finalCircle == true || $scope.finalRect == true){
                alert('이미 영역이 설정되어 있습니다. \n초기화후 다시 설정해 주십시요.');
                return;
            }
            if(result == false){
                alert('이미 영역이 설정되어 있습니다. \n초기화후 다시 설정해 주십시요.');
                return;
            }
            var coord = event.getCoord();
            var point = event.getPoint();

            $scope.createStartPt(map, coord, point);
            if($scope.isPoly == true){
                $scope.finalPoly = false;
                polypaths.push(event.getCoord());
                $scope.polypaths = polypaths;
                $scope.drawMarker(map, coord);
                polyed = true;
                $scope.polyed = polyed;

                var LatLngCoord;
                LatLngCoord = olleh.maps.LatLng.valueOf(coord.asDefault());

                $scope.$apply(function(){
                    $scope.addpt(3,LatLngCoord.y.toFixed(6),LatLngCoord.x.toFixed(6));
                });
            }else if($scope.isLine == true){
                $scope.finalLine = false;
                linepaths.push(event.getCoord());
                $scope.linepaths = linepaths;
                $scope.drawMarker(map, coord);
                lined = true;
                $scope.lined = lined;
                var LatLngCoord;
                LatLngCoord = olleh.maps.LatLng.valueOf(coord.asDefault());

                $scope.$apply(function(){
                    $scope.addpt(4,LatLngCoord.y.toFixed(6),LatLngCoord.x.toFixed(6));
                });
            }else{
                isclick = !isclick;
                if(isclick){
                    if ($scope.isCircle == true) {
                        $scope.removeMarker();
                        $scope.drawMarker(map, coord);
                        if( $scope.DrawCircle ){
                            $scope.DrawCircle.erase();
                            $scope.DrawCircle.setVisible(false);
                        }
                    }
                    if($scope.isRect == true) {
                        $scope.removeMarker();
                        if( $scope.DrawRect ) {
                            $scope.DrawRect.erase();
                            $scope.DrawRect.setVisible(false);
                        }
                    }
                    if($scope.isPoly == true){
                        $scope.removeMarker();
                        if( $scope.DrawPoly ) {
                            $scope.DrawPoly.erase();
                            $scope.DrawPoly.setVisible(false);
                        }
                    }if($scope.isLine == true){
                        $scope.removeMarker();
                        if( $scope.DrawLine ) {
                            $scope.DrawLine.erase();
                            $scope.DrawLine.setVisible(false);
                        }
                    }
                }
                if(!isclick){
                    if (isDraw == true) {
                        if ($scope.isCircle == true) {
                            isDraw = false;
                            circled = true;
                            $scope.circled = circled;
                        }else if($scope.isRect == true) {
                            isDraw = false;
                            rected = true;
                            $scope.removeMarker();
                            $scope.drawMarker(map, rectBound1);
                            $scope.drawMarker(map, rectBound2);
                            $scope.drawMarker(map, rectBound3);
                            $scope.drawMarker(map, rectBound4);
                            $scope.rected = rected;
                        }
                    }
                }
            }
        });
        map.onEvent('mousemove', function (event, payload) {
            if (document.createEvent) { // W3C
                var ev = document.createEvent('Event');
                ev.initEvent('resize', true, true);
                window.dispatchEvent(ev);
            } else { // IE
                var element=document.documentElement;
                var evt=document.createEventObject();
                element.fireEvent("onresize",evt);
            }
            var coord = event.getCoord();
            if (isDraw == true) {
                if ($scope.isCircle == true) {
                    $scope.drawCircleTemp(map, coord);
                }else if($scope.isRect == true){
                    $scope.drawRectTemp(map, coord);
                }else if($scope.isPoly == true){
                    $scope.drawPolyTemp(map, coord, polypaths);
                }else if($scope.isLine == true){
                    $scope.drawLineTemp(map, coord, linepaths);
                }
            }
        });

        /*********************************
         * 이벤트 설정 끝
         ********************************/

        window.map = map;

        if( items && items.data ){
            $scope.DrawType = items.data.DrawType;
            $scope.EvtGd = items.data.EvtGd;
            $scope.terrInYn = items.data.terrInYn;
            if( items.data.eventGd ) {
                for (var i = 0; i < $scope.evetGdList.length; i++) {
                    if (items.data.eventGd.evetGdCd == $scope.evetGdList[i].evetGdCd) {
                        $scope.eventGd = $scope.evetGdList[i];
                    }
                }
            }

            $scope.inputDataSelect = items.data.inputDataSelect;
            angular.forEach($scope.tagStrmList, function(value, key) {
                if( items.data.latitudeTagStrm != null && items.data.latitudeTagStrm.tagStrmSeq && value.tagStrmSeq == items.data.latitudeTagStrm.tagStrmSeq){
                    $scope.latitudeTagStrm = value;
                }
            });
            angular.forEach($scope.tagStrmList, function(value, key) {
                if( items.data.longitudeTagStrm != null && items.data.longitudeTagStrm.tagStrmSeq && value.tagStrmSeq == items.data.longitudeTagStrm.tagStrmSeq){
                    $scope.longitudeTagStrm = value;
                }
            });
            angular.forEach($scope.eventItemList, function(value, key) {
                if( items.data.latitudeEventItem != null && items.data.latitudeEventItem.itemHanNm && value.itemHanNm == items.data.latitudeEventItem.itemHanNm){
                    $scope.latitudeEventItem = value;
                }
            });
            angular.forEach($scope.eventItemList, function(value, key) {
                if( items.data.longitudeEventItem != null && items.data.longitudeEventItem.itemHanNm && value.itemHanNm == items.data.longitudeEventItem.itemHanNm){
                    $scope.longitudeEventItem = value;
                }
            });
            $scope.inputDataTypeChange();

            // 이렇게 카피를 해야 이전객체가 저장이 된다.
            angular.copy(items.data.MapCirclePtList, $scope.MapCirclePtList);
            angular.copy(items.data.MapRectPtList, $scope.MapRectPtList);
            angular.copy(items.data.MapPolyPtList, $scope.MapPolyPtList);
            angular.copy(items.data.MapLinePtList, $scope.MapLinePtList);

            $scope.mapLeftBottom = items.data.mapLeftBottom;
            $scope.mapRightTop = items.data.mapRightTop;
            
            $scope.setDrawType($scope.DrawType);
            $scope.changeGd($scope.EvtGd);
        }
    };

    $timeout(function() {
        //$scope.modalInit();
        $scope.init();
    });
};