/**
 * @project Snake
 * @version 0.0.1
 * @author angelia
 * @createTime 2015-08-10
 * @updateTime 2015-08-10
 */



(function (win, doc, $) {

	var defaultSettings = {
		initSnakeNum: 4,
		row: 20,
        column: 30,
        cellWidth: 30,
        cellHeight: 30,
        bgStrokeStyle: '#f2dede',
        bgFillStyle: '#d9edf7',
        foodStyle: '#a94442',
        snakeStyle: '#3c763d'
	};

	function Snake (settings) {
		
		for(var key in defaultSettings) {
			this[key] = settings[key] ? settings[key] : defaultSettings[key];
		}

		this.points = [];
		this.currentDirection = 'down';
		this.access = {
			'up': 'down',
			'down': 'up',
			'left': 'right',
			'right': 'left'
		};
	}

	Snake.prototype = {

		init: function () {
			
			this.canvas = document.getElementById('canvas');
			this.ctx = this.canvas.getContext('2d');
			this.canvas.width = this.cellWidth * this.column;
			this.canvas.height = this.cellHeight * this.row;
			this.drawBg();
			this.drawFood();
			this.drawSnake();
			this.bindEvent();

		},

		// 画背景
		drawBg: function () {
			for(var i = 0; i < this.row; i++) {
				for(var j = 0; j < this.column; j++) {
					this.ctx.strokeStyle = this.bgStrokeStyle;
					this.ctx.fillStyle = this.bgFillStyle;
					this.ctx.strokeRect(j * this.cellWidth, i * this.cellHeight, this.cellWidth, this.cellHeight);
				}
			}
		},

		// 画食物： 位置随机、实心矩形
		drawFood: function () {
			
			this.foodX = Math.floor(Math.random() * this.column) || 0;
			this.foodY = Math.floor(Math.random() * this.row) || 0;
			console.log(this.foodX + '; ' + this.foodY);
			this.ctx.save();
			this.ctx.fillStyle = this.foodStyle;
			this.ctx.fillRect(this.foodX * this.cellWidth, this.foodY * this.cellHeight, this.cellWidth, this.cellHeight);
			// TODO： 排除食物画在蛇身上的情况
		},

		// 画蛇
		drawSnake: function () {
			this.ctx.save();
			this.ctx.fillStyle = this.snakeStyle;
			for(var i = 0; i < this.initSnakeNum; i++) {
				this.ctx.fillRect(0 + 1, this.cellHeight * i + 1, this.cellWidth - 2, this.cellHeight - 2);
				this.points.push({x: 0, y: i});
			}
		},

		// 移动: 如果没有吃到食物，每次移动： 蛇头前新增一个，去掉蛇尾
		// 如果吃到食物，将食物颜色变成蛇的颜色（算的块数+1）
		move: function () {
			// if (this.access[this.currentDirection] !== this.oldDirection) {
				
				this.addHead(this.points[this.points.length - 1], this.currentDirection);
				this.deleteTail(this.points[0]);
				this.oldDirection = this.currentDirection;
			// }
			// if (this.currentDirection === 'down' && this.oldDirection !== 'up') {
				
			// }

		},

		// 去掉蛇尾
		deleteTail: function (points) {
			this.ctx.clearRect(points.x * this.cellWidth + 1, points.y * this.cellHeight + 1, this.cellWidth - 2, this.cellHeight - 2);
			this.points.shift();
		},

		// 新增蛇头
		addHead: function (points, direction) {
			var addX, addY;
			switch(direction){
			case 'down':
				addX = points.x;
				addY = points.y + 1;
				break;
			case 'up':
				addX = points.x;
				addY = points.y - 1;
				break;
			case 'left':
				addX = points.x - 1;
				addY = points.y;
				break;
			case 'right':
				addX = points.x + 1;
				addY = points.y;
				break;
			}

			this.ctx.fillStyle = this.snakeStyle;
			this.ctx.fillRect(addX * this.cellWidth + 1, this.cellHeight * addY + 1, this.cellWidth - 2, this.cellHeight - 2);
			this.points.push({x:addX , y:addY});
		},

		// 37：左, 38:上, 39:右, 40下
		bindEvent: function () {
			var _this = this;
			$(doc).on('keydown', function (e) {
				
				switch(e.keyCode) {
				case 37: 
					_this.currentDirection = 'left';
					break;
				case 38:
					_this.currentDirection = 'up';
					break;
				case 39:
					_this.currentDirection = 'right';
					break;
				case 40:
					_this.currentDirection = 'down';
					break;
				}
				if (_this.access[_this.currentDirection] !== _this.oldDirection) { 
					_this.move();
				}
					
			});
		}

	};

	window.Snake = Snake;

})(window, document, jQuery);