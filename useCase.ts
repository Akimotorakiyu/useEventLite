import { useEventLite } from "./index";

const { on, space, emit } = useEventLite();

// 常规监听
on("eat", () => {
  console.log("eating!");
});

// 常规触发
emit("eat"); //触发事件监听

// 带命名空间
space("eat", () => {
  // 命名空间内监听
  on("drink", () => {
    console.log("drinking!");
  });

  // 命名空间内触发
  emit("drink"); // 触发事件监听
});

emit("drink"); // 无效触发，不在命名空间内



