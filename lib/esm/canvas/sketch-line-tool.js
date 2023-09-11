var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Property } from "@benbraide/inlinejs-element";
import { SketchTool } from "./sketch-tool";
export class SketchLineTool extends SketchTool {
    constructor(name) {
        super(name);
        this.color = 'black';
        this.mode = 'stroke';
        this.lineWidth = 1;
        this.lineCap = 'round';
    }
    HandleBeginDraw(params) {
        var _a;
        super.HandleBeginDraw(params);
        const ctx = (_a = this.canvas_) === null || _a === void 0 ? void 0 : _a.getContext('2d');
        if (ctx) {
            ctx.lineCap = this.lineCap;
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.color;
            ctx.fillStyle = this.color;
        }
    }
}
__decorate([
    Property({ type: 'string' })
], SketchLineTool.prototype, "color", void 0);
__decorate([
    Property({ type: 'string' })
], SketchLineTool.prototype, "mode", void 0);
__decorate([
    Property({ type: 'number' })
], SketchLineTool.prototype, "lineWidth", void 0);
__decorate([
    Property({ type: 'string' })
], SketchLineTool.prototype, "lineCap", void 0);
