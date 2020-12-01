import { eventPortal, invokePortal } from "./spaceable";
import { useEventRepository } from "./useEventRepository";
import { useInvokeRepository } from "./useInvokeRepository";

const membrane = "::";

export function useEventLite() {
  const spaceStack = [];

  const { addToMap, runListener, removeFromMap } = useEventRepository();
  function on(event: string, fn: (...args) => void) {
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

  function emit(event: string, ...args) {
    return runListener(tunnel(event), ...args);
  }

  function remove(event: string, fn) {
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
  const spaceStack = [];

  const { addToMap, runListener, removeFromMap } = useInvokeRepository();
  function on(event: string, fn: (...args) => void) {
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

  function invoke(event: string, ctx) {
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
