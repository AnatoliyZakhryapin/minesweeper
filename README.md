# Griglia Campo Minato

- Creare il contenuto html statico
    - Creare il buttone e metterlo nel header
    - Creare il container con classe "grid"
        - dentro grid creare la griglia 10 * 10 assegnando classe "cell" ad ogni elemento 

- Creare il contenuto html tramite js
    - Creare funzioni
        - funzione deleteContentDOMElement(DOMElement)
        - funzione creaContentDOMElement(numberElement, classElement, DOMElement)
        - funzione valueSelect(selectDOMElement)
        - funzione onCellClick()
    - Dichiarare la variabile "gridDOMElement" per recuperare il nostro DOM dove veranno inseriti le celle
    - Dichiarare la variabile "btnStartDOMElement" per recuperrare il nostro buttone
    - Dichiarare la variabile "selectDOMElement"
    - Dichiarare la variabile "numberElement ed assegnare il valore tramite funzione valueSelect
    - Creare evento click sul btnStartDOMElement   
        - Chiamare la funzione "deleteContentDOMElement" per svuotare il nostro contenuto con ogni 
        - Dichiarare la variabile "numberElement ed assegnare il valore tramite funzione valueSelect
        - Creare la variabile className per poter uttilizare la funzione creaContentDOMElement. Il suo valore dipende dal valore del numberElement
        - Chiamare la funzione "creaContentDOMElement"
        - Dichiarare la variabile "cellDOMElement" per recuperare tutte le celle
        - Creare il ciclo for per aggiungere evento su ogni elemento del dom
            - Creare la variabile currentCellElement per sapere quale elemento è stato selezionato
            - Chiamare l'evento click per currentCell e assegnare la funzione "onCellClick"