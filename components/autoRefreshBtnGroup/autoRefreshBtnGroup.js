'use strict'

angular.module('app')
	.directive('autoRefreshBtnGroup', function(cookieService){
		var controller = ['$scope', '$timeout', '$route', function ($scope, $timeout, $route) {
    		var checked = false;
    		var totalcountDown;

    		var refreshTime = cookieService.getCookie('refreshTime');
    		var selectedTime = cookieService.getCookie('selectedTime');
    		cookieService.setCookie('refreshTime', '', -1);

    		$scope.refreshTime = ['3sec', '10sec', '30sec','1min'];
    		$scope.refreshTimeVal = {'3sec': 3, '10sec': 10, '30sec': 30, '1min': 60}
    		
    		$scope.refreshTimeOpt = '3sec';
    		totalcountDown = $scope.refreshTimeVal[$scope.refreshTimeOpt];
    		if (refreshTime) {
    			checked = true;
    			$scope.refreshTimeOpt = refreshTime;
    			totalcountDown = $scope.refreshTimeVal[$scope.refreshTimeOpt];
    		}
    		
    		$scope.checked = checked;
    		$scope.countDown_tick = totalcountDown;

    		// dropdown select 에서 time 간격 선택 시
    		$scope.refreshTimeChange = function (){
    			totalcountDown = $scope.refreshTimeVal[$scope.refreshTimeOpt];
    			$scope.countDown_tick = totalcountDown
    		};

    		//check box 클릭 시
    		$scope.refreshOn = function () {
    			if ($scope.checked == true){
    				cookieService.setCookie('refreshTime', $scope.refreshTimeOpt , 1);
    				countDowWatch();
    			}else {
    				totalcountDown = $scope.refreshTimeVal[$scope.refreshTimeOpt];
    				$scope.countDown_tick = totalcountDown
    			}
    		}

    		// countdown event 동작
    		var countDowWatch = function () {
    			if (totalcountDown == 0) {
    				var refreshData = {
    					'selectedTime': $scope.winTimeBtn ,
    					'refreshTime': $scope.refreshTimeOpt
    				};
    				
    				/* 
    				 * 원하는 위치에서
    				 * $scope.$on('autoRefreshEvent', function(args, refreshData) {}); 
    				 * 위 코드를 추가 후 event catch 하여 이용.
    				 */
    				$scope.$emit('autoRefreshEvent', refreshData);
    				return 0;
    			} else {
    				if (!$scope.checked){
    					cookieService.setCookie('refreshTime', '' , -1);
    					return 0;
    				}
    				$scope.countDown_tick = totalcountDown;
    				totalcountDown--;
    				$timeout(countDowWatch, 1000);
    			}
    		};

            var resetCountDown = function() {
                totalcountDown = $scope.refreshTimeVal[$scope.refreshTimeOpt];
                $scope.countDown_tick = totalcountDown;
            }

    		if ($scope.checked){
    			countDowWatch();
    		}
    		
    		/*
    		 * $scope.$on('autoRefreshEvent', function(args, refreshData) {});
    		 * 코드 이용 예제 - Page를 Reload 하고자 할 경우 $route.reload(); 혹은 $state.reload();를 이용.
    		 * 코드 이용 예제 - Page를 Reload 하지 않고 이용 할 경우 아래와 같은 코드를 원하는 곳에 추가
    		 */
    		$scope.$on('autoRefreshEvent', function (args, refreshData) {
//    			resetCountDown();
//    			countDowWatch();
    			
	    		cookieService.setCookie('selectedTime', refreshData.selectedTime , 1);
	    		cookieService.setCookie('refreshTime', refreshData.refreshTime , 1);
	
	    		$route.reload();
    		});
    	}];
		
    	return {
    		restrict: 'EA',
    		replace: true,
    		transclude: true,
    		templateUrl: 'components/autoRefreshBtnGroup/autoRefreshBtnGroup.html',
    		link: function ($scope, $element, $attrs) {
    		},
    		controller: controller
    	};
    })
