// Factory function for player creation
const Player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;

    return {getName, getSymbol}
};

// Module pattern for game logic
const gameBoard = (() => {
    // Use multi-dimensional array to store state of gameboard (initially 0, dynamically changed to X or O)
    let _gameBoardArray = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; 

    let _player1; 
    let _player2; 
    let _currentPlayer;

    const setPlayers = (name1, name2) => {
        _player1 = Player(name1, "X");
        _player2 = Player(name2, "O");
    }

    const changePlayer = () => {
        if (_currentPlayer == _player1) {
            _currentPlayer = _player2;
        } else {
            _currentPlayer = _player1;
        }
    };

    const checkIfCellOccupied = (index) => {
        let placedSymbol = _gameBoardArray[Math.floor(index / 3)][index % 3];

        if (placedSymbol != 0) {
            return true;
        } else {
            return false;
        }
    };

    const checkForTie = () => {
        let count = 0;
        for (let i = 0; i < 9; i++) {
            if (checkIfCellOccupied(i)) {
                count++;
            }
        }
        console.log(count);
        return count;
    };

    const gameStart = () => {
        let names = displayController.getPlayerNames();
       
        setPlayers(names[0], names[1]);
        changePlayer();
        displayController.enableGameBoardInputs();
        displayController.clearPlayerNames();
    };

    const checkForWin = (symbol) => {
       // checking rows for win
       let rowCount = 0;
       for (let i = 0; i < _gameBoardArray.length; i++) {
           for (let j = 0; j < _gameBoardArray.length; j++) {
               if (symbol == _gameBoardArray[i][j]) {
                   rowCount += 1;
               }
           }
           if (rowCount == 3) {
               return true;
           } else {
               rowCount = 0;
           }  
       }

       // checking columns for win
       let columnCount = 0;
       for (let i = 0; i < _gameBoardArray.length; i++) {
           for (let j = 0; j < _gameBoardArray.length; j++) {
               if (symbol == _gameBoardArray[j][i]) {
                   columnCount += 1;
               }
           }
           if (columnCount == 3) {
               return true;
           } else {
               columnCount = 0;
           }
       }

       // checking diagonals (bottom left to top right)
       let diagonalCount = 0;
       let bottomLeftCellInitialRow = _gameBoardArray.length - 1;
       let bottomLeftCellInitialColumn = 0;
       for (let i = 0; i < _gameBoardArray.length; i++) {
           if (symbol == _gameBoardArray[bottomLeftCellInitialRow][bottomLeftCellInitialColumn]) {
               diagonalCount += 1;
               bottomLeftCellInitialColumn++;
               bottomLeftCellInitialRow--; 
           }
       }
       if (diagonalCount == 3) {
           return true;
       } else {
           diagonalCount = 0;
           bottomLeftCellInitialColumn =  _gameBoardArray.length - 1;
            bottomLeftCellInitialRow = 0; 
       }

       // checking diagonals (top left to bottom right)
       let diagonalCountx = 0
       for (let i = 0; i < _gameBoardArray.length; i++) {
           for (let j = 0; j < _gameBoardArray.length; j++) {
               if (symbol == _gameBoardArray[i][j] && i == j) {
                   diagonalCountx += 1;
               }
           }
       }
       if (diagonalCountx == 3) {
         
         return true;
       } 
    
    };

    const clearGameBoardArray = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                _gameBoardArray[i][j] = 0;
            }
        }
        displayController.refreshBoard();
    };

    const getGameBoardArray = () => (_gameBoardArray);

    const getCurrentPlayer = () => (_currentPlayer);

    const formEventListener = () => {
        const formComponent = document.querySelector('#submit-button');
        formComponent.addEventListener('click', gameStart);
    };

    formEventListener();

    return {clearGameBoardArray, checkForWin, checkForTie, setPlayers, changePlayer, getCurrentPlayer, getGameBoardArray, checkIfCellOccupied, gameStart}
})();

// Module pattern for display control
const displayController = (() => {
    const gameContainer = document.querySelector('#game-container');
    
    const boardCreator = () => {
        for (let i = 0; i < 9; i++) {
            let gridSquare = document.createElement("button");
            gridSquare.id = `cell-${i}`;
            gridSquare.classList.add("cell");
            
            gameContainer.appendChild(gridSquare);
        }
    };

    // clear board after win or tie
    const refreshBoard = () => {
        const children = gameContainer.children;
        const childrenArray = Array.from(children);
        childrenArray.forEach(item => {
            item.textContent = "";
        });
    };

    function _addSymbol() {
        let symbol = gameBoard.getCurrentPlayer().getSymbol();
        let player = gameBoard.getCurrentPlayer().getName();
        
        if (_updateGameBoardArray(this)) {
            console.log(gameBoard.getCurrentPlayer().getName());
            this.textContent = gameBoard.getCurrentPlayer().getSymbol();
            gameBoard.changePlayer();
        }
        if (gameBoard.checkForWin(symbol)) {
            _updateWinnerDisplay(_capitalizeFirstLetter(player) + " Wins!");
            gameBoard.clearGameBoardArray();
            _restartScreenVisible();
        }
        else if (gameBoard.checkForTie() == 9) {
            _updateWinnerDisplay("Tie!");
            gameBoard.clearGameBoardArray();
            _restartScreenVisible();
        }
    }

    const _capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const _restartScreenVisible = () => {
        document.querySelector('#winning-message').style.display = "flex";
        document.querySelector('#restartButton').addEventListener('click', _restartButton);
    
    };

    function _restartButton() {
        gameBoard.clearGameBoardArray();
        _showForm();
        document.querySelector('#winning-message').style.display = "none";
    }

    const _updateWinnerDisplay = (result) => {
        document.querySelector('#win-text').textContent = result;
    };

    const _updateGameBoardArray = (event) => {
        // use regular expression to extract the "index" from the cells id
        let index = event.id.match(/\d+/)[0];
        let gameBoardRef = gameBoard.getGameBoardArray();
        
        // if cell isn't occupied then update gameBoardArray with players symbol
        if (!gameBoard.checkIfCellOccupied(index)) {
            gameBoardRef[Math.floor(index / 3)][index % 3] = gameBoard.getCurrentPlayer().getSymbol();
            return true;
        } else {
            console.log(gameBoardRef);
            return false;
        }
    };

    // Allow click event listener on game cells 
    const enableGameBoardInputs = () => {
        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', _addSymbol);
        });    
    };

    // Get player names from html form
    const getPlayerNames = () => {
        playerOneName = document.querySelector('#playerOneName').value;
        playerTwoName = document.querySelector('#playerTwoName').value;

        if (playerOneName == "") {
            playerOneName = "Player 1";
        } 
        if (playerTwoName == "") {
            playerTwoName = "PLayer 2";
        }
        _hideForm();
        return [playerOneName, playerTwoName];
    };

    // clear player names from html form
    const clearPlayerNames = () => {
        document.querySelector('#playerOneName').value = "";
        document.querySelector('#playerTwoName').value = "";  
    };

    const _hideForm = () => {
        document.querySelector('#player-form').style.display = "none";
    };

    const _showForm = () => {
        document.querySelector('#player-form').style.display = "block";
    };
    
    return{boardCreator, refreshBoard, enableGameBoardInputs, getPlayerNames, clearPlayerNames}

})();

displayController.boardCreator();
