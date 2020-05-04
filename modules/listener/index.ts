import keycodes from "./utils/keycodes";
import events from "events";

const init = () => {
  const combinations: any = {};
  const cursor_location_event = new events.EventEmitter();
  const extract_location_regex = /\u001b\[([0-9]+);([0-9]+)R/;
  let allowed_characters: string[] = [];
  let allowed_commands: string[] = [];
  let allowed_regex: RegExp = /^$/;
  let stopper: string | null = null;

  const start = (callback: () => any) => {
    readKeystrokes(
      readed_key => {
        const found_entity = combinations[readed_key.stringified];

        if (typeof found_entity === "function") {
          found_entity(readed_key.stringified);
        } else if (typeof found_entity === "object") {
          if (!found_entity.is_active || !found_entity.disabling) {
            found_entity.enabling(readed_key.stringified);
            found_entity.is_active = true;
          } else {
            found_entity.disabling(readed_key.stringified);
            found_entity.is_active = false;
          }
        } else if (found_entity) {
          process.stdout.write(found_entity);
        } else if (
          allowed_commands.includes(keycodes.to[readed_key.stringified])
        ) {
          process.stdout.write(
            keycodes.from[keycodes.to[readed_key.stringified]]
          );
        } else if (
          allowed_commands.includes(keycodes.to[readed_key.extracted])
        ) {
          process.stdout.write(
            keycodes.from[keycodes.to[readed_key.extracted]]
          );
        } else if (allowed_characters.includes(readed_key.stringified)) {
          process.stdout.write(readed_key.stringified);
        } else if (allowed_regex.test(readed_key.stringified)) {
          process.stdout.write(readed_key.stringified);
        }
      },
      null,
      callback
    );
  };

  const readKeystrokes = (
    fn: (readed_key: any) => any,
    custom_stopper?: string | null,
    callback = () => {}
  ) => {
    process.stdin.setRawMode(true);

    process.stdin.on("data", readed_key => {
      if (
        (custom_stopper || stopper) &&
        readed_key.toString() === (custom_stopper || stopper)
      ) {
        process.stdin.pause();
        return callback();
      }

      if (extract_location_regex.test(readed_key.toString())) {
        const match_result = readed_key
          .toString()
          .match(extract_location_regex)!;

        cursor_location_event.emit("location", {
          x: match_result[1],
          y: match_result[2]
        });
      }

      fn({
        buffer: readed_key,
        extracted: Array.from(readed_key).join("."),
        stringified: readed_key.toString()
      });
    });
    process.stdin.resume();
  };

  const listen = (
    key: any,
    enabling = (_readed_key: string) => {},
    disabling?: (_readed_key?: string) => void
  ) => {
    combinations[key] = {
      is_active: false,
      enabling,
      disabling
    };
  };

  const exitOnCtrlC = () => {
    stopper = "\u0003";
  };

  const allowCharacters = (characters: string | string[]) => {
    if (typeof characters === "string") {
      characters = characters.split("");
    }
    allowed_characters = [...allowed_characters, ...characters];
    return allowed_characters;
  };

  const allowCommands = (commands: string | string[]) => {
    if (typeof commands === "string") {
      commands = [commands];
    }
    allowed_commands = [...allowed_commands, ...commands];
    return allowed_commands;
  };

  const disallowCharacters = (characters: string | string[]) => {
    if (typeof characters === "string") {
      characters = characters.split("");
    }
    allowed_characters = allowed_characters.filter(
      character => !characters.includes(character)
    );
    return allowed_characters;
  };

  const disallowCommands = (commands: string | string[]) => {
    if (typeof commands === "string") {
      commands = commands.split("");
    }

    /*
     * Remove duplicates.
     */
    allowed_commands = allowed_commands.filter(
      command => !commands.includes(command)
    );

    return allowed_commands;
  };

  const allowRegex = (regex: RegExp) => {
    allowed_regex = regex;
  };

  const allowArrows = (enabled: boolean = true) => {
    const arrows = ["up", "down", "left", "right"];

    /*
     * Remove duplicates.
     */
    allowed_commands.filter(command => !arrows.includes(command));

    if (enabled) {
      allowed_commands.push(...arrows);
    }
  };

  const getCursorLocation = () =>
    new Promise<{ x: number; y: number }>(resolve => {
      cursor_location_event.on("location", ({ x, y }) => {
        cursor_location_event.removeAllListeners("location");
        return resolve({ x, y });
      });
      process.stdout.write("\x1b[6n");
    });

  const stop = () => {};

  return {
    start,
    stop,
    exitOnCtrlC,
    readKeystrokes,
    allowCharacters,
    allowCommands,
    disallowCharacters,
    disallowCommands,
    allowRegex,
    allowArrows,
    getCursorLocation,
    listen
  };
};

export default init();
