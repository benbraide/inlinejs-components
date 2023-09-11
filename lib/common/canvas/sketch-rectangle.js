"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SketchRectangleCompact = exports.SketchRectangle = void 0;
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
const sketch_line_tool_1 = require("./sketch-line-tool");
class SketchRectangle extends sketch_line_tool_1.SketchLineTool {
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
exports.SketchRectangle = SketchRectangle;
function SketchRectangleCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(SketchRectangle);
}
exports.SketchRectangleCompact = SketchRectangleCompact;
