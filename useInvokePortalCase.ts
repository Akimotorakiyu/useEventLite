import { useInvokePortal } from "./index";

const { portal } = useInvokePortal();

function sleep(time: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(null);
    }, time);
  });
}

portal.echo.on((ctx, next) => {
  next();
});

portal.echo
  .invoke({
    foods: ["fish", "water"],
  })
  .then(console.log);

async function eat() {
  portal.eat.on(async (ctx, next) => {
    await sleep(1000);
    console.log(1);
    ctx.foods.splice(0, 1);
    await next();
  });

  portal.eat.on(async (ctx, next) => {
    await sleep(1000);
    console.log(2);
    ctx.foods.splice(0, 1);

    await next();
  });

  console.log("3", await portal.eat.invoke({ foods: ["fish", "water"] }));
}

eat();
