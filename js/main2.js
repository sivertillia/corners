$(document).ready(function() {
    let board = [
        [1,1,1,0,0,0,0,0],
        [1,1,1,0,0,0,0,0],
        [1,1,1,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,2,2,2],
        [0,0,0,0,0,2,2,2],
        [0,0,0,0,0,2,2,2],
    ]
const TEAMS = {
	blue: 'blue',
    red: 'red'
};

const grid = document.createElement('table');

for(let i = 0; i < board.length; i++) {
    const tr = document.createElement('tr');
  for(let j = 0; j < board[i].length; j++) {
   const td = document.createElement('td');
   td.classList.add('cell');
   td.dataset.col = j;
   td.dataset.row = i;
   if (board[i][j]) {
   	board[i][j] % 2 ? td.classList.add(TEAMS.blue) : td.classList.add(TEAMS.red)
   }
   tr.appendChild(td);
    }
  grid.appendChild(tr);
}
document.body.appendChild(grid);

// asdasdasd
const DIAGONAL_TURNS_POSSIBLE = false;
let turnIsActive = false;
let activeTeam = null;
let activeElementCoords = null;
grid.addEventListener('click', handleClick);

function handleClick(e) {
	const col = +e.target.dataset.col;
  const row = +e.target.dataset.row;
  const cellOccupied = board[row][col];
  console.log('pos: ',cellOccupied)
  if(!cellOccupied && !turnIsActive) {
  	return;
  }
  if (cellOccupied && turnIsActive) {
  	return doSomeAction(e.target, row, col)
  }
  if (cellOccupied && !turnIsActive) {
    return initTurn(e.target, row, col);
  }
  	return finishTurn(e.target, row, col);
}

function checkTurnValidity(row, col) {
	const [rowStart, colStart] = activeElementCoords; 
  const validity = DIAGONAL_TURNS_POSSIBLE 
  	?  Math.abs(colStart - col) <= 1 && Math.abs(rowStart - row) <= 1
    :  Math.abs(colStart - col) + Math.abs(rowStart - row) <= 1
  return validity
}

function initTurn(element, row, col) {
  	if (turnIsActive) {
    	return;
    }
    activeTeam = board[row][col];
    activeElementCoords = [row, col];
  	board[row][col] = 0;
  	element.classList.remove(activeTeam % 2 ? TEAMS.blue : TEAMS.red);
    turnIsActive = true;
}

function finishTurn(element, row, col) {
  if(checkTurnValidity(row, col)) {
    board[row][col] = activeTeam;
  	element.classList.add(activeTeam % 2 ? TEAMS.blue : TEAMS.red);
    turnIsActive = false;
    activeTeam = null;
    activeElementCoords = null;
    console.table(board)
    }
}

function doSomeAction(element, row, col) {
    const targetTeam = board[row][col]
    console.log('Something just happened!');
    console.log('activeTeam', activeTeam)
    console.log('targetTeam', targetTeam)
}


});