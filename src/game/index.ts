import { World } from "ecsy";
import { CanvasContext, Radius, Renderable, Size } from "./components";
import { RendererSystem } from "./systems";
import { Vector2 } from "./types/Vector2Type";

// Get reference to the HTML canvas element
const canvas = document.getElementById("game") as HTMLCanvasElement;

// Instantiate ECSY world
export const world = new World();

// Register ECSY components
world
  .registerComponent(CanvasContext)
  .registerComponent(Radius)
  .registerComponent(Renderable)
  .registerComponent(Size)
  .registerSystem(RendererSystem);

// Create canvas entity and save a reference to the CanvasContext component
world.createEntity().addComponent(CanvasContext, {
  ctx: canvas.getContext("2d"),
  width: canvas.width,
  height: canvas.height,
});

// Instantiate a circle entity on the middle of the canvas
world
  .createEntity()
  .addComponent(Renderable, {
    primitive: "circle",
    position: new Vector2(canvas.width / 2, canvas.height / 2),
  })
  .addComponent(Radius, { value: 10 });

// Instantiate paddles
const paddleSize = new Vector2(20, 100);

world
  .createEntity()
  .addComponent(Renderable, {
    primitive: "rect",
    position: new Vector2(10, canvas.height / 2 - paddleSize.y / 2),
  })
  .addComponent(Size, { value: paddleSize });

world
  .createEntity()
  .addComponent(Renderable, {
    primitive: "rect",
    position: new Vector2(
      canvas.width - paddleSize.x - 10,
      canvas.height / 2 - paddleSize.y / 2
    ),
  })
  .addComponent(Size, { value: paddleSize });

// Implement game loop
let lastTime = performance.now();

function update() {
  const time = performance.now();
  const delta = time - lastTime;

  world.execute(delta, time);

  lastTime = time;
  requestAnimationFrame(update);
}

update();
