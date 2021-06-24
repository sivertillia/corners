$(document).ready(function() {
 
    let board = [
        [2,2,2,0,0,0,0,0],
        [2,2,2,0,0,0,0,0],
        [2,2,2,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,1,1,1],
        [0,0,0,0,0,1,1,1],
        [0,0,0,0,0,1,1,1],
    ]
    // 1 = black player
    // 2 = white player

    // Css class
    GAME_CSS_CLASS = {
        black: 'black',
        white: 'white',
        select: 'select_checker',
        false_move: 'select_checker_false'
    }

    // Global variable
    let turnIsActive = false;
    let activeTeam = 2; // First move
    let activeElementCoords = null;
    let selectElement;
    const DIAGONAL_MOVE_POSSIBLE = false; // Diagonal move possible
    let posBlack = [];
    let posWhite = [];


    let info_game = document.querySelector('#info_game')
    info_game.innerHTML = "Первыми ходят " + (activeTeam % 2 ? "черные" : "белые");


    // Create board and checker
    const grid = document.createElement('table');
    for(let i = 0; i < board.length; i++) {
        const tr = document.createElement('tr');
        for(let j = 0; j < board[i].length; j++) {
            const td = document.createElement('td');
            // Save position and add class 
            if (board[i][j] == 1) {
                td.classList.add(GAME_CSS_CLASS.black);
                posBlack.push([i, j]);
            }
            if (board[i][j] == 2) {
                td.classList.add(GAME_CSS_CLASS.white);
                posWhite.push([i, j]);
            }
            td.dataset.row = i;
            td.dataset.col = j;
            tr.appendChild(td);
        }
        grid.appendChild(tr);
    };
    $("#game")[0].appendChild(grid);
    
    //Event click
    grid.addEventListener('click', ClickChecker);
    function ClickChecker(event) {               
        const target = event.target;
        if (target.tagName == 'TD') { // Check click
            const row = +target.dataset.row;
            const col = +target.dataset.col;
            const cellOccupied = board[row][col];

            if (cellOccupied == activeTeam || cellOccupied==0) {
                if ((!cellOccupied && !turnIsActive) || (cellOccupied && turnIsActive)) return;
                if (cellOccupied && !turnIsActive) return StartMoveChecker(target, row, col); //First click
                return FinishMoveChecker(target, row, col); // Second click
            }
        }
    };

    // Start Move
    function StartMoveChecker(element, row, col) {
        if (turnIsActive) return;
        turnIsActive = true;
        activeTeam = board[row][col]
        activeElementCoords = [row, col];
        selectElement = element;
        DisplayPossibleMove(row, col)
        board[row][col] = 0;
    }

    // Finish Move
    function FinishMoveChecker(element, row, col) {
        if(checkTurnValidity(row, col)) {
            board[row][col] = activeTeam;
            selectElement.classList.remove(activeTeam % 2 ? GAME_CSS_CLASS.black : GAME_CSS_CLASS.white);
            element.classList.add(activeTeam % 2 ? GAME_CSS_CLASS.black : GAME_CSS_CLASS.white);
            document.querySelectorAll('table td').forEach(n => n.classList.remove(GAME_CSS_CLASS.false_move))
            if (!Comparison_Of_Arrays([row, col], activeElementCoords)) activeTeam = activeTeam % 2 ? 2 : 1; // Check  move
            activeElementCoords = null;
            turnIsActive = false;
            info_game.innerHTML = "Ходят " + (activeTeam % 2 ? "черные" : "белые");
            CheckEnd();
        }
    }

    // Display Possible Move
    function DisplayPossibleMove(row, col) {
        for(let i = 0; i < board.length; i++) {
            for(let j = 0; j < board[i].length; j++) {
                if(!checkTurnValidity(i, j) && !Comparison_Of_Arrays([i, j], [row, col])) {
                    let element = document.querySelector(`[data-row="${i}"][data-col="${j}"]`)
                    element.classList.add(GAME_CSS_CLASS.false_move);
                }
            }
        }
    }
    
    // Checked End Game
    function CheckEnd() {
        let tempB = [];
        let tempW = [];
        for(let i = 0; i < board.length; i++) {
            for(let j = 0; j < board[i].length; j++) {
                if (board[i][j] == 1) tempB.push([i, j]);
                if (board[i][j] == 2) tempW.push([i, j]);
            }
        }
        if (Comparison_Of_Arrays_2(tempB, posWhite)) DisplayWinPlayer("черные")
        if (Comparison_Of_Arrays_2(tempW, posBlack)) DisplayWinPlayer("белые")
    }
    
    // Display Winner Player and Delete Event click
    function DisplayWinPlayer(win) {
        info_game.innerHTML = "Победили " + win + "!";
        info_game.classList.add('gameOver')
        grid.removeEventListener('click', ClickChecker);
    }

    // Check Turn Validity
    function checkTurnValidity(row, col) {
        const [rowStart, colStart] = activeElementCoords; 
        const validity = DIAGONAL_MOVE_POSSIBLE ?  Math.abs(colStart - col) <= 1 && Math.abs(rowStart - row) <= 1:  Math.abs(colStart - col) + Math.abs(rowStart - row) <= 1
        if (!board[row][col]) return validity;
    }

    // Comparison of 2 arrays
    function Comparison_Of_Arrays(arr1, arr2) {
        return arr1.length === arr2.length && arr1.every((_, i) => arr1[i] === arr2[i]);
    }

    // Comparison of 2 two-dimensional arrays
    function Comparison_Of_Arrays_2(arr1, arr2) {
        return arr1.length === arr2.length && arr1.every((_, i) => Comparison_Of_Arrays(arr1[i], arr2[i]));
    }
});