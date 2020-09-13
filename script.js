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
    let currentPlayer;

    const setPlayers = (name) => {
        _player1 = Player(name, true, "X");
        _player2 = Player("Computer", false, "O");
    }

    const changePlayer = () => {
        if (currentPlayer == _player1) {
            currentPlayer = _player2;
        } else {
            currentPlayer = _player1;
        }
    };

    const getCurrentPlayer = () => (currentPlayer);

    setPlayers("Parham");

    return {setPlayers, changePlayer, getCurrentPlayer}
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
    };

    function addSymbol() {
        gameBoard.changePlayer();
        console.log(gameBoard.getCurrentPlayer().getName());
        this.textContent = gameBoard.getCurrentPlayer().getSymbol();
        //gameBoard.changePlayer();
    }
    
    return{boardCreator}

})();


displayController.boardCreator();
