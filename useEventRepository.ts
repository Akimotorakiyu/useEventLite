type Callback = (...args: unknown[]) => unknown;
export function useEventRepository() {
  const doMap = new Map<string, Set<Callback>>();

  function addToMap(event: string, fn: Callback) {
    let fnSet = doMap.get(event);
    if (!fnSet) {
      doMap.set(event, (fnSet = new Set()));
    }
    fnSet.add(fn);

    return () => {
      removeFromMap(event, fn);
    };
  }

  function removeFromMap(event: string, fn: Callback) {
    let fnSet = doMap.get(event);
    if (fnSet) {
      fnSet.delete(fn);
      if (fnSet.size == 0) {
        doMap.delete(event);
      }
    }
  }

  function runListener(event: string, ...args: unknown[]) {
    const result: unknown[] = [];

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
