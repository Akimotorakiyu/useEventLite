export function useEventRepository() {
  const doMap = new Map<string, Set<(...args) => unknown>>();

  function addToMap(event: string, fn) {
    let fnSet = doMap.get(event);
    if (!fnSet) {
      doMap.set(event, (fnSet = new Set()));
    }
    fnSet.add(fn);

    return () => {
      removeFromMap(event, fn);
    };
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
    const result = [];

    doMap.get(event)?.forEach((fn) => {
      result.push(fn(...args));
    });

    return result;
  }

  return {
    addToMap,
    removeFromMap,
    runListener,
  };
}
