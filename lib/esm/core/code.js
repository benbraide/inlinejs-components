var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DeepCopy, EvaluateLater, GetGlobal, InferComponent, IsEqual, UseEffect } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
export class CodeElement extends CustomElement {
    constructor() {
        super({
            isTemplate: true,
            isHidden: true,
        });
        this.context = null;
        this.name = '';
        this.watch = '';
        this.template = false;
        this.effect = false;
    }
    HandlePostAttributesProcessPostfix_() {
        var _a, _b;
        super.HandlePostAttributesProcessPostfix_();
        const content = (this.textContent || '').trim();
        this.name && ((_a = GetGlobal().GetConcept('code')) === null || _a === void 0 ? void 0 : _a.AddBlock(this.name, content));
        if (!this.template) {
            const evaluate = EvaluateLater({
                componentId: ((this.context && ((_b = InferComponent(this.context)) === null || _b === void 0 ? void 0 : _b.GetId())) || this.componentId_),
                contextElement: (this.context || this),
                expression: content,
                disableFunctionCall: true,
            });
            if (this.effect) {
                UseEffect({
                    componentId: this.componentId_,
                    contextElement: this,
                    callback: () => this.EvaluateWithStoredProxyAccessHandler(evaluate),
                });
            }
            else if (this.watch) { //Execute once on load and then whenever the watch expression changes
                let lastValue = undefined, isFirstEntry = true;
                UseEffect({
                    componentId: this.componentId_,
                    contextElement: this,
                    callback: () => {
                        EvaluateLater({
                            componentId: this.componentId_,
                            contextElement: this,
                            expression: this.watch,
                            disableFunctionCall: false,
                        })((value) => {
                            if (isFirstEntry || !IsEqual(value, lastValue)) {
                                isFirstEntry = false;
                                lastValue = DeepCopy(value);
                                this.EvaluateWithStoredProxyAccessHandler(evaluate);
                            }
                        });
                    },
                });
            }
            else {
                this.EvaluateWithStoredProxyAccessHandler(evaluate);
            }
        }
    }
}
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], CodeElement.prototype, "context", void 0);
__decorate([
    Property({ type: 'string' })
], CodeElement.prototype, "name", void 0);
__decorate([
    Property({ type: 'string' })
], CodeElement.prototype, "watch", void 0);
__decorate([
    Property({ type: 'boolean' })
], CodeElement.prototype, "template", void 0);
__decorate([
    Property({ type: 'boolean' })
], CodeElement.prototype, "effect", void 0);
export function CodeElementCompact() {
    RegisterCustomElement(CodeElement, 'code');
}
