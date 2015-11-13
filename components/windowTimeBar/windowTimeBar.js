'use strict'

angular.module('app')
	.directive('windowTimeBar', ['$route', 'timeDataService','cookieService', 
	                     function($route, timeDataService, cookieService){
		
		var controller = function($scope){
			$scope.nextTimeBtnStyle = ($scope.isdisabled) ? {'background-color': '#eee'} : {'background-color': '#CCC'};
			$scope.isdisabled = (timeDataService.timeData.to + timeDataService.timeData.pre_t_num < new Date()) ? false : true;
			$scope.windowTimeMove = function(timeMoveBtn){
				var timeMoveOpt = {};
				timeMoveOpt[timeMoveBtn] = (timeMoveBtn == 'preTime') ? timeDataService.timeData.from : timeDataService.timeData.to;
				timeDataService.timeData['timeMove'] = timeMoveBtn;
				
	    		cookieService.setCookie('timeMove', '' , -1);
	    		cookieService.setCookie('refreshTime', '' , -1);
	    		cookieService.setCookie('selectedTime', timeDataService.timeData.selected_time , 1);
	    		cookieService.setCookie('from', timeDataService.timeData.from , 1);
	    		cookieService.setCookie('to', timeDataService.timeData.to , 1);
	    		cookieService.setCookie('timeMove', timeDataService.timeData.timeMove , 1);

	        	$route.reload();
	        	
//				$scope.$emit('preTimeNum2', timeDataService.timeData);
			};
		};
		
    	return {
    		restrict: 'EA',
    		replace: true,
    		transclude: true,
    		templateUrl: 'components/windowTimeBar/windowTimeBar.html',
    		link: function ($scope, $element, $attrs) {
    			
    			$scope.$watch('isdisabled', function(){
    				$scope.postdisabled = this.last;
    			});
    		},
    		controller: controller
    	};
    }]);
