import { Player, randomBoard } from "./gamelogic.js";
import "./styles.css";

const humanBoardContainer = document.getElementById("humanBoardContainer");
const computerBoardContainer = document.getElementById("computerBoardContainer");
const humanBoard = document.getElementById("humanBoard");
const computerBoard = document.getElementById("computerBoard");
let form = document.querySelector("form");
let dialog = document.querySelector("dialog");
let dialogButton = document.querySelector("dialog button");
dialogButton.addEventListener("click", () => {
  dialog.close();
});
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
  human.gameBoard.addShip(shipNames[index], sizes[index], [formData.get("startx"), formData.get("starty")], 
    [formData.get("endx"), formData.get("endy")]
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
    computerBoardContainer.style.display = "block";
    updateBoard(computerBoard, computer);
  }
  form.reset();
}

export function setUp() {
  human = new Player('real');
  computer = new Player('computer');
  updateBoard(humanBoard, human);
  humanBoardContainer.style.display = "block";
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
          if (player.gameBoard.allSunk()) {
            let dialogHeader = document.querySelector("dialog h1");
            dialogHeader.textContent = "Congratulations! You won."
            dialog.show();
          }
          human.gameBoard.receiveAttack(Math.floor(Math.random()*10), Math.floor(Math.random()*10));
          updateBoard(humanBoard, human);
          if (human.gameBoard.allSunk()) {
            let dialogHeader = document.querySelector("dialog h1");
            dialogHeader.textContent = "You have been defeated!"
            dialog.show();
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