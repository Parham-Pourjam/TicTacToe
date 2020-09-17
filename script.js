// Factory function for player creation
const Player = (name, isTurn, symbol) => {
    const getName = () => name;
    const getIsTurn = () => isTurn;
    const getSymbol = () => symbol;

    const switchTurn = () => {
        if (isTurn) {
            isTurn = false;
        } else {
            isTurn = true;
        }
    };
    
    return {getName, getIsTurn, getSymbol, switchTurn}
};

// Module pattern for game logic
const gameBoard = (() => {
    // Use multi-dimesnional array to store state of gameboard (initially 0, dynamically changed to X or O)
    let _gameBoardArray = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; 

    let _player1; 
    let _player2; 
    let _currentPlayer;

    const setPlayers = (name1, name2) => {
        _player1 = Player(name1, true, "X");
        _player2 = Player(name2, false, "O");
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
        //let playerChoices = [0, 1];
        //let playerSelection = playerChoices[Math.floor(Math.random() * playerChoices.length)];
        
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

    
    //setPlayers("Parham");

    return {clearGameBoardArray, checkForWin, checkForTie, setPlayers, changePlayer, getCurrentPlayer, getGameBoardArray, checkIfCellOccupied, gameStart}
})();

// Module pattern for display control
const displayController = (() => {
    const gameContainer = document.querySelector('#game-container');
    
    const boardCreator = () => {
        for (let i = 0; i < 9; i++) {
            //let gridSquare = document.createElement(`#grid-square-${i}`);
            let gridSquare = document.createElement("button");
            gridSquare.id = `cell-${i}`;
            gridSquare.classList.add("cell");
            //gridSquare.textContent = "X";
            
            
            //gridSquare.addEventListener('click', addSymbol);
            
            gameContainer.appendChild(gridSquare);
        }
        //gameBoard.gameStart();
    };

    // clear board after win or tie
    const refreshBoard = () => {
        const children = gameContainer.children;
        const childrenArray = Array.from(children);
        childrenArray.forEach(item => {
            item.textContent = "";
        });
    };

    function addSymbol() {
        //this.textContent = gameBoard.getCurrentPlayer().getSymbol();
        //gameBoard.changePlayer();
        let symbol = gameBoard.getCurrentPlayer().getSymbol();
        let player = gameBoard.getCurrentPlayer().getName();
        
        if (updateGameBoardArray(this)) {
            console.log(gameBoard.getCurrentPlayer().getName());
            this.textContent = gameBoard.getCurrentPlayer().getSymbol();
            gameBoard.changePlayer();
            //console.log(gameBoard.getCurrentPlayer().getName());
        }
        if (gameBoard.checkForWin(symbol)) {
            //alert(player + " won");
            updateWinnerDisplay(player + " won");
            gameBoard.clearGameBoardArray();
            showForm();
        }
        else if (gameBoard.checkForTie() == 9) {
            alert("Tied");
            gameBoard.clearGameBoardArray();
            showForm();
        }
        console.log(gameBoard.getCurrentPlayer().getName());
    }

    const updateWinnerDisplay = (result) => {
        document.querySelector('#winner-display').textContent = result;
    };

    const updateGameBoardArray = (event) => {
        // use regular expression to extract the "index" from the cells id
        let index = event.id.match(/\d+/)[0];
        let gameBoardRef = gameBoard.getGameBoardArray();
        if (!gameBoard.checkIfCellOccupied(index)) {
            gameBoardRef[Math.floor(index / 3)][index % 3] = gameBoard.getCurrentPlayer().getSymbol();
            console.log(gameBoardRef);
            return true;
        } else {
            console.log(gameBoardRef);
            return false;
        }
        //let gameBoardRef = gameBoard.getGameBoardArray();
        //gameBoardRef[Math.floor(index / 3)][index % 3] = gameBoard.getCurrentPlayer().getSymbol();
        
    };

    // Allow click event listener on game cells 
    const enableGameBoardInputs = () => {
        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', addSymbol);
        });    
    };

    // Get player names from html form
    const getPlayerNames = () => {
        playerOneName = document.querySelector('#playerOneName').value;
        playerTwoName = document.querySelector('#playerTwoName').value;

        if (playerOneName == "") {
            playerOneName = "No Name1";
        } 
        if (playerTwoName == "") {
            playerTwoName = "No Name2";
        }
        hideForm();
        return [playerOneName, playerTwoName];
    };

    // clear player names from html form
    const clearPlayerNames = () => {
        document.querySelector('#playerOneName').value = "";
        document.querySelector('#playerTwoName').value = "";  
    };

    const hideForm = () => {
        document.querySelector('#player-form').style.display = "none";
    };

    const showForm = () => {
        document.querySelector('#player-form').style.display = "block";
    };
    
    return{boardCreator, refreshBoard, enableGameBoardInputs, getPlayerNames, clearPlayerNames}

})();


displayController.boardCreator();
