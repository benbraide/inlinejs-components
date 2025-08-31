var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
export class StyleElement extends CustomElement {
    constructor() {
        super({
            isTemplate: true,
            isHidden: true,
        });
        this.style_ = null;
        this.src = '';
    }
    HandleElementScopeDestroyed_(scope) {
        var _a;
        super.HandleElementScopeDestroyed_(scope);
        (_a = this.style_) === null || _a === void 0 ? void 0 : _a.remove();
        this.style_ = null;
    }
    HandlePostAttributesProcessPostfix_() {
        super.HandlePostAttributesProcessPostfix_();
        const content = (this.textContent || '').trim();
        if (!content && !this.src) {
            return;
        }
        if (this.src) {
            const link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = this.src;
            this.style_ = link;
        }
        else {
            const style = document.createElement('style');
            style.textContent = content;
            this.style_ = style;
        }
        document.body.appendChild(this.style_);
    }
}
__decorate([
    Property({ type: 'string' })
], StyleElement.prototype, "src", void 0);
export function StyleElementCompact() {
    RegisterCustomElement(StyleElement, 'style');
}
