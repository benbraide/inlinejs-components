var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { FindComponentById } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
export class AttributeEventElement extends CustomElement {
    constructor() {
        super({
            isTemplate: true,
            isHidden: true,
        });
        this.target = null;
        this.context = null;
        this.type = '';
    }
    HandlePostAttributesProcessPostfix_() {
        var _a;
        super.HandlePostAttributesProcessPostfix_();
        const scope = (_a = FindComponentById(this.componentId_)) === null || _a === void 0 ? void 0 : _a.FindElementScope(this);
        if (!scope)
            return;
        const target = (this.target || this.parentElement), type = this.type;
        if (target && type) {
            (Array.isArray(type) ? type : [type]).forEach((t) => target.setAttribute(`on${t}`, (this.textContent || '')));
            scope.AddUninitCallback(() => (Array.isArray(type) ? type : [type]).forEach((t) => target.removeAttribute(`on${t}`)));
        }
    }
}
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], AttributeEventElement.prototype, "target", void 0);
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], AttributeEventElement.prototype, "context", void 0);
__decorate([
    Property({ type: 'array', checkStoredObject: true })
], AttributeEventElement.prototype, "type", void 0);
export function AttributeEventElementCompact() {
    RegisterCustomElement(AttributeEventElement, 'attribute-event');
}
