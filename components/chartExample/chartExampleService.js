angular.module('app')
	.service('chartExampleAjaxService', function($http, config, ChartService){
		this.callAjax = function ($scope) {
			$http({
				method: 'GET',
//				url: url,
				url: '',
				params: paramObj
			}).success(function(data,status,headers,config) {
				ChartService.chart(chartObj.display_place, data);
			}).error(function(data,status,headers,config) {
				
			});
		};
	
		this.setParams = function (pObj) {
			paramObj = pObj;
		};
		
		this.setCharts = function (cObj) {
			chartObj = cObj;
			ChartService.chart(chartObj.display_place, chartObj.data);
		}
		
		var url = config.urlConfig();
		var paramObj = {};
		var chartObj = {};
	})
	.service('ChartService', function() {
		this.chart = function (display_place, data) {
			var chart = c3.generate(chart_object(display_place, data));
		};

		function chart_object (display_place, data){
			var width = $('#' + display_place).width();
			var height = $('#' + display_place).height();
			
			var chartObj = {
				size: {
					width: width,
					height: width
				},
				bindto: '#' + display_place,
				data: data,
				padding: {
					top: 10,
					bottom: 10,
					right: 10,
				}
			};
			
			return chartObj;
		}
	});


