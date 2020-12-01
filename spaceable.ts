type Namespace = string[] & { [name: string]: Namespace };

type Portal = string[] & { [name: string]: Portal } & {
  on: (fn: (...args) => void) => void;
  emit: (...args) => void;
  remove: (fn: (...args) => void) => void;
};

const onKey = "on";
const emitKey = "emit";
const removeKey = "remove";

export function spaceable(
  stack: string[],
  interceptor?: (
    target,
    key,
    reciver
  ) => {
    deal: boolean;
    value: any;
  }
): Namespace {
  const newstack = new Proxy(stack, {
    get(target, key, reciver) {
      if (interceptor) {
        const temp = interceptor(target, key, reciver);
        if (temp.deal) {
          return temp.value;
        }
      }

      let spaceStack = Reflect.get(target, key, reciver);
      if (!spaceStack) {
        spaceStack = spaceable(target.concat(key as string), interceptor);
        Reflect.set(target, key, spaceStack);
      }
      return spaceStack;
    },
    set() {
      throw new Error("dont't throw anything into space!");
    },
  });

  return newstack as Namespace;
}
export const namespace = spaceable([]);

export function portalable(
  stack: string[],
  space?,
  on?,
  emit?,
  remove?
): Portal {
  const portal = spaceable(stack, (target, key) => {
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

      return {
        deal: true,
        value: onHandler,
      };
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

      return {
        deal: true,
        value: emitHandler,
      };
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

      return {
        deal: true,
        value: removeHandler,
      };
    }

    return {
      deal: false,
      value: null,
    };
  });

  return portal as Portal;
}
