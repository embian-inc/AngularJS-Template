'use strict'
angular.module('app')
	.directive('dashboardContents', ['timeDataService', 'windowTimeDisplayService', 
	                         function(timeDataService, windowTimeDisplayService){
		var controller = function($scope){
//			timeDataService.timeData = windowTimeDisplayService.windowTimeDisplay($scope, timeDataService.selected_time(), timeDataService.timeMoveOpt());
		};
		
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			templateUrl: 'components/dashboard/dashboardContents.html',
			link: function ($scope, $element, $attrs) {
			},
			controller: controller
		};
	}]);