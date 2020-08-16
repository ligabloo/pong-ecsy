import { Component, Types } from "ecsy";

interface ICanvasContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}

export class CanvasContext extends Component<ICanvasContext> {
  static schema = {
    ctx: { type: Types.Ref },
    width: { type: Types.Number },
    height: { type: Types.Number },
  };

  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}
