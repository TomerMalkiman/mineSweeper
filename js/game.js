'use strict'

/*Const variables*/
const MINE = '💣'
const FLAG = '🚩'
const RED_FLAG = '🏴‍☠️'

/*Global variables:*/
var gBoard;
var g7Boom = false;
var gWatchInterval;
var gStartTime;
var gNumOfSafes = 3;
var gLives = [];
var gIsHintClick;
var gNumOfHints = 3;
var gMinesPos = [];
var gFlagsPos = [];
var gSafeCells;
var gNumOfFlags;
var gCorrectFlags;
var gLastMove = [];
var gUndo = false;

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
	nullifyGame();
	gLastMove = [];
	gFlagsPos = [];
	gMinesPos = [];
	updateEmoji('😃');
	gGame.isOn = true;
	startLives();
	
	gBoard = buildBoard();
	renderBoard(gBoard);
	gSafeCells = (gLevel.size * gLevel.size) - gLevel.mines;

}


function nullifyGame() {
	gGame.shownCount = 0;
	gGame.markedCount = 0;
	gGame.secsPassed = 0;
	gNumOfHints = 3;
	gNumOfSafes = 3;
	gCorrectFlags = 0;
	gNumOfFlags = 0;
	gLastMove =[];
	var elHint = document.querySelector('.hint span')
	elHint.innerHTML = `Hints: ${gNumOfHints}`;
	var elSafe = document.querySelector('.safe span')
	elSafe.innerHTML = `${gNumOfSafes}`;
	var elTime = document.querySelector('.time')
	elTime.innerText = 0;
	
}

function updateLevel(size, mines) {
	gLevel = {
		size: size,
		mines: mines
	};
	endStopWatch();
	initGame();
}

/*This function updating and rendering the board according to the user clcik*/
function cellClicked(elCell) {
	if (!gGame.isOn) return;
	var coord = getCellCoord(elCell.id);
	gLastMove.push(coord);
	var currCell = gBoard[coord.i][coord.j];

	if (gIsHintClick) {
		renderCellNeighs(gBoard, coord.i, coord.j);
		setTimeout(function () { hideCellNeighs(gBoard, coord.i, coord.j) }, 1000);
		gIsHintClick = false;
		gNumOfHints--;
		var elHint = document.querySelector('.hint span')
		elHint.innerHTML = `Hints: ${gNumOfHints}`;
		return;

	}

	if (currCell.isShown) return;
	if (currCell.isMarked) return;
	if (currCell.isMine) {
		if (!gGame.shownCount) return;//can't step on a mine in the first click
		else {
			currCell.isShown = true;
			gLives.pop();
			updateLives(gLives);
			updateEmoji('😵')
			if (gameOver()) {
				renderCell(coord.i, coord.j, MINE);
				elCell.style.backgroundColor = "red"
				gGame.isOn = false;
				revealMines(coord.i, coord.j);
				revealFlags();
				endStopWatch();

			}
			else renderCell(coord.i, coord.j, MINE);

			return;
		}
	}
	currCell.isShown = true;
	updateEmoji('😃');
	gGame.shownCount++;
	if (gGame.shownCount === 1) startStopWatch();//starting the clock on the first click

	if (!currCell.minesAroundCount) {//if there is no mines around the cell(in his neighboors)

		getCellNeighsMinesAroundRec(gBoard, coord.i, coord.j);//recursion - open all the empty cells till those one with mine neighboors
		renderCell(coord.i, coord.j, '')
		if (isVictory()) {
			makeWinnerSound();
			endStopWatch();
			updateEmoji('😎');
			gGame.isOn = false;
		}
		return;
	}
	elCell.innerHTML = currCell.minesAroundCount;
	elCell.style.color = chooseColor(currCell.minesAroundCount);
	elCell.style.backgroundColor = '#1c7c81';
	if (isVictory()) {
		makeWinnerSound();
		endStopWatch();
		updateEmoji('😎');
		gGame.isOn = false;
	}
}

/*This function gets a number and placing mines in the board randomly*/
function placeRandMines(numOfMines, board) {
	for (var i = 0; i < numOfMines; i++) {
		var randI = getRandomInt(0, board.length);
		var randJ = getRandomInt(0, board.length);
		var posObj = {
			i: randI,
			j: randJ
		};

		if (!(board[randI][randJ].isMine)) {
			board[randI][randJ].isMine = true;
			gMinesPos.push(posObj);
		}
		else i--//if there is mine already than place another one
	}
	console.log(gMinesPos);
}

/*This function renders the number of lifes*/
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


/*This function mark a cell by render a flag(emojy)in his position, and removing a mark if there was a flag before*/
function cellMarked(elCell, i, j) {
	window.event.preventDefault() // delete the right click bar
	if (!gGame.isOn) return;
	if (gBoard[i][j].isShown && !(gBoard[i][j].isMine)) return; 
	var idxObj = {
		i: i,
		j: j
	}
	console.log(elCell.classList);
	if (!(elCell.classList[1])) {//if the cell isn't marked(with flag)
		if (gBoard[i][j].isMine) gCorrectFlags++;
		gNumOfFlags++;
		if (isVictory()) {
			makeWinnerSound();
			endStopWatch();
			updateEmoji('😎');
			gGame.isOn = false;
		}
		elCell.innerHTML = FLAG;
		gGame.markedCount++;
		gBoard[i][j].isMarked = true;
		gFlagsPos.push(idxObj);//containig all the flag positions on the board
	}
	else {
		elCell.innerHTML = '';
		if (gBoard[i][j].isMine) gCorrectFlags--;
		gNumOfFlags--;
		gGame.markedCount--;
		gBoard[i][j].isMarked = false;
		removeObjFromArr(i, j);
	}
	elCell.classList.toggle('cell-marked')
	
}


function revealMines(rowIdx, colIdx) {
	for (var i = 0; i < gMinesPos.length; i++) {
		if (gMinesPos[i].i !== rowIdx || gMinesPos[i].j !== colIdx) renderCell(gMinesPos[i].i, gMinesPos[i].j, MINE);
		// else continue;
	}
	gMinesPos = [];
}


function revealFlags() {
	for (var i = 0; i < gFlagsPos.length; i++) {
		var rowIdx = gFlagsPos[i].i;
		var colIdx = gFlagsPos[i].j;
		if (gBoard[rowIdx][colIdx].isMine) renderCell(rowIdx, colIdx, RED_FLAG);
		// else renderCell(rowIdx, colIdx, FLAG);
	}
}

/*This function gets a position index's and removing from an array the data from this position (in this case the function is for the flags)*/
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


/*This function updating the global variable that responsible for the hint click, and updates the text in the click*/
function showNeighs() {
	if (isVictory() || gameOver()) return;
	if (gNumOfHints === 0) return;
	gIsHintClick = true;
	var elHint = document.querySelector('.hint span')
	elHint.innerHTML = '💡';
}


/*This function reveal a safe cell (with no mine) by blinking it for few seconds*/
function showSafeCell() {
	if (!gNumOfSafes) return;
	gNumOfSafes--;
	revealSafeCell(gBoard);
}


/*This function places the mines in positions according to the 7-Boom game (and updates the board accordingly)*/
function create7Boom() {

	if (gGame.shownCount) return;
	var minesNum = 0;
	gMinesPos = [];

	var idx7Boom = 0;
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard.length; j++) {
			idx7Boom++;
			var posObj = {
				i: i,
				j: j
			};

			if ((idx7Boom % 7 === 0) || parseInt(idx7Boom / 10) === 7 || idx7Boom % 10 === 7) {
				gBoard[i][j].isMine = true;
				minesNum++;
				gMinesPos.push(posObj);
			}
			else {
				if (gBoard[i][j].isMine) gBoard[i][j].isMine = false;
			}
		}
	}
	gLevel.mines = minesNum;
	gSafeCells = (gLevel.size * gLevel.size) - minesNum;

	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard.length; j++) {
			var currCell = gBoard[i][j];

			currCell.minesAroundCount = countMinesAround(gBoard, i, j);
		}
	}


}

/*This function bringing back the game by one step(click) and rendering it*/
function undoMove() {
	gUndo = true;
	var len = gLastMove.length;
	var lastMoveCoord = gLastMove[len - 1]; //The last move position object
	gBoard[lastMoveCoord.i][lastMoveCoord.j].isShown = false;
	if(gBoard[lastMoveCoord.i][lastMoveCoord.j].isMine){// updating lives if the last click was a mine
		gLives.push('♥');
		updateLives(gLives);
	} 

	if ((!(gBoard[lastMoveCoord.i][lastMoveCoord.j].minesAroundCount)) && !gBoard[lastMoveCoord.i][lastMoveCoord.j].isMine) {
		colorCell(lastMoveCoord.i,lastMoveCoord.j,'#9AD1D4');
		renderCellNeighsRec(gBoard, lastMoveCoord.i, lastMoveCoord.j);
	}
	else {
		renderCell(lastMoveCoord.i, lastMoveCoord.j, '');
		colorCell(lastMoveCoord.i,lastMoveCoord.j,'#9AD1D4');
	}

	gLastMove.pop();//removing the last click position
	gUndo = false;

}


function chooseColor(num) {
	if (num === 1) return 'blue'
	if (num === 2) return '#32f80a'
	if (num === 3) return 'red'
	if (num === 4) return '#6404e2'
	if (num === 5) return 'yellow'
	if (num === 6) return 'blue'
	if (num === 7) return 'red'
	if (num === 8) return 'yellow'
}

/*This function changing the background color of the cell*/
function colorCell(i,j,colorStr){
	var elCell = document.querySelector(`.cell-${i}-${j}`);
	elCell.style.backgroundColor = colorStr
}







