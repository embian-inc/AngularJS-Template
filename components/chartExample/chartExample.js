'use strict'
angular.module('app')
	.directive('barChartExample',['chartExampleAjaxService', function(chartExampleAjaxService){
		var controller = function(){
		}
		
		var data = {
			columns: [
				['x1', 10, 30, 45, 50, 70, 100],
				['x2', 30, 50, 75, 100, 120, 250],
				['data1', 30, 200, 100, 400, 150],
				['data2', 20, 180, 240, 100, 190]
			],
			type: 'bar'
		};
		
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			templateUrl: 'components/chartExample/barChartExample.html',
			link: function ($scope, $element, $attrs) {
				var paramObj = "";
				var cObj = {display_place: 'bar-chart-example', data : data, }
				chartExampleAjaxService.setParams(paramObj);
				chartExampleAjaxService.setCharts(cObj);
//				chartExampleAjaxService.callAjax($scope)
			},
			controller: controller
		};
	}])
	.directive('lineChartExample',['chartExampleAjaxService', function(chartExampleAjaxService){
		var controller = function(){
		}
		
		var data = {
			columns: [
				['x1', 10, 30, 45, 50, 70, 100],
				['x2', 30, 50, 75, 100, 120, 250],
				['data1', 30, 200, 100, 400, 150],
				['data2', 20, 180, 240, 100, 190]
			]
		};
		
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			templateUrl: 'components/chartExample/lineChartExample.html',
			link: function ($scope, $element, $attrs) {
				var paramObj = "";
				var cObj = {display_place: 'line-chart-example', data : data, } 
				chartExampleAjaxService.setParams(paramObj);
				chartExampleAjaxService.setCharts(cObj);
//				chartExampleAjaxService.callAjax($scope)
			},
			controller: controller
		};
	}])
	.directive('pieChartExample',['chartExampleAjaxService', function(chartExampleAjaxService){
		var controller = function(){
		}
		
		var data = {
			columns: [
				['data1', 30],
				['data2', 120],
			],
			type : 'donut',
//			onclick: function (d, i) { console.log("onclick", d, i); },
//			onmouseover: function (d, i) { console.log("onmouseover", d, i); },
//			onmouseout: function (d, i) { console.log("onmouseout", d, i); }
		};
		
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			templateUrl: 'components/chartExample/pieChartExample.html',
			link: function ($scope, $element, $attrs) {
				var paramObj = "";
				var cObj = {display_place: 'pie-chart-example', data : data, }
				chartExampleAjaxService.setParams(paramObj);
				chartExampleAjaxService.setCharts(cObj);
//				chartExampleAjaxService.callAjax($scope)
			},
			controller: controller
		};
	}]);