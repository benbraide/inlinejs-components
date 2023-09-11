import { RegisterCustomElement } from "@benbraide/inlinejs-element";
import { SketchLineTool } from "./sketch-line-tool";
export class SketchRectangle extends SketchLineTool {
    constructor() {
        super('rectangle');
    }
    HandleDraw_(ctx, offsetX, offsetY) {
        if (this.mode === 'fill') {
            ctx.fillRect(this.saved_.x, this.saved_.y, (offsetX - this.saved_.x), (offsetY - this.saved_.y));
        }
        else {
            ctx.strokeRect(this.saved_.x, this.saved_.y, (offsetX - this.saved_.x), (offsetY - this.saved_.y));
        }
    }
}
export function SketchRectangleCompact() {
    RegisterCustomElement(SketchRectangle);
}
