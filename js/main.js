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
    // Css классы
    GAME_CSS_CLASS = {
        black: 'black',
        white: 'white',
        select: 'select_checker',
        true_move: 'select_checker_true'
    }

    // обьявляем глобальные переменные
    let turnIsActive = false;
    let activeTeam = 2; // первые ходят белые
    let activeElementCoords = null;
    let selectElement;
    const DIAGONAL_TURNS_POSSIBLE = false;
    let posBlack = [];
    let posWhite = [];


    let movePlayer = document.querySelector('#player')
    movePlayer.innerHTML = "Первыми ходят " + (activeTeam % 2 ? "черные" : "белые");


    // Строим доску и фигуры на ней
    const grid = document.createElement('table');
    for(let i = 0; i < board.length; i++) {
        const tr = document.createElement('tr');
        for(let j = 0; j < board[i].length; j++) {
            const td = document.createElement('td');
            // сохраняем позиции для проверки кто выйграл
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
    
    //Обработчик нажатий
    grid.addEventListener('click', ClickChecker);
    function ClickChecker(event) {               
        const target = event.target;
        if (target.tagName == 'TD') { // проверям есть ли поле по корому нажали клеткой доски
            const row = +target.dataset.row;
            const col = +target.dataset.col;
            const cellOccupied = board[row][col];

            if (cellOccupied == activeTeam || cellOccupied==0) {
                if (!cellOccupied && !turnIsActive) return;
                if (cellOccupied && turnIsActive) return doSomeAction(row, col);
                if (cellOccupied && !turnIsActive) return moveChecker(target, row, col);
                return FinishMove(target, row, col);
            }
        }
        
        
    };
    // Начинаем перемещение
    function moveChecker(element, row, col) {
        if (turnIsActive) return;
        turnIsActive = true;
        activeTeam = board[row][col]
        activeElementCoords = [row, col];
        selectElement = element;
        ViewMove(row, col)
        board[row][col] = 0;
        element.classList.add(GAME_CSS_CLASS.select);
    }
    // Заканчуем перемещение
    function FinishMove(element, row, col) {
        if(checkTurnValidity(row, col)) {
            board[row][col] = activeTeam;
            selectElement.classList.remove(activeTeam % 2 ? GAME_CSS_CLASS.black : GAME_CSS_CLASS.white);
            element.classList.add(activeTeam % 2 ? GAME_CSS_CLASS.black : GAME_CSS_CLASS.white);
            selectElement.classList.remove(GAME_CSS_CLASS.select);
            document.querySelectorAll('table td').forEach(n => n.classList.remove(GAME_CSS_CLASS.true_move))
            if (!Comparison_Of_Arrays([row, col], activeElementCoords))activeTeam = activeTeam % 2 ? 2 : 1; // проверяем был ли сдвиг
            activeElementCoords = null;
            turnIsActive = false;
            CheckEnd();
            movePlayer.innerHTML = "Ходят " + (activeTeam % 2 ? "черные" : "белые");
        }
    }
    //
    function ViewMove(row, col) {
        for(let i = 0; i < board.length; i++) {
            for(let j = 0; j < board[i].length; j++) {
                if(checkTurnValidity(i, j)) {
                    if (!board[i][j] || !board[row][col]) {
                        let element = document.querySelector(`[data-row="${i}"][data-col="${j}"]`)
                        element.classList.add(GAME_CSS_CLASS.true_move);
                    }
                }
            }
        }
    }
    
    // проверяем конец ли игры
    function CheckEnd() {
        let tempB = [];
        let tempW = [];
        for(let i = 0; i < board.length; i++) {
            for(let j = 0; j < board[i].length; j++) {
                if (board[i][j] == 1) tempB.push([i, j]);
                if (board[i][j] == 2) tempW.push([i, j]);
            }
        }
        if (Comparison_Of_Arrays(tempB, posWhite)) alert("win: Black")
        if (Comparison_Of_Arrays(tempW, posBlack)) alert("win: White")
    }
    
    // проверяем можна ли сделать ход
    function checkTurnValidity(row, col) {
        const [rowStart, colStart] = activeElementCoords; 
        const validity = DIAGONAL_TURNS_POSSIBLE ?  Math.abs(colStart - col) <= 1 && Math.abs(rowStart - row) <= 1:  Math.abs(colStart - col) + Math.abs(rowStart - row) <= 1
        return validity
    }
    function Comparison_Of_Arrays(arr1, arr2) {
        return  arr1.length === arr2.length && arr1.every((_, i) => arr1[i] === arr2[i]);
    }

    // выводим ошибку если елемент на елемент
    function doSomeAction(row, col) {
        const targetTeam = board[row][col]
        console.log('Something just happened!');
        console.log('activeTeam', activeTeam)
        console.log('targetTeam', targetTeam)
    }
});