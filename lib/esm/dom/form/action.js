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
import { EvaluateLater, FindAncestorByTagName, GetGlobal, JournalError } from "@benbraide/inlinejs";
import { CustomElement, RegisterCustomElement } from "@benbraide/inlinejs-element";
export class FormAction extends CustomElement {
    constructor() {
        super({
            isTemplate: true,
            isHidden: true,
        });
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), postAttributesCallback);
        const form = FindAncestorByTagName(this, 'FORM');
        if (form) {
            const content = (this.textContent || '').trim();
            const evaluate = EvaluateLater({
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
            JournalError('Form action must be used within a form element', GetGlobal().GetConfig().GetElementName('form-action'), this);
        }
    }
}
export function FormActionCompact() {
    RegisterCustomElement(FormAction);
}
