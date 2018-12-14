'use strict';

/**
 * @ngdoc directive
 * @name drawing
 * @description
 * # ngFocus
 */
angular.module('p2pSiteMobApp')
  .directive('drawCircle', function() {
  return {
    restrict: 'A',
    link : function(scope, element) {
	        	var circle = {
			        cx : 155,    //圆心的x轴坐标值
			        cy : 115,    //圆心的y轴坐标值
			        r : 105 ,     //圆的半径
			        lineWidth:20
			    };
			    var colors = ['#2b8bf1','#0460cd','#ffaa25'];
				var ctx = element[0].getContext('2d');
				var start = 0;
			    var end = 0;
			    ctx.font ='21px Microsoft yahei';
			    ctx.textAlign = 'left';
			    ctx.fillStyle = "#666";
		        ctx.fillText('待收本金', 110, 100 );
		        ctx.fillStyle = "#ff5400";	

		        scope.$watch('investStat.totalInvestAmount', function(newValue, oldValue) {
			       for(var i = 0; i < colors.length;i++) {
				    	start = end;
				    	//项目在投都为0，环形三分
				    	if(scope.investStat.totalInvestAmount == 0){
				    		var percent = 1/3;
				    		end = percent * Math.PI*2 + start;
				    	}else{
				    		if(i == 0) {
				    			end = scope.investStat.selection/scope.investStat.totalInvestAmount* Math.PI*2 + start;
				    		}
				    		if(i == 1) {
				    			end = (scope.investStat.hornor)/scope.investStat.totalInvestAmount* Math.PI*2 + start;
				    		}
				    		if(i == 2) {
				    			end = (scope.investStat.assignment)/scope.investStat.totalInvestAmount* Math.PI*2 + start;
				    		}
				    	}
				    	
				    	ctx.beginPath();
						// 给曲线设定颜色
						ctx.strokeStyle = colors[i];

						// 画出曲线
						ctx.arc(circle.cx, circle.cy, circle.r, start, end, false);
						//设定曲线粗细度
						ctx.lineWidth = circle.lineWidth;
						//给曲线着色
						ctx.stroke();

						ctx.closePath();
					}
			    });

	    	}
	  	};
  });
