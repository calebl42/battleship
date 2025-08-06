import { Ship, Gameboard, randomBoard } from "../src/gamelogic.js";

test("isSunk", () => {
  let destroyer = new Ship("Destroyer", 2);
  destroyer.hit();
  destroyer.hit();
  expect(destroyer.isSunk()).toBe(true);
});

test("receiveAttack", () => {
  let g = new Gameboard();
  g.addShip("Carrier", 5, [9, 0], [9, 4]);
  g.addShip("Battleship", 4, [2, 4], [5, 4]);
  g.addShip("Cruiser", 3, [5, 8], [7, 8]);
  g.addShip("Submarine", 3, [1, 1], [1, 3]);
  g.addShip("Destroyer", 2, [1, 8], [1, 9]);

  g.receiveAttack(0, 0);
  expect(g.board[0][0]).toBe("miss");
  g.receiveAttack(1, 1);
  expect(g.board[1][1]).toBe("hit");
});

test("allSunk", () => {
  let g = new Gameboard();
  g.addShip("Carrier", 5, [9, 0], [9, 4]);
  g.addShip("Battleship", 4, [2, 4], [5, 4]);
  g.addShip("Cruiser", 3, [5, 8], [7, 8]);
  g.addShip("Submarine", 3, [1, 1], [1, 3]);
  g.addShip("Destroyer", 2, [1, 8], [1, 9]);

  expect(g.allSunk()).toBe(false);

  g.receiveAttack(9, 0);
  g.receiveAttack(9, 1);
  g.receiveAttack(9, 2);
  g.receiveAttack(9, 3);
  g.receiveAttack(9, 4);

  g.receiveAttack(2, 4);
  g.receiveAttack(3, 4);
  g.receiveAttack(4, 4);
  g.receiveAttack(5, 4);

  expect(g.allSunk()).toBe(false);

  g.receiveAttack(5, 8);
  g.receiveAttack(6, 8);
  g.receiveAttack(7, 8);
  
  g.receiveAttack(1, 1);
  g.receiveAttack(1, 2);
  g.receiveAttack(1, 3);
  
  g.receiveAttack(1, 8);
  g.receiveAttack(1, 9);

  expect(g.allSunk()).toBe(true);
});

test("getSunk", () => {
  let g = new Gameboard();
  g.addShip("Carrier", 5, [9, 0], [9, 4]);
  g.addShip("Battleship", 4, [2, 4], [5, 4]);
  g.addShip("Cruiser", 3, [5, 8], [7, 8]);
  g.addShip("Submarine", 3, [1, 1], [1, 3]);
  g.addShip("Destroyer", 2, [1, 8], [1, 9]);

  g.receiveAttack(9, 0);
  g.receiveAttack(9, 1);
  g.receiveAttack(9, 2);
  g.receiveAttack(9, 3);
  g.receiveAttack(9, 4);

  expect(g.getSunk()).toStrictEqual(["Carrier"]);

  g.receiveAttack(2, 4);
  g.receiveAttack(3, 4);
  g.receiveAttack(4, 4);
  g.receiveAttack(5, 4);

  expect(g.getSunk()).toStrictEqual(["Carrier", "Battleship"]);
});

test("randomBoard", () => {
  let rando = randomBoard();
  let total = 0;
  let board = new Array(10).fill(0).map(() => new Array(10).fill(0));

  for ([ [start_x, start_y], [end_x, end_y] ] of randomBoard()) {
    for (x = start_x; x <= end_x; x++) {
      for (y = start_y; y <= end_y; y++) {
        expect(board[x][y]).toBe(0);
        board[x][y] = 1;
        total++;
      }
    }
  }

  expect(total).toBe(17);
});
