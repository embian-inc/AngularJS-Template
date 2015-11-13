'use strict'
angular.module('app')
	.directive('countBox',['countBoxAjaxService', function(countBoxAjaxService){
    	var controller = ['$scope', function($scope){
    		$scope.totalStyle = {'background-color': '#CCC'};
    		$scope.succStyle = {'background-color': '#CCC'};
    		$scope.warn1Style = {'background-color': '#CCC'};
    		$scope.failStyle = {'background-color': '#CCC'};

    		$scope.click = function (num){
    			
    			slide_updown_window_action('hide');
    			
    			var status;
    			switch (num){
    				case 1 :
    					status = "Total";
    					break;
    				case 2 :
    					status = "Success";
    					break;
    				case 3 :
    					status = "WarnL1";
    					break;
    				case 4 :
    					status = "Fail";
    					break;
    			}

//    			$scope.eltVisible = false;
//    			$scope.eltTitle = status + " List";

//    			var paramObj = {};
//    			eltAjaxService.setParams(paramObj);
//    			eltAjaxService.callAjax($scope);
    			
    			$('#slide-updown-window .contents').scrollTop(0);
    			slide_updown_window_action('show');
    		};
    	}];
    	
    	var slide_updown_window_action = function(action) {
			var bottom_val = (action == "show") ? 0 : -1 * $("#slide-updown-window").outerHeight();
			$("#slide-updown-window").animate({
				bottom : bottom_val
			}, 350, function() {
				$(".slide-updown-btn").off("click");
				if (action == "show") {
					$(".slide-updown-icon").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
					$(".slide-updown-btn").on("click", function() {
						slide_updown_window_action('hide');
					});
				}
				else {
					$(".slide-updown-icon").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
					$(".slide-updown-btn").on("click", function() {
						slide_updown_window_action('show');
					});
				}
			});
		}

    	return {
    		restrict: 'EA',
    		replace: true,
    		transclude: true,
    		templateUrl: 'components/countBox/countBox.html',
    		link: function ($scope, $element, $attrs) {
					var paramObj = {};
					countBoxAjaxService.setParams(paramObj);
					countBoxAjaxService.callAjax($scope);
    		},
    		controller: controller
    	};
	}])