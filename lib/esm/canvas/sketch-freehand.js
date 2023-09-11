import { RegisterCustomElement } from "@benbraide/inlinejs-element";
import { SketchLinePlugin } from "./sketch-line-plugin";
export class SketchFreehand extends SketchLinePlugin {
    constructor() {
        super('freehand');
    }
    HandleDraw({ offsetX, offsetY }) {
        var _a;
        const ctx = (_a = this.canvas_) === null || _a === void 0 ? void 0 : _a.getContext('2d');
        if (ctx) {
            ctx.lineTo(offsetX, offsetY);
            ctx.stroke();
        }
    }
}
export function SketchFreehandCompact() {
    RegisterCustomElement(SketchFreehand);
}
