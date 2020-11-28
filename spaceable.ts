type Namespace = string[] & { [name: string]: Namespace };

export function spaceable(stack: string[] = []): Namespace {
  const newstack = new Proxy(stack, {
    get(target, key) {
      let spaceStack = Reflect.get(target, key);
      if (!spaceStack) {
        spaceStack = spaceable(target.concat(key as string));
      }
      return spaceStack;
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
