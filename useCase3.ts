import { useEventLite } from "./index";
import { namespace } from "./spaceable";
const { on, space, emit } = useEventLite();

// 使用 namespace.eat.drink 语法糖
space(namespace.eat.drink, () => {
  // 嵌套命名空间内监听
  on("smile", () => {
    console.log("smiling!");
  });

  // 嵌套命名空间内触发
  emit("smile"); // 触发事件监听
});
