"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeCompact = exports.Code = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
class Code extends inlinejs_element_1.CustomElement {
    constructor() {
        super({
            isTemplate: true,
            isHidden: true,
        });
        this.name = '';
        this.watch = '';
        this.template = false;
        this.effect = false;
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), () => {
            var _a;
            const content = (this.textContent || '').trim();
            this.name && ((_a = (0, inlinejs_1.GetGlobal)().GetConcept('code')) === null || _a === void 0 ? void 0 : _a.AddBlock(this.name, content));
            if (!this.template) {
                const evaluate = (0, inlinejs_1.EvaluateLater)({
                    componentId: this.componentId_,
                    contextElement: this,
                    expression: content,
                    disableFunctionCall: true,
                });
                if (this.effect) {
                    (0, inlinejs_1.UseEffect)({
                        componentId: this.componentId_,
                        contextElement: this,
                        callback: () => evaluate(),
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
                                    evaluate();
                                }
                            });
                        },
                    });
                }
                else {
                    evaluate();
                }
            }
            postAttributesCallback && postAttributesCallback();
        });
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], Code.prototype, "name", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], Code.prototype, "watch", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], Code.prototype, "template", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'boolean' })
], Code.prototype, "effect", void 0);
exports.Code = Code;
function CodeCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(Code);
}
exports.CodeCompact = CodeCompact;
