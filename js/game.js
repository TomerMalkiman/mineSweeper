'use strict'

/*The hint button isn't working yet!*/

var gBoard;

var gWatchInterval;
var gStartTime;

var gLives = [];
var gIsHintClick;
var gNumOfHints = 3;
var gMinesPos = [];
var gFlagsPos = [];
var gSafeCells;
var gNumOfFlags;
var gCorrectFlags;

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
	updateEmoji('😃');
	gCorrectFlags = 0;
	gNumOfFlags = 0;
	gGame.isOn = true;
	startLives();
	nullifyGame();
	gBoard = buildBoard();
	renderBoard(gBoard);
	gSafeCells = (gLevel.size * gLevel.size) - gLevel.mines;
	console.log(gSafeCells);

}


function nullifyGame() {
	gGame.shownCount = 0;
	gGame.markedCount = 0;
	gGame.secsPassed = 0;
}



function updateLevel(size, mines) {
	gLevel = {
		size: size,
		mines: mines
	};
	endStopWatch();
	initGame();
}

function cellClicked(elCell) {
	var coord = getCellCoord(elCell.id);
	var currCell = gBoard[coord.i][coord.j];

	if (gIsHintClick) {
		getCellNeighsMinesAround(gBoard, coord.i, coord.j);
		setTimeout(function () { hideCellNeighsMinesAround(gBoard, coord.i, coord.j) }, 1000);
		gIsHintClick = false;
		gNumOfHints--;
		var elHint = document.querySelector('.hint span')
		elHint.innerHTML = 'Hints: ${numOfHints}';
		return;

	}

	// console.log(coord);
	if (currCell.isShown) return;
	if (currCell.isMarked) return;
	if (currCell.isMine) {
		console.log(gGame.shownCount);
		if (!gGame.shownCount) return;
		else {
			currCell.isShown = true;
			gLives.pop();
			updateLives(gLives);
			updateEmoji('😵')
			if (gameOver()) {
				// alert('game over');
				endStopWatch();
				renderCell(coord.i, coord.j, RED_MINE);
				// renderEndBoard(gBoard);
				revealMines(coord.i, coord.j);
				revealFlags();
				freezeGame();
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
	console.log('minesAround: ' + currCell.minesAroundCount);
	if (!currCell.minesAroundCount) {
		// console.log('hey');
		getCellNeighsMinesAroundRec(gBoard, coord.i, coord.j);
		renderCell(coord.i, coord.j, EMPTY)
		if (isVictory()) {
			// alert('Victory!');
			endStopWatch();
			updateEmoji('😎');
		}
		return;
	}
	elCell.innerHTML = createNumImg(currCell.minesAroundCount);
	if (isVictory()) {
		// alert('Victory!');
		endStopWatch();
		updateEmoji('😎');
	}
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
	return (!(gLives.length));
}

function updateEmoji(emoji) {
	var elBtn = document.querySelector('.start-btn span')
	elBtn.innerHTML = emoji;
}


function cellMarked(elCell, i, j) {
	var idxObj = {
		i: i,
		j: j
	}
	window.event.preventDefault()
	console.log('right', i, j);
	if (!(elCell.classList[1])) {
		if (gBoard[i][j].isMine) gCorrectFlags++;
		gNumOfFlags++;
		if (isVictory()) {
			// alert('Victory!');
			updateEmoji('😎');
		}
		console.log('correctFlags: ' + gCorrectFlags);
		console.log('flags num: ' + gNumOfFlags);
		elCell.innerHTML = '<img class="flag" src="../img/flag.png" />'
		gGame.markedCount++;
		gBoard[i][j].isMarked = true;
		gFlagsPos.push(idxObj);
		console.log(gBoard[i][j].isMarked)
	}
	else {
		elCell.innerHTML = '';
		if (gBoard[i][j].isMine) gCorrectFlags--;
		gNumOfFlags--;
		console.log('correctFlags: ' + gCorrectFlags);
		console.log('flags num: ' + gNumOfFlags);
		gGame.markedCount--;
		gBoard[i][j].isMarked = false;
		removeObjFromArr(i, j);
		console.log(gBoard[i][j].isMarked)
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

function revealFlags() {
	for (var i = 0; i < gFlagsPos.length; i++) {
		var rowIdx = gFlagsPos[i].i;
		var colIdx = gFlagsPos[i].j;
		if (gBoard[rowIdx][colIdx].isMine) renderCell(rowIdx, colIdx, RED_FLAG);
		else renderCell(rowIdx, colIdx, FLAG);
	}
}


function removeObjFromArr(i, j) {
	for (var idx = 0; idx < gFlagsPos.length; idx++) {
		if (gFlagsPos[idx].i === i && gFlagsPos[idx].j === j) {
			gFlagsPos.splice(idx, 1)
			return;
		}
	}
}

function isVictory() {
	return ((gNumOfFlags === gLevel.mines && gCorrectFlags === gLevel.mines && gGame.shownCount >= gSafeCells) || (gGame.shownCount >= gSafeCells && gLives.length > 0 && gCorrectFlags === gLevel.mines))
}


function freezeGame() {
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard.length; j++) {
			gBoard[i][j].isShown = true;
		}
	}

}

function showNeighs() {
	gIsHintClick = true;
	var elHint = document.querySelector('.hint span')
	elHint.innerHTML = '💡';
}