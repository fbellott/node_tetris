const keycodes = [
  ["up", "\u001b[A", "\u001b[1A"],
  ["down", "\u001b[B", "\u001b[1B"],
  ["left", "\u001b[C", "\u001b[1C"],
  ["right", "\u001b[D", "\u001b[1D"],
  ["enter", "\r"],
  ["tabulation", "\t"],
  ["space", " "],
  ["backspace", "127", "\u001b[1D \u001b[1D"]
];

const from: any = keycodes.reduce(
  (result: any, [name, input_value, output_value]) => {
    result[name] = output_value;
    return result;
  },
  {}
);
const to: any = keycodes.reduce(
  (result: any, [name, input_value, output_value]) => {
    result[input_value] = name;
    return result;
  },
  {}
);

export default {
  from,
  to
} as any;
