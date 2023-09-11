"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SketchFreehandCompact = exports.SketchFreehand = void 0;
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
const sketch_line_plugin_1 = require("./sketch-line-plugin");
class SketchFreehand extends sketch_line_plugin_1.SketchLinePlugin {
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
exports.SketchFreehand = SketchFreehand;
function SketchFreehandCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(SketchFreehand);
}
exports.SketchFreehandCompact = SketchFreehandCompact;
