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

    let posBlack = [];
    let posWhite = [];

    SavePos();


    TEAM = {
        black: 'black',
        white: 'white',
    }

    let turnIsActive = false;
    let activeTeam = null;
    let activeElementCoords = null;
    const DIAGONAL_TURNS_POSSIBLE = false;


    // Строим доску и фигуры на ней
    const grid = document.createElement('table');
    for(let i = 0; i < board.length; i++) {
        const tr = document.createElement('tr');
        for(let j = 0; j < board[i].length; j++) {
            const td = document.createElement('td');
            if (board[i][j] == 1) td.classList.add(TEAM.black);
            if (board[i][j] == 2) td.classList.add(TEAM.white);
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
        
        const row = +target.dataset.row;
        const col = +target.dataset.col;
        const cellOccupied = board[row][col];

        if (!cellOccupied && !turnIsActive) return;
        if (cellOccupied && turnIsActive) return doSomeAction(row, col);
        if (cellOccupied && !turnIsActive) return moveChecker(target, row, col);
        return FinishMove(target, row, col);
    };
    // Начинаем перемещение
    function moveChecker(element, row, col) {
        if (turnIsActive) return;
        turnIsActive = true;
        activeTeam = board[row][col]
        activeElementCoords = [row, col];
        board[row][col] = 0;
        element.classList.remove(activeTeam % 2 ? TEAM.black : TEAM.white);
    }
    // Заканчуем перемещение
    function FinishMove(element, row, col) {
        if(checkTurnValidity(row, col)) {
            board[row][col] = activeTeam;
            element.classList.add(activeTeam % 2 ? TEAM.black : TEAM.white);
            turnIsActive = false;
            activeTeam = null;
            activeElementCoords = null;
            console.table(board)
            CheckEnd()
        }
    }


    // сохраняем позиции для проверки кто выйграл
    function SavePos() {
        for (let i=0; board.length > i; i++) {
            for (let j=0; board[i].length > j; j++) {
                if (board[i][j] == 1) posBlack.push([i, j]);
                if (board[i][j] == 2) posWhite.push([i, j]);
            }
        }
    }

    
    // проверяем конец ли игры
    function CheckEnd() {
        let tempB = []
        let tempW = []
        for (let i=0; board.length > i; i++) {
            for (let j=0; board[i].length > j; j++) {
                if (board[i][j] == 1) tempB.push([i, j]);
                if (board[i][j] == 2) tempW.push([i, j]);
            }
        }
        if (""+tempB==""+posWhite) console.log("win: Black")
        if (""+tempW==""+posBlack) console.log("win: White")
    }
    
    // проверяем можна ли сделать ход
    function checkTurnValidity(row, col) {
        const [rowStart, colStart] = activeElementCoords; 
        const validity = DIAGONAL_TURNS_POSSIBLE ?  Math.abs(colStart - col) <= 1 && Math.abs(rowStart - row) <= 1:  Math.abs(colStart - col) + Math.abs(rowStart - row) <= 1
        return validity
    }

    // выводим ошибку если елемент на елемент
    function doSomeAction(row, col) {
        const targetTeam = board[row][col]
        console.log('Something just happened!');
        console.log('activeTeam', activeTeam)
        console.log('targetTeam', targetTeam)
    }
});