'use strict'

angular.module('app')
	.directive('uiComponents', ['$route', '$state', 'cookieService', 
	                            'timeDataService', 'windowTimeDisplayService', 
	                    function($route, $state, cookieService, 
	                    			 timeDataService, windowTimeDisplayService){
		var controller = function($scope){
			timeDataService.timeData = windowTimeDisplayService.windowTimeDisplay($scope, timeDataService.selected_time(), timeDataService.timeMoveOpt());
		};	
		
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			templateUrl: 'components/uiComponents/uiComponents.html',
			link: function ($scope, $element, $attrs) {
			},
			controller: controller
		};
	}]);