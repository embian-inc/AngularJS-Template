'use strict'

angular.module('app')
	.service('cookieService', function (){
		this.setCookie = function (cName, cValue, cDay){
			var expire = new Date();
			expire.setDate(expire.getDate() + cDay);
			var cookies = cName + '=' + escape(cValue) + '; path=/ ';
			if(typeof cDay != 'undefined') {
				cookies += ';expires=' + expire.toGMTString() + ';';
			}
			document.cookie = cookies;
			/*console.log(document.cookie);*/
		}

		this.getCookie = function (cName) {
			cName = cName + '=';
			var cookieData = document.cookie;
			var start = cookieData.indexOf(cName);
			var cValue = '';
			if(start != -1){
				start += cName.length;
				var end = cookieData.indexOf(';', start);
				if(end == -1) {
					end = cookieData.length;
				}
				cValue = cookieData.substring(start, end);
			}
			return unescape(cValue);
		}
    })
    .service('numberWithCommasService', function(){
    	this.numberWithCommas = function(number) {
    		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    	};
    	
    })
    .service("timeDataService", function(cookieService){
		
		this.selected_time = function (){
			var selectedTime = cookieService.getCookie('selectedTime');
			return (selectedTime) ? selectedTime : 'winTimeSelector1';	
		};
		this.timeMoveOpt = function() {
			var from = parseInt(cookieService.getCookie('from'));
			var to = parseInt(cookieService.getCookie('to'));
			var timeMove = cookieService.getCookie('timeMove');
			return (timeMove == 'preTime') ? {'preTime': from} : ((timeMove == 'postTime')? {'postTime': to} : {});
		};
		this.timeData = {};
		
	})
	.service("windowTimeDisplayService", function(){
		
		var endDate =new Date(new Date().getTime() - (1000 * 60 * 0));
		var currTime = endDate.getTime();
		var timeMove = '';
		
		this.windowTime = '';
			
		this.windowTimeDisplay = function($scope, selected_window, timeMoveBtn) {
			
			if ('preTime' in timeMoveBtn && timeMoveBtn['preTime'] != null) {
				endDate = new Date(timeMoveBtn.preTime);
				timeMove = 'preTime';
			}
			
			var endPeriod = endDate.format("yyyy.MM.dd HH:mm:ss")
			
			var timeSelector = (selected_window) ? selected_window : "winTimeSelector1";
			switch (timeSelector) {
				case 'winTimeSelector1':
					var timeSelNum = 1000 * 60 * 5;
					break;
				case 'winTimeSelector2':
					var timeSelNum = 1000 * 60 * 30;
					break;
				case 'winTimeSelector3':
					var timeSelNum = 1000 * 60 * 60;
					break;
				case 'winTimeSelector4':
					var timeSelNum = 1000 * 60 * 60 * 6;
					break;
				case 'winTimeSelector5':
					var timeSelNum = 1000 * 60 * 60 * 12;
					break;
				case 'winTimeSelector6':
					var timeSelNum = 1000 * 60 * 60 * 24;
					break;
			}
			
			var startDate = new Date(endDate.getTime() - timeSelNum);
			var startPeriod = startDate.format("yyyy.MM.dd HH:mm:ss")
			
			if ('postTime' in timeMoveBtn && timeMoveBtn['postTime'] != null) {
			//				  console.log(timeMoveBtn.postTime);
			
				startDate = new Date(timeMoveBtn.postTime);
				startPeriod = startDate.format("yyyy.MM.dd HH:mm:ss");
				
				endDate = new Date(startDate.getTime() + timeSelNum);
				endPeriod = endDate.format("yyyy.MM.dd HH:mm:ss");
				
				timeMove = 'postTime';
			}
			
			var windowTime_html = startPeriod + " ~ " + endPeriod;
			this.windowTime = windowTime_html;
			$scope.windowTime = windowTime_html;
			
			//  var from = 1445935588572;
			//  var to = 1445957188572;
			//  return {'selected_time': selected_window, 'pre_t_num': timeSelNum, 'from': from, 'to': to, 'timeMove': timeMove, 'currTime': currTime};
			  
			return {
					 'selected_time': selected_window, 
					 'pre_t_num': timeSelNum, 
					 'from': startDate.getTime(), 
					 'to': endDate.getTime(), 
					 'timeMove': timeMove, 
					 'currTime': currTime
					};
		}
	});
