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
exports.AttributeEventElementCompact = exports.AttributeEventElement = void 0;
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
class AttributeEventElement extends inlinejs_element_1.CustomElement {
    constructor() {
        super({
            isTemplate: true,
            isHidden: true,
        });
        this.target = null;
        this.context = null;
        this.type = '';
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), () => {
            const target = (this.target || this.parentElement), type = this.type;
            if (target && type) {
                (Array.isArray(type) ? type : [type]).forEach((t) => target.setAttribute(`on${t}`, (this.textContent || '')));
                scope.AddUninitCallback(() => (Array.isArray(type) ? type : [type]).forEach((t) => target.removeAttribute(`on${t}`)));
            }
            postAttributesCallback && postAttributesCallback();
        });
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'object', checkStoredObject: true })
], AttributeEventElement.prototype, "target", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'object', checkStoredObject: true })
], AttributeEventElement.prototype, "context", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'array', checkStoredObject: true })
], AttributeEventElement.prototype, "type", void 0);
exports.AttributeEventElement = AttributeEventElement;
function AttributeEventElementCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(AttributeEventElement, 'attribute-event');
}
exports.AttributeEventElementCompact = AttributeEventElementCompact;
