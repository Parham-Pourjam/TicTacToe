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

    const setPlayers = (name) => {
        _player1 = Player(name, true, "X");
        _player2 = Player("Computer", false, "O");
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

    const gameStart = () => {
        let playerChoices = [0, 1];
        let playerSelection = playerChoices[Math.floor(Math.random() * playerChoices.length)];
        console.log(playerSelection);
        changePlayer();
    };

    const getGameBoardArray = () => (_gameBoardArray);

    const getCurrentPlayer = () => (_currentPlayer);

    setPlayers("Parham");

    return {setPlayers, changePlayer, getCurrentPlayer, getGameBoardArray, checkIfCellOccupied, gameStart}
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
            
            
            gridSquare.addEventListener('click', addSymbol);
            
            gameContainer.appendChild(gridSquare);
        }
        gameBoard.gameStart();
    };

    function addSymbol() {
        //this.textContent = gameBoard.getCurrentPlayer().getSymbol();
        //gameBoard.changePlayer();
        
        if (updateGameBoardArray(this)) {
            console.log(gameBoard.getCurrentPlayer().getName());
            this.textContent = gameBoard.getCurrentPlayer().getSymbol();
            gameBoard.changePlayer();
            //console.log(gameBoard.getCurrentPlayer().getName());
        }
        console.log(gameBoard.getCurrentPlayer().getName());
    }

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
    
    return{boardCreator}

})();


displayController.boardCreator();
