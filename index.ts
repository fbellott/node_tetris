import writer from "./modules/writer";
import listener from "./modules/listener";

// writer.bbred();
// writer.writeInPlace("Hello World!");

// process.stdin.setRawMode(true);
// process.stdin.setEncoding("utf8");

// const keys = {
//   "\u001b[A": "up",
//   "\u001b[B": "down",
//   "\u001b[D": "left",
//   "\u001b[C": "right",
//   "\r": "enter",
//   "\t": "tabulation",
//   " ": "space"
// };
//
// const commands = {
//   up: "\u001b[1A",
//   down: "\u001b[1B",
//   right: "\u001b[1C",
//   left: "\u001b[1D",
//   space: ".\u001b[1D"
// };

const pieces: any = {
  A: [" A ", " A ", " A "],
  B: ["B  ", "BBB", "   "],
  C: ["  C", "CCC", "   "],
  D: ["D  ", "DDD", "  D"],
  E: [" EE", " EE", "   "],
  F: ["  F", "FFF", "F  "],
  G: [" G ", "GGG", "   "]
};

// console.log(
//   "Terminal size: " + process.stdout.columns + "x" + process.stdout.rows
// );

const cells: string[][] = [];

const quantity_of_rows = 30 || process.stdout.rows;
const quantity_of_columns = process.stdout.columns;

const initCells = () => {
  for (let y = 0; y < quantity_of_rows; y++) {
    cells[y] = Array(quantity_of_columns).fill(" ");
    // for (let x = 0; x < quantity_of_columns; x++) {
    //   cells[y].push(" ");
    // }
  }
};

const displayCells = () => {
  writer.clearScrean();
  writer.goTo(0, 0);

  for (let y = 0; y < quantity_of_rows; y++) {
    writer.write(cells[y].join(""));
  }
};

const displayPiece = (name: string) => {
  const colors: any = {
    A: "bred",
    B: "bblue",
    C: "bgreen",
    D: "byellow",
    E: "bcyan",
    F: "bmagenta"
  };
  pieces[name].forEach((row: string) => {
    row = row
      .replace(
        /[A-Z]/g,
        `${writer.reset.value}${writer[colors[name]].value}.${writer.reset.value}`
      )
      .replace(/ /g, writer.right.value)
      .replace(/\./g, " ");
    writer.write(row);
    writer.left(3);
    writer.down(1);
  });
  writer.up(3);
};

const insertPieceIntoCells = (
  name: string,
  location: { x: number; y: number }
) => {
  const colors: any = {
    A: "bred",
    B: "bblue",
    C: "bgreen",
    D: "byellow",
    E: "bcyan",
    F: "bmagenta"
  };

  pieces[name].forEach((row: string, row_index: number) => {
    row.split("").forEach((cell: string, cell_index: number) => {
      cells[location.y + row_index][location.x + cell_index] = cell.replace(
        /[A-Z]/g,
        `${writer.reset.value}${writer[colors[name]].value}.${writer.reset.value}`
      );
    });
  });
};

initCells();
displayCells();
writer.goTo(0, 0);

listener.exitOnCtrlC();

listener.allowRegex(/[a-zA-Z0-9?!.,'" ]/);
listener.allowCommands(["backspace", "enter", "tabulation", "backspace"]);
listener.allowArrows();
Object.keys(pieces).forEach((name: string) => {
  listener.listen(name, () => {
    displayPiece(name);
  });
});
listener.listen("c", () => {
  writer.clearScrean();
});
listener.listen("A", () => {
  insertPieceIntoCells("A", { x: 1, y: 1 });
});
listener.listen("B", () => {
  insertPieceIntoCells("B", { x: 5, y: 1 });
});
listener.listen("C", () => {
  insertPieceIntoCells("C", { x: 1, y: 5 });
});
listener.listen("D", () => {
  insertPieceIntoCells("D", { x: 5, y: 5 });
});
listener.listen("p", () => {
  displayCells();
});
// listener.listen("[", () => {
//   writer.goTo(0, 0);
// });
// listener.listen("]", () => {
//   writer.goTo(50, 50);
// });
// listener.listen(
//   "Q",
//   () => {
//     writer.bblue();
//     writer.black();
//     writer.write(" ");
//     writer.left();
//   },
//   _a => {
//     writer.reset();
//   }
// );
let [x, y] = [1, 1];
const moove = (piece: string, { x, y }: { x: number; y: number }) => {
  initCells();
  insertPieceIntoCells(piece, { x: x, y: y });
  displayCells();
  // writer.goTo(2, 20 + y);
  // writer.write(`[y: ${y};x: ${x}]`);
};
// moove();
// moove();
const E = () => {
  x = 2;
  y = 1;
  setInterval(() => {
    moove("E", { x, y });
    if (y > 5) {
      process.exit(0);
    }
    y += 1;
  }, 500);
};
setInterval(() => {
  moove("B", { x, y });
  if (y > 5) {
    E();
  }
  y += 1;
}, 500);
listener.start(() => {});
// writer.write("\u001b[0m\u001b[41m.\u001b[0m");
