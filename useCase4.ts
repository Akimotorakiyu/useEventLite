import { useEventLite } from "./index";
const { on, space, emit, portal } = useEventLite();

// 使用 portal 语法糖
// 监听 嵌套命名空间 事件
portal.eat.drink.smile.on = (...something) => {
  console.log("smiling!", ...something);
};

// 触发 嵌套命名空间 事件
portal.eat.drink.smile.emit = "湫";
portal.eat.drink.smile.emit = ["敲", "可", "爱", "!"];




