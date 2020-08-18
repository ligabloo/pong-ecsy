import { World } from "ecsy";
import {
  BallComponent,
  CanvasContextComponent,
  CollidableComponent,
  GameStateComponent,
  MovementComponent,
  PaddleComponent,
  PositionComponent,
  RadiusComponent,
  RenderComponent,
  SizeComponent,
} from "./components";
import { PongScene } from "./scenes";
import {
  BallSystem,
  CollisionSystem,
  MovementSystem,
  PaddleSystem,
  RendererSystem,
  GameSystem,
} from "./systems";
import { Player } from "./types";

// Instantiate ECSY world
export const world = new World();

// Register ECSY components
world
  .registerComponent(BallComponent)
  .registerComponent(CanvasContextComponent)
  .registerComponent(CollidableComponent)
  .registerComponent(GameStateComponent)
  .registerComponent(MovementComponent)
  .registerComponent(PositionComponent)
  .registerComponent(PaddleComponent)
  .registerComponent(RadiusComponent)
  .registerComponent(RenderComponent)
  .registerComponent(SizeComponent)
  .registerSystem(GameSystem)
  .registerSystem(CollisionSystem)
  .registerSystem(RendererSystem)
  .registerSystem(BallSystem)
  .registerSystem(PaddleSystem)
  .registerSystem(MovementSystem);

// Initialize our GameState singleton
const gameStateEntity = world.createEntity().addComponent(GameStateComponent);
const gameState = gameStateEntity.getMutableComponent<GameStateComponent>(
  GameStateComponent
);

// Get a reference to our canvas HTML element
const canvas = document.getElementById("game") as HTMLCanvasElement;

// Create CanvasContext singleton entity and provide it the canvas context and dimensions
world.createEntity().addComponent(CanvasContextComponent, {
  ctx: canvas.getContext("2d"),
  width: canvas.width,
  height: canvas.height,
});

// Load our game scene into the world
const pongScene = new PongScene();
pongScene.load(world, canvas);

// Monitor for keyboard events

window.addEventListener(
  "keydown",
  (e) => {
    gameState.pressedKeyCodes = [...gameState.pressedKeyCodes, e.keyCode];
  },
  false
);

window.addEventListener(
  "keyup",
  (e) => {
    gameState.pressedKeyCodes = gameState.pressedKeyCodes.filter(
      (keyCode) => keyCode !== e.keyCode
    );
  },
  false
);

// Implement and execute game loop
function update() {
  world.execute();
  requestAnimationFrame(update);
}

update();
