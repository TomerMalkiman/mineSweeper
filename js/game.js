'use strict'

var gBoard;

var gWatchInterval;
var gStartTime;

var gLives = [];

var gMinesPos = [];
var gFlagsPos = [];

var gGame = {
	isOn: false,
	shownCount: 0,
	markedCount: 0,
	secsPassed: 0
}

var gLevel = {
	size: 4,
	mines: 2,
	lives: 3
};



function initGame() {
	gGame.isOn = true;
	startLives();
	nullifyGame();


	gBoard = buildBoard();
	renderBoard(gBoard);

}


function nullifyGame() {
	gGame.shownCount = 0;
	gGame.markedCount = 0;
	gGame.secsPassed = 0;
}

function buildBoard() {
	var size = gLevel.size;
	var board = [];
	for (var i = 0; i < size; i++) {
		board.push([]);
		for (var j = 0; j < size; j++) {
			var currCell = {
				minesAroundCount: '',
				isShown: false,
				isMine: false,
				isMarked: true

			}
			board[i][j] = currCell;
		}
	}
	// renderCell(1,1,5);

	placeRandMines(gLevel.mines, board);

	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			currCell = board[i][j];
			var numOfNeighs = countMinesAround(board, i, j);
			if (numOfNeighs) currCell.minesAroundCount = numOfNeighs;
			// else currCell.minesAroundCount = '';
		}
	}
	return board;
}



function renderBoard(board) {
	var strHtml = '';
	for (var i = 0; i < board.length; i++) {
		strHtml += '<tr>';
		for (var j = 0; j < board.length; j++) {
			var className = `cell-${i}-${j}`
			var tdId = `cell-${i}-${j}`;
			strHtml += `<td id="${tdId}" class="${className}" oncontextmenu="cellMarked(this, ${i}, ${j})" onclick="cellClicked(this)"></td>`
		}
		strHtml += '</tr>';
	}
	var elMat = document.querySelector('.board-container');
	elMat.innerHTML = strHtml;
}


function updateLevel(size, mines) {
	gLevel = {
		size: size,
		mines: mines
	};
	initGame();
}

function cellClicked(elCell) {
	// if(!WhichButton()) return; 
	var coord = getCellCoord(elCell.id);
	var currCell = gBoard[coord.i][coord.j];

	// console.log(coord);
	if (currCell.isShown) return;
	if (currCell.isMine) {
		console.log(gGame.shownCount);
		if (!gGame.shownCount) return;
		else {
			gLives.pop();
			updateLives(gLives);
			updateEmoji('😵')
			if (gameOver()) {
				// alert('game over');
				endStopWatch();
				renderCell(coord.i, coord.j, RED_MINE);
				// renderEndBoard(gBoard);
				revealMines(coord.i, coord.j);
			}
			else renderCell(coord.i, coord.j, MINE);

			return;
		}
	}
	currCell.isShown = true;
	updateEmoji('😃');
	gGame.shownCount++;
	console.log(gGame.shownCount);
	if (gGame.shownCount === 1) startStopWatch();
	if (!currCell.minesAroundCount) {
		// console.log('hey');
		getCellNeighsMinesAround(gBoard, coord.i, coord.j);
		renderCell(coord.i, coord.j, EMPTY)
		// currCell.minesAroundCount = countMinesAround(gBoard,coord.i,coord.j)
		return;

	}
	elCell.innerHTML = createNumImg(currCell.minesAroundCount);
}

function placeRandMines(numOfMines, board) {
	for (var i = 0; i < numOfMines; i++) {
		var randI = getRandomInt(0, board.length);
		var randJ = getRandomInt(0, board.length);
		var posObj = {
			i: randI,
			j: randJ
		};
		// console.log(board[randI][randJ].isMine);
		if (!(board[randI][randJ].isMine)) {
			board[randI][randJ].isMine = true;
			gMinesPos.push(posObj);
		}
		else i--
	}
}

function expandShown(board, elCell, i, j) {

}

function updateLives(arr) {
	var elLives = document.querySelector('h2 span');
	var strHTML = '';
	for (var i = 0; i < arr.length; i++) {
		strHTML += arr[i];
	}
	elLives.innerHTML = strHTML;
}

function startLives() {
	for (var i = 0; i < 3; i++) {
		gLives[i] = '♥';
	}
	updateLives(gLives);
}

function gameOver() {
	if (!gLives.length) return true
	else return false;
}

function updateEmoji(emoji) {
	var elBtn = document.querySelector('.start-btn span')
	elBtn.innerHTML = emoji;
}
// C:\Users\tomer\Dropbox\CaJan22-ExcerciseSubmission\class2\Tomer Malkiman\Day13-14-Sprint1\1st DELIVERY - Wednesday 2030\Day13-14-Sprint1\js\game.js


oncontextmenu = "cellMarked(this,${i},${j})"

function cellMarked(elCell, i, j) {
	var idxObj = {
		i : i,
		j : j
	}
	window.event.preventDefault()
	console.log('right', i, j);
	if (!(elCell.classList[1])) {
		elCell.innerHTML = '<img class="flag" src="../img/flag.png" />'
		gGame.markedCount++;
		gBoard[i][j].isMarked = true;
		gFlagsPos.push(idxObj);
		console.log(gBoard[i][j].isMarked )
	}
	else {
		elCell.innerHTML = '';
		gGame.markedCount--;
		gBoard[i][j].isMarked = false;
		gFlagsPos[idxObj.i].splice(idxObj.j,1);
		console.log(gBoard[i][j].isMarked )
		// console.log('markedCount' +gGame.markedCount)
	}
	console.log(gFlagsPos);
	elCell.classList.toggle('cell-marked')
	// console.log(elCell);
}

function createNumImg(num) {
	var str = `<img class="num1" src="../img/num${num}.png" />`
	console.log(str);
	return str
}

function revealMines(rowIdx, colIdx) {
	for (var i = 0; i < gMinesPos.length; i++) {
		if (gMinesPos[i].i !== rowIdx || gMinesPos[i].j !== colIdx) renderCell(gMinesPos[i].i, gMinesPos[i].j, MINE);
		else continue;
	}
	gMinesPos = [];
}

// function renderEndBoard(board) {
// 	for (var i = 0; i < board.length; i++) {
// 		for (var j = 0; j < board.length; j++) {
// 			currCell = board[i][j];
// 			if (currCell.isMine) {
// 				renderCell(i, j, MINE);
// 			}
// 			if (currCell.isShown) {
// 				if (currCell.minesAroundCount) renderCell(i, j, createNumImg(currCell.minesAroundCount));
// 				else renderCell(i, j, EMPTY);
// 			}
// 			if (currCell.isMarked) {
// 				if (currCell.isMine) renderCell(i, j, MINE);
// 				else {
// 					if (currCell.minesAroundCount) renderCell(i, j, createNumImg(currCell.minesAroundCount));
// 					else renderCell(i, j, EMPTY);
// 				}
// 			}

// 			// var className = `cell-${i}-${j}`
// 			// var tdId = `cell-${i}-${j}`;
// 			// strHtml += `<td id="${tdId}" class="${className}"></td>`
// 		}
// 	}
// 	// var elMat = document.querySelector('.board-container');
// 	// elMat.innerHTML = strHtml;
// }
