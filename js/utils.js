'use strict'



function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getEmptyCells(board) {
  var empties = [];
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var currCellPos = { i, j };
      var currCell = board[i][j];
      if (currCell === '') {
        empties.push(currCellPos)
      }
    }

  }
  return empties;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


function isEmptyCell(coord) {
  return gBoard[coord.i][coord.j] === ''
}


function getCellCoord(strCellId) {
  var parts = strCellId.split('-')
  var coord = { i: +parts[1], j: +parts[2] };
  return coord;
}


function markCells(coords) {
  for (var i = 0; i < coords.length; i++) {
    var coord = coords[i];
    var elCell = document.querySelector(`#cell-${coord.i}-${coord.j}`);
    elCell.classList.add('mark')
  }
}

// location such as: {i: 2, j: 7}
function renderCell(i,j, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell-${i}-${j}`);
  console.log(elCell);
  elCell.innerHTML = value;
}


/*NEIGHBOORS*/
function countMinesAround(board, rowIdx, colIdx) {
  var count = 0
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > board.length - 1) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > board[0].length - 1) continue
      if (i === rowIdx && j === colIdx) continue
      var currCell = board[i][j];
      if (currCell.isMine) count++
    }
  }
  // renderCell(rowIdx,colIdx,count);
  return count;
}

function getCellNeighsMinesAroundRec(board, rowIdx, colIdx) {
  if(board[rowIdx][colIdx].isMine) return;
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > board.length - 1) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > board[0].length - 1) continue
      if (i === rowIdx && j === colIdx) continue
      if(gBoard[i][j].isShown) continue;
      // if(gBoard[i][j].isMine) continue;
      var cellMines = countMinesAround(board, i, j)
      if (!cellMines) {
         renderCell(i, j, EMPTY);
         gBoard[i][j].isShown = true;
         gGame.shownCount++;
         getCellNeighsMinesAround(board,i,j);
        //  getCellNeighsMinesAround(board,i,j);
      //  return getCellNeighsMinesAround(board, i, j);
      }
      else {
        renderCell(i, j, createNumImg(cellMines));
        board[i][j].isShown = true;
        gGame.shownCount++
      }
    }
  }
  console.log('gGame-Count: ' +gGame.shownCount);
}

function getCellNeighsMinesAround(board, rowIdx, colIdx) {
  if(board[rowIdx][colIdx].isMine) return;
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > board.length - 1) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > board[0].length - 1) continue
      if(gBoard[i][j].isShown) continue;
      // if(gBoard[i][j].isMine) continue;
      var cellMines = countMinesAround(board, i, j)
      if (!cellMines) {
         renderCell(i, j, EMPTY);
      }
      else {
        renderCell(i, j, createNumImg(cellMines));
      }
    }
  }
  console.log('gGame-Count: ' +gGame.shownCount);
}

function hideCellNeighsMinesAround(board, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > board.length - 1) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > board[0].length - 1) continue
      if(gBoard[i][j].isShown) continue;
      // if(gBoard[i][j].isMine) continue;
         renderCell(i, j, '');
     
    }
  }
  console.log('gGame-Count: ' +gGame.shownCount);
}


function startStopWatch() {
  gWatchInterval = setInterval(updateWatch, 1)
  gStartTime = Date.now()
}

function updateWatch() {
  var now = Date.now()
  var time = ((now - gStartTime) / 1000).toFixed(2)
  var elTime = document.querySelector('.time')
  elTime.innerText = time
}

function endStopWatch() {
  clearInterval(gWatchInterval)
  gWatchInterval = null
  var elTime = document.querySelector('.time')
  elTime.innerText = 0;
}

// function startTime() {
//   var elTimer = document.querySelector('.timer')
//   gTimer = setInterval(() => {
//     var time = (Date.now() - gStartTime)
//     elTimer.innerText = (+time / 1000).toFixed(3) + '';
//     var seconds = parseInt(+time / 1000); //number
//     var milliseconds = ((+time / 1000) - seconds).toFixed(3);
//     elTimer.innerText = parseInt(+time / 1000) + milliseconds.substring(1, 5);
//   }, 1000);

// }

function changeLevel(size) {
  BOARD_SIZE = size
  init()
}


function getClassName(location) {
  var cellClass = 'cell-' + location.i + '-' + location.j;
  return cellClass;
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
				isMarked: false

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