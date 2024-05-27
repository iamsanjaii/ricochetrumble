const gameboard = document.querySelector('#gameboard');
const infoDisplay = document.querySelector('#info');
const playerDisp = document.querySelector("#player")
const width = 8;
let playerGo = 'black';
playerDisp.textContent = "Player 1" 
const Ricochet = '<div class= "piece" id="ricochet"><object data="Pieces/ricochet.svg" width="30" height="30"></div>'
const Semiricochet = '<div class= "piece" id="semiricochet"><object data="Pieces/semiricochet.svg" width="30" height="30"></div>'
const tank = '<div class= "piece" id="tank"><object data="Pieces/tank.svg" width="30" height="30"></div>'
const titan = '<div class= "piece" id="titan"><object data="Pieces/titan.svg" width="30" height="30"></div>'
const canon = '<div class= "piece" id="canon"><object data="Pieces/canon.svg" width="30" height="30"></div>'

const startPieces = [
"", "", "", canon, titan, "", "", "",
"", "", "", Semiricochet, tank, Ricochet, "", "",
"","","","","","","","",
"","","","","","","","",
"","","","","","","","",
"","","","","","","","",
"","","",tank, Semiricochet, Ricochet, "", "",
"","",canon, titan, "","","",""
]

function createBoard(){
    startPieces.forEach((startPiece, i)=>{
        const square = document.createElement('div');
        square.classList.add('square')
        square.innerHTML = startPiece
        square.setAttribute('square-id', i)
        const row = Math.floor((63-i)/8)+1
        square.firstChild?.firstChild.setAttribute('draggable', true)
       if (startPiece !== "") {
            if (i <=15) {
              square.firstChild.firstChild.classList.add('black')
            } else if (i >= 48) {
                square.firstChild.firstChild.classList.add('white')
            }
          }
        gameboard.append(square)
      
    })
}

createBoard();
let startPositionId 
let draggedElementId
const allSquare = document.querySelectorAll("#gameboard .square")

allSquare.forEach(square =>{
    square.addEventListener('dragstart', dragStart);
    square.addEventListener('dragover', dragOver);
    square.addEventListener('drop', dragDrop);
})

function dragStart(e){
    startPositionId = e.target.parentNode.getAttribute('square-id');
//    startPositionId= e.target.parentNode.parentNode
  
   draggedElementId = e.target
//  
}

function dragOver(e){
    e.preventDefault();
}
function dragDrop(e){
    e.stopPropagation();
    
    
    const correctGo = draggedElementId.firstChild.classList.contains(playerGo)
    const taken = e.target.classList.contains('piece')
    const opponentGo = playerGo === "white"? "black" : "white"
    const valid = checkIfValid(e.target);
    const takenByOpponent = e.target.firstChild ?.classList.contains(opponentGo)
     
    if(correctGo){
        if(takenByOpponent && valid){
            e.target.parentNode.append(draggedElementId)
            e.target.remove();
            changePlayer();
            return

        }
        if(taken && !takenByOpponent){
            alert("You cant't go there")
            // setTimeout(()=>alert(""), 2000)
             return
        }
        if(valid){
            e.target.append(draggedElementId);
            changePlayer();
            return

        }
    }
    // console.log(e.target.parentNode)
    // e.target.parentNode.append(draggedElementId);
    // e.target.remove();


}


function changePlayer(){
    if (playerGo === "black"){
        playerGo = "white"
        playerDisp.textContent = "Player 2"
        reverseIds();
    }else{
        revertIds();
        playerGo ="black"
        playerDisp.textContent = "Player 1"
    }
}

function reverseIds(){
    const allSquare = document.querySelectorAll(".square")
    allSquare.forEach((square, i) => square.setAttribute('square-id', ((width * width -1)-i)))
}

function revertIds (){
    const allSquare = document.querySelectorAll(".square")
    allSquare.forEach((square, i) => square.setAttribute('square-id', i))
}
function checkIfValid(target){
    const piece = draggedElementId.id;

    const targetID = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'));
    
    const startID = Number(startPositionId)
    console.log(startID, targetID)
    console.log('Drag id', piece)

    switch(piece){
        case 'titan':
            if(startID + 1 === targetID || startID - 1 === targetID){
                return true
            }

        case 'ricochet':
            if(startID + 1 === targetID || startID + width === targetID || startID + width +1 === targetID ||
                startID - 1 === targetID | startID - width === targetID || startID + width -1 === targetID || 
                startID - width +1 === targetID ||startID - width +1 === targetID 
            ){
                return true;
            }
        case 'semiricohet':
            if(startID + 1 === targetID || startID + width === targetID || startID + width +1 === targetID ||
                startID - 1 === targetID | startID - width === targetID || startID + width -1 === targetID || 
                startID - width +1 === targetID ||startID - width +1 === targetID 
            ){
                return true;
            }
        case 'tank':
            if(startID + 1 === targetID || startID + width === targetID || startID + width +1 === targetID ||
                startID - 1 === targetID | startID - width === targetID || startID + width -1 === targetID || 
                startID - width +1 === targetID ||startID - width +1 === targetID 
            ){
                return true;
            }
        case 'canon':
            if(startID + 1 === targetID || startID - 1 === targetID){
                return true
            }
        

    }
   
}