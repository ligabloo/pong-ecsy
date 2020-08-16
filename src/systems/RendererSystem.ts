import { System, Entity } from "ecsy";
import {
  RenderComponent,
  SizeComponent,
  CanvasContextComponent,
  RadiusComponent,
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

    this.queries.renderables.results.forEach((entity) => {
      const { primitive, isEnabled } = entity.getComponent<RenderComponent>(
        RenderComponent
      );

      // If not enabled, skip render
      if (!isEnabled) return;

      const renderFunctions = {
        rect: this.renderRect,
        circle: this.renderCircle,
      };

      if (renderFunctions[primitive]) {
        renderFunctions[primitive](ctx, entity);
      } else {
        console.log(
          `${primitive} primitive does not implement a render function`
        );
      }
    });
  }

  renderRect(ctx: CanvasRenderingContext2D, entity: Entity): void {
    const { value: position } = entity.getComponent<PositionComponent>(
      PositionComponent
    );
    const { value: size } = entity.getComponent<SizeComponent>(SizeComponent);
    ctx.beginPath();
    ctx.rect(position.x, position.y, size.x, size.y);
    ctx.fillStyle = "white";
    ctx.fill();
  }

  renderCircle(ctx: CanvasRenderingContext2D, entity: Entity): void {
    const { value: position } = entity.getComponent<PositionComponent>(
      PositionComponent
    );
    const { value: radius } = entity.getComponent<RadiusComponent>(
      RadiusComponent
    );
    ctx.beginPath();
    ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "white";
    ctx.fill();
  }
}
