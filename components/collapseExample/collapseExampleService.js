'use strict'

angular.module('app')
	.service('collapseExampleService', ['$http','config', function($http, config) {
		var url = config.urlConfig();

		this.SelectAjax = function(scope) {
			SelectAjax(scope);
		};

		var SelectAjax = function(scope) {
			$http({
				method: 'GET',
				url: url + 'get'
			}).success(function(data,status,headers,config) {
				scope.SettingListData = data.result.data;
			}).error(function(data,status,headers,config) {
			});
		};

		this.RemoveAjax = function(scope, paramObj) {
			if (confirm("삭제하시겠습니까?") == true) {
				$http({
					method: 'GET',
					url: url + 'del',
					params: paramObj
				}).success(function(data,status,headers,config) {
					alert("삭제되었습니다.");
					SelectAjax(scope);
				}).error(function(data,status,headers,config) {
				});
			} else {
		    	alert("삭제가 취소되었습니다.");
		    }
		};

		this.CreateAjax = function(scope, paramObj) {
			$http({
				method: 'GET',
				url: url + 'add',
				params: paramObj
			}).success(function(data,status,headers,config) {
				if(data.code == 200) {
					alert("저장되었습니다.");
					SelectAjax(scope);
				} else {
					alert("저장에 실패하였습니다.");
				}
			}).error(function(data,status,headers,config) {
				alert("저장에 실패하였습니다.");
			});
		};
	}])
	.service('codeCrudService', ['$http','config', function($http, config) {
		var url = config.urlConfig();

		this.svcCodeSelectAjax = function(scope) {
			svcCodeSelectAjax(scope);
		};

		var svcCodeSelectAjax = function(scope) {
			$http({
				method: 'GET',
				url: url + 'getServiceList'
			}).success(function(data,status,headers,config) {
				scope.svcCodeList = data.result.data;
				scope.svcCodeListData = angular.copy(data.result.data);
				scope.svcCodeListData.unshift({service_code_name: "Select Service",
													service_code_id: "",
													service_code: ""});


				scope.svcItems = data.result.data;

			}).error(function(data,status,headers,config) {
			});
		};

		this.svcCodeRemoveAjax = function(scope, paramObj) {
			if (confirm("삭제하시겠습니까?") == true) {
				$http({
					method: 'GET',
					url: url + 'delServiceCode',
					params: paramObj
				}).success(function(data,status,headers,config) {
					alert("삭제되었습니다.");
					svcCodeSelectAjax(scope);
				}).error(function(data,status,headers,config) {
				});
			} else {
		    	alert("삭제가 취소되었습니다.");
		    }
		};

		this.svcCodeCreateAjax = function(scope, paramObj) {
			$http({
				method: 'GET',
				url: url + 'addServiceCode',
				params: paramObj
			}).success(function(data,status,headers,config) {
				if(data.code == 200) {
					alert("저장되었습니다.");
					svcCodeSelectAjax(scope);
				} else {
					alert("저장에 실패하였습니다.");
				}
			}).error(function(data,status,headers,config) {
				alert("저장에 실패하였습니다.");
			});
		};

		this.actCodeSelectAjax = function(scope) {
			actCodeSelectAjax(scope);
		};

		var actCodeSelectAjax = function(scope) {
			var paramObj = {
					serviceCode:scope.selectedSvcCode
			};

			$http({
				method: 'GET',
				url: url + 'getActionCodeList',
				params: paramObj
			}).success(function(data,status,headers,config) {
				scope.actCodeListData = data.result.data;
				var actiondata = data.result.data;
				scope.searchOptActCodeListData = angular.copy(actiondata);
				scope.searchOptActCodeListData.unshift({action_code_id: "",
												   action_code_name: "All Actions",
												   action_code: ""});

			}).error(function(data,status,headers,config) {
			});
		};

		this.actCodeRemoveAjax = function(scope, paramObj) {
		    if (confirm("삭제하시겠습니까?") == true) {
		    	$http({
					method: 'GET',
					url: url + 'delActionCode',
					params: paramObj
				}).success(function(data,status,headers,config) {
					alert("삭제되었습니다.");
					actCodeSelectAjax(scope);
				}).error(function(data,status,headers,config) {
				});
		    } else {
		    	alert("삭제가 취소되었습니다.");
		    }

		};

		this.actCodeCreateAjax = function(scope, paramObj) {
			$http({
				method: 'GET',
				url: url + 'addActionCode',
				params: paramObj
			}).success(function(data,status,headers,config) {
				if(data.code == 200) {
					alert("저장되었습니다.");
					actCodeSelectAjax(scope);
				} else {
					alert("저장에 실패하였습니다.");
				}
			}).error(function(data,status,headers,config) {
				alert("저장에 실패하였습니다.");
			});
		};
	}]);