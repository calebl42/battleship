import { Player, randomBoard } from "./gamelogic.js";
import "./styles.css";

const humanBoardContainer = document.getElementById("humanBoardContainer");
const computerBoardContainer = document.getElementById("computerBoardContainer");
const humanBoard = document.getElementById("humanBoard");
const computerBoard = document.getElementById("computerBoard");
let form = document.querySelector("form");
let popup = document.querySelector(".popup");
let popupHeader = document.querySelector(".popup > h1");
let popupButton = document.querySelector(".popup > button");
popup.style.display = "none";
popupButton.addEventListener("click", () => {
  popup.style.display = "none";
  console.log("huh");
})
humanBoardContainer.style.display = "none";
computerBoardContainer.style.display = "none";
form.style.display = "none";
let human;
let computer;
let formHeader = document.getElementById("formHeader");
const shipNames = ["Carrier", "Battleship", "Cruiser", "Submarine", "Destroyer"];
const sizes = [5, 4, 3, 3, 2];
let index = 0;

function handleForm(e) {
  e.preventDefault();
  let formData = new FormData(form);
  let [shipStart, shipEnd] = [
    [formData.get("startx").toUpperCase().charCodeAt(0) - "A".charCodeAt(0), formData.get("starty")-1], 
    [formData.get("endx").toUpperCase().charCodeAt(0) - "A".charCodeAt(0), formData.get("endy")-1]
  ].sort(); 
  human.gameBoard.addShip(
    shipNames[index], 
    sizes[index], 
    shipStart,
    shipEnd
  );
  updateBoard(humanBoard, human);
  index++;
  if (index < shipNames.length) {
    formHeader.textContent = `Position your ${shipNames[index]} (${sizes[index]} units long)`;
  } else {
    form.style.display = "none";
    index = 0;
    let rando = randomBoard();
    for (const [[start_x, start_y], [end_x, end_y]] of rando) {
      computer.gameBoard.addShip(shipNames[index], sizes[index], [start_x, start_y], [end_x, end_y]);
      index++;
    }
    index = 0;
    computerBoardContainer.style.display = "grid";
    updateBoard(computerBoard, computer);
  }
  form.reset();
}

export function setUp() {
  human = new Player('real');
  computer = new Player('computer');
  updateBoard(humanBoard, human);
  humanBoardContainer.style.display = "grid";
  computerBoardContainer.style.display = "none";
  form.reset();
  
  let newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);
  form = document.querySelector("form");
  form.style.display = "block";
  formHeader = document.getElementById("formHeader");
  formHeader.textContent = `Position your ${shipNames[index]} (5 units long)`;
  form.addEventListener("submit", (e) => handleForm(e));
}

function updateBoard(board, player) {
  //update the board element with the player object's array data
  board.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      if (player.type === 'computer' && player.gameBoard.ships.length === 5) {
        cell.addEventListener("click", () => {
          player.gameBoard.receiveAttack(i, j);
          updateBoard(board, player);
          if (computer.gameBoard.allSunk()) {
            popupHeader.textContent = "Congratulations! You Won!";
            popup.style.display = "flex";
          }
          while (true) {
            let hits = 0;
            for (let arr of human.gameBoard.board) {
              for (let cell of arr) {
                if (cell === "hit") {
                  hits++;
                }
              }
            }
            if (hits >= 17) break;
            let attack_x =  Math.floor(Math.random()*10);
            let attack_y = Math.floor(Math.random()*10);
            if (human.gameBoard.board[attack_x][attack_y] === "miss" ||
              human.gameBoard.board[attack_x][attack_y] === "hit") {
              continue;
            } else {
              human.gameBoard.receiveAttack(attack_x, attack_y);
              break;
            }
          }
          updateBoard(humanBoard, human);
          if (human.gameBoard.allSunk()) {
            popupHeader.textContent = "Oh no! You Lost!";
            popup.style.display = "flex";
          }
        });
      }

      switch (player.gameBoard.board[i][j]) {
        case "hit":
          cell.style.backgroundColor = "red";
          break;
        case "miss":
          cell.style.backgroundColor = "white";
          break;
        case "":
          cell.style.backgroundColor = "lightblue";
          break;
        default:
          cell.style.backgroundColor = (player.type === "real") ? "grey" : "lightblue";
      }
      board.appendChild(cell);
    }
  }
}

let newGameButton = document.getElementById("newGame");
newGameButton.addEventListener("click", () => {
  setUp();
});

let randomBoardButton = document.getElementById("randomBoard");

randomBoardButton.addEventListener("click", () => {
  human = new Player('real');
  computer = new Player('computer');
  index = 0;
  let rando = randomBoard();
  for (const [[start_x, start_y], [end_x, end_y]] of rando) {
    human.gameBoard.addShip(shipNames[index], sizes[index], [start_x, start_y], [end_x, end_y]);
    index++;
  }
  index = 0;
  rando = randomBoard();
  for (const [[start_x, start_y], [end_x, end_y]] of rando) {
    computer.gameBoard.addShip(shipNames[index], sizes[index], [start_x, start_y], [end_x, end_y]);
    index++;
  }
  index = 0;
  updateBoard(humanBoard, human);
  updateBoard(computerBoard, computer);
  humanBoardContainer.style.display = "grid";
  computerBoardContainer.style.display = "grid";
  form.style.display = "none";
});
