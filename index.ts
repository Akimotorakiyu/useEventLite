import { eventPortal, invokePortal } from "./spaceable";
import { useEventRepository } from "./useEventRepository";
import { useInvokeRepository, Middleware } from "./useInvokeRepository";
type Callback = (...args: unknown[]) => unknown;

const membrane = "::";

export function useEventLite() {
  const spaceStack: string[] = [];

  const { addToMap, runListener, removeFromMap } = useEventRepository();
  function on(event: string, fn: (...args: unknown[]) => void) {
    return addToMap(spaceStack.concat(event).join(membrane), fn);
  }

  function tunnel(event: string) {
    return spaceStack.concat(event).join(membrane);
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

  function emit(event: string, ...args: unknown[]) {
    return runListener(tunnel(event), ...args);
  }

  function remove(event: string, fn: Callback) {
    removeFromMap(tunnel(event), fn);
  }

  return {
    on,
    emit,
    remove,
    space,
  };
}

export function useInvokeLite() {
  const spaceStack: string[] = [];

  const { addToMap, runListener, removeFromMap } = useInvokeRepository();
  function on(event: string, fn: Middleware) {
    addToMap(spaceStack.concat(event).join(membrane), fn);
  }

  function tunnel(event: string) {
    return spaceStack.concat(event).join(membrane);
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

  function invoke(event: string, ctx: unknown) {
    return runListener(tunnel(event), ctx);
  }

  function remove(event: string) {
    removeFromMap(tunnel(event));
  }

  return {
    on,
    invoke,
    remove,
    space,
  };
}

export function useInvokePortal() {
  const { on, invoke, remove, space } = useInvokeLite();
  const portal = invokePortal([], space, on, invoke, remove);
  return {
    on,
    invoke,
    remove,
    space,
    portal,
  };
}

export function useEventPortal() {
  const { on, emit, remove, space } = useEventLite();
  const portal = eventPortal([], space, on, emit, remove);
  return {
    on,
    emit,
    remove,
    space,
    portal,
  };
}
