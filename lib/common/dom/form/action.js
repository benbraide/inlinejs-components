"use strict";
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
exports.FormActionCompact = exports.FormAction = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
class FormAction extends inlinejs_element_1.CustomElement {
    constructor() {
        super({
            isTemplate: true,
            isHidden: true,
        });
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), postAttributesCallback);
        const form = (0, inlinejs_1.FindAncestorByTagName)(this, 'FORM');
        if (form) {
            const content = (this.textContent || '').trim();
            const evaluate = (0, inlinejs_1.EvaluateLater)({
                componentId: this.componentId_,
                contextElement: this,
                expression: content,
                disableFunctionCall: true,
            });
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                evaluate();
            });
        }
        else {
            (0, inlinejs_1.JournalError)('Form action must be used within a form element', (0, inlinejs_1.GetGlobal)().GetConfig().GetElementName('form-action'), this);
        }
    }
}
exports.FormAction = FormAction;
function FormActionCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(FormAction);
}
exports.FormActionCompact = FormActionCompact;
