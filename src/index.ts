import { World } from "ecsy";
import {
  BallComponent,
  CanvasContextComponent,
  CollidableComponent,
  MovementComponent,
  PaddleComponent,
  PositionComponent,
  RadiusComponent,
  RenderComponent,
  SizeComponent,
} from "./components";
import {
  MovementSystem,
  RendererSystem,
  CollisionSystem,
  BallSystem,
} from "./systems";
import { PongScene } from "./scenes";

// Instantiate ECSY world
export const world = new World();

// Register ECSY components
world
  .registerComponent(BallComponent)
  .registerComponent(CanvasContextComponent)
  .registerComponent(CollidableComponent)
  .registerComponent(MovementComponent)
  .registerComponent(PositionComponent)
  .registerComponent(PaddleComponent)
  .registerComponent(RadiusComponent)
  .registerComponent(RenderComponent)
  .registerComponent(SizeComponent)
  .registerSystem(CollisionSystem)
  .registerSystem(RendererSystem)
  .registerSystem(BallSystem)
  .registerSystem(MovementSystem);

// Get reference to the HTML canvas element
const canvas = document.getElementById("game") as HTMLCanvasElement;

// Create CanvasContext singleton entity and provide it the canvas context and dimensions
world.createEntity().addComponent(CanvasContextComponent, {
  ctx: canvas.getContext("2d"),
  width: canvas.width,
  height: canvas.height,
});

const pongScene = new PongScene();
pongScene.load(world, canvas);

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
