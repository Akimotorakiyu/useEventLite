import { useInvokeLite } from "./index";

const { on, invoke } = useInvokeLite();

function sleep(time: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(null);
    }, time);
  });
}

on("echo", (ctx, next) => {
  next();
});

invoke("echo", {
  info: "fish",
}).then(console.log);

interface CTX {
  foods: string[];
}

function isT<T>(it: unknown): it is T {
  return true;
}

async function eat() {
  on("eat", async (ctx, next) => {
    if (isT<CTX>(ctx)) {
      await sleep(1000);
      console.log(1);
      ctx.foods.splice(0, 1);
      await next();
    }
  });

  on("eat", async (ctx, next) => {
    if (isT<CTX>(ctx)) {
      await sleep(1000);
      console.log(2);
      ctx.foods.splice(0, 1);

      await next();
    }
  });

  console.log("3", await invoke("eat", { foods: ["fish", "water"] }));
}

eat();
