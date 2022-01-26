'use strict'

function printMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
      strHTML += '<tr>';
      for (var j = 0; j < mat[0].length; j++) {
        var cell = mat[i][j];
        var className = 'cell cell-' + i + '-' + j;
        strHTML += '<td class="' + className + '">' + cell + '</td>'
      }
      strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
  }
  
  // location such as: {i: 2, j: 7}
  function renderCell(i,j, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${i}-${j}`);
    console.log(elCell);
    elCell.innerHTML = value;
  }
  
  function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }
  
  function openModal(message) {
    var elTitle = document.querySelector('.modal h3')
    elTitle.innerText = message;
    var elResetBtn = document.querySelector('.reset-btn');
    elResetBtn.style.visibility = 'visible';
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'block';
    // Todo: show the modal and schedule its closing
  }
  function closeModal() {
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'none';
    // Todo: hide the modal
  }
  
  
  function placeRandElem(board) {
      var emptyCells = getEmptyCells(board);
      var posIdx = getRandomInt(0, emptyCells.length - 1);
      console.log(emptyCells);
      console.log(posIdx);
      var randI = emptyCells[posIdx].i;
      var randJ = emptyCells[posIdx].j;
      //update model
      board[randI][randJ].isMine = true;
      //update DOM
      // renderCell(emptyCells[posIdx], gameElement);
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

function updateScore(diff) {
    // update model and dom
    gGame.score += diff;
    document.querySelector('h2 span').innerText = gGame.score;
}


/*NEIGHBOORS*/
function countMinesAround(board,rowIdx, colIdx) {
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
    return count
  }

  function getCellNeighsMinesAround(board,rowIdx, colIdx) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
      if (i < 0 || i > board.length - 1) continue
      for (var j = colIdx - 1; j <= colIdx + 1; j++) {
        if (j < 0 || j > board[0].length - 1) continue
        if (i === rowIdx && j === colIdx) continue
        var cellMines = countMinesAround(board,i,j)
        if(!cellMines) continue;
        renderCell(i,j,cellMines);
      }
    }
  }

/*TIMER*/

//   gTimer = 0
// var gElTimer
// function renderTimer() {
//   var stopWatch = Number(gTimer).toFixed(3) + ''
//   gElTimer.innerHtml = `<p>${stopWatch}</p>`
// }

// function startTimer() {
//   gIntervalId = setInterval(function () {
//     //global var
//     gTimer += 0.01
//     renderTimer()
//   }, 10)
// }


// better one

function startStopWatch() {
  gWatchInterval = setInterval(updateWatch, 1)
  gStartTime = Date.now()
}

function updateWatch() {
  var now = Date.now()
  var time = ((now - gStartTime) / 1000).toFixed(3)
  var elTime = document.querySelector('.time')
  elTime.innerText = time
}

function endStopWatch() {
  clearInterval(gWatchInterval)
  gWatchInterval = null
}

function startTime() {
    var elTimer = document.querySelector('.timer')
    gTimer = setInterval(() => {
        var time = (Date.now() - gStartTime)
        elTimer.innerText = (+time / 1000).toFixed(3) + '';
        var seconds = parseInt(+time / 1000); //number
        var milliseconds = ((+time / 1000) - seconds).toFixed(3);
        elTimer.innerText = parseInt(+time / 1000) + milliseconds.substring(1,5);
    }, 1000);

}

function changeLevel(size) {
    BOARD_SIZE = size
    init()
  }

//   function renderBoard() {
//     var strHtml = ''
//     var length = Math.sqrt(BOARD_SIZE)
//     for (let i = 0; i < length; i++) {
//       strHtml += `<tr>`
//       for (let j = 0; j < length; j++) {
//         strHtml += `<td onclick="cellClicked(this)">${randomNum()}</td>`
//       }
//       strHtml += `</tr>`
//     }
  
//     var elBoard = document.querySelector('.board')
//     elBoard.innerHTML = strHtml
//   }

function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}