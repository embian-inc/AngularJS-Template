'use strict'
angular.module('app')
	.directive('mainContents', function(){
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			templateUrl: 'components/mainContents/mainContents.html',
			link: function ($scope, $element, $attrs) {
			},
		};
	})