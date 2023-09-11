"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SketchLineCompact = exports.SketchLine = void 0;
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
const sketch_line_tool_1 = require("./sketch-line-tool");
class SketchLine extends sketch_line_tool_1.SketchLineTool {
    constructor() {
        super('line');
    }
    HandleDraw_(ctx, offsetX, offsetY) {
        ctx.moveTo(this.saved_.x, this.saved_.y);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    }
}
exports.SketchLine = SketchLine;
function SketchLineCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(SketchLine);
}
exports.SketchLineCompact = SketchLineCompact;
