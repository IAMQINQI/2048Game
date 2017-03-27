//虚拟棋盘格
var board = [];

//用来判断每个格子是否发生过碰撞，防止一个数字块在一次操作中累加两次
var hasConflicted = [];

//分数
var score = 0;

//记录游戏是否结束
var gamerover = false;

//记录用户的操作是否有效
var operation = true;

$(function() {
	newGame();
});

function newGame() {
	//初始化棋盘格
	init();

	//分数清零
	score = 0;
	updateScore(score);

	//记录游戏是否结束
	gamerover = false;

	//在随机两个格子上生成数字
	randomOneNumber();
	randomOneNumber();

	//用户可以操作
	operation = true;
}

//获取键盘按钮事件，不同按钮进行不同的操作
$(document).keydown(function(event) {
	switch(event.keyCode) {
		case 37: //向左移动

			//如果可以向左移动
			if(operation && canMoveLeft(board)) {

				//移动时禁止用户操作
				operation = false;

				//向左移动
				moveLeft();

				//在空白格随机产生一个数字
				setTimeout(function() {
					randomOneNumber();
				}, 200);

				//判断游戏是否结束,300毫秒延时是为了让随机数字产生后再判断
				setTimeout(function() {
					ifGameOver(board);
				}, 300);

				//让用户继续操作
				setTimeout(function() {
					operation = true;
				}, 260);
			}
			break;
		case 38: //向上移动
			if(operation && canMoveUp(board)) {

				operation = false;

				moveUp();

				setTimeout(function() {
					randomOneNumber();
				}, 200);

				setTimeout(function() {
					ifGameOver(board);
				}, 300);

				setTimeout(function() {
					operation = true;
				}, 260);
			}
			break;
		case 39: //向右移动
			if(operation && canMoveRight(board)) {

				operation = false;

				moveRight();

				setTimeout(function() {
					randomOneNumber();
				}, 200);

				setTimeout(function() {
					ifGameOver(board);
				}, 300);

				setTimeout(function() {
					operation = true;
				}, 260);
			}
			break;
		case 40: //向下移动
			if(operation && canMoveDown(board)) {

				operation = false;
				moveDown();

				setTimeout(function() {
					randomOneNumber();
				}, 200);

				setTimeout(function() {
					ifGameOver(board);
				}, 300);

				setTimeout(function() {
					operation = true;
				}, 260);
			}
			break;
		default:
			break;
	}
});

//初始化棋盘
function init() {
	for(var i = 0; i < 4; i++) {
		//一维数组
		board[i] = [];
		hasConflicted[i] = [];
		for(var j = 0; j < 4; j++) {
			//二维数组，虚拟棋盘格初始化
			board[i][j] = 0;
			hasConflicted[i][j] = false;

			//设置棋盘格的位置
			var cell = $('.cell-' + i + j);
			cell.css('top', getPosition(i)).css('left', getPosition(j));
		}
	}

	//初始化数字格
	updateBoardView();
}

//初始化数据，将数据可视化。根据board[i][j]所存的数值来画图
function updateBoardView() {
	//清除之前的数字格
	$('.number-cell').remove();
	for(var i = 0; i < 4; i++) {
		for(var j = 0; j < 4; j++) {
			$('#content').append('<div class="number-cell number-cell-' + i + j + '"></div>');

			//设置数字格的位置
			var theNumberCell = $('.number-cell-' + i + j);
			if(board[i][j] == 0) {
				theNumberCell.css({
					width: '0px',
					height: '0px',
					top: getPosition(i) + 25,
					left: getPosition(j) + 25
				});
			} else {
				theNumberCell.css({
					width: '50px',
					height: '50px',
					top: getPosition(i),
					left: getPosition(j),
					background: getNumberBackgroundColor(board[i][j]),
					color: getNumberColor(board[i][j])
				}).text(board[i][j]);
			}
			hasConflicted[i][j] = false;
		}
	}
}

//生成格子的位置
function getPosition(pos) {
	return 10 + pos * 60;
}

//随机选一个格子生成一个数字
function randomOneNumber() {

	//随机一个位置
	var randx = parseInt(Math.floor(Math.random() * 4));
	var randy = parseInt(Math.floor(Math.random() * 4));

	//随机一个2或4的数字
	var randomNum = Math.random() > 0.5 ? 2 : 4;

	//在数字格不为0的地方生成一个随机数字
	while(true) {
		if(board[randx][randy] == 0) {
			break;
		} else {
			if(gamerover) {
				break;
			}
			randx = parseInt(Math.floor(Math.random() * 4));
			randy = parseInt(Math.floor(Math.random() * 4));
		}
	}

	//在选好的随机位置显示数字
	board[randx][randy] = randomNum;

	//用动画效果显示数字
	showNumWithAnimation(randx, randy, randomNum);
}

//分数刷新显示
function updateScore(score) {
	$('#score').text(score);
}

//设置不同数字的不同背景颜色
function getNumberBackgroundColor(number) {
	switch(number) {
		case 2:
			return '#eee4da';
			break;
		case 4:
			return '#ede0c8';
			break;
		case 8:
			return '#f2b179';
			break;
		case 16:
			return '#f59563';
			break;
		case 32:
			return '#f67c5f';
			break;
		case 64:
			return '#f65e3b';
			break;
		case 128:
			return '#edcf72';
			break;
		case 256:
			return '#edcc61';
			break;
		case 512:
			return '#9c0';
			break;
		case 1024:
			return '#33b5e5';
			break;
		case 2048:
			return '#09c';
			break;
		case 5096:
			return '#a6c';
			break;
		case 8192:
			return "#93c";
			break;
	}
	return 'black';
}

//设置数字的颜色,2和4的颜色为#776e65,其余为白
function getNumberColor(number) {
	if(number <= 4) {
		return '#776e65';
	}
	return 'white';
}

//设置显示数字的动画效果,在x=randx,y=randy这个位置上显示randomNum
function showNumWithAnimation(randx, randy, randomNum) {
	$('.number-cell-' + randx + randy).css({
		background: getNumberBackgroundColor(board[randx][randy]),
		color: getNumberColor(randomNum)
	}).text(randomNum).animate({
		width: '50px',
		height: '50px',
		top: getPosition(randx),
		left: getPosition(randy)
	}, 50);
}

//设置移动数字的动画效果，从fromx,fromy的位置移动到tox,toy的位置
function showMoveWithAnimation(fromx, fromy, tox, toy) {
	// changeNumSize(tox,toy);
	$('.number-cell-' + fromx + fromy).animate({
		top: getPosition(tox),
		left: getPosition(toy)
	}, 200);
}

//判断是否能向左移动
//第一列的格子不可能向左移动，不需判断,首先当前格子不能为空，然后左边格子为空或者左边格子和当前格子相等即可
function canMoveLeft(board) {
	for(var i = 0; i < 4; i++) {
		for(var j = 1; j < 4; j++) {
			if(board[i][j] != 0) {
				// 如果这个数字格它左边的数字格为空或者左边的数字格和它相等，则可以向左移动
				if(board[i][j - 1] == 0 || board[i][j] == board[i][j - 1]) {
					return true;
				}
			}
		}
	}
	return false;
}
//判断能否向上、右、下移动
function canMoveUp(board) {
	for(var i = 1; i < 4; i++) {
		for(var j = 0; j < 4; j++) {
			if(board[i][j] != 0) {
				// 如果这个数字格它上边的数字格为空或者上边的数字格和它相等，则可以向上移动
				if(board[i - 1][j] == 0 || board[i - 1][j] == board[i][j]) {
					return true;
				}
			}
		}
	}
	return false;
}

function canMoveRight(board) {
	for(var i = 0; i < 4; i++) {
		for(var j = 2; j >= 0; j--) {
			if(board[i][j] != 0) {
				if(board[i][j + 1] == 0 || board[i][j + 1] == board[i][j]) {
					return true;
				}
			}
		}
	}
	return false;
}

function canMoveDown(board) {
	for(var i = 0; i < 3; i++) {
		for(var j = 0; j < 4; j++) {
			if(board[i][j] != 0) {
				//如果这个数字格下面的数字格为空或者下边的数字格和它相等，则可以下移
				if(board[i + 1][j] == 0 || board[i + 1][j] == board[i][j]) {
					return true;
				}
			}
		}
	}
	return false;
}

//向左移动
function moveLeft() {
	for(var i = 0; i < 4; i++) {
		for(var j = 1; j < 4; j++) {
			if(board[i][j] != 0) {
				for(var k = 0; k < j; k++) {
					if(board[i][k] == 0 && noBlockRow(i, k, j, board)) {
						showMoveWithAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
					} else if(board[i][k] == board[i][j] && noBlockRow(i, k, j, board) && !hasConflicted[i][k]) {
						showMoveWithAnimation(i, j, i, k);
						board[i][k] += board[i][j];
						board[i][j] = 0;

						//更新分数
						score += board[i][k];
						updateScore(score);

						hasConflicted[i][k] = true;
					}
				}
			}
		}
	}
	// 为显示动画效果，设置该函数的等待时间200毫秒
	setTimeout(function() {
		updateBoardView();
	}, 200);
	return true;
}
//向上、右、下移动
function moveUp() {
	for(var i = 1; i < 4; i++) {
		for(var j = 0; j < 4; j++) {
			if(board[i][j] != 0) {
				for(var k = 0; k < i; k++) {
					if(board[k][j] == 0 && noBlockCol(j, k, i, board)) {
						showMoveWithAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
					} else if(board[k][j] == board[i][j] && noBlockCol(j, k, i, board) && !hasConflicted[k][j]) {
						showMoveWithAnimation(i, j, k, j);
						board[k][j] += board[i][j];
						board[i][j] = 0;

						//更新分数
						score += board[k][j];
						updateScore(score);

						hasConflicted[k][j] = true;
					}
				}
			}
		}
	}
	setTimeout(function() {
		updateBoardView();
	}, 200);
}

function moveRight() {
	for(var i = 0; i < 4; i++) {
		for(var j = 2; j >= 0; j--) {
			if(board[i][j] != 0) {
				for(var k = 3; k > j; k--) {
					if(board[i][k] == 0 && noBlockRow(i, j, k, board)) {
						showMoveWithAnimation(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
					} else if(board[i][k] == board[i][j] && noBlockRow(i, j, k, board) && !hasConflicted[i][k]) {
						showMoveWithAnimation(i, j, i, k);
						board[i][k] += board[i][j];
						board[i][j] = 0;

						//更新分数
						score += board[i][k];
						updateScore(score);

						hasConflicted[i][k] = true;
					}
				}
			}
		}
	}
	setTimeout(function() {
		updateBoardView();
	}, 200);
}

function moveDown() {
	for(var i = 2; i >= 0; i--) {
		for(var j = 0; j < 4; j++) {
			if(board[i][j] != 0) {
				for(var k = 3; k > i; k--) {
					if(board[k][j] == 0 && noBlockCol(j, i, k, board)) {
						showMoveWithAnimation(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
					} else if(board[k][j] == board[i][j] && noBlockCol(j, i, k, board) && !hasConflicted[k][j]) {
						showMoveWithAnimation(i, j, k, j);
						board[k][j] += board[i][j];
						board[i][j] = 0;

						//更新分数
						score += board[i][k];
						updateScore(score);

						hasConflicted[k][j] = true;
					}
				}
			}
		}
	}
	setTimeout(function() {
		updateBoardView();
	}, 200);
}

//判断水平方向是否有障碍物
function noBlockRow(row, col1, col2, board) {
	for(var i = col1 + 1; i < col2; i++) {
		if(board[row][i] != 0) {
			return false;
		}
	}
	return true;
}
//判断垂直方向是否有障碍物
function noBlockCol(col, row1, row2, board) {
	for(var i = row1 + 1; i < row2; i++) {
		if(board[i][col] != 0) {
			return false;
		}
	}
	return true;
}

//判断游戏是否结束
function ifGameOver(board) {
	if(!canMoveLeft(board) && !canMoveUp(board) && !canMoveRight(board) && !canMoveDown(board)) {
		//显示游戏结束，并显示分数
		showGameOver();
		gamerover = true;
	}
}

// 显示游戏结束
function showGameOver() {
	$('#content').append("<div id='gameover'><p>最终得分</p><span>" + score + "</span><a href='#' onclick='resert()'>restart</a></div> ")
}

// 重新开始游戏
function resert() {
	$('#gameover').remove();
	newGame();
}

//判断数字大小改变字体大小
function changeNumSize(row, col) {
	if(board[row][col] / 10000 >= 1) {
		$('.number-cell-' + row + col).css('font-size', '20px');
	} else if(board[row][col] / 1000 >= 1) {
		$('.number-cell-' + row + col).css('font-size', '30px');
	} else if(board[row][col] / 100 >= 1) {
		$('.number-cell-' + row + col).css('font-size', '40px');
	} else if(board[row][col] / 10 >= 1) {
		$('.number-cell-' + row + col).css('font-size', '50px');
	}
}

//移动端的操作

//返回角度
function getSlideAngle(dx, dy) {
	return Math.atan2(dy, dx) * 180 / Math.PI;
}

//根据起点和终点返回方向 1：向上，2：向右，3：向下，4：向左，0：未滑动
function getSlideDiretion(startX, startY, endX, endY) {
	var dx = endX - startX;
	var dy = endY - startY;
	var result = 0;

	//滑动距离太短则认为未滑动
	if(Math.abs(dx) < 2 && Math.abs(dy) < 2) {
		return result;
	}

	var angle = getSlideAngle(dx, dy);
	if(angle >= -45 && angle < 45) {
		result = 2;
	} else if(angle >= 45 && angle < 135) {
		result = 1;
	} else if(angle >= -135 && angle < -45) {
		result = 3;
	} else if((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
		result = 4;
	}
	return result;
}

//滑动处理
var startX, startY;
document.addEventListener('touchstart', function(ev) {
	startX = ev.touches[0].pageX;
	startY = ev.touches[0].pageY;
}, false);
var endX, endY;
document.addEventListener('touchend', function(ev) {
	endX = ev.changedTouches[0].pageX;
	endY = ev.changedTouches[0].pageY;
	var diretion = getSlideDiretion(startX, startY, endX, endY)
	switch(diretion) {
		case 0:
			//没滑动
			break;
		case 3:
			if(canMoveUp(board)) {
				moveUp();
				setTimeout(function() {
					ifGameOver(board)
				}, 300);
				setTimeout(function() {
					randomOneNumber();
				}, 200);
			}
			break;
		case 2:
			if(canMoveRight(board)) {
				moveRight();
				setTimeout(function() {
					ifGameOver(board);
				}, 300);
				setTimeout(function() {
					randomOneNumber();
				}, 200);
			}
			break;
		case 1:
			if(canMoveDown(board)) {
				moveDown();
				setTimeout(function() {
					ifGameOver(board);
				}, 300);
				setTimeout(function() {
					randomOneNumber();
				}, 200);
			}
			break;
		case 4:
			if(canMoveLeft(board)) {
				moveLeft();
				setTimeout(function() {
					ifGameOver(board);
				}, 300);
				setTimeout(function() {
					randomOneNumber();
				}, 200);
			}
			break;
		default:
			break;
	}
}, false);