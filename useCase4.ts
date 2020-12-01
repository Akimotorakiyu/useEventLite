import { useEventPortal } from "./index";

const { portal } = useEventPortal();

const smile = (...something) => {
  console.log("smiling!", ...something);
};

// 船新的事件监听使用方式
portal.eat.drink.smile.on(smile);

// 船新的事件触发使用方式
portal.eat.drink.smile.emit("湫");
portal.eat.drink.smile.emit("敲", "可", "爱", "!");

// 船新的移除
portal.eat.drink.smile.remove(smile);
portal.eat.drink.smile.emit("O(∩_∩)O");
