import { portalable, spaceable } from "./spaceable";
import { useEventRepository } from "./useEventRepository";

const membrane = "::";

export function useEventLite() {
  const spaceStack = [];

  const { addToMap, runListener, removeFromMap } = useEventRepository();
  function on(event: string, fn: () => void) {
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
    runListener(tunnel(event), ...args);
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

export function usePortal() {
  const { on, emit, remove, space } = useEventLite();
  const portal = portalable([], space, on, emit, remove);
  return {
    on,
    emit,
    remove,
    space,
    portal,
  };
}
