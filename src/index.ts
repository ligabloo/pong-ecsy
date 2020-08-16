import { World, Entity } from "ecsy";
import {
  CanvasContext,
  Movement,
  Radius,
  Renderable,
  Size,
  Ball,
  Position,
  Paddle,
} from "./components";
import { BallSystem, RendererSystem } from "./systems";
import { Vector2 } from "./types/Vector2Type";
import { getRandomDirection } from "./utils";

// Instantiate ECSY world
export const world = new World();

// Register ECSY components
world
  .registerComponent(Ball)
  .registerComponent(CanvasContext)
  .registerComponent(Movement)
  .registerComponent(Position)
  .registerComponent(Paddle)
  .registerComponent(Radius)
  .registerComponent(Renderable)
  .registerComponent(Size)
  .registerSystem(RendererSystem)
  .registerSystem(BallSystem);

// Get reference to the HTML canvas element
const canvas = document.getElementById("game") as HTMLCanvasElement;

// Create CanvasContext entity and provide it the canvas context and dimensions
world.createEntity().addComponent(CanvasContext, {
  ctx: canvas.getContext("2d"),
  width: canvas.width,
  height: canvas.height,
});

// Instantiate a circle entity on the middle of the canvas
world
  .createEntity("ball")
  .addComponent(Ball)
  .addComponent(Movement, {
    direction: getRandomDirection(),
    velocity: 10,
  })
  .addComponent(Renderable, {
    primitive: "circle",
  })
  .addComponent(Position, {
    value: new Vector2(canvas.width / 2, canvas.height / 2),
  })
  .addComponent(Radius, { value: 10 });

// Instantiate paddles
const paddleSize = new Vector2(20, 100);

world
  .createEntity("paddle1")
  .addComponent(Renderable, {
    primitive: "rect",
  })
  .addComponent(Position, {
    value: new Vector2(10, canvas.height / 2 - paddleSize.y / 2),
  })
  .addComponent(Size, { value: paddleSize });

world
  .createEntity("paddle2")
  .addComponent(Renderable, {
    primitive: "rect",
  })
  .addComponent(Position, {
    value: new Vector2(
      canvas.width - paddleSize.x - 10,
      canvas.height / 2 - paddleSize.y / 2
    ),
  })
  .addComponent(Size, { value: paddleSize });

// Implement game loop
let lastTime = performance.now();

function update() {
  const time = performance.now();
  const delta = (time - lastTime) / 60;

  world.execute(delta, time);

  lastTime = time;
  requestAnimationFrame(update);
}

update();
