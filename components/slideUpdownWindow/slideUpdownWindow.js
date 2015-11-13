'use strict'
angular.module('app')
	.directive('slideUpdownWindow', function(){
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			templateUrl: 'components/slideUpdownWindow/slideUpdownWindow.html',
			link: function ($scope, $element, $attrs) {
				
				$(".slide-updown-btn").on("click", function() {
					slide_updown_window_action('show');
				});

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
				
			},
		};
	});