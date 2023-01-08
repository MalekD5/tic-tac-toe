"use strict";

const player = (mark, name, wins = 0) => {
    const getWins = () => {
        return wins;
    }

    const addWin = () => {
        wins++;
    }

    return { name, mark, getWins, addWin };
}

const gameController = (() => {
    const p1 = player('x');
    const p2 = player('o');

    const board = [
        ['_', '_', '_'],
        ['_', '_', '_'],
        ['_', '_', '_'],
    ];

    let currentTurn = p1;

    function getCurrent() {
        return currentTurn;
    }

    const nextTurn = () => {
        if (currentTurn.mark === 'x')
            currentTurn = p2;
        else
            currentTurn = p1;
        console.log(currentTurn);
        return currentTurn;
    };

    const checkDiagonal = () => {
        const current = getCurrent();
        if (board[0][0] === current.mark 
            && board[1][1] === current.mark
            && board[2][2] === current.mark) 
            return true;

        if (board[0][2] === current.mark 
            && board[1][1] === current.mark
             && board[2][0] === current.mark)
        return true;

        return false;
    }

    const checkHorizontal = () => {
        const current = getCurrent();

        for (let i = 0; i < board.length; i++) {
        if (board[i][0] === current.mark 
                && board[i][1] === current.mark
                && board[i][2] === current.mark)
            return true;
        }
        return false;
    }

    const checkVertical = () => {
        const current = getCurrent();

        for (let i = 0; i < board.length; i++) {
            if (board[0][i] === current.mark 
                && board[1][i] === current.mark
                && board[2][i] === current.mark)
            return true;
        }
        return false;
    }

    const checkWin = () => {
        console.log(checkDiagonal(), checkVertical(), checkHorizontal());
       return checkDiagonal() || checkVertical() || checkHorizontal();
    }

    const setNames = (name1, name2) => {
        p1.name = name1;
        p2.name = name2;
    }

    const resetBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                gameController.board[i][j] = '_';
            }
        }
        currentTurn = p1;
    }

    return { setNames, board, current: getCurrent, next: nextTurn, checkWin, resetBoard};
})();

const displayController = ((gameController) => {
    let started = false;
    const winner = document.getElementById('winner');


    const initial = () => {


        function handleSqaure(e) {
            if (!started)
                return;

            const { row, column, played } = e.target.dataset;
            if (played === 'yes')
                return;
            const turn = gameController.current();

            gameController.board[row][column] = turn.mark;
            e.target.textContent = turn.mark;

            if (gameController.checkWin()) {
                winner.textContent = `${turn.name} has won!`;
            }

            gameController.next();

            e.target.dataset.played = 'yes';
        }
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const el = document.createElement('div');
                el.dataset.row = i;
                el.dataset.column = j;
                el.onclick = handleSqaure;
                el.setAttribute('class', 'board_sqaure')
                document.querySelector('#board').appendChild(el);
            }
        }
    }

    const start = () => {
        reset();
        const p1 = document.getElementById('p1');
        const p2 = document.getElementById('p2');

        if (p1.value && p1.value !== '' && p2.value && p2.value !== '') {
            gameController.setNames(p1.value, p2.value);
            started = true;
            winner.textContent = 'Game started!'
            winner.style.color = 'black';
        } else {
            winner.textContent = 'Please enter your names to start the game';
            winner.style.color = 'red';
        }
    }

    const reset = () => {
        if (!started) {
            return;
        }
        gameController.resetBoard();

        document.querySelectorAll('.board_sqaure')
        .forEach(el => {
            el.textContent = ''
            el.dataset.played = 'no';
        });

        winner.textContent = 'The board has been cleared';
    }


    
    initial();
    return { start, reset };
})(gameController);

