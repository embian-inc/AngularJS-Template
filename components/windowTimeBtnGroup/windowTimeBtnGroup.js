'use strict'

angular.module('app')
	.directive('windowTimeBtnGroup', ['$route', 'timeDataService',
	                                  'windowTimeDisplayService', 'cookieService', 
	                          function($route, timeDataService, 
	                        		       windowTimeDisplayService, cookieService){
		var controller = ['$scope', function($scope) {
    		$scope.winTimeBtn = timeDataService.selected_time();
//    		checkWarnAjaxService.checkWarnAjax($scope);

    		$scope.windowTimeDisplay = function(){
				var timeMoveOpt = {};
				timeDataService.timeData = windowTimeDisplayService.windowTimeDisplay($scope, $scope.winTimeBtn, timeMoveOpt);
				
				cookieService.setCookie('timeMove', '' , -1);
	    		cookieService.setCookie('refreshTime', '' , -1);
	    		cookieService.setCookie('selectedTime', timeDataService.timeData.selected_time , 1);
	    		cookieService.setCookie('from', timeDataService.timeData.from , 1);
	    		cookieService.setCookie('to', timeDataService.timeData.to , 1);
	    		cookieService.setCookie('timeMove', timeDataService.timeData.timeMove , 1);

	        	$route.reload();
	        	
//				$scope.$emit('preTimeNum', timeDataService.timeData);
    		};

    		$scope.$on('autoRefreshEvent',function(args, refreshData) {
				console.log('Do Refresh Event Start');
				timeDataService.timeData = windowTimeDisplayService.windowTimeDisplay($scope, $scope.winTimeBtn, timeDataService.timeMoveOpt());
//				checkWarnAjaxService.checkWarnAjax($scope);
				$scope.$emit('doRefreshAjaxCall', '');
			});
    	}];
		
    	return {
    		restrict: 'EA',
    		replace: true,
    		transclude: true,
    		templateUrl: 'components/windowTimeBtnGroup/windowTimeBtnGroup.html',
    		link: function ($scope, $element, $attrs) {
    		},
    		controller: controller
    	};
    }]);
