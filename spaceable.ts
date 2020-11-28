type Namespace = string[] & { [name: string]: Namespace } & {
  on: (...args) => void;
  emit: any;
};

export function spaceable(stack: string[] = [], space?, on?, emit?): Namespace {
  const newstack = new Proxy(stack, {
    get(target, key) {
      let spaceStack = Reflect.get(target, key);
      if (!spaceStack) {
        spaceStack = spaceable(target.concat(key as string), space, on, emit);
        Reflect.set(target, key, spaceStack);
      }
      return spaceStack;
    },
    set(target, key, newValue) {
      if (space) {
        space(target, () => {
          if (key == "on" && on) {
            on("", newValue);
          } else if (key == "emit" && emit) {
            if (Array.isArray(newValue)) {
              emit("", ...newValue);
            } else {
              emit("", newValue);
            }
          } else {
            console.warn("you cant push something to space");
          }
        });
      } else {
        console.warn("you cant push something to space");
      }

      return true;
    },
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
