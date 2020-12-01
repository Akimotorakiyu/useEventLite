function theNext(ctx, middleware, index) {
  const fn = middleware[index];
  if (fn) {
    return fn(ctx, () => {
      return theNext(ctx, middleware, ++index);
    });
  }
}

function onionRings(middleware) {
  return (ctx) => {
    return theNext(ctx, middleware, 0);
  };
}

export function useInvokeRepository() {
  const doMap = new Map<string, Array<(...args) => void>>();

  function addToMap(event: string, fn) {
    let fnArray = doMap.get(event);
    if (!fnArray) {
      doMap.set(event, (fnArray = []));
    }
    fnArray.push(fn);
  }

  function removeFromMap(event: string) {
    doMap.delete(event);
  }

  async function runListener(event: string, ctx: any) {
    const middleware = doMap.get(event);
    if (middleware?.length > 0) {
      const runner = onionRings(middleware);
      await runner(ctx);
      return ctx;
    }
  }

  return {
    addToMap,
    removeFromMap,
    runListener,
  };
}
