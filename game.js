'use strict'

const MINE = '💣'

var gBoard;

var gGame = {
	isOn: false,
	shownCount: 0,
	markedCount: 0,
	secsPassed: 0
}

var gLevel = {
	size: 4,
	mines: 2
};



function initGame() {

	gBoard = buildBoard();
	renderBoard(gBoard);

}

// function createMines(board) {
//     gPacman = {
//         location: {
//             i: 5,
//             j: 7
//         },
//         isSuper: false
//     }
//     board[gPacman.location.i][gPacman.location.j] = PACMAN
//     gFood--;
// }

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
			var cell = board[i][j];
			if (cell.isMine) var cellContent = MINE;
			else var cellContent = ' ';
			// figure class name
			var className = 'cell-' + i + '-' + j;
			var tdId = `cell-${i}-${j}`;
			strHtml += `<td id="${tdId}" class="${className}" onclick="cellClicked(this)">${cellContent}  </td>`
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
	var coord = getCellCoord(elCell.id);
	// console.log(coord);
	if (gBoard[coord.i][coord.j].isMine) return;
	if (!gBoard[coord.i][coord.j].minesAroundCount) {
		console.log('hey');
		getCellNeighsMinesAround(gBoard, coord.i, coord.j);
		return;
	}
	elCell.innerHTML = gBoard[coord.i][coord.j].minesAroundCount;

}

// function cellClicked(elCell) {

//     // if the target is marked - move the piece!
//     if (elCell.classList.contains('mark')) {
//         movePiece(gSelectedElCell, elCell);
//         cleanBoard();
//         return;
//     }

//     cleanBoard();

//     elCell.classList.add('selected');
//     gSelectedElCell = elCell;

function placeRandMines(numOfMines, board) {
	for (var i = 0; i < numOfMines; i++) {
		var randI = getRandomInt(0, board.length);
		var randJ = getRandomInt(0, board.length);
		console.log(board[randI][randJ].isMine);
		if (!(board[randI][randJ].isMine)) board[randI][randJ].isMine = true;
		else i--
	}
}

function expandShown(board, elCell, i, j) {

}
