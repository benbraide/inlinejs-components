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
exports.ScriptElementCompact = exports.ScriptElement = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
class ScriptElement extends inlinejs_element_1.CustomElement {
    constructor() {
        super({
            isTemplate: true,
            isHidden: true,
        });
        this.src = '';
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), () => {
            const insertScript = () => {
                const content = (this.textContent || '').trim();
                if (!content) {
                    return;
                }
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.textContent = content;
                document.body.appendChild(script);
                scope.AddUninitCallback(() => script.remove());
            };
            if (this.src) {
                const resourceConcept = (0, inlinejs_1.GetGlobal)().GetConcept('resource');
                if (resourceConcept) {
                    resourceConcept.GetScript(this.src);
                }
                else {
                    insertScript();
                }
            }
            else {
                insertScript();
            }
            postAttributesCallback && postAttributesCallback();
        });
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], ScriptElement.prototype, "src", void 0);
exports.ScriptElement = ScriptElement;
function ScriptElementCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(ScriptElement, 'script');
}
exports.ScriptElementCompact = ScriptElementCompact;
