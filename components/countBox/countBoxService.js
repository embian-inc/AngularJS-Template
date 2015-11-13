'use strict'

angular.module('app')
	.service('countColorService', function(){
    	this.eventCountBoxColor = function($scope) {
    		if ($scope.totalCnt != 0){
    			$scope.totalStyle = {'background-color': '#4a4a4a'};
    		}else { $scope.totalStyle = {'background-color': '#CCC'}; }

    		if ($scope.succCnt != 0 && $scope.warnCnt == 0 && $scope.failCnt == 0) {
    			$scope.succStyle = {'background-color': '#009900'};
    		} else { $scope.succStyle = {'background-color': '#CCC'}; }

    		if ($scope.warnCnt != 0 && $scope.failCnt == 0) {
    			$scope.warn1Style = {'background-color': '#ffcc00', 'color': '#333'};
    		} else { $scope.warn1Style = {'background-color': '#CCC'} };

    		if ($scope.failCnt != 0) {
    			$scope.failStyle = {'background-color': '#ff0033'};
    		} else { $scope.failStyle = {'background-color': '#CCC'} };
    	};
    })
    .service('countBoxAjaxService', function($http, config, countColorService){
    	this.callAjax = function ($scope) {
    		$http({
    			method: 'GET',
//    			url: url,
    			url: './sampleData/countBoxSampleData.json',
    			params: paramObj
    		}).success(function(data,status,headers,config) {
    			if(data.code == 200) {
	    			var cntData = data.result.data;
	    			$scope.totalCnt = cntData.total*1;
	    			$scope.succCnt = cntData.succ*1;
	    			$scope.warnCnt = cntData.warnl1*1;
	    			$scope.failCnt = cntData.fail*1;
    			}else {
					console.log('EventCountBox Ajax : ' + data.error);
					console.log("EventCountBOx : No Data");
					$scope.totalCnt = 0;
    				$scope.succCnt = 0;
    				$scope.warnCnt = 0;
    				$scope.failCnt = 0;
				}
    			countColorService.eventCountBoxColor($scope);
    		}).error(function(data,status,headers,config) { });
    	};

    	this.setParams = function (pObj) {
    		paramObj = pObj;
    	};
    	var url = config.urlConfig() + 'eventcount';
    	var paramObj = {};
    })