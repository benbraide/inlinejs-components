import { RegisterCustomElement } from "@benbraide/inlinejs-element";
import { SketchLineTool } from "./sketch-line-tool";
export class SketchLine extends SketchLineTool {
    constructor() {
        super('line');
    }
    HandleDraw_(ctx, offsetX, offsetY) {
        ctx.moveTo(this.saved_.x, this.saved_.y);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    }
}
export function SketchLineCompact() {
    RegisterCustomElement(SketchLine);
}
