'use strict'
angular.module('app')
	.directive('navMenu', function(){
		var controller = function(){
			console.log("navMenu Controller!");
		}
		
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			templateUrl: 'components/navMenu/navMenu.html',
			link: function ($scope, $element, $attrs) {
				$scope.active = 'Dashboard';
//				$scope.active = 'UI-Element';
			},
			controller: controller
		};
	});