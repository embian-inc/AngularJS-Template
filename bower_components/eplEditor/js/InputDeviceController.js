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
angular.module('3mp.core.eplEditor').controller('InputDeviceController', InputDeviceController);

function InputDeviceController($scope , items, $http, $modal, $modalInstance, dataFactory, store) {
    var elementId = items.elementId;
    var previousDeviceModelData = null;
    var previousDeviceData = null;
    $scope.spotDevList = [];
    $scope.isAdmin = (eventDeployType == 'admin') ? true : false;
    $scope.deviceModelAdminPopupView = false;
    $scope.deviceAdminPopupView = false;
        
    if( items && items.deviceModelAdminPopupView == true){
        $scope.deviceModelAdminPopupView = true;
    }
    $scope.deviceModelDataAdminList = {
        rows:[
        ]
    };
    

    if( items && items.deviceAdminPopupView == true){
        $scope.deviceAdminPopupView = true;
    }
    $scope.deviceDataAdminList = {
        rows:[
        ]
    };

    $scope.saveData = function() {
        if( !$scope.deviceModelData ){
            alert('디바이스 모델을 선택하여 주세요.');
            return;
        }
     
        if( previousDeviceModelData != null && previousDeviceModelData.devModelSeq != $scope.deviceModelData.devModelSeq){
            // 이전에 설정해 놓았던 장치가 변경이 되었다면, 이전에 선택되었던 장치의 태그스트림을 사용하였던 도형을 찾아서, 에러로 표시를 한다.
            var data = dataFactory.getInputDataByEleId('device', previousDeviceModelData.devModelSeq);
            if( data != null ){
                var canvas = dataFactory.getEditorCanvas();
                for(var i=0; i <data.length; i++){
                    var errorElement = canvas.getElementById(data[i].elementId);
                    if( errorElement ){
                        $scope.validationDraw(errorElement, 'error');
                    }
                }
            }
            if(!previousDeviceData){
            	$scope.deviceData = null;	
            } 
        }

        if(!$scope.deviceData){
        	$scope.deviceData = $scope.deviceModelData;
        	$scope.deviceData.isSelectOnlyModel = true;
        }
        
        $scope.deviceAlias = 'col' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        
        var validate = $scope.validation();
        
        var title = null;
        if($scope.deviceData.isSelectOnlyModel){
        	 title = '이름 : ' + $scope.deviceData.devModelNm + '\n';
        }else{
        	 title = '이름 : ' + $scope.deviceData.devNm + '\n';
        }
//        title += '별칭 : ' + $scope.deviceAlias;
              
        var rowData = {
            title : title,
            validate : validate,
            deviceData : $scope.deviceData,
            spotDevData : $scope.spotDevData,
            deviceAlias : $scope.deviceAlias
        }
        dataFactory.deviceDataInitSetting(elementId, $scope.deviceData, $scope.deviceAlias, $scope.spotDevData);
        $modalInstance.close(rowData);
    };

    $scope.changeDeviceId = function (spotDevData) {
        $scope.spotDevList = [];
        var tempDevModelSeq = $scope.deviceData.devModelSeq;
        for( var i=0; i < $scope.deviceDataList.length; i++){
            if( $scope.deviceDataList[i].devModelSeq == tempDevModelSeq ){
                $scope.spotDevList.push($scope.deviceDataList[i]);
                if( spotDevData && spotDevData == tempDevModelSeq){
                    // loding data
                    $scope.spotDevData = $scope.spotDevList[$scope.spotDevList.length -1 ];
                }
            }
        }
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.validation = function () {
        if( !$scope.deviceData || !$scope.deviceAlias ){
            return false;
        }
        return true;
    };
    /*******************************************
     * Admin 검색관련 셋팅 시작
     ******************************************/

    $scope.selectModelRow = function (selectData) {
        $scope.deviceModelData = selectData;
    };
    $scope.selectRow = function (selectData) {
        $scope.deviceData = selectData;
    };
    $scope.changePage = function(page, rowNum) {
        $scope.init(page, rowNum);
    };
    $scope.selectModelData = function() {
        if( !$scope.deviceModelData ){
            alert('디바이스 모델을 선택하여 주세요');
            return;
        }
        
        $scope.deviceData = null;
       
        $modalInstance.close({model:$scope.deviceModelData, device:$scope.deviceData});
    };
    
    $scope.selectData = function() {
        if( !$scope.deviceData ){
            alert('디바이스를 선택하여 주세요');
            return;
        }
        
        $modalInstance.close($scope.deviceData);
    };
    
    $scope.showDeviceModelAdminList = function () {

        var modalInstance = $modal.open({
            templateUrl: deployHtmlUrl + "eplEditor/html/InputDeviceModelPopup.html",
            controller: InputDeviceController,
            scope: $scope,
            windowClass: 'app-modal-window',
            size: 'lg',
            resolve: {
                items: function () {
                    var item = {
                        deviceModelAdminPopupView : true
                    }
                    return item;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.deviceModelData = selectedItem.model;
            $scope.deviceData = selectedItem.device;

        }, function () {
        });
    };
    
    $scope.showDeviceAdminList = function () {
    	if(!$scope.deviceModelData){
    		alert('연관 디바이스 모델을 선택해주세요.');
            return;
    	}
    	

        var modalInstance = $modal.open({
            templateUrl: deployHtmlUrl + "eplEditor/html/InputDevicePopup.html",
            controller: InputDeviceController,
            scope: $scope,
            windowClass: 'app-modal-window',
            size: 'lg',
            resolve: {
                items: function () {
                    var item = {
                        deviceAdminPopupView : true
                    }
                    return item;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.deviceData = selectedItem;

        }, function () {
        });
    };

    $scope.searchList = function(searchDstrCd , searchSvcThemeCd , searchUnitSvcCd, searchUseYn, searchOttpYn, searchType, searchText){
        $scope.searchDstrCd = searchDstrCd;
        $scope.searchSvcThemeCd = searchSvcThemeCd;
        $scope.searchUnitSvcCd = searchUnitSvcCd;
        $scope.searchUseYn = searchUseYn;
        $scope.searchOttpYn = searchOttpYn;
        $scope.searchType = searchType;
        $scope.searchText = searchText;
        $scope.init(1, 10);
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

    /*******************************************
     * Admin 검색관련 셋팅 끝
     ******************************************/

    $scope.init = function(pageNum, pageCon){
    	/*디바이스 모델 조회 팝업*/
        if( ($scope.isAdmin && $scope.deviceModelAdminPopupView) || (!$scope.isAdmin && !$scope.deviceModelDataList) ){
        	var url_temp = url_master + '/devModels/' + store.get('svc_tgt_seq') + '?pageNum=' + pageNum + '&pageCon=' + pageCon ;
            if($scope.isAdmin){   // admin 일때?
            	url_temp = url_master  + '/devModels?pageNum=' + pageNum + '&pageCon=' + pageCon;
                  if($scope.searchType != null  && $scope.searchText != null && $scope.searchType == 'devModelNm'){
                      url_temp += '&devTypeCd=&devModelNm=' + $scope.searchText;
                  }else if($scope.searchType != null  && $scope.searchText != null && $scope.searchType == 'devTypeCd'){
                	  url_temp += '&devModelNm=&devTypeCd=' + $scope.searchText ;
                  }else{
                	  url_temp += '&devModelNm=&devTypeCd=';
                  }
            }
            
            var response = $http.get(url_temp);
            response.success(function (data, status, headers, config) {
                if (data.data && data.data.rows) {
                    if( $scope.isAdmin && $scope.deviceModelAdminPopupView ){
                        if( data.data.rows && data.data.rows.length > 0 ){
                            $scope.deviceModelDataAdminList.rows =  data.data.rows;
                            $scope.deviceModelDataAdminList.total = parseInt( data.data.total / pageCon ) + (parseInt( data.data.total % pageCon ) == 0 ? '' : 1) ;
                            $scope.deviceModelDataAdminList.page = data.data.page;
                        }else{
                        	$scope.deviceModelDataAdminList = null;
                        }
                    }else{
                        $scope.deviceModelDataList = data.data.rows;
                        if( items && items.data ){
                            // device 초기선택값 선택하기
                            angular.forEach(data.data.rows, function(value, key) {
                                if(value.devModelSeq == items.data.deviceModelData.devModelSeq){
                                    $scope.deviceModelData = value;
                                    previousDeviceModelData = value;
                                    var spotDevSelectedModelSeq = '';
                                    if( items.data.spotDevData && items.data.spotDevData.devModelSeq){
                                        spotDevSelectedModelSeq = items.data.spotDevData.devModelSeq
                                    }
                                    $scope.changeDeviceId(spotDevSelectedModelSeq);
                                }
                            });
                        }
                    }
                }

            });
            response.error(function (data, status, headers, config) {
                //alert( "Exception details: " + JSON.stringify({data: data}));
            });
        }else{
            if( items && items.data ){
                $scope.deviceModelData = items.data.deviceData;
                previousDeviceModelData = items.data.deviceData;
            }else if($scope.deviceAdminPopupView){
            	;
            }else{
                $scope.deviceModelData = null;
            }
        }
        
        
        
        /*디바이스 조회 팝업*/
        if( ($scope.isAdmin && $scope.deviceAdminPopupView) || (!$scope.isAdmin && !$scope.deviceDataList) ){
        	var url_temp = url_master + '/device/listDevice/' + store.get('svc_tgt_seq') + '?pageNum=' + pageNum + '&pageCon=' + pageCon ;
        	        	
            if($scope.isAdmin){   // admin 일때?
            	url_temp = url_master  + '/device/listDevice?pageNum=' + pageNum + '&pageCon=' + pageCon ;
            	if($scope.deviceModelData){
            		url_temp+='&devModelSeq='+$scope.deviceModelData.devModelSeq;
            	}
                if($scope.searchDstrCd){
                    url_temp += '&dstrCd=' + $scope.searchDstrCd.dstrCd ;
                }
                if($scope.searchSvcThemeCd){
                    url_temp += '&svcThemeCd=' + $scope.searchSvcThemeCd.svcThemeCd ;
                }
                if($scope.searchUnitSvcCd){
                    url_temp += '&unitSvcCd=' + $scope.searchUnitSvcCd.unitSvcCd ;
                }
                if($scope.searchUseYn ){
                    url_temp += '&useYn=' + $scope.searchUseYn ;
                }
                if($scope.searchOttpYn){
                    url_temp += '&ottpYn=' + $scope.searchOttpYn ;
                }
                if($scope.searchText){
                    url_temp += '&' + $scope.searchType + '=' + $scope.searchText ;
                }
            }
            var response = $http.get(url_temp);
            response.success(function (data, status, headers, config) {
                if (data.data && data.data.rows) {
                    if( $scope.isAdmin && $scope.deviceAdminPopupView ){
                        if( data.data.rows && data.data.rows.length > 0 ){
                            $scope.deviceDataAdminList.rows =  data.data.rows;
                            $scope.deviceDataAdminList.total = parseInt( data.data.total / pageCon ) + (parseInt( data.data.total % pageCon ) == 0 ? '' : 1) ;
                            $scope.deviceDataAdminList.page = data.data.page;
                        }else{
                            $('#deviceListGrid-emptyMsg').html( "<div style='font-size:8pt;text-align:center;padding:10px;height:auto'>데이터가 없습니다.</div>" );
                        }
                    }else{
                        $scope.deviceDataList = data.data.rows;
                        if( items && items.data ){
                            // device 초기선택값 선택하기
                            angular.forEach(data.data.rows, function(value, key) {
                                if(value.devModelSeq == items.data.deviceData.devModelSeq){
                                    $scope.deviceData = value;
                                    previousDeviceData = value;
                                    var spotDevSelectedModelSeq = '';
                                    if( items.data.spotDevData && items.data.spotDevData.devModelSeq){
                                        spotDevSelectedModelSeq = items.data.spotDevData.devModelSeq
                                    }
                                    $scope.changeDeviceId(spotDevSelectedModelSeq);
                                }
                            });
                            $scope.deviceAlias = items.data.deviceAlias;
                            
                        }
                    }
                }

            });
            response.error(function (data, status, headers, config) {
                //alert( "Exception details: " + JSON.stringify({data: data}));
            });
        }else{
            if( items && items.data ){
                $scope.deviceData = items.data.deviceData;
                previousDeviceData = items.data.deviceData;
                $scope.deviceAlias = items.data.deviceAlias;
            }else if($scope.deviceModelAdminPopupView){
            	;
            }else{
                $scope.deviceData = null;
                $scope.deviceAlias = null;
            }
        }

    };
    $scope.init(1, 10);
    if($scope.isAdmin){
        // 초기 selectBox setting
        $scope.getDstrCdList();
        $scope.searchType = 'devNm';
    }
};
