var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
export class ProcessElement extends CustomElement {
    constructor() {
        super({
            isTemplate: false,
            isHidden: false,
        });
        this.callback_ = null;
        this.active_ = false;
    }
    UpdateActiveProperty(value) {
        if (!this.active_ && (this.active_ = value) && this.callback_) {
            this.callback_();
            this.callback_ = null;
        }
    }
    ;
    ProcessDirectivesCallback(callback) {
        this.active_ ? callback() : (this.callback_ = callback);
    }
    HandleElementScopeCreated_(params, postAttributesCallback) {
        super.HandleElementScopeCreated_(params, () => {
            if (!this.active_ && this.callback_) {
                this.callback_();
                this.callback_ = null;
            }
            postAttributesCallback === null || postAttributesCallback === void 0 ? void 0 : postAttributesCallback();
        });
    }
}
__decorate([
    Property({ type: 'boolean' })
], ProcessElement.prototype, "UpdateActiveProperty", null);
export function ProcessElementCompact() {
    RegisterCustomElement(ProcessElement, 'process');
}
