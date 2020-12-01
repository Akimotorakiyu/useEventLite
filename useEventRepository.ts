export function useEventRepository() {
  const doMap = new Map<string, Set<(...args) => void>>();

  function addToMap(event: string, fn) {
    let fnSet = doMap.get(event);
    if (!fnSet) {
      doMap.set(event, (fnSet = new Set()));
    }
    fnSet.add(fn);
  }

  function removeFromMap(event: string, fn) {
    let fnSet = doMap.get(event);
    if (fnSet) {
      fnSet.delete(fn);
      if (fnSet.size == 0) {
        doMap.delete(event);
      }
    }
  }

  function runListener(event: string, ...args) {
    doMap.get(event)?.forEach((fn) => fn(...args));
  }

  return {
    addToMap,
    removeFromMap,
    runListener,
  };
}
