// Griglia Campo Minato

/** ***************VARIABLES******************** */

// DOMElements
const gridDOMElement = document.querySelector(".grid");
const gameParamsDOMElement = document.querySelector(".game-params");
const btnStartDOMElement = document.getElementById("btn-start");
const selectDOMElement = document.getElementById("select");
const counterDOMElement = document.getElementById("counter");
const counterNumbersDOMElements = document.querySelectorAll(".counter-over");
const counterFlagsDOMElements = document.querySelectorAll(".counter-over.counter-flag ");
const rangeInputDOMElement = document.getElementById('points');
const minValueDisplayDOMElement = document.getElementById('min-value');
const maxValueDisplayDOMElement = document.getElementById('max-value');
const bombsChoseTitleDOMElement = document.getElementById('bombs-chosed');
const difficultyButtonsDOMElements = document.querySelectorAll('.btn-difficulty');
const smileImgDOMElemtn = document.getElementById('smile-img')
const resetDOMElements = document.querySelectorAll('.reset')

// Sound del gioco
const explosionSound = new Audio('./sound/bombs-explosion.mp3');
const clickSound = new Audio('./sound/click.wav');
const winSound = new Audio('./sound/win.mp3');
const gameLoseSound = new Audio('./sound/game-lose.mp3');
const gameSound = {
    explosionSound: () => {
        explosionSound.currentTime = 0;
        explosionSound.play();
    },
    click: () => {
        clickSound.currentTime = 0;
        clickSound.play();
    },
    gameLose: () => {
        gameLoseSound.currentTime = 0;
        gameLoseSound.play();
    },
};

// Oggetti con parametri del gioco
const gridParams = {};
const gameParams = {};


//----------------------------START GAME---------------------------------//

// Settiamo la difficolta del gioco
setGameDifficult();

// Settiamo i parametri iniziali del giocco
rangeInputDOMElement.addEventListener('input', updateRangeBombsValueViewer);

// Creare evento click per iniziare il gioco
btnStartDOMElement.addEventListener("click", startGame);

// Evento click sulla griglia
gridDOMElement.addEventListener('click', handleGridClick);

// Evento "contextmenu" sulla griglia per aggiungere Flag
gridDOMElement.addEventListener('contextmenu', handleContextMenu);

//----------------------------RESET GAME---------------------------------//

resetDOMElements.forEach(element => {
    element.addEventListener('click', resetGame)
})

//------------------------------ FUNZIONI--------------------------------------//

// Funzione principale per iniziare il gioco
function startGame() {

    configureGame();
    gameSound.click();

    gameParamsDOMElement.classList.remove('active');
    gridDOMElement.classList.add('active');

    console.log(gameParams)
};

// Configuriamo il gioco
function configureGame() {

    // Azzeriamo setInterval e setTimeout
    clearTimeout(gameParams.gameOverTimeout);
    clearInterval(gameParams.timer);

    // Settiamo i parametri del gioco e della griglia
    setGridParams();
    setGameParams();
    createGrid();
    setTimer();
    setFlagDisplay();
};

// Assegna i parametri della grid 
function setGridParams() {

    // Creamo la variabile levelGame
    let levelGame;
    if (gameParams.levelGame) {
        levelGame = gameParams.levelGame;
    } else {
        levelGame = 'Beginner';
    };

    console.log('level game:', levelGame)
    // Assegnamo la quantita minima delle celle che puo avere la griglia del gioco
    gridParams.minRange = 1;

    // Assegnamo il classe e la quantita massima delle celle in base al livelo del gioco scelto 
    if (levelGame == 'Expert') {
        gridParams.className = "cell cell-10"; // Classe css per dare lo stile alla cella
        gridParams.maxRange = 100; // Quantita massima delle celle che puo avere il campo del gioco
        gridParams.lineLength = 10; // Quantita delle celle in una linea della griglia
    } else if (levelGame == 'Middle') {
        gridParams.className = "cell cell-9";
        gridParams.maxRange = 81;
        gridParams.lineLength = 9;
    } else if (levelGame == 'Beginner') {
        gridParams.className = "cell cell-7";
        gridParams.maxRange = 49;
        gridParams.lineLength = 7;
    };
};

// Assegna i parametri di giocco
function setGameParams() {

    // Assegnamo il numero di flag 
    gameParams.flagCounter = Number(rangeInputDOMElement.value);

    // Assegnamo il numero delle bombe
    gameParams.bombsNumber = rangeInputDOMElement.value;

    // Creamo array con le bombe che saranno rapresentati dai numeri
    gameParams.bombsArray = getArrayOfRandomIntBetween(gridParams.minRange, gridParams.maxRange, gameParams.bombsNumber);

    // Aggiungiamo score counter
    gameParams.scoreCounter = 0;

    // Aggiungiamo lo stato del inizio gioco
    gameParams.isStartGame = true;

    // Aggiungiamo lo stato del gioco
    gameParams.isGameOver = false;

    // Aggiungiamo timer
    gameParams.timeCounter = 0;

    // Resetiamo il valore del isWin
    gameParams.IsWin = false;

    // Aggiungiamo array che contera le celle selezionati
    gameParams.cellsSelectedArray = [];

    // Aggiunto per gestire il timeout di "Game Over"
    gameParams.gameOverTimeout = null;

    // Aggiunto per gestire il timer
    gameParams.timer = null;
};

// Crea contenuto della grid
function createGrid() {

    // Funzione svuota il contenuto della nostra grid
    deleteContentDOMElement(gridDOMElement);

    // Cicliamo per creare celle del gioco
    for (let i = 0; i < gridParams.maxRange; i++) {
        // Il numero per assegnare id della cella
        const n = i + 1;
        // Creamo elemento html
        const html = `<div class="${gridParams.className}" id="${n}"></div>`;
        // Aggiungiamo elemento html nella griglia del gioco
        gridDOMElement.innerHTML += html;
    };

    // Recuperiamo tutte le celle appena create
    cellDOMElements = gridDOMElement.querySelectorAll(".cell");
};

// Set Timer
function setTimer() {

    // Cancelliamo  contenuto di Timer
    counterNumbersDOMElements.forEach(element => {
        deleteContentDOMElement(element);
    });

    gameParams.timer = setInterval(updateTimerDisplay, 1000);
};

// Set flag display
function setFlagDisplay() {

    // Cancelliamo  contenuto di flag display
    counterFlagsDOMElements.forEach(element => {
        deleteContentDOMElement(element);
    });
    // Aggiorniamo flag display
    updateDisplayCounterFlag();
};

// Funzione per gestire click sulla cella
function handleGridClick(event) {

    const target = event.target;
    
    // Verifica se il clic è su un pulsante di reset
    if (target.matches('.reset')) {
        resetGame();
        return;
    }

    if (gameParams.isStartGame) {
        // Elemento cliccato
        gameParams.currentCell = event.target;

        // Verifica se l'elemento cliccato è una cella
        if (gameParams.currentCell.classList.contains('cell')) {
            // Chiama la funzione checkCell solo se l'elemento cliccato è una cella
            checkCell();
        } else {
            console.log("Hai cliccato sul bordo della griglia.");
        };
    }
};

// Reset game
function resetGame() {

    // Svuotiamo il contenuto della nostra grid
    deleteContentDOMElement(gridDOMElement);

    // Nascondiamo nostra grid
    gridDOMElement.classList.remove('active');

    // Facciamo visibile menu iniziale
    gameParamsDOMElement.classList.add('active');

    // Azzeriamo setInterval e setTimeout
    clearTimeout(gameParams.gameOverTimeout);
    clearInterval(gameParams.timer);

    resetDisplays();

    // Cambiamo imagina di smile
    smileImgDOMElemtn.src = 'img/smile.png'
};

// Creamo la funzione che gestira tutta la logica del controllo della cella
function checkCell() {

    // Controlla la cella solo se il gioco non e ancora finito
    if (!gameParams.isGameOver && !gameParams.IsWin) {

        // Controliamo se Utente ha perso
        isGameOver();

        // Controlliamo il contenuto della cella se non e stata cliccata e non contiene bomba
        handleCellClick();

        // Controliamo se Utente ha vinto
        isGameWin();
    };
};

// Funzione controlla se hai perso
function isGameOver() {

    // Creamo la variabile currentCellID assegnando il valore id di currentCell
    const currentCellID = parseInt(gameParams.currentCell.id);

    // Se la cella contiene la bomba la partita e persa
    if (hasBomb(currentCellID, gameParams.bombsArray)) {

        // Richiamiamo la funzione gameLose
        gameLose(currentCellID);

        // Cancelliamo intervallo del timer precedente
        clearInterval(gameParams.timer);
    };
};

// Funzione controlla se hai vinto
function isGameWin() {

    // console.log("is game win start")
    // console.log(gameParams.scoreCounter, gridParams.maxRange, gameParams.bombsNumber)
    // console.log(gridParams.maxRange - gameParams.bombsNumber)
    // console.log(gameParams.scoreCounter === (gridParams.maxRange - gameParams.bombsNumber))

    // Se scoreCounter arriva il valore massimo possibile - partita vinta
    if (gameParams.scoreCounter === (gridParams.maxRange - gameParams.bombsNumber)) {

        // Cambiamo il volore di IsWin
        gameParams.IsWin = true;

        // Parte il suono winSound
        winSound.play();

        // Mostra il messaggio "You Win"
        showMessageYouWin();

        // Cancelliamo intervallo del timer precedente
        clearInterval(gameParams.timer);

        // Cambiamo imagina di smile
        smileImgDOMElemtn.src = 'img/glass.png'
    };
};

// Controlla se la cella ha la bomba
function hasBomb(number, bombsArray) {

    // Se array delle bombe contiene il numero restituira true
    if (bombsArray.includes(number)) {
        return true;
    };

    // Altrimenti ritorna false
    return false;
};

// Funzione che gestisce la logica se perdi
function gameLose(currentID) {

    // Parte suono della bomba che esplode
    gameSound.explosionSound();

    // Apriamo tutte le celle dove ci sono le bombe
    openAllBombsCell();

    // Aggiungiamo il bg rosso alla cella corrente con la bomba
    if (currentID !== null) {
        // Aggiungiamo class bg-red
        cellDOMElements[currentID - 1].classList.add("bg-red");

        // Rimuovi la classe 'cross' se presente
        if (cellDOMElements[currentID - 1].classList.contains("cross")) {
            cellDOMElements[currentID - 1].classList.remove("cross");
        }
    }

    // Impostiamo il valore di isGameOver a true
    gameParams.isGameOver = true;

    // Cambiamo imagina di smile
    smileImgDOMElemtn.src = 'img/dead.png'

    // Aggiungiamo il messagio di "Game Over" sullo schermo
    gameParams.gameOverTimeout = setTimeout(function () {
        showMessageGameOver();
        gameSound.gameLose();
    }, 1500);
};

// Controlla cella cliccata per prima volta e senza bomba
function handleCellClick() {

    // Creamo la variabile currentCellID assegnando il valore id di currentCell
    const currentCellID = parseInt(gameParams.currentCell.id);

    // Creamo la variabile con valore booleano per capire se ce la bomba o no dentro cella
    const hasCellBomb = hasBomb(currentCellID, gameParams.bombsArray);

    // Se la cella NON contiene la bomba
    if (!hasCellBomb) {

        // Se la cella e stata gia aperta - cancelliamo contenuto (il caso di chiusura della cella)
        if (gameParams.currentCell.classList.contains('selected')) {
            deleteContentDOMElement(gameParams.currentCell);
        };

        // Apertura/chiusura della cella
        openCell(gameParams.currentCell);

        // Nel caso in cui ce il flag - togliamolo, aggiorniamo il flag counter e flag display
        if (gameParams.currentCell.classList.contains('flagged')) {
            flagCell(gameParams.currentCell);
        };

        // Sound di click
        gameSound.click();

        // Aggiorniamo counter
        updateScoreCounter();

        // Restituisce il numero delle bombe all'intorno della cella cliccata
        getNumberOfBombsAroundCell(gameParams.currentCell, currentCellID, gridParams);
    };

    // console.log(gameParams)
    // console.log('cell selected', gameParams.cellsSelectedArray)
    // console.log('flag counter', gameParams.flagCounter)
    // console.log('score counter', gameParams.scoreCounter)
};

// Funzione apre la cella
function openCell(currentCell) {

    // Apriamo cella tramite classe selected
    currentCell.classList.toggle('selected');
};

// Funzione apre tutte le celle con le bombe 
function openAllBombsCell() {

    // Cicliamo Array con le bombe per aprire le celle
    for (let i = 0; i < gameParams.bombsArray.length; i++) {

        //Creamo la variabile per recuperare l'indice della cella dove e presente la bomba
        const indexBombsCellToOpen = gameParams.bombsArray[i] - 1;

        const cellToOpen = cellDOMElements[indexBombsCellToOpen];
        // Apriamo la cella corrente
        openCell(cellToOpen);

        // Aggiungiamo classi CSS alle celle con le bombe per aprirli
        cellToOpen.classList.add("contains-bomb");

        // Se la cella era con flag
        if(cellToOpen.classList.contains('flagged')) {
            
            // Togliamo flag
            cellToOpen.classList.toggle('flagged');

            // Aggiungiamo croccia
            cellToOpen.classList.add("cross");
   
            // Togliamo bg red se ce
            if(cellToOpen.classList.contains('bg-red')) {
                cellToOpen.classList.toggle('bg-red');
            }
        }
    };
};

// Funzione per aggiungere o rimuovere un flag dalla cella corrente
function flagCell() {
    if (!gameParams.isGameOver && !gameParams.isWin) {

        // Se la cella e stata gia selezionata cancelliamo contenuto
        if (gameParams.currentCell.classList.contains('selected')) {
            deleteContentDOMElement(gameParams.currentCell);
        };

        // Toggle del flag sulla cella
        toggleFlag();

        // Aggiorniamo flag dispay
        updateDisplayCounterFlag();
    };
};

// Toggle flag per elemento cliccato
function toggleFlag() {

    const hasFlag = gameParams.currentCell.classList.contains('flagged');

    if (gameParams.flagCounter > 0) {
        // Aggiorniamo counter
        gameParams.flagCounter += hasFlag ? 1 : -1;

        // +/- classe 'flagged'
        gameParams.currentCell.classList.toggle('flagged');
    } else if (gameParams.flagCounter == 0 && hasFlag) {
        // Aggiorniamo counter
        gameParams.flagCounter++;

        // +/- classe 'flagged'
        gameParams.currentCell.classList.toggle('flagged');
    }
};

// Funzione aggiorna il counter-flag
function updateDisplayCounterFlag() {

    // Creamo array con 3 elementi del counter
    const arrayOfCounterFlagsElements = Array.from(counterFlagsDOMElements);

    // Invertiamo ordine dell'array
    const reversedCounterFlagArray = arrayOfCounterFlagsElements.reverse();

    // Creamo array con i numeri del flagCounter con reverse 
    let arrayOfCounterFlagsNumbersReversed = splitNumberToReverseArray(gameParams.flagCounter);

    // Cicliamo per aggiornare 3 span di flag display
    for (let i = 0; i < 3; i++) {
        reversedCounterFlagArray[i].innerHTML = arrayOfCounterFlagsNumbersReversed[i] ?? '';
    }
    
    // console.log(gameParams.flagCounter, arrayOfCounterFlagsNumbersReversed);
};

// Funzione aggiorna il counter
function updateScoreCounter() {

    // Creamo la variabile currentCellID assegnando il valore id di currentCell
    const currentCellID = parseInt(gameParams.currentCell.id);
    const wasSelected = gameParams.cellsSelectedArray.includes(currentCellID);
    const hasFlag = gameParams.currentCell.classList.contains('flagged');

    // Se la cella cliccata non e presente nel  cellsSelectedArray - aumentiamo counter e aggiungiamola dentro  cellsSelectedArray
    if (!wasSelected && !hasFlag) {

        // Aumentiamo counter
        gameParams.scoreCounter++;

        // Aggiungiamo la cella cliccata dentro cellsSelectedArray
        gameParams.cellsSelectedArray.push(currentCellID);
    } else if (wasSelected) {

        // Diminuiamo di 1 il counter
        gameParams.scoreCounter--;

        // Filtriamo l'array rimuovendo currentCellID
        gameParams.cellsSelectedArray = gameParams.cellsSelectedArray.filter(id => id !== currentCellID);
    };
};

// Logica per assegnazione dei numeri con le bombe presenti all'intorno 
function getNumberOfBombsAroundCell(currentCellElement, currentNumber, gridObject) {

    // Creamo Array che avra i numeri delle celle intorno che contengono la bomba
    const arrayNumberOfBombsAroundCell = [];

    /***
     * 
     *   Per trovare il numero delle bombe che circondano la cella cliccata 
     *   faremmo un ciclo dove controlliamo se ogni singola cella in vicinanza contiene la bomba.  
     *   Nel caso positivo - aggiungiamo il numero di questa cella dentro arrayNumberOfBombsAroundCell.
     *   Alla fine restituiamo il numero della bombe che circondano tramite lunghezza dell'arrayNumberOfBombsAroundCell.
     * 
    */

    // Per ciclo 4 variabile left, midle, right e n. Le prime 3 fanno riferimento alle celle da controllare con ogni interazione del ciclo.
    // Invece n - il numero di cilci da fare.

    // Dati di partenza:
    let left = currentNumber - gridObject.lineLength - 1;
    let middle = currentNumber - gridObject.lineLength;
    let right = currentNumber - gridObject.lineLength + 1;
    let n = 3; // Il numero cicli di base.

    /**
     * ------- ESEMPIO in una griglia 10 x 10 clicciamo la cella con numero 12:
     *                  
     *          (1) (2) (3) .... 10
     *          11 [12] 13 .... 20
     *          21  22  23 .... 30
     *          ...............100
     *      Primo ciclo  
     *      i = 0   left = 1; midle = 2; right = 3;  
     *      Controliamo con funzione hasBomb() se le celle che corispondono a left, midle e right contengono la bomba. 
     *          
     *      Con i cicli successivi left, right e midle prendono i valori della prossima riga, esempio:
     *      i = 1   left = 11; midle = 12; right = 13; 
     *      
     *      Attenzione!!! La logica di assegnazione del left, right, midle e n varia in base a dove si trova cella cliccata (prima o ultima linea, bordo sinistro ecc)
     */

    // - Se si parte dalla prima linea le variabili prendono seguenti valori:
    if (middle < 1) {
        left = currentNumber - 1;
        middle = currentNumber;
        right = currentNumber + 1;
        n = 2;
    };

    // - Se si parte dalla ultima linea la variabile n prende seguente valore:
    if (middle + gridObject.lineLength * 2 > gridObject.maxRange) {
        n = 2;
    };

    // - Se si parte dalla prima colona di sinistra la variabile left prende seguente valore:
    if ((left % gridObject.lineLength) === 0) {
        left = 0;
    };

    // - Se si parte dalla collona di destra la variabile right prende seguente valore:
    if (currentNumber % gridObject.lineLength === 0) {
        right = 0;
    };

    // - Ciclo per stabilire quantità di bombe all'intorno di currenteNumber
    for (let i = 0; i < n; i++) {
        // consolek.log("ciclo " + i, "left", left, "middle", middle, "right", right);

        if (hasBomb(left, gameParams.bombsArray)) {
            arrayNumberOfBombsAroundCell.push(left)
        };

        if (hasBomb(middle, gameParams.bombsArray)) {
            arrayNumberOfBombsAroundCell.push(middle)
        };

        if (hasBomb(right, gameParams.bombsArray)) {
            arrayNumberOfBombsAroundCell.push(right)
        };

        if (i < n - 1) {
            if (left > 0) {
                left += gridParams.lineLength;
            };

            middle += gridParams.lineLength;
            if (right > 0) {
                right += gridParams.lineLength;
            };
        };
    };

    printNumberBombs(arrayNumberOfBombsAroundCell, currentCellElement);
};

// Stampa numero delle bombe
function printNumberBombs(array, currentCell) {

    // Inserimento del numero delle bombe che ci sono all'intorno
    let arrayLength = array.length;

    // Creamo la variabile con valore booleano per capire se la cella e gia stata cliccata in passato
    const isCellClicked = gameParams.currentCell.classList.contains('selected');

    if (isCellClicked) {
        // Stampa il numero delle bombe
        if (arrayLength === 0) {
            currentCell.innerHTML = "";
        } else {
            currentCell.innerHTML = arrayLength;
        };

        // Scelta del colore in base al numero da stampare
        if (arrayLength === 1) {
            currentCell.classList.add("f-green");
        } else if (arrayLength === 2) {
            currentCell.classList.add("f-blue");
        } else {
            currentCell.classList.add("f-red");
        };
    };
};

// Show messagio GameOver
function showMessageGameOver() {

    gridDOMElement.innerHTML += `
        <div class="cover">
            <div class="message game-over">
                <h4 class="result-game">GAME OVER</h4>
                <div class="statistics">
                    <div> Score: ${gameParams.scoreCounter} </div>
                    <div> Time : ${gameParams.timeCounter} sec</div>
                </div>
                <div class="btn-group">
                    <button class="btn btn-start reset">
                        New game
                    </button>
                </div>
            </div>
        </div>
    `;
};

// Show messagio YouWin
function showMessageYouWin() {

    gridDOMElement.innerHTML += `
        <div class="cover">
            <div class="message win">
                <h4 class="result-game">YOU WIN</h4>
                <div class="statistics">
                    <div> Score: ${gameParams.scoreCounter} </div>
                    <div> Time : ${gameParams.timeCounter} sec</div>
                </div>
                <div class="btn-group">
                    <button class="btn btn-start reset">
                        New game
                    </button>
                </div>
            </div>
        </div>
    `;
};

// Funzione gestisce l'evento "contextmenu"
function handleContextMenu(event) {
    // console.log(gameParams)
    // Impedisci il comportamento predefinito (apertura del menu contestuale)
    event.preventDefault();

    // Elemento cliccato
    gameParams.currentCell = event.target;

    // Verifica se l'elemento cliccato è una cella
    if (gameParams.currentCell.classList.contains('cell')) {

        // Aggiungiamo soundClick
        gameSound.click();

        // Aggiungiamo Flag
        flagCell(gameParams.currentCell);

        // Se prima di cliccare è stato gia selezionato
        if (gameParams.currentCell.classList.contains('selected')) {
            // Aggiorniamo counter
            updateScoreCounter();

            toggleClassSelected();
        };
    };

    // console.log('cell selected', gameParams.cellsSelectedArray)
    // console.log('flag counter', gameParams.flagCounter)
    // console.log('score counter', gameParams.scoreCounter)
};

// Aggiorna il timer
function updateTimerDisplay() {

    // Aumentiamo timer di 1 
    gameParams.timeCounter++;

    // Se sono passati 10 secondi, termina il gioco
    if (gameParams.timeCounter >= 1000) {

        for (let i = 0; i < gameParams.bombsArray.length; i++) {
            // Creamo la variabile indexCellToChange per recuperare l'indice della cella dove e presente la bomba
            const indexCellToChange = gameParams.bombsArray[i] - 1;
            // Aggiungiamo bg rosso alla cella con bomba
            cellDOMElements[indexCellToChange].classList.add("bg-red");
        };

        // Richiamiamo la funzione gameLose
        gameLose(null);
        // Cancelliamo intervallo del timer precedente
        clearInterval(gameParams.timer);

        return;
    }

    // Creamo array con 3 elementi del counter
    const arrayOfCounterNumbersElements = Array.from(counterNumbersDOMElements);

    // Invertiamo ordine dell'array
    const reversedCounterNumbersElementsArray = arrayOfCounterNumbersElements.reverse();

    // Creamo array con i numeri del timeCounter con reverse 
    let arrayTimeNumbersReversed = splitNumberToReverseArray(gameParams.timeCounter);

    // Cicliamo il nostro array e inseriamo in ogni span la cifra corrispondente
    arrayTimeNumbersReversed.forEach((element, index) => {
        reversedCounterNumbersElementsArray[index].innerHTML = element ?? '';
    });
};

// Toggle class "selected" per elemento cliccato
function toggleClassSelected() {
    gameParams.currentCell.classList.toggle('selected');
};

// Svuota il contenuto del DOMElment
function deleteContentDOMElement(DOMElement) {

    // Azzeriamo contenuto del DOMElement
    DOMElement.innerHTML = "";
};

// Crea un array dei numeri random tra minRange e maxRange con lunghezza massima number
function getArrayOfRandomIntBetween(minRange, maxRange, number) {

    // Creamo array per i numeri
    const numbersArray = [];

    // Cicliamo finche la condizione non avra false
    while (numbersArray.length < number) {
        // Generiamo un numero random tra minRange e maxRange
        const randomNumber = getRandomIntInclusive(minRange, maxRange);

        // SE n non è presente nell'array fare push di n
        if (!numbersArray.includes(randomNumber)) {
            // pushare il numero nell'array
            numbersArray.push(randomNumber);
        };
    };

    // Restituiamo array con i numeri random
    return numbersArray;
};

// Crea il numero random nel range indicato
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
};

// Trasforma un numero in un array di numeri con reverse
function splitNumberToReverseArray(number) {

    const digits = number.toString().split('').reverse().map(Number);

    return digits;
};

// Funzione aggiorna i valori di Min/Max del range bombs
function updateRangeValues() {

    // Aggiorniamo i valori del Min/Max in base alla difficolta
    let Min, Max;

    // Assegnamo i valori di Min e Max in base a difficolta
    if (gameParams.levelGame == 'Expert') {
        Min = 26;
        Max = 36;
    } else if (gameParams.levelGame == 'Middle') {
        Min = 16;
        Max = 26;
    } else if (gameParams.levelGame == 'Beginner') {
        Min = 1;
        Max = 16;
    };

    // Aggiorniamo i valori Min e Max del range
    rangeInputDOMElement.min = Min;
    rangeInputDOMElement.max = Max;
    rangeInputDOMElement.value = Max;

    // console.log(Min, Max, rangeInputDOMElement.value)

    // Stampiamo i nuovi valori di Min/Max del range bombs
    minValueDisplayDOMElement.textContent = 'Min: ' + rangeInputDOMElement.min;
    maxValueDisplayDOMElement.textContent = 'Max: ' + rangeInputDOMElement.max;
};

// Funzione aggiorna il valore delle bombe scelte
function updateRangeBombsValueViewer() {

    // Stampiamo il nuovo valore delle bombe
    bombsChoseTitleDOMElement.textContent = rangeInputDOMElement.value;

    // console.log("gameParams.bombsNumber", rangeInputDOMElement.value)
};

// Funzione imposta la difficolta del gioco
function setGameDifficult() {

    // Iterare su ciascun elemento usando forEach
    difficultyButtonsDOMElements.forEach(button => {

        button.addEventListener("click", function (event) {

            // Togliamo classe active da tutti btn
            difficultyButtonsDOMElements.forEach(function (btn) {
                btn.classList.remove('active');
            });

            // Aggiungi la classe "active" solo al pulsante cliccato
            this.classList.add('active');

            // Recupera il valore dell'attributo data-difficulty dall'elemento cliccato
            const difficulty = event.target.getAttribute('data-difficulty');

            // console.log('Difficoltà selezionata:', difficulty);

            gameParams.levelGame = difficulty;

            // console.log(gameParams.levelGame)

            updateRangeValues();
            updateRangeBombsValueViewer();
        });

    });
};

// Reset timer displays
function resetDisplays() {

    // Cicliamo il nostro array e inseriamo in ogni span '' per svuotare display
    counterNumbersDOMElements.forEach(element => {
        element.innerHTML = '';
    });
};

