"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptElementCompact = exports.ScriptElement = void 0;
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
class ScriptElement extends inlinejs_element_1.CustomElement {
    constructor() {
        super({
            isTemplate: true,
            isHidden: true,
        });
        this.script_ = null;
        this.src = '';
    }
    HandleElementScopeDestroyed_(scope) {
        var _a;
        super.HandleElementScopeDestroyed_(scope);
        (_a = this.script_) === null || _a === void 0 ? void 0 : _a.remove();
        this.script_ = null;
    }
    HandlePostAttributesProcessPostfix_() {
        super.HandlePostAttributesProcessPostfix_();
        const content = (this.textContent || '').trim();
        if (!content && !this.src) {
            return;
        }
        const script = document.createElement('script');
        script.type = 'text/javascript';
        if (this.src) {
            script.src = this.src;
        }
        else {
            script.textContent = content;
        }
        document.body.appendChild(script);
        this.script_ = script;
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
