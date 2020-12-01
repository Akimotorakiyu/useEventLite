type Namespace = string[] & { [name: string]: Namespace } & {
  on: (fn: (...args) => void) => void;
  emit: (...args) => void;
};

const onKey = "on";
const emitKey = "emit";
const removeKey = "remove";

export function spaceable(
  stack: string[] = [],
  space?,
  on?,
  emit?,
  remove?
): Namespace {
  const newstack = new Proxy(stack, {
    get(target, key) {
      console.log("...", target, key);
      if (key == onKey) {
        let onHandler;

        if (!onHandler) {
          onHandler = (fn) => {
            space(target, () => {
              on("", fn);
            });
          };

          Reflect.set(target, key, onHandler);
        }

        return onHandler;
      }
      if (key == emitKey) {
        let emitHandler;

        if (!emitHandler) {
          emitHandler = (...args) => {
            space(target, () => {
              emit("", ...args);
            });
          };

          Reflect.set(target, key, emitHandler);
        }

        return emitHandler;
      }

      if (key == removeKey) {
        let removeHandler;

        if (!removeHandler) {
          removeHandler = (fn) => {
            space(target, () => {
              remove("", fn);
            });
          };

          Reflect.set(target, key, removeHandler);
        }

        return removeHandler;
      }

      let spaceStack = Reflect.get(target, key);
      if (!spaceStack) {
        spaceStack = spaceable(
          target.concat(key as string),
          space,
          on,
          emit,
          remove
        );
        Reflect.set(target, key, spaceStack);
      }
      return spaceStack;
    },
    // set(target, key, newValue) {
    //   if (space) {
    //     space(target, () => {
    //       if (key == onKey && on) {
    //         on("", newValue);
    //       } else if (key == emitKey && emit) {
    //         if (Array.isArray(newValue)) {
    //           emit("", ...newValue);
    //         } else {
    //           emit("", newValue);
    //         }
    //       } else {
    //         console.warn("you cant push something to space");
    //       }
    //     });
    //   } else {
    //     console.warn("you cant push something to space");
    //   }

    //   return true;
    // },
  });

  return newstack as Namespace;
}

export const namespace = spaceable();

// console.log(hub);
// console.log(hub.eat);
// console.log(hub.eat.drink);
// console.log(hub.eat);
// console.log(hub);

// console.log(hub);
// console.log(hub.dundundun);
// console.log(hub.dundundun.gegege);
// console.log(hub.gegege);
// console.log(hub);
