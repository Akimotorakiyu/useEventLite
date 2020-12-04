export type Middleware = (
  ctx: unknown,
  next: () => Promise<void> | void
) => Promise<void> | void;
type TheNext = (
  ctx: unknown,
  middleware: Middleware[],
  index: number
) => Promise<void> | void;

type Callback = (...args: unknown[]) => unknown;

function theNext(
  ctx: unknown,
  middleware: Middleware[],
  index: number
): Promise<void> | void {
  const fn = middleware[index];
  if (fn) {
    return fn(ctx, () => {
      return theNext(ctx, middleware, ++index);
    });
  }
}

function onionRings(middleware: Middleware[]) {
  return (ctx: unknown) => {
    return theNext(ctx, middleware, 0);
  };
}

export function useInvokeRepository() {
  const doMap = new Map<string, Middleware[]>();

  function addToMap(event: string, fn: Middleware) {
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
    if (middleware && middleware?.length > 0) {
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
