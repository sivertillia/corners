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

    let turnIsActive = false;

    const grid = document.createElement('table');

    for(let i = 0; i < board.length; i++) {
        const tr = document.createElement('tr');
        for(let j = 0; j < board[i].length; j++) {
            const td = document.createElement('td');
            const div = document.createElement('div');
            if (board[i][j] == 1) div.className = 'black';
            if (board[i][j] == 2) div.className = 'white';
            td.dataset.row = i;
            td.dataset.col = j;
            tr.appendChild(td);
            td.appendChild(div);
        }
        grid.appendChild(tr);
    };
    $("#game")[0].appendChild(grid);


    // console.log(board);
    let selectedTd;

    $('#game').click( function(event) {               
        let target = event.target;
        if (target.tagName == 'TD') { // ИСПРАВИТЬ Error(Not children)
            if (target.children.length > 0) {
                console.log("Target:", target)
                ActiveChecker(target.children[0], target);
                return;
            }
            
        }
    });

    function ActiveChecker(node, td) {
        if (selectedTd) selectedTd.classList.remove('select_checker');
        selectedTd = node;
        selectedTd.classList.add('select_checker');

        let row = td.getAttribute('data-row');
        let col = td.getAttribute('data-col');

        res = dbChecker(parseInt(row), parseInt(col))
        console.log(res)

    }

    function dbChecker(i, j) {
        if ((i-1 < 0) || (j-1 < 0) || (i+1 > board.length) || (j+1 > board[i].length)) {
            console.log("LOL")
        }
        let top = board[i-1][j]
        let right = board[i][j-1]
        let bottom = board[i+1][j]
        let left = board[i][j+1]
        let result = 'top: '+top+'\nbottom: '+bottom+'\nright: '+right+'\nleft: '+left
        let res = [top, right, bottom, left]
        return res
    }
    // 

    function moveChecker() {
        
    }

});