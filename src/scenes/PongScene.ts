import { IScene } from "./IScene";
import { createBall, createPaddle } from "../prefabs";
import { Vector2 } from "../types";
import { Random } from "../utils";
import { Entity, World } from "ecsy";

export class PongScene implements IScene {
  ball: Entity;
  paddle1: Entity;
  paddle2: Entity;

  load(world: World, canvas: HTMLCanvasElement): void {
    const ballRadius = 10;
    // Instantiate a circle entity on the middle of the canvas
    this.ball = createBall(
      world,
      new Vector2(
        canvas.width / 2 - ballRadius,
        canvas.height / 2 - ballRadius
      ),
      Random.getRandomDirection(),
      10,
      3
    );

    // Instantiate paddles
    const paddleSize = new Vector2(20, 120);
    const paddleSpeed = 6;
    const paddleOffset = 10;

    // Player 1
    this.paddle1 = createPaddle(
      world,
      0,
      new Vector2(paddleOffset, canvas.height / 2 - paddleSize.y / 2),
      new Vector2(),
      paddleSpeed,
      paddleSize
    );

    // Player 2
    this.paddle2 = createPaddle(
      world,
      1,
      new Vector2(
        canvas.width - paddleSize.x - paddleOffset,
        canvas.height / 2 - paddleSize.y / 2
      ),
      new Vector2(),
      paddleSpeed,
      paddleSize
    );
  }
  unload(): void {
    this.ball.remove();
    this.paddle1.remove();
    this.paddle2.remove();
  }
}
