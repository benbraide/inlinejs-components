var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
import { SketchPlugin } from "./sketch-plugin";
export class SketchHistory extends SketchPlugin {
    constructor() {
        super('history');
        this.index_ = 0;
        this.entries_ = new Array();
        this.isSaved_ = false;
        this.savedBeforeUndo_ = false;
        this.size = -1;
    }
    HandleBeginDraw() {
        this.Save_();
    }
    HandleEndDraw() {
        this.isSaved_ = false;
    }
    Undo() {
        if (!this.canvas_ || this.index_ == 0 || this.entries_.length == 0) {
            return;
        }
        const ctx = this.canvas_.getContext('2d');
        if (!ctx) {
            return;
        }
        const image = new Image();
        image.onload = () => {
            ctx.clearRect(0, 0, this.canvas_.width, this.canvas_.height);
            ctx.drawImage(image, 0, 0);
        };
        if (!this.isSaved_) {
            this.Save_();
            this.savedBeforeUndo_ = true;
            image.src = this.entries_[this.index_ -= 2];
        }
        else {
            image.src = this.entries_[this.index_ -= ((this.savedBeforeUndo_ && this.index_ >= this.entries_.length) ? 2 : 1)];
        }
    }
    Redo() {
        if (!this.canvas_ || this.index_ == this.entries_.length) {
            return;
        }
        const ctx = this.canvas_.getContext('2d');
        if (!ctx) {
            return;
        }
        const image = new Image();
        image.onload = () => {
            ctx.clearRect(0, 0, this.canvas_.width, this.canvas_.height);
            ctx.drawImage(image, 0, 0);
        };
        image.src = this.entries_[++this.index_];
        this.index_ = ((this.savedBeforeUndo_ && this.index_ >= (this.entries_.length - 1)) ? this.entries_.length : this.index_);
    }
    Reset() {
        if (!this.canvas_) {
            return;
        }
        const ctx = this.canvas_.getContext('2d');
        if (!ctx) {
            return;
        }
        ctx.clearRect(0, 0, this.canvas_.width, this.canvas_.height);
        this.index_ = 0;
        this.entries_ = new Array();
    }
    Save_() {
        if (!this.canvas_ || this.isSaved_ || !this.size) {
            return;
        }
        const image = this.canvas_.toDataURL('image/png');
        (this.size > 0 && this.entries_.length >= this.size) && this.entries_.shift();
        (this.index_ < this.entries_.length) ? this.entries_.splice(this.index_, (this.entries_.length - this.index_), image) : this.entries_.push(image);
        this.index_ = this.entries_.length;
        this.isSaved_ = true;
        this.savedBeforeUndo_ = false;
    }
}
__decorate([
    Property({ type: 'number' })
], SketchHistory.prototype, "size", void 0);
export function SketchHistoryCompact() {
    RegisterCustomElement(SketchHistory);
}
