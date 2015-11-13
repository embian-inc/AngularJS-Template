'use strict'

angular.module('app')
	.directive('tabExample', ['$route', '$state', 'cookieService', 
	                    function($route, $state, cookieService){
//		var controller = ['$scope', 'codeCrudService', function($scope, codeCrudService) {
		var controller = ['$scope', function($scope) {
			$( "#tabs" ).tabs({
			      collapsible: true
			});

//			codeCrudService.svcCodeSelectAjax($scope);
			$scope.serviceCode = '';
			$scope.serviceCodeName = '';


			$scope.svcIsCollapsed = true;
			$scope.actIsCollapsed = true;

			$scope.svcCodeChange = function(svcCode) {
				$scope.selectedSvcCode = svcCode;

//				codeCrudService.actCodeSelectAjax($scope);
			};

			$scope.svcCodeRemove = function(svcCode) {
				var params = {
						serviceCode:svcCode
				};
//				codeCrudService.svcCodeRemoveAjax($scope, params);
			};

			$scope.svcCodeCancel = function() {
				this.svcIsCollapsed = true;
				this.serviceCode = "";
				this.serviceCodeName = "";
			};

			$scope.svcCodeSubmit = function() {

				if (this.serviceCode == "" || this.serviceCodeName == "") {
					alert('코드가 입력되지 않았습니다.');
				} else {
					var params = {
						serviceCode:this.serviceCode,
						name:this.serviceCodeName
					};

//					codeCrudService.svcCodeCreateAjax($scope, params);

					this.svcIsCollapsed = true;
					this.serviceCode = "";
					this.serviceCodeName = "";
				}
			};

			$scope.actCodeCancel = function() {
				this.actIsCollapsed = true;
				this.actionCode = "";
				this.actionCodeName = "";
			};

			$scope.actCodeSubmit = function() {
				if (this.actionCode == "" || this.actionCodeName == "") {
					alert('코드가 입력되지 않았습니다.');
				} else {
					var params = {
						serviceCode:$scope.selectedSvcCode,
						actionCode:this.actionCode,
						name:this.actionCodeName
					};

//					codeCrudService.actCodeCreateAjax($scope, params);

					this.actIsCollapsed = true;
					this.actionCode = "";
					this.actionCodeName = "";
				}
			};

			$scope.actCodeRemove = function(actCode) {
				var params = {
						serviceCode:$scope.selectedSvcCode,
						actionCode:actCode
				};
//				codeCrudService.actCodeRemoveAjax($scope, params);
			};

		}]
		
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			templateUrl: 'components/tabExample/tabExample.html',
			link: function ($scope, $element, $attrs) {
			},
			controller: controller
		};
	}]);

