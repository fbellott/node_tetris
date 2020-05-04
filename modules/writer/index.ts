import combinations from "./utils/combinations";

const writer: any = {};

writer.write = (text: string) => process.stdout.write(text);

combinations.forEach(([name, value]) => {
  writer[name] = (n = 1) => {
    writer.write(value(n));
  };
  Object.defineProperty(writer[name], "value", {
    get: value
  });
});

writer.goTo = (x: number, y: number) => {
  process.stdout.cursorTo(x, y);
};

writer.clearScreanDown = () => {
  process.stdout.clearScreenDown();
};

writer.clearScrean = () => {
  writer.goTo(0, 0);
  writer.clearScreanDown();
};

export default writer;
