import { System, Entity } from "ecsy";
import {
  RenderComponent,
  SizeComponent,
  CanvasContextComponent,
  PositionComponent,
} from "../components";

export class RendererSystem extends System {
  static queries = {
    canvas: { components: [CanvasContextComponent] },
    renderables: { components: [RenderComponent] },
  };

  execute(): void {
    const canvas = this.queries.canvas.results[0];
    const {
      ctx,
      width: canvasWidth,
      height: canvasHeight,
    } = canvas.getComponent<CanvasContextComponent>(CanvasContextComponent);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw a line and a circle on the middle of the canvas,
    // because I couldn't be bothered to make a system for that!
    ctx.strokeStyle = "gray";
    ctx.fillStyle = "gray";

    ctx.beginPath();
    ctx.moveTo(canvasWidth / 2, 0);
    ctx.lineTo(canvasWidth / 2, canvasHeight);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(canvasWidth / 2, canvasHeight / 2, 10, 0, 2 * Math.PI, false);
    ctx.fill();

    this.queries.renderables.results.forEach((entity) => {
      const { primitive, isEnabled } = entity.getComponent<RenderComponent>(
        RenderComponent
      );
      const position = entity.getComponent<PositionComponent>(
        PositionComponent
      );
      const size = entity.getComponent<SizeComponent>(SizeComponent);

      // If not enabled, skip render
      if (!isEnabled) return;

      const renderFunctions = {
        rect: this.renderRect,
        circle: this.renderCircle,
      };

      if (renderFunctions[primitive]) {
        renderFunctions[primitive](ctx, position, size);
      } else {
        console.log(
          `${primitive} primitive does not implement a render function`
        );
      }
    });
  }

  renderRect(
    ctx: CanvasRenderingContext2D,
    position: PositionComponent,
    size: SizeComponent
  ): void {
    ctx.beginPath();
    ctx.rect(position.value.x, position.value.y, size.value.x, size.value.y);
    ctx.fillStyle = "white";
    ctx.fill();
  }

  renderCircle(
    ctx: CanvasRenderingContext2D,
    position: PositionComponent,
    size: SizeComponent
  ): void {
    ctx.beginPath();
    ctx.arc(
      position.value.x + size.value.x / 2,
      position.value.y + size.value.y / 2,
      size.value.x / 2,
      0,
      2 * Math.PI,
      false
    );
    ctx.fillStyle = "white";
    ctx.fill();
  }
}
