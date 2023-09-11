import { SketchPlugin } from "./sketch-plugin";
export class SketchTool extends SketchPlugin {
    constructor(name) {
        super(name);
        this.saved_ = {
            image: null,
            x: 0,
            y: 0,
        };
        this.checkpoint_ = 0;
    }
    HandleBeginDraw({ offsetX, offsetY }) {
        var _a;
        this.saved_ = {
            image: (((_a = this.canvas_) === null || _a === void 0 ? void 0 : _a.toDataURL()) || null),
            x: offsetX,
            y: offsetY,
        };
    }
    HandleEndDraw() {
        this.saved_ = {
            image: null,
            x: 0,
            y: 0,
        };
    }
    HandleDraw({ offsetX, offsetY }) {
        var _a;
        const ctx = (_a = this.canvas_) === null || _a === void 0 ? void 0 : _a.getContext('2d');
        if (!ctx) {
            return;
        }
        const checkpoint = ++this.checkpoint_, draw = (ctx) => {
            if (checkpoint == this.checkpoint_) {
                ctx.save();
                ctx.beginPath();
                this.HandleDraw_(ctx, offsetX, offsetY);
                ctx.restore();
            }
        };
        if (this.saved_.image) {
            const image = new Image();
            image.onload = () => {
                ctx.clearRect(0, 0, this.canvas_.width, this.canvas_.height);
                ctx.drawImage(image, 0, 0);
                draw(ctx);
            };
            image.src = this.saved_.image;
        }
        else {
            draw(ctx);
        }
    }
    HandleDraw_(ctx, offsetX, offsetY) { }
}
