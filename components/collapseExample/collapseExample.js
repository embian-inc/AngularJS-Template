'use strict'

angular.module('app')
	.directive('collapseExample', function() {
		var controller = ['$scope', function ($scope) {
			$scope.typeItems = [{id: 'Select', value: ''},{id: 'War', value: 'S'},
			                            {id: 'GROUP', value: 'G'}];
			/* 초기화 */
			$scope.collapseExampleType = '';
			$scope.collapseExampleValue = '';

			$scope.isCollapsed = false;
			$scope.valueIsDisabled = true;
			
			/* Change, Submit, Cancel Event */
			$scope.collapseTypeChange = function(type) {
				$scope.collapseExampleType = type;
				$scope.valueIsDisabled = false;
			};

			$scope.collapseExampleCancel = function() {
				this.valueIsDisabled = true;
				this.isCollapsed = true;
				this.collapseExampleType = "";
				this.collapseExampleValue = "";
			};

			$scope.collapseExampleSubmit = function() {
				if (this.collapseExampleType == "" || this.collapseExampleValue == "") {
					alert('정보가 입력되지 않았습니다.');
				} else {
					var params = {
						type:this.collapseExampleType,
						value:this.collapseExampleValue
					};
//					collapseExampleService.CreateAjax($scope, params);
					this.isCollapsed = true;
					this.collapseExampleType = "";
					this.collapseExampleValue = "";
				}
			};
		}];
		
		return {
			restrict: 'EA',
			replace: true,
			templateUrl: 'components/collapseExample/collapseExample.html',
			link: function($scope, $element, $attrs) {  },
			controller: controller
		}
    });
