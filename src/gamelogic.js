export class Ship {
  constructor(name, size) {
    this.name = name;
    this.size = size;
    this.hits = 0;
    this.sunk = false;
  }

  hit() {
    this.hits++;
    if (this.hits === this.size) {
      this.sunk = true;
    }
  }

  isSunk() {
    return this.sunk;
  }
}

export class Gameboard {
  constructor() {
    this.board = new Array(10).fill("").map(() => new Array(10).fill(""));
    this.ships = [];
  }

  addShip(name, size, [startx, starty], [endx, endy]) {
    this.ships.push(new Ship(name, size));
    for (let x = startx; x <= endx; x++) {
      for (let y = starty; y <= endy; y++) {
        this.board[x][y] = name;
      }
    }
  }

  receiveAttack(x, y) {
    if (this.board[x][y] === "") {
      this.board[x][y] = "miss";
    } else if (this.board[x][y] === "miss" || this.board[x][y] === "hit") {
      return;
    } else {
      this.ships = this.ships.map((ship) => {
        if (ship.name === this.board[x][y]) {
          ship.hit();
        }
        return ship;
      });
      this.board[x][y] = "hit";
    }
  }

  allSunk() {
    return this.ships.reduce((accum, cur) => {
      return accum && cur.isSunk();
    }, true);
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
  constructor(type) {
    this.type = type;
    this.gameBoard = new Gameboard();
  }
}

export function randomBoard() {
  let coords = [];
  let board = new Array(10).fill(0).map(() => new Array(10).fill(0));
  const sizes = [5, 4, 3, 3, 2];
  let index = 0;
  while (index < sizes.length) {
    let attempt_x = Math.floor(Math.random() * 10);
    let attempt_y = Math.floor(Math.random() * 10);
    let direction = Math.floor(Math.random() * 4);
    let taken = false;
    switch(direction) {
      case 0:
        if (attempt_x + sizes[index]-1 >= 10) continue;
        for (let x = attempt_x; x <= attempt_x + sizes[index]-1; x++) {
          if (board[x][attempt_y] !== 0) taken = true;
        }
        if (taken) continue;
        for (let x = attempt_x; x <= attempt_x + sizes[index]-1; x++) {
          board[x][attempt_y] = 1;
        }
        coords.push([ [attempt_x, attempt_y] , [attempt_x + sizes[index]-1, attempt_y] ]);
        index++;
        break;
      case 1:
        if (attempt_x - sizes[index]+1 < 0) continue;
        for (let x = attempt_x - sizes[index]+1; x <= attempt_x; x++) {
          if (board[x][attempt_y] !== 0) taken = true;
        }
        if (taken) continue;
        for (let x = attempt_x - sizes[index]+1; x <= attempt_x; x++) {
          board[x][attempt_y] = 1;
        }
        coords.push([ [attempt_x - sizes[index]+1, attempt_y] , [attempt_x, attempt_y] ]);
        index++;
        break;
      case 2:
        if (attempt_y + sizes[index]-1 >= 10) continue;
        for (let y = attempt_y; y <= attempt_y + sizes[index]-1; y++) {
          if (board[attempt_x][y] !== 0) taken = true;
        }
        if (taken) continue;
        for (let y = attempt_y; y <= attempt_y + sizes[index]-1; y++) {
          board[attempt_x][y] = 1;
        }
        coords.push([ [attempt_x, attempt_y] , [attempt_x, attempt_y + sizes[index]-1] ]);
        index++;
        break;
      case 3:
        if (attempt_y - sizes[index]+1 < 0) continue;
        for (let y = attempt_y - sizes[index]+1; y <= attempt_y; y++) {
          if (board[attempt_x][y] !== 0) taken = true;
        }
        if (taken) continue;
        for (let y = attempt_y - sizes[index]+1; y <= attempt_y; y++) {
          board[attempt_x][y] = 1;
        }
        coords.push([ [attempt_x, attempt_y - sizes[index]+1] , [attempt_x, attempt_y] ]);
        index++;
        break;
    }
  }

  return coords;
}