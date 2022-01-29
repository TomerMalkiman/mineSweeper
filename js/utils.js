'use strict'



function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*This function fins all the safe cells and randomly reveal one of them by blink him*/
function revealSafeCell(board) {
  var empties = [];
  for (var i = 0; i < board.length; i++) {//finding all the safe(with no mines) cells
    for (var j = 0; j < board[0].length; j++) {
      var currCellPos = { i, j };
      var currCell = board[i][j];
      if ((!currCell.isShown) && (!currCell.isMine)) {
        empties.push(currCellPos)
      }
    }
  }
  if (!empties.length) return;//if there is no more safe cells

  var randIdx = getRandomInt(0, empties.length);

  var sec = 400;
  for (var i = 0; i < 2; i++) {

    setTimeout(function () {
      var elCell = document.querySelector(`.cell-${empties[randIdx].i}-${empties[randIdx].j}`);
      elCell.style.backgroundColor = "#309edf";
    }
      , sec);

    sec += 400;
    setTimeout(function () {
      var elCell = document.querySelector(`.cell-${empties[randIdx].i}-${empties[randIdx].j}`);
      elCell.style.backgroundColor = "#9AD1D4";
    }
      , sec);
    sec += 400;
  }

  var elSafe = document.querySelector('.safe span')
  elSafe.innerHTML = `${gNumOfSafes}`;

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


function renderCell(i, j, value) {
  var elCell = document.querySelector(`.cell-${i}-${j}`);
  console.log(elCell);
  elCell.innerHTML = value;
  elCell.style.color = chooseColor(gBoard[i][j].minesAroundCount)
  elCell.style.backgroundColor = "#1c7c81";
  if ((value === MINE && !gGame.isOn) || gUndo) elCell.style.backgroundColor = "#9AD1D4"
}


/*This function counting how many mines around the cell*/
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
  return count;
}


function getCellNeighsMinesAroundRec(board, rowIdx, colIdx) {
  if (board[rowIdx][colIdx].isMine) return;
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > board.length - 1) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > board[0].length - 1) continue;
      if (i === rowIdx && j === colIdx) continue;
      if (board[i][j].isShown) continue;
      if (board[i][j].isMine) continue;
      var cellMines = board[i][j].minesAroundCount

      if (!cellMines) {//cell without mines around him
        renderCell(i, j, '');
        board[i][j].isShown = true;
        gGame.shownCount++;
        getCellNeighsMinesAroundRec(board, i, j);//recursion
      }

      else {
        renderCell(i, j, cellMines);//cell with mines around him
        board[i][j].isShown = true;
        gGame.shownCount++
      }
    }
  }
}

/*This function render the cell neighboors without updating the board*/
function renderCellNeighs(board, rowIdx, colIdx) {
  if (board[rowIdx][colIdx].isMine) {
    if (!gIsHintClick) return;
  }
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > board.length - 1) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > board[0].length - 1) continue
      if (gBoard[i][j].isShown) continue;
      if (gBoard[i][j].isMine) {
        renderCell(i, j, MINE)
        continue;
      }
      var cellMines = board[i][j].minesAroundCount;
      if (!cellMines) {
        renderCell(i, j, '');
      }
      else {
        renderCell(i, j, cellMines);
      }
    }
  }
}

function renderCellNeighsRec(board, rowIdx, colIdx) {

  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > board.length - 1) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > board[0].length - 1) continue;
      if (!(gBoard[i][j].isShown)) continue;
      var cellMines = board[i][j].minesAroundCount;
      board[i][j].isShown = false;
      colorCell(i, j, '#9AD1D4');

      if (!cellMines) {
        renderCell(i, j, '');
        renderCellNeighsRec(board, i, j);
      }
      else {
        renderCell(i, j, '');
      }
    }
  }
}


function hideCellNeighs(board, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > board.length - 1) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > board[0].length - 1) continue
      if (gBoard[i][j].isShown) continue;
      // if(gBoard[i][j].isMine) continue;
      renderCell(i, j, '');
      colorCell(i, j, '#9AD1D4');
    }
  }
}

/*Timer functions*/
function startStopWatch() {
  gWatchInterval = setInterval(updateWatch, 1)
  gStartTime = Date.now()
}

function updateWatch() {
  var now = Date.now()
  var time = ((now - gStartTime) / 1000).toFixed(1)
  var elTime = document.querySelector('.time')
  elTime.innerText = time
}

function endStopWatch() {
  clearInterval(gWatchInterval)
  gWatchInterval = null
}


function getClassName(location) {
  var cellClass = 'cell-' + location.i + '-' + location.j;
  return cellClass;
}

/*This function creating a board with mines on him*/
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

  placeRandMines(gLevel.mines, board);

  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      currCell = board[i][j];
      currCell.minesAroundCount = countMinesAround(board, i, j);
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


function makeWinnerSound() {
  var audio = new Audio('./sound/winaudio.mp3');
  audio.play();
}
