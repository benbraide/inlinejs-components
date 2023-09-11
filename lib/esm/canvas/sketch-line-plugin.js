var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Property } from "@benbraide/inlinejs-element";
import { SketchPlugin } from "./sketch-plugin";
export class SketchLinePlugin extends SketchPlugin {
    constructor(name) {
        super(name);
        this.color = 'black';
        this.lineWidth = 1;
        this.lineCap = 'round';
    }
    HandleBeginDraw({ offsetX, offsetY }) {
        var _a;
        const ctx = (_a = this.canvas_) === null || _a === void 0 ? void 0 : _a.getContext('2d');
        if (ctx) {
            ctx.lineCap = this.lineCap;
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.color;
            ctx.moveTo(offsetX, offsetY);
        }
    }
    HandleEndDraw(params) {
        var _a, _b;
        (_b = (_a = this.canvas_) === null || _a === void 0 ? void 0 : _a.getContext('2d')) === null || _b === void 0 ? void 0 : _b.closePath();
    }
}
__decorate([
    Property({ type: 'string' })
], SketchLinePlugin.prototype, "color", void 0);
__decorate([
    Property({ type: 'number' })
], SketchLinePlugin.prototype, "lineWidth", void 0);
__decorate([
    Property({ type: 'string' })
], SketchLinePlugin.prototype, "lineCap", void 0);
