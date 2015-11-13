'use strict'
angular.module('app')
	.directive('dagreD3Example',['dagreD3AjaxService', function(dagreD3AjaxService){
		var controller = function(){
		}
		
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			templateUrl: 'components/dagreD3Example/dagreD3Example.html',
			link: function ($scope, $element, $attrs) {
				var paramObj = "";
				dagreD3AjaxService.setParams(paramObj);
				dagreD3AjaxService.callAjax($scope);
			},
			controller: controller
		};
	}])