import { spaceable } from "./spaceable";
export function useEventLite() {
  const doMap = new Map<string, Set<(...args) => void>>();
  const spaceStack = [];

  function addToMap(event: string, fn: (...args) => void) {
    let fnSet = doMap.get(event);
    if (!fnSet) {
      doMap.set(event, (fnSet = new Set()));
    }
    fnSet.add(fn);
  }
  function runListener(event: string, ...args) {
    doMap.get(event)?.forEach((fn) => fn(...args));
  }

  function on(event: string, fn: () => void) {
    addToMap(spaceStack.concat(event).join(":"), fn);
  }

  function space(name: string | string[], fn: () => void) {
    if (Array.isArray(name)) {
      spaceStack.push(...name);
      fn();
      spaceStack.splice(spaceStack.length - name.length, name.length);
    } else {
      spaceStack.push(name);
      fn();
      spaceStack.pop();
    }
  }

  function emit(event: string, ...args) {
    runListener(spaceStack.concat(event).join(":"), ...args);
  }

  const portal = spaceable([], space, on, emit);
  return {
    on,
    space,
    emit,
    portal,
  };
}
