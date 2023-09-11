"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SketchEraserCompact = exports.SketchEraser = void 0;
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
const sketch_plugin_1 = require("./sketch-plugin");
class SketchEraser extends sketch_plugin_1.SketchPlugin {
    constructor() {
        super('eraser');
        this.radius = 5;
    }
    HandleDraw({ offsetX, offsetY }) {
        var _a;
        const ctx = (_a = this.canvas_) === null || _a === void 0 ? void 0 : _a.getContext('2d');
        if (ctx) {
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(offsetX, offsetY, this.radius, 0, (2 * Math.PI));
            ctx.fill();
            ctx.restore();
        }
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'number' })
], SketchEraser.prototype, "radius", void 0);
exports.SketchEraser = SketchEraser;
function SketchEraserCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(SketchEraser);
}
exports.SketchEraserCompact = SketchEraserCompact;
