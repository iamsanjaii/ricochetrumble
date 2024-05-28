const gameboard = document.querySelector('#gameboard');
const infoDisplay = document.querySelector('#info');
const playerDisp = document.querySelector("#player");
const width = 8;
let playerGo = 'black';
playerDisp.textContent = "Player 1";

const Ricochet = '<div class="piece" id="ricochet"><object data="Pieces/ricochet.svg" width="30" height="30"></object></div>';
const Semiricochet = '<div class="piece" id="semiricochet"><object data="Pieces/semiricochet.svg" width="30" height="30"></object></div>';
const tank = '<div class="piece" id="tank"><object data="Pieces/tank.svg" width="30" height="30"></object></div>';
const titan = '<div class="piece" id="titan"><object data="Pieces/titan.svg" width="30" height="30"></object></div>';
const canon = '<div class="piece" id="canon"><object data="Pieces/canon.svg" width="30" height="30"></object></div>';

const startPieces = [
  "", "", "", canon, titan, "", "", "",
  "", "", "", Semiricochet, tank, Ricochet, "", "",
  "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "",
  "", "", "", tank, Semiricochet, Ricochet, "", "",
  "", "", canon, titan, "", "", "", ""
];

function createBoard() {
  startPieces.forEach((startPiece, i) => {
    const square = document.createElement('div');
    square.classList.add('square');
    square.innerHTML = startPiece;
    square.setAttribute('square-id', i);

    if (startPiece !== "") {
      const piece = square.querySelector('.piece');
      piece.addEventListener('click', pieceClick);
      if (i <= 15) {
        piece.firstChild.classList.add('black');
      } else if (i >= 48) {
        piece.firstChild.classList.add('white');
      }
    }

    gameboard.append(square);
  });
}

createBoard();

let selectedPiece = null;
let startPositionId = null;
const allSquares = document.querySelectorAll("#gameboard .square");

allSquares.forEach(square => {
  square.addEventListener('click', movePiece);
});

function pieceClick(e) {
  clearHighlights();
  selectedPiece = e.target.closest('.piece');
  startPositionId = Number(selectedPiece.parentNode.getAttribute('square-id'));
  highlightMoves(selectedPiece.id, startPositionId);
}

function highlightMoves(pieceId, startId) {
  const possibleMoves = getPossibleMoves(pieceId, startId);
  possibleMoves.forEach(move => {
    const targetSquare = document.querySelector(`[square-id='${move}']`);
    if (targetSquare) {
      targetSquare.classList.add('highlight');
    }
  });
}

function clearHighlights() {
  allSquares.forEach(square => square.classList.remove('highlight'));
}

function movePiece(e) {
  if (e.target.classList.contains('highlight')) {
    const targetSquare = e.target;
    targetSquare.innerHTML = selectedPiece.outerHTML;
    selectedPiece.parentNode.innerHTML = "";
    clearHighlights();
    changePlayer();
  }
}

function getPossibleMoves(pieceId, startId) {
  const moves = [];
  switch (pieceId) {
    case 'titan':
      if (startId + 1 < width * width) moves.push(startId + 1);
      if (startId - 1 >= 0) moves.push(startId - 1);
      break;
    case 'ricochet':
    case 'semiricochet':
    case 'tank':
      if (startId + 1 < width * width) moves.push(startId + 1);
      if (startId + width < width * width) moves.push(startId + width);
      if (startId + width + 1 < width * width) moves.push(startId + width + 1);
      if (startId - 1 >= 0) moves.push(startId - 1);
      if (startId - width >= 0) moves.push(startId - width);
      if (startId - width - 1 >= 0) moves.push(startId - width - 1);
      if (startId - width + 1 >= 0) moves.push(startId - width + 1);
      if (startId + width - 1 < width * width) moves.push(startId + width - 1);
      break;
    case 'canon':
      if (startId + 1 < width * width) moves.push(startId + 1);
      if (startId - 1 >= 0) moves.push(startId - 1);
      break;
  }
  return moves;
}

function changePlayer() {
  if (playerGo === "black") {
    playerGo = "white";
    playerDisp.textContent = "Player 2";
  } else {
    playerGo = "black";
    playerDisp.textContent = "Player 1";
  }
}
