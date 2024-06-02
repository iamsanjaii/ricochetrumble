const gameboard = document.querySelector('#gameboard');
const infoDisplay = document.querySelector('#info');
const playerDisp = document.querySelector("#player");
const player1TimerDisplay = document.querySelector('#player1-timer');
const player2TimerDisplay = document.querySelector('#player2-timer');
const width = 8;
let playerGo = 'black';
let selectedPiece = null;
let startPositionId = null;
let player1Time = 120;
let player2Time = 120;
let player1Interval;
let player2Interval;
playerDisp.textContent = "Player 1";
const Ricochet = '<div class="piece" id="ricochet"><object data="Pieces/ricochet.svg" width="30" height="30"></object></div>';
const Ricochetw = '<div class="piece" id="ricochet"><object data="Pieces/ricochetw.svg" width="30" height="30"></object></div>';
const Semiricochetw = '<div class="piece" id="semiricochet"><object data="Pieces/semiricochetw.svg" width="30" height="30"></object></div>';
const Semiricochet = '<div class="piece" id="semiricochet"><object data="Pieces/semiricochet.svg" width="30" height="30"></object></div>';
const tankw = '<div class="piece" id="tank"><object data="Pieces/tankw.svg" width="30" height="30"></object></div>';
const tank = '<div class="piece" id="tank"><object data="Pieces/tank.svg" width="30" height="30"></object></div>';
const titanw = '<div class="piece" id="titan"><object data="Pieces/titanw.svg" width="30" height="30"></object></div>';
const titan = '<div class="piece" id="titan"><object data="Pieces/titan.svg" width="30" height="30"></object></div>';
const canon = '<div class="piece" id="canon"><object data="Pieces/canon.svg" width="30" height="30"></object></div>';
const canonw = '<div class="piece" id="canon"><object data="Pieces/canonwhite.svg" width="30" height="30"></object></div>';

const startPieces = [
    "", "", canon,"", titan, "", "", "",
    "", "", "", Semiricochet, tank, Ricochet, "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", tankw, Semiricochetw, Ricochetw, "", "",
    "", "", canonw, titanw, "", "", "", ""
];

function createBoard() {
    startPieces.forEach((startPiece, i) => {
        const square = document.createElement('div');
        square.classList.add('square');
        square.innerHTML = startPiece;
        square.setAttribute('square-id', i);
        const row = Math.floor((63 - i) / 8) + 1;
        if (startPiece !== "") {
            square.firstChild.setAttribute('draggable', false);
            if (i <= 15) {
                square.firstChild.classList.add('black');
            } else if (i >= 48) {
                square.firstChild.classList.add('white');
            }
        }
        gameboard.append(square);
    });
}

createBoard();

const allSquares = document.querySelectorAll("#gameboard .square");

allSquares.forEach(square => {
    square.addEventListener('click', handleClick);
});

function handleClick(e) {
  ClicKmusic();
    const clickedSquare = e.currentTarget;
    const squareId = clickedSquare.getAttribute('square-id');

    if (selectedPiece) {
        clearHighlights();
        const validMove = checkIfValid(clickedSquare);
        if (validMove) {
            movePiece(clickedSquare);
           
            changePlayer();
        }
        selectedPiece = null;
        startPositionId = null;
    } else if (clickedSquare.firstChild && clickedSquare.firstChild.classList.contains(playerGo)) {
        selectedPiece = clickedSquare.firstChild;
        startPositionId = squareId;
        highlightMoves(startPositionId, selectedPiece.id);
    }
}

// function movePiece(targetSquare) {
//     if (targetSquare.firstChild) {
//         targetSquare.firstChild.remove();
//     }
//     targetSquare.appendChild(selectedPiece);
// }
function movePiece(targetSquare) {
    if (targetSquare.firstChild) {
        targetSquare.firstChild.remove();
    }
    targetSquare.appendChild(selectedPiece);
    fireBullet(targetSquare);
}


function changePlayer() {
    if (playerGo === "black") {
        playerGo = "white";
        playerDisp.textContent = "Player 2";
        stopTimer(player1Interval);
        startTimer('player2');
        reverseIds();
    } else {
        revertIds();
        playerGo = "black";
        playerDisp.textContent = "Player 1";
        stopTimer(player2Interval);
        startTimer('player1');
    }
}

function reverseIds() {
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square, i) => square.setAttribute('square-id', ((width * width - 1) - i)));
}

function revertIds() {
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square, i) => square.setAttribute('square-id', i));
}

function checkIfValid(target) {
    const piece = selectedPiece.id;
    const targetID = Number(target.getAttribute('square-id'));
    const startID = Number(startPositionId);

    switch (piece) {
        case 'titan':
            if (startID + 1 === targetID || startID - 1 === targetID) {
                return true;
            }
            break;
        case 'ricochet':
        case 'semiricochet':
        case 'tank':
            if (startID + 1 === targetID || startID + width === targetID || startID + width + 1 === targetID ||
                startID - 1 === targetID || startID - width === targetID || startID + width - 1 === targetID ||
                startID - width + 1 === targetID || startID - width - 1 === targetID) {
                return true;
            }
            break;
        case 'canon':
            if (startID + 1 === targetID || startID - 1 === targetID) {
                return true;
            }
            break;
        default:
            return false;
    }
    return false;
}

function highlightMoves(startID, piece) {
    const possibleMoves = getPossibleMoves(startID, piece);
    possibleMoves.forEach(move => {
        const targetSquare = document.querySelector(`[square-id="${move}"]`);
        if (targetSquare) {
            targetSquare.classList.add('highlight');
        }
    });
}

function clearHighlights() {
    const highlightedSquares = document.querySelectorAll('.highlight');
    highlightedSquares.forEach(square => {
        square.classList.remove('highlight');
    });
}

function getPossibleMoves(startID, piece) {
    let moves = [];
    startID = Number(startID);

    switch (piece) {
        case 'titan':
            moves = [startID + 1, startID - 1];
            break;
        case 'ricochet':
        case 'semiricochet':
        case 'tank':
            moves = [startID + 1, startID + width, startID + width + 1,
                     startID - 1, startID - width, startID + width - 1,
                     startID - width + 1, startID - width - 1];
            break;
        case 'canon':
            moves = [startID + 1, startID - 1];
            break;
    }

    return moves.filter(move => move >= 0 && move < width * width);
}
function startTimer(player) {
  if (player === 'player1') {
    player1Interval = setInterval(() => {
        var minutes = Math.floor(player1Time/60);
        var seconds = player1Time % 60;
      
        
      player1TimerDisplay.textContent =  "00:0"+minutes+":"+seconds;
      if(seconds<10){

        seconds = "0"+seconds
    }

    player1Time--;
      if (player1Time <= 0) {
       
        clearInterval(player1Interval);
        clearInterval(player2Interval);
        alert("Player 2 is the Winner", Win());
        
      }
    }, 1000);
  } else {
    player2Interval = setInterval(() => {
        var minutes2 = Math.floor(player2Time/60);
        var seconds2 = player2Time % 60;
      player2Time--;
      player2TimerDisplay.textContent = "00:0"+minutes2+":"+seconds2;
      if(seconds2<10){

        seconds2 = "0"+seconds2
    }
      
      if (player2Time <= 0) {
        Win();
        clearInterval(player2Interval);
        clearInterval(player1Interval);
        alert("Player 1 is the Winner!!");
       
      }
    }, 1000);
  }
}

function stopTimer(timer) {
  clearInterval(timer);
}
// document.getElementById('playmusic').addEventListener('click', ClicKmusic)

function ClicKmusic(){
var music = new Audio("click.wav")
  music.play();
 
}
function Win(){
  var win = new Audio("win.wav")
    win.play();
   
  }

startTimer('player1');


function fireBullet(targetSquare) {
  var target = document.getElementById('canon').parentNode;
  // canonPos = Number(document.getElementById('canon').parentNode.getAttribute('square-id'));
  // console.log(canonPos)
  const bullet = document.createElement('div');
  bullet.classList.add('bulletdown');
  gameboard.appendChild(bullet);
  const rect = target.getBoundingClientRect();

  bullet.style.left = `${rect.left + rect.width / 2 - 2.5}px`; // Adjust for bullet size
  bullet.style.top = `${rect.top + 100}px`; // Start at the top of the target square
  console.log(bullet.style.top)

  // Remove the bullet after the animation completes
  bullet.addEventListener('animationend', () => {
      bullet.remove();
  });

  // if(canonPos<30){
  //   console.log("Black's Canon is Firing")
  // }
  // if(canonPos>30){
  //   console.log("White's Canon is Firing")
  // }
 

  
  Bullet();
}

function Bullet() {
  var bulletSound = new Audio("laser.mp3"); // Adjust the path to your bullet sound file
  bulletSound.play();
}
