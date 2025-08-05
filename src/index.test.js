import { Ship, Gameboard } from "./index.js";

test("isSunk", () => {
  let destroyer = new Ship(2, "Destroyer");
  destroyer.hit();
  destroyer.hit();
  expect(destroyer.isSunk()).toBe(true);
});

test("receiveAttack", () => {
  let g = new Gameboard([
    [ [9, 0] , [9, 4] ],
    [ [2, 4] , [5, 4] ],
    [ [5, 8] , [7, 8] ],
    [ [1, 1] , [1, 3] ],
    [ [1, 8] , [1, 9] ]
  ]);

  g.receiveAttack(0, 0);
  expect(g.board[0][0]).toBe("miss");
  g.receiveAttack(1, 1);
  expect(g.board[1][1]).toBe("hit");
});

test("allSunk", () => {
  let g = new Gameboard([
    [ [9, 0] , [9, 4] ],
    [ [2, 4] , [5, 4] ],
    [ [5, 8] , [7, 8] ],
    [ [1, 1] , [1, 3] ],
    [ [1, 8] , [1, 9] ]
  ]);

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
  let g = new Gameboard([
    [ [9, 0] , [9, 4] ],
    [ [2, 4] , [5, 4] ],
    [ [5, 8] , [7, 8] ],
    [ [1, 1] , [1, 3] ],
    [ [1, 8] , [1, 9] ]
  ]);

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
