"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeElementCompact = exports.CodeElement = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
class CodeElement extends inlinejs_element_1.CustomElement {
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
        this.name && ((_a = (0, inlinejs_1.GetGlobal)().GetConcept('code')) === null || _a === void 0 ? void 0 : _a.AddBlock(this.name, content));
        if (!this.template) {
            const evaluate = (0, inlinejs_1.EvaluateLater)({
                componentId: ((this.context && ((_b = (0, inlinejs_1.InferComponent)(this.context)) === null || _b === void 0 ? void 0 : _b.GetId())) || this.componentId_),
                contextElement: (this.context || this),
                expression: content,
                disableFunctionCall: true,
            });
            if (this.effect) {
                (0, inlinejs_1.UseEffect)({
                    componentId: this.componentId_,
                    contextElement: this,
                    callback: () => this.EvaluateWithStoredProxyAccessHandler(evaluate),
                });
            }
            else if (this.watch) { //Execute once on load and then whenever the watch expression changes
                let lastValue = undefined, isFirstEntry = true;
                (0, inlinejs_1.UseEffect)({
                    componentId: this.componentId_,
                    contextElement: this,
                    callback: () => {
                        (0, inlinejs_1.EvaluateLater)({
                            componentId: this.componentId_,
                            contextElement: this,
                            expression: this.watch,
                            disableFunctionCall: false,
                        })((value) => {
                            if (isFirstEntry || !(0, inlinejs_1.IsEqual)(value, lastValue)) {
                                isFirstEntry = false;
                                lastValue = (0, inlinejs_1.DeepCopy)(value);
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
    (0, inlinejs_element_1.Property)({ type: 'object', checkStoredObject: true })
], CodeElement.prototype, "context", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], CodeElement.prototype, "name", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], CodeElement.prototype, "watch", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], CodeElement.prototype, "template", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], CodeElement.prototype, "effect", void 0);
exports.CodeElement = CodeElement;
function CodeElementCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(CodeElement, 'code');
}
exports.CodeElementCompact = CodeElementCompact;
