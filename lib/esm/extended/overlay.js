var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
export class OverlayElement extends CustomElement {
    constructor() {
        super();
        this.showCount_ = 0;
        this.isVisibile_ = false;
        this.zIndex_ = 999;
        this.width_ = '100vw';
        this.visibleClass = 'overlay';
        this.overflowClass = 'overflow';
        this.visibleTarget = null;
        this.custom = false;
        this.style.width = '0';
        this.style.zIndex = `${this.zIndex_}`;
        this.addEventListener('click', (e) => {
            window.dispatchEvent(new CustomEvent('overlay.click', {
                detail: { native: e, overlay: this, bubbled: (e.target !== this) },
            }));
        });
    }
    UpdateZIndexProperty(value) {
        this.zIndex_ = value;
        this.style.zIndex = `${value}`;
    }
    UpdateWidthProperty(value) {
        this.width_ = value;
        this.isVisibile_ && (this.style.width = value);
    }
    Show() {
        ++this.showCount_;
        this.ToggleVisibility_(true);
    }
    Hide() {
        (this.showCount_ > 0) && --this.showCount_;
        (this.showCount_ === 0) && this.ToggleVisibility_(false);
    }
    SetShowCount(count) {
        this.showCount_ = count;
        this.ToggleVisibility_(count > 0);
    }
    GetShowCount() {
        return this.showCount_;
    }
    IsVisible() {
        return this.isVisibile_;
    }
    GetZIndex() {
        return this.zIndex_;
    }
    GetWidth() {
        return this.width_;
    }
    HandlePostAttributesProcessPostfix_() {
        super.HandlePostAttributesProcessPostfix_();
        if (!this.custom) {
            this.style.position = 'fixed';
            this.style.top = '0';
            this.style.left = '0';
            this.style.height = '100vh';
            this.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            ('backdropFilter' in this.style) && this.style.setProperty('backdrop-filter', 'blur(4px)');
            this.style.overflow = 'hidden';
        }
    }
    ToggleVisibility_(show) {
        if (show === this.isVisibile_) {
            return;
        }
        const visibleTarget = (this.visibleTarget || document.body), isOverflow = (visibleTarget.clientHeight < visibleTarget.scrollHeight);
        if (show) {
            this.visibleClass && visibleTarget.classList.add(this.visibleClass);
            isOverflow && this.overflowClass && visibleTarget.classList.add(this.overflowClass);
        }
        else {
            this.visibleClass && visibleTarget.classList.contains(this.visibleClass) && visibleTarget.classList.remove(this.visibleClass);
            this.overflowClass && visibleTarget.classList.contains(this.overflowClass) && visibleTarget.classList.remove(this.overflowClass);
        }
        this.isVisibile_ = show;
        this.style.width = (show ? this.width_ : '0');
        window.dispatchEvent(new CustomEvent('overlay.visibility', {
            detail: { overlay: this, isVisible: show },
        }));
        window.dispatchEvent(new CustomEvent(`overlay.${show ? 'visible' : 'hidden'}`, {
            detail: { overlay: this },
        }));
    }
}
__decorate([
    Property({ type: 'string' })
], OverlayElement.prototype, "visibleClass", void 0);
__decorate([
    Property({ type: 'string' })
], OverlayElement.prototype, "overflowClass", void 0);
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], OverlayElement.prototype, "visibleTarget", void 0);
__decorate([
    Property({ type: 'boolean' })
], OverlayElement.prototype, "custom", void 0);
__decorate([
    Property({ type: 'number' })
], OverlayElement.prototype, "UpdateZIndexProperty", null);
__decorate([
    Property({ type: 'string' })
], OverlayElement.prototype, "UpdateWidthProperty", null);
export function OverlayElementCompact() {
    RegisterCustomElement(OverlayElement, 'overlay');
}
