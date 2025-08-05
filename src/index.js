import "./styles.css";

export class Ship {
  constructor(size, name) {
    this.size = size;
    this.hits = 0;
    this.sunk = false;
    this.name = name;
  }

  hit() {
    this.hits++;
    if (this.hits === this.size) this.sunk = true;
  }

  isSunk() {
    return this.sunk;
  }
}

export class Gameboard {
  constructor(config) {
    this.board = new Array(10).fill(-1).map(() => new Array(10).fill(-1));
    this.ships = [new Ship(5, "Carrier"), new Ship(4, "Battleship"), new Ship(3, "Cruiser"), new Ship(3, "Submarine"), new Ship(2, "Destroyer")];
    let i = 0;
    for (const [[start_x, start_y], [end_x, end_y]] of config) {
      for (let x = start_x; x <= end_x; x++) {
        for (let y = start_y; y <= end_y; y++) {
          this.board[x][y] = i;
        }
      }
      i++;
    }
  }

  receiveAttack(x, y) {
    if (this.board[x][y] === -1) {
      this.board[x][y] = "miss";
    } else if (this.board[x][y] === "miss" || this.board[x][y] === "hit") {
      return;
    } else {
      this.ships[this.board[x][y]].hit();
      this.board[x][y] = "hit";
    }
  }

  allSunk() {
    return this.ships.reduce((accum, cur) => {return accum && cur.isSunk();}, true);
  }

  getSunk() {
    let sunken = [];
    for (let ship of this.ships) {
      if (ship.isSunk()) sunken.push(ship.name);
    }

    return sunken;
  }
}

export class Player {
  constructor(type, gameBoard) {
    this.type = type;
    this.gameBoard = gameBoard;
  }
}