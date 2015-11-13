'use strict'
angular.module('app')
	.controller("MainController",['$scope', '$state', '$route', 'numberWithCommasService',
	                              'cookieService', 'timeDataService', 'windowTimeDisplayService',
	                     function ($scope, $state, $route, numberWithCommasService, 
	                    		 		cookieService, timeDataService, windowTimeDisplayService) {
		
		/* ui.router 이용시 Page Reload 방식 */
//		$state.reload();
		
		/* ngRoute 이용시 Page Reload 방식 */
//		$route.reload();	
		
	 }]);
	