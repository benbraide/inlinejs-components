var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { EvaluateLater, InferComponent } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
export class EventElement extends CustomElement {
    constructor() {
        super({
            isTemplate: true,
            isHidden: true,
        });
        this.target = null;
        this.context = null;
        this.type = '';
        this.once = false;
        this.prevent = false;
        this.stop = false;
        this.stopImmediate = false;
        this.window = false;
        this.document = false;
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), () => {
            var _a;
            const target = (this.target || (this.window && window) || (this.document && document) || this.parentElement), type = this.type;
            if (target && type) {
                const evaluate = EvaluateLater({
                    componentId: ((this.context && ((_a = InferComponent(this.context)) === null || _a === void 0 ? void 0 : _a.GetId())) || this.componentId_),
                    contextElement: (this.context || this),
                    expression: (this.textContent || '').trim(),
                    disableFunctionCall: false,
                });
                const handler = (event) => {
                    this.prevent && event.preventDefault();
                    this.stop && event.stopPropagation();
                    this.stopImmediate && event.stopImmediatePropagation();
                    evaluate(undefined, [event], { event });
                    this.once && (Array.isArray(type) ? type : [type]).forEach((t) => target.removeEventListener(t, handler));
                };
                (Array.isArray(type) ? type : [type]).forEach((t) => target.addEventListener(t, handler));
                scope.AddUninitCallback(() => (Array.isArray(type) ? type : [type]).forEach((t) => target.removeEventListener(t, handler)));
            }
            postAttributesCallback && postAttributesCallback();
        });
    }
}
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], EventElement.prototype, "target", void 0);
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], EventElement.prototype, "context", void 0);
__decorate([
    Property({ type: 'array', checkStoredObject: true })
], EventElement.prototype, "type", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "once", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "prevent", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "stop", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "stopImmediate", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "window", void 0);
__decorate([
    Property({ type: 'boolean' })
], EventElement.prototype, "document", void 0);
export function EventElementCompact() {
    RegisterCustomElement(EventElement, 'event');
}
