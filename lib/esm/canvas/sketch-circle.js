import { RegisterCustomElement } from "@benbraide/inlinejs-element";
import { SketchLineTool } from "./sketch-line-tool";
export class SketchCircle extends SketchLineTool {
    constructor() {
        super('circle');
    }
    HandleDraw_(ctx, offsetX, offsetY) {
        const radius = Math.max(Math.abs(offsetX - this.saved_.x), Math.abs(offsetY - this.saved_.y));
        ctx.arc(this.saved_.x, this.saved_.y, radius, 0, (2 * Math.PI));
        (this.mode === 'fill') ? ctx.fill() : ctx.stroke();
    }
}
export function SketchCircleCompact() {
    RegisterCustomElement(SketchCircle);
}
