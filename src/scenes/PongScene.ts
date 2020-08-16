import { IScene } from "./IScene";
import { createBall, createPaddle } from "../prefabs";
import { Vector2 } from "../types/Vector2Type";
import { Random } from "../utils";
import { Entity, World } from "ecsy";

export class PongScene implements IScene {
  ball: Entity;
  paddle1: Entity;
  paddle2: Entity;

  load(world: World, canvas: HTMLCanvasElement): void {
    // Instantiate a circle entity on the middle of the canvas
    this.ball = createBall(
      world,
      new Vector2(canvas.width / 2, canvas.height / 2),
      Random.getRandomDirection(),
      10,
      10
    );

    // Instantiate paddles
    const paddleSize = new Vector2(20, 120);

    // Player 1
    this.paddle1 = createPaddle(
      world,
      0,
      new Vector2(10, canvas.height / 2 - paddleSize.y / 2),
      new Vector2(),
      10,
      paddleSize
    );

    // Player 2
    this.paddle2 = createPaddle(
      world,
      1,
      new Vector2(
        canvas.width - paddleSize.x - 10,
        canvas.height / 2 - paddleSize.y / 2
      ),
      new Vector2(),
      10,
      paddleSize
    );
  }
  unload(): void {
    this.ball.remove();
    this.paddle1.remove();
    this.paddle2.remove();
  }
}
