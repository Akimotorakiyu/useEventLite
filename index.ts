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

  function space(name: string, fn: () => void) {
    spaceStack.push(name);
    fn();
    spaceStack.pop();
  }

  function emit(event: string, ...args) {
    runListener(spaceStack.concat(event).join(":"), ...args);
  }
  return {
    on,
    space,
    emit,
  };
}
