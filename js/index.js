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
		score: 10,
		row: 20,
        column: 30,
        cellWidth: 30,
        cellHeight: 30,
        bgStrokeStyle: '#f2dede',
        bgFillStyle: '#fff', //'#d9edf7',
        foodStyle: '#a94442',
        snakeStyle: '#31708f'
	};

	function Snake (settings) {
		
		for(var key in defaultSettings) {
			this[key] = settings[key] ? settings[key] : defaultSettings[key];
		}

		this.lock = true;
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
			this.drawSnake();
			this.drawFood();
			this.bindEvent();
			this.autoMove();

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

		// 画食物： 位置随机、实心矩形、不能在蛇身上
		drawFood: function () {
			
			var foodLock = true;
			this.foodX = Math.floor(Math.random() * this.column) || 0;
			this.foodY = Math.floor(Math.random() * this.row) || 0;

			// TODO： 排除食物画在蛇身上的情况
			for(var i = 0; i < this.points.length; i++) {
				if (this.points[i].x === this.foodX && this.points[i].y === this.foodY) {
					this.drawFood();
					foodLock = false;
					break;
				}
			}

			this.ctx.save();
			this.ctx.fillStyle = this.foodStyle;
			this.ctx.fillRect(this.foodX * this.cellWidth + 1, this.foodY * this.cellHeight + 1, this.cellWidth - 2 , this.cellHeight - 2);
		},

		// 初始化蛇
		drawSnake: function () {
			this.points = [];
			this.ctx.save();
			this.ctx.fillStyle = this.snakeStyle;
			for(var i = 0; i < this.initSnakeNum; i++) {
				this.ctx.fillRect(0 + 1, this.cellHeight * i + 1, this.cellWidth - 2, this.cellHeight - 2);
				this.points.push({x: 0, y: i});
			}
		},

		autoMove: function () {
			var _this = this;
			this.timer = setInterval(function () {
				_this.move();
			}, 1000);
		},

		// 移动: 如果没有吃到食物，每次移动： 蛇头前新增一个，去掉蛇尾
		// 如果吃到食物，将食物颜色变成蛇的颜色（算的块数+1）
		move: function () {
				
			this.addHead(this.points[this.points.length - 1], this.currentDirection);
			this.oldDirection = this.currentDirection;

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
			if (addX < 0 || addX >= this.column || addY < 0 || addY >= this.row) {
				this.lock = false;
				clearInterval(this.timer);
				alert('亲，您撞墙了哦，重新开始吧~');
			} else if (addX === this.foodX && addY === this.foodY ) {
				this.ctx.clearRect(addX * this.cellWidth + 1, addY * this.cellHeight + 1, this.cellWidth - 2, this.cellHeight - 2);
				this.ctx.fillRect(addX * this.cellWidth + 1, this.cellHeight * addY + 1, this.cellWidth - 2, this.cellHeight - 2);
				this.points.push({x:addX , y:addY});
				this.drawFood(); // 吃完食物后生成下一个食物
				this.getScore();
			} else {
				for (var i = 0; i < this.points.length; i++) {
					if (this.points[i].x === addX && this.points[i].y === addY) {
						this.lock = false;
						clearInterval(this.timer);
						alert('亲，您干嘛要把自己吃掉呀，重新开始吧~');
						return;
					}
				}
				this.ctx.fillStyle = this.snakeStyle;
				this.ctx.fillRect(addX * this.cellWidth + 1, this.cellHeight * addY + 1, this.cellWidth - 2, this.cellHeight - 2);
				this.points.push({x:addX , y:addY});
				this.deleteTail(this.points[0]);
			}
			
		},

		getScore: function () {
			$('#score').html(parseInt($('#score').html()) + this.score);
		},

		// 37：左, 38:上, 39:右, 40下
		bindEvent: function () {
			var _this = this;

			$('#begin').on('click', function () {
				if (!this.lock) {
					$('#score').html('0');
					_this.lock = true;
					_this.ctx.restore();
					_this.ctx.clearRect(0, 0, _this.column * _this.cellWidth, _this.row * _this.cellHeight);
					_this.drawBg();
					_this.drawSnake();
					_this.drawFood();
					_this.autoMove();
				}
			});

			$(doc).on('keydown', function (e) {
				
				if (_this.lock) {
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
				}
			});
		}

	};

	window.Snake = Snake;

})(window, document, jQuery);