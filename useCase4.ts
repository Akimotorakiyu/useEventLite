import { useEventLite, usePortal } from "./index";
const { portal } = usePortal();

portal.eat.drink.smile.on((...something) => {
  console.log("smiling!", ...something);
});

portal.eat.drink.smile.emit("湫");
portal.eat.drink.smile.emit("敲", "可", "爱", "!");
